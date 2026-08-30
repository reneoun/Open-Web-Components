import { GlassElement, glassBaseStyles } from './glass'

export class OProgress extends GlassElement {
  private _value = 0
  private _timer: ReturnType<typeof setInterval> | null = null
  private _hideTimer: ReturnType<typeof setTimeout> | null = null
  private _resetTimer: ReturnType<typeof setTimeout> | null = null

  static get observedAttributes() { return ['value'] }

  connectedCallback() { this.render() }

  attributeChangedCallback(name: string, _old: string, next: string) {
    if (name === 'value' && this.isConnected) {
      this._setValue(Math.min(100, Math.max(0, parseFloat(next) || 0)))
    }
  }

  disconnectedCallback() {
    this._stopAuto()
    if (this._hideTimer)  { clearTimeout(this._hideTimer);  this._hideTimer  = null }
    if (this._resetTimer) { clearTimeout(this._resetTimer); this._resetTimer = null }
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
          width: 0%;
          background: var(--glass-progress);
          box-shadow: var(--glass-progress-glow);
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
    // Cancel any pending hide/reset from a previous done() call
    if (this._hideTimer)  { clearTimeout(this._hideTimer);  this._hideTimer  = null }
    if (this._resetTimer) { clearTimeout(this._resetTimer); this._resetTimer = null }

    this._value = v
    const bar = this._bar()
    if (!bar) return
    bar.style.opacity = '1'
    bar.style.width = `${v}%`

    if (v >= 100) {
      this._hideTimer = setTimeout(() => {
        bar.style.opacity = '0'
        this._resetTimer = setTimeout(() => {
          bar.style.width = '0%'
          this._value = 0
        }, 300)
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

/**
 * asyncPlus — track multiple promises and auto-drive the progress bar.
 *
 * - Calls OProgress.start() immediately
 * - Increments the bar as each promise settles (proportional to total)
 * - Calls OProgress.done() when all are settled
 * - Dispatches a 'progress-complete' event on document with all results
 * - Returns Promise<PromiseSettledResult[]> (never rejects)
 */
export function asyncPlus<T>(...promises: Promise<T>[]): Promise<PromiseSettledResult<T>[]> {
  if (promises.length === 0) return Promise.resolve([])
  OProgress.start()
  let settled = 0
  const total = promises.length
  const onSettle = () => {
    settled++
    OProgress.set(Math.round((settled / total) * 90))
  }
  return Promise.allSettled(
    promises.map(p => p.then(v => { onSettle(); return v }, e => { onSettle(); throw e }))
  ).then(results => {
    OProgress.done()
    document.dispatchEvent(new CustomEvent('progress-complete', { detail: { results } }))
    return results
  })
}
