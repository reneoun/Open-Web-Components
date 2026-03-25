# o-toggle Design Spec

**Date:** 2026-03-25
**Component:** `<o-toggle>`
**Goal:** Glassmorphism segmented toggle for single-select from 2+ options, with sliding pill indicator.

---

## Architecture

Single `src/toggle.ts`. Shadow DOM. Same pattern as `table.ts`. Exported from `src/index.ts`, demoed in `index.html`.

`:host { display: inline-flex }` so the component participates in flex/grid layouts naturally.

---

## Types

```ts
export interface OToggleOption {
  label: string
  value: string
}

export interface OToggleChangeEvent {
  value: string
  index: number
  prev: string | null
}
```

---

## API

### Option input

Options are resolved using this priority (highest wins):

1. **JS `options` property** — highest priority. If `_options` has been set (non-empty) before or after connect, it is always used.
2. **Child elements** — checked in `connectedCallback` **only if `_options` is still empty at that point**. `querySelectorAll` direct children with a `value` attribute. Read once; no `MutationObserver`. Works for static markup. Does not work when children are appended after `connectedCallback` has run.
3. **`options` attribute** — fallback. Parsed at `connectedCallback` if neither of the above yielded options, and via `attributeChangedCallback`.

String inputs (attribute or JS string array) are converted to `OToggleOption` by lowercasing for `value` and preserving original casing for `label`.

### `observedAttributes`

Both `options` and `value` are in `observedAttributes`. `attributeChangedCallback` re-parses and re-renders for `options`; updates selection silently (no event) for `value`.

### Value

- `value` attribute/property: gets or sets the currently selected option value.
- Defaults to the first option on initial render if not set.
- Initialization (first render) does **not** fire `o-change`.
- Setting `value` to an unknown string: silently no-ops (selection unchanged).

### Changing options after render

When `options` property or attribute is updated after initial render:
- Re-render with the new option set.
- If the current `value` exists in the new set, preserve it.
- If not, reset `value` to the first option of the new set.
- No `o-change` event fires during this reset.

### Edge cases

- **0 options:** render nothing (empty container), no-op on interactions.
- **1 option:** render single non-interactive segment; no `o-change` ever fires.

### Event

`o-change` fires on user-initiated selection change only (bubbles, composed):
```ts
detail: { value: string; index: number; prev: string | null }
```
`prev` is `null` only if there was no previous selection (not possible in normal flow since value always defaults to first option, but kept nullable for safety).

---

## Visual Design

- **`:host`:** `display: inline-flex`
- **Container:** `display: inline-flex`, `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.2)`, `backdrop-filter: blur(10px)`, `border-radius: 999px`, `padding: 3px`, `position: relative`, `user-select: none`
- **Segments:** equal width (`flex: 1`), `min-width: 48px`, `padding: 6px 14px`, `text-align: center`, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`, `cursor: pointer`, `position: relative`, `z-index: 1`; selected segment gets `font-weight: 600`
- **Sliding indicator:** `<div class="indicator">` absolutely positioned inside container, same height as container (minus padding), `background: rgba(255,255,255,0.25)`, `border-radius: 999px`, `z-index: 0`, `transition: transform 0.2s ease`. Position is set via CSS custom property: `--indicator-offset: calc(index * (100% / N))` on the container, and the indicator uses `transform: translateX(var(--indicator-offset))` and `width: calc(100% / N)`. This avoids `offsetWidth` entirely and works in JSDOM (no layout required).
- **Click detection:** click listener attached **once in the constructor** (not on each `render()`). Resolve clicked segment by iterating `querySelectorAll('.segment')` and checking `el.contains(e.target as Node)`. No-op if clicked segment equals current value. No `offsetX` math.
- **`value` property reflects to attribute:** setting the JS `value` property also calls `this.setAttribute('value', v)` so `el.getAttribute('value')` stays in sync.
- **Keyboard:** out of scope for v1. No `tabindex`, `role`, or `aria-*` attributes.
- **`prev` after silent options-change reset:** when `value` resets silently during an options update, `this._value` is updated to the new first option. Subsequent user clicks use this new value as `prev`.
- **Cleanup:** the single container click listener is attached once in the constructor and never removed (no `disconnectedCallback` needed).

---

## File Map

| Action | Path |
|---|---|
| Create | `src/toggle.ts` |
| Create | `src/toggle.test.ts` |
| Modify | `src/index.ts` |
| Modify | `index.html` |

---

## Tests

- Registers as `o-toggle`
- Renders correct number of segments from `options` attribute
- Renders from JS `options` string array
- Renders from JS `options` `{label, value}` object array
- Reads options from child elements at connectedCallback
- Defaults `value` to first option (no event fired)
- `value` property reflects current selection
- Setting `value` property updates selection without firing `o-change`
- Setting `value` to unknown string: no-op
- Clicking a segment fires `o-change` with `{ value, index, prev }`
- Clicking already-selected segment does not fire `o-change`
- Changing `options` after render: value preserved if exists in new set
- Changing `options` after render: value resets to first if old value not in new set
- `options` attribute change via `setAttribute` re-renders
- `value` attribute change via `setAttribute` updates selection silently
- 0 options: renders empty, no error
- 1 option: renders single segment, no `o-change` on click
