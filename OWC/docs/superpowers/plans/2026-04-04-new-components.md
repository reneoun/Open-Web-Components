# New Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `o-table` inline editing, `o-note` (textarea + card variants), and `o-dialog` glassmorphism dialog to the OWC library.

**Architecture:** All components follow the existing pattern — plain `HTMLElement` subclasses with shadow DOM, inline `<style>` tags using glassmorphism tokens, custom events that bubble with `composed: true`. No shared CSS file exists; tokens are repeated per component in `:host` rules.

**Tech Stack:** TypeScript, Vite, Bun, Vitest + happy-dom, `customElements.define`, IIFE CDN bundle via jsDelivr.

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Modify | `OWC/src/table.ts` | Add editable column support + events |
| Modify | `OWC/src/table.test.ts` | Add editable tests |
| Create | `OWC/src/note.ts` | `o-note` component |
| Create | `OWC/src/note.test.ts` | `o-note` tests |
| Create | `OWC/src/dialog.ts` | `o-dialog` component |
| Create | `OWC/src/dialog.test.ts` | `o-dialog` tests |
| Modify | `OWC/src/index.ts` | Import note + dialog |
| Modify | `OWC/index.html` | Three new demo sections |

---

## Task 1: o-table editable — failing tests

**Files:**
- Modify: `OWC/src/table.test.ts`

- [ ] **Step 1: Append editable describe block to table.test.ts**

Add at the end of `OWC/src/table.test.ts` (after the closing `})` of the selectable describe block):

```ts
  describe('editable', () => {
    let el: any

    beforeEach(() => {
      document.body.innerHTML = ''
      el = document.createElement('o-table')
      el.setAttribute('editable', '')
      el.columns = [
        { key: 'name',   label: 'Name',   editable: 'always' },
        { key: 'role',   label: 'Role',   editable: 'click'  },
        { key: 'status', label: 'Status' }
      ]
      el.data = [{ name: 'Alice', role: 'Eng', status: 'Active' }]
      document.body.appendChild(el)
    })

    it('renders input for always-editable column', () => {
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')
      expect(input).not.toBeNull()
    })

    it('does not render input for read-only column', () => {
      const inputs = [...el.shadowRoot.querySelectorAll<HTMLInputElement>('input.cell-input')]
      expect(inputs.map(i => i.dataset.key)).not.toContain('status')
    })

    it('renders edit button for rows with click-editable columns', () => {
      expect(el.shadowRoot.querySelector('.edit-btn')).not.toBeNull()
    })

    it('click edit button shows input for click-editable column', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const keys = [...el.shadowRoot.querySelectorAll<HTMLInputElement>('input.cell-input')]
        .map(i => i.dataset.key)
      expect(keys).toContain('role')
    })

    it('click edit button shows confirm and cancel buttons', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      expect(el.shadowRoot.querySelector('.edit-confirm')).not.toBeNull()
      expect(el.shadowRoot.querySelector('.edit-cancel')).not.toBeNull()
    })

    it('fires o-cell-change on blur when always-editable value changed', () => {
      let detail: any = null
      el.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')!
      input.value = 'Bob'
      input.dispatchEvent(new Event('blur'))
      expect(detail).not.toBeNull()
      expect(detail.key).toBe('name')
      expect(detail.value).toBe('Bob')
    })

    it('does not fire o-cell-change when value unchanged on blur', () => {
      let fired = false
      el.addEventListener('o-cell-change', () => { fired = true })
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')!
      input.value = 'Alice'
      input.dispatchEvent(new Event('blur'))
      expect(fired).toBe(false)
    })

    it('fires o-row-change on confirm with changed click-editable values', () => {
      let detail: any = null
      el.addEventListener('o-row-change', (e: any) => { detail = e.detail })
      el.shadowRoot.querySelector('.edit-btn').click()
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="role"]')!
      input.value = 'Design'
      el.shadowRoot.querySelector('.edit-confirm').click()
      expect(detail).not.toBeNull()
      expect(detail.changes).toEqual({ role: 'Design' })
    })

    it('cancel restores original row values', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="role"]')!
      input.value = 'Design'
      el.shadowRoot.querySelector('.edit-cancel').click()
      const tds = [...el.shadowRoot.querySelectorAll('tbody td')]
      expect(tds.some(td => td.textContent === 'Eng')).toBe(true)
    })

    it('no edit controls when editable attribute absent', () => {
      document.body.innerHTML = ''
      const el2 = document.createElement('o-table') as any
      el2.columns = [{ key: 'name', label: 'Name', editable: 'always' }]
      el2.data = [{ name: 'Alice' }]
      document.body.appendChild(el2)
      expect(el2.shadowRoot.querySelector('input.cell-input')).toBeNull()
    })
  })
```

