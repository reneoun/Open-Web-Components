import { GlassElement, glassBaseStyles } from './glass'

export interface OPageEvent {
  page: number
  start: number
  end: number
  totalPages: number
  pageSize: number
}

/** Clamp n into [lo, hi]. */
function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n
}

/**
 * Page numbers to render, with `null` marking an elided run.
 * Always keeps first, last and `siblings` neighbours of the current page.
 */
export function pageWindow(page: number, totalPages: number, siblings = 1): (number | null)[] {
  // Small enough to show every page: no ellipsis needed.
  if (totalPages <= siblings * 2 + 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const left = Math.max(2, page - siblings)
  const right = Math.min(totalPages - 1, page + siblings)
  const out: (number | null)[] = [1]
  if (left > 2) out.push(null)
  for (let p = left; p <= right; p++) out.push(p)
  if (right < totalPages - 1) out.push(null)
  out.push(totalPages)
  return out
}

export class OPaginator extends GlassElement {
  static get observedAttributes() { return ['total', 'page-size', 'page', 'siblings', 'compact'] }

  private _total = 0
  private _pageSize = 10
  private _page = 1

  get total() { return this._total }
  set total(v: number) {
    this._total = Math.max(0, Math.floor(v) || 0)
    this._page = clamp(this._page, 1, this.totalPages)
    this.render()
  }

  get pageSize() { return this._pageSize }
  set pageSize(v: number) {
    this._pageSize = Math.max(1, Math.floor(v) || 1)
    this._page = clamp(this._page, 1, this.totalPages)
    this.render()
  }

  get page() { return this._page }
  set page(v: number) {
    const next = clamp(Math.floor(v) || 1, 1, this.totalPages)
    if (next === this._page) return
    this._page = next
    this.render()
    this.emit()
  }

  get totalPages() { return Math.max(1, Math.ceil(this._total / this._pageSize)) }
  /** First row index of the current page (0-based, inclusive). */
  get start() { return this._total === 0 ? 0 : (this._page - 1) * this._pageSize }
  /** One past the last row index of the current page (exclusive). */
  get end() { return Math.min(this.start + this._pageSize, this._total) }

  get siblings() { return Math.max(0, parseInt(this.getAttribute('siblings') ?? '1') || 0) }
  get compact() { return this.hasAttribute('compact') }

  constructor() {
    super()
    this.shadowRoot!.addEventListener('click', this.handleClick)
  }

  connectedCallback() {
    this.syncFromAttributes()
    this.render()
  }

  attributeChangedCallback() {
    if (!this.isConnected) return
    this.syncFromAttributes()
    this.render()
  }

  private syncFromAttributes() {
    const total = this.getAttribute('total')
    if (total != null) this._total = Math.max(0, parseInt(total) || 0)
    const size = this.getAttribute('page-size')
    if (size != null) this._pageSize = Math.max(1, parseInt(size) || 1)
    const page = this.getAttribute('page')
    if (page != null) this._page = parseInt(page) || 1
    this._page = clamp(this._page, 1, this.totalPages)
  }

  private emit() {
    this.dispatchEvent(new CustomEvent<OPageEvent>('o-page', {
      bubbles: true, composed: true,
      detail: {
        page: this._page,
        start: this.start,
        end: this.end,
        totalPages: this.totalPages,
        pageSize: this._pageSize,
      },
    }))
  }

  private handleClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('button[data-goto]')
    if (!btn || btn.hasAttribute('disabled')) return
    const goto = btn.dataset.goto!
    const target = goto === 'prev' ? this._page - 1
      : goto === 'next' ? this._page + 1
      : parseInt(goto)
    this.page = target
  }

  private render() {
    if (!this.shadowRoot) return
    const pages = this.totalPages
    const atFirst = this._page <= 1
    const atLast = this._page >= pages
    // Human-facing range is 1-based and inclusive; empty data reads "0 of 0".
    const from = this._total === 0 ? 0 : this.start + 1
    const to = this.end

    const numbers = this.compact
      ? `<span class="of">Page ${this._page} of ${pages}</span>`
      : pageWindow(this._page, pages, this.siblings).map(p =>
          p === null
            ? `<span class="gap" aria-hidden="true">…</span>`
            : `<button class="num${p === this._page ? ' active' : ''}" data-goto="${p}"${p === this._page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`
        ).join('')

    this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .pager {
          display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
          font-family: var(--glass-font); font-size: 13px;
          color: var(--glass-text);
        }
        .range { color: var(--glass-text-muted); margin-right: auto; padding: 4px 2px; }
        .of { color: var(--glass-text-muted); padding: 0 6px; }
        button {
          min-width: 30px; padding: 5px 9px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-sm);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-elevation);
          color: var(--glass-text);
          font-family: var(--glass-font); font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.05s;
        }
        button:hover:not([disabled]) { background: var(--glass-hover); }
        button:active:not([disabled]) { transform: var(--glass-press); }
        button[disabled] { opacity: 0.4; cursor: default; }
        button.active {
          background: var(--accent-warm);
          color: var(--glass-accent-text);
          border-color: var(--accent-warm);
        }
        button:focus-visible { outline: 2px solid var(--accent-warm); outline-offset: 2px; }
        .gap { color: var(--glass-text-dim); padding: 0 2px; }
      </style>
      <div class="pager" role="navigation" aria-label="Pagination">
        <span class="range">${from}–${to} of ${this._total}</span>
        <button data-goto="prev"${atFirst ? ' disabled' : ''} aria-label="Previous page">‹</button>
        ${numbers}
        <button data-goto="next"${atLast ? ' disabled' : ''} aria-label="Next page">›</button>
      </div>
    `
  }
}

customElements.define('o-paginator', OPaginator)
