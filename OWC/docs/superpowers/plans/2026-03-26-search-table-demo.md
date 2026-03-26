# Search + Table + Pagination Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-select row support to `o-table`, then wire a combined search + selectable table + pagination demo in `index.html` using dummyjson data.

**Architecture:** `o-table` gains a `selectable` boolean attribute that adds a checkbox column; selection state is tracked internally as a `Set` of row references; firing `o-row-select` on change. The demo glue lives entirely in a `<script type="module">` in `index.html` — no new component files.

**Tech Stack:** TypeScript, Vite, Vitest + happy-dom, dummyjson.com REST API.

---

## File map

| File | Change |
|---|---|
| `src/table.ts` | Add `selectable` attr, `_selectedRows` Set, `selected` getter, `o-row-select` event, checkbox render + handlers |
| `src/table.test.ts` | Add selectable tests |
| `index.html` | Remove standalone `o-search` section; add combined `#demo-combined` section |

---

## Task 1: o-table selectable — failing tests

**Files:**
- Modify: `src/table.test.ts`

- [ ] Add the following block at the end of `src/table.test.ts`, **inside** the existing `describe('OTable', () => { ... })` block:

```ts
// --- selectable ---

describe('selectable', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-table')
    el.setAttribute('selectable', '')
    el.columns = [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]
    el.data = [{ name: 'Alice', role: 'Eng' }, { name: 'Bob', role: 'Design' }]
    document.body.appendChild(el)
  })

  it('adds a checkbox th when selectable', () => {
    const headers = el.shadowRoot.querySelectorAll('th')
    expect(headers.length).toBe(3) // checkbox + 2 columns
    expect(headers[0].querySelector('input[type="checkbox"]')).not.toBeNull()
  })

  it('adds a checkbox td per row', () => {
    const rows = el.shadowRoot.querySelectorAll('tbody tr')
    rows.forEach((tr: Element) => {
      expect(tr.querySelector('td input[type="checkbox"]')).not.toBeNull()
    })
  })

  it('selected is empty by default', () => {
    expect(el.selected).toEqual([])
  })

  it('clicking a row checkbox selects that row', () => {
    const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
    cb.click()
    expect(el.selected).toEqual([{ name: 'Alice', role: 'Eng' }])
  })

  it('clicking a selected row checkbox deselects it', () => {
    const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
    cb.click()
    cb.click()
    expect(el.selected).toEqual([])
  })

  it('fires o-row-select with selected rows on change', () => {
    let detail: any = null
    el.addEventListener('o-row-select', (e: any) => { detail = e.detail })
    const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
    cb.click()
    expect(detail).toEqual({ selected: [{ name: 'Alice', role: 'Eng' }] })
  })

  it('header checkbox selects all rows', () => {
    const headerCb = el.shadowRoot.querySelector('thead input[type="checkbox"]') as HTMLInputElement
    headerCb.click()
    expect(el.selected).toEqual([{ name: 'Alice', role: 'Eng' }, { name: 'Bob', role: 'Design' }])
  })

  it('header checkbox when all selected deselects all', () => {
    const headerCb = el.shadowRoot.querySelector('thead input[type="checkbox"]') as HTMLInputElement
    headerCb.click() // select all
    headerCb.click() // deselect all
    expect(el.selected).toEqual([])
  })

  it('reassigning data resets selection', () => {
    const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
    cb.click()
    expect(el.selected.length).toBe(1)
    el.data = [{ name: 'Carol', role: 'Mgmt' }]
    expect(el.selected).toEqual([])
  })

  it('selected rows are visually highlighted', () => {
    const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
    cb.click()
    const selectedTr = el.shadowRoot.querySelector('tbody tr.selected')
    expect(selectedTr).not.toBeNull()
  })
})
```

- [ ] Run — verify FAIL:
```bash
bun run test src/table.test.ts
```
Expected: `TypeError` or similar (selectable not implemented yet).

- [ ] Commit:
```bash
git add src/table.test.ts && git commit -m "test: o-table selectable failing tests"
```

---

## Task 2: o-table selectable — implementation

**Files:**
- Modify: `src/table.ts`

- [ ] Add `OTableRowSelectEvent` export and `_selectedRows` field. Replace the top of `src/table.ts` up to and including the class property declarations:

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
export interface OTableRowSelectEvent { selected: Record<string, unknown>[] }

