// o-sidebar — a collapsible side panel that can be fixed to the viewport.
//
// Collapsing shrinks it to a narrow rail rather than hiding it, so navigation
// stays reachable. Slotted content is NOT unmounted when collapsed: the rail
// keeps rendering it at reduced width, which means light-DOM selectors held by
// the host page (scroll-spy, anchor wiring) keep resolving either way.
//
// `fixed` pins it to the viewport edge and publishes its own width as
// --o-sidebar-offset on the document element, so a page can pad itself to clear
// the sidebar without hard-coding a number that would drift out of sync with
// the rail/expanded transition.
//
// Below `breakpoint` the sidebar overlays instead of reserving space — a fixed
// panel that pushes content would eat a phone screen.

import { GlassElement, glassBaseStyles } from './glass';

export interface OSidebarToggleDetail {
  collapsed: boolean;
}

let uid = 0;

export class OSidebar extends GlassElement {
  static get observedAttributes() {
    return ['side', 'collapsed', 'fixed', 'width', 'rail-width', 'label', 'breakpoint'];
  }

  private _id = `os-${++uid}`;
  private _rendered = false;
  private _mq: MediaQueryList | null = null;
  /** True when WE collapsed it for a narrow viewport, so we may undo it. */
  private _autoCollapsed = false;
  /** Set once the user drives the toggle; we then stop overriding their choice. */
  private _userSet = false;

  get side() { return this.getAttribute('side') === 'right' ? 'right' : 'left' }
  set side(v: string) { this.setAttribute('side', v) }

  get collapsed() { return this.hasAttribute('collapsed') }
  set collapsed(v: boolean) { v ? this.setAttribute('collapsed', '') : this.removeAttribute('collapsed') }

  get fixed() { return this.hasAttribute('fixed') }
  set fixed(v: boolean) { v ? this.setAttribute('fixed', '') : this.removeAttribute('fixed') }

  get width() { return Math.max(0, parseInt(this.getAttribute('width') ?? '240') || 240) }
  set width(v: number) { this.setAttribute('width', String(v)) }

  get railWidth() { return Math.max(0, parseInt(this.getAttribute('rail-width') ?? '52') || 52) }
  set railWidth(v: number) { this.setAttribute('rail-width', String(v)) }

  get label() { return this.getAttribute('label') ?? '' }
  set label(v: string) { this.setAttribute('label', v) }

  /** Viewport width at or below which the sidebar overlays instead of reserving space. */
  get breakpoint() { return Math.max(0, parseInt(this.getAttribute('breakpoint') ?? '820') || 820) }
  set breakpoint(v: number) { this.setAttribute('breakpoint', String(v)) }

  /** True while the viewport is narrow enough that the sidebar overlays content. */
  get overlaying() { return !!this._mq?.matches }

  /** Current rendered width in px — rail width when collapsed. */
  get currentWidth() { return this.collapsed ? this.railWidth : this.width }

  connectedCallback() {
    this.render();
    this._rendered = true;
    this.watchViewport();
    this.applyResponsiveDefault();
    this.publishOffset();
  }

  disconnectedCallback() {
    this._mq?.removeEventListener('change', this.onViewport);
    this._mq = null;
    // Stop reserving space for a sidebar that is no longer on the page.
    if (this.fixed) document.documentElement.style.removeProperty('--o-sidebar-offset');
  }

  attributeChangedCallback(name: string, prev: string | null, next: string | null) {
    if (!this._rendered) return;
    if (prev === next) return;
    // `collapsed` only flips classes/ARIA — re-rendering would tear down the
    // slot and drop focus mid-transition, exactly as o-collapse avoids.
    if (name === 'collapsed') { this.sync(); this.publishOffset(); return }
    if (name === 'breakpoint') { this.watchViewport(); this.publishOffset(); return }
    this.render();
    this.publishOffset();
  }

  /** Flip collapsed state. Fires o-sidebar-toggle only on a real change. */
  toggle(force?: boolean) {
    const next = force === undefined ? !this.collapsed : force;
    if (next === this.collapsed) return;
    // An explicit toggle is the user's decision — stop applying the
    // narrow-viewport default over the top of it.
    this._userSet = true;
    this._autoCollapsed = false;
    this.collapsed = next;
    this.dispatchEvent(new CustomEvent<OSidebarToggleDetail>('o-sidebar-toggle', {
      bubbles: true, composed: true,
      detail: { collapsed: next },
    }));
  }

  collapse() { this.toggle(true) }
  expand() { this.toggle(false) }

  private watchViewport() {
    this._mq?.removeEventListener('change', this.onViewport);
    if (typeof window.matchMedia !== 'function') return;
    this._mq = window.matchMedia(`(max-width: ${this.breakpoint}px)`);
    this._mq.addEventListener('change', this.onViewport);
    this.syncOverlay();
  }

  private onViewport = () => {
    this.syncOverlay();
    this.applyResponsiveDefault();
    this.publishOffset();
  }

  /**
   * An expanded sidebar overlaying a phone screen covers most of the content,
   * so default to the rail while narrow. Only ever overrides the state we set
   * ourselves — once the user works the toggle, their choice stands.
   */
  private applyResponsiveDefault() {
    if (this._userSet) return;
    if (this.overlaying && !this.collapsed) {
      this.collapsed = true;
      this._autoCollapsed = true;
    } else if (!this.overlaying && this._autoCollapsed) {
      this.collapsed = false;
      this._autoCollapsed = false;
    }
  }

