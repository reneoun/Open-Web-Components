# Toggle Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `<o-toggle>` glassmorphism segmented control with sliding pill indicator, single-select, 2+ options.

**Architecture:** Single `src/toggle.ts`. Shadow DOM. Click listener attached once in constructor. Options resolved via JS property > child elements > attribute. Indicator position uses pure CSS `calc(100% / N)` — no `offsetWidth`.

**Tech Stack:** TypeScript, Vite, Vitest + happy-dom.

---

## Types & API Reference

```ts
export interface OToggleOption { label: string; value: string }
export interface OToggleChangeEvent { value: string; index: number; prev: string | null }
```

**Attributes:** `options` (comma-separated), `value`
**Properties:** `options: string[] | OToggleOption[]`, `value: string`
**Event:** `o-change` (bubbles, composed) — detail: `{ value, index, prev }`

Option priority: JS property > child elements (at connectedCallback, if _options empty) > attribute.

---

## Task 1: Shell — register element and render segments

**Files:**
- Create: `src/toggle.ts`
- Create: `src/toggle.test.ts`

- [ ] Write failing tests in `src/toggle.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import './toggle'

describe('OToggle', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-toggle')
    document.body.appendChild(el)
  })

  it('registers as o-toggle', () => {
    expect(customElements.get('o-toggle')).toBeDefined()
  })

  it('renders segments from options attribute', () => {
    el.setAttribute('options', 'Day,Week,Month')
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(3)
    expect(segments[0].textContent?.trim()).toBe('Day')
    expect(segments[2].textContent?.trim()).toBe('Month')
  })

  it('renders from JS options string array', () => {
    ;(el as any).options = ['Day', 'Week', 'Month']
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(3)
  })

  it('renders from JS options object array', () => {
    ;(el as any).options = [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }]
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(2)
    expect(segments[0].textContent?.trim()).toBe('Day')
  })

  it('reads options from child elements at connectedCallback', () => {
    document.body.innerHTML = ''
    const parent = document.createElement('div')
    parent.innerHTML = `
      <o-toggle>
        <span value="day">Day</span>
        <span value="week">Week</span>
      </o-toggle>
    `
    document.body.appendChild(parent)
    const toggle = parent.querySelector('o-toggle')!
    const segments = toggle.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(2)
    expect(segments[1].textContent?.trim()).toBe('Week')
  })

  it('renders empty with 0 options, no error', () => {
    ;(el as any).options = []
    expect(() => el.shadowRoot!.querySelectorAll('.segment')).not.toThrow()
    expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(0)
  })

  it('renders single segment with 1 option', () => {
    ;(el as any).options = ['Only']
    expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(1)
  })
})
```

- [ ] Run — verify FAIL:
```bash
bun run test src/toggle.test.ts
```
Expected: `Cannot find module './toggle'`

- [ ] Create `src/toggle.ts` shell:

