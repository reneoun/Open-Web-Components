# OWC New Components Design
**Date:** 2026-04-04  
**Project:** `reneoun/Open-Web-Components` library + `ai-projects/owc` demo page

---

## Overview

Add three new UI components to the OWC library and demo page: editable table inputs, a note/textarea area (two variants), and a glassmorphism form dialog. All components follow the existing warm glassmorphism aesthetic (frosted glass, amber accent on focus, rgba backgrounds with backdrop-filter blur).

---

## Scope

All components are implemented in the **library source** (`reneoun/Open-Web-Components`), built into the dist bundle, and demonstrated in the `index.html` demo page. No inline component definitions in the demo page.

---

## Component 1: `o-table` editable attribute

### What it does
Extends the existing `o-table` component with inline cell editing, controlled by an `editable` HTML attribute on the element and per-column `editable` keys in the column config.

### Column config options
```js
table.columns = [
  { key: 'name',   label: 'Name',   editable: 'always' },  // input always visible
  { key: 'role',   label: 'Role',   editable: 'click'  },  // read-only, row edit button reveals input
  { key: 'status', label: 'Status' }                        // read-only, no editing
]
table.setAttribute('editable', '')
```

### Behaviour
- `editable: 'always'` — glass-styled `<input>` rendered directly in the cell at all times.
- `editable: 'click'` — cell displays plain text; clicking the per-row edit button (pencil icon) switches all `click`-editable cells in that row into inputs. A confirm (✓) and cancel (✗) button appear in the row.
- Read-only columns (`editable` key absent) are never interactive.
- Committing via Enter or blur on an `always` cell fires `o-cell-change` immediately.
- Committing a `click` row fires one `o-row-change` event with all changed values.

### Events
| Event | `detail` |
|---|---|
| `o-cell-change` | `{ key, value, rowIndex, row }` |
| `o-row-change` | `{ rowIndex, row, changes: { key: newValue } }` |

### Implementation notes
- Add `editable` to `static get observedAttributes()`.
- In `attributeChangedCallback`, re-render the table with edit mode active.
- Cell inputs use the shared glass input CSS tokens.
- Does not affect sort, resize, or storage persistence behaviour.

---

## Component 2: `o-note`

### What it does
A glass-styled note/text area component with two visual variants.

### Variants

**`variant="textarea"` (default)**
- Auto-resizing `<textarea>` inside a glass panel.
- Floating label (passed via `label` attribute).
- Optional character counter: set `max-length="200"` to show `n / 200`.
- Focus ring uses amber tint.
- Fires `o-change` with `{ value }` on input.

**`variant="card"`**
- Glass card with three editable zones:
  - Title field (single-line, large text)
  - Body textarea (auto-resize)
  - Tag chip input — type a tag and press Enter to add; click a chip to remove it.
- Fires `o-change` with `{ title, body, tags: string[] }` on any change.

### Attributes
| Attribute | Applies to | Description |
|---|---|---|
| `variant` | both | `"textarea"` (default) or `"card"` |
| `label` | textarea | Floating label text |
| `placeholder` | both | Placeholder text for body/textarea |
| `max-length` | textarea | Shows character counter when set |
| `value` | textarea | Initial value |

### Styling
Both variants use `--glass-bg`, `--glass-border`, `--glass-blur` tokens. Amber (`--accent-warm: rgba(251,191,36,0.6)`) used for focus borders and tag chips.

---

## Component 3: `o-dialog`

### What it does
A glassmorphism form dialog with a blurred backdrop, slot-based content, and programmatic open/close control.

### Usage
```html
<o-dialog id="my-dialog">
  <span slot="title">Add New Item</span>

  <label>Name</label>
  <input name="name" type="text" />

  <label>Role</label>
  <input name="role" type="text" />

  <div slot="actions">
    <o-button type="submit">Save</o-button>
    <o-button variant="ghost">Cancel</o-button>
  </div>
</o-dialog>

<script>
  const dialog = document.getElementById('my-dialog')
  dialog.open()

  dialog.addEventListener('o-submit', e => console.log(e.detail))  // { name, role }
  dialog.addEventListener('o-cancel', () => console.log('cancelled'))
</script>
```

### Slots
| Slot | Description |
|---|---|
| `title` | Dialog header text |
| *(default)* | Form content — any named inputs inside are collected on submit |
| `actions` | Footer buttons area |

### API
| Method / Attribute | Description |
|---|---|
| `open` attribute | Presence opens the dialog |
| `dialog.open()` | Opens programmatically |
| `dialog.close()` | Closes programmatically |

### Behaviour
- Backdrop: semi-transparent blur overlay behind the glass panel.
- Entry animation: scale(0.95) + opacity(0) → scale(1) + opacity(1), ~200ms ease-out.
- Exit animation: reverse, then remove from visible state.
- Closes on backdrop click or Escape key — both fire `o-cancel`.
- On submit: collects all `name`d inputs in the default slot into a plain object, fires `o-submit`, then closes.

### Events
| Event | `detail` |
|---|---|
| `o-submit` | Plain object of `{ name: value }` pairs from slotted form fields |
| `o-cancel` | `null` |

---

## Shared Design Tokens

Add to the library's shared CSS (consumed by all three new components and any future ones):

```css
:host {
  --glass-bg:     rgba(255, 255, 255, 0.07);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-blur:   12px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --accent-warm:  rgba(251, 191, 36, 0.6);
}
```

---

## Demo Page Additions (`index.html`)

Three new sections added to the demo page, each following the existing section pattern:

1. **Editable Table** — shows a table with a mix of `always` and `click` editable columns, an event log below.
2. **Notes** — side-by-side: `o-note variant="textarea"` with char count, and `o-note variant="card"` with tags.
3. **Dialog** — a trigger button that opens an `o-dialog` form; submitted values displayed below.

---

## Implementation Order

1. Clone `reneoun/Open-Web-Components` locally.
2. Add shared CSS tokens to the library's theme/base layer.
3. Implement `o-table` editable attribute (modify existing component).
4. Implement `o-note` as a new component.
5. Implement `o-dialog` as a new component.
6. Build the dist bundle.
7. Push to GitHub, get new commit hash.
8. Update CDN URL in `index.html`.
9. Add demo sections to `index.html`.
10. Test all three in browser.
