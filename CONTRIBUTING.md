# Contributing

Every change goes through a pull request. Nobody pushes to `main`, including the maintainer.

## PR titles

Titles follow Conventional Commits: `type(scope)!: subject`.

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scope and `!` (breaking change) are optional.
- Lowercase subject, no trailing period, at most 72 characters.

Examples: `feat: add login`, `fix(cli): handle empty input`, `feat!: drop node 18`.

The `PR Title` check comments on your PR with what to fix. Edit the title; no new commits are needed.

## Merging

PRs are squash-merged. The commit on `main` is `<PR title> (#N)`, so the title is what ends up in the history. Your branch must be up to date with `main` before it can merge.

## Notes

- Keep PRs focused on one change.
- Workflow runs on a first-time contributor's PR need maintainer approval before they start.
- Coding agents: see [AGENTS.md](AGENTS.md).
