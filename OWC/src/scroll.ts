import { GlassElement, glassBaseStyles, glassScrollbarStyles } from './glass'

class OScroll extends GlassElement {
  static get observedAttributes() { return ['direction'] }

  connectedCallback() { this.render() }
  attributeChangedCallback() { if (this.isConnected) this.render() }

  private render() {
    const dir = this.getAttribute('direction') || 'y'
    const overflowX = dir === 'x' || dir === 'both' ? 'auto' : 'hidden'
    const overflowY = dir === 'y' || dir === 'both' ? 'auto' : 'hidden'

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
        }
        .scroll-area {
          overflow-x: ${overflowX};
          overflow-y: ${overflowY};
          width: 100%;
          height: 100%;
        }
        ${glassScrollbarStyles('.scroll-area')}
      </style>
      <div class="scroll-area"><slot></slot></div>
    `
  }
}

customElements.define('o-scroll', OScroll)
export { OScroll }
