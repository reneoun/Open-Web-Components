import { GlassElement, glassBaseStyles } from './glass'

export interface OSearchInputEvent   { query: string }
export interface OSearchResultsEvent { query: string; results: unknown[] }
export interface OSearchSelectEvent  { item: unknown; query: string }

export class OSearch extends GlassElement {
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
    const container = this.shadowRoot!.querySelector('.container')
    if (!show) {
      dropdown.style.display = 'none'
      if (container) container.setAttribute('aria-expanded', 'false')
      return
    }
    dropdown.style.display = 'block'
    if (container) container.setAttribute('aria-expanded', 'true')
    if (this._currentResults.length === 0) {
      dropdown.innerHTML = `<div class="item no-results">No results</div>`
      return
    }
    dropdown.innerHTML = this._currentResults.map((item, i) =>
      `<div class="item" role="option" data-index="${i}">${this._renderItem!(item)}</div>`
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
        ${glassBaseStyles()}
        :host { display: block; position: relative; }
        .container {
          display: flex; align-items: center; gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 999px; padding: 8px 16px;
        }
        .icon { opacity: 0.6; flex-shrink: 0; }
        input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: sans-serif;
        }
        input::placeholder { color: var(--glass-text-muted); }
        .dropdown {
          display: none; position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 12px; border: 1px solid var(--glass-border);
          overflow: hidden; z-index: 10;
        }
        .item {
          padding: 8px 14px; color: var(--glass-text);
          font-size: 14px; font-family: sans-serif; cursor: pointer;
        }
        .item:hover { background: var(--glass-hover); }
        .no-results { opacity: 0.5; cursor: default; }
      </style>
      <div class="container" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <span class="icon">🔍</span>
      </div>
      <div class="dropdown" role="listbox"></div>
    `
    const container = shadow.querySelector('.container')!
    this._input.placeholder = this.getAttribute('placeholder') ?? 'Search…'
    container.appendChild(this._input)
    shadow.querySelector('.dropdown')!.addEventListener('click', this.handleDropdownClick)
  }
}

customElements.define('o-search', OSearch)
