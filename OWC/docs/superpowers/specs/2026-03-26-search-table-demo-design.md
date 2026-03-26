# Search + Table + Pagination Demo — Design Spec

## Goal

Replace the standalone `o-search` demo section with a combined, interactive demo:
**search bar + selectable table + pagination bar**, wired together using existing OWC components.

Also fix the broken positioning of the standalone `o-search` demo (currently appears below page).

---

## Changes

### 1. `o-table` — add row multi-select

New boolean attribute: `selectable`

When present:
- Prepends a checkbox `<td>` (and `<th>`) to every row
- Header checkbox = select all / deselect all visible rows
- Selected rows get a subtle highlight: `background: rgba(255,255,255,0.12)`
- `selected` getter returns `Record<string, unknown>[]` of selected rows
- Fires `o-row-select` event (bubbles, composed) on any selection change:
  ```ts
  export interface OTableRowSelectEvent { selected: Record<string, unknown>[] }
  ```
- Selection resets when `.data` is reassigned

Checkbox styling: transparent background, white border, custom checked state matching glassmorphism theme.

### 2. Demo section in `index.html`

**Remove** the standalone `o-search` section.
**Add** a new `#demo-combined` section with:

```
[ o-search bar ]
[ o-table (selectable) ]
[ ‹ prev ][ o-toggle pages ][ next › ]         [ o-toggle rows/page ]
```

**Data source**: fetch from `https://dummyjson.com/users?limit=50`
Mapped to columns: `Name` (firstName+lastName), `Company`, `Department`, `Age`

**Glue logic** (all in `<script type="module">` in index.html — no new component):

- `allData` = full fetched array
- `filteredData` = result of search filter applied to `allData`; resets page to 1 on change
- `pageSize` = current rows-per-page selection (default 10); resets page to 1 on change
- `currentPage` = 1-based; clamped to valid range
- `visibleData` = slice of `filteredData` for current page
- Table `.data` = `visibleData`
- Page toggle `.options` = `['1','2',…,N]` where N = `ceil(filteredData.length / pageSize)`, updated on every filter/page-size change
- Prev button: disabled (opacity 0.4, pointer-events none) when `currentPage === 1`
- Next button: disabled when `currentPage === totalPages`

**Search**: wires `o-search` `o-input` event → filters `allData` by name/company/department.
No dropdown (`no-dropdown` attribute) — search only drives the table.

**Rows-per-page toggle**: options `5, 10, 25, All` (default: `10`). `All` maps to `Infinity`.

**Selection**: `o-row-select` logged to console: `console.log('selected:', e.detail.selected)`.

---

## What does NOT change

- `o-toggle` — already single-select, no changes
- `o-search` component internals — no changes
- Existing standalone demos (o-button, o-panel, o-toast, o-toggle, o-table)

---

## Events summary

| Component | Event | Detail |
|---|---|---|
| `o-search` | `o-input` | `{ query }` |
| `o-table` | `o-row-select` | `{ selected: row[] }` |
| `o-toggle` (pages) | `o-change` | `{ value, index }` |
| `o-toggle` (rows/page) | `o-change` | `{ value, index }` |

---

## Testing

Add tests to `src/table.test.ts` covering:
- `selectable` attribute adds checkbox column
- clicking row checkbox toggles selection and fires `o-row-select`
- header checkbox selects/deselects all
- `selected` getter returns correct rows
- reassigning `.data` resets selection
