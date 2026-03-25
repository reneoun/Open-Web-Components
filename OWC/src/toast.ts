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
  private slotEl!: HTMLSlotElement
  private timer: ReturnType<typeof setTimeout> | null = null
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null
  private startedAt = 0
  private elapsed = 0
  private durationMs = 3000

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.durationMs = parseInt(this.getAttribute('duration') ?? '3000', 10)
    this.render()
    this.updateSlotOrFallback()
    this.startTimer()
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)
  }

  disconnectedCallback() {
    this.clearTimer()
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)
  }

  attributeChangedCallback(name: string, _old: string, _val: string) {
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
          animation: shrink linear both;
          animation-duration: var(--_dur, 3000ms);
        }
        .progress.paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: no-preference) {
          :host { animation: slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
          :host(.exiting) { animation: slideOutRight 0.25s ease-in both; }
          @keyframes slideInRight {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(110%); opacity: 0; }
          }
          @media (max-width: 639px) {
            :host { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
            :host(.exiting) { animation: slideDown 0.25s ease-in both; }
            @keyframes slideUp {
              from { transform: translateY(60px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes slideDown {
              from { transform: translateY(0);    opacity: 1; }
              to   { transform: translateY(60px); opacity: 0; }
            }
          }
        }
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      </style>
      <span class="icon">${ICONS[type] ?? ICONS.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `

    this.msgEl = this.shadowRoot!.querySelector('#msg')!
    this.slotEl = this.shadowRoot!.querySelector('slot')!
    const bar = this.shadowRoot!.querySelector('.progress') as HTMLElement
    if (bar) bar.style.setProperty('--_dur', `${this.durationMs}ms`)

    this.slotEl.addEventListener('slotchange', () => this.updateSlotOrFallback())
    this.shadowRoot!.querySelector('.close')!.addEventListener('click', () => this.dismiss())

    this.style.setProperty('--_accent', color)
  }

  private updateSlotOrFallback() {
    if (!this.msgEl || !this.slotEl) return
    const hasSlot = this.slotEl.assignedNodes({ flatten: true }).length > 0
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

  private startTimer(remaining?: number) {
    this.startedAt = Date.now()
    const ms = remaining ?? (this.durationMs - this.elapsed)
    this.timer = setTimeout(() => this.dismiss(), ms)
    this.fallbackTimer = setTimeout(() => { if (this.isConnected) this.remove() }, ms + 600)
  }

  private clearTimer() {
    if (this.timer !== null) { clearTimeout(this.timer); this.timer = null }
    if (this.fallbackTimer !== null) { clearTimeout(this.fallbackTimer); this.fallbackTimer = null }
  }

  private onMouseEnter = () => {
    this.elapsed += Date.now() - this.startedAt
    this.clearTimer()
    this.shadowRoot?.querySelector('.progress')?.classList.add('paused')
  }

  private onMouseLeave = () => {
    this.startedAt = Date.now()
    this.startTimer(Math.max(0, this.durationMs - this.elapsed))
    this.shadowRoot?.querySelector('.progress')?.classList.remove('paused')
  }

  dismiss() {
    this.clearTimer()
    this.classList.add('exiting')
    this.addEventListener('animationend', () => this.remove(), { once: true })
    setTimeout(() => this.remove(), 400) // fallback if animationend never fires
  }
}

customElements.define('o-toast', OWCToast)

function ensureContainer(): HTMLElement {
  if (!document.getElementById('o-toast-container')) {

    const style = document.createElement('style')
    style.setAttribute('data-owc-toast', '')
    style.textContent = `
      #o-toast-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        top: 1rem;
        right: 1rem;
        pointer-events: none;
      }
      #o-toast-container > * { pointer-events: all; }
      @media (max-width: 639px) {
        #o-toast-container {
          top: auto; right: auto;
          bottom: 1rem; left: 50%;
          transform: translateX(-50%);
          align-items: center;
        }
      }
    `
    document.head.appendChild(style)

    const container = document.createElement('div')
    container.id = 'o-toast-container'
    document.body.appendChild(container)
  }
  return document.getElementById('o-toast-container')!
}

/**
 * Show a toast notification.
 * @param content - Text or HTML string. **Caller is responsible for sanitizing HTML** — content is injected as `innerHTML`.
 * @param type - Toast type
 * @param options - Optional settings
 */
export function toast(
  content: string,
  type: ToastType,
  options?: { duration?: number }
): void {
  const container = ensureContainer()
  const el = document.createElement('o-toast') as HTMLElement
  el.setAttribute('type', type)
  if (options?.duration !== undefined) {
    el.setAttribute('duration', String(options.duration))
  }
  el.innerHTML = content
  container.appendChild(el)
}
