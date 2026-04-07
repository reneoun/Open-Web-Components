# o-input, o-skeleton, o-progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `o-input`, `o-skeleton`, and `o-progress` to the OWC library, rebuild the CDN bundle, and demo all three on owc.oun-y.com. Also fix the demo page body text color to `#fff`.

**Architecture:** Three new TypeScript files under `OWC/src/`, each extending `GlassElement` and using `glassBaseStyles()`, following the exact same pattern as `tooltip.ts`, `dropdown.ts`, `tabs.ts`. After all components pass tests, `index.ts` is updated to import+export them, the bundle is rebuilt, the demo page CDN SHA is updated, and the site is redeployed.

**Tech Stack:** TypeScript, Bun (build), Vitest + happy-dom (tests), vanilla Custom Elements + Shadow DOM, nginx:alpine via Dokploy (deploy).

---

## File Map

| Action | Path |
|--------|------|
| Modify | `ai-projects/owc/index.html` — fix body text color (Task 0) |
| Create | `Open-Web-Components/OWC/src/input.ts` |
| Create | `Open-Web-Components/OWC/src/input.test.ts` |
| Create | `Open-Web-Components/OWC/src/skeleton.ts` |
| Create | `Open-Web-Components/OWC/src/skeleton.test.ts` |
| Create | `Open-Web-Components/OWC/src/progress.ts` |
| Create | `Open-Web-Components/OWC/src/progress.test.ts` |
| Modify | `Open-Web-Components/OWC/src/index.ts` — import + export new components, expose `OProgress` on `window` |
| Rebuild | `Open-Web-Components/OWC/dist/components.js` — via `bun run build:cdn` |
| Modify | `ai-projects/owc/index.html` — CDN SHA, nav links, demo sections, JS wiring (Task 5) |

All paths relative to `/home/brouwnie/Documents/Github/`.

---

## Task 0: Fix demo page text color

**Files:**
- Modify: `ai-projects/owc/index.html` (line 16)

- [ ] **Step 1: Change body text color**

In `/home/brouwnie/Documents/Github/ai-projects/owc/index.html`, find:
```
        color: #f0fff4;
```
Replace with:
```
        color: #fff;
```

- [ ] **Step 2: Commit and deploy**

```bash
cd /home/brouwnie/Documents/Github/ai-projects
git add owc/index.html
git commit -m "style(owc-demo): change body text color to #fff"
git push origin main

curl -s -X POST "http://localhost:3000/api/trpc/application.deploy" \
  -H "x-api-key: My_ClaudeskihlpSfynpNyIToHmePaqAIhVWbrEyuPauQdPviEMyhZHKETGlXhzyfWXQkztAYYUk" \
  -H "Content-Type: application/json" \
  -d '{"json":{"applicationId":"E8U4j5cHt_2gr8FvRdIDr"}}'
```

---

## Task 1: o-input component

**Files:**
- Create: `Open-Web-Components/OWC/src/input.ts`
- Create: `Open-Web-Components/OWC/src/input.test.ts`

- [ ] **Step 1: Write failing tests**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/input.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './input'