```ts
export interface OToggleOption { label: string; value: string }
export interface OToggleChangeEvent { value: string; index: number; prev: string | null }

function toOptions(input: (string | OToggleOption)[]): OToggleOption[] {
  return input.map(o =>
    typeof o === 'string' ? { label: o, value: o.toLowerCase() } : o
  )
}

export class OToggle extends HTMLElement {
  static get observedAttributes() { return ['options', 'value'] }

  private _options: OToggleOption[] = []
  private _value: string | null = null

  get options() { return this._options }
  set options(v: (string | OToggleOption)[]) {
    this._options = toOptions(v)
    // preserve or reset value
    if (this._value && !this._options.find(o => o.value === this._value)) {
      this._value = this._options[0]?.value ?? null
    }
    // initialize value if still unset
    if (!this._value) this._value = this._options[0]?.value ?? null
    this.render()
  }

  get value() { return this._value ?? '' }
  set value(v: string) {
    if (!this._options.find(o => o.value === v)) return // unknown value: no-op
    this._value = v
    this.setAttribute('value', v)
    this.render()
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.addEventListener('click', this.handleClick)
  }

  connectedCallback() {
    // child elements: only if _options still empty
    if (this._options.length === 0) {
      const children = [...this.querySelectorAll('[value]')] as HTMLElement[]
      if (children.length > 0) {
        this._options = children.map(c => ({
          label: c.textContent?.trim() ?? '',
          value: c.getAttribute('value') ?? ''
        }))
      }
    }
    // attribute fallback
    if (this._options.length === 0) {
      const attr = this.getAttribute('options')
      if (attr) this._options = toOptions(attr.split(',').map(s => s.trim()))
    }
    // default value
    if (!this._value) this._value = this._options[0]?.value ?? null
    this.render()
  }

  attributeChangedCallback(name: string, _old: string | null, val: string | null) {
    if (name === 'options' && val !== null) {
      const parsed = toOptions(val.split(',').map(s => s.trim()))
      if (this._value && !parsed.find(o => o.value === this._value)) {
        this._value = parsed[0]?.value ?? null
      }
      this._options = parsed
      this.render()
    }
    if (name === 'value' && val !== null) {
      if (this._options.find(o => o.value === val)) {
        this._value = val
        this.render()
      }
    }
  }

  private handleClick = (e: MouseEvent) => {
    const segments = [...this.shadowRoot!.querySelectorAll<HTMLElement>('.segment')]
    const idx = segments.findIndex(s => s.contains(e.target as Node))
    if (idx === -1) return
    const opt = this._options[idx]
    if (!opt || opt.value === this._value) return // no-op: same or 1-option
    if (this._options.length <= 1) return
    const prev = this._value
    this._value = opt.value
    this.setAttribute('value', opt.value)
    this.render()
    this.dispatchEvent(new CustomEvent<OToggleChangeEvent>('o-change', {
      bubbles: true, composed: true,
      detail: { value: opt.value, index: idx, prev }
    }))
  }

  private render() {
    if (!this.shadowRoot) return
    const n = this._options.length
    const idx = this._options.findIndex(o => o.value === this._value)

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        .container {
          display: inline-flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 3px;
          position: relative;
          user-select: none;
          --n: ${n};
          --idx: ${idx >= 0 ? idx : 0};
        }
        .indicator {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / var(--n));
          background: rgba(255,255,255,0.25);
          border-radius: 999px;
          transform: translateX(calc(var(--idx) * 100%));
          transition: transform 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .segment {
          flex: 1;
          min-width: 48px;
          padding: 6px 14px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: 999px;
        }
        .segment.active { font-weight: 600; }
      </style>
      <div class="container">
        ${n > 0 ? '<div class="indicator"></div>' : ''}
        ${this._options.map((o, i) =>
          `<div class="segment${o.value === this._value ? ' active' : ''}" data-value="${o.value}">${o.label}</div>`
        ).join('')}
      </div>
    `
  }
}

customElements.define('o-toggle', OToggle)
```

- [ ] Run — verify PASS:
```bash
bun run test src/toggle.test.ts
```
Expected: all 6 shell tests pass.

- [ ] `git add src/toggle.ts src/toggle.test.ts && git commit -m "feat: o-toggle shell with segment rendering"`

---

## Task 2: Value, selection state, and o-change event

**Files:**
- Modify: `src/toggle.test.ts`

- [ ] Add failing tests to the `describe` block:

```ts
it('defaults value to first option, no event fired', () => {
  let fired = false
  el.addEventListener('o-change', () => { fired = true })
  ;(el as any).options = ['Day', 'Week']
  expect((el as any).value).toBe('day')
  expect(fired).toBe(false)
})

it('value property reflects current selection', () => {
  ;(el as any).options = ['Day', 'Week', 'Month']
  expect((el as any).value).toBe('day')
  ;(el as any).value = 'week'
  expect((el as any).value).toBe('week')
})

it('setting value does not fire o-change', () => {
  ;(el as any).options = ['Day', 'Week']
  let fired = false
  el.addEventListener('o-change', () => { fired = true })
  ;(el as any).value = 'week'
  expect(fired).toBe(false)
})

it('setting value to unknown string: no-op', () => {
  ;(el as any).options = ['Day', 'Week']
  ;(el as any).value = 'day'
  ;(el as any).value = 'unknown'
  expect((el as any).value).toBe('day')
})

