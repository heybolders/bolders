/*
 * Fumul WebGL de pe toată pagina (ANIMATIONS.md „fluid”, DESIGN.md §10). Port TypeScript, redus la ce
 * folosește site-ul, din WebGL-Fluid-Simulation de Pavel Dobryakov:
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation (commit a2d2929, script.js). Configurația și culoarea
 * sunt cele din splash-effect-8.js de pe site-ul original. Vezi și THIRD_PARTY_NOTICES.md.
 *
 * MIT License
 *
 * Copyright (c) 2017 Pavel Dobryakov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Textura de blue noise pentru dithering-ul bloom-ului, aceeași ca în repo-ul upstream și în original
import ditheringUrl from "@/assets/fluid/LDR_LLL1_0.png?url";

// ── Parametri (măsurați pe original, DESIGN.md §10) ────────────────────────────────────────────────────

/** config din splash-effect-8.js. CURL = 0 în original: pașii curl/vorticity nu se mai rulează. */
const SIM = {
  densityDissipation: 4,
  velocityDissipation: 2.87,
  pressure: 0.43,
  pressureIterations: 20,
  splatRadius: 0.1,
  splatForce: 5000,
  bloomIterations: 8,
  bloomResolution: 256,
  bloomIntensity: 0.1,
  bloomThreshold: 0.6,
  bloomSoftKnee: 0.7,
  sunraysResolution: 196,
  sunraysWeight: 0.7,
} as const;

/** Constantele shader-ului de sunrays din upstream, folosite și la calculul pragului de „fum stins”. */
const SUNRAYS_SHADER = { iterations: 16, density: 0.3, decay: 0.95, exposure: 0.7 } as const;

interface Quality {
  sim: number;
  dye: number;
  /** plafonul devicePixelRatio pentru canvas */
  dpr: number;
}

/**
 * Nivelul 0 e cel normal; nivelul 1 e treapta adaptivă (o singură scădere, vezi FPS_PROBE).
 * Originalul: sim 128 / dye 1024 pe desktop, dye 512 pe mobil, DPR complet.
 */
const QUALITY = {
  desktop: [
    { sim: 128, dye: 1024, dpr: 2 },
    { sim: 64, dye: 512, dpr: 1 },
  ],
  mobile: [
    { sim: 96, dye: 512, dpr: 1.5 },
    { sim: 64, dye: 256, dpr: 1 },
  ],
} as const satisfies Record<string, readonly [Quality, Quality]>;

/** Explozia de la pornire din original: 5–24 splat-uri aleatoare, culoarea × 10. */
const INITIAL_SPLATS = { min: 5, spread: 20, colorBoost: 10, velocity: 1000 } as const;

/** Pasul maxim de simulare (originalul: 0.016666 s), deci sub 60 fps simularea încetinește, nu explodează. */
const MAX_DT = 0.016666;
const RESIZE_DEBOUNCE_MS = 200;

/**
 * „Constant sub 45 fps în primele secunde de interacțiune”: 3 ferestre de 1 s, toate sub prag. Pauzele
 * (buclă oprită, tab ascuns) nu intră în măsurare; primele cadre după pornire încălzesc shader-ele.
 */
const FPS_PROBE = { target: 45, windowMs: 1000, windows: 3, warmupFrames: 10, gapMs: 250 } as const;

/** Variabilele din @theme static (global.css): culoarea fumului și intensitatea cu care intră în dye. */
const COLOR_TOKEN = "--color-fluid";
const INTENSITY_TOKEN = "--fluid-intensity";

/**
 * Pragul sub care fumul nu se mai vede: jumătate de nivel de culoare pe 8 biți, împărțit la amplificarea
 * sunrays-ului acolo unde nu e fum (masca = 1, deci exposure × (1 + weight × Σ decay^i)).
 */
const RESTING_SUNRAYS_GAIN =
  SUNRAYS_SHADER.exposure *
  (1 +
    (SIM.sunraysWeight * (1 - SUNRAYS_SHADER.decay ** SUNRAYS_SHADER.iterations)) /
      (1 - SUNRAYS_SHADER.decay));
const VISIBLE_LEVEL = 0.5 / 255;

// ── Tipuri ─────────────────────────────────────────────────────────────────────────────────────────────

type GL = WebGLRenderingContext | WebGL2RenderingContext;

interface Format {
  internalFormat: number;
  format: number;
}

interface Formats {
  rgba: Format;
  rg: Format;
  r: Format;
  halfFloat: number;
  linear: boolean;
}

interface Fbo {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
}