describe('OInput', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-input')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-input', () => {
    expect(customElements.get('o-input')).toBeDefined()
  })

  it('renders label when label attribute set', () => {
    el.setAttribute('label', 'Name')
    const label = el.shadowRoot.querySelector('label')
    expect(label).not.toBeNull()
    expect(label.textContent).toBe('Name')
  })

  it('does not render label when label attribute absent', () => {
    expect(el.shadowRoot.querySelector('label')).toBeNull()
  })

  it('sets input type from type attribute (default: text)', () => {
    expect(el.shadowRoot.querySelector('input').type).toBe('text')
    el.setAttribute('type', 'password')
    expect(el.shadowRoot.querySelector('input').type).toBe('password')
  })

  it('fires o-input on keystroke with { value }', () => {
    let detail: any = null
    el.addEventListener('o-input', (e: any) => { detail = e.detail })
    const input = el.shadowRoot.querySelector('input')
    input.value = 'hello'
    input.dispatchEvent(new Event('input'))
    expect(detail).toMatchObject({ value: 'hello' })
  })

  it('fires o-change on blur with { value }', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const input = el.shadowRoot.querySelector('input')
    input.value = 'world'
    input.dispatchEvent(new Event('change'))
    expect(detail).toMatchObject({ value: 'world' })
  })

  it('shows error message when error attribute set', () => {
    el.setAttribute('error', 'Required field')
    const msg = el.shadowRoot.querySelector('.error-msg')
    expect(msg).not.toBeNull()
    expect(msg.textContent).toBe('Required field')
  })

  it('does not show error message when error attribute absent', () => {
    expect(el.shadowRoot.querySelector('.error-msg')).toBeNull()
  })

  it('.value getter returns current input value', () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'test'
    expect(el.value).toBe('test')
  })

  it('.value setter updates the input element', () => {
    el.value = 'preset'
    expect(el.shadowRoot.querySelector('input').value).toBe('preset')
  })

  it('disabled attribute disables the input', () => {
    el.setAttribute('disabled', '')
    expect(el.shadowRoot.querySelector('input').disabled).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: failures with "o-input is not defined" or similar.

- [ ] **Step 3: Create the component**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/input.ts`:

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export class OInput extends GlassElement {
  static get observedAttributes() {
    return ['label', 'placeholder', 'type', 'name', 'value', 'disabled', 'error', 'success']
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  get value(): string {
    return this.shadowRoot!.querySelector<HTMLInputElement>('input')?.value
      ?? this.getAttribute('value')
      ?? ''
  }

  set value(v: string) {
    const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')
    if (input) input.value = v
    this.setAttribute('value', v)
  }

  private render() {
    const label       = this.getAttribute('label') ?? ''
    const placeholder = this.getAttribute('placeholder') ?? ''
    const type        = this.getAttribute('type') ?? 'text'
    const name        = this.getAttribute('name') ?? ''
    const value       = this.getAttribute('value') ?? ''
    const disabled    = this.hasAttribute('disabled')
    const error       = this.getAttribute('error') ?? ''
    const success     = this.hasAttribute('success')

    const borderColor = error
      ? 'rgba(239,68,68,0.7)'
      : success
        ? 'rgba(74,222,128,0.7)'
        : 'var(--glass-border)'

    const focusBorder = error ? 'rgba(239,68,68,0.9)' : 'var(--accent-warm)'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .wrap { display: flex; flex-direction: column; gap: 4px; }
        label {
          font-size: 11px;
          font-family: sans-serif;
          color: var(--glass-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        input {
          background: var(--glass-bg);
          border: 1px solid ${borderColor};
          border-radius: 10px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          backdrop-filter: blur(var(--glass-blur));
          transition: border-color 0.15s;
          opacity: ${disabled ? '0.5' : '1'};
          cursor: ${disabled ? 'not-allowed' : 'text'};
        }
        input:focus { border-color: ${focusBorder}; }
        input::placeholder { color: var(--glass-text-dim); }
        .error-msg {
          font-size: 11px;
          color: rgba(239,68,68,0.9);
          font-family: sans-serif;
        }
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ''}
        <input
          type="${type}"
          placeholder="${placeholder}"
          name="${name}"
          value="${value.replace(/"/g, '&quot;')}"
          ${disabled ? 'disabled' : ''}
        />
        ${error ? `<span class="error-msg">${error}</span>` : ''}
      </div>
    `

    const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')!
    input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('o-input', {
        bubbles: true, composed: true, detail: { value: input.value }
      }))
    })
    input.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('o-change', {
        bubbles: true, composed: true, detail: { value: input.value }
      }))
    })
  }
}

customElements.define('o-input', OInput)
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: all `OInput` tests pass. Pre-existing tests continue passing.

