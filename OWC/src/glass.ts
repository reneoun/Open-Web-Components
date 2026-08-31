// Shared design tokens + base class for every OWC component.
//
// Theming has TWO INDEPENDENT AXES:
//
//   family — the visual language:  glass | pixel | office
//   mode   — the colour scheme:    light | dark
//
// Both can be set per component or page-wide, and mix freely:
//
//   <o-card theme="pixel" mode="light">              per component
//   <body data-owc-theme="office" data-owc-mode="dark">   whole page
//
// With no mode set, the mode follows the visitor's OS (prefers-color-scheme).
// An explicit mode always beats the OS. A per-component attribute always beats
// the page.
//
// Geometry (radii, blur, font, border width) belongs to the family and does not
// change with mode. Colour belongs to family x mode.
//
// HOW IT WORKS
// The document stylesheet publishes each family's palette as --owc-* custom
// properties, and publishes BOTH modes side by side (--owc-glass-bg-light and
// --owc-glass-bg-dark) alongside the resolved --owc-glass-bg. Custom properties
// inherit through shadow boundaries, so a component's :host can read them.
// Publishing both modes is what lets <o-card mode="light"> inside a page-level
// office theme pick up *office* light rather than falling back to glass.
//
// LEGACY: theme="light" and theme="dark" predate the mode axis and are pinned
// aliases for glass+light / glass+dark. They must keep working.

export type ThemeTokens = Record<string, string>;
export type Mode = 'light' | 'dark';
export type Family = 'glass' | 'pixel' | 'office';

export const MODES: Mode[] = ['light', 'dark'];
export const FAMILIES: Family[] = ['glass', 'pixel', 'office'];

/**
 * Which tokens carry colour. Everything else is geometry and is shared by both
 * modes of a family. Keeping the split explicit is what keeps the generated CSS
 * small: a mode block only has to re-declare these.
 */
export const COLOUR_TOKENS = [
  'glass-bg', 'glass-border', 'glass-hover',
  'glass-text', 'glass-text-muted', 'glass-text-dim',
  'accent-warm', 'glass-accent-text',
  'glass-shadow', 'glass-elevation', 'glass-scrim', 'glass-indicator',
  'glass-scroll-thumb', 'glass-scroll-thumb-hover', 'glass-scroll-track',
  'glass-progress', 'glass-progress-glow',
  'glass-positive', 'glass-negative',
  'glass-page-bg', 'glass-page-text', 'glass-chrome-bg', 'glass-chrome-border',
  // Charts: a dedicated plate plus six categorical series slots. The plate
  // exists because a chart cannot sit on the glass panel — that surface
  // composites to a saturated mid-green where every series colour lands
  // near 1:1 contrast. Series slots are assigned in fixed order, never
  // cycled, and each set is validated per surface (see docs in README).
  'glass-chart-surface', 'glass-grid',
  'glass-series-1', 'glass-series-2', 'glass-series-3',
  'glass-series-4', 'glass-series-5', 'glass-series-6',
] as const;

const isColour = (k: string) => (COLOUR_TOKENS as readonly string[]).includes(k);

/**
 * Geometry per family. Mode-independent by design — switching light/dark must
 * never move a pixel. `glass` is the empty patch: its geometry IS the base.
 */
export const FAMILY_GEOMETRY: Record<Family, ThemeTokens> = {
  glass: {},
  pixel: {
    'glass-blur': '0px',
    'glass-backdrop': 'none',
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
    'glass-scroll-size': '12px',
    'glass-scroll-radius': '0',
  },
  office: {
    'glass-blur': '0px',
    'glass-backdrop': 'none',
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
    'glass-scroll-size': '10px',
    'glass-scroll-radius': '2px',
  },
};

/**
 * Colour per family x mode. Every ratio quoted below is measured, not guessed —
 * `npm run audit:contrast` recomputes them by compositing each translucent
 * layer over the one beneath it.
 *
 * Targets: body text >= 4.5:1 (WCAG AA), decorative/disabled text and non-text
 * UI >= 3:1. Panel edges on glass and office are highlight strokes rather than
 * boundaries that identify a control, so they are deliberately below 3:1.
 */
