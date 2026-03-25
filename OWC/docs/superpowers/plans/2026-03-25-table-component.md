# Table Component Implementation Plan

**Goal:** `<o-table>` glassmorphism web component with sortable columns, resizable column widths, and optional state persistence.

**Architecture:** Single `src/table.ts`. Shadow DOM. Data and columns set via JS properties. State (sort + widths) optionally persisted to localStorage/sessionStorage.

**Tech Stack:** TypeScript, Vite, Vitest + happy-dom.

---

## Types & API

```ts
export interface OTableColumn {
  key: string
  label: string
  width?: number           // px, default: fit-content
  sortable?: boolean       // default: false
  minWidth?: number        // px, optional
  maxWidth?: number        // px, optional
}

export type SortDir = 'asc' | 'desc' | 'none'

export interface OTableSortEvent {
  col: string
  dir: SortDir
}
```

**Element attributes:**

| Attribute | Values | Description |
|---|---|---|
| `storage` | `local` \| `session` | Enable state persistence |
| `storage-key` | string | Key for storage (required if `storage` set) |
| `resize-mode` | `single` (default) \| `adjacent` | Column resize behaviour |

**JS properties:** `columns: OTableColumn[]`, `data: Record<string, unknown>[]`

**Events fired:** `o-sort` (detail: `OTableSortEvent`) on every sort change — including client-side sort, so server-side consumers can hook in.

---

## File Map

| Action | Path |
|---|---|
| Create | `src/table.ts` |
| Create | `src/table.test.ts` |
| Modify | `src/index.ts` |
| Modify | `index.html` |

---

## Task 1: Shell — render table from columns + data

**Files:** `src/table.ts`, `src/table.test.ts`

- [ ] Write failing tests:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import './table'

describe('OTable', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-table')
    document.body.appendChild(el)
  })

  it('registers as o-table', () => {
    expect(customElements.get('o-table')).toBeDefined()
  })

  it('renders column headers', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th')
    expect(th?.textContent?.trim()).toContain('Name')
  })

  it('renders data rows', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
    const rows = el.shadowRoot!.querySelectorAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('applies fit-content width when column has no width', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th') as HTMLElement
    expect(th.style.width).toBe('fit-content')
  })

  it('applies px width when column has width', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name', width: 200 }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th') as HTMLElement
    expect(th.style.width).toBe('200px')
  })
})
```

- [ ] Run — verify FAIL
- [ ] Implement `src/table.ts` shell:

```ts
export interface OTableColumn {
  key: string
  label: string
  width?: number
  sortable?: boolean
  minWidth?: number
  maxWidth?: number
}

export type SortDir = 'asc' | 'desc' | 'none'
export interface OTableSortEvent { col: string; dir: SortDir }

export class OTable extends HTMLElement {
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []

  get columns() { return this._columns }
  set columns(v: OTableColumn[]) { this._columns = v; this.render() }

  get data() { return this._data }
  set data(v: Record<string, unknown>[]) { this._data = v; this.render() }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() { this.render() }

  private render() {
    if (!this.shadowRoot) return
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; overflow-x: auto; }
        table {
          width: 100%; border-collapse: collapse;
          font-family: sans-serif; font-size: 14px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px; overflow: hidden;
        }
        th, td {
          padding: 10px 14px; text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: #fff; position: relative;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        th {
          background: rgba(255,255,255,0.15);
          user-select: none;
          backdrop-filter: blur(10px);
        }
        tbody tr:hover td { background: rgba(255,255,255,0.06); }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: rgba(255,255,255,0.3); }
      </style>
      <table>
        <thead><tr>${this._columns.map(c => this.renderTh(c)).join('')}</tr></thead>
        <tbody>${this._data.map(row => this.renderRow(row)).join('')}</tbody>
      </table>
    `
    this.attachResizeHandlers()
  }

  private renderTh(col: OTableColumn): string {
    const w = col.width ? `${col.width}px` : 'fit-content'
    const minW = col.minWidth ? `min-width:${col.minWidth}px;` : ''
    const maxW = col.maxWidth ? `max-width:${col.maxWidth}px;` : ''
    return `<th data-key="${col.key}" style="width:${w};${minW}${maxW}">
      ${col.label}
      <div class="resize-handle" data-resize="${col.key}"></div>
    </th>`
  }

  private renderRow(row: Record<string, unknown>): string {
    return `<tr>${this._columns.map(c =>
      `<td>${row[c.key] ?? ''}</td>`
    ).join('')}</tr>`
  }

  private attachResizeHandlers() {
    // implemented in Task 3
  }
}

customElements.define('o-table', OTable)
```