- [ ] **Step 5: Commit**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components
git add OWC/src/input.ts OWC/src/input.test.ts
git commit -m "feat: add o-input component with label, validation states, o-input/o-change events"
```

---

## Task 2: o-skeleton component

**Files:**
- Create: `Open-Web-Components/OWC/src/skeleton.ts`
- Create: `Open-Web-Components/OWC/src/skeleton.test.ts`

- [ ] **Step 1: Write failing tests**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/skeleton.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './skeleton'

describe('OSkeleton', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-skeleton')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-skeleton', () => {
    expect(customElements.get('o-skeleton')).toBeDefined()
  })

  it('block variant renders a single .skel element', () => {
    expect(el.shadowRoot.querySelector('.skel')).not.toBeNull()
  })

  it('block variant applies width attribute as inline style', () => {
    el.setAttribute('width', '200px')
    expect(el.shadowRoot.querySelector('.skel').style.width).toBe('200px')
  })

  it('block variant applies height attribute as inline style', () => {
    el.setAttribute('height', '40px')
    expect(el.shadowRoot.querySelector('.skel').style.height).toBe('40px')
  })

  it('table variant renders a .header row', () => {
    el.setAttribute('variant', 'table')
    expect(el.shadowRoot.querySelector('.header')).not.toBeNull()
  })

  it('table variant defaults to 5 body rows', () => {
    el.setAttribute('variant', 'table')
    const rows = el.shadowRoot.querySelectorAll('.row:not(.header)')
    expect(rows.length).toBe(5)
  })

  it('table variant renders correct number of body rows from rows attribute', () => {
    el.setAttribute('variant', 'table')
    el.setAttribute('rows', '3')
    const rows = el.shadowRoot.querySelectorAll('.row:not(.header)')
    expect(rows.length).toBe(3)
  })

  it('panel variant renders .title element', () => {
    el.setAttribute('variant', 'panel')
    expect(el.shadowRoot.querySelector('.title')).not.toBeNull()
  })

  it('panel variant renders two .line elements', () => {
    el.setAttribute('variant', 'panel')
    expect(el.shadowRoot.querySelectorAll('.line').length).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: failures with "o-skeleton is not defined" or similar.

- [ ] **Step 3: Create the component**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/skeleton.ts`:

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export class OSkeleton extends GlassElement {
  static get observedAttributes() {
    return ['variant', 'width', 'height', 'radius', 'rows']
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  private get variant() { return this.getAttribute('variant') ?? 'block' }

  private pulseCSS() {
    return `
      @keyframes o-pulse {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.9; }
      }
      .skel {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--skel-r, 6px);
        animation: o-pulse 1.4s ease-in-out infinite;
        backdrop-filter: blur(var(--glass-blur));
      }
    `
  }

  private render() {
    const v = this.variant
    if (v === 'table') this.renderTable()
    else if (v === 'panel') this.renderPanel()
    else this.renderBlock()
  }

  private renderBlock() {
    const w = this.getAttribute('width')  ?? '100%'
    const h = this.getAttribute('height') ?? '1em'
    const r = this.getAttribute('radius') ?? '6px'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
      </style>
      <div class="skel" style="width:${w};height:${h};--skel-r:${r}"></div>
    `
  }

  private renderTable() {
    const rows = Math.max(1, parseInt(this.getAttribute('rows') ?? '5'))
    const colWidths = ['25%', '30%', '20%', '15%']

    const headerCells = colWidths
      .map(w => `<div class="skel cell" style="width:${w}"></div>`)
      .join('')

    const bodyRows = Array.from({ length: rows }, () =>
      colWidths
        .map(w => `<div class="skel cell" style="width:${w}"></div>`)
        .join('')
    ).map(cells => `<div class="row">${cells}</div>`).join('')

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
        .table { display: flex; flex-direction: column; gap: 8px; }
        .row {
          display: flex; gap: 12px; align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .header .cell { height: 12px; }
        .cell { height: 14px; }
      </style>
      <div class="table">
        <div class="row header">${headerCells}</div>
        ${bodyRows}
      </div>
    `
  }

  private renderPanel() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
        .panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          backdrop-filter: blur(var(--glass-blur));
          padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .title { height: 18px; width: 55%; }
        .line  { height: 13px; }
        .short { width: 70%; }
      </style>
      <div class="panel">
        <div class="skel title"></div>
        <div class="skel line"></div>
        <div class="skel line short"></div>
      </div>
    `
  }
}

customElements.define('o-skeleton', OSkeleton)
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: all `OSkeleton` tests pass.

- [ ] **Step 5: Commit**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components
git add OWC/src/skeleton.ts OWC/src/skeleton.test.ts
git commit -m "feat: add o-skeleton component with block, table, and panel variants"
```

---

## Task 3: o-progress component

**Files:**
- Create: `Open-Web-Components/OWC/src/progress.ts`
- Create: `Open-Web-Components/OWC/src/progress.test.ts`

- [ ] **Step 1: Write failing tests**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/progress.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { OProgress } from './progress'
import './progress'

describe('OProgress', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-progress')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('registers as o-progress', () => {
    expect(customElements.get('o-progress')).toBeDefined()
  })

  it('bar starts at 0% width', () => {
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('0%')
  })

  it('value attribute sets bar width', () => {
    el.setAttribute('value', '60')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('60%')
  })

  it('value attribute clamps to 0-100', () => {
    el.setAttribute('value', '150')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('100%')
    el.setAttribute('value', '-10')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('0%')
  })

  it('OProgress.set() sets bar width', () => {
    OProgress.set(75)
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('75%')
  })

  it('OProgress.set() clamps above 100 to 100%', () => {
    OProgress.set(200)
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('100%')
  })

  it('OProgress.done() sets bar to 100%', () => {
    OProgress.done()
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('100%')
  })

  it('OProgress.start() does not throw', () => {
    expect(() => OProgress.start()).not.toThrow()
    OProgress.done()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: failures with "OProgress is not defined" or similar.

- [ ] **Step 3: Create the component**

Create `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/progress.ts`:

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export class OProgress extends GlassElement {
  private _value = 0
  private _timer: ReturnType<typeof setInterval> | null = null
  private _hideTimer: ReturnType<typeof setTimeout> | null = null

  static get observedAttributes() { return ['value'] }

  connectedCallback() { this.render() }

  attributeChangedCallback(name: string, _old: string, next: string) {
    if (name === 'value' && this.isConnected) {
      this._setValue(Math.min(100, Math.max(0, parseFloat(next) || 0)))
    }
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          display: block;
          pointer-events: none;
        }
        .bar {
          height: 3px;
          width: 0%;
          background: rgba(74,222,128,0.85);
          box-shadow: 0 0 8px rgba(74,222,128,0.5);
          transition: width 0.2s ease, opacity 0.3s ease;
          opacity: 1;
        }
      </style>
      <div class="bar"></div>
    `
  }

  private _bar(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.bar') ?? null
  }

  private _setValue(v: number) {
    this._value = v
    const bar = this._bar()
    if (!bar) return
    bar.style.opacity = '1'
    bar.style.width = `${v}%`
    if (v >= 100) {
      if (this._hideTimer) clearTimeout(this._hideTimer)
      this._hideTimer = setTimeout(() => {
        bar.style.opacity = '0'
        setTimeout(() => { bar.style.width = '0%'; this._value = 0 }, 300)
      }, 400)
    }
  }

  private _stopAuto() {
    if (this._timer) { clearInterval(this._timer); this._timer = null }
  }

  static start() {
    const el = OProgress._getInstance()
    el._stopAuto()
    el._timer = setInterval(() => {
      const remaining = 90 - el._value
      if (remaining <= 0) { el._stopAuto(); return }
      const step = Math.random() * Math.min(remaining * 0.1, 5) + 0.5
      el._setValue(Math.min(89, el._value + step))
    }, 300)
  }

  static set(v: number) {
    OProgress._getInstance()._setValue(Math.min(100, Math.max(0, v)))
  }

  static done() {
    const el = OProgress._getInstance()
    el._stopAuto()
    el._setValue(100)
  }

  private static _getInstance(): OProgress {
    let el = document.querySelector<OProgress>('o-progress')
    if (!el) {
      el = document.createElement('o-progress') as OProgress
      document.body.appendChild(el)
    }
    return el
  }
}

customElements.define('o-progress', OProgress)
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: all `OProgress` tests pass. Full suite green.

- [ ] **Step 5: Commit**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components
git add OWC/src/progress.ts OWC/src/progress.test.ts
git commit -m "feat: add o-progress top-of-page loading bar with static API and value attribute"
```

---

## Task 4: Wire into index.ts and rebuild CDN bundle

**Files:**
- Modify: `Open-Web-Components/OWC/src/index.ts`
- Rebuild: `Open-Web-Components/OWC/dist/components.js`

- [ ] **Step 1: Update index.ts**

Replace the full contents of `/home/brouwnie/Documents/Github/Open-Web-Components/OWC/src/index.ts` with:

```typescript
import './core'
import './table'
import './note'
import './dialog'
import { toast } from './toast'
import './toggle'
import './search'
import './tooltip'
import './dropdown'
import './tabs'
import './input'
import './skeleton'
import { OProgress } from './progress'
import './progress'

export * from './glass'
export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'
export * from './note'
export * from './dialog'
export * from './tooltip'
export * from './dropdown'
export * from './tabs'
export * from './input'
export * from './skeleton'
export * from './progress'

// Expose globals for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
  ;(window as any).OProgress = OProgress
}
```

- [ ] **Step 2: Run full test suite — verify nothing broke**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 3: Rebuild CDN bundle**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components/OWC && bun run build:cdn
```

Expected: `dist/components.js` updated with no errors.

- [ ] **Step 4: Commit and get new SHA**

```bash
cd /home/brouwnie/Documents/Github/Open-Web-Components
git add OWC/src/index.ts OWC/dist/components.js
git commit -m "release: v1.3.0 — add o-input, o-skeleton, o-progress"
git tag v1.3.0
git push origin main --tags
git rev-parse HEAD
```

Save the full commit SHA printed by `git rev-parse HEAD` — you'll need it in Task 5.

---

## Task 5: Update demo page

**Files:**
- Modify: `ai-projects/owc/index.html`

- [ ] **Step 1: Update the CDN script tag**

In `/home/brouwnie/Documents/Github/ai-projects/owc/index.html`, find:
```
    <script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@fffaf4bdb8b36236b011fc46bab312f109c88a28/OWC/dist/components.js"></script>
```
Replace `fffaf4bdb8b36236b011fc46bab312f109c88a28` with the SHA from Task 4 Step 4.

Also update the same SHA in the two places it appears in the page body (the `<div class="code">` snippet and its `data-copy` attribute).

- [ ] **Step 2: Add o-progress element at the top of body**

After `<div id="scroll-progress"></div>`, add:
```html
    <o-progress></o-progress>
```

- [ ] **Step 3: Add nav links**

Find:
```html
      <a href="#section-tabs">o-tabs</a>
      <span class="sep">·</span>
      <a href="#section-combined">Combined</a>
```
Replace with:
```html
      <a href="#section-tabs">o-tabs</a>
      <span class="sep">·</span>
      <a href="#section-input">o-input</a>
      <span class="sep">·</span>
      <a href="#section-skeleton">o-skeleton</a>
      <span class="sep">·</span>
      <a href="#section-progress">o-progress</a>
      <span class="sep">·</span>
      <a href="#section-combined">Combined</a>
```

- [ ] **Step 4: Update component count stat**

Find:
```html
      <div class="stat"><span class="val" id="stat-components">11</span><span class="lbl">Components</span></div>
```
Replace with:
```html
      <div class="stat"><span class="val" id="stat-components">14</span><span class="lbl">Components</span></div>
```

- [ ] **Step 5: Add o-input demo section**

Find `<!-- Combined: o-search + o-table + pagination -->` and insert the following block immediately before it:

```html
    <!-- o-input -->
    <h2 id="section-input">o-input</h2>
    <p class="desc">Glassmorphic text input with optional static label and validation states. Fires <code>o-input</code> on every keystroke and <code>o-change</code> on blur.</p>
    <div class="row" style="align-items:flex-start;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:180px;max-width:240px">
        <div class="ks-label" style="margin-bottom:6px">Default</div>
        <o-input id="demo-input-default" label="Full name" placeholder="Alice Smith" style="display:block"></o-input>
      </div>
      <div style="flex:1;min-width:180px;max-width:240px">
        <div class="ks-label" style="margin-bottom:6px">Error state</div>
        <o-input label="Email" placeholder="name@example.com" error="Invalid email address" style="display:block"></o-input>
      </div>
      <div style="flex:1;min-width:180px;max-width:240px">
        <div class="ks-label" style="margin-bottom:6px">Success state</div>
        <o-input label="Username" value="reneoun" success style="display:block"></o-input>
      </div>
      <div style="flex:1;min-width:180px;max-width:240px">
        <div class="ks-label" style="margin-bottom:6px">Disabled</div>
        <o-input label="API key" value="sk-••••••••" disabled style="display:block"></o-input>
      </div>
    </div>
    <div id="input-log" style="margin-top:10px;font-size:12px;opacity:0.6;font-family:monospace;min-height:18px"></div>
    <div class="code-wrap"><div class="code">&lt;o-input label="Name" placeholder="Alice"&gt;&lt;/o-input&gt;
&lt;o-input label="Email" error="Invalid email"&gt;&lt;/o-input&gt;
&lt;o-input label="User" success&gt;&lt;/o-input&gt;
&lt;o-input label="Key" disabled&gt;&lt;/o-input&gt;

input.addEventListener('o-input',  e =&gt; console.log(e.detail)) // { value }
input.addEventListener('o-change', e =&gt; console.log(e.detail)) // { value }</div>
      <button class="copy-btn" data-copy='<o-input label="Name" placeholder="Alice"></o-input>
input.addEventListener("o-input", e => console.log(e.detail))'>Copy</button>
    </div>

    <!-- o-skeleton -->
    <h2 id="section-skeleton">o-skeleton</h2>
    <p class="desc">Pulsing glassmorphic placeholder for loading states. Three variants: <code>block</code> (default), <code>table</code> (matches <code>o-table</code>), and <code>panel</code> (matches <code>o-panel</code>). Swap in wherever content is loading.</p>
    <div class="row" style="align-items:flex-start;gap:24px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px;max-width:280px">
        <div class="ks-label" style="margin-bottom:8px">Panel variant</div>
        <div id="skel-panel-wrap"><o-skeleton variant="panel" style="display:block"></o-skeleton></div>
        <div id="real-panel-wrap" style="display:none">
          <o-panel>
            <strong>Loaded content</strong>
            <p style="margin:8px 0 0;opacity:0.8;font-size:13px">This replaced the skeleton after 2s.</p>
          </o-panel>
        </div>
      </div>
      <div style="flex:2;min-width:280px">
        <div class="ks-label" style="margin-bottom:8px">Table variant</div>
        <div id="skel-table-wrap"><o-skeleton variant="table" rows="4" style="display:block"></o-skeleton></div>
        <div id="real-table-wrap" style="display:none">
          <o-table id="skel-demo-table"></o-table>
        </div>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <o-button id="btn-skel-simulate">Simulate load (2s)</o-button>
      <o-button id="btn-skel-reset">Reset</o-button>
      <span id="skel-status" style="font-size:12px;opacity:0.6"></span>
    </div>
    <div style="margin-top:12px">
      <div class="ks-label" style="margin-bottom:6px">Block variant (custom size)</div>
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <o-skeleton width="120px" height="36px" radius="10px"></o-skeleton>
        <o-skeleton width="80px"  height="36px" radius="18px"></o-skeleton>
        <o-skeleton width="200px" height="14px" radius="4px"></o-skeleton>
      </div>
    </div>
    <div class="code-wrap"><div class="code">&lt;!-- block (default) --&gt;
&lt;o-skeleton width="200px" height="40px" radius="10px"&gt;&lt;/o-skeleton&gt;

&lt;!-- while o-table loads --&gt;
&lt;o-skeleton variant="table" rows="5"&gt;&lt;/o-skeleton&gt;

&lt;!-- while o-panel loads --&gt;
&lt;o-skeleton variant="panel"&gt;&lt;/o-skeleton&gt;</div>
      <button class="copy-btn" data-copy='<o-skeleton variant="table" rows="5"></o-skeleton>'>Copy</button>
    </div>

    <!-- o-progress -->
    <h2 id="section-progress">o-progress</h2>
    <p class="desc">Fixed top-of-page loading bar. Use the static API or set the <code>value</code> attribute (0–100). Calling <code>OProgress.done()</code> or setting <code>value="100"</code> animates to full width then fades out automatically.</p>
    <div class="row" style="gap:10px;flex-wrap:wrap">
      <o-button id="btn-prog-start">Start</o-button>
      <o-button id="btn-prog-50">Set 50%</o-button>
      <o-button id="btn-prog-75">Set 75%</o-button>
      <o-button id="btn-prog-done">Done</o-button>
    </div>
    <div style="margin-top:14px">
      <div class="ks-label" style="margin-bottom:6px">Value attribute (drag to set)</div>
      <div class="row" style="gap:12px;align-items:center">
        <input type="range" id="prog-slider" min="0" max="100" value="0" style="width:200px;accent-color:#4ade80">
        <span id="prog-slider-val" style="font-size:12px;opacity:0.6;font-family:monospace;min-width:32px">0%</span>
      </div>
    </div>
    <div class="code-wrap"><div class="code">&lt;o-progress&gt;&lt;/o-progress&gt;

// Static API (works without a JS reference)
OProgress.start()    // auto-increments slowly
OProgress.set(60)    // jump to 60%
OProgress.done()     // shoot to 100% then fade out

// Attribute API
document.querySelector('o-progress').setAttribute('value', '75')</div>
      <button class="copy-btn" data-copy="OProgress.start()
OProgress.set(60)
OProgress.done()">Copy</button>
    </div>

```

- [ ] **Step 6: Add JavaScript wiring for all three new sections**

Find the closing `</script>` tag (at the very end, after the o-dropdown/o-tabs event wiring) and insert the following block immediately before it:

```javascript
      // ── o-input demo ────────────────────────────────────────────
      const inputLog = document.getElementById('input-log')
      const demoInputDefault = document.getElementById('demo-input-default')
      demoInputDefault.addEventListener('o-input', e => {
        inputLog.textContent = `o-input → "${e.detail.value}"`
        logEvent('o-input', e.detail)
      })
      demoInputDefault.addEventListener('o-change', e => {
        logEvent('o-change', e.detail)
      })

      // ── o-skeleton demo ──────────────────────────────────────────
      const skelPanelWrap = document.getElementById('skel-panel-wrap')
      const realPanelWrap = document.getElementById('real-panel-wrap')
      const skelTableWrap = document.getElementById('skel-table-wrap')
      const realTableWrap = document.getElementById('real-table-wrap')
      const skelStatus    = document.getElementById('skel-status')
      const skelDemoTable = document.getElementById('skel-demo-table')

      skelDemoTable.columns = [
        { key: 'name', label: 'Name', width: 140, sortable: true },
        { key: 'role', label: 'Role', width: 140 },
        { key: 'score', label: 'Score', width: 80, sortable: true },
      ]
      skelDemoTable.data = [
        { name: 'Alice',   role: 'Engineer',  score: 94 },
        { name: 'Bob',     role: 'Designer',  score: 87 },
        { name: 'Carol',   role: 'PM',        score: 91 },
        { name: 'Dave',    role: 'QA',        score: 82 },
      ]

      let skelLoading = false
      document.getElementById('btn-skel-simulate').addEventListener('o-click', () => {
        if (skelLoading) return
        skelLoading = true
        skelStatus.textContent = 'Loading…'
        skelPanelWrap.style.display = ''
        realPanelWrap.style.display = 'none'
        skelTableWrap.style.display = ''
        realTableWrap.style.display = 'none'
        OProgress.start()
        setTimeout(() => {
          skelPanelWrap.style.display = 'none'
          realPanelWrap.style.display = ''
          skelTableWrap.style.display = 'none'
          realTableWrap.style.display = ''
          skelStatus.textContent = 'Loaded!'
          skelLoading = false
          OProgress.done()
        }, 2000)
      })
      document.getElementById('btn-skel-reset').addEventListener('o-click', () => {
        skelPanelWrap.style.display = ''
        realPanelWrap.style.display = 'none'
        skelTableWrap.style.display = ''
        realTableWrap.style.display = 'none'
        skelStatus.textContent = ''
        skelLoading = false
      })

      // ── o-progress demo ──────────────────────────────────────────
      document.getElementById('btn-prog-start').addEventListener('o-click', () => OProgress.start())
      document.getElementById('btn-prog-50').addEventListener('o-click',    () => OProgress.set(50))
      document.getElementById('btn-prog-75').addEventListener('o-click',    () => OProgress.set(75))
      document.getElementById('btn-prog-done').addEventListener('o-click',  () => OProgress.done())

      const progSlider    = document.getElementById('prog-slider')
      const progSliderVal = document.getElementById('prog-slider-val')
      progSlider.addEventListener('input', () => {
        const v = parseInt(progSlider.value)
        progSliderVal.textContent = `${v}%`
        document.querySelector('o-progress').setAttribute('value', String(v))
      })
```

- [ ] **Step 7: Commit, push and deploy**

```bash
cd /home/brouwnie/Documents/Github/ai-projects
git add owc/index.html
git commit -m "feat(owc-demo): add o-input, o-skeleton, o-progress demos; update CDN to v1.3.0"
git push origin main

curl -s -X POST "http://localhost:3000/api/trpc/application.deploy" \
  -H "x-api-key: My_ClaudeskihlpSfynpNyIToHmePaqAIhVWbrEyuPauQdPviEMyhZHKETGlXhzyfWXQkztAYYUk" \
  -H "Content-Type: application/json" \
  -d '{"json":{"applicationId":"E8U4j5cHt_2gr8FvRdIDr"}}'
```

Expected: site redeploys with all three new components demoed.