interface DoubleFbo {
  read: Fbo;
  write: Fbo;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Pointer {
  x: number;
  y: number;
  dx: number;
  dy: number;
  moved: boolean;
  /** atingerea s-a terminat; se șterge după ultimul splat */
  released: boolean;
}

interface Programs {
  copy: Program;
  clear: Program;
  smooth: Program;
  bloomPrefilter: Program;
  bloomBlur: Program;
  bloomFinal: Program;
  sunraysMask: Program;
  sunrays: Program;
  splat: Program;
  advection: Program;
  divergence: Program;
  pressure: Program;
  gradientSubtract: Program;
  display: Program;
}

interface Targets {
  dye: DoubleFbo;
  velocity: DoubleFbo;
  divergence: Fbo;
  pressure: DoubleFbo;
  bloom: Fbo;
  bloomLevels: Fbo[];
  sunrays: Fbo;
  sunraysTemp: Fbo;
}

interface Features {
  shading: boolean;
  bloom: boolean;
  sunrays: boolean;
}

export interface FluidOptions {
  /** FPS-ul nu s-a recuperat nici după scăderea rezoluției: efectul se oprește pentru sesiune. */
  onGiveUp: () => void;
  /**
   * Profilul mobil (rezoluție redusă), reevaluat la resize. Vine din loader: fluid.ts nu importă nimic din
   * chunk-ul principal, deci import()-ul nu mai aduce helper-ul de preload al Vite în bundle-ul inițial.
   */
  isMobile: () => boolean;
}

class FluidError extends Error {}

function must<T>(value: T | null, what: string): T {
  if (value === null) throw new FluidError(what);
  return value;
}

// ── Shader-e (upstream, neschimbate în afară de constantele injectate) ─────────────────────────────────

const BASE_VERTEX = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const SMOOTH_VERTEX = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    float offset = 1.33333333;
    vL = vUv - texelSize * offset;
    vR = vUv + texelSize * offset;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const SMOOTH = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  uniform sampler2D uTexture;

  void main () {
    vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
    sum += texture2D(uTexture, vL) * 0.35294117;
    sum += texture2D(uTexture, vR) * 0.35294117;
    gl_FragColor = sum;
  }
`;

const COPY = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;

  void main () {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`;

const CLEAR = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const DISPLAY = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform sampler2D uBloom;
  uniform sampler2D uSunrays;
  uniform sampler2D uDithering;
  uniform vec2 ditherScale;
  uniform vec2 texelSize;

  vec3 linearToGamma (vec3 color) {
    color = max(color, vec3(0));
    return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
  }

  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;

  #ifdef SHADING
    vec3 lc = texture2D(uTexture, vL).rgb;
    vec3 rc = texture2D(uTexture, vR).rgb;
    vec3 tc = texture2D(uTexture, vT).rgb;
    vec3 bc = texture2D(uTexture, vB).rgb;

    float dx = length(rc) - length(lc);
    float dy = length(tc) - length(bc);

    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    vec3 l = vec3(0.0, 0.0, 1.0);

    float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
    c *= diffuse;
  #endif

  #ifdef BLOOM
    vec3 bloom = texture2D(uBloom, vUv).rgb;
  #endif

  #ifdef SUNRAYS
    float sunrays = texture2D(uSunrays, vUv).r;
    c *= sunrays;
  #ifdef BLOOM
    bloom *= sunrays;
  #endif
  #endif

  #ifdef BLOOM
    float noise = texture2D(uDithering, vUv * ditherScale).r;
    noise = noise * 2.0 - 1.0;
    bloom += noise / 255.0;
    bloom = linearToGamma(bloom);
    c += bloom;
  #endif

    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
  }
`;

const BLOOM_PREFILTER = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec3 curve;
  uniform float threshold;

  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float br = max(c.r, max(c.g, c.b));
    float rq = clamp(br - curve.x, 0.0, curve.y);
    rq = curve.z * rq * rq;
    c *= max(rq, br - threshold) / max(br, 0.0001);
    gl_FragColor = vec4(c, 0.0);
  }
`;

const BLOOM_BLUR = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;

  void main () {
    vec4 sum = vec4(0.0);
    sum += texture2D(uTexture, vL);
    sum += texture2D(uTexture, vR);
    sum += texture2D(uTexture, vT);
    sum += texture2D(uTexture, vB);
    sum *= 0.25;
    gl_FragColor = sum;
  }
`;

const BLOOM_FINAL = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform float intensity;

  void main () {
    vec4 sum = vec4(0.0);
    sum += texture2D(uTexture, vL);
    sum += texture2D(uTexture, vR);
    sum += texture2D(uTexture, vT);
    sum += texture2D(uTexture, vB);
    sum *= 0.25;
    gl_FragColor = sum * intensity;
  }
`;

const SUNRAYS_MASK = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main () {
    vec4 c = texture2D(uTexture, vUv);
    float br = max(c.r, max(c.g, c.b));
    c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
    gl_FragColor = c;
  }
`;

const glslFloat = (value: number): string =>
  Number.isInteger(value) ? value.toFixed(1) : `${value}`;

const SUNRAYS = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float weight;

  #define ITERATIONS ${SUNRAYS_SHADER.iterations}

  void main () {
    float Density = ${glslFloat(SUNRAYS_SHADER.density)};
    float Decay = ${glslFloat(SUNRAYS_SHADER.decay)};
    float Exposure = ${glslFloat(SUNRAYS_SHADER.exposure)};

    vec2 coord = vUv;
    vec2 dir = vUv - 0.5;

    dir *= 1.0 / float(ITERATIONS) * Density;
    float illuminationDecay = 1.0;

    float color = texture2D(uTexture, vUv).a;

    for (int i = 0; i < ITERATIONS; i++) {
      coord -= dir;
      float col = texture2D(uTexture, coord).a;
      color += col * illuminationDecay * weight;
      illuminationDecay *= Decay;
    }

    gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
  }
`;

