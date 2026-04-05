export interface ODialogSubmitEvent { [key: string]: string }

export class ODialog extends HTMLElement {
  static get observedAttributes() { return ['open'] }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.hasAttribute('open')) {
      this.close()
      this.dispatchEvent(new CustomEvent('o-cancel', {
        bubbles: true, composed: true, detail: null
      }))
    }
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: none; }
        :host([open]) { display: block; }
        .backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dialog {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 24px;
          min-width: 320px;
          max-width: 90vw;
          color: #fff;
          font-family: sans-serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transform: scale(0.95);
          opacity: 0;
          transition: transform 200ms ease-out, opacity 200ms ease-out;
        }
        .dialog.visible { transform: scale(1); opacity: 1; }
        .dialog-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .dialog-content { margin-bottom: 20px; }
        .dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
        ::slotted(label) {
          display: block;
          font-size: 11px;
          opacity: 0.6;
          margin: 10px 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: sans-serif;
        }
        ::slotted(input), ::slotted(textarea) {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 8px 12px;
          color: #fff;
          font-size: 14px;
          font-family: sans-serif;
          outline: none;
          box-sizing: border-box;
        }
        ::slotted(input:focus), ::slotted(textarea:focus) {
          border-color: rgba(251,191,36,0.6);
        }
      </style>
      <div class="backdrop">
        <div class="dialog">
          <div class="dialog-title"><slot name="title"></slot></div>
          <div class="dialog-content"><slot></slot></div>
          <div class="dialog-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `

    // Backdrop click → cancel
    this.shadowRoot!.querySelector('.backdrop')!.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.shadowRoot!.querySelector('.backdrop')) {
        this.close()
        this.dispatchEvent(new CustomEvent('o-cancel', {
          bubbles: true, composed: true, detail: null
        }))
      }
    })

    // Listen for o-click from submit buttons in the actions slot
    this.addEventListener('o-click', (e: Event) => {
      const target = e.target as HTMLElement
      if (target.getAttribute('type') === 'submit') {
        this._submit()
      }
    })
  }

  connectedCallback() {
    document.addEventListener('keydown', this._onKeydown)
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown)
  }

  attributeChangedCallback(name: string, _old: string | null, next: string | null) {
    if (name !== 'open') return
    const dialog = this.shadowRoot!.querySelector<HTMLElement>('.dialog')
    if (!dialog) return
    if (next !== null) {
      requestAnimationFrame(() => dialog.classList.add('visible'))
    } else {
      dialog.classList.remove('visible')
    }
  }

  open() { this.setAttribute('open', '') }
  close() { this.removeAttribute('open') }

  _submit() {
    const inputs = this.querySelectorAll<HTMLInputElement>('[name]')
    const data: Record<string, string> = {}
    inputs.forEach(input => { data[input.name] = input.value })
    this.dispatchEvent(new CustomEvent<ODialogSubmitEvent>('o-submit', {
      bubbles: true, composed: true, detail: data
    }))
    this.close()
  }
}

customElements.define('o-dialog', ODialog)
