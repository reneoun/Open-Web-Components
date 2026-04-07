import { GlassElement, glassBaseStyles } from './glass'

export class OTooltip extends GlassElement {
  static get observedAttributes() { return ['text', 'position'] }

  connectedCallback() { this.render() }

  disconnectedCallback() {
    this.removeEventListener('mouseenter', this.show)
    this.removeEventListener('mouseleave', this.hide)
    this.removeEventListener('focusin', this.show)
    this.removeEventListener('focusout', this.hide)
  }

  attributeChangedCallback() { if (this.isConnected) this.render() }

  private get position() { return this.getAttribute('position') ?? 'top' }

  private show = () => {
    this.shadowRoot!.querySelector('.tooltip')?.classList.add('visible')
  }

  private hide = () => {
    this.shadowRoot!.querySelector('.tooltip')?.classList.remove('visible')
  }

  private render() {
    const text = this.getAttribute('text') ?? ''
    const pos = this.position

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { position: relative; display: inline-block; }
        .tooltip {
          position: absolute;
          padding: 6px 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 8px;
          color: var(--glass-text);
          font-size: 12px;
          font-family: sans-serif;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 1000;
        }
        .tooltip.visible { opacity: 1; }
        .top { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .left { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
        .right { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
      </style>
      <slot></slot>
      <div class="tooltip ${pos}" role="tooltip">${text}</div>
    `
    this.addEventListener('mouseenter', this.show)
    this.addEventListener('mouseleave', this.hide)
    this.addEventListener('focusin', this.show)
    this.addEventListener('focusout', this.hide)
  }
}

customElements.define('o-tooltip', OTooltip)
