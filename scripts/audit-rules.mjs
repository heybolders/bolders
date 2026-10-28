// Audit de consistență pentru src/ (.claude/rules/styling.md, code-style.md, content.md).
// Rulare: `npm run audit:rules`. Iese cu 1 dacă găsește abateri.
// Excepțiile permise sunt listate în ALLOW și documentate în .claude/rules/styling.md.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const GLOBAL_CSS = "src/styles/global.css";
const ANIMATIONS_DIR = "src/scripts/animations/";
const CODE_EXT = /\.(astro|ts|tsx|mjs|js|css)$/;
const TEMPLATE_DIRS = ["src/components/", "src/layouts/", "src/pages/"];

/**
 * Excepții punctuale, fiecare cu motiv (aceeași listă în .claude/rules/styling.md).
 * `file` + `rule` + `match` (text exact din linie).
 */
const ALLOW = [
  {
    file: "src/layouts/BaseLayout.astro",
    rule: "culoare",
    match: '<meta name="theme-color" content="#0d0d0d" />',
    why: "meta theme-color cere o valoare literală (= --color-ink)",
  },
];

/** Atribute care ajung la utilizator (citite de screen reader sau afișate). */
const TEXT_ATTRS = ["aria-label", "aria-description", "alt", "title", "placeholder", "label"];
const VOID_TAGS = new Set([
  "meta",
  "link",
  "br",
  "hr",
  "img",
  "input",
  "source",
  "area",
  "col",
  "wbr",
  "base",
]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function rel(path) {
  return relative(ROOT, path).split(sep).join("/");
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

/** Înlocuiește comentariile cu spații (păstrează pozițiile, deci și numerele de linie). */
function stripComments(source) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return source
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, lead) => lead + blank(m.slice(lead.length)));
}

/** Partea de template a unui .astro (fără frontmatter), cu offset-ul ei în fișier. */
function astroTemplate(source) {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(source);
  return match
    ? { body: source.slice(match[0].length), offset: match[0].length }
    : { body: source, offset: 0 };
}

/**
 * Texte vizibile scrise direct în markup: noduri text și atribute TEXT_ATTRS cu litere.
 * Tokenizer minimal pentru template-ul Astro: urmărește tagurile, expresiile `{...}` și
 * markup-ul din expresii (`.map(() => (<li>…</li>))`), ca textul din ele să fie verificat și el.
 */
