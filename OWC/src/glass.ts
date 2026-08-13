// Shared glass design tokens + base class

export const GLASS_TOKENS_LIGHT = `
  --glass-bg: rgba(34,197,94,0.06);
  --glass-border: rgba(34,197,94,0.15);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.06);
  --accent-warm: rgba(22,163,74,0.7);
  --glass-text: #1a2e1a;
  --glass-text-muted: rgba(0,40,0,0.5);
  --glass-text-dim: rgba(0,40,0,0.3);
  --glass-hover: rgba(34,197,94,0.08);
  --glass-scroll-thumb: rgba(0,40,0,0.28);
  --glass-scroll-thumb-hover: rgba(0,40,0,0.45);
  --glass-scroll-track: rgba(0,40,0,0.06);
`;

export const GLASS_TOKENS = `
  --glass-bg: rgba(255,255,255,0.07);
  --glass-border: rgba(255,255,255,0.12);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
  --accent-warm: rgba(251,191,36,0.6);
  --glass-text: #fff;
  --glass-text-muted: rgba(255,255,255,0.5);
  --glass-text-dim: rgba(255,255,255,0.3);
  --glass-hover: rgba(255,255,255,0.1);
  --glass-scroll-thumb: rgba(255,255,255,0.28);
  --glass-scroll-thumb-hover: rgba(255,255,255,0.5);
  --glass-scroll-track: rgba(255,255,255,0.06);
`;

export function glassBaseStyles(): string {
  return `
    :host {
      ${GLASS_TOKENS}
    }
    :host([theme="light"]) {
      ${GLASS_TOKENS_LIGHT}
    }
  `;
}

/**
 * Scrollbars for a scrolling element. Colours come from the glass tokens, so they
 * follow the theme — the previous hard-coded white-on-white was invisible in light
 * themes, which read as "this panel has no scrollbar".
 *
 * Styling ::-webkit-scrollbar also opts out of macOS overlay scrollbars, so the
 * bar stays visible instead of fading out after scrolling stops. Both axes are
 * sized, so horizontal overflow gets a visible bar too.
 */
export function glassScrollbarStyles(selector = ':host'): string {
  return `
    /* Firefox */
    ${selector} {
      scrollbar-width: thin;
      scrollbar-color: var(--glass-scroll-thumb) var(--glass-scroll-track);
    }
    /* Webkit (Chrome, Safari, Edge) */
    ${selector}::-webkit-scrollbar { width: 9px; height: 9px; }
    ${selector}::-webkit-scrollbar-track {
      background: var(--glass-scroll-track);
      border-radius: 5px;
    }
    ${selector}::-webkit-scrollbar-thumb {
      background: var(--glass-scroll-thumb);
      border-radius: 5px;
      transition: background 0.2s;
    }
    ${selector}::-webkit-scrollbar-thumb:hover {
      background: var(--glass-scroll-thumb-hover);
    }
    ${selector}::-webkit-scrollbar-corner { background: transparent; }
  `;
}

export class GlassElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
