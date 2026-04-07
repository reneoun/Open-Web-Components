import { GlassElement, glassBaseStyles } from './glass'

export interface OTabsChangeEvent { value: string; prev: string | null }

export class OTabs extends GlassElement {
  private _value: string = ''
  private _initialized = false

  constructor() {
    super()
  }

  connectedCallback() {
    // Defer init until children are parsed (IIFE in <head> = children not yet available)
    if (this.children.length > 0) {
      this.init()
    } else {
      // Wait for children to be parsed
      const observer = new MutationObserver(() => {
        if (this.querySelectorAll('[slot="tab"]').length > 0) {
          observer.disconnect()
          this.init()
        }
      })
      observer.observe(this, { childList: true })
      // Fallback: also try on next frame (covers most cases)
      requestAnimationFrame(() => {
        if (!this._initialized) {
          observer.disconnect()
          this.init()
        }
      })
    }
  }

  private init() {
    if (this._initialized) return
    this._initialized = true

    // Hide slot="tab" light-DOM children
    this.querySelectorAll<HTMLElement>('[slot="tab"]').forEach(el => {
      el.style.display = 'none'
    })

    const tabs = Array.from(this.querySelectorAll<HTMLElement>('[slot="tab"]'))
    if (!this._value && tabs.length) {
      this._value = tabs[0].dataset.value ?? ''
    }

    this.render()
    this._updatePanels()
  }

  get value(): string { return this._value }

  set value(v: string) {
    const prev = this._value
    if (v === prev) return
    this._value = v
    this._updateTabButtons()
    this._updatePanels()
  }

  private render() {
    const tabs = Array.from(this.querySelectorAll<HTMLElement>('[slot="tab"]'))

    const buttonsHTML = tabs.map(tab => {
      const val = tab.dataset.value ?? ''
      const active = val === this._value
      return `<button role="tab" class="tab${active ? ' active' : ''}" data-value="${val}" aria-selected="${active}" tabindex="${active ? '0' : '-1'}">${tab.textContent ?? ''}</button>`
    }).join('')

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .tablist {
          display: flex;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px 10px 0 0;
          backdrop-filter: blur(var(--glass-blur));
          padding: 4px 4px 0;
          gap: 2px;
        }
        .tab {
          flex: 1;
          background: none;
          border: none;
          border-radius: 7px 7px 0 0;
          color: var(--glass-text-muted);
          font-size: 14px;
          font-family: sans-serif;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .tab:hover { background: var(--glass-hover); color: var(--glass-text); }
        .tab.active {
          background: var(--glass-hover);
          color: var(--glass-text);
          border-bottom: 2px solid var(--accent-warm);
        }
        .panel-area {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-top: none;
          border-radius: 0 0 10px 10px;
          backdrop-filter: blur(var(--glass-blur));
          padding: 16px;
        }
      </style>
      <div class="tablist" role="tablist">${buttonsHTML}</div>
      <div class="panel-area"><slot></slot></div>
    `

    this.shadowRoot!.querySelector('.tablist')!.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[role="tab"]')
      if (!btn) return
      const val = btn.dataset.value ?? ''
      if (val === this._value) return
      const prev = this._value
      this._value = val
      this._updateTabButtons()
      this._updatePanels()
      this.dispatchEvent(new CustomEvent<OTabsChangeEvent>('o-change', {
        bubbles: true, composed: true, detail: { value: val, prev }
      }))
    })

    this.shadowRoot!.querySelector('.tablist')!.addEventListener('keydown', (e: Event) => {
      const ke = e as KeyboardEvent
      if (ke.key !== 'ArrowLeft' && ke.key !== 'ArrowRight') return
      const tabs = Array.from(this.querySelectorAll<HTMLElement>('[slot="tab"]'))
      const values = tabs.map(t => t.dataset.value ?? '')
      const idx = values.indexOf(this._value)
      if (idx === -1) return
      const next = ke.key === 'ArrowRight'
        ? (idx + 1) % values.length
        : (idx - 1 + values.length) % values.length
      const prev = this._value
      this._value = values[next]
      this._updateTabButtons()
      this._updatePanels()
      this.dispatchEvent(new CustomEvent<OTabsChangeEvent>('o-change', {
        bubbles: true, composed: true, detail: { value: this._value, prev }
      }))
      this.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
    })
  }

  private _updateTabButtons() {
    this.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]').forEach(btn => {
      const active = btn.dataset.value === this._value
      btn.classList.toggle('active', active)
      btn.setAttribute('aria-selected', String(active))
      btn.tabIndex = active ? 0 : -1
    })
  }

  private _updatePanels() {
    this.querySelectorAll<HTMLElement>('[data-tab]').forEach(panel => {
      panel.style.display = panel.dataset.tab === this._value ? '' : 'none'
    })
  }
}

customElements.define('o-tabs', OTabs)
