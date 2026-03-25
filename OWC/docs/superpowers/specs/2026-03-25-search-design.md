# o-search Design Spec

**Date:** 2026-03-25
**Component:** `<o-search>`
**Goal:** Glassmorphism search bar with built-in filtering, optional dropdown, and custom item rendering.

---

## Architecture

Single `src/search.ts`. Shadow DOM. Same pattern as `table.ts` and `toggle.ts`. Exported from `src/index.ts`, demoed in `index.html`.

Dropdown is a `<div class="dropdown">` inside the shadow root. A single `document` click listener (attached in `connectedCallback`, removed in `disconnectedCallback`) closes the dropdown on click-outside.

`:host { display: block }` so the component participates in block layouts.

---

## Types

```ts
export interface OSearchInputEvent   { query: string }
export interface OSearchResultsEvent { query: string; results: unknown[] }
export interface OSearchSelectEvent  { item: unknown; query: string }
```

---

## API

### Attributes

| Attribute | Type | Description |
|---|---|---|
| `placeholder` | string | Input placeholder text. Default: `'Search…'` |
| `value-key` | string | Field name written to input on item select |
| `no-dropdown` | boolean (presence) | Suppresses dropdown rendering entirely |

All attributes are also readable/settable as JS properties: `placeholder`, `valueKey`, `noDropdown`.

### JS Properties (set only, no attribute reflection)

| Property | Type | Description |
|---|---|---|
| `data` | `unknown[]` | The full dataset to filter |
| `searchKeys` | `string[]` | Keys to match query against (required for default filter) |
| `renderItem` | `(item: unknown) => string` | Returns HTML string for each dropdown item |
| `filterFn` | `(query: string, item: unknown) => boolean` | Optional — overrides default substring filter |

### `observedAttributes`

`['placeholder', 'value-key', 'no-dropdown']`

`attributeChangedCallback` re-renders for all three.

### Default filter

When `filterFn` is not set: case-insensitive substring match of `query` against `String(item[key])` for each key in `searchKeys`. An item matches if ANY key matches.

### Dropdown visibility rules

Dropdown is shown when ALL of the following are true:
1. `no-dropdown` attribute is absent
2. `renderItem` is set
3. Query is non-empty
4. Results array is non-empty (or show "No results" item when empty query produces no match — see below)

"No results" item: when query is non-empty and filtered results are empty, show a single non-interactive item with text `"No results"`.

Dropdown closes when:
- An item is clicked (selection)
- User clicks outside the component (`document` click listener)
- Input is cleared (query becomes empty)

### Events

All events bubble and are composed.

| Event | Detail | When |
|---|---|---|
| `o-input` | `{ query }` | Every keystroke |
| `o-results` | `{ query, results }` | After every filter pass (including empty results) |
| `o-select` | `{ item, query }` | Item clicked in dropdown |

On `o-select`: fill input with `item[valueKey]` (if `valueKey` set and field exists), close dropdown.

---

## Visual Design

- **`:host`:** `display: block`
- **Input container:** `display: flex`, `align-items: center`, `gap: 8px`, `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.2)`, `backdrop-filter: blur(10px)`, `-webkit-backdrop-filter: blur(10px)`, `border-radius: 999px`, `padding: 8px 16px`
- **Search icon:** `🔍` as a `<span>`, `opacity: 0.6`, `flex-shrink: 0`
- **Input:** `flex: 1`, `background: transparent`, `border: none`, `outline: none`, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`
- **Dropdown:** `position: absolute`, `top: calc(100% + 6px)`, `left: 0`, `right: 0`, `background: rgba(255,255,255,0.12)`, `backdrop-filter: blur(10px)`, `-webkit-backdrop-filter: blur(10px)`, `border-radius: 12px`, `border: 1px solid rgba(255,255,255,0.2)`, `overflow: hidden`, `z-index: 10`
- **`:host` wrapper:** `position: relative` (so dropdown positions relative to search bar)
- **Dropdown items:** `padding: 8px 14px`, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`, `cursor: pointer`; hover: `background: rgba(255,255,255,0.1)`
- **"No results" item:** same padding, `opacity: 0.5`, `cursor: default`, not interactive

---

## Implementation Notes

- Input `<input>` element is created once in constructor. Event listener for `input` event attached in constructor.
- `document` click listener attached in `connectedCallback`, removed in `disconnectedCallback`.
- Click-outside detection: if `event.composedPath()` does not include `this`, close dropdown.
- Dropdown items use `innerHTML` from `renderItem` — click handler on dropdown container resolves item by index using `data-index` attribute on each item div.
- `render()` called when data/searchKeys/filterFn change or on first connect. Input value and dropdown updated separately via `updateDropdown()` to avoid destroying the `<input>` element (which would lose focus).

---

## File Map

| Action | Path |
|---|---|
| Create | `src/search.ts` |
| Create | `src/search.test.ts` |
| Modify | `src/index.ts` |
| Modify | `index.html` |

---

## Tests

- Registers as `o-search`
- Renders an `<input>` element
- `placeholder` attribute sets input placeholder
- Typing fires `o-input` with `{ query }`
- Typing fires `o-results` with filtered array using `searchKeys`
- Custom `filterFn` overrides default filter
- `renderItem` output appears in dropdown items
- Dropdown hidden when `no-dropdown` present
- Dropdown hidden when query is empty
- Dropdown shows "No results" when query non-empty but no matches
- Clicking dropdown item fires `o-select` with `{ item, query }`
- Clicking item fills input with `item[valueKey]`
- Clicking item closes dropdown
- Click-outside closes dropdown
- `placeholder` attribute change re-renders input
