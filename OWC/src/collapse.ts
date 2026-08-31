// o-collapse — a nestable disclosure panel, and o-collapse-group for bulk control.
//
// Nesting is first-class: collapses may contain collapses to any depth, and the
// group's bulk operations can target every descendant or just the top level.
//
// The open/close animation uses a grid-template-rows 0fr->1fr transition rather
// than max-height. max-height needs a magic number large enough for the biggest
// content, which both caps deep nesting and makes the easing wrong for short
// panels. 0fr->1fr animates to the content's real height, whatever it is.

import { GlassElement, glassBaseStyles } from './glass';

export interface OCollapseToggleDetail {
  open: boolean;
  label: string;
}

let uid = 0;

export class OCollapse extends GlassElement {
  static get observedAttributes() { return ['label', 'open', 'disabled'] }

  private _id = `oc-${++uid}`;
  private _rendered = false;

  get label() { return this.getAttribute('label') ?? '' }
  set label(v: string) { this.setAttribute('label', v) }

  get open() { return this.hasAttribute('open') }
  set open(v: boolean) { v ? this.setAttribute('open', '') : this.removeAttribute('open') }

  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v: boolean) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled') }

  /** Depth below the nearest o-collapse ancestor — 0 for a top-level panel. */
  get depth(): number {
    let d = 0;
    let p = this.parentElement;
    while (p) {
      if (p.tagName === 'O-COLLAPSE') d++;
      p = p.parentElement;
    }
    return d;
  }

  connectedCallback() {
    this.render();
    this._rendered = true;
  }

  attributeChangedCallback(name: string, prev: string | null, next: string | null) {
    if (!this._rendered) return;
    if (prev === next) return;
    // `open` only toggles classes/ARIA — re-rendering would tear down and rebuild
    // the slot, which drops focus and restarts any transition mid-flight.
    if (name === 'open') { this.sync(); return }
    this.render();
  }

  /** Flip open state. Honours `disabled` and fires o-collapse-toggle. */
  toggle(force?: boolean) {
    if (this.disabled) return;
    const next = force === undefined ? !this.open : force;
    if (next === this.open) return;
    this.open = next;
    this.dispatchEvent(new CustomEvent<OCollapseToggleDetail>('o-collapse-toggle', {
      bubbles: true, composed: true,
      detail: { open: next, label: this.label },
    }));
  }

  private sync() {
    const root = this.shadowRoot;
    if (!root) return;
    const head = root.querySelector('.head') as HTMLElement | null;
    const body = root.querySelector('.body') as HTMLElement | null;
    head?.setAttribute('aria-expanded', String(this.open));
    body?.classList.toggle('open', this.open);
    head?.classList.toggle('open', this.open);
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
        :host { display: block; margin: 0 0 8px; }
        :host([hidden]) { display: none; }
        .wrap {
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius);
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          overflow: hidden;
        }
        .head {
          display: flex; align-items: center; gap: 10px;
          width: 100%;
          box-sizing: border-box;
          padding: 10px 14px;
          background: none;
          border: none;
          border-radius: 0;
          color: var(--glass-text);
          font-family: var(--glass-font);
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .head:hover { background: var(--glass-hover); }
        .head:focus-visible {
          outline: var(--glass-border-width) solid var(--accent-warm);
          outline-offset: -2px;
        }
        :host([disabled]) .head { cursor: not-allowed; opacity: 0.5; }
        .chev {
          flex: none;
          width: 10px; height: 10px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(-45deg);
          transition: transform 0.2s ease;
          margin-left: -2px;
        }
        .head.open .chev { transform: rotate(45deg); }
        .label { flex: 1; min-width: 0; }
        .count {
          flex: none;
          font-weight: 400;
          font-size: 12px;
          color: var(--glass-text-muted);
        }
        /* 0fr -> 1fr animates to the content's true height at any depth. */
        .body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.22s ease;
        }
        .body.open { grid-template-rows: 1fr; }
        .inner { overflow: hidden; min-height: 0; }
        .pad { padding: 0 14px 12px; }
        /* A nested collapse sits flush inside its parent's padding. */
        ::slotted(o-collapse) { margin-left: 0; }
        @media (prefers-reduced-motion: reduce) {
          .body, .chev { transition: none; }
        }
      </style>
      <div class="wrap">
        <button class="head${this.open ? ' open' : ''}" type="button"
                id="${this._id}-h"
                aria-expanded="${this.open}" aria-controls="${this._id}-b"
                ${this.disabled ? 'disabled' : ''}>
          <span class="chev"></span>
          <span class="label">${this.label}</span>
          <span class="count"><slot name="meta"></slot></span>
        </button>
        <div class="body${this.open ? ' open' : ''}" id="${this._id}-b" role="region"
             aria-labelledby="${this._id}-h">
          <div class="inner"><div class="pad"><slot></slot></div></div>
        </div>
      </div>
    `;
    const head = root.querySelector('.head') as HTMLButtonElement;
    head.addEventListener('click', () => this.toggle());
    head.addEventListener('keydown', this.onKey);
  }
}

export class OCollapseGroup extends GlassElement {
  static get observedAttributes() { return ['accordion', 'storage-key'] }

  get accordion() { return this.hasAttribute('accordion') }
  set accordion(v: boolean) { v ? this.setAttribute('accordion', '') : this.removeAttribute('accordion') }

  /** Every descendant collapse, deepest included. */
  get panels(): OCollapse[] {
    return Array.from(this.querySelectorAll('o-collapse')) as OCollapse[];
  }

  /** Only the collapses with no o-collapse ancestor inside this group. */
  get topLevel(): OCollapse[] {
    return this.panels.filter(p => p.depth === 0);
  }

  get openLabels(): string[] {
    return this.panels.filter(p => p.open).map(p => p.label);
  }
  set openLabels(labels: string[]) {
    const want = new Set(labels);
    this.panels.forEach(p => p.toggle(want.has(p.label)));
  }

  connectedCallback() {
    this.attachShadowOnce();
    this.addEventListener('o-collapse-toggle', this.onToggle as EventListener);
    // Children are not parsed yet when the bundle runs as an IIFE in <head>.
    requestAnimationFrame(() => this.restore());
  }

  disconnectedCallback() {
    this.removeEventListener('o-collapse-toggle', this.onToggle as EventListener);
  }

  private attachShadowOnce() {
    if (this.shadowRoot!.childElementCount) return;
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
      </style>
      <slot></slot>
    `;
  }

  /** Collapse every panel, or only the top level with { topLevelOnly: true }. */
  collapseAll(opts: { topLevelOnly?: boolean } = {}) { this.setAll(false, opts) }
  expandAll(opts: { topLevelOnly?: boolean } = {}) { this.setAll(true, opts) }

  private setAll(open: boolean, opts: { topLevelOnly?: boolean } = {}) {
    const list = opts.topLevelOnly ? this.topLevel : this.panels;
    list.forEach(p => p.toggle(open));
  }

  /** Bulk-target a subset by label — the "collapse multiple" case. */
  collapse(labels: string[]) { this.setMany(labels, false) }
  expand(labels: string[]) { this.setMany(labels, true) }

  private setMany(labels: string[], open: boolean) {
    const want = new Set(labels);
    this.panels.filter(p => want.has(p.label)).forEach(p => p.toggle(open));
  }

  private onToggle = (e: CustomEvent<OCollapseToggleDetail>) => {
    const target = e.target as OCollapse;
    if (this.accordion && e.detail.open) {
      // Only siblings at the same depth close — otherwise opening a child would
      // close its own parent and hide itself.
      this.panels
        .filter(p => p !== target && p.open && p.depth === target.depth)
        .forEach(p => p.toggle(false));
    }
    this.persist();
  }

  private storageArea(): Storage | null {
    const key = this.getAttribute('storage-key');
    if (!key) return null;
    try { return window.localStorage } catch { return null }
  }

  private persist() {
    const store = this.storageArea();
    const key = this.getAttribute('storage-key');
    if (!store || !key) return;
    try { store.setItem(key, JSON.stringify(this.openLabels)) } catch { /* quota or blocked */ }
  }

  private restore() {
    const store = this.storageArea();
    const key = this.getAttribute('storage-key');
    if (!store || !key) return;
    try {
      const raw = store.getItem(key);
      if (!raw) return;
      const labels = JSON.parse(raw);
      if (Array.isArray(labels)) this.openLabels = labels;
    } catch { /* corrupt value — keep markup defaults */ }
  }
}

if (!customElements.get('o-collapse')) customElements.define('o-collapse', OCollapse);
if (!customElements.get('o-collapse-group')) customElements.define('o-collapse-group', OCollapseGroup);
