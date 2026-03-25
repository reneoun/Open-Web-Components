# Toast Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an `<o-toast>` glassmorphism web component with auto-dismiss, 4 types, slot content, and a `toast()` imperative helper.

**Architecture:** Single `src/toast.ts` file exporting `OWCToast`, `toast()`, and `ToastType`. The element uses shadow DOM. A module-level `toast()` function auto-creates a fixed container in `document.body` and stacks toasts inside it.

**Tech Stack:** TypeScript, Vite, Vitest + happy-dom (for tests), native Custom Elements v1 API.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/toast.ts` | `OWCToast` class, `toast()` helper, `ToastType` |
| Create | `src/toast.test.ts` | All tests for toast component |
| Modify | `src/index.ts` | Add `export * from './toast'` |
| Modify | `index.html` | Add demo usage |
| Modify | `package.json` | Add Vitest + happy-dom dev deps + test script |
| Create | `vite.config.ts` | Vitest config (test environment: happy-dom) |

---

## Task 1: Add Vitest

**Files:**
- Modify: `package.json`
- Create: `vite.config.ts`

- [ ] **Step 1: Install deps**

```bash
bun add -d vitest @vitest/ui happy-dom
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
})
```

- [ ] **Step 3: Add test script to `package.json`**

Add inside `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest works**

```bash
bun test
```
Expected: `No test files found` (exit 0 or similar — no errors).

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts package.json bun.lockb
git commit -m "chore: add vitest + happy-dom"
```

---

## Task 2: OWCToast shell — shadow DOM + slot/fallback

**Files:**
- Create: `src/toast.ts`
- Create: `src/toast.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/toast.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import './toast'