Note: this goes inside the outer `describe('OTable', ...)` block, just before its final `})`.

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | grep -E '(FAIL|PASS|✓|✗|×)' | head -30
```

Expected: new tests fail with errors like `Cannot read properties of null` or `expect(received).not.toBeNull()`.

---

## Task 2: o-table editable — implementation

**Files:**
- Modify: `OWC/src/table.ts`

- [ ] **Step 1: Add new types and update OTableColumn**

Replace lines 1–12 of `OWC/src/table.ts`:

```ts
export interface OTableColumn {
  key: string
  label: string
  width?: number
  sortable?: boolean
  minWidth?: number
  maxWidth?: number
  editable?: 'always' | 'click'
}

export type SortDir = 'asc' | 'desc' | 'none'
export interface OTableSortEvent { col: string; dir: SortDir }
export interface OTableRowSelectEvent { selected: Record<string, unknown>[] }
export interface OTableCellChangeEvent { key: string; value: unknown; rowIndex: number; row: Record<string, unknown> }
export interface OTableRowChangeEvent { rowIndex: number; row: Record<string, unknown>; changes: Record<string, unknown> }
```

- [ ] **Step 2: Update observedAttributes + add private edit state fields**

Replace:
```ts
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode', 'selectable'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'
  private _selectedRows: Set<Record<string, unknown>> = new Set()
```
With:
```ts
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode', 'selectable', 'editable'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'
  private _selectedRows: Set<Record<string, unknown>> = new Set()
  private _editingRows: Set<Record<string, unknown>> = new Set()
  private _rowOriginals: Map<Record<string, unknown>, Record<string, unknown>> = new Map()
```

- [ ] **Step 3: Add editable getter + clear edit state on data set + add attributeChangedCallback**

After `get selectable() { return this.hasAttribute('selectable') }`, add:
```ts
  get editable() { return this.hasAttribute('editable') }
```

Replace the `data` setter:
```ts
  set data(v: Record<string, unknown>[]) {
    this._data = v
    this._selectedRows.clear()
    this._editingRows.clear()
    this._rowOriginals.clear()
    this.render()
  }
```

After `connectedCallback() { ... }`, add:
```ts
  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }
```

- [ ] **Step 4: Add editable CSS to render() style block**

In the `render()` method, after the existing `input[type="checkbox"] { ... }` rule, add before the closing `</style>`:

```css
        .cell-input {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(251,191,36,0.5);
          border-radius: 4px;
          color: #fff;
          padding: 4px 8px;
          font-size: 13px;
          width: calc(100% - 4px);
          outline: none;
          font-family: sans-serif;
        }
        .cell-input:focus { border-color: rgba(251,191,36,0.9); background: rgba(255,255,255,0.15); }
        .edit-actions { width: 72px; text-align: center; padding: 6px 4px; }
        .edit-btn, .edit-confirm, .edit-cancel {
          background: none; border: none; cursor: pointer;
          font-size: 13px; padding: 2px 4px; opacity: 0.7; color: #fff; border-radius: 3px;
        }
        .edit-btn:hover, .edit-confirm:hover, .edit-cancel:hover { opacity: 1; }
        .edit-confirm { color: rgba(74,222,128,0.9); }
        .edit-cancel { color: rgba(248,113,113,0.9); }
```

- [ ] **Step 5: Update render() thead and tbody to support edit column**

Replace the `<table>` section inside `render()`:

```ts
    const hasClickEditable = this._columns.some(c => c.editable === 'click')
    const editTh = this.editable && hasClickEditable ? '<th style="width:72px"></th>' : ''
    this.shadowRoot.innerHTML = `
      <style>
        /* ... (keep existing styles + new .cell-input styles from Step 4) ... */
      </style>
      <table>
        <thead><tr>
          ${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all></th>` : ''}
          ${this._columns.map(c => this.renderTh(c)).join('')}
          ${editTh}
        </tr></thead>
        <tbody>${this.getSortedData().map((row, i) => this.renderRow(row, i)).join('')}</tbody>
      </table>
    `
    this.attachHandlers()
```

(Keep all existing style rules; just add the new CSS block and update the table template.)

