# Open Web Components (OWC)

Glassmorphism web components — drop a single script tag and use them anywhere.

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.1.0/OWC/dist/components.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/) serves the file directly from GitHub — no sign-up needed. The `@v1.1.0` pins the version so updates never break your page.

To always get the latest (not recommended for production):
```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@main/OWC/dist/components.js"></script>
```

---

## Components

### `<o-button>`

```html
<o-button>Click me</o-button>
```

Listens for the `o-click` custom event (bubbles):

```js
document.querySelector('o-button').addEventListener('o-click', () => {
  console.log('clicked!')
})
```

CSS custom property:

| Property | Default | Description |
|---|---|---|
| `--o-button-color` | `#fff` | Text color |

---

### `<o-panel>`

```html
<!-- Static -->
<o-panel>
  <p>Any HTML content here</p>
</o-panel>

<!-- Draggable -->
<o-panel move>
  <p>Drag me with the ⠿ handle</p>
</o-panel>
```

| Attribute | Description |
|---|---|
| `move` | Shows a drag handle — click and hold to reposition |

---

### `<o-toast>`

Declarative:

```html
<o-toast type="success">File saved!</o-toast>
<o-toast type="error" message="Connection failed" duration="5000"></o-toast>
```

Imperative (recommended):

```js
toast('File saved!', 'success')
toast('Connection failed', 'error', { duration: 5000 })
toast('<strong>Update</strong> available', 'info')
```

| Attribute / Param | Values | Default |
|---|---|---|
| `type` | `success` `error` `warning` `info` | — |
| `duration` | ms | `3000` |
| `message` | string (fallback when no slot content) | — |

Toast CSS custom properties:

| Property | Default |
|---|---|
| `--o-toast-bg` | `rgba(255,255,255,0.18)` |
| `--o-toast-border` | `rgba(255,255,255,0.3)` |
| `--o-toast-blur` | `10px` |
| `--o-toast-radius` | `10px` |
| `--o-toast-color` | `#fff` |

Toasts appear **top-right** on desktop and **bottom-center** on mobile. Hover to pause, click ✕ to dismiss.

> ⚠️ `toast()` sets content as `innerHTML` — sanitize any user-generated input before passing it.

---

## Full Example

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@v1.1.0/OWC/dist/components.js"></script>
</head>
<body style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 2rem;">

  <o-panel move>
    <o-button id="save">Save file</o-button>
  </o-panel>

  <script>
    document.getElementById('save').addEventListener('o-click', () => {
      toast('File saved!', 'success')
    })
  </script>

</body>
</html>
```

---

## Development

```bash
bun install
bun dev          # dev server at localhost:5173
bun test         # run tests
bun run build:cdn  # rebuild dist/components.js
```
