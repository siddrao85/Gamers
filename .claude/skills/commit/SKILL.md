---
name: commit
description: Run checks, then write a conventional commit from the staged/working diff. Use when the user asks to commit.
disable-model-invocation: true
---

Current state:
!`git status --short`

!`git diff HEAD --stat`

1. Run the `verify` skill. If anything fails, fix it or stop and report — never commit red.
2. Review the full diff (`git diff HEAD`). If it holds more than one logical change, split it into separate commits.
3. Make sure no secrets, `.env` files, debug prints or stray files are included.
4. Write a conventional commit message: `type(scope): imperative summary` (≤72 chars), blank line, body explaining *why*.
5. Commit. Push only if the user asked.