- [ ] **Step 6: Replace renderRow to accept rowIndex and render editable cells**

Replace the `renderRow` method entirely:

```ts
  private renderRow(row: Record<string, unknown>, rowIndex: number): string {
    const checked = this._selectedRows.has(row) ? ' checked' : ''
    const selectedClass = this._selectedRows.has(row) ? ' class="selected"' : ''
    const checkbox = this.selectable
      ? `<td><input type="checkbox" data-select-row${checked}></td>`
      : ''

    const isEditing = this._editingRows.has(row)
    const hasClickEditable = this._columns.some(c => c.editable === 'click')

    let editTd = ''
    if (this.editable && hasClickEditable) {
      editTd = isEditing
        ? `<td class="edit-actions">
            <button class="edit-confirm" data-row-index="${rowIndex}" title="Confirm">✓</button>
            <button class="edit-cancel" data-row-index="${rowIndex}" title="Cancel">✗</button>
           </td>`
        : `<td class="edit-actions">
            <button class="edit-btn" data-row-index="${rowIndex}" title="Edit">✏️</button>
           </td>`
    }

    const cells = this._columns.map(c => {
      if (this.editable && c.editable && (c.editable === 'always' || isEditing)) {
        const val = String(row[c.key] ?? '').replace(/"/g, '&quot;')
        return `<td><input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" /></td>`
      }
      return `<td>${row[c.key] ?? ''}</td>`
    }).join('')

    return `<tr${selectedClass} data-row-index="${rowIndex}">${checkbox}${cells}${editTd}</tr>`
  }
```

- [ ] **Step 7: Add editable handlers to attachHandlers()**

At the very end of `attachHandlers()`, before its closing `}`, add:

```ts
    // Editable: always-editable cells fire o-cell-change on blur/Enter
    if (this.editable) {
      this.shadowRoot!.querySelectorAll<HTMLInputElement>('input.cell-input').forEach(input => {
        const key = input.dataset.key!
        const rowIndex = parseInt(input.dataset.rowIndex!)
        const col = this._columns.find(c => c.key === key)
        if (col?.editable !== 'always') return

        const commit = () => {
          const row = this.getSortedData()[rowIndex]
          if (!row) return
          const oldVal = String(row[key] ?? '')
          const newVal = input.value
          if (newVal !== oldVal) {
            row[key] = newVal
            this.dispatchEvent(new CustomEvent<OTableCellChangeEvent>('o-cell-change', {
              bubbles: true, composed: true,
              detail: { key, value: newVal, rowIndex, row }
            }))
          }
        }
        input.addEventListener('blur', commit)
        input.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') { commit(); input.blur() } })
      })

      // Edit button: enter edit mode
      this.shadowRoot!.querySelectorAll<HTMLElement>('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          const rowIndex = parseInt(btn.dataset.rowIndex!)
          const row = this.getSortedData()[rowIndex]
          this._rowOriginals.set(row, { ...row })
          this._editingRows.add(row)
          this.render()
        })
      })

      // Confirm button: commit changes, fire o-row-change
      this.shadowRoot!.querySelectorAll<HTMLElement>('.edit-confirm').forEach(btn => {
        btn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          const rowIndex = parseInt(btn.dataset.rowIndex!)
          const row = this.getSortedData()[rowIndex]
          const original = this._rowOriginals.get(row) ?? {}
          const changes: Record<string, unknown> = {}

          this.shadowRoot!.querySelectorAll<HTMLInputElement>(
            `tr[data-row-index="${rowIndex}"] input.cell-input`
          ).forEach(input => {
            const k = input.dataset.key!
            const col = this._columns.find(c => c.key === k)
            if (col?.editable === 'click') {
              row[k] = input.value
              if (input.value !== String(original[k] ?? '')) changes[k] = input.value
            }
          })

          this._editingRows.delete(row)
          this._rowOriginals.delete(row)

          if (Object.keys(changes).length > 0) {
            this.dispatchEvent(new CustomEvent<OTableRowChangeEvent>('o-row-change', {
              bubbles: true, composed: true,
              detail: { rowIndex, row, changes }
            }))
          }
          this.render()
        })
      })

      // Cancel button: restore original values, exit edit mode
      this.shadowRoot!.querySelectorAll<HTMLElement>('.edit-cancel').forEach(btn => {
        btn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          const rowIndex = parseInt(btn.dataset.rowIndex!)
          const row = this.getSortedData()[rowIndex]
          const original = this._rowOriginals.get(row)
          if (original) { Object.assign(row, original); this._rowOriginals.delete(row) }
          this._editingRows.delete(row)
          this.render()
        })
      })
    }