export const FAMILY_COLOURS: Record<Family, Record<Mode, ThemeTokens>> = {
  glass: {
    dark: {
      'glass-bg': 'rgba(255,255,255,0.07)',
      'glass-border': 'rgba(255,255,255,0.12)',
      'glass-hover': 'rgba(255,255,255,0.1)',
      'glass-text': '#fff',
      'glass-text-muted': 'rgba(255,255,255,0.78)',
      'glass-text-dim': 'rgba(255,255,255,0.56)',
      'accent-warm': 'rgba(251,191,36,0.92)',
      'glass-accent-text': '#1a1200',
      'glass-shadow': '0 8px 32px rgba(0,0,0,0.3)',
      'glass-elevation': 'none',
      'glass-scrim': 'rgba(0,0,0,0.5)',
      'glass-indicator': 'rgba(255,255,255,0.12)',
      'glass-scroll-thumb': 'rgba(255,255,255,0.62)',
      'glass-scroll-thumb-hover': 'rgba(255,255,255,0.8)',
      'glass-scroll-track': 'rgba(255,255,255,0.06)',
      'glass-progress': 'rgba(74,222,128,0.85)',
      'glass-progress-glow': '0 0 8px rgba(74,222,128,0.5)',
      'glass-positive': 'rgba(74,222,128,0.9)',
      'glass-negative': '#ffb4ab',
      'glass-page-bg': 'linear-gradient(135deg, #059669, #065f46)',
      'glass-page-text': '#ffffff',
      'glass-chrome-bg': 'rgba(3,54,25,0.78)',
      'glass-chrome-border': 'rgba(255,255,255,0.1)',
      'glass-chart-surface': '#0a2c20',
      'glass-grid': '#16402f',
      'glass-series-1': '#009e5e',
      'glass-series-2': '#a44996',
      'glass-series-3': '#ad8300',
      'glass-series-4': '#c2262d',
      'glass-series-5': '#3c89e9',
      'glass-series-6': '#c84704',
    },
    light: {
      'glass-bg': 'rgba(255,255,255,0.62)',
      'glass-border': 'rgba(4,90,60,0.22)',
      'glass-hover': 'rgba(255,255,255,0.82)',
      'glass-text': '#04291b',
      'glass-text-muted': '#2c5c48',
      'glass-text-dim': '#4a7d67',
      'accent-warm': '#046b47',
      'glass-accent-text': '#ffffff',
      'glass-shadow': '0 8px 32px rgba(4,60,40,0.12)',
      'glass-elevation': 'none',
      'glass-scrim': 'rgba(4,40,28,0.45)',
      'glass-indicator': 'rgba(4,90,60,0.18)',
      'glass-scroll-thumb': 'rgba(4,60,40,0.60)',
      'glass-scroll-thumb-hover': 'rgba(4,60,40,0.78)',
      'glass-scroll-track': 'rgba(4,60,40,0.08)',
      'glass-progress': '#047857',
      'glass-progress-glow': 'none',
      'glass-positive': '#047857',
      'glass-negative': '#b3261e',
      'glass-page-bg': 'linear-gradient(135deg, #ecfdf5, #d9f2e4)',
      'glass-page-text': '#04291b',
      'glass-chrome-bg': 'rgba(233,250,242,0.86)',
      'glass-chrome-border': 'rgba(4,90,60,0.18)',
      'glass-chart-surface': '#f4fcf8',
      'glass-grid': '#dceee6',
      'glass-series-1': '#06b472',
      'glass-series-2': '#539fff',
      'glass-series-3': '#b18600',
      'glass-series-4': '#d677c5',
      'glass-series-5': '#a22000',
      'glass-series-6': '#ff6a65',
    },
  },
  pixel: {
    dark: {
      'glass-bg': '#3b4a7a',
      'glass-border': '#000000',
      'glass-hover': '#4f6196',
      'glass-text': '#fff1e8',
      'glass-text-muted': '#c2c3c7',
      'glass-text-dim': '#a09cb5',
      'accent-warm': '#ffec27',
      'glass-accent-text': '#000000',
      'glass-shadow': '4px 4px 0 #000000',
      'glass-elevation': '4px 4px 0 #000000',
      'glass-scrim': 'rgba(0,0,0,0.82)',
      'glass-indicator': '#1d2b53',
      'glass-scroll-thumb': '#c2c3c7',
      'glass-scroll-thumb-hover': '#ffec27',
      'glass-scroll-track': '#1d2b53',
      'glass-progress': '#00e436',
      'glass-progress-glow': 'none',
      'glass-positive': '#00e436',
      'glass-negative': '#ff77a8',
      'glass-page-bg': '#1d2b53',
      'glass-page-text': '#fff1e8',
      'glass-chrome-bg': '#000000',
      'glass-chrome-border': '#000000',
      'glass-chart-surface': '#0d0d1a',
      'glass-grid': '#24243d',
      'glass-series-1': '#0065b2',
      'glass-series-2': '#9b4600',
      'glass-series-3': '#009f00',
      'glass-series-4': '#de5a8c',
      'glass-series-5': '#a59100',
      'glass-series-6': '#c0002b',
    },
    light: {
      'glass-bg': '#ffffff',
      'glass-border': '#000000',
      'glass-hover': '#ffec27',
      'glass-text': '#000000',
      'glass-text-muted': '#4a453f',
      'glass-text-dim': '#6d6660',
      'accent-warm': '#d1003f',
      'glass-accent-text': '#ffffff',
      'glass-shadow': '4px 4px 0 #000000',
      'glass-elevation': '4px 4px 0 #000000',
      'glass-scrim': 'rgba(29,43,83,0.7)',
      'glass-indicator': '#ffec27',
      'glass-scroll-thumb': '#5f574f',
      'glass-scroll-thumb-hover': '#d1003f',
      'glass-scroll-track': '#e8dcd2',
      'glass-progress': '#008751',
      'glass-progress-glow': 'none',
      'glass-positive': '#008751',
      'glass-negative': '#a3002f',
      'glass-page-bg': '#fff1e8',
      'glass-page-text': '#000000',
      'glass-chrome-bg': '#ffffff',
      'glass-chrome-border': '#000000',
      'glass-chart-surface': '#ffffff',
      'glass-grid': '#e6ded4',
      'glass-series-1': '#3dbbff',
      'glass-series-2': '#ee9300',
      'glass-series-3': '#cb0033',
      'glass-series-4': '#00ca00',
      'glass-series-5': '#f06a9b',
      'glass-series-6': '#a89400',
    },
  },
  office: {
    dark: {
      'glass-bg': '#1b222b',
      'glass-border': '#333e4a',
      'glass-hover': '#242d38',
      'glass-text': '#e6ebf1',
      'glass-text-muted': '#a3b1c0',
      'glass-text-dim': '#7e8c9b',
      'accent-warm': '#5b9fe3',
      'glass-accent-text': '#06121f',
      'glass-shadow': '0 1px 3px rgba(0,0,0,0.55)',
      'glass-elevation': '0 1px 2px rgba(0,0,0,0.4)',
      'glass-scrim': 'rgba(4,8,12,0.6)',
      'glass-indicator': '#2f3a47',
      'glass-scroll-thumb': '#68768a',
      'glass-scroll-thumb-hover': '#8695a8',
      'glass-scroll-track': '#1b222b',
      'glass-progress': '#5b9fe3',
      'glass-progress-glow': 'none',
      'glass-positive': '#5ec98a',
      'glass-negative': '#f0757a',
      'glass-page-bg': '#12171d',
      'glass-page-text': '#e6ebf1',
      'glass-chrome-bg': '#1b222b',
      'glass-chrome-border': '#333e4a',
      'glass-chart-surface': '#1b222b',
      'glass-grid': '#2b3440',
      'glass-series-1': '#196ac7',
      'glass-series-2': '#cf4e12',
      'glass-series-3': '#584cba',
      'glass-series-4': '#ba7100',
      'glass-series-5': '#009c69',
      'glass-series-6': '#a23c67',
    },
    light: {
      'glass-bg': '#ffffff',
      'glass-border': '#cbd3dd',
      'glass-hover': '#f1f4f8',
      'glass-text': '#1f2933',
      'glass-text-muted': '#5c6b7a',
      'glass-text-dim': '#788695',
      'accent-warm': '#2f6fb0',
      'glass-accent-text': '#ffffff',
      'glass-shadow': '0 1px 3px rgba(16,24,40,0.10)',
      'glass-elevation': '0 1px 2px rgba(16,24,40,0.06)',
      'glass-scrim': 'rgba(16,24,40,0.40)',
      'glass-indicator': '#dde4ec',
      'glass-scroll-thumb': '#7a8794',
      'glass-scroll-thumb-hover': '#5c6b7a',
      'glass-scroll-track': '#e7ebf0',
      'glass-progress': '#2f6fb0',
      'glass-progress-glow': 'none',
      'glass-positive': '#15803d',
      'glass-negative': '#c02626',
      'glass-page-bg': '#eef1f5',
      'glass-page-text': '#1f2933',
      'glass-chrome-bg': '#ffffff',
      'glass-chrome-border': '#d5dae1',
      'glass-chart-surface': '#ffffff',
      'glass-grid': '#e4e8ee',
      'glass-series-1': '#004ea9',
      'glass-series-2': '#ff8552',
      'glass-series-3': '#008755',
      'glass-series-4': '#eba000',
      'glass-series-5': '#ce648d',
      'glass-series-6': '#4c3ca9',
    },
  },
};

