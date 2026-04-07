import { GlassElement, glassBaseStyles } from './glass'

export class OProgress extends GlassElement {
  private _value = 0
  private _timer: ReturnType<typeof setInterval> | null = null
  private _hideTimer: ReturnType<typeof setTimeout> | null = null

  static get observedAttributes() { return ['value'] }

  connectedCallback() { this.render() }

  attributeChangedCallback(name: string, _old: string, next: string) {
    if (name === 'value' && this.isConnected) {
      this._setValue(Math.min(100, Math.max(0, parseFloat(next) || 0)))
    }
  }

  disconnectedCallback() {
    this._stopAuto()
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          display: block;
          pointer-events: none;
        }
        .bar {
          height: 3px;
          background: rgba(74,222,128,0.85);
          box-shadow: 0 0 8px rgba(74,222,128,0.5);
          transition: width 0.2s ease, opacity 0.3s ease;
          opacity: 1;
        }
      </style>
      <div class="bar" style="width:0%"></div>
    `
  }

  private _bar(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.bar') ?? null
  }

  private _setValue(v: number) {
    this._value = v
    const bar = this._bar()
    if (!bar) return
    bar.style.opacity = '1'
    bar.style.width = `${v}%`
    if (v >= 100) {
      if (this._hideTimer) clearTimeout(this._hideTimer)
      this._hideTimer = setTimeout(() => {
        bar.style.opacity = '0'
        setTimeout(() => { bar.style.width = '0%'; this._value = 0 }, 300)
      }, 400)
    }
  }

  private _stopAuto() {
    if (this._timer) { clearInterval(this._timer); this._timer = null }
  }

  static start() {
    const el = OProgress._getInstance()
    el._stopAuto()
    el._timer = setInterval(() => {
      const remaining = 90 - el._value
      if (remaining <= 0) { el._stopAuto(); return }
      const step = Math.random() * Math.min(remaining * 0.1, 5) + 0.5
      el._setValue(Math.min(89, el._value + step))
    }, 300)
  }

  static set(v: number) {
    OProgress._getInstance()._setValue(Math.min(100, Math.max(0, v)))
  }

  static done() {
    const el = OProgress._getInstance()
    el._stopAuto()
    el._setValue(100)
  }

  private static _getInstance(): OProgress {
    let el = document.querySelector<OProgress>('o-progress')
    if (!el) {
      el = document.createElement('o-progress') as OProgress
      document.body.appendChild(el)
    }
    return el
  }
}

customElements.define('o-progress', OProgress)
