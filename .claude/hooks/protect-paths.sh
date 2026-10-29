#!/usr/bin/env bash
# PreToolUse (Edit|Write): block writes to secrets, git internals and lockfiles.
# Exit 2 blocks the tool call and sends stderr back to Claude.
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0

rel="${file#"${CLAUDE_PROJECT_DIR:-$PWD}"/}"
base=$(basename "$rel")

case "$base" in
  .env.example) exit 0 ;;
  .env|.env.*|*.pem|*.key|id_rsa*)
    echo "Blocked: $rel looks like a secret. Ask the user to edit it themselves." >&2; exit 2 ;;
  package-lock.json|pnpm-lock.yaml|yarn.lock|poetry.lock|Cargo.lock|uv.lock)
    echo "Blocked: $rel is a lockfile. Regenerate it with the package manager instead." >&2; exit 2 ;;
esac

case "$rel" in
  .git/*|secrets/*|*/secrets/*)
    echo "Blocked: $rel is a protected path." >&2; exit 2 ;;
esac

exit 0
