# Open Web Components (OWC)

Glassmorphism web components — drop a single `<script>` tag and use them anywhere.

**OWC is intentionally simple.** No build step, no framework, no configuration. Just plain HTML, CSS, and JS — easy for developers to pick up and easy for AI to work with. If you can write a `<div>`, you can use OWC.

🌐 **Live demo:** [owc.oun-y.com](https://owc.oun-y.com)

> Sharing == Caring, make the dev community a better place for all ❤️🍀

---

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.7.0/OWC/dist/components.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/) serves the file directly from GitHub — no sign-up needed. The `@v1.7.0` pin means updates never break your page. **14 components + 1 utility** included.

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
| `handle` | CSS selector for your own drag handle; replaces the ⠿ button |
| `theme` | `light` picks the light overlay palette; omit to follow `prefers-color-scheme` |

**Custom drag handle.** Point `handle` at an element in your own markup and the whole thing
becomes the grab area — no separate ⠿ button:

```html
<o-panel move snap="20" resize handle="header">
  <header>Panel title</header>   <!-- drag from here -->
  <p>Content — not draggable</p>
</o-panel>
```

o-panel sets `cursor: grab` and `user-select: none` on that element for you. Clicks on
`select`, `button`, `input`, `textarea`, `a`, `label` and `summary` **inside** the handle keep
working normally instead of starting a drag, so a header full of controls is fine. If the
selector matches nothing (or the children haven't parsed yet — the IIFE build connects before
them) the ⠿ button stays as a fallback, and o-panel switches over as soon as the element
appears.

**While dragging** you get two overlays, both `pointer-events: none` and tagged
`data-owc-overlay="grid"` / `data-owc-overlay="dropzone"` so a page can restyle them:

- the **snap grid** — every 5th line drawn stronger, coloured for the panel's theme
  (dark lines on light themes, light on dark)
- the **drop zone** — a dashed outline of where the panel will land

The dragged panel is raised above both overlays and restored on release.

**Scrolling.** Panel content sits in an inner `.content` scroller; `.panel` itself does not
scroll. The ⠿ and resize handles are siblings of that scroller, so they stay pinned to the
panel instead of drifting as you scroll. Scrollbars are 9px, themed from the glass tokens
(`--glass-scroll-thumb`, `--glass-scroll-thumb-hover`, `--glass-scroll-track`) and sized on
both axes, so wide content gets a horizontal bar. If you slot in a container that sets
`overflow: hidden`, that container swallows the overflow and the panel won't scroll.

**Events:**

| Event | `detail` |
|---|---|
| `o-drag-start` | `{ x, y, rect }` |
| `o-drag-move` | `{ x, y, rect, setDropZone(rect \| null) }` |
| `o-drag-end` | `{ x, y, rect }` — fires after the overlays are cleared |
| `o-resize-start` | `{ width, height, edge }` — `edge` is `'e'`, `'s'` or `'se'` |
| `o-resize-move` | `{ width, height, edge }` |
| `o-resize-end` | `{ width, height }` |

`rect` is `{ x, y, width, height }` in viewport coordinates.

Call `setDropZone()` from `o-drag-move` to point the highlight at your own target —
useful when the panel does not land where it is floating (columns, grids, lists).
Pass `null` to hide it:

```js
// highlight the grid cell the panel will snap into, not the panel itself
panel.addEventListener('o-drag-move', e => {
  e.detail.setDropZone(cellRectUnder(e.detail.rect))
})

// persist the position yourself once the drag finishes
panel.addEventListener('o-drag-end', e => save(e.detail.x, e.detail.y))
```

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
  <script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.7.0/OWC/dist/components.js"></script>
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

Theming has **two independent axes**: a *family* (the visual language) and a *mode*
(the colour scheme). All six combinations work.

| Family | Look |
|---|---|
| `glass` *(default)* | Translucent green-tinted glass, blur, soft shadows |
| `pixel` | 8-bit: square corners, chunky black outlines, hard offset shadows, monospace |
| `office` | Flat corporate: neutral surfaces, one muted blue accent, small radii, no blur |

