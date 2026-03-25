# Search Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `<o-search>` glassmorphism search bar with built-in filtering, optional dropdown, custom item rendering, and `o-input` / `o-results` / `o-select` events.

**Architecture:** Single `src/search.ts`, shadow DOM. `<input>` created once in constructor and never destroyed. `render()` builds shadow DOM once; all subsequent updates go through `updateDropdown()` to preserve input focus. `document` click listener handles click-outside.

**Tech Stack:** TypeScript, Vite, Vitest + happy-dom.

---

## Types & API Reference

```ts
export interface OSearchInputEvent   { query: string }
export interface OSearchResultsEvent { query: string; results: unknown[] }
export interface OSearchSelectEvent  { item: unknown; query: string }
```

**Attributes:** `placeholder`, `value-key`, `no-dropdown`
**JS properties (no reflection):** `data`, `searchKeys`, `renderItem`, `filterFn`
**Events:** `o-input`, `o-results`, `o-select` (all bubble + composed)

---

## Task 1: Shell — register element, render input, placeholder

**Files:**
- Create: `src/search.ts`
- Create: `src/search.test.ts`

- [ ] Write failing tests in `src/search.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import './search'

describe('OSearch', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-search')
    document.body.appendChild(el)
  })

  it('registers as o-search', () => {
    expect(customElements.get('o-search')).toBeDefined()
  })

  it('renders an input element', () => {
    expect(el.shadowRoot!.querySelector('input')).not.toBeNull()
  })

  it('placeholder attribute sets input placeholder', () => {
    el.setAttribute('placeholder', 'Find...')
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
    expect(input.placeholder).toBe('Find...')
  })

  it('placeholder attribute change updates placeholder without destroying input', () => {
    const input1 = el.shadowRoot!.querySelector('input')
    el.setAttribute('placeholder', 'New placeholder')
    const input2 = el.shadowRoot!.querySelector('input')
    expect(input1).toBe(input2) // same element, not recreated
    expect((input2 as HTMLInputElement).placeholder).toBe('New placeholder')
  })
})
```

- [ ] Run — verify FAIL:
```bash
bun run test src/search.test.ts
```
Expected: `Cannot find module './search'`

- [ ] Create `src/search.ts`:

