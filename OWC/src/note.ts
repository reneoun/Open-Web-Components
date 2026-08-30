import { GlassElement, glassBaseStyles } from './glass'

class ONote extends GlassElement {
  static get observedAttributes() {
    return ['variant', 'label', 'placeholder', 'max-length', 'value']
  }

  private _tags: string[] = []

  constructor() {
    super()
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  private get variant() { return this.getAttribute('variant') ?? 'textarea' }

  private render() {
    if (this.variant === 'card') this.renderCard()
    else this.renderTextarea()
    this.attachNoteHandlers()
  }

  private renderTextarea() {
    const label = this.getAttribute('label') ?? ''
    const placeholder = this.getAttribute('placeholder') ?? ' '
    const maxLen = this.getAttribute('max-length')
    const value = this.getAttribute('value') ?? ''

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
        }
        .wrap {
          position: relative;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-xl);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          padding: ${label ? '24px 16px 12px' : '12px 16px'};
          transition: border-color 0.15s;
        }
        .wrap:focus-within { border-color: var(--accent-warm); }
        label {
          position: absolute; top: 8px; left: 16px;
          color: var(--glass-text-muted); font-size: 11px;
          font-family: var(--glass-font); pointer-events: none;
        }
        textarea {
          display: block; width: 100%;
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: var(--glass-font);
          min-height: 80px; overflow: hidden;
        }
        .counter { text-align: right; font-size: 11px; color: var(--glass-text-dim); margin-top: 4px; }
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ''}
        <textarea placeholder="${placeholder}"${maxLen ? ` maxlength="${maxLen}"` : ''}>${value}</textarea>
      </div>
      ${maxLen ? `<div class="counter"><span class="count">${value.length}</span> / ${maxLen}</div>` : ''}
    `
  }

  private renderCard() {
    const placeholder = this.getAttribute('placeholder') ?? 'Write something\u2026'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
        }
        .card {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-xl);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .title-input {
          background: none; border: none;
          border-bottom: var(--glass-border-width) solid var(--glass-border);
          color: var(--glass-text); font-size: 18px; font-weight: 600;
          font-family: var(--glass-font); outline: none; padding-bottom: 8px; width: 100%;
        }
        .title-input:focus { border-color: var(--accent-warm); }
        .title-input::placeholder { color: var(--glass-text-dim); }
        .body-area {
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: var(--glass-font);
          min-height: 80px; overflow: hidden; width: 100%;
        }
        .body-area::placeholder { color: var(--glass-text-dim); }
        .tag-area { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .chip {
          background: var(--accent-warm); border-radius: var(--glass-radius-pill);
          padding: 2px 10px; font-size: 12px; color: var(--glass-accent-text); cursor: pointer;
        }
        .tag-input {
          background: none; border: none; color: var(--glass-text);
          font-size: 12px; font-family: var(--glass-font); outline: none; min-width: 80px;
        }
        .tag-input::placeholder { color: var(--glass-text-dim); }
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" />
        <textarea class="body-area" placeholder="${placeholder}"></textarea>
        <div class="tag-area">
          ${this._tags.map((t, i) => `<span class="chip" data-tag-index="${i}">${t} \u00d7</span>`).join('')}
          <input class="tag-input" placeholder="Add tag\u2026" />
        </div>
      </div>
    `
  }

  private attachNoteHandlers() {
    if (this.variant !== 'card') {
      const ta = this.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')
      const count = this.shadowRoot!.querySelector<HTMLElement>('.count')
      ta?.addEventListener('input', () => {
        ta.style.height = 'auto'
        ta.style.height = ta.scrollHeight + 'px'
        if (count) count.textContent = String(ta.value.length)
        this.dispatchEvent(new CustomEvent('o-change', {
          bubbles: true, composed: true, detail: { value: ta.value }
        }))
      })
      return
    }

    const titleInput = this.shadowRoot!.querySelector<HTMLInputElement>('.title-input')
    const bodyArea = this.shadowRoot!.querySelector<HTMLTextAreaElement>('.body-area')
    const tagInput = this.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')

    const fireChange = () => {
      const title = this.shadowRoot!.querySelector<HTMLInputElement>('.title-input')?.value ?? ''
      const body = this.shadowRoot!.querySelector<HTMLTextAreaElement>('.body-area')?.value ?? ''
      this.dispatchEvent(new CustomEvent('o-change', {
        bubbles: true, composed: true,
        detail: { title, body, tags: [...this._tags] }
      }))
    }

    titleInput?.addEventListener('input', fireChange)
    bodyArea?.addEventListener('input', () => {
      bodyArea.style.height = 'auto'
      bodyArea.style.height = bodyArea.scrollHeight + 'px'
      fireChange()
    })
    tagInput?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        this._tags.push(tagInput.value.trim())
        tagInput.value = ''
        this.render()
        fireChange()
      }
    })
    this.shadowRoot!.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this._tags.splice(parseInt(chip.dataset.tagIndex!), 1)
        this.render()
        fireChange()
      })
    })
  }
}

customElements.define('o-note', ONote)