it('clicking a segment fires o-change with correct detail', () => {
  ;(el as any).options = ['Day', 'Week', 'Month']
  let detail: any = null
  el.addEventListener('o-change', (e: any) => { detail = e.detail })
  const segments = el.shadowRoot!.querySelectorAll<HTMLElement>('.segment')
  segments[1].click()
  expect(detail).not.toBeNull()
  expect(detail.value).toBe('week')
  expect(detail.index).toBe(1)
  expect(detail.prev).toBe('day')
})

it('clicking already-selected segment does not fire o-change', () => {
  ;(el as any).options = ['Day', 'Week']
  let fired = false
  el.addEventListener('o-change', () => { fired = true })
  const segments = el.shadowRoot!.querySelectorAll<HTMLElement>('.segment')
  segments[0].click() // already selected
  expect(fired).toBe(false)
})

it('1 option: clicking does not fire o-change', () => {
  ;(el as any).options = ['Only']
  let fired = false
  el.addEventListener('o-change', () => { fired = true })
  el.shadowRoot!.querySelector<HTMLElement>('.segment')!.click()
  expect(fired).toBe(false)
})
```

- [ ] Run — these tests should PASS immediately (shell from Task 1 already implements this logic):
```bash
bun run test src/toggle.test.ts
```
Expected: all tests pass. If any fail, fix the specific behavior in `src/toggle.ts` before committing.

- [ ] `git add src/toggle.ts src/toggle.test.ts && git commit -m "feat: o-toggle value state and o-change event"`

---

## Task 3: Dynamic options + attribute reactivity

**Files:**
- Modify: `src/toggle.test.ts`

- [ ] Add failing tests:

```ts
it('changing options preserves value if still in new set', () => {
  ;(el as any).options = ['Day', 'Week', 'Month']
  ;(el as any).value = 'week'
  ;(el as any).options = ['Week', 'Month', 'Year']
  expect((el as any).value).toBe('week')
  expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(3)
})

it('changing options resets value to first if old value gone', () => {
  ;(el as any).options = ['Day', 'Week']
  ;(el as any).value = 'week'
  ;(el as any).options = ['Month', 'Year']
  expect((el as any).value).toBe('month')
})

it('options attribute change via setAttribute re-renders', () => {
  el.setAttribute('options', 'A,B,C')
  expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(3)
  el.setAttribute('options', 'X,Y')
  expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(2)
})

it('value attribute change via setAttribute updates selection silently', () => {
  el.setAttribute('options', 'Day,Week,Month')
  let fired = false
  el.addEventListener('o-change', () => { fired = true })
  el.setAttribute('value', 'week')
  expect((el as any).value).toBe('week')
  expect(fired).toBe(false)
})
```

- [ ] Run — verify FAIL:
```bash
bun run test src/toggle.test.ts
```

- [ ] Run — verify PASS (attributeChangedCallback already implemented in shell):
```bash
bun run test src/toggle.test.ts
```
If any fail, fix the relevant `attributeChangedCallback` or `options` setter logic in `src/toggle.ts`.

- [ ] `git add src/toggle.ts src/toggle.test.ts && git commit -m "feat: o-toggle attribute reactivity and dynamic options"`

---

## Task 4: Wire exports + demo

**Files:**
- Modify: `src/index.ts`
- Modify: `index.html`

- [ ] Add to `src/index.ts` after the toast lines:
```ts
import './toggle'
export * from './toggle'
```

- [ ] Add demo section to `index.html` (after the `o-table` section, before the toast script):
```html
<!-- o-toggle -->
<h2>o-toggle</h2>
<div class="row">
  <o-toggle id="demo-toggle" options="Day,Week,Month"></o-toggle>
  <o-toggle options="S,M,L,XL" value="m"></o-toggle>
</div>
<script type="module">
  import '/src/toggle.ts'
  document.getElementById('demo-toggle').addEventListener('o-change', e => {
    console.log('toggle changed:', e.detail)
  })
</script>
```

- [ ] Run all tests — verify all pass:
```bash
bun run test
```

- [ ] Build CDN bundle:
```bash
bun run build:cdn
```
Expected: `dist/components.js` rebuilt, no errors.

- [ ] `git add src/index.ts index.html dist/components.js && git commit -m "feat: wire o-toggle exports and add demo"`
