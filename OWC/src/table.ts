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
  private _sortCol: string | null = null
  private _sortDir: SortDir = 'none'

  get columns() { return this._columns }
  set columns(v: OTableColumn[]) { this._columns = v; this.render() }

  get data() { return this._data }
  set data(v: Record<string, unknown>[]) { this._data = v; this.render() }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.restoreState()
    this.render()
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
      </style>
      <table>
        <thead><tr>${this._columns.map(c => this.renderTh(c)).join('')}</tr></thead>
        <tbody>${this.getSortedData().map(row => this.renderRow(row)).join('')}</tbody>
      </table>
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

  private renderRow(row: Record<string, unknown>): string {
    return `<tr>${this._columns.map(c =>
      `<td>${row[c.key] ?? ''}</td>`
    ).join('')}</tr>`
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
          this.shadowRoot!.querySelectorAll<HTMLElement>('th').forEach((t, i) => {
            const w = parseInt(t.style.width) || t.offsetWidth
            if (w) this._columns[i] = { ...this._columns[i], width: w }
          })
          this.persistState()
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
      })
    })
  }
}

customElements.define('o-table', OTable)