```

- [ ] **Step 8: Run tests — all should pass**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | tail -20
```

Expected: All tests pass including the new editable suite.

- [ ] **Step 9: Commit**

```bash
cd OWC && git add src/table.ts src/table.test.ts
git commit -m "feat: o-table editable columns (always/click modes)"
```

---

## Task 3: o-note — failing tests

**Files:**
- Create: `OWC/src/note.test.ts`

- [ ] **Step 1: Write note.test.ts**

Create `OWC/src/note.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import './note'

describe('ONote - textarea variant', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-note')
    document.body.appendChild(el)
  })

  it('registers as o-note', () => {
    expect(customElements.get('o-note')).toBeDefined()
  })

  it('renders textarea by default', () => {
    expect(el.shadowRoot.querySelector('textarea')).not.toBeNull()
  })

  it('shows label when label attribute set', () => {
    el.setAttribute('label', 'Notes')
    const label = el.shadowRoot.querySelector('label')
    expect(label?.textContent?.trim()).toBe('Notes')
  })

  it('shows character counter when max-length set', () => {
    el.setAttribute('max-length', '100')
    const counter = el.shadowRoot.querySelector('.counter')
    expect(counter).not.toBeNull()
    expect(counter!.textContent).toContain('100')
  })

  it('counter updates on input', () => {
    el.setAttribute('max-length', '100')
    const ta = el.shadowRoot.querySelector('textarea')!
    ta.value = 'hello'
    ta.dispatchEvent(new Event('input'))
    expect(el.shadowRoot.querySelector('.count')!.textContent).toBe('5')
  })

  it('fires o-change with { value } on input', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const ta = el.shadowRoot.querySelector('textarea')!
    ta.value = 'hello'
    ta.dispatchEvent(new Event('input'))
    expect(detail).toEqual({ value: 'hello' })
  })

  it('uses placeholder attribute', () => {
    el.setAttribute('placeholder', 'Write here')
    const ta = el.shadowRoot.querySelector('textarea')!
    expect(ta.getAttribute('placeholder')).toBe('Write here')
  })
})

describe('ONote - card variant', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-note')
    el.setAttribute('variant', 'card')
    document.body.appendChild(el)
  })

  it('renders card with title input, body textarea, tag area', () => {
    expect(el.shadowRoot.querySelector('.title-input')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.body-area')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.tag-area')).not.toBeNull()
  })

  it('adds a chip on Enter in tag input', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'bug'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(el.shadowRoot.querySelector('.chip')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.chip')!.textContent).toContain('bug')
  })

  it('does not add empty chip on Enter', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = '   '
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(el.shadowRoot.querySelector('.chip')).toBeNull()
  })

  it('removes chip on chip click', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'bug'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    el.shadowRoot.querySelector('.chip')!.click()
    expect(el.shadowRoot.querySelector('.chip')).toBeNull()
  })

  it('fires o-change with { title, body, tags } on title input', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const titleInput = el.shadowRoot.querySelector<HTMLInputElement>('.title-input')!
    titleInput.value = 'My Note'
    titleInput.dispatchEvent(new Event('input'))
    expect(detail).toMatchObject({ title: 'My Note', body: '', tags: [] })
  })

  it('fires o-change with updated tags after add', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'urgent'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(detail).toMatchObject({ tags: ['urgent'] })
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | grep -E 'note|FAIL' | head -20
```

Expected: `Cannot find module './note'` or similar failures.

---

## Task 4: o-note — implementation

**Files:**
- Create: `OWC/src/note.ts`

- [ ] **Step 1: Create OWC/src/note.ts**