- [ ] Run — verify PASS
- [ ] `git add src/table.ts src/table.test.ts && git commit -m "feat: o-table shell with column rendering"`

---

## Task 2: Sorting

**Files:** `src/table.ts`, `src/table.test.ts`

- [ ] Write failing tests:

```ts
it('sorts asc on first header click (sortable col)', () => {
  ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
  ;(el as any).data = [{ age: 30 }, { age: 20 }, { age: 25 }]
  el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
  const cells = el.shadowRoot!.querySelectorAll('td')
  expect([...cells].map(c => c.textContent)).toEqual(['20', '25', '30'])
})

it('sorts desc on second click', () => {
  ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
  ;(el as any).data = [{ age: 30 }, { age: 20 }]
  const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
  th.click(); th.click()
  const cells = el.shadowRoot!.querySelectorAll('td')
  expect([...cells].map(c => c.textContent)).toEqual(['30', '20'])
})

it('clears sort on third click', () => {
  ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
  ;(el as any).data = [{ age: 30 }, { age: 20 }]
  const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
  th.click(); th.click(); th.click()
  const cells = el.shadowRoot!.querySelectorAll('td')
  expect([...cells].map(c => c.textContent)).toEqual(['30', '20'])
})

it('fires o-sort event', () => {
  ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
  ;(el as any).data = []
  let event: CustomEvent | null = null
  el.addEventListener('o-sort', (e) => { event = e as CustomEvent })
  el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
  expect(event).not.toBeNull()
  expect((event as any).detail).toEqual({ col: 'age', dir: 'asc' })
})

it('does not sort non-sortable columns', () => {
  ;(el as any).columns = [{ key: 'name', label: 'Name', sortable: false }]
  ;(el as any).data = [{ name: 'Bob' }, { name: 'Alice' }]
  el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
  const cells = el.shadowRoot!.querySelectorAll('td')
  expect([...cells].map(c => c.textContent)).toEqual(['Bob', 'Alice'])
})
```

- [ ] Run — verify FAIL
- [ ] Add sort state and logic to `OTable`:

Add private fields:
```ts
private _sortCol: string | null = null
private _sortDir: SortDir = 'none'
```

In `attachResizeHandlers` → also attach sort handlers (rename to `attachHandlers`). For each `th` with `data-key` where column is sortable:
```ts
th.addEventListener('click', () => this.handleSort(col.key))
```

Add sort methods:
```ts
private handleSort(key: string) {
  const col = this._columns.find(c => c.key === key)
  if (!col?.sortable) return
  if (this._sortCol !== key) { this._sortCol = key; this._sortDir = 'asc' }
  else if (this._sortDir === 'asc') this._sortDir = 'desc'
  else { this._sortCol = null; this._sortDir = 'none' }
  this.dispatchEvent(new CustomEvent<OTableSortEvent>('o-sort', {
    bubbles: true, composed: true,
    detail: { col: key, dir: this._sortDir }
  }))
  this.render()
}

private getSortedData(): Record<string, unknown>[] {
  if (!this._sortCol || this._sortDir === 'none') return this._data
  return [...this._data].sort((a, b) => {
    const av = a[this._sortCol!]; const bv = b[this._sortCol!]
    if (av == null) return 1; if (bv == null) return -1
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return this._sortDir === 'asc' ? cmp : -cmp
  })
}
```

