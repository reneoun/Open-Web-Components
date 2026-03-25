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