```ts
class ONote extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'label', 'placeholder', 'max-length', 'value']
  }

  private _tags: string[] = []

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  private get variant() { return this.getAttribute('variant') ?? 'textarea' }

  private render() {
    if (this.variant === 'card') this.renderCard()
    else this.renderTextarea()
    this.attachNoteHandlers()
  }

  private renderTextarea() {
    const label = this.getAttribute('label') ?? ''
    const placeholder = this.getAttribute('placeholder') ?? ' '
    const maxLen = this.getAttribute('max-length')
    const value = this.getAttribute('value') ?? ''

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
          display: block;
        }
        .wrap {
          position: relative;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: ${label ? '24px 16px 12px' : '12px 16px'};
          transition: border-color 0.15s;
        }
        .wrap:focus-within { border-color: var(--accent-warm); }
        label {
          position: absolute; top: 8px; left: 16px;
          color: rgba(255,255,255,0.5); font-size: 11px;
          font-family: sans-serif; pointer-events: none;
        }
        textarea {
          display: block; width: 100%;
          background: none; border: none; resize: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden;
        }
        .counter { text-align: right; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; }
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ''}
        <textarea placeholder="${placeholder}"${maxLen ? ` maxlength="${maxLen}"` : ''}>${value}</textarea>
      </div>
      ${maxLen ? `<div class="counter"><span class="count">${value.length}</span> / ${maxLen}</div>` : ''}
    `
  }

  private renderCard() {
    const placeholder = this.getAttribute('placeholder') ?? 'Write something…'

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
          display: block;
        }
        .card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .title-input {
          background: none; border: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          color: #fff; font-size: 18px; font-weight: 600;
          font-family: sans-serif; outline: none; padding-bottom: 8px; width: 100%;
        }
        .title-input:focus { border-color: var(--accent-warm); }
        .title-input::placeholder { color: rgba(255,255,255,0.3); }
        .body-area {
          background: none; border: none; resize: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden; width: 100%;
        }
        .body-area::placeholder { color: rgba(255,255,255,0.3); }
        .tag-area { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .chip {
          background: var(--accent-warm); border-radius: 999px;
          padding: 2px 10px; font-size: 12px; color: #000; cursor: pointer;
        }
        .tag-input {
          background: none; border: none; color: #fff;
          font-size: 12px; font-family: sans-serif; outline: none; min-width: 80px;
        }
        .tag-input::placeholder { color: rgba(255,255,255,0.3); }
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" />
        <textarea class="body-area" placeholder="${placeholder}"></textarea>
        <div class="tag-area">
          ${this._tags.map((t, i) => `<span class="chip" data-tag-index="${i}">${t} ×</span>`).join('')}
          <input class="tag-input" placeholder="Add tag…" />
        </div>
      </div>
    `
  }

  private attachNoteHandlers() {
    if (this.variant !== 'card') {
      const ta = this.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')
      const count = this.shadowRoot!.querySelector<HTMLElement>('.count')
      ta?.addEventListener('input', () => {
        ta.style.height = 'auto'
        ta.style.height = ta.scrollHeight + 'px'
        if (count) count.textContent = String(ta.value.length)
        this.dispatchEvent(new CustomEvent('o-change', {
          bubbles: true, composed: true, detail: { value: ta.value }
        }))
      })
      return
    }

    const titleInput = this.shadowRoot!.querySelector<HTMLInputElement>('.title-input')
    const bodyArea = this.shadowRoot!.querySelector<HTMLTextAreaElement>('.body-area')
    const tagInput = this.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')

    const fireChange = () => {
      this.dispatchEvent(new CustomEvent('o-change', {
        bubbles: true, composed: true,
        detail: { title: titleInput?.value ?? '', body: bodyArea?.value ?? '', tags: [...this._tags] }
      }))
    }

    titleInput?.addEventListener('input', fireChange)
    bodyArea?.addEventListener('input', () => {
      bodyArea.style.height = 'auto'
      bodyArea.style.height = bodyArea.scrollHeight + 'px'
      fireChange()
    })
    tagInput?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        this._tags.push(tagInput.value.trim())
        tagInput.value = ''
        this.render()
        fireChange()
      }
    })
    this.shadowRoot!.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this._tags.splice(parseInt(chip.dataset.tagIndex!), 1)
        this.render()
        fireChange()
      })
    })
  }
}

customElements.define('o-note', ONote)
```

- [ ] **Step 2: Run tests — all note tests should pass**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | grep -E '(o-note|note)' | head -20
```

Expected: All `ONote` tests pass.

- [ ] **Step 3: Commit**

```bash
cd OWC && git add src/note.ts src/note.test.ts
git commit -m "feat: add o-note component (textarea + card variants)"
```

---

## Task 5: o-dialog — failing tests

**Files:**
- Create: `OWC/src/dialog.test.ts`

- [ ] **Step 1: Create dialog.test.ts**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './dialog'

describe('ODialog', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-dialog')
    document.body.appendChild(el)
  })

  afterEach(() => {
    // Clean up any keydown listeners by replacing element
    document.body.innerHTML = ''
  })

  it('registers as o-dialog', () => {
    expect(customElements.get('o-dialog')).toBeDefined()
  })

  it('backdrop hidden by default', () => {
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('open() shows backdrop', () => {
    el.open()
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(true)
  })

  it('close() hides backdrop', () => {
    el.open()
    el.close()
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('open attribute shows dialog', () => {
    el.setAttribute('open', '')
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(true)
  })

  it('removing open attribute hides dialog', () => {
    el.setAttribute('open', '')
    el.removeAttribute('open')
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('clicking backdrop fires o-cancel and closes', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    el.shadowRoot.querySelector('.backdrop').dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    expect(cancelled).toBe(true)
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('clicking panel does not fire o-cancel', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    el.shadowRoot.querySelector('.panel').dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    expect(cancelled).toBe(false)
  })

  it('Escape key fires o-cancel and closes', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(cancelled).toBe(true)
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('Escape does not fire when dialog is closed', () => {
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(cancelled).toBe(false)
  })

  it('collects named inputs and fires o-submit, then closes', () => {
    el.innerHTML = `
      <span slot="title">Test</span>
      <input name="username" value="alice" />
      <input name="role" value="eng" />
      <div slot="actions"><button type="submit">Save</button></div>
    `
    el.open()
    let detail: any = null
    el.addEventListener('o-submit', (e: any) => { detail = e.detail })
    el.querySelector('button[type="submit"]').click()
    expect(detail).toEqual({ username: 'alice', role: 'eng' })
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })
})
```

- [ ] **Step 2: Run — confirm failures**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | grep -E '(dialog|FAIL)' | head -20
```

Expected: Cannot find module `'./dialog'` or all dialog tests fail.

---

## Task 6: o-dialog — implementation

**Files:**
- Create: `OWC/src/dialog.ts`

- [ ] **Step 1: Create OWC/src/dialog.ts**

```ts
class ODialog extends HTMLElement {
  static get observedAttributes() { return ['open'] }

  private _onKeyDown: ((e: KeyboardEvent) => void) | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this._onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) {
        this.handleCancel()
      }
    }
    document.addEventListener('keydown', this._onKeyDown)

    // Submit via native button[type=submit] click bubbling to host
    this.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Element
      if (target.getAttribute('type') === 'submit' || target.closest('[type="submit"]')) {
        e.preventDefault()
        this.handleSubmit()
      }
    })
  }

  disconnectedCallback() {
    if (this._onKeyDown) document.removeEventListener('keydown', this._onKeyDown)
  }

  attributeChangedCallback(name: string, _old: string | null, _new: string | null) {
    if (name !== 'open') return
    const backdrop = this.shadowRoot?.querySelector('.backdrop')
    if (!backdrop) return
    if (_new !== null) backdrop.classList.add('visible')
    else backdrop.classList.remove('visible')
  }

  open() { this.setAttribute('open', '') }
  close() { this.removeAttribute('open') }

  private handleSubmit() {
    const detail: Record<string, string> = {}
    this.querySelectorAll<HTMLInputElement>('input[name],select[name],textarea[name]')
      .forEach(input => { detail[input.name] = input.value })
    this.dispatchEvent(new CustomEvent('o-submit', { bubbles: true, composed: true, detail }))
    this.close()
  }

  private handleCancel() {
    this.close()
    this.dispatchEvent(new CustomEvent('o-cancel', { bubbles: true, composed: true, detail: null }))
  }

  private render() {
    const isOpen = this.hasAttribute('open')
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
          display: contents;
        }
        .backdrop {
          display: none;
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          align-items: center; justify-content: center;
        }
        .backdrop.visible { display: flex; animation: fadeIn 0.2s ease-out; }
        .panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: 24px; min-width: 320px; max-width: 90vw;
          color: #fff;
          animation: scaleIn 0.2s ease-out;
        }
        .panel-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
        .panel-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .panel-actions { display: flex; justify-content: flex-end; gap: 8px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      </style>
      <div class="backdrop${isOpen ? ' visible' : ''}">
        <div class="panel">
          <div class="panel-title"><slot name="title"></slot></div>
          <div class="panel-body"><slot></slot></div>
          <div class="panel-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `
    // Backdrop click → cancel (not panel click)
    this.shadowRoot!.querySelector('.backdrop')!.addEventListener('click', (e: MouseEvent) => {
      if (e.target === e.currentTarget) this.handleCancel()
    })
  }
}

