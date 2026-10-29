#!/usr/bin/env bash
# PostToolUse (Edit|Write): format the edited file with whatever formatter the repo has.
# Never blocks: formatting is best-effort, so every failure exits 0.
file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] || [ ! -f "$file" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0

has() { command -v "$1" >/dev/null 2>&1; }

case "$file" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css|*.scss|*.html|*.md|*.yml|*.yaml)
    [ -x node_modules/.bin/prettier ] && node_modules/.bin/prettier --write "$file" >/dev/null 2>&1 ;;
  *.py)
    if has ruff; then ruff format "$file" >/dev/null 2>&1
    elif has black; then black -q "$file" >/dev/null 2>&1; fi ;;
  *.go)  has gofmt && gofmt -w "$file" >/dev/null 2>&1 ;;
  *.rs)  has rustfmt && rustfmt "$file" >/dev/null 2>&1 ;;
  *.cs)  has dotnet && dotnet format whitespace --include "$file" >/dev/null 2>&1 ;;
  *.gd)  has gdformat && gdformat "$file" >/dev/null 2>&1 ;;
esac
exit 0