/** Geometry shared by every family unless a family patches it. */
export const BASE_GEOMETRY: ThemeTokens = {
  'glass-blur': '12px',
  'glass-backdrop': 'blur(var(--glass-blur))',
  'glass-scrim-backdrop': 'blur(4px)',
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
  'glass-font': 'sans-serif',
  'glass-press': 'scale(0.97)',
  'glass-scroll-size': '9px',
  'glass-scroll-radius': '5px',
};

/** Resolve one family x mode into a complete token set. */
export function resolveTheme(family: Family, mode: Mode): ThemeTokens {
  return { ...BASE_GEOMETRY, ...FAMILY_GEOMETRY[family], ...FAMILY_COLOURS[family][mode] };
}

/** The default look: glass, dark. Every generated block is a patch on this. */
export const BASE_TOKENS: ThemeTokens = resolveTheme('glass', 'dark');

/**
 * Legacy single-axis names. theme="light"/"dark" shipped in v1.0 and are
 * documented in the README, so they are pinned aliases forever. `glass` is a
 * family name and follows the OS like any other; `dark`/`light` force a mode.
 */
export const LEGACY_ALIASES: Record<string, { family: Family; mode?: Mode }> = {
  light: { family: 'glass', mode: 'light' },
  dark: { family: 'glass', mode: 'dark' },
};