const SPLAT = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;

  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;

    vec2 iuv = floor(st);
    vec2 fuv = fract(st);

    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }

  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const DIVERGENCE = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;

    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const PRESSURE = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// ── WebGL: context, formate, programe ──────────────────────────────────────────────────────────────────

const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  depth: false,
  stencil: false,
  antialias: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
};

/** COMPLETION_STATUS_KHR (KHR_parallel_shader_compile): starea compilării fără să blocheze firul principal. */
const COMPLETION_STATUS = 0x91b1;

function supportsRenderFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
): boolean {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  // upstream lasă texturile de test alocate; aici se eliberează imediat
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return ok;
}

/** R16F → RG16F → RGBA16F, ca în upstream: primul format randabil pe dispozitiv. */
function pickFormat(gl: GL, wanted: Format, type: number): Format | null {
  if (supportsRenderFormat(gl, wanted.internalFormat, wanted.format, type)) return wanted;
  if (!(gl instanceof WebGL2RenderingContext)) return null;
  if (wanted.internalFormat === gl.R16F)
    return pickFormat(gl, { internalFormat: gl.RG16F, format: gl.RG }, type);
  if (wanted.internalFormat === gl.RG16F)
    return pickFormat(gl, { internalFormat: gl.RGBA16F, format: gl.RGBA }, type);
  return null;
}

function detectFormats(gl: GL): Formats | null {
  if (gl instanceof WebGL2RenderingContext) {
    gl.getExtension("EXT_color_buffer_float");
    const linear = gl.getExtension("OES_texture_float_linear") !== null;
    const type = gl.HALF_FLOAT;
    const rgba = pickFormat(gl, { internalFormat: gl.RGBA16F, format: gl.RGBA }, type);
    const rg = pickFormat(gl, { internalFormat: gl.RG16F, format: gl.RG }, type);
    const r = pickFormat(gl, { internalFormat: gl.R16F, format: gl.RED }, type);
    return rgba && rg && r ? { rgba, rg, r, halfFloat: type, linear } : null;
  }
  const halfFloat = gl.getExtension("OES_texture_half_float");
  if (!halfFloat) return null;
  const linear = gl.getExtension("OES_texture_half_float_linear") !== null;
  const type = halfFloat.HALF_FLOAT_OES;
  const rgba = pickFormat(gl, { internalFormat: gl.RGBA, format: gl.RGBA }, type);
  return rgba ? { rgba, rg: rgba, r: rgba, halfFloat: type, linear } : null;
}

function compileShader(
  gl: GL,
  type: number,
  source: string,
  keywords: readonly string[] = [],
): WebGLShader {
  const shader = must(gl.createShader(type), "createShader");
  const defines = keywords.map((keyword) => `#define ${keyword}\n`).join("");
  gl.shaderSource(shader, defines + source);
  gl.compileShader(shader);
  return shader;
}

class Program {
  readonly program: WebGLProgram;
  private readonly uniforms = new Map<string, WebGLUniformLocation>();

  constructor(
    private readonly gl: GL,
    vertex: WebGLShader,
    fragment: WebGLShader,
  ) {
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, fragment);
    // upstream se bazează pe faptul că singurul atribut primește locația 0; aici e fixată explicit
    gl.bindAttribLocation(this.program, 0, "aPosition");
    gl.linkProgram(this.program);
  }

  /** Fără KHR_parallel_shader_compile, citirea stării blochează până se termină compilarea. */
  isSettled(parallel: boolean): boolean {
    return !parallel || this.gl.getProgramParameter(this.program, COMPLETION_STATUS) === true;
  }

  finalize(): void {
    const { gl, program } = this;
    if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
      throw new FluidError(gl.getProgramInfoLog(program) ?? "linkProgram");
    }
    const count = Number(gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS));
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const location = gl.getUniformLocation(program, info.name);
      if (location) this.uniforms.set(info.name, location);
    }
  }

  bind(): void {
    this.gl.useProgram(this.program);
  }

  u(name: string): WebGLUniformLocation | null {
    return this.uniforms.get(name) ?? null;
  }
}

/** Cedează firul principal între etapele inițializării, ca să nu apară long tasks. */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function readColorToken(): Rgb | null {
  const style = getComputedStyle(document.documentElement);
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
    style.getPropertyValue(COLOR_TOKEN).trim(),
  );
  const intensity = Number.parseFloat(style.getPropertyValue(INTENSITY_TOKEN));
  if (!match || Number.isNaN(intensity)) return null;
  const [, r = "0", g = "0", b = "0"] = match;
  const channel = (hex: string): number => (Number.parseInt(hex, 16) / 255) * intensity;
  return { r: channel(r), g: channel(g), b: channel(b) };
}

// ── Simularea ──────────────────────────────────────────────────────────────────────────────────────────

class FluidSimulation {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: GL;
  private readonly color: Rgb;
  private readonly dither = new Image();

  private formats: Formats | null = null;
  private features: Features = { shading: true, bloom: true, sunrays: true };
  private programs: Programs | null = null;
  private targets: Targets | null = null;
  private ditherTexture: WebGLTexture | null = null;
  private ready = false;
  private disposed = false;

  private level: 0 | 1 = 0;
  private raf = 0;
  private lastFrame = 0;
  private resizeTimer = 0;
  /** Limita superioară a intensității dye-ului (toate splat-urile în același punct, apoi disipare). */
  private peak = 0;
  private pendingBurst = true;

