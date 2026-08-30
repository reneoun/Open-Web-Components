import { GlassElement, glassBaseStyles } from './glass'

export class OSkeleton extends GlassElement {
  static get observedAttributes() {
    return ['variant', 'width', 'height', 'radius', 'rows']
  }

  connectedCallback() { this.render() }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  disconnectedCallback() {}

  private get variant() { return this.getAttribute('variant') ?? 'block' }

  private pulseCSS() {
    return `
      @keyframes o-pulse {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.9; }
      }
      .skel {
        background: var(--glass-bg);
        border: var(--glass-border-width) solid var(--glass-border);
        border-radius: var(--skel-r, var(--glass-radius-md));
        animation: o-pulse 1.4s ease-in-out infinite;
        backdrop-filter: var(--glass-backdrop);
      }
    `
  }

  private render() {
    const v = this.variant
    if (v === 'table') this.renderTable()
    else if (v === 'panel') this.renderPanel()
    else this.renderBlock()
  }

  private renderBlock() {
    const w = this.getAttribute('width')  ?? '100%'
    const h = this.getAttribute('height') ?? '1em'
    const r = this.getAttribute('radius') ?? '6px'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
      </style>
      <div class="skel" style="width:${w};height:${h};--skel-r:${r}"></div>
    `
  }

  private renderTable() {
    const rows = Math.max(1, parseInt(this.getAttribute('rows') ?? '5'))
    const colWidths = ['25%', '30%', '20%', '15%']

    const headerCells = colWidths
      .map(w => `<div class="skel cell" style="width:${w}"></div>`)
      .join('')

    const bodyRows = Array.from({ length: rows }, () =>
      colWidths.map(w => `<div class="skel cell" style="width:${w}"></div>`).join('')
    ).map(cells => `<div class="row">${cells}</div>`).join('')

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
        .table { display: flex; flex-direction: column; gap: 8px; }
        .row {
          display: flex; gap: 12px; align-items: center;
          padding: 6px 0;
          border-bottom: var(--glass-border-width) solid var(--glass-border);
        }
        .header .cell { height: 12px; }
        .cell { height: 14px; }
      </style>
      <div class="table">
        <div class="row header">${headerCells}</div>
        ${bodyRows}
      </div>
    `
  }

  private renderPanel() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
        .panel {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-elevation);
          padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .title { height: 18px; width: 55%; }
        .line  { height: 13px; }
        .short { width: 70%; }
      </style>
      <div class="panel">
        <div class="skel title"></div>
        <div class="skel line"></div>
        <div class="skel line short"></div>
      </div>
    `
  }
}

customElements.define('o-skeleton', OSkeleton)
