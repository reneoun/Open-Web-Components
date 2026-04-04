class ODialog extends HTMLElement {
  static get observedAttributes() { return ['open'] }

  private _onKeyDown: ((e: KeyboardEvent) => void) | null = null
  private _onClick: ((e: MouseEvent) => void) | null = null
  private _rendered = false

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    if (!this._rendered) {
      this.render()
      this._rendered = true
    }
    this._onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) {
        this.handleCancel()
      }
    }
    document.addEventListener('keydown', this._onKeyDown)

    // Submit via native button[type=submit] click bubbling to host
    this._onClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (
        target.getAttribute('type') === 'submit' ||
        target.closest('[type="submit"]')
      ) {
        e.preventDefault()
        this.handleSubmit()
      }
    }
    this.addEventListener('click', this._onClick)
  }

  disconnectedCallback() {
    if (this._onKeyDown) document.removeEventListener('keydown', this._onKeyDown)
    if (this._onClick) this.removeEventListener('click', this._onClick)
  }

  attributeChangedCallback(name: string, _old: string | null, _new: string | null) {
    if (name !== 'open') return
    const backdrop = this.shadowRoot?.querySelector('.backdrop')
    if (!backdrop) return
    if (_new !== null) backdrop.classList.add('visible')
    else backdrop.classList.remove('visible')
  }

  open() { this.setAttribute('open', '') }
  close() { this.removeAttribute('open') }

  private handleSubmit() {
    const detail: Record<string, string> = {}
    this.querySelectorAll<HTMLInputElement>('input[name],select[name],textarea[name]')
      .forEach(input => { detail[input.name] = input.value })
    this.dispatchEvent(new CustomEvent('o-submit', { bubbles: true, composed: true, detail }))
    this.close()
  }

  private handleCancel() {
    this.close()
    this.dispatchEvent(new CustomEvent('o-cancel', { bubbles: true, composed: true, detail: null }))
  }

  private render() {
    const isOpen = this.hasAttribute('open')
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
          display: contents;
        }
        .backdrop {
          display: flex;
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          align-items: center; justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
        }
        .backdrop.visible {
          opacity: 1;
          visibility: visible;
        }
        .panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: 24px; min-width: 320px; max-width: 90vw;
          color: #fff;
        }
        .backdrop.visible .panel {
          animation: scaleIn 0.2s ease-out;
        }
        .panel-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
        .panel-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .panel-actions { display: flex; justify-content: flex-end; gap: 8px; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      </style>
      <div class="backdrop${isOpen ? ' visible' : ''}">
        <div class="panel">
          <div class="panel-title"><slot name="title"></slot></div>
          <div class="panel-body"><slot></slot></div>
          <div class="panel-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `
    // Backdrop click → cancel (not panel click)
    this.shadowRoot!.querySelector('.backdrop')!.addEventListener('click', (e: MouseEvent) => {
      if (e.target === e.currentTarget) this.handleCancel()
    })
  }
}

customElements.define('o-dialog', ODialog)