const colourPart = (t: ThemeTokens): ThemeTokens =>
  Object.fromEntries(Object.entries(t).filter(([k]) => isColour(k)));

const declList = (t: ThemeTokens, pad: string) =>
  Object.entries(t).map(([k, v]) => `${pad}--${k}: ${v};`).join('\n');

const fallbackDeclList = (t: ThemeTokens, pad: string) =>
  Object.entries(t).map(([k, v]) => `${pad}--${k}: var(--owc-${k}, ${v});`).join('\n');

// A component with mode= but no theme= should follow the PAGE's family. The page
// publishes both palettes side by side, so read the mode-suffixed name and fall
// back to glass if no page theme is set.
const modeRefDeclList = (mode: Mode, pad: string) =>
  Object.entries(colourPart(resolveTheme('glass', mode)))
    .map(([k, v]) => `${pad}--${k}: var(--owc-${k}-${mode}, ${v});`).join('\n');

// Kept for backwards compatibility — these were the original public API.
export const GLASS_TOKENS = `\n${declList(BASE_TOKENS, '  ')}\n`;
export const GLASS_TOKENS_LIGHT = `\n${declList(resolveTheme('glass', 'light'), '  ')}\n`;
export const GLASS_TOKENS_PIXEL = `\n${declList(resolveTheme('pixel', 'dark'), '  ')}\n`;
export const GLASS_TOKENS_OFFICE = `\n${declList(resolveTheme('office', 'light'), '  ')}\n`;

