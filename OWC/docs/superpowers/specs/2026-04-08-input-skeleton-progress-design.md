# Design Spec: o-input, o-skeleton, o-progress

**Date:** 2026-04-08
**Status:** Approved

---

## Overview

Add three new UI components to the OWC library and demo them on owc.oun-y.com. Also change the demo page body text color from `#f0fff4` to `#fff`.

| Component | Tag | Purpose |
|-----------|-----|---------|
| Text input | `o-input` | Glassmorphic text input with static label and validation states |
| Skeleton loader | `o-skeleton` | Pulsing placeholder for loading states |
| Page progress bar | `o-progress` | Top-of-page loading bar |

---

## Architecture

Each component lives in its own TypeScript file under `OWC/src/`, following the established pattern (`tooltip.ts`, `dropdown.ts`, `tabs.ts`). All extend `GlassElement` and use `glassBaseStyles()`.

| Action | Path |
|--------|------|
| Create | `OWC/src/input.ts` |
| Create | `OWC/src/input.test.ts` |
| Create | `OWC/src/skeleton.ts` |
| Create | `OWC/src/skeleton.test.ts` |
| Create | `OWC/src/progress.ts` |
| Create | `OWC/src/progress.test.ts` |
| Modify | `OWC/src/index.ts` — import + export new components |
| Rebuild | `OWC/dist/components.js` — via `bun run build:cdn` |
| Modify | `ai-projects/owc/index.html` — update CDN SHA, add demos, fix text color |

All paths relative to `/home/brouwnie/Documents/Github/`.

---

## Component: o-input

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | — | Static label rendered above the input |
| `placeholder` | string | — | Input placeholder text |
| `type` | string | `text` | Input type: `text`, `password`, `email`, `number` |
| `name` | string | — | Form field name |
| `value` | string | `''` | Current value |
| `disabled` | boolean | false | Disables the input |
| `error` | string | — | Error message shown below input; red border applied |
| `success` | boolean | false | Green border applied; no message |

### Properties

- `.value` — getter/setter for current input value

### Events

| Event | Detail | When |
|-------|--------|------|
| `o-input` | `{ value: string }` | Every keystroke |
| `o-change` | `{ value: string }` | On blur |

### Visual

- Static label above the input (same pattern as `o-note`)
- Glassmorphic input field using `--glass-bg`, `--glass-border`, `--glass-text`
- Default state: neutral glass border
- Focus state: highlighted border (`--accent-warm`)
- Error state: red border (`rgba(239,68,68,0.7)`) + red error message below
- Success state: green border (`rgba(74,222,128,0.7)`)
- Disabled state: reduced opacity, `not-allowed` cursor

### Custom Element Registration

```ts
customElements.define('o-input', OInput)
```

---

## Component: o-skeleton

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `block \| table \| panel` | `block` | Skeleton layout preset |
| `width` | string | `100%` | Width (block variant only) |
| `height` | string | `1em` | Height (block variant only) |
| `radius` | string | `6px` | Border-radius (block variant only) |
| `rows` | number | `5` | Number of body rows (table variant only) |

### Variants

**`block`** (default) — a single pulsing rectangle, sized by `width`/`height`/`radius`.

**`table`** — renders a full table skeleton matching `o-table`'s visual footprint:
- One header row with 4 column placeholders
- `rows` body rows (default 5), each with varying-width cells to look natural
- No attributes other than `rows` needed

**`panel`** — renders a panel skeleton matching `o-panel`'s visual footprint:
- A wider title placeholder
- Two narrower content line placeholders below
- No attributes other than `variant` needed

### Animation

CSS keyframe pulse animation: opacity oscillates between `0.4` and `0.9` over 1.4s, `ease-in-out`, infinite. No JS required.

### No events, no JS API — purely visual.

### Usage Examples

```html
<!-- While o-table data is fetching -->
<o-skeleton variant="table" rows="6"></o-skeleton>

<!-- While o-panel content is fetching -->
<o-skeleton variant="panel"></o-skeleton>

<!-- Custom block -->
<o-skeleton width="200px" height="40px"></o-skeleton>
```

---

## Component: o-progress

### Positioning

Fixed to the top of the page (position: fixed, top: 0, left: 0, z-index: 9999), 3px tall, full width. Added to the page with one tag — no manual CSS needed.

### Attribute API

| Attribute | Type | Description |
|-----------|------|-------------|
| `value` | number (0–100) | Sets bar width directly. Setting to `100` triggers auto-hide after 400ms. |

### Static Method API (programmatic)

Exposed on the `OProgress` class (also as `window.OProgress` for CDN use):

| Method | Description |
|--------|-------------|
| `OProgress.start()` | Begins auto-increment animation (slow, indeterminate feel). Safe to call multiple times. |
| `OProgress.set(n)` | Jumps to value `n` (0–100). |
| `OProgress.done()` | Shoots to 100%, then fades out after 400ms. |

### Behavior

- Only one instance is active at a time; `start()` on an already-running bar continues from current position
- The bar uses `transition: width 0.2s ease` for smooth movement
- Auto-increment in `start()` mode: increments by a random small amount every 300ms, slows as it approaches 90% (never reaches 100% automatically — `done()` must be called)
- On `done()` / `value="100"`: width animates to 100%, then the element fades out (`opacity: 0`) and resets after 400ms

### Visual

- Green-tinted glass bar: `background: rgba(74,222,128,0.85)`
- Subtle glow: `box-shadow: 0 0 8px rgba(74,222,128,0.5)`
- Sits above everything (`z-index: 9999`)

### Usage

```html
<o-progress></o-progress>

<script>
// Programmatic
OProgress.start()
OProgress.set(60)
OProgress.done()

// Attribute-driven
document.querySelector('o-progress').setAttribute('value', '75')
</script>
```

---

## Demo Page Changes

1. **Text color**: change `color: #f0fff4` → `color: #fff` on `body`
2. **New nav links**: `o-input · o-skeleton · o-progress`
3. **Component count stat**: update to 14
4. **New demo sections** (added after o-tabs, before Combined):
   - `o-input`: neutral, error, success, disabled states side by side; code snippet
   - `o-skeleton`: block, panel, and table variants with a "Simulate load" button that hides the skeleton and shows real content after 2s
   - `o-progress`: buttons to call `OProgress.start()`, `OProgress.set(50)`, `OProgress.done()`; also show value attribute demo

---

## Testing

Each component gets a `*.test.ts` file using Vitest + happy-dom, following the existing test pattern.

**o-input tests:**
- Renders label when `label` attribute set
- Fires `o-input` on keystroke
- Fires `o-change` on blur
- Shows error message and red border when `error` attribute set
- Shows green border when `success` attribute set
- Disabled input is not interactive

**o-skeleton tests:**
- Block variant renders with correct width/height/radius
- Table variant renders correct number of rows
- Panel variant renders title + content lines

**o-progress tests:**
- `value` attribute sets bar width
- `OProgress.start()` begins auto-increment
- `OProgress.done()` sets value to 100 and resets
- `OProgress.set(n)` sets value directly

---

## Release

After implementation:
1. Run `bun run build:cdn` to rebuild `OWC/dist/components.js`
2. Commit with message `release: v1.3.0 — add o-input, o-skeleton, o-progress`
3. Tag `v1.3.0`
4. Update CDN SHA in `ai-projects/owc/index.html`
5. Commit demo page changes and push
6. Trigger Dokploy redeploy
