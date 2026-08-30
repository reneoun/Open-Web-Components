import { GlassElement, glassBaseStyles } from './glass'

export interface DropdownOption {
  label: string
  value: string
  icon?: string
}

export interface ODropdownSelectEvent { value: string; label: string }

export class ODropdown extends GlassElement {
  private _options: DropdownOption[] = []
  private _focusIndex = -1
  private _rendered = false
  private _open = false

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
    document.addEventListener('mousedown', this.handleOutsideMousedown)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.handleOutsideMousedown)
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleOutsideMousedown = (e: Event) => {
    if (e.composedPath().includes(this)) return
    if (this._open) this.close()
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this._open) return
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

  toggle() {
    if (this._open) this.close()
    else this.open()
  }

  open() {
    this._open = true
    this._focusIndex = -1
    this.shadowRoot?.querySelector('.menu')?.classList.add('open')
  }

  close() {
    this._open = false
    this._focusIndex = -1
    this.shadowRoot?.querySelector('.menu')?.classList.remove('open')
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
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius);
          backdrop-filter: var(--glass-backdrop);
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
          font-family: var(--glass-font);
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
    // Single click handler on the host — catches both native click and o-click bubbling up
    // Use a flag to prevent double-toggle from both events firing on same user action
    let toggling = false
    const doToggle = () => {
      if (toggling) return
      toggling = true
      this.toggle()
      requestAnimationFrame(() => { toggling = false })
    }
    this.addEventListener('click', doToggle)
    this.addEventListener('o-click', doToggle)

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
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        const value = item.dataset.value!
        const label = item.dataset.label!
        this.dispatchEvent(new CustomEvent<ODropdownSelectEvent>('o-select', {
          bubbles: true, composed: true, detail: { value, label }
        }))
        this.close()
      })
    })
  }
}

customElements.define('o-dropdown', ODropdown)
