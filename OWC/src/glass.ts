// Shared design tokens + base class for every OWC component.
//
// Theming works two ways:
//   1. Per component  — <o-button theme="pixel">
//   2. Whole page     — <body data-owc-theme="pixel">
//
// Page-wide theming works by indirection: the :host block reads every token as
// var(--owc-<token>, <default>). Custom properties inherit through shadow
// boundaries, so a --owc-* value set on an ancestor reaches the host and wins
// over the built-in default. A theme="" attribute writes the token straight
// onto the host, which beats the inherited value — so a per-component theme
// still overrides the page theme.

export type ThemeTokens = Record<string, string>;

/** The default "dark glass" look. Every other theme is a patch on top of this. */
export const BASE_TOKENS: ThemeTokens = {
  // surfaces
  'glass-bg': 'rgba(255,255,255,0.07)',
  'glass-border': 'rgba(255,255,255,0.12)',
  'glass-hover': 'rgba(255,255,255,0.1)',
  // text
  'glass-text': '#fff',
  'glass-text-muted': 'rgba(255,255,255,0.5)',
  'glass-text-dim': 'rgba(255,255,255,0.3)',
  // accent
  'accent-warm': 'rgba(251,191,36,0.6)',
  'glass-accent-text': '#000',
  // depth
  'glass-blur': '12px',
  'glass-backdrop': 'blur(var(--glass-blur))',
  'glass-shadow': '0 8px 32px rgba(0,0,0,0.3)',
  'glass-elevation': 'none',
  'glass-scrim': 'rgba(0,0,0,0.5)',
  'glass-scrim-backdrop': 'blur(4px)',
  // geometry
  'glass-border-width': '1px',
  'glass-radius-xs': '3px',
  'glass-radius-sm': '4px',
  'glass-radius-md': '6px',
  'glass-radius-tab': '7px',
  'glass-radius-lg': '8px',
  'glass-radius': '10px',
  'glass-radius-xl': '12px',
  'glass-radius-2xl': '16px',
  'glass-radius-pill': '999px',
  // typography
  'glass-font': 'sans-serif',
  // motion
  'glass-press': 'scale(0.97)',
  // progress bar
  'glass-progress': 'rgba(74,222,128,0.85)',
  'glass-progress-glow': '0 0 8px rgba(74,222,128,0.5)',
};

/** Light glass — the original theme="light". Colours only; geometry stays glassy. */
export const LIGHT_OVERRIDES: ThemeTokens = {
  'glass-bg': 'rgba(34,197,94,0.06)',
  'glass-border': 'rgba(34,197,94,0.15)',
  'glass-hover': 'rgba(34,197,94,0.08)',
  'glass-text': '#1a2e1a',
  'glass-text-muted': 'rgba(0,40,0,0.5)',
  'glass-text-dim': 'rgba(0,40,0,0.3)',
  'accent-warm': 'rgba(22,163,74,0.7)',
  'glass-shadow': '0 8px 32px rgba(0,0,0,0.06)',
};

/**
 * Pixel-art. Square corners, no blur, chunky black outlines, hard offset
 * shadows and a monospace stack. Deliberately no webfont — the library stays
 * self-contained and makes zero network requests.
 */
export const PIXEL_OVERRIDES: ThemeTokens = {
  'glass-bg': '#26264d',
  'glass-border': '#0d0d1a',
  'glass-hover': '#3d3d73',
  'glass-text': '#ffffff',
  'glass-text-muted': '#a5a5d6',
  'glass-text-dim': '#6b6b9e',
  'accent-warm': '#ffcc00',
  'glass-accent-text': '#0d0d1a',
  'glass-blur': '0px',
  'glass-backdrop': 'none',
  'glass-shadow': '4px 4px 0 #0d0d1a',
  'glass-elevation': '4px 4px 0 #0d0d1a',
  'glass-scrim': 'rgba(13,13,26,0.8)',
  'glass-scrim-backdrop': 'none',
  'glass-border-width': '3px',
  'glass-radius-xs': '0',
  'glass-radius-sm': '0',
  'glass-radius-md': '0',
  'glass-radius-tab': '0',
  'glass-radius-lg': '0',
  'glass-radius': '0',
  'glass-radius-xl': '0',
  'glass-radius-2xl': '0',
  'glass-radius-pill': '0',
  'glass-font': "ui-monospace, 'Courier New', Courier, monospace",
  'glass-press': 'translate(4px, 4px)',
  'glass-progress': '#00e436',
  'glass-progress-glow': 'none',
};

/**
 * Simple office. Flat, neutral and legible — the sort of thing that belongs in
 * an internal business tool. No glass, no blur, one conservative blue accent.
 */
