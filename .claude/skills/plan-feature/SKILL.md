---
name: plan-feature
description: Interview the user, read the relevant code, and write an implementation plan to docs/plans/<feature>.md, then stop for approval. Use when the user wants to plan a new feature or any change touching more than 2 files.
argument-hint: [feature-name]
disable-model-invocation: true
---

Plan the feature: $ARGUMENTS

1. Ask the user 3–6 focused questions about goals, constraints, edge cases and what "done" means. Wait for answers.
2. Read the code the feature touches (use an Explore subagent for broad searches). Do not edit any code.
3. Write `docs/plans/<feature-name>.md` with:
   - Goal and non-goals
   - Approach, and alternatives you rejected and why
   - Files to create/change
   - Step-by-step tasks, each small enough for one commit
   - Test plan: which tests prove it works
   - Risks and open questions
4. Stop. Summarise the plan in a few lines and ask for approval before writing any code.
