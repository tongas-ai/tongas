# tongas

A curated agent experience focusing on human-agent socratic collaboration

## Usage

```bash
# Install as a local package
pi install ./
```

Or load directly for development:

```bash
pi --extension ./index.ts
```

## Commands

| Command       | Description                     |
| ------------- | ------------------------------- |
| `/tongas on`  | Activate tongas curation mode   |
| `/tongas off` | Deactivate tongas curation mode |
| `/tongas`     | Show current tongas status      |

## Features

- **Footer status indicator** — When tongas is active, the Pi footer shows a colored `🤖 tongas ON` indicator.
- **Session-persistent state** — Toggle state is stored in session entries and survives forks, branches, and session reloads.
- **Argument completion** — The `/tongas` command provides `on`/`off` completions.

## Files

- `index.ts` — Main extension entry point
- `package.json` — Pi package manifest

## Releasing

Versioning is automated with [release-please](https://github.com/googleapis/release-please). Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `feat!:` / `BREAKING CHANGE:`, `chore:`, …) when merging to `main`. release-please keeps a release PR open that bumps `package.json`, updates `CHANGELOG.md`, and creates a GitHub release + `vX.Y.Z` tag when merged.

While the version is `< 1.0.0`, breaking changes bump the minor version and features bump the patch version.
