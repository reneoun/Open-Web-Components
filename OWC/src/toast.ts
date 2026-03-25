export type ToastType = 'success' | 'error' | 'warning' | 'info'

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const COLORS: Record<ToastType, string> = {
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
}

export class OWCToast extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'message', 'duration']
  }

  private msgEl!: HTMLSpanElement
  private slot!: HTMLSlotElement

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this.updateSlotOrFallback()
  }

  attributeChangedCallback(name: string, _old: string, val: string) {
    if (!this.shadowRoot!.firstChild) return // not yet rendered
    if (name === 'type') this.updateAccent()
    if (name === 'message') this.updateSlotOrFallback()
  }

  private render() {
    const type = (this.getAttribute('type') ?? 'info') as ToastType
    const color = COLORS[type] ?? COLORS.info

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          min-width: 220px;
          max-width: 360px;
          padding: 10px 36px 10px 14px;
          border-radius: var(--o-toast-radius, 10px);
          background: var(--o-toast-bg, rgba(255,255,255,0.18));
          border: 1px solid var(--o-toast-border, rgba(255,255,255,0.3));
          backdrop-filter: blur(var(--o-toast-blur, 10px));
          -webkit-backdrop-filter: blur(var(--o-toast-blur, 10px));
          color: var(--o-toast-color, #fff);
          font-family: sans-serif;
          font-size: 14px;
          border-left: 4px solid var(--_accent);
          box-sizing: border-box;
        }
        .icon { margin-right: 8px; font-weight: bold; }
        #msg { display: none; }
        .close {
          position: absolute; top: 6px; right: 8px;
          background: none; border: none; color: inherit;
          cursor: pointer; font-size: 14px; opacity: 0.7; padding: 2px 4px;
        }
        .close:hover { opacity: 1; }
        .progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: var(--_accent); border-radius: 0 0 var(--o-toast-radius, 10px) var(--o-toast-radius, 10px);
          width: 100%; transform-origin: left;
        }
      </style>
      <span class="icon">${ICONS[type] ?? ICONS.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `

    this.msgEl = this.shadowRoot!.querySelector('#msg')!
    this.slot = this.shadowRoot!.querySelector('slot')!

    this.slot.addEventListener('slotchange', () => this.updateSlotOrFallback())
    this.shadowRoot!.querySelector('.close')!.addEventListener('click', () => this.dismiss())

    this.style.setProperty('--_accent', color)
  }

  private updateSlotOrFallback() {
    if (!this.msgEl || !this.slot) return
    const hasSlot = this.slot.assignedNodes({ flatten: true }).length > 0
    if (hasSlot) {
      this.msgEl.style.display = 'none'
    } else {
      this.msgEl.style.display = ''
      this.msgEl.textContent = this.getAttribute('message') ?? ''
    }
  }

  private updateAccent() {
    const type = (this.getAttribute('type') ?? 'info') as ToastType
    const color = COLORS[type] ?? COLORS.info
    this.style.setProperty('--_accent', color)
    const iconEl = this.shadowRoot!.querySelector('.icon') as HTMLElement
    if (iconEl) iconEl.textContent = ICONS[type] ?? ICONS.info
  }

  dismiss() {
    this.remove()
  }
}

customElements.define('o-toast', OWCToast)