describe('OWCToast', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-toast', () => {
    expect(customElements.get('o-toast')).toBeDefined()
  })

  it('projects slot content into shadow DOM', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.innerHTML = '<strong>Hello</strong>'
    document.body.appendChild(el)
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).not.toBeNull()
    expect(el.shadowRoot!.querySelector('#msg')).not.toBeNull()
  })

  it('shows message attribute when no slot content', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'info')
    el.setAttribute('message', 'Fallback text')
    document.body.appendChild(el)
    const msg = el.shadowRoot!.querySelector('#msg') as HTMLElement
    expect(msg.textContent).toBe('Fallback text')
    expect(msg.style.display).not.toBe('none')
  })

  it('hides #msg span when slot content present', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.innerHTML = 'Real content'
    document.body.appendChild(el)
    const msg = el.shadowRoot!.querySelector('#msg') as HTMLElement
    expect(msg.style.display).toBe('none')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
bun test src/toast.test.ts
```
Expected: FAIL (toast.ts doesn't exist yet).

- [ ] **Step 3: Create `src/toast.ts` — shell**

```ts
export type ToastType = 'success' | 'error' | 'warning' | 'info'

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const COLORS: Record<ToastType, string> = {
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
}

export class OWCToast extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'message', 'duration']
  }

  private msgEl!: HTMLSpanElement
  private slot!: HTMLSlotElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this.updateSlotOrFallback()
  }

  attributeChangedCallback(name: string, _old: string, val: string) {
    if (!this.shadowRoot!.firstChild) return // not yet rendered
    if (name === 'type') this.updateAccent()
    if (name === 'message') this.updateSlotOrFallback()
  }

  private render() {
    const type = (this.getAttribute('type') ?? 'info') as ToastType
    const color = COLORS[type] ?? COLORS.info

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          min-width: 220px;
          max-width: 360px;
          padding: 10px 36px 10px 14px;
          border-radius: var(--o-toast-radius, 10px);
          background: var(--o-toast-bg, rgba(255,255,255,0.18));
          border: 1px solid var(--o-toast-border, rgba(255,255,255,0.3));
          backdrop-filter: blur(var(--o-toast-blur, 10px));
          -webkit-backdrop-filter: blur(var(--o-toast-blur, 10px));
          color: var(--o-toast-color, #fff);
          font-family: sans-serif;
          font-size: 14px;
          border-left: 4px solid ${color};
          box-sizing: border-box;
        }
        .icon { margin-right: 8px; font-weight: bold; }
        #msg { display: none; }
        .close {
          position: absolute; top: 6px; right: 8px;
          background: none; border: none; color: inherit;
          cursor: pointer; font-size: 14px; opacity: 0.7; padding: 2px 4px;
        }
        .close:hover { opacity: 1; }
        .progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: ${color}; border-radius: 0 0 var(--o-toast-radius, 10px) var(--o-toast-radius, 10px);
          width: 100%; transform-origin: left;
        }
      </style>
      <span class="icon">${ICONS[type] ?? ICONS.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `

    this.msgEl = this.shadowRoot!.querySelector('#msg')!
    this.slot = this.shadowRoot!.querySelector('slot')!

    this.slot.addEventListener('slotchange', () => this.updateSlotOrFallback())
    this.shadowRoot!.querySelector('.close')!.addEventListener('click', () => this.dismiss())
  }

  private updateSlotOrFallback() {
    if (!this.msgEl || !this.slot) return
    const hasSlot = this.slot.assignedNodes({ flatten: true }).length > 0
    if (hasSlot) {
      this.msgEl.style.display = 'none'
    } else {
      this.msgEl.style.display = ''
      this.msgEl.textContent = this.getAttribute('message') ?? ''
    }
  }

  private updateAccent() {
    // Re-render to apply new accent color (simple approach for v1)
    this.render()
    this.updateSlotOrFallback()
  }

  dismiss() {
    this.remove()
  }
}

customElements.define('o-toast', OWCToast)
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
bun test src/toast.test.ts
```
Expected: all 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/toast.ts src/toast.test.ts
git commit -m "feat: o-toast shell with shadow DOM, slot and fallback"
```

---

## Task 3: Animations + auto-dismiss + hover pause

**Files:**
- Modify: `src/toast.ts`
- Modify: `src/toast.test.ts`

- [ ] **Step 1: Write failing tests**

Add to the `describe` block in `src/toast.test.ts`:

```ts
it('removes itself after duration', async () => {
  vi.useFakeTimers()
  const el = document.createElement('o-toast') as HTMLElement
  el.setAttribute('type', 'success')
  el.setAttribute('duration', '500')
  el.innerHTML = 'Hi'
  document.body.appendChild(el)
  vi.advanceTimersByTime(1200) // duration + fallback timeout
  expect(document.body.contains(el)).toBe(false)
  vi.useRealTimers()
})

it('does not remove itself before duration', () => {
  vi.useFakeTimers()
  const el = document.createElement('o-toast') as HTMLElement
  el.setAttribute('type', 'success')
  el.setAttribute('duration', '3000')
  el.innerHTML = 'Hi'
  document.body.appendChild(el)
  vi.advanceTimersByTime(1000)
  expect(document.body.contains(el)).toBe(true)
  vi.useRealTimers()
})
```

Add `import { vi } from 'vitest'` at top.

- [ ] **Step 2: Run — verify new tests fail**

```bash
bun test src/toast.test.ts
```
Expected: 2 new tests FAIL.

- [ ] **Step 3: Add lifecycle to `OWCToast`**

Add these private fields to the class:

```ts
private timer: ReturnType<typeof setTimeout> | null = null
private startedAt = 0
private elapsed = 0
private durationMs = 3000
```

Replace `connectedCallback` with:

```ts
connectedCallback() {
  this.durationMs = parseInt(this.getAttribute('duration') ?? '3000', 10)
  this.render()
  this.updateSlotOrFallback()
  this.startTimer()
  this.addEventListener('mouseenter', this.onMouseEnter)
  this.addEventListener('mouseleave', this.onMouseLeave)
}

disconnectedCallback() {
  this.clearTimer()
  this.removeEventListener('mouseenter', this.onMouseEnter)
  this.removeEventListener('mouseleave', this.onMouseLeave)
}
```

Add these methods:

```ts
private startTimer(remaining?: number) {
  this.startedAt = Date.now()
  const ms = remaining ?? (this.durationMs - this.elapsed)
  this.timer = setTimeout(() => this.dismiss(), ms)
  // fallback removal: ensures removal even if dismiss animation never fires
  setTimeout(() => { if (this.isConnected) this.remove() }, ms + 600)
}

private clearTimer() {
  if (this.timer !== null) {
    clearTimeout(this.timer)
    this.timer = null
  }
}

private onMouseEnter = () => {
  this.elapsed += Date.now() - this.startedAt
  this.clearTimer()
  this.shadowRoot?.querySelector('.progress')?.classList.add('paused')
}

private onMouseLeave = () => {
  this.startedAt = Date.now()
  this.startTimer(this.durationMs - this.elapsed)
  this.shadowRoot?.querySelector('.progress')?.classList.remove('paused')
}
```

- [ ] **Step 4: Add CSS animations to the `<style>` block inside `render()`**

Add to the style string (append before closing `</style>`):

```css
@media (prefers-reduced-motion: no-preference) {
  :host { animation: slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
  :host(.exiting) { animation: slideOutRight 0.25s ease-in both; }
  @keyframes slideInRight {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
  }
  @media (max-width: 639px) {
    :host { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
    :host(.exiting) { animation: slideDown 0.25s ease-in both; }
    @keyframes slideUp {
      from { transform: translateY(60px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(0);    opacity: 1; }
      to   { transform: translateY(60px); opacity: 0; }
    }
  }
}
.progress {
  animation: shrink linear both;
  animation-duration: var(--_dur, 3000ms);
}
.progress.paused { animation-play-state: paused; }
@keyframes shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
```

Set the `--_dur` CSS variable on the progress bar after `render()`:

```ts
const bar = this.shadowRoot!.querySelector('.progress') as HTMLElement
bar.style.setProperty('--_dur', `${this.durationMs}ms`)
```

Update `dismiss()` to animate before removing:

```ts
dismiss() {
  this.classList.add('exiting')
  this.addEventListener('animationend', () => this.remove(), { once: true })
  // fallback already scheduled in startTimer — no extra timeout needed here
}
```

- [ ] **Step 5: Run all tests**

```bash
bun test src/toast.test.ts
```
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add src/toast.ts src/toast.test.ts
git commit -m "feat: o-toast animations, auto-dismiss, hover pause"
```

---

## Task 4: `toast()` imperative helper + container

**Files:**
- Modify: `src/toast.ts`
- Modify: `src/toast.test.ts`

- [ ] **Step 1: Write failing tests**

Add to `src/toast.test.ts`:

```ts
import { toast } from './toast'

describe('toast() helper', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.head.querySelectorAll('style[data-owc-toast]').forEach(s => s.remove())
    // Reset module-level flag by re-importing (workaround: manipulate DOM directly)
    const container = document.getElementById('o-toast-container')
    container?.remove()
  })

  it('creates container on first call', () => {
    toast('Hello', 'success')
    expect(document.getElementById('o-toast-container')).not.toBeNull()
  })

  it('appends o-toast element', () => {
    toast('Hello', 'success')
    const container = document.getElementById('o-toast-container')!
    expect(container.querySelector('o-toast')).not.toBeNull()
  })

  it('sets content as innerHTML', () => {
    toast('<strong>Hi</strong>', 'error')
    const el = document.querySelector('o-toast')!
    expect(el.innerHTML).toBe('<strong>Hi</strong>')
  })

  it('sets type attribute', () => {
    toast('Hi', 'warning')
    expect(document.querySelector('o-toast')!.getAttribute('type')).toBe('warning')
  })

  it('does not create duplicate containers', () => {
    toast('A', 'info')
    toast('B', 'info')
    expect(document.querySelectorAll('#o-toast-container').length).toBe(1)
  })
})
```

- [ ] **Step 2: Run — verify new tests fail**

```bash
bun test src/toast.test.ts
```
Expected: 5 new FAIL.

- [ ] **Step 3: Add `toast()` to `src/toast.ts`**

Add after the class definition:

```ts
let containerCreated = false

function ensureContainer(): HTMLElement {
  if (!containerCreated || !document.getElementById('o-toast-container')) {
    containerCreated = true

    const style = document.createElement('style')
    style.setAttribute('data-owc-toast', '')
    style.textContent = `
      #o-toast-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        top: 1rem;
        right: 1rem;
        pointer-events: none;
      }
      #o-toast-container > * { pointer-events: all; }
      @media (max-width: 639px) {
        #o-toast-container {
          top: auto; right: auto;
          bottom: 1rem; left: 50%;
          transform: translateX(-50%);
          align-items: center;
        }
      }
    `
    document.head.appendChild(style)

    const container = document.createElement('div')
    container.id = 'o-toast-container'
    document.body.appendChild(container)
  }
  return document.getElementById('o-toast-container')!
}

export function toast(
  content: string,
  type: ToastType,
  options?: { duration?: number }
): void {
  const container = ensureContainer()
  const el = document.createElement('o-toast') as OWCToast & HTMLElement
  el.setAttribute('type', type)
  if (options?.duration !== undefined) {
    el.setAttribute('duration', String(options.duration))
  }
  el.innerHTML = content
  container.appendChild(el)
}
```

Note: `ensureContainer` checks both the flag AND the DOM (`document.getElementById('o-toast-container')`), so removing the container in `beforeEach` is sufficient to reset state for tests. The flag is an optimisation only.

- [ ] **Step 4: Run all tests**

```bash
bun test src/toast.test.ts
```
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add src/toast.ts src/toast.test.ts
git commit -m "feat: toast() imperative helper with auto-container"
```

---

## Task 5: Wire up exports + demo

**Files:**
- Modify: `src/index.ts`
- Modify: `index.html`

- [ ] **Step 1: Update `src/index.ts`**

```ts
import './core'
import './toast'

export * from './core'
export * from './toast'
```

- [ ] **Step 2: Update `index.html` demo**

Replace the `<body>` content with:

```html
<body style="background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; padding: 2rem; font-family: sans-serif;">

  <h1 style="color: white; margin-bottom: 1rem;">OWC Toast Demo</h1>

  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 2rem;">
    <button onclick="toast('File saved successfully!', 'success')" style="padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: #4ade80;">Success</button>
    <button onclick="toast('Connection failed', 'error')" style="padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: #f87171;">Error</button>
    <button onclick="toast('Low disk space', 'warning')" style="padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: #fbbf24;">Warning</button>
    <button onclick="toast('Update available — <a href=\'#\' style=\'color:inherit\'>see changelog</a>', 'info')" style="padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: #60a5fa;">Info (HTML)</button>
    <button onclick="toast('Long toast stays for 8s', 'info', { duration: 8000 })" style="padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; background: white;">8s Toast</button>
  </div>

  <!-- Declarative usage -->
  <o-toast type="success">Declarative toast — <strong>slot content</strong></o-toast>

  <script type="module" src="/src/main.ts"></script>
  <script type="module">
    import { toast } from '/src/toast.ts'
    window.toast = toast
  </script>
</body>
```

- [ ] **Step 3: Run dev server and manually verify**

```bash
bun dev
```

Open http://localhost:5173. Verify:
- Buttons trigger toasts in top-right corner
- Toasts slide in and auto-dismiss
- Progress bar depletes
- Hovering pauses the bar and timer
- Close button works
- Declarative `<o-toast>` appears on load

- [ ] **Step 4: Run full test suite**

```bash
bun test
```
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts index.html
git commit -m "feat: wire o-toast exports and add demo"
```
