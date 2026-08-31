import { GlassElement, glassBaseStyles, glassScrollbarStyles } from './glass'
import './paginator'
import type { OPageEvent } from './paginator'

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

export class OTable extends GlassElement {
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode', 'selectable', 'editable', 'page-size'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'
  private _selectedRows: Set<Record<string, unknown>> = new Set()
  private _editingRows: Set<Record<string, unknown>> = new Set()
  private _rowOriginals: Map<Record<string, unknown>, Record<string, unknown>> = new Map()
  private _page = 1
  /** Rows actually rendered — the current page, or every sorted row when unpaginated. */
  private _visibleRows: Record<string, unknown>[] = []

  get columns() { return this._columns }
  set columns(v: OTableColumn[]) { this._columns = v; this.render() }

  get data() { return this._data }
  set data(v: Record<string, unknown>[]) {
    this._data = v
    this._page = 1
    this._selectedRows.clear()
    this._editingRows.clear()
    this._rowOriginals.clear()
    this.render()
  }

  get selected(): Record<string, unknown>[] {
    return this._data.filter(row => this._selectedRows.has(row))
  }

  get selectable() { return this.hasAttribute('selectable') }
  get editable() { return this.hasAttribute('editable') }

  constructor() {
    super()
  }

  connectedCallback() {
    this.restoreState()
    this.render()
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

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

  private render() {
    if (!this.shadowRoot) return
    this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; overflow-x: auto; }
        .table-wrap { width: fit-content; max-width: 100%; }
        o-paginator { display: block; margin-top: 10px; }
        ${glassScrollbarStyles(':host')}
        table {
          /* separate rather than collapse: a collapsed table merges its own
             border into the edge cells, which makes border-radius + overflow
             clipping unreliable and leaves the outer edge undrawn. With
             border-spacing 0 the layout is identical, and the outer border is
             the table's own so it rounds and clips correctly. */
          border-collapse: separate;
          border-spacing: 0;
          font-family: var(--glass-font); font-size: 14px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-table-edge);
          border-radius: var(--glass-radius); overflow: hidden;
          box-shadow: var(--glass-elevation);
        }
        th, td {
          padding: 10px 14px; text-align: left;
          border-bottom: var(--glass-border-width) solid var(--glass-table-line);
          color: var(--glass-text); position: relative;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        /* Under border-collapse separate the last row's own bottom line would
           sit just inside the table border and read as a doubled edge. */
        tbody tr:last-child td { border-bottom: none; }
        th {
          background: var(--glass-hover);
          user-select: none;
          backdrop-filter: var(--glass-backdrop);
        }
        th[data-sortable] { cursor: pointer; }
        tbody tr:hover td { background: var(--glass-hover); }
        .sort-icon { float: right; opacity: 0.5; }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: var(--glass-border); }
        tbody tr.selected td { background: var(--glass-bg); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: var(--glass-text);
        }
        .cell-input {
          /* border-box makes the declared width the FINAL width: padding and a
             theme's border (1px on glass, 3px on pixel) are absorbed rather than
             added on top. Without it the input grew past its cell and the
             td's overflow:hidden clipped it out of sight. */
          box-sizing: border-box;
          background: var(--glass-hover);
          border: var(--glass-border-width) solid var(--accent-warm);
          border-radius: var(--glass-radius-sm);
          color: var(--glass-text);
          padding: 4px 8px;
          font-size: 13px;
          width: 100%;
          max-width: 100%;
          outline: none;
          font-family: var(--glass-font);
        }
        /* An editing cell trades its text padding for a thinner gutter, so a
           chunky-bordered input still clears the column edge on both sides. */
        td.cell-edit { padding: 6px 8px; overflow: visible; }
        .cell-input:focus { border-color: var(--accent-warm); background: var(--glass-border); }
        .edit-actions { width: 72px; text-align: center; padding: 6px 4px; }
        .edit-btn, .edit-confirm, .edit-cancel {
          background: none; border: none; cursor: pointer;
          font-size: 13px; padding: 2px 4px; opacity: 0.7; color: var(--glass-text); border-radius: var(--glass-radius-xs);
        }
        .edit-btn:hover, .edit-confirm:hover, .edit-cancel:hover { opacity: 1; }
        .edit-confirm { color: var(--glass-positive); }
        .edit-cancel { color: var(--glass-negative); }
        tr.editing-highlight td { border-left: var(--glass-border-width) solid var(--accent-warm); background: var(--glass-hover); }
        tr.edit-row td { background: var(--glass-bg); border-left: var(--glass-border-width) solid var(--accent-warm); padding: 12px 14px; }
        .edit-form { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
        .edit-field { display: flex; flex-direction: column; gap: 4px; }
        .edit-field label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; }
        .edit-form .cell-input { width: 140px; flex: 0 0 auto; }
        .edit-form-actions { display: flex; gap: 4px; align-items: center; margin-left: auto; }
      </style>
      ${(() => {
        const hasClickEditable = this._columns.some(c => c.editable === 'click')
        const editTh = this.editable && hasClickEditable ? '<th style="width:72px"></th>' : ''
        const sorted = this.getSortedData()
        const { start, end } = this.getVisibleRange(sorted.length)
        this._visibleRows = sorted.slice(start, end)
        const size = this.pageSize
        // rowIndex stays absolute into the sorted view, so the existing
        // getSortedData()[rowIndex] lookups keep resolving the right row on
        // every page — a page-relative index would silently edit row 0.
        const rows = this._visibleRows.map((row, i) => this.renderRow(row, start + i, hasClickEditable)).join('')
        const pager = size == null ? '' : `<o-paginator part="pager" total="${sorted.length}" page-size="${size}" page="${this._page}"></o-paginator>`
        // Wrapped so the pager inherits the table's intrinsic width and lines
        // up under its right edge instead of stretching the full host width.
        return `<div class="table-wrap"><table>
        <thead><tr>
          ${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all aria-label="Select all rows"></th>` : ''}
          ${this._columns.map(c => this.renderTh(c)).join('')}
          ${editTh}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>${pager}</div>`
      })()}
    `
    this.attachHandlers()
  }

  private renderTh(col: OTableColumn): string {
    const w = col.width ? `${col.width}px` : 'fit-content'
    const minW = col.minWidth ? `min-width:${col.minWidth}px;` : ''
    const maxW = col.maxWidth ? `max-width:${col.maxWidth}px;` : ''
    const sortable = col.sortable ? ' data-sortable' : ''
    const icon = col.sortable
      ? `<span class="sort-icon">${
          this._sortCol === col.key && this._sortDir === 'asc' ? '↑'
          : this._sortCol === col.key && this._sortDir === 'desc' ? '↓'
          : '↕'
        }</span>`
      : ''
    return `<th data-key="${col.key}"${sortable} style="width:${w};${minW}${maxW}">
      ${col.label}${icon}
      <div class="resize-handle" data-resize="${col.key}"></div>
    </th>`
  }

  private renderRow(row: Record<string, unknown>, rowIndex: number, hasClickEditable: boolean): string {
    const checked = this._selectedRows.has(row) ? ' checked' : ''
    const isSelected = this._selectedRows.has(row)
    const checkbox = this.selectable
      ? `<td><input type="checkbox" data-select-row${checked} aria-label="Select row"></td>`
      : ''

    const isEditing = this._editingRows.has(row)
    const trClasses = [isSelected ? 'selected' : '', isEditing ? 'editing-highlight' : ''].filter(Boolean).join(' ')
    const trClassAttr = trClasses ? ` class="${trClasses}"` : ''

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

    // Always-editable cells render inline inputs; click-editable show as read-only text in the main row
    const cells = this._columns.map(c => {
      if (this.editable && c.editable === 'always') {
        const val = String(row[c.key] ?? '').replace(/"/g, '&quot;')
        return `<td class="cell-edit"><input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" /></td>`
      }
      return `<td>${row[c.key] ?? ''}</td>`
    }).join('')

    let result = `<tr${trClassAttr} data-row-index="${rowIndex}">${checkbox}${cells}${editTd}</tr>`

    // Render edit form row below when editing
    if (isEditing) {
      const totalCols = this._columns.length + (this.selectable ? 1 : 0) + (hasClickEditable ? 1 : 0)
      const fields = this._columns
        .filter(c => c.editable === 'click')
        .map(c => {
          const val = String(row[c.key] ?? '').replace(/"/g, '&quot;')
          return `<div class="edit-field">
            <label>${c.label}</label>
            <input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" />
          </div>`
        }).join('')

      result += `<tr class="edit-row" data-edit-for="${rowIndex}">
        <td colspan="${totalCols}">
          <div class="edit-form">
            ${fields}
            <div class="edit-form-actions">
              <button class="edit-confirm" data-row-index="${rowIndex}" title="Confirm">✓</button>
              <button class="edit-cancel" data-row-index="${rowIndex}" title="Cancel">✗</button>
            </div>
          </div>
        </td>
      </tr>`
    }

    return result
  }

  /** Rows per page, or null when pagination is off. */
  private get pageSize(): number | null {
    const raw = this.getAttribute('page-size')
    if (raw == null) return null
    const n = parseInt(raw)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  get page() { return this._page }
  set page(v: number) {
    const size = this.pageSize
    if (size == null) return
    const pages = Math.max(1, Math.ceil(this.getSortedData().length / size))
    const next = Math.min(Math.max(1, Math.floor(v) || 1), pages)
    if (next === this._page) return
    this._page = next
    this.render()
  }

  /**
   * Slice bounds for the current page against the *sorted* view. Clamps the
   * page when the dataset shrank under it (e.g. a filter narrowed results).
   */
  private getVisibleRange(sortedLength: number): { start: number; end: number } {
    const size = this.pageSize
    if (size == null) return { start: 0, end: sortedLength }
    const pages = Math.max(1, Math.ceil(sortedLength / size))
    this._page = Math.min(Math.max(1, this._page), pages)
    const start = (this._page - 1) * size
    return { start, end: Math.min(start + size, sortedLength) }
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
    this.persistState()
    this.render()
  }

  private attachHandlers() {
    const mode = this.getAttribute('resize-mode') ?? 'single'

    // Internal pager. Its o-page is composed, so stop it at the table
    // boundary and re-emit from the table itself — consumers listen to the
    // table, not to an implementation detail inside its shadow root.
    const pager = this.shadowRoot!.querySelector('o-paginator')
    if (pager) {
      pager.addEventListener('o-page', (e: Event) => {
        e.stopPropagation()
        const detail = (e as CustomEvent<OPageEvent>).detail
        this._page = detail.page
        this.render()
        this.dispatchEvent(new CustomEvent<OPageEvent>('o-page', {
          bubbles: true, composed: true, detail
        }))
      })
    }

    // Sort handlers
    this.shadowRoot!.querySelectorAll<HTMLElement>('th[data-key]').forEach(th => {
      const key = th.dataset.key!
      th.addEventListener('click', () => this.handleSort(key))
    })

    // Resize handlers
    this.shadowRoot!.querySelectorAll<HTMLElement>('.resize-handle').forEach(handle => {
      const key = handle.dataset.resize!
      const colIdx = this._columns.findIndex(c => c.key === key)
      const col = this._columns[colIdx]

      handle.addEventListener('click', (e: MouseEvent) => e.stopPropagation())
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault()
        const startX = e.screenX
        const th = handle.closest('th') as HTMLElement
        const startW = th.offsetWidth || col.width || 100
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
          const offset = this.selectable ? 1 : 0
          this.shadowRoot!.querySelectorAll<HTMLElement>('th').forEach((t, i) => {
            const colIdx = i - offset
            if (colIdx < 0 || colIdx >= this._columns.length) return
            const w = parseInt(t.style.width) || t.offsetWidth
            if (w) this._columns[colIdx] = { ...this._columns[colIdx], width: w }
          })
          this.persistState()
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
      })
    })

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
          const scope = this._visibleRows
          const allSelected = scope.length > 0 && scope.every(row => this._selectedRows.has(row))
          if (allSelected) {
            scope.forEach(row => this._selectedRows.delete(row))
          } else {
            scope.forEach(row => this._selectedRows.add(row))
          }
          this.dispatchEvent(new CustomEvent<OTableRowSelectEvent>('o-row-select', {
            bubbles: true, composed: true,
            detail: { selected: this.selected }
          }))
          this.render()
        })
      }
    }

    // Editable handlers
    if (this.editable) {
      // always-editable cells: fire o-cell-change on blur/Enter when value changed
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
        input.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter') { commit(); input.blur() }
        })
      })

      // Edit button: enter edit mode for that row (close any other first)
      this.shadowRoot!.querySelectorAll<HTMLElement>('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          const rowIndex = parseInt(btn.dataset.rowIndex!)
          const row = this.getSortedData()[rowIndex]
          // Close any currently editing row without saving
          this._editingRows.forEach(r => {
            const orig = this._rowOriginals.get(r)
            if (orig) { Object.assign(r, orig); this._rowOriginals.delete(r) }
          })
          this._editingRows.clear()
          this._rowOriginals.set(row, { ...row })
          this._editingRows.add(row)
          this.render()
        })
      })

      // Confirm button: commit changes from edit form row, fire o-row-change
      this.shadowRoot!.querySelectorAll<HTMLElement>('.edit-confirm').forEach(btn => {
        btn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          const rowIndex = parseInt(btn.dataset.rowIndex!)
          const row = this.getSortedData()[rowIndex]
          const original = this._rowOriginals.get(row) ?? {}
          const changes: Record<string, unknown> = {}

          this.shadowRoot!.querySelectorAll<HTMLInputElement>(
            `tr[data-edit-for="${rowIndex}"] input.cell-input`
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
  }
}

customElements.define('o-table', OTable)
