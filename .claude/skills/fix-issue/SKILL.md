---
name: fix-issue
description: Read a GitHub issue, reproduce it with a failing test, fix it, run checks and commit. Use when the user asks to fix issue #<n>.
argument-hint: [issue-number]
disable-model-invocation: true
---

Fix GitHub issue #$ARGUMENTS.

1. Read the issue (GitHub MCP tools, or `gh issue view $ARGUMENTS` where available), including comments.
2. Find the relevant code. State a hypothesis for the root cause.
3. Write a test that fails because of the bug. Run it and confirm it fails for the right reason.
4. Make the smallest fix that makes the test pass. Do not refactor unrelated code.
5. Run the `verify` skill and fix anything it reports.
6. Commit with `fix: <summary> (#$ARGUMENTS)` and explain the root cause in the body.
