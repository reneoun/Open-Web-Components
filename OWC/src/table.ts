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

export class OTable extends HTMLElement {
  static get observedAttributes() { return ['storage', 'storage-key', 'resize-mode', 'selectable', 'editable'] }

  private _columns: OTableColumn[] = []
  private _data: Record<string, unknown>[] = []
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'
  private _selectedRows: Set<Record<string, unknown>> = new Set()
  private _editingRows: Set<Record<string, unknown>> = new Set()
  private _rowOriginals: Map<Record<string, unknown>, Record<string, unknown>> = new Map()

  get columns() { return this._columns }
  set columns(v: OTableColumn[]) { this._columns = v; this.render() }

  get data() { return this._data }
  set data(v: Record<string, unknown>[]) {
    this._data = v
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
    this.attachShadow({ mode: 'open' })
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
        :host { display: block; overflow-x: auto; }
        table {
          border-collapse: collapse;
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
        th[data-sortable] { cursor: pointer; }
        tbody tr:hover td { background: rgba(255,255,255,0.06); }
        .sort-icon { float: right; opacity: 0.5; }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: rgba(255,255,255,0.3); }
        tbody tr.selected td { background: rgba(255,255,255,0.12); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: rgba(255,255,255,0.9);
        }
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
      </style>
      ${(() => {
        const hasClickEditable = this._columns.some(c => c.editable === 'click')
        const editTh = this.editable && hasClickEditable ? '<th style="width:72px"></th>' : ''
        return `<table>
        <thead><tr>
          ${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all></th>` : ''}
          ${this._columns.map(c => this.renderTh(c)).join('')}
          ${editTh}
        </tr></thead>
        <tbody>${this.getSortedData().map((row, i) => this.renderRow(row, i, hasClickEditable)).join('')}</tbody>
      </table>`
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
    const selectedClass = this._selectedRows.has(row) ? ' class="selected"' : ''
    const checkbox = this.selectable
      ? `<td><input type="checkbox" data-select-row${checked}></td>`
      : ''

    const isEditing = this._editingRows.has(row)

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

      // Edit button: enter edit mode for that row
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
  }
}

customElements.define('o-table', OTable)
