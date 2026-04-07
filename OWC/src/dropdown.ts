import { GlassElement, glassBaseStyles } from './glass'

interface DropdownOption {
  label: string
  value: string
  icon?: string
}

class ODropdown extends GlassElement {
  private _options: DropdownOption[] = []
  private _focusIndex = -1
  private _onOutsideClick: ((e: MouseEvent) => void) | null = null
  private _onKeyDown: ((e: KeyboardEvent) => void) | null = null
  private _rendered = false
  private _skipNextOutsideClick = false

  constructor() {
    super()
  }

  get options(): DropdownOption[] { return this._options }
  set options(val: DropdownOption[]) {
    this._options = val
    this.renderMenu()
  }

  connectedCallback() {
    if (!this._rendered) {
      this.render()
      this._rendered = true
    }

    this._onOutsideClick = (e: MouseEvent) => {
      if (this._skipNextOutsideClick) { this._skipNextOutsideClick = false; return }
      if (!this.contains(e.target as Node)) this.close()
    }
    document.addEventListener('click', this._onOutsideClick)

    this._onKeyDown = (e: KeyboardEvent) => {
      const menu = this.shadowRoot!.querySelector<HTMLElement>('.menu')
      if (!menu?.classList.contains('open')) return
      const items = Array.from(this.shadowRoot!.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        this._focusIndex = Math.min(this._focusIndex + 1, items.length - 1)
        items[this._focusIndex]?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this._focusIndex = Math.max(this._focusIndex - 1, 0)
        items[this._focusIndex]?.focus()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (this._focusIndex >= 0) items[this._focusIndex]?.click()
      } else if (e.key === 'Escape') {
        this.close()
      }
    }
    document.addEventListener('keydown', this._onKeyDown)
  }

  disconnectedCallback() {
    if (this._onOutsideClick) document.removeEventListener('click', this._onOutsideClick)
    if (this._onKeyDown) document.removeEventListener('keydown', this._onKeyDown)
  }

  toggle() {
    const menu = this.shadowRoot?.querySelector('.menu')
    if (menu?.classList.contains('open')) this.close()
    else this.open()
  }

  private open() {
    this._focusIndex = -1
    this.shadowRoot?.querySelector('.menu')?.classList.add('open')
  }

  close() {
    this.shadowRoot?.querySelector('.menu')?.classList.remove('open')
    this._focusIndex = -1
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: inline-block;
          position: relative;
        }
        .trigger {
          cursor: pointer;
        }
        .menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 160px;
          margin-top: 4px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          z-index: 100;
          padding: 4px 0;
        }
        .menu.open {
          display: block;
        }
        .item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          outline: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .item:hover,
        .item:focus {
          background: var(--glass-hover);
        }
        .icon {
          font-size: 16px;
        }
      </style>
      <div class="trigger"><slot></slot></div>
      <div class="menu" role="menu"></div>
    `
    // Toggle on trigger click
    this.shadowRoot!.querySelector('.trigger')!.addEventListener('click', (e) => {
      e.stopPropagation()
      this._skipNextOutsideClick = true
      this.toggle()
    })
    // Also handle composed custom events (e.g. o-button fires o-click, not native click)
    this.addEventListener('o-click', (e) => {
      e.stopPropagation()
      this._skipNextOutsideClick = true
      this.toggle()
    })
    this.renderMenu()
  }

  private renderMenu() {
    const menu = this.shadowRoot?.querySelector('.menu')
    if (!menu) return
    menu.innerHTML = this._options.map(opt => `
      <button
        class="item"
        role="menuitem"
        tabindex="-1"
        data-value="${opt.value}"
        data-label="${opt.label}"
      >${opt.icon ? `<span class="icon">${opt.icon}</span>` : ''}<span>${opt.label}</span></button>
    `).join('')

    menu.querySelectorAll<HTMLElement>('[role="menuitem"]').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.dataset.value!
        const label = item.dataset.label!
        this.dispatchEvent(new CustomEvent('o-select', {
          bubbles: true, composed: true, detail: { value, label }
        }))
        this.close()
      })
    })
  }
}

customElements.define('o-dropdown', ODropdown)
