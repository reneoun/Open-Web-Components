# o-toggle Design Spec

**Date:** 2026-03-25
**Component:** `<o-toggle>`
**Goal:** Glassmorphism segmented toggle for single-select from 2+ options, with sliding pill indicator.

---

## Architecture

Single `src/toggle.ts`. Shadow DOM. Same pattern as `table.ts` and `toast.ts`. Exported from `src/index.ts`, demoed in `index.html`.

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

### Option input (priority order: child elements > JS property > attribute)

| Method | Example |
|---|---|
| `options` attribute | `<o-toggle options="Day,Week,Month">` |
| `options` JS property | `el.options = ['Day', 'Week', 'Month']` or `[{ label, value }]` |
| Child elements | `<o-toggle><span value="day">Day</span>…</o-toggle>` |

When strings are passed (attribute or JS), `value` is lowercased label, `label` is the original string.

### Value

- `value` attribute/property: gets or sets the currently selected option value
- Defaults to the first option if not set

### Event

`o-change` fires on every selection change (bubbles, composed):
```ts
detail: { value: string; index: number; prev: string | null }
```

---

## Visual Design

- **Container:** pill shape, `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.2)`, `backdrop-filter: blur(10px)`, `display: inline-flex`, `border-radius: 999px`, `padding: 3px`
- **Segments:** equal width, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`, `user-select: none`, `cursor: pointer`; selected segment gets `font-weight: 600`
- **Sliding indicator:** absolutely positioned `<div class="indicator">`, `background: rgba(255,255,255,0.25)`, `border-radius: 999px`, moves via `transform: translateX(index * segmentWidth)`, `transition: transform 0.2s ease`
- Click detection on container, segment resolved by `Math.floor(offsetX / segmentWidth)`

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
- Renders from JS `options` property (strings)
- Renders from JS `options` property (`{label, value}` objects)
- Reads options from child `<span>` elements
- Defaults `value` to first option
- `value` property reflects current selection
- Setting `value` property updates selection without firing event
- Clicking a segment fires `o-change` with `{ value, index, prev }`
- Clicking already-selected segment does not fire `o-change`