customElements.define('o-dialog', ODialog)
```

- [ ] **Step 2: Run all tests — everything passes**

```bash
cd OWC && bun run test -- --reporter=verbose 2>&1 | tail -20
```

Expected: All tests pass (table, note, dialog).

- [ ] **Step 3: Commit**

```bash
cd OWC && git add src/dialog.ts src/dialog.test.ts
git commit -m "feat: add o-dialog glassmorphism dialog component"
```

---

## Task 7: Wire up index.ts

**Files:**
- Modify: `OWC/src/index.ts`

- [ ] **Step 1: Add note and dialog imports/exports**

Replace `OWC/src/index.ts` with:

```ts
import './core'
import './table'
import { toast } from './toast'
import './toggle'
import './search'
import './note'
import './dialog'

export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}
```

- [ ] **Step 2: Build CDN bundle**

```bash
cd OWC && bun run build:cdn 2>&1
```

Expected: `dist/components.js` rebuilt with no errors. Check file size grows from ~40KB.

- [ ] **Step 3: Get new git commit hash for CDN URL**

```bash
git rev-parse HEAD
```

Copy the full hash — you'll use it in the next task's CDN `<script>` src.

- [ ] **Step 4: Commit**

```bash
cd OWC && git add src/index.ts dist/components.js
git commit -m "feat: export o-note and o-dialog; rebuild CDN bundle"
```

---

## Task 8: Demo page — three new sections

**Files:**
- Modify: `OWC/index.html`

- [ ] **Step 1: Update CDN script tag hash**

In `index.html` line 7, replace the existing SHA in the jsDelivr URL with the hash from Task 7 Step 3:

```html
<script src="https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@<NEW_HASH>/OWC/dist/components.js"></script>
```

Also update the inline `.code` display block on line 39 to match.

- [ ] **Step 2: Append editable table section before `</body>`**

Add after the last existing demo section and before `</body>`:

```html
    <!-- o-table editable -->
    <h2>o-table (editable)</h2>
    <p class="desc">
      <code>editable="always"</code> renders inline inputs. <code>editable="click"</code> uses a row edit button.
      Events: <code>o-cell-change</code>, <code>o-row-change</code>.
    </p>
    <o-table id="editable-table" editable selectable></o-table>
    <div id="edit-log" style="margin-top:10px;font-size:12px;opacity:0.7;min-height:20px"></div>
    <div class="code">&lt;o-table editable&gt;&lt;/o-table&gt;