```ts
export interface OSearchInputEvent   { query: string }
export interface OSearchResultsEvent { query: string; results: unknown[] }
export interface OSearchSelectEvent  { item: unknown; query: string }

export class OSearch extends HTMLElement {
  static get observedAttributes() { return ['placeholder', 'value-key', 'no-dropdown'] }

  private _input: HTMLInputElement
  private _data: unknown[] = []
  private _searchKeys: string[] = []
  private _renderItem: ((item: unknown) => string) | null = null
  private _filterFn: ((query: string, item: unknown) => boolean) | null = null
  private _valueKey: string | null = null
  private _currentResults: unknown[] = []

  get placeholder() { return this.getAttribute('placeholder') ?? 'Search…' }
  set placeholder(v: string) { this.setAttribute('placeholder', v) }

  get valueKey() { return this._valueKey }
  set valueKey(v: string | null) { this._valueKey = v; this.setAttribute('value-key', v ?? '') }

  get noDropdown() { return this.hasAttribute('no-dropdown') }
  set noDropdown(v: boolean) { v ? this.setAttribute('no-dropdown', '') : this.removeAttribute('no-dropdown') }

  set data(v: unknown[]) { this._data = v }
  set searchKeys(v: string[]) { this._searchKeys = v }
  set renderItem(fn: (item: unknown) => string) { this._renderItem = fn }
  set filterFn(fn: (query: string, item: unknown) => boolean) { this._filterFn = fn }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._input = document.createElement('input')
    this._input.addEventListener('input', this.handleInput)
    this.render()
  }

  connectedCallback() {
    document.addEventListener('click', this.handleDocumentClick)
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick)
  }

  attributeChangedCallback(name: string, _old: string | null, val: string | null) {
    if (name === 'placeholder') {
      this._input.placeholder = val ?? 'Search…'
    }
    if (name === 'value-key') {
      this._valueKey = val
      this.updateDropdown()
    }
    if (name === 'no-dropdown') {
      this.updateDropdown()
    }
  }

  private handleInput = () => {
    const query = this._input.value
    this.dispatchEvent(new CustomEvent<OSearchInputEvent>('o-input', {
      bubbles: true, composed: true, detail: { query }
    }))
    const results = this.filter(query)
    this._currentResults = results
    this.dispatchEvent(new CustomEvent<OSearchResultsEvent>('o-results', {
      bubbles: true, composed: true, detail: { query, results }
    }))
    this.updateDropdown()
  }

  private filter(query: string): unknown[] {
    if (!query) return []
    if (this._filterFn) return this._data.filter(item => this._filterFn!(query, item))
    if (this._searchKeys.length === 0) return []
    const q = query.toLowerCase()
    return this._data.filter(item =>
      this._searchKeys.some(key =>
        String((item as Record<string, unknown>)[key] ?? '').toLowerCase().includes(q)
      )
    )
  }

  private handleDocumentClick = (e: MouseEvent) => {
    if (e.target instanceof Node && !this.contains(e.target as Node)) {
      this.closeDropdown()
    }
  }

  private closeDropdown() {
    const dropdown = this.shadowRoot!.querySelector<HTMLElement>('.dropdown')
    if (dropdown) dropdown.style.display = 'none'
  }

  private updateDropdown() {
    const dropdown = this.shadowRoot!.querySelector<HTMLElement>('.dropdown')
    if (!dropdown) return
    const query = this._input.value
    const show = !this.noDropdown && this._renderItem !== null && query.length > 0
    if (!show) { dropdown.style.display = 'none'; return }
    dropdown.style.display = 'block'
    if (this._currentResults.length === 0) {
      dropdown.innerHTML = `<div class="item no-results">No results</div>`
      return
    }
    dropdown.innerHTML = this._currentResults.map((item, i) =>
      `<div class="item" data-index="${i}">${this._renderItem!(item)}</div>`
    ).join('')
  }

  private handleDropdownClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-index]')
    if (!item) return
    const idx = parseInt(item.dataset.index!)
    const selected = this._currentResults[idx]
    if (selected === undefined) return
    const query = this._input.value
    if (this._valueKey) {
      const val = (selected as Record<string, unknown>)[this._valueKey]
      if (val !== undefined) this._input.value = String(val)
    }
    this.closeDropdown()
    this.dispatchEvent(new CustomEvent<OSearchSelectEvent>('o-select', {
      bubbles: true, composed: true, detail: { item: selected, query }
    }))
  }

  private render() {
    const shadow = this.shadowRoot!
    shadow.innerHTML = `
      <style>
        :host { display: block; position: relative; }
        .container {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-radius: 999px; padding: 8px 16px;
        }
        .icon { opacity: 0.6; flex-shrink: 0; }
        input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
        }
        input::placeholder { color: rgba(255,255,255,0.4); }
        .dropdown {
          display: none; position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
          overflow: hidden; z-index: 10;
        }
        .item {
          padding: 8px 14px; color: #fff;
          font-size: 14px; font-family: sans-serif; cursor: pointer;
        }
        .item:hover { background: rgba(255,255,255,0.1); }
        .no-results { opacity: 0.5; cursor: default; }
      </style>
      <div class="container">
        <span class="icon">🔍</span>
      </div>
      <div class="dropdown"></div>
    `
    const container = shadow.querySelector('.container')!
    this._input.placeholder = this.getAttribute('placeholder') ?? 'Search…'
    container.appendChild(this._input)
    shadow.querySelector('.dropdown')!.addEventListener('click', this.handleDropdownClick)
  }
}

customElements.define('o-search', OSearch)
```

- [ ] Run — verify PASS:
```bash
bun run test src/search.test.ts
```
Expected: all 4 shell tests pass.

- [ ] `git add src/search.ts src/search.test.ts && git commit -m "feat: o-search shell with input rendering"`

---

## Task 2: Filtering and events (o-input, o-results)

**Files:**
- Modify: `src/search.test.ts`

- [ ] Add the following code **inside** the existing `describe('OSearch', () => { ... })` block in `src/search.test.ts`, before its closing `})`. The `fireInput` helper goes at the top of the describe block (after `beforeEach`), followed by the new `it()` cases:

```ts
function fireInput(el: HTMLElement, value: string) {
  const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

it('typing fires o-input with { query }', () => {
  let detail: any = null
  el.addEventListener('o-input', (e: any) => { detail = e.detail })
  fireInput(el, 'ali')
  expect(detail).toEqual({ query: 'ali' })
})

it('typing fires o-results with filtered array using searchKeys', () => {
  ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
  ;(el as any).searchKeys = ['name']
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'ali')
  expect(detail.query).toBe('ali')
  expect(detail.results).toEqual([{ name: 'Alice' }])
})

it('o-results fires with empty array when no matches', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'xyz')
  expect(detail.results).toEqual([])
})

it('o-results fires even when no-dropdown is present', () => {
  el.setAttribute('no-dropdown', '')
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'ali')
  expect(detail.results).toEqual([{ name: 'Alice' }])
})

it('o-results fires even when renderItem is not set', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'ali')
  expect(detail.results).toEqual([{ name: 'Alice' }])
})

it('custom filterFn overrides default filter', () => {
  ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
  ;(el as any).filterFn = (_q: string, item: any) => item.name === 'Bob'
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'anything')
  expect(detail.results).toEqual([{ name: 'Bob' }])
})

it('searchKeys not set: default filter returns no matches', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  // searchKeys intentionally not set
  let detail: any = null
  el.addEventListener('o-results', (e: any) => { detail = e.detail })
  fireInput(el, 'ali')
  expect(detail.results).toEqual([])
})
```

