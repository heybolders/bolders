#!/usr/bin/env bash
# PostToolUse (Edit|Write): Prettier + ESLint --fix pe fișierul modificat, apoi astro check.
# Exit 2 trimite erorile înapoi la Claude.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??"")}catch{}})')
[ -z "$file" ] || [ ! -f "$file" ] && exit 0

case "$file" in
  */node_modules/*|*/dist/*|*/.astro/*|*/reference/*) exit 0 ;;
esac

case "$file" in
  *.astro|*.ts|*.tsx|*.mjs|*.js|*.css|*.json)
    npx --no-install prettier --write --ignore-unknown "$file" >/dev/null 2>&1
    ;;
esac

errors=""
case "$file" in
  *.astro|*.ts|*.tsx|*.mjs|*.js)
    if ! out=$(npx --no-install eslint --fix --no-warn-ignored "$file" 2>&1); then
      errors+="ESLint ($file):"$'\n'"$out"$'\n'
    fi
    ;;
esac

case "$file" in
  *.astro|*.ts|*.tsx|*.mjs|*.css|*/tsconfig.json|*/astro.config.*)
    if ! out=$(npx --no-install astro check 2>&1); then
      errors+="astro check:"$'\n'"$(printf '%s\n' "$out" | grep -E 'error|Result|- [0-9]+ errors' | tail -20)"$'\n'
    fi
    ;;
esac

if [ -n "$errors" ]; then
  printf '%s' "$errors" >&2
  exit 2
fi
exit 0
