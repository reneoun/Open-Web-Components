import { GlassElement, glassBaseStyles } from './glass'

export class OInput extends GlassElement {
  static get observedAttributes() {
    return ['label', 'placeholder', 'type', 'name', 'disabled', 'error', 'success']
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  disconnectedCallback() {
    // No host-level listeners currently; present for pattern consistency
  }

  get value(): string {
    return this.shadowRoot!.querySelector<HTMLInputElement>('input')?.value
      ?? this.getAttribute('value')
      ?? ''
  }

  set value(v: string) {
    const input = this.shadowRoot!.querySelector<HTMLInputElement>('input')
    if (input) input.value = v
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
          font-family: var(--glass-font);
          color: var(--glass-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        input {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid ${borderColor};
          border-radius: var(--glass-radius);
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: var(--glass-font);
          outline: none;
          width: 100%;
          box-sizing: border-box;
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-elevation);
          transition: border-color 0.15s;
          opacity: ${disabled ? '0.5' : '1'};
          cursor: ${disabled ? 'not-allowed' : 'text'};
        }
        input:focus { border-color: ${focusBorder}; }
        input::placeholder { color: var(--glass-text-dim); }
        .error-msg {
          font-size: 11px;
          color: rgba(239,68,68,0.9);
          font-family: var(--glass-font);
        }
      </style>
      <div class="wrap">
        ${label ? '<label></label>' : ''}
        <input
          type="${type}"
          name="${name}"
          ${disabled ? 'disabled' : ''}
        />
        ${error ? '<span class="error-msg"></span>' : ''}
      </div>
    `

    const inputEl = this.shadowRoot!.querySelector<HTMLInputElement>('input')!

    // Set via DOM API to avoid XSS
    if (label) this.shadowRoot!.querySelector('label')!.textContent = label
    if (error) this.shadowRoot!.querySelector('.error-msg')!.textContent = error
    inputEl.placeholder = placeholder
    inputEl.value = value
    inputEl.style.borderColor = borderColor

    inputEl.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('o-input', {
        bubbles: true, composed: true, detail: { value: inputEl.value }
      }))
    })
    inputEl.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('o-change', {
        bubbles: true, composed: true, detail: { value: inputEl.value }
      }))
    })
  }
}

customElements.define('o-input', OInput)
