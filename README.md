# Open Web Components (OWC)

Glassmorphism web components — drop a single script tag and use them anywhere.

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.2.1/OWC/dist/components.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/) serves the file directly from GitHub — no sign-up needed. The `@v1.2.1` pins the version so updates never break your page. **11 components** included.

To always get the latest (not recommended for production):
```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@main/OWC/dist/components.js"></script>
```

### npm / bundler

```bash
npm install @owc/components
```

```js
import '@owc/components'
```

---

## Components

- [`o-button`](#o-button) — Glassmorphic button
- [`o-panel`](#o-panel) — Draggable, resizable glass panel
- [`o-table`](#o-table) — Sortable, resizable, selectable, editable table
- [`o-note`](#o-note) — Glass textarea or card note
- [`o-dialog`](#o-dialog) — Form dialog with backdrop
- [`o-toggle`](#o-toggle) — Segmented toggle / tab switcher
- [`o-search`](#o-search) — Search input with live dropdown
- [`o-toast`](#o-toast) — Toast notifications
- [`o-tooltip`](#o-tooltip) — Glassmorphic tooltip
- [`o-dropdown`](#o-dropdown) — Dropdown menu
- [`o-tabs`](#o-tabs) — Tab panel switcher

---

### `o-button`

```html
<o-button>Click me</o-button>
```

Fires `o-click` instead of native `click` (bubbles, composed):

```js
document.querySelector('o-button').addEventListener('o-click', () => {
  console.log('clicked!')
})
```

| CSS property | Default | Description |
|---|---|---|
| `--o-button-color` | `#fff` | Text color |

---

### `o-panel`

A glass content panel that can be dragged, snapped to a grid, and resized.

```html
<!-- Static -->
<o-panel>Any HTML here</o-panel>

<!-- Draggable -->
<o-panel move>
  <p>Drag with the ⠿ handle</p>
</o-panel>

<!-- Drag + snap to 20px grid -->
<o-panel move snap="20">
  <p>Snaps while dragging</p>
</o-panel>

<!-- Resizable (right / bottom / corner handles) -->
<o-panel resize>Content</o-panel>

<!-- All combined -->
<o-panel move snap="20" resize>Content</o-panel>
```

| Attribute | Description |
|---|---|
| `move` | Shows drag handle, enables repositioning |
| `snap` | Grid size in px for snapping while dragging (min 8) |
| `resize` | Shows resize handles on right edge, bottom edge, and corner |

---

### `o-table`

Sortable, resizable, row-selectable table. Set `columns` and `data` via JS.

```html
<o-table id="my-table"></o-table>

<script>
  const table = document.getElementById('my-table')

  table.columns = [
    { key: 'name',  label: 'Name',  sortable: true, width: 160 },
    { key: 'role',  label: 'Role',  sortable: true, width: 140 },
    { key: 'score', label: 'Score', sortable: true, width: 100, minWidth: 60 }
  ]

  table.data = [
    { name: 'Alice', role: 'Engineer', score: 95 },
    { name: 'Bob',   role: 'Designer', score: 87 },
  ]
</script>
```

**Column config options:**

| Key | Type | Description |
|---|---|---|
| `key` | `string` | Property name on data row |
| `label` | `string` | Header text |
| `sortable` | `boolean` | Enable click-to-sort |
| `width` | `number` | Initial width in px |
| `minWidth` | `number` | Minimum resize width |
| `maxWidth` | `number` | Maximum resize width |
| `editable` | `'always' \| 'click'` | Enable inline editing (requires `editable` attribute on element) |

**Attributes:**

| Attribute | Description |
|---|---|
| `selectable` | Adds checkboxes for row selection |
| `editable` | Enables inline cell editing |
| `resize-mode` | `single` (default) or `adjacent` column resize |
| `storage` | `local` or `session` — persist sort + column widths |
| `storage-key` | Key name for storage (required when `storage` is set) |

**Row selection:**

```js
table.setAttribute('selectable', '')
table.addEventListener('o-row-select', e => {
  console.log(e.detail.selected) // array of selected row objects
})

// Read selected rows at any time
console.log(table.selected)
```

**Inline editing:**

```html
<o-table id="edit-table" editable></o-table>

<script>
  const table = document.getElementById('edit-table')

  table.columns = [
    { key: 'name', label: 'Name', editable: 'always' }, // input always visible
    { key: 'role', label: 'Role', editable: 'click'  }, // edit button reveals input
    { key: 'dept', label: 'Dept' }                       // read-only
  ]
  table.data = [{ name: 'Alice', role: 'Engineer', dept: 'Eng' }]

  // Single cell committed (always mode)
  table.addEventListener('o-cell-change', e => {
    console.log(e.detail) // { key, value, rowIndex, row }
  })

  // Row confirmed (click mode)
  table.addEventListener('o-row-change', e => {
    console.log(e.detail) // { rowIndex, row, changes: { key: newValue } }
  })
</script>
```

**Events:**

| Event | `detail` |
|---|---|
| `o-sort` | `{ col, dir }` — `dir` is `'asc'`, `'desc'`, or `'none'` |
| `o-row-select` | `{ selected }` — array of selected row objects |
| `o-cell-change` | `{ key, value, rowIndex, row }` |
| `o-row-change` | `{ rowIndex, row, changes }` |

---

### `o-note`

Glass-styled note area. Two variants: `textarea` (default) and `card`.

**Textarea variant:**

```html
<o-note
  label="Quick Note"
  placeholder="Type here…"
  max-length="200"
  value="Initial text"
></o-note>

<script>
  document.querySelector('o-note').addEventListener('o-change', e => {
    console.log(e.detail.value)
  })
</script>
```

**Card variant** — title, body, and tag chips:

```html
<o-note variant="card" placeholder="Write something…"></o-note>

<script>
  document.querySelector('o-note').addEventListener('o-change', e => {
    const { title, body, tags } = e.detail
    console.log(title, body, tags)
  })
</script>
```

| Attribute | Variant | Description |
|---|---|---|
| `variant` | both | `'textarea'` (default) or `'card'` |
| `label` | textarea | Floating label text |
| `placeholder` | both | Placeholder for textarea / card body |
| `max-length` | textarea | Shows `n / max` character counter |
| `value` | textarea | Initial text value |

**Events:**

| Event | `detail` |
|---|---|
| `o-change` (textarea) | `{ value }` |
| `o-change` (card) | `{ title, body, tags: string[] }` |

---

### `o-dialog`

Glassmorphism form dialog with a blurred backdrop, slots, and programmatic open/close.

```html
<o-dialog id="my-dialog">
  <span slot="title">Add Team Member</span>

  <label>Name</label>
  <input name="name" type="text" placeholder="Alice" />

  <label>Role</label>
  <input name="role" type="text" placeholder="Engineer" />

  <div slot="actions">
    <o-button type="submit">Save</o-button>
    <o-button variant="ghost" id="cancel-btn">Cancel</o-button>
  </div>
</o-dialog>

<o-button id="open-btn">Open Dialog</o-button>

<script>
  const dialog = document.getElementById('my-dialog')

  document.getElementById('open-btn').addEventListener('o-click', () => dialog.open())
  document.getElementById('cancel-btn').addEventListener('o-click', () => dialog.close())

  dialog.addEventListener('o-submit', e => {
    console.log(e.detail) // { name: 'Alice', role: 'Engineer' }
  })
  dialog.addEventListener('o-cancel', () => {
    console.log('cancelled')
  })
</script>
```

| Slot | Description |
|---|---|
| `title` | Dialog header text |
| *(default)* | Form content — named inputs are collected on submit |
| `actions` | Footer buttons |

| Method / Attribute | Description |
|---|---|
| `open` attribute | Presence opens the dialog |
| `dialog.open()` | Opens programmatically |
| `dialog.close()` | Closes programmatically |

**Behaviour:** Clicking the backdrop or pressing Escape closes the dialog and fires `o-cancel`. Clicking a `[type="submit"]` button collects all `name`d inputs and fires `o-submit`, then closes.

**Events:**

| Event | `detail` |
|---|---|
| `o-submit` | `{ name: value }` pairs from slotted form fields |
| `o-cancel` | `null` |

---

### `o-toggle`

Segmented toggle / tab switcher. Set `options` via JS.

```html
<o-toggle id="my-toggle"></o-toggle>

<script>
  const toggle = document.getElementById('my-toggle')

  toggle.options = ['Day', 'Week', 'Month']
  // or with explicit values:
  toggle.options = [
    { label: 'List',  value: 'list'  },
    { label: 'Board', value: 'board' },
  ]

  toggle.addEventListener('o-change', e => {
    console.log(e.detail) // { value, index, prev }
  })
</script>
```

| Property | Type | Description |
|---|---|---|
| `options` | `string[] \| { label, value }[]` | Toggle options |
| `value` | `string \| null` | Currently selected value |

**Events:**

| Event | `detail` |
|---|---|
| `o-change` | `{ value, index, prev }` |

---

### `o-search`

Search input with a live results dropdown. Feed it data and it filters on every keystroke.

```html
<o-search id="search" placeholder="Search users…"></o-search>

<script>
  const search = document.getElementById('search')

  search.data = [
    { name: 'Alice Johnson', role: 'Engineer' },
    { name: 'Bob Smith',     role: 'Designer' },
  ]
  search.searchKeys = ['name', 'role']  // fields to search
  search.renderItem = item => `${item.name} — ${item.role}`

  search.addEventListener('o-select', e => {
    console.log(e.detail.item)  // full selected object
  })

  // Live query events
  search.addEventListener('o-input',   e => console.log(e.detail.query))
  search.addEventListener('o-results', e => console.log(e.detail.results))
</script>
```

| Attribute | Description |
|---|---|
| `placeholder` | Input placeholder text |
| `value-key` | Property name used as display value after selection |
| `no-dropdown` | Disables the dropdown (emit results only) |

| Property | Type | Description |
|---|---|---|
| `data` | `unknown[]` | Items to search through |
| `searchKeys` | `string[]` | Object keys to match against |
| `renderItem` | `(item) => string` | Custom HTML renderer for dropdown rows |

**Events:**

| Event | `detail` |
|---|---|
| `o-input` | `{ query }` — fires on every keystroke |
| `o-results` | `{ query, results }` — filtered results |
| `o-select` | `{ item, query }` — user picked a result |

---

### `o-toast`

Toast notifications. Use the `toast()` global function (recommended) or the element directly.

**Imperative (recommended):**

```js
toast('File saved!', 'success')
toast('Connection failed', 'error', { duration: 5000 })
toast('<strong>Update</strong> available', 'info')
```

**Declarative:**

```html
<o-toast type="success">File saved!</o-toast>
<o-toast type="error" message="Connection failed" duration="5000"></o-toast>
```

| Param / Attribute | Values | Default |
|---|---|---|
| `type` | `success` `error` `warning` `info` | — |
| `duration` | ms | `3000` |
| `message` | string (fallback when no slot content) | — |

| CSS property | Default |
|---|---|
| `--o-toast-bg` | `rgba(255,255,255,0.18)` |
| `--o-toast-border` | `rgba(255,255,255,0.3)` |
| `--o-toast-blur` | `10px` |
| `--o-toast-radius` | `10px` |
| `--o-toast-color` | `#fff` |

Toasts appear **top-right** on desktop and **bottom-center** on mobile. Hover to pause, click ✕ to dismiss.

> ⚠️ `toast()` sets content as `innerHTML` — sanitize any user-generated input before passing it.

---

### `o-tooltip`

Wrap any element to show a glass tooltip on hover / focus.

```html
<o-tooltip text="Save your work" position="top">
  <o-button>Save</o-button>
</o-tooltip>
```

| Attribute | Values | Default |
|---|---|---|
| `text` | string | — |
| `position` | `top` `bottom` `left` `right` | `top` |

---

### `o-dropdown`

Dropdown menu. Set options via JS, fires `o-select`.

```html
<o-dropdown id="menu">
  <o-button>Actions ▾</o-button>
</o-dropdown>

<script>
  const menu = document.getElementById('menu')
  menu.options = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' },
  ]
  menu.addEventListener('o-select', e => console.log(e.detail))
</script>
```

| Property | Type | Description |
|---|---|---|
| `options` | `{ label, value, icon? }[]` | Menu items |

| Method | Description |
|---|---|
| `toggle()` | Open / close menu |
| `close()` | Close menu |

| Event | `detail` |
|---|---|
| `o-select` | `{ value, label }` |

---

### `o-tabs`

Tab panel with glass styling. Define tabs via `slot="tab"`, content via `data-tab`.

```html
<o-tabs>
  <div slot="tab" data-value="overview">Overview</div>
  <div slot="tab" data-value="details">Details</div>
  <div data-tab="overview">Overview content here</div>
  <div data-tab="details">Details content here</div>
</o-tabs>

<script>
  document.querySelector('o-tabs').addEventListener('o-change', e => {
    console.log(e.detail) // { value, prev }
  })
</script>
```

| Property | Type | Description |
|---|---|---|
| `value` | `string` | Active tab value |

| Event | `detail` |
|---|---|
| `o-change` | `{ value, prev }` |

---

## Full Example

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.2.1/OWC/dist/components.js"></script>
</head>
<body style="background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; padding: 2rem;">

  <!-- Panel with a button -->
  <o-panel move snap="20">
    <o-button id="save-btn">Save file</o-button>
  </o-panel>

  <!-- Editable table -->
  <o-table id="team-table" editable selectable></o-table>

  <!-- Note -->
  <o-note label="Notes" max-length="300" style="max-width:400px"></o-note>

  <!-- Dialog trigger -->
  <o-button id="add-btn">Add member</o-button>

  <o-dialog id="add-dialog">
    <span slot="title">Add Member</span>
    <input name="name" type="text" placeholder="Name" />
    <input name="role" type="text" placeholder="Role" />
    <div slot="actions">
      <o-button type="submit">Save</o-button>
    </div>
  </o-dialog>

  <script>
    // Button → toast
    document.getElementById('save-btn').addEventListener('o-click', () => {
      toast('File saved!', 'success')
    })

    // Editable table
    const table = document.getElementById('team-table')
    table.columns = [
      { key: 'name', label: 'Name', editable: 'always', width: 160 },
      { key: 'role', label: 'Role', editable: 'click',  width: 140 },
    ]
    table.data = [
      { name: 'Alice', role: 'Engineer' },
      { name: 'Bob',   role: 'Designer' },
    ]
    table.addEventListener('o-row-change', e => {
      toast(`Row ${e.detail.rowIndex} updated`, 'success')
    })

    // Dialog
    const dialog = document.getElementById('add-dialog')
    document.getElementById('add-btn').addEventListener('o-click', () => dialog.open())
    dialog.addEventListener('o-submit', e => {
      table.data = [...table.data, e.detail]
      toast(`Added ${e.detail.name}`, 'success')
    })
  </script>

</body>
</html>
```

---

## Theming

Components default to a **light greenish** theme and auto-switch to dark glass via `prefers-color-scheme`. Override per-element:

```html
<o-panel theme="light">Always light</o-panel>
<o-panel theme="dark">Always dark (classic glass)</o-panel>
```

All components use CSS custom properties (`--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--accent-warm`, `--glass-text`) that you can override globally or per-component.

---

## Development

```bash
bun install
bun dev            # dev server at localhost:5173
bun run test       # run tests (use 'bun run test', not 'bun test')
bun run build:cdn  # rebuild dist/components.js
bun run build:lib  # rebuild npm library bundle
```

> **Note:** Use `bun run test` (not `bun test`) — the latter uses bun's built-in runner which lacks the happy-dom environment.
