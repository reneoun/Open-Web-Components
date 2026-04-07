import { GlassElement, glassBaseStyles } from './glass'

export class OInput extends GlassElement {
  static get observedAttributes() {
    return ['label', 'placeholder', 'type', 'name', 'value', 'disabled', 'error', 'success']
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  get value(): string {
    return this.shadowRoot!.querySelector<HTMLInputElement>('input')?.value
      ?? this.getAttribute('value')
      ?? ''
  }

  set value(v: string) {
    const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')
    if (input) input.value = v
    this.setAttribute('value', v)
  }

  private render() {
    const label       = this.getAttribute('label') ?? ''
    const placeholder = this.getAttribute('placeholder') ?? ''
    const type        = this.getAttribute('type') ?? 'text'
    const name        = this.getAttribute('name') ?? ''
    const value       = this.getAttribute('value') ?? ''
    const disabled    = this.hasAttribute('disabled')
    const error       = this.getAttribute('error') ?? ''
    const success     = this.hasAttribute('success')

    const borderColor = error
      ? 'rgba(239,68,68,0.7)'
      : success
        ? 'rgba(74,222,128,0.7)'
        : 'var(--glass-border)'

    const focusBorder = error ? 'rgba(239,68,68,0.9)' : 'var(--accent-warm)'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .wrap { display: flex; flex-direction: column; gap: 4px; }
        label {
          font-size: 11px;
          font-family: sans-serif;
          color: var(--glass-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        input {
          background: var(--glass-bg);
          border: 1px solid ${borderColor};
          border-radius: 10px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          backdrop-filter: blur(var(--glass-blur));
          transition: border-color 0.15s;
          opacity: ${disabled ? '0.5' : '1'};
          cursor: ${disabled ? 'not-allowed' : 'text'};
        }
        input:focus { border-color: ${focusBorder}; }
        input::placeholder { color: var(--glass-text-dim); }
        .error-msg {
          font-size: 11px;
          color: rgba(239,68,68,0.9);
          font-family: sans-serif;
        }
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ''}
        <input
          type="${type}"
          placeholder="${placeholder}"
          name="${name}"
          value="${value.replace(/"/g, '&quot;')}"
          ${disabled ? 'disabled' : ''}
        />
        ${error ? `<span class="error-msg">${error}</span>` : ''}
      </div>
    `

    const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')!
    if (error || success) input.style.borderColor = borderColor
    input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('o-input', {
        bubbles: true, composed: true, detail: { value: input.value }
      }))
    })
    input.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('o-change', {
        bubbles: true, composed: true, detail: { value: input.value }
      }))
    })
  }
}

customElements.define('o-input', OInput)
