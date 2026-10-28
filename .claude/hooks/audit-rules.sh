#!/usr/bin/env bash
# PostToolUse (Edit|Write): npm run audit:rules când se modifică ceva din src/ (.claude/rules/styling.md, „Audit”).
# Exit 2 trimite abaterile înapoi la Claude.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??"")}catch{}})')

case "$file" in
  */src/*|*/.claude/rules/styling.md|*/scripts/audit-rules.mjs) ;;
  *) exit 0 ;;
esac

if ! out=$(node scripts/audit-rules.mjs 2>&1); then
  printf 'audit:rules:\n%s\n' "$out" >&2
  exit 2
fi
exit 0
