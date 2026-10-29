# Project: Gamers
Early-stage repo — no code or stack chosen yet. When the stack lands, fill in Commands
and Conventions below and delete this line. Keep this file under ~100 lines; move
procedures into `.claude/skills/` and topic rules into `.claude/rules/`.

## Commands
- Install: TBD
- Dev: TBD
- Test one file: TBD
- Check (typecheck + lint + tests) before every commit: run the `verify` skill

## Conventions
- IMPORTANT: never commit secrets; `.env*` and `secrets/` are blocked by hooks and deny rules.
- Put shared, reusable game logic apart from UI/rendering so it can be unit-tested.

## Workflow
- Plan first (plan mode, or `/plan-feature`) for anything touching more than 2 files.
- Write or update a failing test before fixing a bug.
- Conventional commits (`feat:`, `fix:`, `chore:`…); one logical change per commit (`/commit`).
- After a code change, have the `code-reviewer` subagent review the diff.

## Gotchas
- Cloud sessions are ephemeral: anything not committed and pushed is lost.

## More context
- Git workflow: @.claude/rules/git.md