| Mode | Look |
|---|---|
| `dark` | Dark ground, light text |
| `light` | Light ground, dark text |

Geometry — radii, blur, font, border width — belongs to the family and never changes
with mode, so toggling light/dark cannot move a pixel.

**With no mode set, the mode follows the visitor's OS** (`prefers-color-scheme`).
An explicit `mode` always beats the OS.

### Theme the whole page

```html
<body data-owc-theme="office" data-owc-mode="dark">
  <o-button>Start</o-button>
  <o-table></o-table>
</body>
```

Either attribute is optional: `data-owc-theme` alone follows the OS for its mode, and
`data-owc-mode` alone keeps the default glass family.

### Theme a single component

A per-component attribute always wins over the page:

```html
<body data-owc-theme="pixel" data-owc-mode="dark">
  <o-button>pixel, dark</o-button>
  <o-button mode="light">pixel, light</o-button>       <!-- keeps the page family -->
  <o-button theme="office">office</o-button>
  <o-button theme="glass">back to the default</o-button>
</body>
```

`mode` on its own keeps whatever family the page set and swaps only its palette.

### Legacy names

`theme="light"` and `theme="dark"` shipped in v1.0 and still work — they are pinned
aliases for glass + light and glass + dark, and are unaffected by the OS setting.

No webfonts are loaded — `pixel` uses a monospace system stack, so the library still
makes zero network requests.

### Contrast

Every family x mode is checked against WCAG AA by the test suite: body text at 4.5:1,
and decorative text, accents, progress bars and scrollbar thumbs at 3:1. Ratios are
measured by compositing each translucent layer over the one beneath it, which is the
only way a translucent token means anything. Run it with:

```bash
npm run audit:contrast
```

Panel edges on `glass` and `office` are highlight strokes rather than boundaries that
identify a control, so they sit below 3:1 by design.

### CSS custom properties

Every theme is just a set of these. Override them on `:root` or any ancestor for a custom look:

| Variable | Description |
|---|---|
| `--glass-bg` | Panel / input background |
| `--glass-border` | Border color |
| `--glass-hover` | Hover / raised surface |
| `--glass-text` | Primary text color |
| `--glass-text-muted` | Secondary text color |
| `--glass-text-dim` | Placeholder / disabled text |
| `--accent-warm` | Accent / active color |
| `--glass-accent-text` | Text drawn *on* the accent color |
| `--glass-blur` | Backdrop blur amount |
| `--glass-backdrop` | Full `backdrop-filter` value (`none` disables glass) |
| `--glass-shadow` | Shadow for floating surfaces (dialog, dropdown, note) |
| `--glass-elevation` | Shadow for inline surfaces (default `none`) |
| `--glass-scrim` / `--glass-scrim-backdrop` | Dialog backdrop |
| `--glass-border-width` | Border thickness |
| `--glass-radius` | Base corner radius |
| `--glass-radius-xs` … `-2xl`, `--glass-radius-pill` | The rest of the radius scale |
| `--glass-font` | Font stack |
| `--glass-press` | `transform` applied on `:active` |
| `--glass-indicator` | Fill behind the selected `o-toggle` segment |
| `--glass-scroll-thumb` / `-hover` / `--glass-scroll-track` | Scrollbar colours |
| `--glass-scroll-size` / `--glass-scroll-radius` | Scrollbar geometry |
| `--glass-progress` / `--glass-progress-glow` | Progress bar fill and glow |
| `--glass-page-bg` / `--glass-page-text` | Page background and text (page chrome) |
| `--glass-chrome-bg` / `--glass-chrome-border` | Nav / toolbar chrome |

To patch a theme page-wide rather than replace it, set the same name prefixed with `--owc-` on an ancestor:

```css
body { --owc-glass-radius: 0; }   /* square corners, everything else untouched */
```

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