/** Tokens in `t` that differ from the dark-glass base — the historical "overrides" shape. */
const diffFromBase = (t: ThemeTokens): ThemeTokens =>
  Object.fromEntries(Object.entries(t).filter(([k, v]) => BASE_TOKENS[k] !== v));

// The v1.6 single-axis override maps. Kept so the export surface never shrinks;
// each is the patch for the mode that name historically meant.
export const LIGHT_OVERRIDES: ThemeTokens = diffFromBase(resolveTheme('glass', 'light'));
export const PIXEL_OVERRIDES: ThemeTokens = diffFromBase(resolveTheme('pixel', 'dark'));
export const OFFICE_OVERRIDES: ThemeTokens = diffFromBase(resolveTheme('office', 'light'));

/** Every selectable theme name, mapped to its complete dark-mode token set. */
export const THEMES: Record<string, ThemeTokens> = {
  light: resolveTheme('glass', 'light'),
  pixel: resolveTheme('pixel', 'dark'),
  office: resolveTheme('office', 'dark'),
};

/** Theme attribute values, mapped to a family and (for legacy names) a pinned mode. */
type ThemeSpec = { family: Family; forced?: Mode };
const THEME_SPECS: Record<string, ThemeSpec> = {
  ...Object.fromEntries(FAMILIES.map(f => [f, { family: f } as ThemeSpec])),
  ...Object.fromEntries(
    Object.entries(LEGACY_ALIASES).map(([n, a]) => [n, { family: a.family, forced: a.mode }]),
  ),
};

/**
 * The <style> preamble every component injects into its shadow root.
 *
 * Order matters. Blocks are emitted least- to most-specific, and the
 * prefers-color-scheme block is guarded with :not([mode]) so an explicit mode
 * can never lose to the media query — a media query adds no specificity, so
 * without the guard the two would tie and source order would decide.
 */
export function glassBaseStyles(): string {
  const out: string[] = [];

  // Defaults, indirected so a page theme can reach through the shadow boundary.
  out.push(`    :host {\n${fallbackDeclList(BASE_TOKENS, '      ')}\n    }`);

  // No attributes at all: follow the OS.
  out.push(
    `    @media (prefers-color-scheme: light) {\n` +
    `      :host(:not([mode]):not([theme])) {\n` +
    `${fallbackDeclList(colourPart(resolveTheme('glass', 'light')), '        ')}\n` +
    `      }\n    }`,
  );

  // mode= without theme=: keep the page's family, swap only its palette.
  for (const mode of MODES) {
    out.push(
      `    :host([mode="${mode}"]:not([theme])) {\n${modeRefDeclList(mode, '      ')}\n    }`,
    );
  }

  // An explicit theme= is self-contained: the page must not reach in.
  for (const [name, spec] of Object.entries(THEME_SPECS)) {
    const base = spec.forced ?? 'dark';
    out.push(
      `    :host([theme="${name}"]) {\n${declList(resolveTheme(spec.family, base), '      ')}\n    }`,
    );
    if (!spec.forced) {
      out.push(
        `    @media (prefers-color-scheme: light) {\n` +
        `      :host([theme="${name}"]:not([mode])) {\n` +
        `${declList(colourPart(resolveTheme(spec.family, 'light')), '        ')}\n` +
        `      }\n    }`,
      );
    }
    for (const mode of MODES) {
      if (mode === base) continue;
      out.push(
        `    :host([theme="${name}"][mode="${mode}"]) {\n` +
        `${declList(colourPart(resolveTheme(spec.family, mode)), '      ')}\n    }`,
      );
    }
  }
  return `\n${out.join('\n')}\n  `;
}

