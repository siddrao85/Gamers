---
name: verify
description: Run this repo's build, typecheck, lint and tests and report pass/fail. Use before every commit, after finishing a change, or when asked to verify or check the work.
---

Run every check the repo has and report the result.

1. Detect the tooling from what exists in the repo root:
   - `package.json` → the `check`, `typecheck`, `lint`, `test` scripts that exist (use the lockfile's package manager)
   - `pyproject.toml` / `requirements*.txt` → `ruff check .`, `mypy` if configured, `pytest`
   - `Cargo.toml` → `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`
   - `go.mod` → `go vet ./...`, `go test ./...`
   - `*.csproj` / `*.sln` → `dotnet build`, `dotnet test`
   - `project.godot` → run GUT/gdUnit tests if present
2. Run them; delegate long or noisy test runs to the `test-runner` subagent.
3. Report one line per check (pass/fail) and, for failures, the exact error with file:line.
4. If no checks exist yet, say so and suggest adding them — do not report "verified".

When the repo's commands are settled, replace step 1 with the exact commands.
