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

| Command      | Description                          |
|--------------|--------------------------------------|
| `/tongas on` | Activate tongas curation mode        |
| `/tongas off`| Deactivate tongas curation mode      |
| `/tongas`    | Show current tongas status           |

## Features

- **Footer status indicator** — When tongas is active, the Pi footer shows a colored `🤖 tongas ON` indicator.
- **Session-persistent state** — Toggle state is stored in session entries and survives forks, branches, and session reloads.
- **Argument completion** — The `/tongas` command provides `on`/`off` completions.

## Files

- `index.ts` — Main extension entry point
- `package.json` — Pi package manifest