export class OTable extends HTMLElement {
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode', 'selectable'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'
  private _selectedRows: Set<Record<string, unknown>> = new Set()

  get columns() { return this._columns }
  set columns(v: OTableColumn[]) { this._columns = v; this.render() }

  get data() { return this._data }
  set data(v: Record<string, unknown>[]) {
    this._data = v
    this._selectedRows.clear()
    this.render()
  }

  get selected(): Record<string, unknown>[] {
    return this._data.filter(row => this._selectedRows.has(row))
  }

  get selectable() { return this.hasAttribute('selectable') }
```

- [ ] Add `selected` row CSS class and checkbox column styles. Inside the `<style>` block in `render()`, add after `.resize-handle:hover` rule:

```css
        tbody tr.selected td { background: rgba(255,255,255,0.12); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: rgba(255,255,255,0.9);
        }
```

- [ ] Update `renderTh` call in `render()` to prepend a checkbox header when selectable. Replace the `<thead>` line inside `render()`:

```ts
        <thead><tr>${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all></th>` : ''}${this._columns.map(c => this.renderTh(c)).join('')}</tr></thead>
```

- [ ] Update `renderRow` to accept an index and prepend a checkbox cell. Replace the existing `renderRow` method:

```ts
  private renderRow(row: Record<string, unknown>): string {
    const checked = this._selectedRows.has(row) ? ' checked' : ''
    const selectedClass = this._selectedRows.has(row) ? ' class="selected"' : ''
    const checkbox = this.selectable
      ? `<td><input type="checkbox" data-select-row${checked}></td>`
      : ''
    return `<tr${selectedClass}>${checkbox}${this._columns.map(c =>
      `<td>${row[c.key] ?? ''}</td>`
    ).join('')}</tr>`
  }
```

- [ ] Add selection handlers in `attachHandlers()`. Add this block at the end of `attachHandlers()`, before the closing `}`:

```ts
    // Row selection handlers
    if (this.selectable) {
      // Per-row checkboxes
      this.shadowRoot!.querySelectorAll<HTMLInputElement>('tbody [data-select-row]').forEach((cb, i) => {
        const row = this.getSortedData()[i]
        cb.addEventListener('click', (e) => {
          e.stopPropagation()
          if (this._selectedRows.has(row)) {
            this._selectedRows.delete(row)
          } else {
            this._selectedRows.add(row)
          }
          this.dispatchEvent(new CustomEvent<OTableRowSelectEvent>('o-row-select', {
            bubbles: true, composed: true,
            detail: { selected: this.selected }
          }))
          this.render()
        })
      })

      // Header "select all" checkbox
      const headerCb = this.shadowRoot!.querySelector<HTMLInputElement>('[data-select-all]')
      if (headerCb) {
        headerCb.addEventListener('click', (e) => {
          e.stopPropagation()
          const allSelected = this.getSortedData().every(row => this._selectedRows.has(row))
          if (allSelected) {
            this._selectedRows.clear()
          } else {
            this.getSortedData().forEach(row => this._selectedRows.add(row))
          }
          this.dispatchEvent(new CustomEvent<OTableRowSelectEvent>('o-row-select', {
            bubbles: true, composed: true,
            detail: { selected: this.selected }
          }))
          this.render()
        })
      }
    }
```

- [ ] Run — verify PASS:
```bash
bun run test src/table.test.ts
```
Expected: all tests pass.

- [ ] Commit:
```bash
git add src/table.ts src/table.test.ts && git commit -m "feat: o-table selectable rows with o-row-select event"
```

---

## Task 3: Combined demo in index.html

**Files:**
- Modify: `index.html`

- [ ] Remove the standalone `o-search` section from `index.html`. Delete these lines:

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

- [ ] Add the combined demo section in its place (after the `o-toggle` section and before the `<script type="module" src="/src/main.ts"></script>` line):

```html
    <!-- Combined: o-search + o-table + pagination -->
    <h2>Search + Table</h2>
    <o-search id="demo-search" placeholder="Search people..." no-dropdown style="max-width:500px"></o-search>

    <div style="margin-top:12px">
      <o-table id="demo-table2" selectable></o-table>
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
      <o-button id="btn-prev">‹</o-button>
      <o-toggle id="tgl-pages" options="1"></o-toggle>
      <o-button id="btn-next">›</o-button>
      <div style="flex:1"></div>
      <o-toggle id="tgl-pagesize" options="5,10,25,All" value="10"></o-toggle>
    </div>

    <script type="module">
      import '/src/search.ts'
      import '/src/table.ts'
      import '/src/toggle.ts'

      const COLUMNS = [
        { key: 'name',       label: 'Name',       width: 160 },
        { key: 'company',    label: 'Company',     width: 200 },
        { key: 'department', label: 'Department',  width: 140 },
        { key: 'age',        label: 'Age',         width: 60  },
      ]

      const search    = document.getElementById('demo-search')
      const table     = document.getElementById('demo-table2')
      const btnPrev   = document.getElementById('btn-prev')
      const btnNext   = document.getElementById('btn-next')
      const tglPages  = document.getElementById('tgl-pages')
      const tglSize   = document.getElementById('tgl-pagesize')

      table.columns = COLUMNS

      let allData      = []
      let filteredData = []
      let currentPage  = 1
      let pageSize     = 10

      function getPageSize() {
        return tglSize.value === 'all' ? Infinity : parseInt(tglSize.value)
      }

      function totalPages() {
        if (pageSize === Infinity) return 1
        return Math.max(1, Math.ceil(filteredData.length / pageSize))
      }

      function updatePageToggle() {
        const n = totalPages()
        tglPages.options = Array.from({ length: n }, (_, i) => String(i + 1))
        tglPages.value = String(currentPage)
      }

      function updateNavButtons() {
        const disabled = 'opacity:0.35;pointer-events:none'
        const enabled  = ''
        btnPrev.style.cssText = currentPage <= 1 ? disabled : enabled
        btnNext.style.cssText = currentPage >= totalPages() ? disabled : enabled
      }

      function render() {
        const start = pageSize === Infinity ? 0 : (currentPage - 1) * pageSize
        const end   = pageSize === Infinity ? filteredData.length : start + pageSize
        table.data  = filteredData.slice(start, end)
        updatePageToggle()
        updateNavButtons()
      }

      function applySearch(query) {
        const q = query.toLowerCase()
        filteredData = q
          ? allData.filter(r =>
              r.name.toLowerCase().includes(q) ||
              r.company.toLowerCase().includes(q) ||
              r.department.toLowerCase().includes(q)
            )
          : allData
        currentPage = 1
        render()
      }

      // Fetch data
      fetch('https://dummyjson.com/users?limit=50')
        .then(r => r.json())
        .then(({ users }) => {
          allData = users.map(u => ({
            name:       `${u.firstName} ${u.lastName}`,
            company:    u.company.name,
            department: u.company.department,
            age:        u.age,
          }))
          filteredData = allData
          render()
        })

      search.addEventListener('o-input', e => applySearch(e.detail.query))

      tglPages.addEventListener('o-change', e => {
        currentPage = parseInt(e.detail.value)
        render()
      })

      tglSize.addEventListener('o-change', () => {
        pageSize = getPageSize()
        currentPage = 1
        render()
      })

      btnPrev.addEventListener('o-click', () => {
        if (currentPage > 1) { currentPage--; render() }
      })

      btnNext.addEventListener('o-click', () => {
        if (currentPage < totalPages()) { currentPage++; render() }
      })

      table.addEventListener('o-row-select', e => {
        console.log('selected rows:', e.detail.selected)
      })
    </script>
```

- [ ] Run dev server and visually verify:
```bash
bun dev
```
Expected: combined section shows search bar, table with checkboxes, pagination bar. Type in search — table filters. Click prev/next — pages change. Check rows — selection logged.

- [ ] Run all tests:
```bash
bun run test
```
Expected: all tests pass.

- [ ] Commit:
```bash
git add index.html && git commit -m "feat: combined search + selectable table + pagination demo"
```

---

## Task 4: Rebuild CDN bundle + push

**Files:**
- Modify: `dist/components.js` (generated)

- [ ] Rebuild CDN bundle:
```bash
bun run build:cdn
```
Expected: `dist/components.js` rebuilt, no errors.

- [ ] Run all tests one final time:
```bash
bun run test
```
Expected: all pass.

- [ ] Commit + push:
```bash
git add dist/components.js && git commit -m "chore: rebuild CDN bundle with selectable table"
git push
```