// A token value may itself reference another token (e.g. glass-backdrop uses
// var(--glass-blur)). At page level only the --owc-* names exist, and a custom
// property's var()s resolve in the scope where it is declared — so rewrite the
// references or they would compute to invalid on <body>.
const toPageScope = (v: string) => v.replace(/var\(--glass-/g, 'var(--owc-glass-');

const pageDeclList = (t: ThemeTokens, pad = '  ') =>
  Object.entries(t).map(([k, v]) => `${pad}--owc-${k}: ${toPageScope(v)};`).join('\n');

// Publish a palette under mode-suffixed names, so a child's mode= can reach it.
const pageModeDeclList = (t: ThemeTokens, mode: Mode, pad = '  ') =>
  Object.entries(colourPart(t)).map(([k, v]) => `${pad}--owc-${k}-${mode}: ${toPageScope(v)};`).join('\n');

// Point the resolved names at one of the two published palettes.
const pageResolveList = (mode: Mode, pad = '  ') =>
  (COLOUR_TOKENS as readonly string[])
    .map(k => `${pad}--owc-${k}: var(--owc-${k}-${mode});`).join('\n');

/** Document-level CSS backing <body data-owc-theme="..." data-owc-mode="...">. */
export function globalThemeCSS(): string {
  const out: string[] = [];

  for (const [name, spec] of Object.entries(THEME_SPECS)) {
    // :root carries the glass family so page chrome has tokens with no attribute set.
    const sel = name === 'glass'
      ? `:root, [data-owc-theme="${name}"]`
      : `[data-owc-theme="${name}"]`;
    const base = spec.forced ?? 'dark';
    out.push(
      `${sel} {\n` +
      `${pageModeDeclList(resolveTheme(spec.family, 'dark'), 'dark')}\n` +
      `${pageModeDeclList(resolveTheme(spec.family, 'light'), 'light')}\n` +
      `${pageDeclList({ ...BASE_GEOMETRY, ...FAMILY_GEOMETRY[spec.family] })}\n` +
      `${pageResolveList(base)}\n}`,
    );
    if (!spec.forced) {
      const q = name === 'glass'
        ? `:root:not([data-owc-mode]), [data-owc-theme="${name}"]:not([data-owc-mode])`
        : `[data-owc-theme="${name}"]:not([data-owc-mode])`;
      out.push(`@media (prefers-color-scheme: light) {\n${q} {\n${pageResolveList('light', '    ')}\n}\n}`);
    }
    for (const mode of MODES) {
      out.push(
        `[data-owc-theme="${name}"][data-owc-mode="${mode}"] {\n${pageResolveList(mode)}\n}`,
      );
    }
  }

  // Family-agnostic: data-owc-mode alone swaps whichever palette is inherited.
  for (const mode of MODES) {
    out.push(`[data-owc-mode="${mode}"] {\n${pageResolveList(mode)}\n}`);
  }
  return out.join('\n');
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

/**
 * Scrollbars for a scrolling element. Colours come from the glass tokens, so they
 * follow the theme — the previous hard-coded white-on-white was invisible in light
 * themes, which read as "this panel has no scrollbar".
 *
 * Styling ::-webkit-scrollbar also opts out of macOS overlay scrollbars, so the
 * bar stays visible instead of fading out after scrolling stops. Both axes are
 * sized, so horizontal overflow gets a visible bar too.
 */
export function glassScrollbarStyles(selector = ':host', prefix = '--glass'): string {
  return `
    /* Firefox */
    ${selector} {
      scrollbar-width: thin;
      scrollbar-color: var(${prefix}-scroll-thumb) var(${prefix}-scroll-track);
    }
    /* Webkit (Chrome, Safari, Edge) */
    ${selector}::-webkit-scrollbar {
      width: var(${prefix}-scroll-size);
      height: var(${prefix}-scroll-size);
    }
    ${selector}::-webkit-scrollbar-track {
      background: var(${prefix}-scroll-track);
      border-radius: var(${prefix}-scroll-radius);
    }
    ${selector}::-webkit-scrollbar-thumb {
      background: var(${prefix}-scroll-thumb);
      border-radius: var(${prefix}-scroll-radius);
      transition: background 0.2s;
    }
    ${selector}::-webkit-scrollbar-thumb:hover {
      background: var(${prefix}-scroll-thumb-hover);
    }
    ${selector}::-webkit-scrollbar-corner { background: transparent; }
  `;
}

/**
 * Same scrollbar rules for light-DOM (page) elements. Components read
 * --glass-* inside their shadow root; the page reads the --owc-glass-*
 * values published by installGlobalThemeStyles(), so only the prefix differs.
 */
export function pageScrollbarStyles(selector: string): string {
  return glassScrollbarStyles(selector, '--owc-glass');
}


export class GlassElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