  private readonly mouse: Pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, released: false };
  private mouseInside = false;
  private readonly touches = new Map<number, Pointer>();

  private probe = { frames: 0, windowStart: 0, lowWindows: 0, done: false };

  constructor(
    private readonly host: HTMLElement,
    private readonly options: FluidOptions,
    color: Rgb,
  ) {
    this.color = color;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.className = "pointer-events-none block size-full";
    const gl =
      this.canvas.getContext("webgl2", CONTEXT_ATTRIBUTES) ??
      this.canvas.getContext("webgl", CONTEXT_ATTRIBUTES);
    this.gl = must(gl, "getContext");
  }

  async start(): Promise<void> {
    this.host.append(this.canvas);
    this.resizeCanvas();
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
    this.dither.addEventListener("load", this.onDitherLoad);
    this.dither.src = ditheringUrl;
    await this.build();
    if (this.disposed) return;

    const passive = { passive: true } as const;
    window.addEventListener("pointermove", this.onPointerMove, passive);
    document.addEventListener("pointerout", this.onPointerOut, passive);
    // touch, nu pointer events: pointercancel ar opri fumul exact când începe scroll-ul nativ
    window.addEventListener("touchstart", this.onTouchStart, passive);
    window.addEventListener("touchmove", this.onTouchMove, passive);
    window.addEventListener("touchend", this.onTouchEnd, passive);
    window.addEventListener("touchcancel", this.onTouchEnd, passive);
    window.addEventListener("resize", this.onResize, passive);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.wake();
  }

  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.ready = false;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerout", this.onPointerOut);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    window.removeEventListener("touchcancel", this.onTouchEnd);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.dither.removeEventListener("load", this.onDitherLoad);
    this.dither.src = "";
    // eliberează memoria GPU imediat, fără să aștepte garbage collector-ul
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.remove();
  }

  // ── inițializare, în etape care cedează firul principal ──

  private get alive(): boolean {
    return !this.disposed && !this.gl.isContextLost();
  }

  private async build(): Promise<void> {
    const { gl } = this;
    this.ready = false;
    const formats = detectFormats(gl);
    if (!formats) throw new FluidError("formate half-float nerandabile");
    this.formats = formats;
    // fără filtrare liniară, upstream renunță la shading, bloom și sunrays și coboară dye-ul la 512
    this.features = { shading: formats.linear, bloom: formats.linear, sunrays: formats.linear };

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    await yieldToMain();
    if (!this.alive) return;

    const programs = this.createPrograms();
    const list = Object.values(programs);
    const parallel = gl.getExtension("KHR_parallel_shader_compile") !== null;
    // cu extensia: se așteaptă compilarea în fundal; fără ea, câte un program per task
    for (const program of list) {
      while (!program.isSettled(parallel)) {
        await yieldToMain();
        if (!this.alive) return;
      }
      program.finalize();
      if (!parallel) {
        await yieldToMain();
        if (!this.alive) return;
      }
    }
    this.programs = programs;

    this.ditherTexture = this.createDitherTexture();
    this.allocateTargets();
    await yieldToMain();
    if (!this.alive) return;

    this.ready = true;
  }

  private createPrograms(): Programs {
    const { gl } = this;
    const { shading, bloom, sunrays } = this.features;
    const vertex = compileShader(gl, gl.VERTEX_SHADER, BASE_VERTEX);
    const smoothVertex = compileShader(gl, gl.VERTEX_SHADER, SMOOTH_VERTEX);
    const fragment = (source: string, keywords?: readonly string[]): WebGLShader =>
      compileShader(gl, gl.FRAGMENT_SHADER, source, keywords);
    const program = (source: string, keywords?: readonly string[]): Program =>
      new Program(gl, vertex, fragment(source, keywords));
    const displayKeywords = [
      ...(shading ? ["SHADING"] : []),
      ...(bloom ? ["BLOOM"] : []),
      ...(sunrays ? ["SUNRAYS"] : []),
    ];

    return {
      copy: program(COPY),
      clear: program(CLEAR),
      smooth: new Program(gl, smoothVertex, fragment(SMOOTH)),
      bloomPrefilter: program(BLOOM_PREFILTER),
      bloomBlur: program(BLOOM_BLUR),
      bloomFinal: program(BLOOM_FINAL),
      sunraysMask: program(SUNRAYS_MASK),
      sunrays: program(SUNRAYS),
      splat: program(SPLAT),
      advection: program(ADVECTION, this.formats?.linear ? [] : ["MANUAL_FILTERING"]),
      divergence: program(DIVERGENCE),
      pressure: program(PRESSURE),
      gradientSubtract: program(GRADIENT_SUBTRACT),
      display: program(DISPLAY, displayKeywords),
    };
  }

  private createDitherTexture(): WebGLTexture {
    const { gl } = this;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    if (this.dither.complete && this.dither.naturalWidth > 0) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.dither);
    } else {
      // până se încarcă imaginea: un pixel alb, ca în upstream
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        1,
        1,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255]),
      );
    }
    return texture;
  }

  private readonly onDitherLoad = (): void => {
    if (!this.ditherTexture || !this.alive) return;
    const { gl } = this;
    gl.bindTexture(gl.TEXTURE_2D, this.ditherTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.dither);
    this.wake();
  };

  // ── framebuffers ──

  private quality(): Quality {
    return QUALITY[this.options.isMobile() ? "mobile" : "desktop"][this.level];
  }

  private resolution(base: number): { width: number; height: number } {
    const { drawingBufferWidth: w, drawingBufferHeight: h } = this.gl;
    const aspect = w > h ? w / h : h / w;
    const short = Math.round(base);
    const long = Math.round(base * aspect);
    return w > h ? { width: long, height: short } : { width: short, height: long };
  }

  private createFbo(width: number, height: number, format: Format, sampling: number): Fbo {
    const { gl } = this;
    const halfFloat = this.formats?.halfFloat ?? gl.UNSIGNED_BYTE;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, sampling);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, sampling);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format.internalFormat,
      width,
      height,
      0,
      format.format,
      halfFloat,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, fbo, width, height, texelX: 1 / width, texelY: 1 / height };
  }

  private deleteFbo(target: Fbo): void {
    this.gl.deleteFramebuffer(target.fbo);
    this.gl.deleteTexture(target.texture);
  }

  private createDoubleFbo(
    width: number,
    height: number,
    format: Format,
    sampling: number,
  ): DoubleFbo {
    return {
      read: this.createFbo(width, height, format, sampling),
      write: this.createFbo(width, height, format, sampling),
    };
  }

  /** Păstrează conținutul (fumul nu dispare la resize), ca resizeDoubleFBO din upstream. */
  private resizeDoubleFbo(
    target: DoubleFbo,
    width: number,
    height: number,
    format: Format,
    sampling: number,
  ): DoubleFbo {
    if (target.read.width === width && target.read.height === height) return target;
    const read = this.createFbo(width, height, format, sampling);
    if (this.programs) {
      this.programs.copy.bind();
      this.gl.uniform1i(this.programs.copy.u("uTexture"), this.attach(target.read, 0));
      this.blit(read);
    }
    this.deleteFbo(target.read);
    this.deleteFbo(target.write);
    return { read, write: this.createFbo(width, height, format, sampling) };
  }

  private allocateTargets(): void {
    const { gl, formats } = this;
    if (!formats) return;
    const quality = this.quality();
    const sim = this.resolution(quality.sim);
    const dye = this.resolution(formats.linear ? quality.dye : Math.min(quality.dye, 512));
    const sampling = formats.linear ? gl.LINEAR : gl.NEAREST;
    const old = this.targets;
    gl.disable(gl.BLEND);

    if (old) {
      for (const target of [
        old.divergence,
        old.bloom,
        old.sunrays,
        old.sunraysTemp,
        ...old.bloomLevels,
      ]) {
        this.deleteFbo(target);
      }
      for (const target of [old.pressure.read, old.pressure.write]) this.deleteFbo(target);
    }

    const bloomBase = this.resolution(SIM.bloomResolution);
    const bloomLevels: Fbo[] = [];
    for (let i = 0; i < SIM.bloomIterations; i++) {
      const width = bloomBase.width >> (i + 1);
      const height = bloomBase.height >> (i + 1);
      if (width < 2 || height < 2) break;
      bloomLevels.push(this.createFbo(width, height, formats.rgba, sampling));
    }
    const sunrays = this.resolution(SIM.sunraysResolution);

    this.targets = {
      dye: old
        ? this.resizeDoubleFbo(old.dye, dye.width, dye.height, formats.rgba, sampling)
        : this.createDoubleFbo(dye.width, dye.height, formats.rgba, sampling),
      velocity: old
        ? this.resizeDoubleFbo(old.velocity, sim.width, sim.height, formats.rg, sampling)
        : this.createDoubleFbo(sim.width, sim.height, formats.rg, sampling),
      divergence: this.createFbo(sim.width, sim.height, formats.r, gl.NEAREST),
      pressure: this.createDoubleFbo(sim.width, sim.height, formats.r, gl.NEAREST),
      bloom: this.createFbo(bloomBase.width, bloomBase.height, formats.rgba, sampling),
      bloomLevels,
      sunrays: this.createFbo(sunrays.width, sunrays.height, formats.r, sampling),
      sunraysTemp: this.createFbo(sunrays.width, sunrays.height, formats.r, sampling),
    };
  }

  /** Dimensiunea canvas-ului în pixeli fizici; false dacă nu s-a schimbat (fără realocare). */
  private resizeCanvas(): boolean {
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality().dpr);
    const width = Math.max(1, Math.floor(this.host.clientWidth * dpr));
    const height = Math.max(1, Math.floor(this.host.clientHeight * dpr));
    if (this.canvas.width === width && this.canvas.height === height) return false;
    this.canvas.width = width;
    this.canvas.height = height;
    return true;
  }

  private readonly onResize = (): void => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (!this.ready || !this.resizeCanvas()) return;
      this.allocateTargets();
      this.wake();
    }, RESIZE_DEBOUNCE_MS);
  };

  // ── bucla ──

  private wake(): void {
    if (!this.ready || this.raf !== 0 || document.hidden) return;
    this.lastFrame = performance.now();
    this.probe.frames = 0;
    this.probe.windowStart = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    this.raf = 0;
    if (!this.ready || !this.programs || !this.targets) return;
    const interval = now - this.lastFrame;
    const dt = Math.min(interval / 1000, MAX_DT);
    this.lastFrame = now;

    if (this.pendingBurst) {
      this.pendingBurst = false;
      this.initialBurst();
    }
    this.applyInputs();
    this.step(dt, this.programs, this.targets);
    this.render(this.programs, this.targets);

    if (this.measureFps(now, interval)) return;
    // fumul s-a stins și nu mai vine nimic: ultimul cadru rămâne pe ecran (doar granulația), bucla se oprește
    const gain = this.features.sunrays ? RESTING_SUNRAYS_GAIN : 1;
    if (this.peak * gain < VISIBLE_LEVEL && !this.hasPendingInput()) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private hasPendingInput(): boolean {
    if (this.mouse.moved) return true;
    for (const touch of this.touches.values()) if (touch.moved) return true;
    return false;
  }

  /** true dacă efectul s-a oprit (FPS prea mic și după scăderea rezoluției). */
  private measureFps(now: number, interval: number): boolean {
    const { probe } = this;
    if (probe.done) return false;
    if (interval > FPS_PROBE.gapMs) {
      probe.frames = 0;
      probe.windowStart = 0;
      return false;
    }
    probe.frames++;
    if (probe.frames === FPS_PROBE.warmupFrames) probe.windowStart = now;
    if (probe.windowStart === 0 || now - probe.windowStart < FPS_PROBE.windowMs) return false;

    const fps = ((probe.frames - FPS_PROBE.warmupFrames) * 1000) / (now - probe.windowStart);
    probe.frames = FPS_PROBE.warmupFrames;
    probe.windowStart = now;
    if (fps >= FPS_PROBE.target) {
      probe.done = true;
      return false;
    }
    probe.lowWindows++;
    if (probe.lowWindows < FPS_PROBE.windows) return false;

    if (this.level === 0) {
      this.level = 1;
      this.probe = { frames: 0, windowStart: 0, lowWindows: 0, done: false };
      this.resizeCanvas();
      this.allocateTargets();
      return false;
    }
    this.options.onGiveUp();
    return true;
  }

  // ── intrări ──

  private press(pointer: Pointer, clientX: number, clientY: number): void {
    pointer.x = clientX / this.canvas.clientWidth;
    pointer.y = 1 - clientY / this.canvas.clientHeight;
    pointer.dx = 0;
    pointer.dy = 0;
    pointer.moved = false;
  }

  private move(pointer: Pointer, clientX: number, clientY: number): void {
    const x = clientX / this.canvas.clientWidth;
    const y = 1 - clientY / this.canvas.clientHeight;
    const aspect = this.canvas.width / this.canvas.height;
    let dx = x - pointer.x;
    let dy = y - pointer.y;
    if (aspect < 1) dx *= aspect;
    if (aspect > 1) dy /= aspect;
    pointer.x = x;
    pointer.y = y;
    pointer.dx = dx;
    pointer.dy = dy;
    pointer.moved = dx !== 0 || dy !== 0;
    if (pointer.moved) this.wake();
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    // ca în original, mouse-ul lasă fum fără click; prima mișcare doar fixează poziția
    if (this.mouseInside) this.move(this.mouse, event.clientX, event.clientY);
    else this.press(this.mouse, event.clientX, event.clientY);
    this.mouseInside = true;
  };

  /** relatedTarget null = mouse-ul a ieșit din fereastră: la revenire nu se trage o dâră de la margine. */
  private readonly onPointerOut = (event: PointerEvent): void => {
    if (event.relatedTarget === null) this.mouseInside = false;
  };

  private readonly onTouchStart = (event: TouchEvent): void => {
    for (const touch of event.changedTouches) {
      const pointer: Pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, released: false };
      this.press(pointer, touch.clientX, touch.clientY);
      this.touches.set(touch.identifier, pointer);
    }
  };

  private readonly onTouchMove = (event: TouchEvent): void => {
    for (const touch of event.changedTouches) {
      const pointer = this.touches.get(touch.identifier);
      if (pointer) this.move(pointer, touch.clientX, touch.clientY);
    }
  };

  private readonly onTouchEnd = (event: TouchEvent): void => {
    for (const touch of event.changedTouches) {
      const pointer = this.touches.get(touch.identifier);
      // ultima mișcare încă neaplicată se mai desenează o dată, în cadrul următor (applyInputs)
      if (pointer?.moved) pointer.released = true;
      else this.touches.delete(touch.identifier);
    }
  };

  private applyInputs(): void {
    const splatPointer = (pointer: Pointer): void => {
      if (!pointer.moved) return;
      pointer.moved = false;
      this.splat(
        pointer.x,
        pointer.y,
        pointer.dx * SIM.splatForce,
        pointer.dy * SIM.splatForce,
        this.color,
      );
    };
    splatPointer(this.mouse);
    for (const [id, touch] of this.touches) {
      splatPointer(touch);
      if (touch.released) this.touches.delete(id);
    }
  }

  private initialBurst(): void {
    const count = INITIAL_SPLATS.min + Math.floor(Math.random() * INITIAL_SPLATS.spread);
    const boost = INITIAL_SPLATS.colorBoost;
    const color = { r: this.color.r * boost, g: this.color.g * boost, b: this.color.b * boost };
    for (let i = 0; i < count; i++) {
      const vx = INITIAL_SPLATS.velocity * (Math.random() - 0.5);
      const vy = INITIAL_SPLATS.velocity * (Math.random() - 0.5);
      this.splat(Math.random(), Math.random(), vx, vy, color);
    }
  }

  // ── pașii simulării (upstream: step, render, splat, applyBloom, applySunrays, blur) ──

  private attach(target: Fbo, unit: number): number {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    return unit;
  }

  private blit(target: Fbo | null): void {
    const { gl } = this;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  private swap(target: DoubleFbo): void {
    const { read } = target;
    target.read = target.write;
    target.write = read;
  }

  private splat(x: number, y: number, dx: number, dy: number, color: Rgb): void {
    const { gl, programs, targets } = this;
    if (!programs || !targets) return;
    const { splat } = programs;
    const aspect = this.canvas.width / this.canvas.height;
    const radius = (SIM.splatRadius / 100) * (aspect > 1 ? aspect : 1);
    splat.bind();
    gl.uniform1i(splat.u("uTarget"), this.attach(targets.velocity.read, 0));
    gl.uniform1f(splat.u("aspectRatio"), aspect);
    gl.uniform2f(splat.u("point"), x, y);
    gl.uniform3f(splat.u("color"), dx, dy, 0);
    gl.uniform1f(splat.u("radius"), radius);
    this.blit(targets.velocity.write);
    this.swap(targets.velocity);

    gl.uniform1i(splat.u("uTarget"), this.attach(targets.dye.read, 0));
    gl.uniform3f(splat.u("color"), color.r, color.g, color.b);
    this.blit(targets.dye.write);
    this.swap(targets.dye);
    this.peak += Math.max(color.r, color.g, color.b);
  }

  private step(dt: number, programs: Programs, targets: Targets): void {
    const { gl, formats } = this;
    const { velocity, dye, pressure, divergence } = targets;
    gl.disable(gl.BLEND);

    const { divergence: divergenceProgram } = programs;
    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.u("texelSize"), velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(divergenceProgram.u("uVelocity"), this.attach(velocity.read, 0));
    this.blit(divergence);

    programs.clear.bind();
    gl.uniform1i(programs.clear.u("uTexture"), this.attach(pressure.read, 0));
    gl.uniform1f(programs.clear.u("value"), SIM.pressure);
    this.blit(pressure.write);
    this.swap(pressure);

    const { pressure: pressureProgram } = programs;
    pressureProgram.bind();
    gl.uniform2f(pressureProgram.u("texelSize"), velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(pressureProgram.u("uDivergence"), this.attach(divergence, 0));
    for (let i = 0; i < SIM.pressureIterations; i++) {
      gl.uniform1i(pressureProgram.u("uPressure"), this.attach(pressure.read, 1));
      this.blit(pressure.write);
      this.swap(pressure);
    }

    const { gradientSubtract } = programs;
    gradientSubtract.bind();
    gl.uniform2f(gradientSubtract.u("texelSize"), velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(gradientSubtract.u("uPressure"), this.attach(pressure.read, 0));
    gl.uniform1i(gradientSubtract.u("uVelocity"), this.attach(velocity.read, 1));
    this.blit(velocity.write);
    this.swap(velocity);

    const { advection } = programs;
    advection.bind();
    gl.uniform2f(advection.u("texelSize"), velocity.read.texelX, velocity.read.texelY);
    if (!formats?.linear) {
      gl.uniform2f(advection.u("dyeTexelSize"), velocity.read.texelX, velocity.read.texelY);
    }
    const velocityUnit = this.attach(velocity.read, 0);
    gl.uniform1i(advection.u("uVelocity"), velocityUnit);
    gl.uniform1i(advection.u("uSource"), velocityUnit);
    gl.uniform1f(advection.u("dt"), dt);
    gl.uniform1f(advection.u("dissipation"), SIM.velocityDissipation);
    this.blit(velocity.write);
    this.swap(velocity);

    if (!formats?.linear) {
      gl.uniform2f(advection.u("dyeTexelSize"), dye.read.texelX, dye.read.texelY);
    }
    gl.uniform1i(advection.u("uVelocity"), this.attach(velocity.read, 0));
    gl.uniform1i(advection.u("uSource"), this.attach(dye.read, 1));
    gl.uniform1f(advection.u("dissipation"), SIM.densityDissipation);
    this.blit(dye.write);
    this.swap(dye);
    this.peak /= 1 + SIM.densityDissipation * dt;
  }

  private render(programs: Programs, targets: Targets): void {
    const { gl, features } = this;
    if (features.bloom) this.applyBloom(programs, targets);
    if (features.sunrays) {
      this.applySunrays(programs, targets);
      this.smooth(programs, targets.sunrays, targets.sunraysTemp);
    }

    // canvas transparent peste bg-ink: același rezultat ca BACK_COLOR #0d0d0d + blending-ul din original
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const { display } = programs;
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    display.bind();
    if (features.shading) gl.uniform2f(display.u("texelSize"), 1 / width, 1 / height);
    gl.uniform1i(display.u("uTexture"), this.attach(targets.dye.read, 0));
    if (features.bloom && this.ditherTexture) {
      gl.uniform1i(display.u("uBloom"), this.attach(targets.bloom, 1));
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.ditherTexture);
      gl.uniform1i(display.u("uDithering"), 2);
      const size = this.dither.naturalWidth || 1;
      gl.uniform2f(
        display.u("ditherScale"),
        width / size,
        height / (this.dither.naturalHeight || 1),
      );
    }
    if (features.sunrays) gl.uniform1i(display.u("uSunrays"), this.attach(targets.sunrays, 3));
    this.blit(null);
  }

  private applyBloom(programs: Programs, targets: Targets): void {
    const { gl } = this;
    const { bloomLevels, bloom, dye } = targets;
    if (bloomLevels.length < 2) return;
    let last = bloom;
    gl.disable(gl.BLEND);

    const { bloomPrefilter, bloomBlur, bloomFinal } = programs;
    bloomPrefilter.bind();
    const knee = SIM.bloomThreshold * SIM.bloomSoftKnee + 0.0001;
    gl.uniform3f(bloomPrefilter.u("curve"), SIM.bloomThreshold - knee, knee * 2, 0.25 / knee);
    gl.uniform1f(bloomPrefilter.u("threshold"), SIM.bloomThreshold);
    gl.uniform1i(bloomPrefilter.u("uTexture"), this.attach(dye.read, 0));
    this.blit(last);

    bloomBlur.bind();
    for (const level of bloomLevels) {
      gl.uniform2f(bloomBlur.u("texelSize"), last.texelX, last.texelY);
      gl.uniform1i(bloomBlur.u("uTexture"), this.attach(last, 0));
      this.blit(level);
      last = level;
    }

    gl.blendFunc(gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);
    for (let i = bloomLevels.length - 2; i >= 0; i--) {
      const level = bloomLevels[i];
      if (!level) continue;
      gl.uniform2f(bloomBlur.u("texelSize"), last.texelX, last.texelY);
      gl.uniform1i(bloomBlur.u("uTexture"), this.attach(last, 0));
      this.blit(level);
      last = level;
    }

    gl.disable(gl.BLEND);
    bloomFinal.bind();
    gl.uniform2f(bloomFinal.u("texelSize"), last.texelX, last.texelY);
    gl.uniform1i(bloomFinal.u("uTexture"), this.attach(last, 0));
    gl.uniform1f(bloomFinal.u("intensity"), SIM.bloomIntensity);
    this.blit(bloom);
  }

  private applySunrays(programs: Programs, targets: Targets): void {
    const { gl } = this;
    const { sunraysMask, sunrays } = programs;
    gl.disable(gl.BLEND);
    sunraysMask.bind();
    gl.uniform1i(sunraysMask.u("uTexture"), this.attach(targets.dye.read, 0));
    this.blit(targets.dye.write);
    sunrays.bind();
    gl.uniform1f(sunrays.u("weight"), SIM.sunraysWeight);
    gl.uniform1i(sunrays.u("uTexture"), this.attach(targets.dye.write, 0));
    this.blit(targets.sunrays);
  }

  /** blur-ul separabil din upstream, o iterație, pe textura de sunrays. */
  private smooth(programs: Programs, target: Fbo, temp: Fbo): void {
    const { gl } = this;
    const { smooth } = programs;
    smooth.bind();
    gl.uniform2f(smooth.u("texelSize"), target.texelX, 0);
    gl.uniform1i(smooth.u("uTexture"), this.attach(target, 0));
    this.blit(temp);
    gl.uniform2f(smooth.u("texelSize"), 0, target.texelY);
    gl.uniform1i(smooth.u("uTexture"), this.attach(temp, 0));
    this.blit(target);
  }

  // ── context pierdut, tab ascuns ──

  private readonly onContextLost = (event: Event): void => {
    // fără preventDefault, browserul nu mai restaurează contextul
    event.preventDefault();
    this.ready = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.programs = null;
    this.targets = null;
    this.ditherTexture = null;
  };

  private readonly onContextRestored = (): void => {
    this.peak = 0;
    this.build()
      .then(() => {
        this.wake();
      })
      .catch(() => {
        this.options.onGiveUp();
      });
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else if (this.peak > 0) {
      this.wake();
    }
  };
}

/**
 * Pornește fumul în `host` (elementul persistent din Fluid.astro). Întoarce funcția de oprire, care scoate
 * canvas-ul, ascultătorii și contextul WebGL. Orice eșec (formate nesuportate, shader-e) lasă pagina fără
 * canvas și fără erori în consolă.
 */
export function startFluid(host: HTMLElement, options: FluidOptions): () => void {
  const color = readColorToken();
  if (!color) {
    if (import.meta.env.DEV)
      console.warn(`[fluid] ${COLOR_TOKEN} / ${INTENSITY_TOKEN} lipsesc din @theme`);
    return () => undefined;
  }
  let simulation: FluidSimulation;
  try {
    simulation = new FluidSimulation(host, options, color);
  } catch {
    return () => undefined;
  }
  simulation.start().catch((error: unknown) => {
    if (import.meta.env.DEV) console.warn("[fluid] oprit:", error);
    simulation.destroy();
  });
  return () => {
    simulation.destroy();
  };
}