table.columns = [
  { key: 'name', label: 'Name', editable: 'always' },
  { key: 'role', label: 'Role', editable: 'click'  },
  { key: 'status', label: 'Status' }
]
// Events: o-cell-change, o-row-change</div>
    <script>
      const editTable = document.getElementById('editable-table')
      const editLog = document.getElementById('edit-log')
      editTable.columns = [
        { key: 'name', label: 'Name', editable: 'always', width: 160 },
        { key: 'role', label: 'Role', editable: 'click',  width: 140 },
        { key: 'status', label: 'Status', width: 120 }
      ]
      editTable.data = [
        { name: 'Alice', role: 'Engineer', status: 'Active' },
        { name: 'Bob',   role: 'Designer', status: 'Away'   },
        { name: 'Carol', role: 'Manager',  status: 'Active' }
      ]
      editTable.addEventListener('o-cell-change', e => {
        editLog.textContent = `o-cell-change: ${e.detail.key} = "${e.detail.value}" (row ${e.detail.rowIndex})`
      })
      editTable.addEventListener('o-row-change', e => {
        editLog.textContent = `o-row-change: row ${e.detail.rowIndex} → ${JSON.stringify(e.detail.changes)}`
      })
    </script>

    <!-- o-note -->
    <h2>o-note</h2>
    <p class="desc">Glass-styled note area. <code>variant="textarea"</code> (default) with floating label &amp; char count. <code>variant="card"</code> with title, body, and tag chips.</p>
    <div class="row" style="align-items:flex-start">
      <o-note label="Quick Note" placeholder="Type here…" max-length="200" style="width:280px"></o-note>
      <o-note variant="card" placeholder="Body…" style="width:280px"></o-note>
    </div>
    <div id="note-log" style="margin-top:10px;font-size:12px;opacity:0.7;min-height:20px"></div>
    <div class="code">&lt;o-note label="Quick Note" max-length="200"&gt;&lt;/o-note&gt;