function findHardcodedText(source) {
  const { body, offset } = astroTemplate(source);
  const found = [];
  const report = (index, text) =>
    found.push({ index: offset + index, text: text.trim().slice(0, 60) });
  const hasLetters = (text) => /\p{L}/u.test(text.replace(/&[a-z]+;|&#\d+;/gi, ""));

  // cadre: text (cu adâncimea elementelor deschise) sau expresie (cu adâncimea acoladelor)
  const stack = [{ type: "text", depth: 0, island: false }];
  let text = "";
  let textStart = 0;
  let prevSignificant = "";
  let i = 0;

  const flush = () => {
    if (hasLetters(text)) report(textStart, text);
    text = "";
  };

  const readTag = () => {
    // i e pe "<"; citește până la ">" de pe nivelul 0, sărind ghilimele și acoladele
    const start = i;
    let braces = 0;
    let quote = "";
    for (i += 1; i < body.length; i += 1) {
      const c = body[i];
      if (quote) {
        if (c === quote) quote = "";
      } else if (c === '"' || c === "'" || (braces > 0 && c === "`")) quote = c;
      else if (c === "{") braces += 1;
      else if (c === "}") braces -= 1;
      else if (c === ">" && braces === 0) break;
    }
    i += 1;
    return { raw: body.slice(start, i), start };
  };

  while (i < body.length) {
    const frame = stack[stack.length - 1];
    const c = body[i];

    if (frame.type === "expr") {
      if (c === '"' || c === "'" || c === "`") {
        const end = body.indexOf(c, i + 1);
        i = end === -1 ? body.length : end + 1;
        prevSignificant = c;
        continue;
      }
      if (body.startsWith("/*", i)) {
        i = body.indexOf("*/", i) + 2;
        continue;
      }
      if (c === "{") frame.braces += 1;
      if (c === "}") {
        frame.braces -= 1;
        if (frame.braces === 0) {
          stack.pop();
          i += 1;
          text = "";
          textStart = i;
          continue;
        }
      }
      if (c === "<" && /[A-Za-z>]/.test(body[i + 1] ?? "") && /[(?:&|,>=[]/.test(prevSignificant)) {
        stack.push({ type: "text", depth: 0, island: true });
        continue;
      }
      if (!/\s/.test(c)) prevSignificant = c;
      i += 1;
      continue;
    }

    // cadru text
    if (body.startsWith("<!", i) && !body.startsWith("<!--", i)) {
      // <!doctype html>
      flush();
      i = body.indexOf(">", i) + 1;
      textStart = i;
      continue;
    }
    if (body.startsWith("<!--", i)) {
      flush();
      i = body.indexOf("-->", i) + 3;
      textStart = i;
      continue;
    }
    const raw = /^<(script|style)\b/i.exec(body.slice(i, i + 8));
    if (raw) {
      flush();
      const close = body.indexOf(`</${raw[1]}`, i);
      i = body.indexOf(">", close) + 1;
      textStart = i;
      continue;
    }
    if (c === "{") {
      flush();
      stack.push({ type: "expr", braces: 1 });
      prevSignificant = "{";
      i += 1;
      continue;
    }
    if (c === "<" && /[A-Za-z/>]/.test(body[i + 1] ?? "")) {
      flush();
      const { raw: tag, start } = readTag();
      if (tag.startsWith("</")) {
        frame.depth -= 1;
      } else {
        for (const attr of TEXT_ATTRS) {
          const m = new RegExp(`\\s${attr}="([^"]*)"`).exec(tag);
          if (m && hasLetters(m[1])) report(start + m.index, `${attr}="${m[1]}"`);
        }
        const name = /^<([\w:-]*)/.exec(tag)?.[1]?.toLowerCase() ?? "";
        if (!tag.endsWith("/>") && !VOID_TAGS.has(name)) frame.depth += 1;
      }
      if (frame.island && frame.depth === 0) {
        stack.pop();
        prevSignificant = ">";
      }
      textStart = i;
      continue;
    }
    if (!text) textStart = i;
    text += c;
    i += 1;
  }
  flush();
  return found;
}

const CHECKS = [
  {
    rule: "valoare-arbitrara",
    message: "valoare arbitrară Tailwind (`x-[..]`, `[prop:val]`, `x-(--var)`)",
    applies: (file) => /\.(astro|ts|tsx)$/.test(file) || file === GLOBAL_CSS,
    patterns: [
      /(?<![\w$.])-?[a-z][\w-]*-\[[^\]\s"'`]+\]/g,
      /(?<=[\s"'`])\[[a-z-]+:[^\]\s]+\]/g,
      /\b[a-z][\w-]*-\(--[\w-]+\)/g,
    ],
    code: true,
  },
  {
    rule: "style-inline",
    message: "atribut style inline în markup",
    applies: (file) => file.endsWith(".astro"),
    patterns: [/<[A-Za-z][^>]*?\sstyle\s*=/g],
    code: true,
  },
  {
    rule: "bloc-style",
    message: "bloc <style> în componentă (CSS doar în src/styles/global.css)",
    applies: (file) => file.endsWith(".astro"),
    patterns: [/<style\b/g],
    code: true,
  },
  {
    rule: "culoare",
    message: "culoare hex/rgb/hsl în afara global.css (folosește un token)",
    applies: (file) => file !== GLOBAL_CSS,
    patterns: [
      /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
      /\b(?:rgba?|hsla?|oklch)\(/g,
    ],
    code: true,
  },
  {
    rule: "px",
    message: "valoare în px în afara global.css (folosește tokeni sau rem)",
    applies: (file) => file !== GLOBAL_CSS,
    patterns: [/\b\d*\.?\d+px\b/g],
    code: true,
  },
  {
    rule: "gsap-import",
    message: "GSAP/Lenis importat în afara src/scripts/animations/",
    applies: (file) => !file.startsWith(ANIMATIONS_DIR),
    patterns: [/(?:from\s+|import\s*\(?\s*)["'](?:gsap|lenis)(?:\/[^"']*)?["']/g],
    code: true,
  },
  {
    rule: "import-relativ",
    message: "import relativ (folosește aliasul @/)",
    applies: () => true,
    patterns: [/(?:from\s+|import\s*\(?\s*)["']\.{1,2}\/[^"']*["']/g],
    code: true,
  },
];

const violations = [];
const files = walk(SRC)
  .map((path) => ({ path, file: rel(path) }))
  .filter(({ file }) => CODE_EXT.test(file));

for (const { path, file } of files) {
  const source = readFileSync(path, "utf8");
  const lines = source.split("\n");
  const code = stripComments(source);

  for (const check of CHECKS) {
    if (!check.applies(file)) continue;
    const haystack = check.code ? code : source;
    for (const pattern of check.patterns) {
      for (const m of haystack.matchAll(pattern)) {
        const line = lineAt(haystack, m.index);
        const lineText = lines[line - 1] ?? "";
        const allowed = ALLOW.some(
          (a) => a.file === file && a.rule === check.rule && lineText.includes(a.match),
        );
        if (!allowed)
          violations.push({ file, line, rule: check.rule, message: check.message, snippet: m[0] });
      }
    }
  }

  if (file.endsWith(".astro") && TEMPLATE_DIRS.some((dir) => file.startsWith(dir))) {
    for (const { index, text } of findHardcodedText(source)) {
      violations.push({
        file,
        line: lineAt(source, index),
        rule: "text-hardcodat",
        message: "text vizibil în componentă (mută-l în src/content/)",
        snippet: text,
      });
    }
  }
}

/**
 * global.css: la nivelul de sus doar @import, @theme, @custom-variant și @layer cu nume; orice
 * clasă scrisă de mână trebuie să apară în lista de excepții din .claude/rules/styling.md.
 */
function auditGlobalCss() {
  const source = readFileSync(join(ROOT, GLOBAL_CSS), "utf8");
  const code = stripComments(source);
  const allowedTop = /^@(import|theme|custom-variant|layer\s+[a-z][\w-]*)\b/;
  let depth = 0;
  let start = 0;
  for (let i = 0; i < code.length; i += 1) {
    const c = code[i];
    if (c === "{" || (c === ";" && depth === 0)) {
      if (depth === 0) {
        const head = code.slice(start, i).trim();
        if (head && !allowedTop.test(head)) {
          violations.push({
            file: GLOBAL_CSS,
            line: lineAt(code, start + code.slice(start, i).indexOf(head)),
            rule: "css-in-afara-layer",
            message: "CSS custom în afara unui @layer cu nume",
            snippet: head.split("\n")[0],
          });
        }
      }
      if (c === "{") depth += 1;
      else start = i + 1;
    } else if (c === "}") {
      depth -= 1;
      if (depth === 0) start = i + 1;
    }
  }

  const rules = readFileSync(join(ROOT, ".claude/rules/styling.md"), "utf8");
  const classes = new Set(
    [...code.matchAll(/(?<![\w-])\.([a-z][\w-]*)(?=[\s,:{.[])/g)].map((m) => m[1]),
  );
  for (const name of classes) {
    if (!rules.includes(`\`.${name}\``)) {
      violations.push({
        file: GLOBAL_CSS,
        line: lineAt(code, code.indexOf(`.${name}`)),
        rule: "clasa-nedocumentata",
        message: "clasă CSS custom fără intrare în .claude/rules/styling.md (Excepții)",
        snippet: `.${name}`,
      });
    }
  }
}

auditGlobalCss();

if (violations.length === 0) {
  console.log(`audit:rules: ${files.length} fișiere, 0 abateri.`);
  process.exit(0);
}

for (const v of violations) {
  console.error(`${v.file}:${v.line}  [${v.rule}] ${v.message}\n    ${v.snippet}`);
}
console.error(
  `\naudit:rules: ${violations.length} abateri în ${new Set(violations.map((v) => v.file)).size} fișiere.`,
);
process.exit(1);