In `renderRow` loop, use `this.getSortedData()` instead of `this._data`.

Add sort icon to `renderTh`:
```ts
const icon = col.sortable
  ? `<span class="sort-icon">${
      this._sortCol === col.key && this._sortDir === 'asc' ? '↑'
      : this._sortCol === col.key && this._sortDir === 'desc' ? '↓'
      : '↕'
    }</span>`
  : ''
```

Add `.sort-icon { float: right; opacity: 0.5; }` + `th[data-sortable] { cursor: pointer; }` to styles.

- [ ] Run — verify PASS
- [ ] `git add src/table.ts src/table.test.ts && git commit -m "feat: o-table sorting with o-sort event"`

---

## Task 3: Column resize

**Files:** `src/table.ts`, `src/table.test.ts`

- [ ] Write failing tests:

```ts
it('resizes column on drag (single mode)', () => {
  ;(el as any).columns = [{ key: 'name', label: 'Name', width: 200 }]
  ;(el as any).data = []
  const handle = el.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!
  handle.dispatchEvent(new MouseEvent('mousedown', { screenX: 0, bubbles: true }))
  document.dispatchEvent(new MouseEvent('mousemove', { screenX: 50 }))
  document.dispatchEvent(new MouseEvent('mouseup'))
  const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
  expect(parseInt(th.style.width)).toBe(250)
})

it('respects minWidth constraint', () => {
  ;(el as any).columns = [{ key: 'name', label: 'Name', width: 100, minWidth: 80 }]
  ;(el as any).data = []
  const handle = el.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!
  handle.dispatchEvent(new MouseEvent('mousedown', { screenX: 0, bubbles: true }))
  document.dispatchEvent(new MouseEvent('mousemove', { screenX: -50 })) // would go to 50px
  document.dispatchEvent(new MouseEvent('mouseup'))
  const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
  expect(parseInt(th.style.width)).toBeGreaterThanOrEqual(80)
})
```

- [ ] Run — verify FAIL
- [ ] Implement `attachResizeHandlers()` in `OTable`:

```ts
private attachResizeHandlers() {
  const mode = this.getAttribute('resize-mode') ?? 'single'
  this.shadowRoot!.querySelectorAll<HTMLElement>('.resize-handle').forEach(handle => {
    const key = handle.dataset.resize!
    const colIdx = this._columns.findIndex(c => c.key === key)
    const col = this._columns[colIdx]

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()
      const startX = e.screenX
      const th = handle.closest('th') as HTMLElement
      const startW = th.offsetWidth
      const nextTh = mode === 'adjacent'
        ? th.nextElementSibling as HTMLElement | null
        : null
      const nextStartW = nextTh?.offsetWidth ?? 0

      const onMove = (ev: MouseEvent) => {
        const delta = ev.screenX - startX
        let newW = Math.max(col.minWidth ?? 20, startW + delta)
        if (col.maxWidth) newW = Math.min(col.maxWidth, newW)
        th.style.width = `${newW}px`

        if (mode === 'adjacent' && nextTh) {
          const nextCol = this._columns[colIdx + 1]
          let nextW = Math.max(nextCol?.minWidth ?? 20, nextStartW - delta)
          if (nextCol?.maxWidth) nextW = Math.min(nextCol.maxWidth, nextW)
          nextTh.style.width = `${nextW}px`
        }
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        // snapshot widths back to column definitions for persistence
        this.shadowRoot!.querySelectorAll<HTMLElement>('th').forEach((t, i) => {
          this._columns[i] = { ...this._columns[i], width: t.offsetWidth }
        })
        this.persistState()
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    })
  })
}
```

- [ ] Run — verify PASS
- [ ] `git add src/table.ts src/table.test.ts && git commit -m "feat: o-table column resize (single + adjacent modes)"`

---

## Task 4: State persistence

**Files:** `src/table.ts`, `src/table.test.ts`