  private syncOverlay() {
    this.classList.toggle('o-sidebar-overlay', this.overlaying);
  }

  /**
   * Publish the space a fixed sidebar occupies so the page can pad itself.
   * While overlaying we publish 0 — the sidebar floats above content instead of
   * reserving a gutter, which is what keeps a narrow screen usable.
   */
  private publishOffset() {
    if (!this.fixed) return;
    const px = this.overlaying ? 0 : this.currentWidth;
    document.documentElement.style.setProperty('--o-sidebar-offset', `${px}px`);
  }

  private sync() {
    const root = this.shadowRoot;
    if (!root) return;
    const btn = root.querySelector('.toggle') as HTMLElement | null;
    btn?.setAttribute('aria-expanded', String(!this.collapsed));
    btn?.setAttribute('title', this.collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this.toggle();
    }
  }

  private render() {
    const root = this.shadowRoot!;
    root.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
          width: var(--o-sidebar-w);
          --o-sidebar-w: ${this.width}px;
          --o-sidebar-rail: ${this.railWidth}px;
          box-sizing: border-box;
          transition: width 0.22s ease;
        }
        :host([collapsed]) { width: var(--o-sidebar-rail); }
        :host([hidden]) { display: none; }
        :host([fixed]) {
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 100;
        }
        :host([fixed]:not([side="right"])) { left: 0; }
        :host([fixed][side="right"]) { right: 0; }

        .wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
          background: var(--glass-chrome-bg, var(--glass-bg));
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          color: var(--glass-text);
          font-family: var(--glass-font);
          overflow: hidden;
        }
        /* Only the inner edge gets a border — the outer edge is the viewport. */
        :host(:not([side="right"])) .wrap {
          border-right: var(--glass-border-width) solid var(--glass-chrome-border, var(--glass-border));
        }
        :host([side="right"]) .wrap {
          border-left: var(--glass-border-width) solid var(--glass-chrome-border, var(--glass-border));
        }

        .head {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: none;
          padding: 10px;
          box-sizing: border-box;
          min-height: 44px;
        }
        :host([side="right"]) .head { flex-direction: row-reverse; }
        .title {
          flex: 1;
          min-width: 0;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 1;
          transition: opacity 0.15s ease;
        }
        :host([collapsed]) .title { opacity: 0; pointer-events: none; }

        .toggle {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          padding: 0;
          background: none;
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-sm);
          color: var(--glass-text);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .toggle:hover { background: var(--glass-hover); }
        .toggle:focus-visible {
          outline: var(--glass-border-width) solid var(--accent-warm);
          outline-offset: 2px;
        }
        .bars { display: block; width: 14px; height: 10px; position: relative; }
        .bars::before, .bars::after, .bars > i {
          content: ''; position: absolute; left: 0; right: 0;
          height: 2px; background: currentColor;
        }
        .bars::before { top: 0; }
        .bars > i { top: 4px; }
        .bars::after { bottom: 0; }

        /* Search sits under the header and hides on the rail — a 52px rail
           cannot show a usable text field, and a clipped one invites typing
           into something invisible. */
        .search {
          flex: none;
          padding: 0 10px 10px;
          transition: opacity 0.15s ease;
        }
        :host([collapsed]) .search {
          opacity: 0;
          pointer-events: none;
          height: 0;
          padding: 0;
          overflow: hidden;
        }

        .body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 10px 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--glass-scroll-thumb) var(--glass-scroll-track);
        }
        .body::-webkit-scrollbar { width: var(--glass-scroll-size); }
        .body::-webkit-scrollbar-track { background: var(--glass-scroll-track); }
        .body::-webkit-scrollbar-thumb {
          background: var(--glass-scroll-thumb);
          border-radius: var(--glass-scroll-radius);
        }
        .body::-webkit-scrollbar-thumb:hover { background: var(--glass-scroll-thumb-hover); }
        :host([collapsed]) .body { padding: 0 6px 10px; }

        .foot { flex: none; padding: 10px; }
        :host([collapsed]) .foot { padding: 10px 6px; }

        @media (prefers-reduced-motion: reduce) {
          :host, .title, .search, .toggle { transition: none; }
        }
      </style>
      <div class="wrap" part="wrap">
        <div class="head">
          <button class="toggle" part="toggle" type="button"
                  id="${this._id}-t"
                  aria-expanded="${!this.collapsed}" aria-controls="${this._id}-b"
                  aria-label="Toggle sidebar"
                  title="${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">
            <span class="bars" aria-hidden="true"><i></i></span>
          </button>
          <span class="title">${this.label}</span>
        </div>
        <div class="search"><slot name="search"></slot></div>
        <div class="body" id="${this._id}-b" part="body"><slot></slot></div>
        <div class="foot"><slot name="footer"></slot></div>
      </div>
    `;
    const btn = root.querySelector('.toggle') as HTMLButtonElement;
    btn.addEventListener('click', () => this.toggle());
    btn.addEventListener('keydown', this.onKey);
    this.sync();
  }
}

if (!customElements.get('o-sidebar')) customElements.define('o-sidebar', OSidebar);
