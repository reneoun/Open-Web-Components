# Toast / Notification Component — Design Spec

**Date:** 2026-03-25
**Status:** Approved

---

## Overview

A reusable glassmorphism toast/notification web component for OWC. Supports 4 types (success, error, warning, info), rich HTML content via slot, auto-dismiss with progress bar, and responsive positioning. Targets modern browsers (same baseline as the rest of OWC).

---

## Architecture

### Files

- `src/toast.ts` — `OWCToast` custom element + `toast()` helper + `ToastType` type
- `src/index.ts` — add `export * from './toast'` alongside existing `export * from './core'`

### Exported symbols from `toast.ts`

- `OWCToast` — the custom element class
- `toast` — imperative helper function
- `ToastType` — `'success' | 'error' | 'warning' | 'info'`

### Custom Element: `<o-toast>`

Registered as `customElements.define('o-toast', OWCToast)`.

Uses shadow DOM for style encapsulation. (`o-panel` in `core.ts` does not use shadow DOM; this component intentionally does.)

**Content rendering — two paths, never both active simultaneously:**

1. **Slot path (default):** shadow root contains a `<slot>`. Light DOM children are projected through it. Used when the element has children (declarative HTML or imperative `innerHTML`).
2. **Fallback span path:** a `<span id="msg">` in the shadow root, hidden by default. Shown only when slot is empty (attribute-only usage).

**Slot/fallback logic in `connectedCallback`:**
- Synchronously check `slot.assignedNodes({ flatten: true })`. If non-empty → slot path active, fallback span hidden.
- If empty → fallback span shows `this.getAttribute('message')`.
- Attach `slotchange` listener to handle dynamic changes: re-run the same check on each `slotchange`.

**`attributeChangedCallback` behaviour:**
- `message`: if slot is currently empty, update the fallback span text. If slot has content, no-op.
- `duration`: no-op after `connectedCallback` — changing duration after the timer has started has no effect.
- `type`: update the accent color class and icon on the shadow root wrapper.

**Observed attributes:** `type`, `message`, `duration`

**Default `duration`:** `3000` ms — used both by `toast()` and by the element itself when no `duration` attribute is present. Read once at `connectedCallback` via `parseInt(this.getAttribute('duration') ?? '3000', 10)`.

```html
<!-- slot path -->
<o-toast type="success">
  <strong>Saved!</strong> Your file is ready.
</o-toast>

<!-- attribute fallback path -->
<o-toast type="error" message="Connection failed" duration="5000"></o-toast>
```

### Imperative Helper: `toast()`

```ts
function toast(content: string, type: ToastType, options?: { duration?: number }): void
```

- `content` — plain text or HTML string, set via `el.innerHTML` (light DOM). Routes through the `<slot>` naturally. **Caller is responsible for sanitizing HTML.**
- `type` — `ToastType`
- `options.duration` — ms (default: `3000`)

**Container creation (idempotent):** guarded by a module-level boolean flag `containerCreated`. On first call: inject positioning `<style>` into `document.head` and append `<div id="o-toast-container">` to `document.body`. This is a single-document, single-frame contract — multi-frame or framework teardown scenarios are out of scope.

---

## Layout & Positioning

```css
#o-toast-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
  top: 1rem;
  right: 1rem;
}
@media (max-width: 639px) {
  #o-toast-container {
    top: auto;
    right: auto;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  }
}
```

---

## Visual Design

**Style:** Glassmorphism

CSS custom properties (overridable on host):

| Property | Default |
|---|---|
| `--o-toast-bg` | `rgba(255,255,255,0.18)` |
| `--o-toast-border` | `rgba(255,255,255,0.3)` |
| `--o-toast-blur` | `10px` |
| `--o-toast-radius` | `10px` |
| `--o-toast-color` | `#fff` |

**Type accents** (left border + icon):

| Type | Color | Icon |
|---|---|---|
| success | `#4ade80` | ✓ |
| error | `#f87171` | ✕ |
| warning | `#fbbf24` | ⚠ |
| info | `#60a5fa` | ℹ |

**Close button:** always rendered (top-right corner). Clicking triggers immediate exit.

**Progress bar:** thin line at bottom depleting over `duration`. Pauses on hover via CSS `animation-play-state: paused` (see Behaviour).

---

## Animations & Reduced Motion

All `@keyframes` defined inside shadow DOM `<style>`.

| Context | Enter | Exit |
|---|---|---|
| Desktop (>= 640px) | Slide in from right, spring easing | Slide out to right |
| Mobile (< 640px) | Slide up from bottom, spring easing | Slide down |

**`prefers-reduced-motion`:** wrap all animation declarations in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred, skip enter/exit animations entirely — the element appears/disappears instantly. The auto-dismiss timer still runs normally.

Exit is triggered by adding class `.exiting`. On `animationend`, call `this.remove()`. **Fallback:** always also schedule `setTimeout(() => this.remove(), duration + 600)` to guarantee removal if `animationend` never fires (e.g. reduced motion, animation disabled, or element detached before animation completes).

---

## Behaviour

**Timer and hover-pause:**

```
connectedCallback:
  startedAt = Date.now()
  elapsed = 0
  scheduleTimer(duration)

mouseenter:
  elapsed += Date.now() - startedAt
  clearTimeout(timer)
  set animation-play-state: paused on progress bar + shadow wrapper

mouseleave:
  startedAt = Date.now()
  scheduleTimer(duration - elapsed)
  set animation-play-state: running

scheduleTimer(ms):
  timer = setTimeout(dismiss, ms)
```

Progress bar CSS animation duration is set to the full `duration` value. Its `animation-play-state` is toggled via a CSS class (e.g. `.paused`) added/removed on the shadow root wrapper — this keeps the pause mechanic fully in CSS for the bar, in sync with the JS timer pause.

**Dismiss:**
- Adds `.exiting` class → exit animation plays → `animationend` → `this.remove()`
- Fallback `setTimeout` (duration + 600ms) ensures removal even if `animationend` never fires

**Stacking:** each toast manages its own lifecycle independently.

---

## Public API Summary

```ts
type ToastType = 'success' | 'error' | 'warning' | 'info'

// Imperative (caller sanitizes HTML content)
toast('Saved!', 'success')
toast('<strong>Error:</strong> Could not connect', 'error', { duration: 5000 })

// Declarative — slot path
// <o-toast type="warning" duration="4000">Low disk space</o-toast>

// Declarative — attribute fallback
// <o-toast type="info" message="Fallback text"></o-toast>
```

---

## Out of Scope

- Toast queue limit — not enforced in v1
- Custom themes beyond CSS custom properties
- Multi-frame / multi-document usage