State shape saved: `{ sortCol, sortDir, widths: { [key]: px } }`

- [ ] Write failing tests:

```ts
it('persists sort state to localStorage', () => {
  el.setAttribute('storage', 'local')
  el.setAttribute('storage-key', 'test-table')
  ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
  ;(el as any).data = []
  el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
  const saved = JSON.parse(localStorage.getItem('test-table')!)
  expect(saved.sortCol).toBe('age')
  expect(saved.sortDir).toBe('asc')
})

it('restores sort state from localStorage on connect', () => {
  localStorage.setItem('test-table', JSON.stringify({ sortCol: 'age', sortDir: 'desc', widths: {} }))
  const el2 = document.createElement('o-table') as any
  el2.setAttribute('storage', 'local')
  el2.setAttribute('storage-key', 'test-table')
  el2.columns = [{ key: 'age', label: 'Age', sortable: true }]
  el2.data = [{ age: 10 }, { age: 5 }]
  document.body.appendChild(el2)
  const cells = el2.shadowRoot!.querySelectorAll('td')
  expect([...cells].map((c: HTMLElement) => c.textContent)).toEqual(['10', '5'])
})
```

Add `afterEach(() => localStorage.clear())` to the describe block.

- [ ] Run — verify FAIL
- [ ] Add persistence methods to `OTable`:

```ts
private getStorage(): Storage | null {
  const s = this.getAttribute('storage')
  if (s === 'local') return localStorage
  if (s === 'session') return sessionStorage
  return null
}

private persistState() {
  const store = this.getStorage()
  const key = this.getAttribute('storage-key')
  if (!store || !key) return
  const widths: Record<string, number> = {}
  this._columns.forEach(c => { if (c.width) widths[c.key] = c.width })
  store.setItem(key, JSON.stringify({ sortCol: this._sortCol, sortDir: this._sortDir, widths }))
}

private restoreState() {
  const store = this.getStorage()
  const key = this.getAttribute('storage-key')
  if (!store || !key) return
  const raw = store.getItem(key)
  if (!raw) return
  try {
    const { sortCol, sortDir, widths } = JSON.parse(raw)
    this._sortCol = sortCol ?? null
    this._sortDir = sortDir ?? 'none'
    if (widths) {
      this._columns = this._columns.map(c =>
        widths[c.key] != null ? { ...c, width: widths[c.key] } : c
      )
    }
  } catch { /* ignore corrupt data */ }
}
```

Call `this.persistState()` at end of `handleSort()`.
Call `this.restoreState()` at start of `connectedCallback()` (before `render()`).

- [ ] Run — verify PASS
- [ ] `git add src/table.ts src/table.test.ts && git commit -m "feat: o-table state persistence (localStorage/sessionStorage)"`

---

## Task 5: Wire exports + demo

**Files:** `src/index.ts`, `index.html`

- [ ] Add to `src/index.ts`:
```ts
import './table'
export * from './table'
```

- [ ] Add table demo section to `index.html` (after the toast section):
```html
<h2>o-table</h2>
<o-table id="demo-table" storage="local" storage-key="owc-demo-table"></o-table>
<script type="module">
  const t = document.getElementById('demo-table')
  t.columns = [
    { key: 'name',  label: 'Name',       width: 160, sortable: true },
    { key: 'role',  label: 'Role',        width: 140, sortable: true },
    { key: 'score', label: 'Score', width: 90,  sortable: true, minWidth: 60 },
  ]
  t.data = [
    { name: 'Alice', role: 'Engineer',  score: 92 },
    { name: 'Bob',   role: 'Designer',  score: 85 },
    { name: 'Carol', role: 'Manager',   score: 78 },
    { name: 'Dave',  role: 'Engineer',  score: 95 },
  ]
</script>
```

- [ ] `bun run test` — all tests pass
- [ ] `bun run build:cdn`
- [ ] `git add src/index.ts index.html dist/components.js && git commit -m "feat: wire o-table exports and add demo"`