&lt;o-note variant="card"&gt;&lt;/o-note&gt;

// Event: o-change → { value } or { title, body, tags }</div>
    <script>
      const noteLog = document.getElementById('note-log')
      document.querySelectorAll('o-note').forEach(note => {
        note.addEventListener('o-change', e => {
          noteLog.textContent = 'o-change: ' + JSON.stringify(e.detail)
        })
      })
    </script>

    <!-- o-dialog -->
    <h2>o-dialog</h2>
    <p class="desc">Glassmorphism form dialog. Opens programmatically or via <code>open</code> attribute. Collects named inputs on submit.</p>
    <div class="row">
      <o-button id="open-dialog-btn">Open Dialog</o-button>
    </div>
    <div id="dialog-log" style="margin-top:10px;font-size:12px;opacity:0.7;min-height:20px"></div>
    <o-dialog id="demo-dialog">
      <span slot="title">Add Team Member</span>
      <label style="font-size:13px;opacity:0.7">Name</label>
      <input name="name" type="text" placeholder="Alice"
             style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
                    border-radius:6px;color:#fff;padding:8px 10px;font-size:14px;
                    outline:none;width:100%;" />
      <label style="font-size:13px;opacity:0.7">Role</label>
      <input name="role" type="text" placeholder="Engineer"
             style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
                    border-radius:6px;color:#fff;padding:8px 10px;font-size:14px;
                    outline:none;width:100%;" />
      <div slot="actions">
        <o-button type="submit">Save</o-button>
        <o-button variant="ghost" id="cancel-btn">Cancel</o-button>
      </div>
    </o-dialog>
    <div class="code">&lt;o-dialog id="my-dialog"&gt;
  &lt;span slot="title"&gt;Add New Item&lt;/span&gt;
  &lt;input name="name" type="text" /&gt;
  &lt;div slot="actions"&gt;
    &lt;o-button type="submit"&gt;Save&lt;/o-button&gt;
  &lt;/div&gt;
&lt;/o-dialog&gt;

dialog.open()
dialog.addEventListener('o-submit', e =&gt; console.log(e.detail))
dialog.addEventListener('o-cancel', () =&gt; console.log('cancelled'))</div>
    <script>
      const dialog = document.getElementById('demo-dialog')
      const dialogLog = document.getElementById('dialog-log')
      document.getElementById('open-dialog-btn').addEventListener('o-click', () => dialog.open())
      document.getElementById('cancel-btn').addEventListener('o-click', () => dialog.close())
      dialog.addEventListener('o-submit', e => {
        dialogLog.textContent = 'o-submit: ' + JSON.stringify(e.detail)
      })
      dialog.addEventListener('o-cancel', () => {
        dialogLog.textContent = 'o-cancel fired'
      })
    </script>
```

- [ ] **Step 3: Open in browser and verify all three sections work**

```bash
cd OWC && bun run dev
```

Open `http://localhost:5173` and check:
- Editable table: name column has inputs, role column has ✏️ button → clicking shows input + ✓✗ buttons; events log below.
- Notes: left has floating label + counter, right has title/body/tags.
- Dialog: clicking the button opens dialog, submit collects inputs, cancel/Escape closes it.

- [ ] **Step 4: Commit**

```bash
cd OWC && git add index.html
git commit -m "demo: add editable table, notes, and dialog sections"
```

---

## Self-Review

**Spec coverage:**
- ✅ `o-table editable` attribute → `always` renders inputs, `click` uses edit button row
- ✅ `o-cell-change` event with `{ key, value, rowIndex, row }`
- ✅ `o-row-change` event with `{ rowIndex, row, changes }`
- ✅ `o-note variant="textarea"` with floating label, char counter, `o-change`
- ✅ `o-note variant="card"` with title, body, tag chips, `o-change`
- ✅ `o-dialog` with slots (title, default, actions), open/close API, animations
- ✅ `o-submit` collects named inputs, `o-cancel` on backdrop/Escape
- ✅ Shared glass tokens defined in `:host` for all three new components
- ✅ Demo page sections for all three features
- ✅ CDN URL updated after bundle rebuild

**Notes:**
- `Enter` on `always`-editable cell fires same as blur (commit + blur)
- Tag chips are preserved across `render()` calls via `_tags` private array
- `o-dialog` cleans up its `keydown` listener in `disconnectedCallback`
- Backdrop `click` check uses `e.target === e.currentTarget` to avoid panel-click false-positives
