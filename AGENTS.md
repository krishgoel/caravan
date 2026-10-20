# Agent rules

## Branches and merging

- Never push to `main`. Every change is a pull request from a branch. Direct pushes are blocked for everyone, admins included.
- Merge method is squash only. The commit on `main` is exactly `<PR title> (#N)` with an empty body, so the PR title is the history.
- Merging requires the branch to be up to date with `main`. If it is behind, run `gh pr update-branch <n>` and wait for checks.
- Do not add `Co-authored-by` or any other attribution trailers to commits in this repo.

## PR titles

Format: `type(scope)!: subject` (Conventional Commits).

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scope is optional: lowercase letters, digits and hyphens.
- `!` is optional and marks a breaking change.
- Exactly one space after the colon. Subject starts lowercase and has no trailing period.
- At most 72 characters in total, to leave room for ` (#123)`.

Examples: `feat: add login`, `fix(cli): handle empty input`, `feat!: drop node 18`.

If the `PR Title` check fails, read the comment it posts on the PR and fix the title with `gh pr edit <n> --title "..."`. Do not push commits for it. The check re-runs on title edits.

## CI checks

- Each check is its own workflow with its own job.
- To make a check required, add its job name to `.github/rulesets/main.json` and re-apply the ruleset: `gh api -X PUT repos/krishgoel/caravan/rulesets/<id> --input .github/rulesets/main.json`. Optional checks are simply not listed.
- Required checks must not use workflow-level `paths:`, `paths-ignore:` or `branches` filters. A required check that never reports blocks the PR forever. Skip inside the job instead.
- Pin third-party actions to a full commit SHA, with the version in a trailing comment.