- [ ] Run — verify PASS:
```bash
bun run test src/search.test.ts
```
Expected: all tests pass (filtering logic is already in Task 1 implementation).

- [ ] `git add src/search.test.ts && git commit -m "feat: o-search filtering and event tests"`

---

## Task 3: Dropdown rendering and selection

**Files:**
- Modify: `src/search.test.ts`

- [ ] Add tests to the `describe` block:

```ts
it('renderItem output appears in dropdown items', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => `<strong>${item.name}</strong>`
  fireInput(el, 'ali')
  const items = el.shadowRoot!.querySelectorAll('.item[data-index]')
  expect(items.length).toBe(1)
  expect(items[0].innerHTML).toBe('<strong>Alice</strong>')
})

it('dropdown hidden when no-dropdown present', () => {
  el.setAttribute('no-dropdown', '')
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, 'ali')
  const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
  expect(dropdown.style.display).toBe('none')
})

it('dropdown hidden when query is empty', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, '')
  const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
  expect(dropdown.style.display).toBe('none')
})

it('dropdown shows No results when query non-empty but no matches', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, 'xyz')
  const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
  expect(dropdown.style.display).toBe('block')
  expect(dropdown.querySelector('.no-results')).not.toBeNull()
})

it('clicking dropdown item fires o-select with { item, query }', () => {
  ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, 'ali')
  let detail: any = null
  el.addEventListener('o-select', (e: any) => { detail = e.detail })
  el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
  expect(detail.item).toEqual({ name: 'Alice' })
  expect(detail.query).toBe('ali')
})

it('clicking item fills input with item[valueKey]', () => {
  ;(el as any).data = [{ name: 'Alice', id: 1 }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  el.setAttribute('value-key', 'name')
  fireInput(el, 'ali')
  el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
  const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
  expect(input.value).toBe('Alice')
})

it('clicking item with missing valueKey field leaves input unchanged', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  el.setAttribute('value-key', 'nonexistent')
  fireInput(el, 'ali')
  const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
  input.value = 'ali' // set explicitly as fireInput already did, but be explicit
  el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
  expect(input.value).toBe('ali') // unchanged
})

it('clicking item closes dropdown', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, 'ali')
  el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
  const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
  expect(dropdown.style.display).toBe('none')
})

it('click-outside closes dropdown', () => {
  ;(el as any).data = [{ name: 'Alice' }]
  ;(el as any).searchKeys = ['name']
  ;(el as any).renderItem = (item: any) => item.name
  fireInput(el, 'ali')
  // click outside: dispatch click on document.body (not inside el)
  document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }))
  const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
  expect(dropdown.style.display).toBe('none')
})
```

- [ ] Run — verify PASS:
```bash
bun run test src/search.test.ts
```
Expected: all tests pass.

- [ ] `git add src/search.test.ts && git commit -m "feat: o-search dropdown and selection tests"`

---

## Task 4: Wire exports + demo

**Files:**
- Modify: `src/index.ts`
- Modify: `index.html`

- [ ] Add to `src/index.ts` after the toggle lines:
```ts
import './search'
export * from './search'
```

- [ ] Add demo section to `index.html` after the o-toggle section:
```html
<!-- o-search -->
<h2>o-search</h2>
<o-search id="demo-search" placeholder="Search people..." style="max-width:400px"></o-search>
<script type="module">
  import '/src/search.ts'
  const s = document.getElementById('demo-search')
  s.data = [
    { name: 'Alice', role: 'Engineer' },
    { name: 'Bob',   role: 'Designer' },
    { name: 'Carol', role: 'Manager'  },
    { name: 'Dave',  role: 'Engineer' },
  ]
  s.searchKeys = ['name', 'role']
  s.valueKey = 'name'
  s.renderItem = item => `<strong>${item.name}</strong> <span style="opacity:0.6">${item.role}</span>`
  s.addEventListener('o-select', e => console.log('selected:', e.detail))
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

- [ ] `git add src/index.ts index.html dist/components.js && git commit -m "feat: wire o-search exports and add demo"`
