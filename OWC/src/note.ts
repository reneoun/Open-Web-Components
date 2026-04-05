export class ONote extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'label', 'placeholder', 'max-length']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() { this.render() }
  attributeChangedCallback() { if (this.isConnected) this.render() }

  get variant() { return this.getAttribute('variant') ?? 'textarea' }

  private render() {
    this.variant === 'card' ? this.renderCard() : this.renderTextarea()
  }

  private renderTextarea() {
    const label = this.getAttribute('label') ?? ''
    const placeholder = this.getAttribute('placeholder') ?? ''
    const maxLength = this.getAttribute('max-length')
    const value = this.getAttribute('value') ?? ''

    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .wrap {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 16px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .wrap:focus-within { border-color: rgba(251,191,36,0.6); }
        label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
          font-family: sans-serif;
        }
        textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: sans-serif;
          font-size: 14px;
          resize: none;
          overflow: hidden;
          min-height: 60px;
          box-sizing: border-box;
        }
        ::placeholder { color: rgba(255,255,255,0.3); }
        .counter {
          text-align: right;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
          font-family: sans-serif;
        }
        .counter.over { color: #f87171; }
      </style>
      <div class="wrap">
        <textarea></textarea>
        ${maxLength ? `<div class="counter"><span class="counter-cur">0</span> / <span class="counter-max"></span></div>` : ''}
      </div>
    `
    const wrap = this.shadowRoot!.querySelector('.wrap')!
    const ta = this.shadowRoot!.querySelector('textarea')!

    // Set dynamic values via DOM API (safe, no HTML parsing)
    ta.placeholder = placeholder
    ta.value = value

    if (label) {
      const labelEl = document.createElement('label')
      labelEl.textContent = label
      wrap.prepend(labelEl)
    }

    if (maxLength) {
      const maxInt = parseInt(maxLength) || 0
      this.shadowRoot!.querySelector('.counter-max')!.textContent = String(maxInt)
      const cur = this.shadowRoot!.querySelector('.counter-cur')!
      cur.textContent = String(ta.value.length)
      ta.addEventListener('input', () => {
        cur.textContent = String(ta.value.length)
        cur.parentElement!.classList.toggle('over', ta.value.length > maxInt)
        autoResize()
        this.dispatchEvent(new CustomEvent('o-change', {
          bubbles: true, composed: true, detail: { value: ta.value }
        }))
      })
    } else {
      ta.addEventListener('input', () => {
        autoResize()
        this.dispatchEvent(new CustomEvent('o-change', {
          bubbles: true, composed: true, detail: { value: ta.value }
        }))
      })
    }

    const autoResize = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px' }
    autoResize()
  }

  private renderCard() {
    const placeholder = this.getAttribute('placeholder') ?? 'Write something...'

    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 16px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .title-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          outline: none;
          color: #fff;
          font-family: sans-serif;
          font-size: 18px;
          font-weight: 600;
          padding: 0 0 8px;
          margin-bottom: 12px;
          box-sizing: border-box;
        }
        .title-input:focus { border-bottom-color: rgba(251,191,36,0.6); }
        .body-area {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: sans-serif;
          font-size: 14px;
          resize: none;
          overflow: hidden;
          min-height: 60px;
          box-sizing: border-box;
        }
        ::placeholder { color: rgba(255,255,255,0.3); }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
          align-items: center;
        }
        .chip {
          background: rgba(251,191,36,0.2);
          border: 1px solid rgba(251,191,36,0.4);
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          font-family: sans-serif;
          cursor: pointer;
          user-select: none;
        }
        .chip:hover { background: rgba(251,191,36,0.35); }
        .tag-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          outline: none;
          color: #fff;
          font-family: sans-serif;
          font-size: 12px;
          width: 100px;
        }
        .tag-input:focus { border-bottom-color: rgba(251,191,36,0.6); }
        .tag-input::placeholder { color: rgba(255,255,255,0.3); }
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" type="text">
        <textarea class="body-area"></textarea>
        <div class="tags">
          <input class="tag-input" placeholder="+ tag" type="text">
        </div>
      </div>
    `

    const tags: string[] = []
    const tagsDiv = this.shadowRoot!.querySelector('.tags')!
    const tagInput = this.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')!
    const titleInput = this.shadowRoot!.querySelector<HTMLInputElement>('.title-input')!
    const bodyArea = this.shadowRoot!.querySelector<HTMLTextAreaElement>('.body-area')!
    bodyArea.placeholder = placeholder

    const emit = () => this.dispatchEvent(new CustomEvent('o-change', {
      bubbles: true, composed: true,
      detail: { title: titleInput.value, body: bodyArea.value, tags: [...tags] }
    }))

    const addChip = (tag: string) => {
      const chip = document.createElement('span')
      chip.className = 'chip'
      chip.textContent = tag
      chip.title = 'Click to remove'
      chip.addEventListener('click', () => {
        const idx = tags.indexOf(tag)
        if (idx >= 0) tags.splice(idx, 1)
        chip.remove()
        emit()
      })
      tagsDiv.insertBefore(chip, tagInput)
    }

    tagInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        e.preventDefault()
        const tag = tagInput.value.trim()
        if (!tags.includes(tag)) {
          tags.push(tag)
          addChip(tag)
          emit()
        }
        tagInput.value = ''
      }
    })

    const autoResize = () => { bodyArea.style.height = 'auto'; bodyArea.style.height = bodyArea.scrollHeight + 'px' }
    bodyArea.addEventListener('input', () => { autoResize(); emit() })
    titleInput.addEventListener('input', emit)
    autoResize()
  }
}

customElements.define('o-note', ONote)
