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
`;

export function glassBaseStyles(): string {
  return `
    :host {
      ${GLASS_TOKENS}
    }
    @media (prefers-color-scheme: light) {
      :host(:not([theme="dark"])) {
        ${GLASS_TOKENS_LIGHT}
      }
    }
    :host([theme="dark"]) {
      ${GLASS_TOKENS}
    }
    :host([theme="light"]) {
      ${GLASS_TOKENS_LIGHT}
    }
  `;
}

export class GlassElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
