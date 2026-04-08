# Open Web Components (OWC)

Glassmorphism web components — drop a single `<script>` tag and use them anywhere.

**OWC is intentionally simple.** No build step, no framework, no configuration. Just plain HTML, CSS, and JS — easy for developers to pick up and easy for AI to work with. If you can write a `<div>`, you can use OWC.

🌐 **Live demo:** [owc.oun-y.com](https://owc.oun-y.com)

> Sharing == Caring, make the dev community a better place for all ❤️🍀

---

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.4.0/OWC/dist/components.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/) serves the file directly from GitHub — no sign-up needed. The `@v1.4.0` pin means updates never break your page. **14 components + 1 utility** included.

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

| Tag | Description |
|---|---|
| [`o-button`](#o-button) | Glassmorphic button |
| [`o-panel`](#o-panel) | Draggable, resizable glass panel |
| [`o-table`](#o-table) | Sortable, resizable, selectable, editable table |
| [`o-note`](#o-note) | Glass textarea or card note |
| [`o-dialog`](#o-dialog) | Form dialog with backdrop |
| [`o-toggle`](#o-toggle) | Segmented toggle / tab switcher |
| [`o-search`](#o-search) | Search input with live dropdown |
| [`o-toast`](#o-toast) | Toast notifications |
| [`o-tooltip`](#o-tooltip) | Glassmorphic tooltip |
| [`o-dropdown`](#o-dropdown) | Dropdown menu |
| [`o-tabs`](#o-tabs) | Tab panel switcher |
| [`o-input`](#o-input) | Text input with label and validation states |
| [`o-skeleton`](#o-skeleton) | Pulsing placeholder for loading states |
| [`o-progress`](#o-progress) | Fixed top-of-page loading bar |

**Utility:**

| Function | Description |
|---|---|
| [`asyncPlus()`](#asyncplus) | Wrap promises and auto-drive the progress bar |

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

**Card variant:**

```html
<o-note variant="card" placeholder="Write something…"></o-note>
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

  <!-- Use o-input for glass-styled fields -->
  <o-input name="name" label="Name" placeholder="Alice" style="width:100%;margin-bottom:10px"></o-input>
  <o-input name="role" label="Role" placeholder="Engineer" style="width:100%"></o-input>

  <div slot="actions">
    <o-button type="submit">Save</o-button>
    <o-button id="cancel-btn">Cancel</o-button>
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
  dialog.addEventListener('o-cancel', () => console.log('cancelled'))
</script>
```

| Slot | Description |
|---|---|
| `title` | Dialog header text |
| *(default)* | Form content — `o-input[name]` and native `input[name]` values collected on submit |
| `actions` | Footer buttons |

| Method / Attribute | Description |
|---|---|
| `open` attribute | Presence opens the dialog |
| `dialog.open()` | Opens programmatically |
| `dialog.close()` | Closes programmatically |

**Events:**

| Event | `detail` |
|---|---|
| `o-submit` | `{ name: value }` pairs from `o-input[name]` and native `input[name]` fields |
| `o-cancel` | `null` |

---

### `o-toggle`

Segmented toggle / tab switcher.

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
  search.searchKeys = ['name', 'role']
  search.renderItem = item => `${item.name} — ${item.role}`

  search.addEventListener('o-select', e => console.log(e.detail.item))
  search.addEventListener('o-input',  e => console.log(e.detail.query))
</script>
```

| Attribute | Description |
|---|---|
| `placeholder` | Input placeholder text |
| `value-key` | Property name used as display value after selection |
| `no-dropdown` | Disables the dropdown (emit events only) |

**Events:**

| Event | `detail` |
|---|---|
| `o-input` | `{ query }` — fires on every keystroke |
| `o-results` | `{ query, results }` — filtered results |
| `o-select` | `{ item, query }` — user picked a result |

---

### `o-toast`

Toast notifications. Use the `toast()` global function or the element directly.

```js
toast('File saved!', 'success')
toast('Connection failed', 'error', { duration: 5000 })
toast('Update available', 'info')
```

```html
<!-- Declarative -->
<o-toast type="success">File saved!</o-toast>
```

| Param | Values | Default |
|---|---|---|
| `type` | `success` `error` `warning` `info` | — |
| `duration` | ms | `3000` |

Toasts appear **top-right** on desktop and **bottom-center** on mobile. Hover to pause, click ✕ to dismiss.

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
    { label: 'Edit',   value: 'edit'   },
    { label: 'Delete', value: 'delete' },
  ]
  menu.addEventListener('o-select', e => console.log(e.detail))
</script>
```

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
```

| Property | Type | Description |
|---|---|---|
| `value` | `string` | Active tab value |

| Event | `detail` |
|---|---|
| `o-change` | `{ value, prev }` |

---

### `o-input`

Glass text input with a static label and validation states.

```html
<o-input label="Email" type="email" placeholder="name@example.com"></o-input>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Static label rendered above the input |
| `placeholder` | string | — | Input placeholder text |
| `type` | string | `text` | `text`, `password`, `email`, `number` |
| `name` | string | — | Form field name (collected by `o-dialog` on submit) |
| `value` | string | `''` | Current value |
| `disabled` | boolean | false | Disables the input |
| `error` | string | — | Error message below; red border applied |
| `success` | boolean | false | Green border applied |

```js
// Validation on blur
input.addEventListener('o-change', e => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.detail.value)
  input.setAttribute('error', valid ? '' : 'Enter a valid email address')
})
```

**Events:**

| Event | `detail` | When |
|---|---|---|
| `o-input` | `{ value }` | Every keystroke |
| `o-change` | `{ value }` | On blur |

---

### `o-skeleton`

Pulsing placeholder shown while content is loading. Three variants.

```html
<!-- Block (default) — sized via attributes -->
<o-skeleton width="200px" height="40px" radius="8px"></o-skeleton>

<!-- While o-table data is fetching -->
<o-skeleton variant="table" rows="6"></o-skeleton>

<!-- While o-panel content is fetching -->
<o-skeleton variant="panel"></o-skeleton>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `variant` | `block \| table \| panel` | `block` | Skeleton layout preset |
| `width` | string | `100%` | Width (block only) |
| `height` | string | `1em` | Height (block only) |
| `radius` | string | `6px` | Border-radius (block only) |
| `rows` | number | `5` | Body rows (table variant only) |

No JS required — purely visual, CSS pulse animation.

---

### `o-progress`

Fixed top-of-page loading bar. Add once to the page; control it via the static API.

```html
<o-progress></o-progress>

<script>
  OProgress.start()   // auto-increments slowly (indeterminate feel)
  OProgress.set(60)   // jump to 60%
  OProgress.done()    // shoot to 100% then fade out
</script>
```

| Method | Description |
|---|---|
| `OProgress.start()` | Begins auto-increment. Safe to call multiple times. |
| `OProgress.set(n)` | Jumps to value `n` (0–100). |
| `OProgress.done()` | Shoots to 100%, fades out after 400ms. |

Setting `value="100"` via attribute also triggers auto-hide.

---

### `asyncPlus()`

Wraps multiple promises and automatically drives `o-progress` — no manual `start()` / `done()` calls needed.

```js
const results = await asyncPlus(
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
)
// results: PromiseSettledResult[] — never rejects

// Fires when all promises settle
document.addEventListener('progress-complete', e => {
  console.log(e.detail.results)
})
```

- Calls `OProgress.start()` immediately
- Increments the bar proportionally as each promise settles
- Calls `OProgress.done()` when all are done
- Dispatches `progress-complete` on `document` with all results
- Returns `Promise<PromiseSettledResult[]>` (like `Promise.allSettled`, never rejects)

---

## Full Example

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.4.0/OWC/dist/components.js"></script>
</head>
<body style="background: linear-gradient(135deg, #059669, #065f46); min-height: 100vh; padding: 2rem; color: #fff;">

  <o-progress></o-progress>

  <o-panel move snap="20">
    <o-input id="name-input" label="Name" placeholder="Alice"></o-input>
    <o-button id="save-btn" style="margin-top:10px">Save</o-button>
  </o-panel>

  <o-dialog id="confirm-dialog">
    <span slot="title">Confirm</span>
    <o-input name="reason" label="Reason" placeholder="Why?"></o-input>
    <div slot="actions">
      <o-button type="submit">Confirm</o-button>
    </div>
  </o-dialog>

  <script>
    document.getElementById('save-btn').addEventListener('o-click', async () => {
      // Drive progress automatically across parallel requests
      const [users, posts] = await asyncPlus(fetch('/api/users'), fetch('/api/posts'))
      toast('Loaded!', 'success')
    })

    const dialog = document.getElementById('confirm-dialog')
    dialog.addEventListener('o-submit', e => {
      toast(`Confirmed: ${e.detail.reason}`, 'success')
    })
  </script>

</body>
</html>
```

---

## Theming

Components default to **white glass** (bright on dark backgrounds). Override per-element with the `theme` attribute:

```html
<o-panel theme="light">Green-tinted glass (good on light backgrounds)</o-panel>
```

All components expose CSS custom properties you can override globally or per-component:

| Variable | Description |
|---|---|
| `--glass-bg` | Panel / input background |
| `--glass-border` | Border color |
| `--glass-blur` | Backdrop blur amount |
| `--glass-text` | Primary text color |
| `--glass-text-muted` | Secondary text color |
| `--accent-warm` | Accent / active color |

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
