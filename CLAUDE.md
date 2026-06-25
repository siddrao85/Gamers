# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Current State of the Repository

> **This repository is currently empty.** As of the last update to this file,
> the only tracked content is an empty `README.md` and this `CLAUDE.md`. There
> is no source code, build configuration, dependency manifest, or test suite
> yet.

What this means in practice:

- There is no language, framework, build tool, or package manager established.
  Do **not** assume one (e.g. Node, Python, Go) — confirm with the user before
  scaffolding a stack.
- There are no scripts to run, tests to execute, or linters to invoke yet.
- When real code is added, **this file should be updated** to describe the
  actual structure, workflows, and conventions (see "Maintaining This File"
  below).

The repository is named **Gamers** (`siddrao85/gamers`), which suggests a
gaming-related project, but the intended scope, platform, and tech stack have
not yet been defined in the code. Ask the user for direction rather than
guessing.

## Repository Layout

```
.
├── README.md     # Currently empty — project description goes here
└── CLAUDE.md     # This file — guidance for AI assistants
```

## Git Workflow and Conventions

- **Default branch:** `main`
- **Do not commit directly to `main`.** Create a feature branch, commit there,
  and push that branch. Open a pull request only when the user explicitly asks
  for one.
- **Branch naming:** Use descriptive, kebab-case branch names. Claude Code web
  sessions use the `claude/<short-description>` prefix (e.g.
  `claude/claude-md-docs-xtt4r7`).
- **Commits:** Write clear, imperative-mood commit messages that explain the
  intent of the change (e.g. "Add player matchmaking service"), not just what
  changed.
- **Pushing:** Push feature branches with `git push -u origin <branch-name>`.
  Retry transient network failures with exponential backoff; never force-push a
  shared branch without explicit permission.

## Development Workflow (to be established)

Once a tech stack is chosen, document the concrete commands here. Until then,
the expected lifecycle is:

1. Confirm the intended language/framework and project goals with the user.
2. Scaffold the project (dependency manifest, directory structure, tooling).
3. Add build, test, lint, and run commands — and record them in this file.
4. Fill in `README.md` with a real project description and setup instructions.

Placeholders to replace once tooling exists:

| Task   | Command            |
| ------ | ------------------ |
| Install| _not yet defined_  |
| Build  | _not yet defined_  |
| Run    | _not yet defined_  |
| Test   | _not yet defined_  |
| Lint   | _not yet defined_  |

## Conventions for AI Assistants

- **Be honest about the empty state.** Don't fabricate architecture,
  dependencies, or commands that don't exist. If asked to do work that requires
  a stack that hasn't been chosen, ask first.
- **Keep changes scoped and minimal.** Match whatever conventions get
  established as the codebase grows.
- **Update documentation alongside code.** Any meaningful structural change
  should be reflected in both `README.md` and this file.
- **Don't create a pull request unless explicitly asked.**

## Maintaining This File

This file is only useful if it stays accurate. Update it whenever:

- A language, framework, or build tool is introduced.
- The directory structure changes meaningfully.
- Build, test, run, or lint commands are added or changed.
- New conventions (code style, testing approach, architecture) are adopted.

When the codebase has real content, replace the "Current State" section above
with a genuine overview: architecture, key modules, data flow, and the
day-to-day developer workflow.