export const OFFICE_OVERRIDES: ThemeTokens = {
  'glass-bg': '#ffffff',
  'glass-border': '#d5dae1',
  'glass-hover': '#f1f4f8',
  'glass-text': '#1f2933',
  'glass-text-muted': '#5c6b7a',
  'glass-text-dim': '#94a1ae',
  'accent-warm': '#2f6fb0',
  'glass-accent-text': '#ffffff',
  'glass-blur': '0px',
  'glass-backdrop': 'none',
  'glass-shadow': '0 1px 3px rgba(16,24,40,0.10)',
  'glass-elevation': '0 1px 2px rgba(16,24,40,0.06)',
  'glass-scrim': 'rgba(16,24,40,0.40)',
  'glass-scrim-backdrop': 'none',
  'glass-border-width': '1px',
  'glass-radius-xs': '2px',
  'glass-radius-sm': '2px',
  'glass-radius-md': '3px',
  'glass-radius-tab': '3px',
  'glass-radius-lg': '3px',
  'glass-radius': '4px',
  'glass-radius-xl': '4px',
  'glass-radius-2xl': '6px',
  'glass-radius-pill': '999px',
  'glass-font': "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  'glass-press': 'none',
  'glass-progress': '#2f6fb0',
  'glass-progress-glow': 'none',
};

/** Every named theme. The key is what you pass to theme="" / data-owc-theme="". */
export const THEMES: Record<string, ThemeTokens> = {
  light: LIGHT_OVERRIDES,
  pixel: PIXEL_OVERRIDES,
  office: OFFICE_OVERRIDES,
};

/** Aliases that mean "the default look", so a component can opt out of a page theme. */
const DEFAULT_ALIASES = ['glass', 'dark'];

const declList = (t: ThemeTokens, pad: string) =>
  Object.entries(t).map(([k, v]) => `${pad}--${k}: ${v};`).join('\n');

const fallbackDeclList = (t: ThemeTokens, pad: string) =>
  Object.entries(t).map(([k, v]) => `${pad}--${k}: var(--owc-${k}, ${v});`).join('\n');

const withDefaults = (o: ThemeTokens): ThemeTokens => ({ ...BASE_TOKENS, ...o });

// Backwards-compatible string exports (these were the original public API).
export const GLASS_TOKENS = `\n${declList(BASE_TOKENS, '  ')}\n`;
export const GLASS_TOKENS_LIGHT = `\n${declList(LIGHT_OVERRIDES, '  ')}\n`;
export const GLASS_TOKENS_PIXEL = `\n${declList(PIXEL_OVERRIDES, '  ')}\n`;
export const GLASS_TOKENS_OFFICE = `\n${declList(OFFICE_OVERRIDES, '  ')}\n`;

/**
 * The <style> preamble every component injects into its shadow root.
 * :host carries the defaults (indirected, so a page theme can reach in);
 * each :host([theme=...]) block carries a *complete* token set, so a
 * per-component theme fully overrides whatever the page set.
 */
export function glassBaseStyles(): string {
  const themeBlocks = Object.entries(THEMES)
    .map(([name, o]) => `    :host([theme="${name}"]) {\n${declList(withDefaults(o), '      ')}\n    }`)
    .join('\n');
  const defaultBlock = DEFAULT_ALIASES.map(n => `:host([theme="${n}"])`).join(', ');
  return `
    :host {
${fallbackDeclList(BASE_TOKENS, '      ')}
    }
${themeBlocks}
    ${defaultBlock} {
${declList(BASE_TOKENS, '      ')}
    }
  `;
}

// A token value may itself reference another token (e.g. glass-backdrop uses
// var(--glass-blur)). At page level only the --owc-* names exist, and a custom
// property's var()s resolve in the scope where it is declared — so rewrite the
// references or they would compute to invalid on <body>.
const toPageScope = (v: string) => v.replace(/var\(--glass-/g, 'var(--owc-glass-');

const pageDeclList = (t: ThemeTokens) =>
  Object.entries(t).map(([k, v]) => `  --owc-${k}: ${toPageScope(v)};`).join('\n');

/** Document-level CSS backing <body data-owc-theme="..."> page-wide theming. */
export function globalThemeCSS(): string {
  const blocks = Object.entries(THEMES)
    .map(([name, o]) => `[data-owc-theme="${name}"] {\n${pageDeclList(withDefaults(o))}\n}`);
  const aliases = DEFAULT_ALIASES.map(n => `[data-owc-theme="${n}"]`).join(', ');
  blocks.push(`${aliases} {\n${pageDeclList(BASE_TOKENS)}\n}`);
  return blocks.join('\n');
}

export const GLOBAL_THEME_STYLE_ID = 'owc-global-themes';

/** Injects the page-wide theme stylesheet once. Safe to call repeatedly. */
export function installGlobalThemeStyles(doc?: Document): boolean {
  const d = doc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!d?.head) return false;
  if (d.getElementById(GLOBAL_THEME_STYLE_ID)) return false;
  const style = d.createElement('style');
  style.id = GLOBAL_THEME_STYLE_ID;
  style.textContent = globalThemeCSS();
  d.head.appendChild(style);
  return true;
}

export class GlassElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
