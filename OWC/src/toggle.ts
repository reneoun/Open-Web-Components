export interface OToggleOption { label: string; value: string }
export interface OToggleChangeEvent { value: string; index: number; prev: string | null }

function toOptions(input: (string | OToggleOption)[]): OToggleOption[] {
  return input.map(o =>
    typeof o === 'string' ? { label: o, value: o.toLowerCase() } : o
  )
}

export class OToggle extends HTMLElement {
  static get observedAttributes() { return ['options', 'value'] }

  private _options: OToggleOption[] = []
  private _value: string | null = null

  get options() { return this._options }
  set options(v: (string | OToggleOption)[]) {
    this._options = toOptions(v)
    // preserve or reset value
    if (this._value && !this._options.find(o => o.value === this._value)) {
      this._value = this._options[0]?.value ?? null
    }
    // initialize value if still unset
    if (!this._value) this._value = this._options[0]?.value ?? null
    this.render()
  }

  get value() { return this._value ?? '' }
  set value(v: string) {
    if (!this._options.find(o => o.value === v)) return // unknown value: no-op
    this._value = v
    this.setAttribute('value', v)
    this.updateSelection()
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.addEventListener('click', this.handleClick)
  }

  connectedCallback() {
    // child elements: only if _options still empty
    if (this._options.length === 0) {
      const children = [...this.querySelectorAll('[value]')] as HTMLElement[]
      if (children.length > 0) {
        this._options = children.map(c => ({
          label: c.textContent?.trim() ?? '',
          value: c.getAttribute('value') ?? ''
        }))
      }
    }
    // attribute fallback
    if (this._options.length === 0) {
      const attr = this.getAttribute('options')
      if (attr) this._options = toOptions(attr.split(',').map(s => s.trim()))
    }
    // default value
    if (!this._value) this._value = this._options[0]?.value ?? null
    this.render()
  }

  attributeChangedCallback(name: string, _old: string | null, val: string | null) {
    if (name === 'options' && val !== null) {
      const parsed = toOptions(val.split(',').map(s => s.trim()))
      if (this._value && !parsed.find(o => o.value === this._value)) {
        this._value = parsed[0]?.value ?? null
      }
      this._options = parsed
      this.render()
    }
    if (name === 'value' && val !== null) {
      if (this._options.find(o => o.value === val)) {
        this._value = val
        this.updateSelection()
      }
    }
  }

  private handleClick = (e: MouseEvent) => {
    const segments = [...this.shadowRoot!.querySelectorAll<HTMLElement>('.segment')]
    const idx = segments.findIndex(s => s.contains(e.target as Node))
    if (idx === -1) return
    const opt = this._options[idx]
    if (!opt || opt.value === this._value) return // no-op: already selected or no valid target
    const prev = this._value
    this._value = opt.value
    this.setAttribute('value', opt.value)
    this.updateSelection()
    this.dispatchEvent(new CustomEvent<OToggleChangeEvent>('o-change', {
      bubbles: true, composed: true,
      detail: { value: opt.value, index: idx, prev }
    }))
  }

  private updateSelection() {
    const container = this.shadowRoot?.querySelector<HTMLElement>('.container')
    if (!container) { this.render(); return }
    const idx = this._options.findIndex(o => o.value === this._value)
    container.style.setProperty('--idx', String(idx >= 0 ? idx : 0))
    this.shadowRoot!.querySelectorAll<HTMLElement>('.segment').forEach((s, i) => {
      s.classList.toggle('active', i === idx)
    })
  }

  private render() {
    if (!this.shadowRoot) return
    const n = this._options.length
    const idx = this._options.findIndex(o => o.value === this._value)

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        .container {
          display: inline-flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 3px;
          position: relative;
          user-select: none;
          --n: ${n};
          --idx: ${idx >= 0 ? idx : 0};
        }
        .indicator {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / var(--n));
          background: rgba(255,255,255,0.25);
          border-radius: 999px;
          transform: translateX(calc(var(--idx) * 100%));
          transition: transform 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .segment {
          flex: 1;
          min-width: 48px;
          padding: 6px 14px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: 999px;
        }
        .segment.active { font-weight: 600; }
      </style>
      <div class="container">
        ${n > 0 ? '<div class="indicator"></div>' : ''}
        ${this._options.map((o) =>
          `<div class="segment${o.value === this._value ? ' active' : ''}" data-value="${o.value}">${o.label}</div>`
        ).join('')}
      </div>
    `
  }
}

customElements.define('o-toggle', OToggle)
