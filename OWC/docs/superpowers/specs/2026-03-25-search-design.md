# o-search Design Spec

**Date:** 2026-03-25
**Component:** `<o-search>`
**Goal:** Glassmorphism search bar with built-in filtering, optional dropdown, and custom item rendering.

---

## Architecture

Single `src/search.ts`. Shadow DOM. Same pattern as `table.ts` and `toggle.ts`. Exported from `src/index.ts`, demoed in `index.html`.

Dropdown is a `<div class="dropdown">` inside the shadow root. A single `document` click listener (attached in `connectedCallback`, removed in `disconnectedCallback`) closes the dropdown on click-outside.

`:host { display: block; position: relative }` so the component participates in block layouts and the dropdown positions relative to it.

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

`attributeChangedCallback` behaviour per attribute:
- `placeholder` → mutates `this._input.placeholder` directly (no re-render)
- `value-key` → updates `this._valueKey`, calls `updateDropdown()`
- `no-dropdown` → calls `updateDropdown()`

### Default filter

When `filterFn` is not set: case-insensitive substring match of `query` against `String(item[key])` for each key in `searchKeys`. An item matches if ANY key matches.

**If `searchKeys` is not set or is an empty array and `filterFn` is not set, the default filter returns no matches for any query.**

### Filtering and events when `no-dropdown` is present

When `no-dropdown` is set, the dropdown UI is suppressed entirely. **Filtering and `o-results` events still fire normally on every keystroke.** Only the dropdown is hidden. This supports external autocomplete use cases.

### Dropdown visibility rules

Dropdown is shown when ALL of the following are true:
1. `no-dropdown` attribute is absent
2. `renderItem` is set
3. Query is non-empty

When shown, the dropdown renders either:
- The filtered results list (one item per result via `renderItem`)
- A single non-interactive "No results" item (when filtered results are empty)

Dropdown closes when:
- An item is clicked (selection)
- User clicks outside the component (`event.composedPath()` does not include `this`)
- Input is cleared (query becomes empty)

### `o-results` event

`o-results` fires on **every keystroke**, including when the filtered results array is empty (zero matches). The `results` field will be an empty array `[]` in that case.

### Events

All events bubble and are composed.

| Event | Detail | When |
|---|---|---|
| `o-input` | `{ query }` | Every keystroke |
| `o-results` | `{ query, results }` | After every filter pass (including empty `[]`) |
| `o-select` | `{ item, query }` | Item clicked in dropdown |

On `o-select`:
- If `valueKey` is set and `item[valueKey]` is not `undefined`, fill input with `String(item[valueKey])`
- If `valueKey` is set but `item[valueKey]` is `undefined`, input value is left unchanged
- Close dropdown

---

## Visual Design

- **`:host`:** `display: block; position: relative`
- **Input container:** `display: flex`, `align-items: center`, `gap: 8px`, `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.2)`, `backdrop-filter: blur(10px)`, `-webkit-backdrop-filter: blur(10px)`, `border-radius: 999px`, `padding: 8px 16px`
- **Search icon:** `🔍` as a `<span>`, `opacity: 0.6`, `flex-shrink: 0`
- **Input:** `flex: 1`, `background: transparent`, `border: none`, `outline: none`, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`
- **Dropdown:** `position: absolute`, `top: calc(100% + 6px)`, `left: 0`, `right: 0`, `background: rgba(255,255,255,0.12)`, `backdrop-filter: blur(10px)`, `-webkit-backdrop-filter: blur(10px)`, `border-radius: 12px`, `border: 1px solid rgba(255,255,255,0.2)`, `overflow: hidden`, `z-index: 10`
- **Dropdown items:** `padding: 8px 14px`, `color: #fff`, `font-size: 14px`, `font-family: sans-serif`, `cursor: pointer`; hover: `background: rgba(255,255,255,0.1)`
- **"No results" item:** same padding, `opacity: 0.5`, `cursor: default`, not interactive (no `data-index`)

---

## Implementation Notes

- `<input>` element created once in constructor. `input` event listener attached in constructor. Stored as `this._input`.
- `render()` builds the full shadow DOM once (constructor or first `connectedCallback`). After that, only `updateDropdown()` is called to update the dropdown — never `render()` — so `<input>` is never destroyed and focus is never lost.
- `document` click listener attached in `connectedCallback`, removed in `disconnectedCallback`.
- Click-outside: `event.composedPath().includes(this)` — if false, close dropdown.
- Each dropdown result item has `data-index` = its index in the **current filtered results array** (not the original `data` array). Click handler resolves item via `this._currentResults[idx]`.
- `this._currentResults` is updated on every filter pass and used by the click handler.
- "No results" item has no `data-index` and is skipped by the click handler.

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
- `o-results` fires with empty array when query non-empty and no matches
- `o-results` fires even when `no-dropdown` is present
- `o-results` fires even when `renderItem` is not set
- Custom `filterFn` overrides default filter
- `renderItem` output appears in dropdown items
- Dropdown hidden when `no-dropdown` present
- Dropdown hidden when query is empty
- Dropdown shows "No results" when query non-empty but no matches
- Clicking dropdown item fires `o-select` with `{ item, query }`
- Clicking item fills input with `item[valueKey]`
- Clicking item with missing `valueKey` field leaves input unchanged
- Clicking item closes dropdown
- Click-outside closes dropdown
- `placeholder` attribute change updates placeholder without destroying input
- `searchKeys` not set: default filter returns no matches
