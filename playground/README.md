# Catala Playground

Interactive code editor for learning Catala, integrated into the book.

## Components

- **`index.html`** - Standalone playground at `/playground/index.html`
- **`learn.html`** - Dual-pane view: book chapter (left) + playground (right)
- **`exercises.json`** - Maps chapters to checkpoint files in `/examples/`

## Book Integration

1. `playground-button.js` (in book's `additional-js`) shows a floating "Try Tutorial" button on chapters with exercises
2. Button links to `/playground/learn.html?chapter=X&bookBase=/en`
3. Checkpoint files load from `/examples/` via relative URLs

## Dev Workflow

From the repository root:

```bash
# Full build + serve (auto-fetches interpreter and grammar if missing)
make dev
# Playground: http://localhost:8000/playground/index.html
# Tutorial:   http://localhost:8000/playground/learn.html
```

The build runs `scripts/integrate-playground.sh` which copies playground files, examples, and creates symlinks for language directories. If the interpreter is missing locally, it is automatically fetched from the CDN.

For faster iteration when only playground JS/CSS changed (skips full book rebuild):

```bash
./scripts/integrate-playground.sh book/site
# then re-open http://localhost:8000/playground/index.html (server keeps running)
```


## Dependencies

- `catala_web_interpreter.js` - JSOO-compiled interpreter (symlink to catala repo build output, or auto-fetched from CDN)
- Monaco editor - CDN with local fallback in `node_modules/`

## URL Parameters

Hash parameters for `index.html` (e.g., `#lang=fr&codeUrl=...`):

| Parameter | Description |
|-----------|-------------|
| `lang` | UI language: `en` (default) or `fr` |
| `codeUrl` | URL to load initial code from |
| `solutionUrl` | URL for solution (shows "Show solution" button) |
| `checkpointId` | Storage key + enables reset button |
| `persist` | Set to `false` to disable localStorage |

## Persistence

- Standalone: `catala-playground-{lang}` (separate per language)
- Exercises: `catala-learn-{checkpointId}`

## Playground Development

```bash
cd playground
npm install
npm run typecheck  # JSDoc-based type checking
npm run lint       # Unused export detection
```

Integration tests require Playwright:
```bash
npx playwright install chromium
node scripts/integration-test.cjs
```
