(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // src/index.ts
  var exports_src = {};
  __export(exports_src, {
    toast: () => toast,
    svgNS: () => svgNS,
    seriesVar: () => seriesVar,
    resolveTheme: () => resolveTheme,
    pageWindow: () => pageWindow,
    pageScrollbarStyles: () => pageScrollbarStyles,
    num: () => num,
    niceTicks: () => niceTicks,
    installGlobalThemeStyles: () => installGlobalThemeStyles,
    globalThemeCSS: () => globalThemeCSS,
    glassScrollbarStyles: () => glassScrollbarStyles,
    glassBaseStyles: () => glassBaseStyles,
    fmt: () => fmt,
    field: () => field,
    el: () => el,
    chartBaseStyles: () => chartBaseStyles,
    barPath: () => barPath,
    asyncPlus: () => asyncPlus,
    THEMES: () => THEMES,
    SERIES_SLOTS: () => SERIES_SLOTS,
    PIXEL_OVERRIDES: () => PIXEL_OVERRIDES,
    OWCToast: () => OWCToast,
    OTreeNode: () => OTreeNode,
    OTree: () => OTree,
    OTooltip: () => OTooltip,
    OToggle: () => OToggle,
    OTabs: () => OTabs,
    OTable: () => OTable,
    OSkeleton: () => OSkeleton,
    OSidebar: () => OSidebar,
    OSearch: () => OSearch,
    OScroll: () => OScroll,
    OProgress: () => OProgress,
    OPie: () => OPie,
    OPaginator: () => OPaginator,
    OLine: () => OLine,
    OInput: () => OInput,
    OFFICE_OVERRIDES: () => OFFICE_OVERRIDES,
    ODropdown: () => ODropdown,
    ODropZone: () => ODropZone,
    OCollapseGroup: () => OCollapseGroup,
    OCollapse: () => OCollapse,
    OChartElement: () => OChartElement,
    OBar: () => OBar,
    MODES: () => MODES,
    LIGHT_OVERRIDES: () => LIGHT_OVERRIDES,
    LEGACY_ALIASES: () => LEGACY_ALIASES,
    GlassElement: () => GlassElement,
    GLOBAL_THEME_STYLE_ID: () => GLOBAL_THEME_STYLE_ID,
    GLASS_TOKENS_PIXEL: () => GLASS_TOKENS_PIXEL,
    GLASS_TOKENS_OFFICE: () => GLASS_TOKENS_OFFICE,
    GLASS_TOKENS_LIGHT: () => GLASS_TOKENS_LIGHT,
    GLASS_TOKENS: () => GLASS_TOKENS,
    FAMILY_GEOMETRY: () => FAMILY_GEOMETRY,
    FAMILY_COLOURS: () => FAMILY_COLOURS,
    FAMILIES: () => FAMILIES,
    COLOUR_TOKENS: () => COLOUR_TOKENS,
    BASE_TOKENS: () => BASE_TOKENS,
    BASE_GEOMETRY: () => BASE_GEOMETRY
  });

  // src/glass.ts
  var MODES = ["light", "dark"];
  var FAMILIES = ["glass", "pixel", "office"];
  var COLOUR_TOKENS = [
    "glass-bg",
    "glass-border",
    "glass-hover",
    "glass-text",
    "glass-text-muted",
    "glass-text-dim",
    "accent-warm",
    "glass-accent-text",
    "glass-shadow",
    "glass-elevation",
    "glass-scrim",
    "glass-indicator",
    "glass-scroll-thumb",
    "glass-scroll-thumb-hover",
    "glass-scroll-track",
    "glass-progress",
    "glass-progress-glow",
    "glass-positive",
    "glass-negative",
    "glass-page-bg",
    "glass-page-text",
    "glass-chrome-bg",
    "glass-chrome-border",
    "glass-chart-surface",
    "glass-grid",
    "glass-table-line",
    "glass-series-1",
    "glass-series-2",
    "glass-series-3",
    "glass-series-4",
    "glass-series-5",
    "glass-series-6"
  ];
  var isColour = (k) => COLOUR_TOKENS.includes(k);
  var FAMILY_GEOMETRY = {
    glass: {},
    pixel: {
      "glass-blur": "0px",
      "glass-backdrop": "none",
      "glass-scrim-backdrop": "none",
      "glass-border-width": "3px",
      "glass-radius-xs": "0",
      "glass-radius-sm": "0",
      "glass-radius-md": "0",
      "glass-radius-tab": "0",
      "glass-radius-lg": "0",
      "glass-radius": "0",
      "glass-radius-xl": "0",
      "glass-radius-2xl": "0",
      "glass-radius-pill": "0",
      "glass-font": "ui-monospace, 'Courier New', Courier, monospace",
      "glass-press": "translate(4px, 4px)",
      "glass-scroll-size": "12px",
      "glass-scroll-radius": "0"
    },
    office: {
      "glass-blur": "0px",
      "glass-backdrop": "none",
      "glass-scrim-backdrop": "none",
      "glass-border-width": "1px",
      "glass-radius-xs": "2px",
      "glass-radius-sm": "2px",
      "glass-radius-md": "3px",
      "glass-radius-tab": "3px",
      "glass-radius-lg": "3px",
      "glass-radius": "4px",
      "glass-radius-xl": "4px",
      "glass-radius-2xl": "6px",
      "glass-radius-pill": "999px",
      "glass-font": "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      "glass-press": "none",
      "glass-scroll-size": "10px",
      "glass-scroll-radius": "2px"
    }
  };
  var FAMILY_COLOURS = {
    glass: {
      dark: {
        "glass-bg": "rgba(255,255,255,0.07)",
        "glass-border": "rgba(255,255,255,0.12)",
        "glass-hover": "rgba(255,255,255,0.1)",
        "glass-text": "#fff",
        "glass-text-muted": "rgba(255,255,255,0.78)",
        "glass-text-dim": "rgba(255,255,255,0.56)",
        "accent-warm": "rgba(251,191,36,0.92)",
        "glass-accent-text": "#1a1200",
        "glass-shadow": "0 8px 32px rgba(0,0,0,0.3)",
        "glass-elevation": "none",
        "glass-scrim": "rgba(0,0,0,0.5)",
        "glass-indicator": "rgba(255,255,255,0.12)",
        "glass-scroll-thumb": "rgba(255,255,255,0.62)",
        "glass-scroll-thumb-hover": "rgba(255,255,255,0.8)",
        "glass-scroll-track": "rgba(255,255,255,0.06)",
        "glass-progress": "rgba(74,222,128,0.85)",
        "glass-progress-glow": "0 0 8px rgba(74,222,128,0.5)",
        "glass-positive": "rgba(74,222,128,0.9)",
        "glass-negative": "#ffb4ab",
        "glass-page-bg": "linear-gradient(135deg, #059669, #065f46)",
        "glass-page-text": "#ffffff",
        "glass-chrome-bg": "rgba(3,54,25,0.78)",
        "glass-chrome-border": "rgba(255,255,255,0.1)",
        "glass-chart-surface": "#0a2c20",
        "glass-grid": "#16402f",
        "glass-table-line": "rgba(255,255,255,0.53)",
        "glass-series-1": "#009e5e",
        "glass-series-2": "#a44996",
        "glass-series-3": "#ad8300",
        "glass-series-4": "#c2262d",
        "glass-series-5": "#3c89e9",
        "glass-series-6": "#c84704"
      },
      light: {
        "glass-bg": "rgba(255,255,255,0.62)",
        "glass-border": "rgba(4,90,60,0.22)",
        "glass-hover": "rgba(255,255,255,0.82)",
        "glass-text": "#04291b",
        "glass-text-muted": "#2c5c48",
        "glass-text-dim": "#4a7d67",
        "accent-warm": "#046b47",
        "glass-accent-text": "#ffffff",
        "glass-shadow": "0 8px 32px rgba(4,60,40,0.12)",
        "glass-elevation": "none",
        "glass-scrim": "rgba(4,40,28,0.45)",
        "glass-indicator": "rgba(4,90,60,0.18)",
        "glass-scroll-thumb": "rgba(4,60,40,0.60)",
        "glass-scroll-thumb-hover": "rgba(4,60,40,0.78)",
        "glass-scroll-track": "rgba(4,60,40,0.08)",
        "glass-progress": "#047857",
        "glass-progress-glow": "none",
        "glass-positive": "#047857",
        "glass-negative": "#b3261e",
        "glass-page-bg": "linear-gradient(135deg, #ecfdf5, #d9f2e4)",
        "glass-page-text": "#04291b",
        "glass-chrome-bg": "rgba(233,250,242,0.86)",
        "glass-chrome-border": "rgba(4,90,60,0.18)",
        "glass-chart-surface": "#f4fcf8",
        "glass-grid": "#dceee6",
        "glass-table-line": "rgba(4,41,27,0.49)",
        "glass-series-1": "#06b472",
        "glass-series-2": "#539fff",
        "glass-series-3": "#b18600",
        "glass-series-4": "#d677c5",
        "glass-series-5": "#a22000",
        "glass-series-6": "#ff6a65"
      }
    },
    pixel: {
      dark: {
        "glass-bg": "#3b4a7a",
        "glass-border": "#000000",
        "glass-hover": "#4f6196",
        "glass-text": "#fff1e8",
        "glass-text-muted": "#c2c3c7",
        "glass-text-dim": "#a09cb5",
        "accent-warm": "#ffec27",
        "glass-accent-text": "#000000",
        "glass-shadow": "4px 4px 0 #000000",
        "glass-elevation": "4px 4px 0 #000000",
        "glass-scrim": "rgba(0,0,0,0.82)",
        "glass-indicator": "#1d2b53",
        "glass-scroll-thumb": "#c2c3c7",
        "glass-scroll-thumb-hover": "#ffec27",
        "glass-scroll-track": "#1d2b53",
        "glass-progress": "#00e436",
        "glass-progress-glow": "none",
        "glass-positive": "#00e436",
        "glass-negative": "#ff77a8",
        "glass-page-bg": "#1d2b53",
        "glass-page-text": "#fff1e8",
        "glass-chrome-bg": "#000000",
        "glass-chrome-border": "#000000",
        "glass-chart-surface": "#0d0d1a",
        "glass-grid": "#24243d",
        "glass-table-line": "#c2c3c7",
        "glass-series-1": "#0065b2",
        "glass-series-2": "#9b4600",
        "glass-series-3": "#009f00",
        "glass-series-4": "#de5a8c",
        "glass-series-5": "#a59100",
        "glass-series-6": "#c0002b"
      },
      light: {
        "glass-bg": "#ffffff",
        "glass-border": "#000000",
        "glass-hover": "#ffec27",
        "glass-text": "#000000",
        "glass-text-muted": "#4a453f",
        "glass-text-dim": "#6d6660",
        "accent-warm": "#d1003f",
        "glass-accent-text": "#ffffff",
        "glass-shadow": "4px 4px 0 #000000",
        "glass-elevation": "4px 4px 0 #000000",
        "glass-scrim": "rgba(29,43,83,0.7)",
        "glass-indicator": "#ffec27",
        "glass-scroll-thumb": "#5f574f",
        "glass-scroll-thumb-hover": "#d1003f",
        "glass-scroll-track": "#e8dcd2",
        "glass-progress": "#008751",
        "glass-progress-glow": "none",
        "glass-positive": "#008751",
        "glass-negative": "#a3002f",
        "glass-page-bg": "#fff1e8",
        "glass-page-text": "#000000",
        "glass-chrome-bg": "#ffffff",
        "glass-chrome-border": "#000000",
        "glass-chart-surface": "#ffffff",
        "glass-grid": "#e6ded4",
        "glass-table-line": "#83769c",
        "glass-series-1": "#3dbbff",
        "glass-series-2": "#ee9300",
        "glass-series-3": "#cb0033",
        "glass-series-4": "#00ca00",
        "glass-series-5": "#f06a9b",
        "glass-series-6": "#a89400"
      }
    },
    office: {
      dark: {
        "glass-bg": "#1b222b",
        "glass-border": "#333e4a",
        "glass-hover": "#242d38",
        "glass-text": "#e6ebf1",
        "glass-text-muted": "#a3b1c0",
        "glass-text-dim": "#7e8c9b",
        "accent-warm": "#5b9fe3",
        "glass-accent-text": "#06121f",
        "glass-shadow": "0 1px 3px rgba(0,0,0,0.55)",
        "glass-elevation": "0 1px 2px rgba(0,0,0,0.4)",
        "glass-scrim": "rgba(4,8,12,0.6)",
        "glass-indicator": "#2f3a47",
        "glass-scroll-thumb": "#68768a",
        "glass-scroll-thumb-hover": "#8695a8",
        "glass-scroll-track": "#1b222b",
        "glass-progress": "#5b9fe3",
        "glass-progress-glow": "none",
        "glass-positive": "#5ec98a",
        "glass-negative": "#f0757a",
        "glass-page-bg": "#12171d",
        "glass-page-text": "#e6ebf1",
        "glass-chrome-bg": "#1b222b",
        "glass-chrome-border": "#333e4a",
        "glass-chart-surface": "#1b222b",
        "glass-grid": "#2b3440",
        "glass-table-line": "#657483",
        "glass-series-1": "#196ac7",
        "glass-series-2": "#cf4e12",
        "glass-series-3": "#584cba",
        "glass-series-4": "#ba7100",
        "glass-series-5": "#009c69",
        "glass-series-6": "#a23c67"
      },
      light: {
        "glass-bg": "#ffffff",
        "glass-border": "#cbd3dd",
        "glass-hover": "#f1f4f8",
        "glass-text": "#1f2933",
        "glass-text-muted": "#5c6b7a",
        "glass-text-dim": "#788695",
        "accent-warm": "#2f6fb0",
        "glass-accent-text": "#ffffff",
        "glass-shadow": "0 1px 3px rgba(16,24,40,0.10)",
        "glass-elevation": "0 1px 2px rgba(16,24,40,0.06)",
        "glass-scrim": "rgba(16,24,40,0.40)",
        "glass-indicator": "#dde4ec",
        "glass-scroll-thumb": "#7a8794",
        "glass-scroll-thumb-hover": "#5c6b7a",
        "glass-scroll-track": "#e7ebf0",
        "glass-progress": "#2f6fb0",
        "glass-progress-glow": "none",
        "glass-positive": "#15803d",
        "glass-negative": "#c02626",
        "glass-page-bg": "#eef1f5",
        "glass-page-text": "#1f2933",
        "glass-chrome-bg": "#ffffff",
        "glass-chrome-border": "#d5dae1",
        "glass-chart-surface": "#ffffff",
        "glass-grid": "#e4e8ee",
        "glass-table-line": "#8a949f",
        "glass-series-1": "#004ea9",
        "glass-series-2": "#ff8552",
        "glass-series-3": "#008755",
        "glass-series-4": "#eba000",
        "glass-series-5": "#ce648d",
        "glass-series-6": "#4c3ca9"
      }
    }
  };
  var BASE_GEOMETRY = {
    "glass-blur": "12px",
    "glass-backdrop": "blur(var(--glass-blur))",
    "glass-scrim-backdrop": "blur(4px)",
    "glass-border-width": "1px",
    "glass-radius-xs": "3px",
    "glass-radius-sm": "4px",
    "glass-radius-md": "6px",
    "glass-radius-tab": "7px",
    "glass-radius-lg": "8px",
    "glass-radius": "10px",
    "glass-radius-xl": "12px",
    "glass-radius-2xl": "16px",
    "glass-radius-pill": "999px",
    "glass-font": "sans-serif",
    "glass-press": "scale(0.97)",
    "glass-scroll-size": "9px",
    "glass-scroll-radius": "5px"
  };
  function resolveTheme(family, mode) {
    return { ...BASE_GEOMETRY, ...FAMILY_GEOMETRY[family], ...FAMILY_COLOURS[family][mode] };
  }
  var BASE_TOKENS = resolveTheme("glass", "dark");
  var LEGACY_ALIASES = {
    light: { family: "glass", mode: "light" },
    dark: { family: "glass", mode: "dark" }
  };
  var colourPart = (t) => Object.fromEntries(Object.entries(t).filter(([k]) => isColour(k)));
  var declList = (t, pad) => Object.entries(t).map(([k, v]) => `${pad}--${k}: ${v};`).join(`
`);
  var fallbackDeclList = (t, pad) => Object.entries(t).map(([k, v]) => `${pad}--${k}: var(--owc-${k}, ${v});`).join(`
`);
  var modeRefDeclList = (mode, pad) => Object.entries(colourPart(resolveTheme("glass", mode))).map(([k, v]) => `${pad}--${k}: var(--owc-${k}-${mode}, ${v});`).join(`
`);
  var GLASS_TOKENS = `
${declList(BASE_TOKENS, "  ")}
`;
  var GLASS_TOKENS_LIGHT = `
${declList(resolveTheme("glass", "light"), "  ")}
`;
  var GLASS_TOKENS_PIXEL = `
${declList(resolveTheme("pixel", "dark"), "  ")}
`;
  var GLASS_TOKENS_OFFICE = `
${declList(resolveTheme("office", "light"), "  ")}
`;
  var diffFromBase = (t) => Object.fromEntries(Object.entries(t).filter(([k, v]) => BASE_TOKENS[k] !== v));
  var LIGHT_OVERRIDES = diffFromBase(resolveTheme("glass", "light"));
  var PIXEL_OVERRIDES = diffFromBase(resolveTheme("pixel", "dark"));
  var OFFICE_OVERRIDES = diffFromBase(resolveTheme("office", "light"));
  var THEMES = {
    light: resolveTheme("glass", "light"),
    pixel: resolveTheme("pixel", "dark"),
    office: resolveTheme("office", "dark")
  };
  var THEME_SPECS = {
    ...Object.fromEntries(FAMILIES.map((f) => [f, { family: f }])),
    ...Object.fromEntries(Object.entries(LEGACY_ALIASES).map(([n, a]) => [n, { family: a.family, forced: a.mode }]))
  };
  function glassBaseStyles() {
    const out = [];
    out.push(`    :host {
${fallbackDeclList(BASE_TOKENS, "      ")}
    }`);
    out.push(`    @media (prefers-color-scheme: light) {
` + `      :host(:not([mode]):not([theme])) {
` + `${fallbackDeclList(colourPart(resolveTheme("glass", "light")), "        ")}
` + `      }
    }`);
    for (const mode of MODES) {
      out.push(`    :host([mode="${mode}"]:not([theme])) {
${modeRefDeclList(mode, "      ")}
    }`);
    }
    for (const [name, spec] of Object.entries(THEME_SPECS)) {
      const base = spec.forced ?? "dark";
      out.push(`    :host([theme="${name}"]) {
${declList(resolveTheme(spec.family, base), "      ")}
    }`);
      if (!spec.forced) {
        out.push(`    @media (prefers-color-scheme: light) {
` + `      :host([theme="${name}"]:not([mode])) {
` + `${declList(colourPart(resolveTheme(spec.family, "light")), "        ")}
` + `      }
    }`);
      }
      for (const mode of MODES) {
        if (mode === base)
          continue;
        out.push(`    :host([theme="${name}"][mode="${mode}"]) {
` + `${declList(colourPart(resolveTheme(spec.family, mode)), "      ")}
    }`);
      }
    }
    return `
${out.join(`
`)}
  `;
  }
  var toPageScope = (v) => v.replace(/var\(--glass-/g, "var(--owc-glass-");
  var pageDeclList = (t, pad = "  ") => Object.entries(t).map(([k, v]) => `${pad}--owc-${k}: ${toPageScope(v)};`).join(`
`);
  var pageModeDeclList = (t, mode, pad = "  ") => Object.entries(colourPart(t)).map(([k, v]) => `${pad}--owc-${k}-${mode}: ${toPageScope(v)};`).join(`
`);
  var pageResolveList = (mode, pad = "  ") => COLOUR_TOKENS.map((k) => `${pad}--owc-${k}: var(--owc-${k}-${mode});`).join(`
`);
  function globalThemeCSS() {
    const out = [];
    for (const [name, spec] of Object.entries(THEME_SPECS)) {
      const sel = name === "glass" ? `:root, [data-owc-theme="${name}"]` : `[data-owc-theme="${name}"]`;
      const base = spec.forced ?? "dark";
      out.push(`${sel} {
` + `${pageModeDeclList(resolveTheme(spec.family, "dark"), "dark")}
` + `${pageModeDeclList(resolveTheme(spec.family, "light"), "light")}
` + `${pageDeclList({ ...BASE_GEOMETRY, ...FAMILY_GEOMETRY[spec.family] })}
` + `${pageResolveList(base)}
}`);
      if (!spec.forced) {
        const q = name === "glass" ? `:root:not([data-owc-mode]), [data-owc-theme="${name}"]:not([data-owc-mode])` : `[data-owc-theme="${name}"]:not([data-owc-mode])`;
        out.push(`@media (prefers-color-scheme: light) {
${q} {
${pageResolveList("light", "    ")}
}
}`);
      }
      for (const mode of MODES) {
        out.push(`[data-owc-theme="${name}"][data-owc-mode="${mode}"] {
${pageResolveList(mode)}
}`);
      }
    }
    for (const mode of MODES) {
      out.push(`[data-owc-mode="${mode}"] {
${pageResolveList(mode)}
}`);
    }
    return out.join(`
`);
  }
  var GLOBAL_THEME_STYLE_ID = "owc-global-themes";
  function installGlobalThemeStyles(doc) {
    const d = doc ?? (typeof document !== "undefined" ? document : undefined);
    if (!d?.head)
      return false;
    if (d.getElementById(GLOBAL_THEME_STYLE_ID))
      return false;
    const style = d.createElement("style");
    style.id = GLOBAL_THEME_STYLE_ID;
    style.textContent = globalThemeCSS();
    d.head.appendChild(style);
    return true;
  }
  function glassScrollbarStyles(selector = ":host", prefix = "--glass") {
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
  function pageScrollbarStyles(selector) {
    return glassScrollbarStyles(selector, "--owc-glass");
  }

  class GlassElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  }

  // src/core.ts
  console.log("Open Web Components (OWC) Core Module Loaded - René Oun");
  var OVERLAY_COLORS = {
    dark: {
      gridMinor: "rgba(255,255,255,0.22)",
      gridMajor: "rgba(255,255,255,0.40)",
      zoneLine: "rgba(251,191,36,0.85)",
      zoneFill: "rgba(251,191,36,0.12)"
    },
    light: {
      gridMinor: "rgba(0,0,0,0.16)",
      gridMajor: "rgba(0,0,0,0.30)",
      zoneLine: "rgba(22,163,74,0.85)",
      zoneFill: "rgba(22,163,74,0.14)"
    }
  };
  var Z_GRID = 9997;
  var Z_ZONE = 9998;
  var Z_DRAGGED = 9999;
  function makeOverlay(z, kind) {
    const el = document.createElement("div");
    el.setAttribute("data-owc-overlay", kind);
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: String(z),
      transition: "opacity 160ms ease",
      opacity: "0"
    });
    document.body.appendChild(el);
    return el;
  }
  var _gridEl = null;
  var _gridFadeOut = null;
  function showSnapGrid(snap, offsetX = 0, offsetY = 0, theme = "dark") {
    if (snap < 8)
      return;
    if (_gridFadeOut) {
      clearTimeout(_gridFadeOut);
      _gridFadeOut = null;
    }
    if (!_gridEl || !_gridEl.isConnected) {
      _gridEl = makeOverlay(Z_GRID, "grid");
      _gridEl.style.inset = "0";
    }
    const c = OVERLAY_COLORS[theme];
    _gridEl.style.backgroundImage = [
      `linear-gradient(${c.gridMajor} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${c.gridMajor} 1px, transparent 1px)`,
      `linear-gradient(${c.gridMinor} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${c.gridMinor} 1px, transparent 1px)`
    ].join(",");
    _gridEl.style.backgroundSize = `${snap * 5}px ${snap * 5}px, ${snap * 5}px ${snap * 5}px, ${snap}px ${snap}px, ${snap}px ${snap}px`;
    const ox = (offsetX % snap + snap) % snap;
    const oy = (offsetY % snap + snap) % snap;
    _gridEl.style.backgroundPosition = `${ox}px ${oy}px, ${ox}px ${oy}px, ${ox}px ${oy}px, ${ox}px ${oy}px`;
    _gridEl.offsetHeight;
    _gridEl.style.opacity = "1";
  }
  function hideSnapGrid() {
    if (!_gridEl)
      return;
    _gridEl.style.opacity = "0";
    const el = _gridEl;
    _gridFadeOut = setTimeout(() => {
      el.remove();
      if (_gridEl === el)
        _gridEl = null;
      _gridFadeOut = null;
    }, 220);
  }
  var _zoneEl = null;
  var _zoneFadeOut = null;
  function showDropZone(rect, theme = "dark") {
    if (_zoneFadeOut) {
      clearTimeout(_zoneFadeOut);
      _zoneFadeOut = null;
    }
    if (!_zoneEl || !_zoneEl.isConnected)
      _zoneEl = makeOverlay(Z_ZONE, "dropzone");
    const c = OVERLAY_COLORS[theme];
    Object.assign(_zoneEl.style, {
      left: `${Math.round(rect.x)}px`,
      top: `${Math.round(rect.y)}px`,
      width: `${Math.round(rect.width)}px`,
      height: `${Math.round(rect.height)}px`,
      borderStyle: "dashed",
      borderWidth: "2px",
      borderColor: c.zoneLine,
      borderRadius: "10px",
      background: c.zoneFill,
      boxSizing: "border-box"
    });
    _zoneEl.offsetHeight;
    _zoneEl.style.opacity = "1";
  }
  function hideDropZone() {
    if (!_zoneEl)
      return;
    _zoneEl.style.opacity = "0";
    const el = _zoneEl;
    _zoneFadeOut = setTimeout(() => {
      el.remove();
      if (_zoneEl === el)
        _zoneEl = null;
      _zoneFadeOut = null;
    }, 220);
  }

  class OWCButton extends GlassElement {
    constructor() {
      super();
      this.shadowRoot.innerHTML = `
            <style>
                ${glassBaseStyles()}
                :host { display: inline-block; }
                button {
                    cursor: pointer;
                    padding: 8px 20px;
                    border-radius: var(--glass-radius);
                    border: var(--glass-border-width) solid var(--glass-border);
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-backdrop);
                    -webkit-backdrop-filter: var(--glass-backdrop);
                    color: var(--o-button-color, var(--glass-text));
                    font-size: 14px;
                    font-family: var(--glass-font);
                    box-shadow: var(--glass-elevation);
                    transition: background 0.2s, transform 0.1s;
                }
                button:hover { background: var(--glass-hover); }
                button:active { transform: var(--glass-press); }
            </style>
            <button part="button"><slot>Button</slot></button>
        `;
      this.shadowRoot.querySelector("button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("o-click", { bubbles: true, composed: true }));
      });
    }
  }
  var INTERACTIVE = "select,button,input,textarea,a,label,summary,[contenteditable]";

  class OWCPanel extends GlassElement {
    static get observedAttributes() {
      return ["move", "snap", "resize", "handle"];
    }
    dragStart = null;
    dragOffset = { x: 0, y: 0 };
    resizeStart = null;
    prevZIndex = "";
    activeHandle = null;
    handleWatcher = null;
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addEventListener("mousedown", this.onHostMouseDown);
      this.watchForHandle();
    }
    disconnectedCallback() {
      this.removeEventListener("mousedown", this.onHostMouseDown);
      this.handleWatcher?.disconnect();
      this.handleWatcher = null;
    }
    attributeChangedCallback() {
      if (this.isConnected) {
        this.render();
        this.watchForHandle();
      }
    }
    get lightHandle() {
      const sel = this.getAttribute("handle");
      return sel ? this.querySelector(sel) : null;
    }
    watchForHandle() {
      this.handleWatcher?.disconnect();
      this.handleWatcher = null;
      if (!this.getAttribute("handle") || this.lightHandle)
        return;
      this.handleWatcher = new MutationObserver(() => {
        if (this.lightHandle) {
          this.handleWatcher?.disconnect();
          this.handleWatcher = null;
          this.render();
        }
      });
      this.handleWatcher.observe(this, { childList: true, subtree: true });
    }
    onHostMouseDown = (e) => {
      if (!this.hasAttribute("move") || !this.getAttribute("handle"))
        return;
      if (this.dragStart)
        return;
      const target = e.target;
      const handle = this.lightHandle;
      if (!target || !handle)
        return;
      if (!handle.contains(target))
        return;
      if (target.closest(INTERACTIVE))
        return;
      this.activeHandle = handle;
      this.onDragStart(e);
    };
    get snapSize() {
      const v = parseInt(this.getAttribute("snap") ?? "1");
      return isNaN(v) || v < 1 ? 1 : v;
    }
    snapTo(v) {
      const s = this.snapSize;
      return Math.round(v / s) * s;
    }
    render() {
      const hasDrag = this.hasAttribute("move");
      const hasResize = this.hasAttribute("resize");
      const light = hasDrag ? this.lightHandle : null;
      const showGrip = hasDrag && !light;
      if (light) {
        light.style.cursor = "grab";
        light.style.userSelect = "none";
        light.style.webkitUserSelect = "none";
      }
      const prev = this.shadowRoot.querySelector(".panel");
      const savedW = prev?.style.width ?? "";
      const savedH = prev?.style.height ?? "";
      this.shadowRoot.innerHTML = `
            <style>
                ${glassBaseStyles()}
                :host { display: inline-block; }
                .panel {
                    /* Sizing hooks: o-dropzone (and any consumer) can size a panel
                       from outside without piercing the shadow root. Default auto
                       keeps the panel content-sized exactly as before. */
                    width: var(--o-panel-width, auto);
                    height: var(--o-panel-height, auto);
                    background: var(--glass-bg);
                    border: var(--glass-border-width) solid var(--glass-border);
                    backdrop-filter: var(--glass-backdrop);
                    -webkit-backdrop-filter: var(--glass-backdrop);
                    margin: 8px;
                    border-radius: var(--glass-radius);
                    min-width: 120px;
                    min-height: 40px;
                    position: relative;
                    color: var(--glass-text);
                    font-family: var(--glass-font);
                    font-size: 14px;
                    box-shadow: var(--glass-elevation);
                    box-sizing: border-box;
                    /* NOT the scroller: the drag/resize handles are absolutely
                       positioned in here, and children of a scrolling box scroll
                       with its content. .content scrolls instead. */
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .content {
                    padding: 16px;
                    flex: 1 1 auto;
                    min-height: 0;      /* let it shrink inside the flex column */
                    overflow: auto;
                }
                /* Keep the scrollbars clear of the resize strips, which sit on the
                   panel's right/bottom edges. */
                .panel.has-resize > .content { margin-right: 6px; margin-bottom: 6px; }
                .move-handle {
                    position: absolute; top: 6px; right: 8px;
                    background: var(--glass-hover); border: var(--glass-border-width) solid var(--glass-border);
                    color: var(--glass-text); border-radius: var(--glass-radius-md); cursor: grab; font-size: 14px;
                    padding: 2px 5px; line-height: 1;
                }
                .resize-e {
                    position: absolute; right: 0; top: 20%; bottom: 20%;
                    width: 5px; cursor: ew-resize;
                    background: var(--glass-hover); border-radius: 0 var(--glass-radius) var(--glass-radius) 0;
                    transition: background 0.15s;
                }
                .resize-s {
                    position: absolute; bottom: 0; left: 20%; right: 20%;
                    height: 5px; cursor: ns-resize;
                    background: var(--glass-hover); border-radius: 0 0 var(--glass-radius) var(--glass-radius);
                    transition: background 0.15s;
                }
                .resize-se {
                    position: absolute; right: 0; bottom: 0;
                    width: 14px; height: 14px; cursor: nwse-resize;
                    border-right: 3px solid var(--glass-border);
                    border-bottom: 3px solid var(--glass-border);
                    border-radius: 0 0 var(--glass-radius) 0;
                }
                .resize-e:hover, .resize-s:hover { background: var(--glass-border); }
                .resize-se:hover { border-color: var(--glass-text-muted); }
                ${glassScrollbarStyles(".content")}
            </style>
            <div part="panel" class="panel${hasResize ? " has-resize" : ""}" role="region">
                ${showGrip ? '<button class="move-handle" title="Drag to move">⠿</button>' : ""}
                <div class="content"><slot></slot></div>
                ${hasResize ? `
                    <div class="resize-e"  data-edge="e"></div>
                    <div class="resize-s"  data-edge="s"></div>
                    <div class="resize-se" data-edge="se"></div>
                ` : ""}
            </div>
        `;
      const panel = this.shadowRoot.querySelector(".panel");
      if (savedW)
        panel.style.width = savedW;
      if (savedH)
        panel.style.height = savedH;
      if (this.dragOffset.x || this.dragOffset.y)
        this.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`;
      if (showGrip) {
        this.shadowRoot.querySelector(".move-handle").addEventListener("mousedown", this.onDragStart);
      }
      if (hasResize) {
        this.shadowRoot.querySelectorAll("[data-edge]").forEach((el) => el.addEventListener("mousedown", this.onResizeStart));
      }
    }
    get overlayTheme() {
      if (this.getAttribute("theme") === "light")
        return "light";
      if (this.hasAttribute("theme"))
        return "dark";
      return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    panelRect() {
      const el = this.shadowRoot.querySelector(".panel");
      const r = el ? el.getBoundingClientRect() : this.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }
    emit(name, detail) {
      this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
    }
    updateDropZone(x, y) {
      let zone = this.panelRect();
      this.emit("o-drag-move", {
        x,
        y,
        rect: { ...zone },
        setDropZone: (r) => {
          zone = r;
        }
      });
      if (zone)
        showDropZone(zone, this.overlayTheme);
      else
        hideDropZone();
    }
    onDragStart = (e) => {
      e.preventDefault();
      this.activeHandle = this.activeHandle ?? (e.currentTarget instanceof HTMLElement ? e.currentTarget : null);
      if (this.activeHandle)
        this.activeHandle.style.cursor = "grabbing";
      this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
      this.prevZIndex = this.style.zIndex;
      this.style.zIndex = String(Z_DRAGGED);
      const r = this.panelRect();
      showSnapGrid(this.snapSize, r.x, r.y, this.overlayTheme);
      this.emit("o-drag-start", { x: this.dragOffset.x, y: this.dragOffset.y, rect: r });
      this.updateDropZone(this.dragOffset.x, this.dragOffset.y);
      document.addEventListener("mousemove", this.onDragMove);
      document.addEventListener("mouseup", this.onDragEnd);
    };
    onDragMove = (e) => {
      if (!this.dragStart)
        return;
      const x = this.snapTo(e.screenX - this.dragStart.x);
      const y = this.snapTo(e.screenY - this.dragStart.y);
      this.dragOffset = { x, y };
      this.style.transform = `translate(${x}px, ${y}px)`;
      this.updateDropZone(x, y);
    };
    onDragEnd = () => {
      if (!this.dragStart)
        return;
      this.dragStart = null;
      if (this.activeHandle)
        this.activeHandle.style.cursor = "grab";
      this.activeHandle = null;
      hideSnapGrid();
      hideDropZone();
      this.style.zIndex = this.prevZIndex;
      document.removeEventListener("mousemove", this.onDragMove);
      document.removeEventListener("mouseup", this.onDragEnd);
      this.emit("o-drag-end", {
        x: this.dragOffset.x,
        y: this.dragOffset.y,
        rect: this.panelRect()
      });
    };
    onResizeStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const panel = this.shadowRoot.querySelector(".panel");
      this.resizeStart = {
        x: e.screenX,
        y: e.screenY,
        w: panel.offsetWidth,
        h: panel.offsetHeight,
        edge: e.currentTarget.dataset.edge
      };
      const r = this.panelRect();
      showSnapGrid(this.snapSize, r.x, r.y, this.overlayTheme);
      showDropZone(r, this.overlayTheme);
      this.emit("o-resize-start", {
        width: this.resizeStart.w,
        height: this.resizeStart.h,
        edge: this.resizeStart.edge
      });
      document.addEventListener("mousemove", this.onResizeMove);
      document.addEventListener("mouseup", this.onResizeEnd);
    };
    onResizeMove = (e) => {
      if (!this.resizeStart)
        return;
      const panel = this.shadowRoot.querySelector(".panel");
      const dx = e.screenX - this.resizeStart.x;
      const dy = e.screenY - this.resizeStart.y;
      const { edge, w, h } = this.resizeStart;
      if (edge === "e" || edge === "se")
        panel.style.width = `${Math.max(120, this.snapTo(w + dx))}px`;
      if (edge === "s" || edge === "se")
        panel.style.height = `${Math.max(40, this.snapTo(h + dy))}px`;
      showDropZone(this.panelRect(), this.overlayTheme);
      this.emit("o-resize-move", { width: panel.offsetWidth, height: panel.offsetHeight, edge });
    };
    onResizeEnd = () => {
      if (!this.resizeStart)
        return;
      this.resizeStart = null;
      hideSnapGrid();
      hideDropZone();
      document.removeEventListener("mousemove", this.onResizeMove);
      document.removeEventListener("mouseup", this.onResizeEnd);
      const panel = this.shadowRoot.querySelector(".panel");
      this.emit("o-resize-end", {
        width: panel?.offsetWidth ?? 0,
        height: panel?.offsetHeight ?? 0
      });
    };
  }
  customElements.define("o-panel", OWCPanel);
  customElements.define("o-button", OWCButton);

  // src/paginator.ts
  function clamp(n, lo, hi) {
    return n < lo ? lo : n > hi ? hi : n;
  }
  function pageWindow(page, totalPages, siblings = 1) {
    if (totalPages <= siblings * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(2, page - siblings);
    const right = Math.min(totalPages - 1, page + siblings);
    const out = [1];
    if (left > 2)
      out.push(null);
    for (let p = left;p <= right; p++)
      out.push(p);
    if (right < totalPages - 1)
      out.push(null);
    out.push(totalPages);
    return out;
  }

  class OPaginator extends GlassElement {
    static get observedAttributes() {
      return ["total", "page-size", "page", "siblings", "compact"];
    }
    _total = 0;
    _pageSize = 10;
    _page = 1;
    get total() {
      return this._total;
    }
    set total(v) {
      this._total = Math.max(0, Math.floor(v) || 0);
      this._page = clamp(this._page, 1, this.totalPages);
      this.render();
    }
    get pageSize() {
      return this._pageSize;
    }
    set pageSize(v) {
      this._pageSize = Math.max(1, Math.floor(v) || 1);
      this._page = clamp(this._page, 1, this.totalPages);
      this.render();
    }
    get page() {
      return this._page;
    }
    set page(v) {
      const next = clamp(Math.floor(v) || 1, 1, this.totalPages);
      if (next === this._page)
        return;
      this._page = next;
      this.render();
      this.emit();
    }
    get totalPages() {
      return Math.max(1, Math.ceil(this._total / this._pageSize));
    }
    get start() {
      return this._total === 0 ? 0 : (this._page - 1) * this._pageSize;
    }
    get end() {
      return Math.min(this.start + this._pageSize, this._total);
    }
    get siblings() {
      return Math.max(0, parseInt(this.getAttribute("siblings") ?? "1") || 0);
    }
    get compact() {
      return this.hasAttribute("compact");
    }
    constructor() {
      super();
      this.shadowRoot.addEventListener("click", this.handleClick);
    }
    connectedCallback() {
      this.syncFromAttributes();
      this.render();
    }
    attributeChangedCallback() {
      if (!this.isConnected)
        return;
      this.syncFromAttributes();
      this.render();
    }
    syncFromAttributes() {
      const total = this.getAttribute("total");
      if (total != null)
        this._total = Math.max(0, parseInt(total) || 0);
      const size = this.getAttribute("page-size");
      if (size != null)
        this._pageSize = Math.max(1, parseInt(size) || 1);
      const page = this.getAttribute("page");
      if (page != null)
        this._page = parseInt(page) || 1;
      this._page = clamp(this._page, 1, this.totalPages);
    }
    emit() {
      this.dispatchEvent(new CustomEvent("o-page", {
        bubbles: true,
        composed: true,
        detail: {
          page: this._page,
          start: this.start,
          end: this.end,
          totalPages: this.totalPages,
          pageSize: this._pageSize
        }
      }));
    }
    handleClick = (e) => {
      const btn = e.target.closest("button[data-goto]");
      if (!btn || btn.hasAttribute("disabled"))
        return;
      const goto = btn.dataset.goto;
      const target = goto === "prev" ? this._page - 1 : goto === "next" ? this._page + 1 : parseInt(goto);
      this.page = target;
    };
    render() {
      if (!this.shadowRoot)
        return;
      const pages = this.totalPages;
      const atFirst = this._page <= 1;
      const atLast = this._page >= pages;
      const from = this._total === 0 ? 0 : this.start + 1;
      const to = this.end;
      const numbers = this.compact ? `<span class="of">Page ${this._page} of ${pages}</span>` : pageWindow(this._page, pages, this.siblings).map((p) => p === null ? `<span class="gap" aria-hidden="true">…</span>` : `<button class="num${p === this._page ? " active" : ""}" data-goto="${p}"${p === this._page ? ' aria-current="page"' : ""} aria-label="Page ${p}">${p}</button>`).join("");
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .pager {
          display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
          font-family: var(--glass-font); font-size: 13px;
          color: var(--glass-text);
        }
        .range { color: var(--glass-text-muted); margin-right: auto; padding: 4px 2px; }
        .of { color: var(--glass-text-muted); padding: 0 6px; }
        button {
          min-width: 30px; padding: 5px 9px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-sm);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-elevation);
          color: var(--glass-text);
          font-family: var(--glass-font); font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.05s;
        }
        button:hover:not([disabled]) { background: var(--glass-hover); }
        button:active:not([disabled]) { transform: var(--glass-press); }
        button[disabled] { opacity: 0.4; cursor: default; }
        button.active {
          background: var(--accent-warm);
          color: var(--glass-accent-text);
          border-color: var(--accent-warm);
        }
        button:focus-visible { outline: 2px solid var(--accent-warm); outline-offset: 2px; }
        .gap { color: var(--glass-text-dim); padding: 0 2px; }
      </style>
      <div class="pager" role="navigation" aria-label="Pagination">
        <span class="range">${from}–${to} of ${this._total}</span>
        <button data-goto="prev"${atFirst ? " disabled" : ""} aria-label="Previous page">‹</button>
        ${numbers}
        <button data-goto="next"${atLast ? " disabled" : ""} aria-label="Next page">›</button>
      </div>
    `;
    }
  }
  customElements.define("o-paginator", OPaginator);

  // src/table.ts
  class OTable extends GlassElement {
    static get observedAttributes() {
      return ["storage", "storage-key", "resize-mode", "selectable", "editable", "page-size"];
    }
    _columns = [];
    _data = [];
    _sortCol = null;
    _sortDir = "none";
    _selectedRows = new Set;
    _editingRows = new Set;
    _rowOriginals = new Map;
    _page = 1;
    _visibleRows = [];
    get columns() {
      return this._columns;
    }
    set columns(v) {
      this._columns = v;
      this.render();
    }
    get data() {
      return this._data;
    }
    set data(v) {
      this._data = v;
      this._page = 1;
      this._selectedRows.clear();
      this._editingRows.clear();
      this._rowOriginals.clear();
      this.render();
    }
    get selected() {
      return this._data.filter((row) => this._selectedRows.has(row));
    }
    get selectable() {
      return this.hasAttribute("selectable");
    }
    get editable() {
      return this.hasAttribute("editable");
    }
    constructor() {
      super();
    }
    connectedCallback() {
      this.restoreState();
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    getStorage() {
      const s = this.getAttribute("storage");
      if (s === "local")
        return localStorage;
      if (s === "session")
        return sessionStorage;
      return null;
    }
    persistState() {
      const store = this.getStorage();
      const key = this.getAttribute("storage-key");
      if (!store || !key)
        return;
      const widths = {};
      this._columns.forEach((c) => {
        if (c.width)
          widths[c.key] = c.width;
      });
      store.setItem(key, JSON.stringify({ sortCol: this._sortCol, sortDir: this._sortDir, widths }));
    }
    restoreState() {
      const store = this.getStorage();
      const key = this.getAttribute("storage-key");
      if (!store || !key)
        return;
      const raw = store.getItem(key);
      if (!raw)
        return;
      try {
        const { sortCol, sortDir, widths } = JSON.parse(raw);
        this._sortCol = sortCol ?? null;
        this._sortDir = sortDir ?? "none";
        if (widths) {
          this._columns = this._columns.map((c) => widths[c.key] != null ? { ...c, width: widths[c.key] } : c);
        }
      } catch {}
    }
    render() {
      if (!this.shadowRoot)
        return;
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; overflow-x: auto; }
        .table-wrap { width: fit-content; max-width: 100%; }
        o-paginator { display: block; margin-top: 10px; }
        ${glassScrollbarStyles(":host")}
        table {
          border-collapse: collapse;
          font-family: var(--glass-font); font-size: 14px;
          background: var(--glass-bg);
          border-radius: var(--glass-radius); overflow: hidden;
          box-shadow: var(--glass-elevation);
        }
        th, td {
          padding: 10px 14px; text-align: left;
          border-bottom: var(--glass-border-width) solid var(--glass-table-line);
          color: var(--glass-text); position: relative;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        th {
          background: var(--glass-hover);
          user-select: none;
          backdrop-filter: var(--glass-backdrop);
        }
        th[data-sortable] { cursor: pointer; }
        tbody tr:hover td { background: var(--glass-hover); }
        .sort-icon { float: right; opacity: 0.5; }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: var(--glass-border); }
        tbody tr.selected td { background: var(--glass-bg); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: var(--glass-text);
        }
        .cell-input {
          /* border-box makes the declared width the FINAL width: padding and a
             theme's border (1px on glass, 3px on pixel) are absorbed rather than
             added on top. Without it the input grew past its cell and the
             td's overflow:hidden clipped it out of sight. */
          box-sizing: border-box;
          background: var(--glass-hover);
          border: var(--glass-border-width) solid var(--accent-warm);
          border-radius: var(--glass-radius-sm);
          color: var(--glass-text);
          padding: 4px 8px;
          font-size: 13px;
          width: 100%;
          max-width: 100%;
          outline: none;
          font-family: var(--glass-font);
        }
        /* An editing cell trades its text padding for a thinner gutter, so a
           chunky-bordered input still clears the column edge on both sides. */
        td.cell-edit { padding: 6px 8px; overflow: visible; }
        .cell-input:focus { border-color: var(--accent-warm); background: var(--glass-border); }
        .edit-actions { width: 72px; text-align: center; padding: 6px 4px; }
        .edit-btn, .edit-confirm, .edit-cancel {
          background: none; border: none; cursor: pointer;
          font-size: 13px; padding: 2px 4px; opacity: 0.7; color: var(--glass-text); border-radius: var(--glass-radius-xs);
        }
        .edit-btn:hover, .edit-confirm:hover, .edit-cancel:hover { opacity: 1; }
        .edit-confirm { color: var(--glass-positive); }
        .edit-cancel { color: var(--glass-negative); }
        tr.editing-highlight td { border-left: var(--glass-border-width) solid var(--accent-warm); background: var(--glass-hover); }
        tr.edit-row td { background: var(--glass-bg); border-left: var(--glass-border-width) solid var(--accent-warm); padding: 12px 14px; }
        .edit-form { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
        .edit-field { display: flex; flex-direction: column; gap: 4px; }
        .edit-field label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; }
        .edit-form .cell-input { width: 140px; flex: 0 0 auto; }
        .edit-form-actions { display: flex; gap: 4px; align-items: center; margin-left: auto; }
      </style>
      ${(() => {
        const hasClickEditable = this._columns.some((c) => c.editable === "click");
        const editTh = this.editable && hasClickEditable ? '<th style="width:72px"></th>' : "";
        const sorted = this.getSortedData();
        const { start, end } = this.getVisibleRange(sorted.length);
        this._visibleRows = sorted.slice(start, end);
        const size = this.pageSize;
        const rows = this._visibleRows.map((row, i) => this.renderRow(row, start + i, hasClickEditable)).join("");
        const pager = size == null ? "" : `<o-paginator part="pager" total="${sorted.length}" page-size="${size}" page="${this._page}"></o-paginator>`;
        return `<div class="table-wrap"><table>
        <thead><tr>
          ${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all aria-label="Select all rows"></th>` : ""}
          ${this._columns.map((c) => this.renderTh(c)).join("")}
          ${editTh}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>${pager}</div>`;
      })()}
    `;
      this.attachHandlers();
    }
    renderTh(col) {
      const w = col.width ? `${col.width}px` : "fit-content";
      const minW = col.minWidth ? `min-width:${col.minWidth}px;` : "";
      const maxW = col.maxWidth ? `max-width:${col.maxWidth}px;` : "";
      const sortable = col.sortable ? " data-sortable" : "";
      const icon = col.sortable ? `<span class="sort-icon">${this._sortCol === col.key && this._sortDir === "asc" ? "↑" : this._sortCol === col.key && this._sortDir === "desc" ? "↓" : "↕"}</span>` : "";
      return `<th data-key="${col.key}"${sortable} style="width:${w};${minW}${maxW}">
      ${col.label}${icon}
      <div class="resize-handle" data-resize="${col.key}"></div>
    </th>`;
    }
    renderRow(row, rowIndex, hasClickEditable) {
      const checked = this._selectedRows.has(row) ? " checked" : "";
      const isSelected = this._selectedRows.has(row);
      const checkbox = this.selectable ? `<td><input type="checkbox" data-select-row${checked} aria-label="Select row"></td>` : "";
      const isEditing = this._editingRows.has(row);
      const trClasses = [isSelected ? "selected" : "", isEditing ? "editing-highlight" : ""].filter(Boolean).join(" ");
      const trClassAttr = trClasses ? ` class="${trClasses}"` : "";
      let editTd = "";
      if (this.editable && hasClickEditable) {
        editTd = isEditing ? `<td class="edit-actions">
            <button class="edit-confirm" data-row-index="${rowIndex}" title="Confirm">✓</button>
            <button class="edit-cancel" data-row-index="${rowIndex}" title="Cancel">✗</button>
           </td>` : `<td class="edit-actions">
            <button class="edit-btn" data-row-index="${rowIndex}" title="Edit">✏️</button>
           </td>`;
      }
      const cells = this._columns.map((c) => {
        if (this.editable && c.editable === "always") {
          const val = String(row[c.key] ?? "").replace(/"/g, "&quot;");
          return `<td class="cell-edit"><input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" /></td>`;
        }
        return `<td>${row[c.key] ?? ""}</td>`;
      }).join("");
      let result = `<tr${trClassAttr} data-row-index="${rowIndex}">${checkbox}${cells}${editTd}</tr>`;
      if (isEditing) {
        const totalCols = this._columns.length + (this.selectable ? 1 : 0) + (hasClickEditable ? 1 : 0);
        const fields = this._columns.filter((c) => c.editable === "click").map((c) => {
          const val = String(row[c.key] ?? "").replace(/"/g, "&quot;");
          return `<div class="edit-field">
            <label>${c.label}</label>
            <input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" />
          </div>`;
        }).join("");
        result += `<tr class="edit-row" data-edit-for="${rowIndex}">
        <td colspan="${totalCols}">
          <div class="edit-form">
            ${fields}
            <div class="edit-form-actions">
              <button class="edit-confirm" data-row-index="${rowIndex}" title="Confirm">✓</button>
              <button class="edit-cancel" data-row-index="${rowIndex}" title="Cancel">✗</button>
            </div>
          </div>
        </td>
      </tr>`;
      }
      return result;
    }
    get pageSize() {
      const raw = this.getAttribute("page-size");
      if (raw == null)
        return null;
      const n = parseInt(raw);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    get page() {
      return this._page;
    }
    set page(v) {
      const size = this.pageSize;
      if (size == null)
        return;
      const pages = Math.max(1, Math.ceil(this.getSortedData().length / size));
      const next = Math.min(Math.max(1, Math.floor(v) || 1), pages);
      if (next === this._page)
        return;
      this._page = next;
      this.render();
    }
    getVisibleRange(sortedLength) {
      const size = this.pageSize;
      if (size == null)
        return { start: 0, end: sortedLength };
      const pages = Math.max(1, Math.ceil(sortedLength / size));
      this._page = Math.min(Math.max(1, this._page), pages);
      const start = (this._page - 1) * size;
      return { start, end: Math.min(start + size, sortedLength) };
    }
    getSortedData() {
      if (!this._sortCol || this._sortDir === "none")
        return this._data;
      return [...this._data].sort((a, b) => {
        const av = a[this._sortCol];
        const bv = b[this._sortCol];
        if (av == null)
          return 1;
        if (bv == null)
          return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return this._sortDir === "asc" ? cmp : -cmp;
      });
    }
    handleSort(key) {
      const col = this._columns.find((c) => c.key === key);
      if (!col?.sortable)
        return;
      if (this._sortCol !== key) {
        this._sortCol = key;
        this._sortDir = "asc";
      } else if (this._sortDir === "asc")
        this._sortDir = "desc";
      else {
        this._sortCol = null;
        this._sortDir = "none";
      }
      this.dispatchEvent(new CustomEvent("o-sort", {
        bubbles: true,
        composed: true,
        detail: { col: key, dir: this._sortDir }
      }));
      this.persistState();
      this.render();
    }
    attachHandlers() {
      const mode = this.getAttribute("resize-mode") ?? "single";
      const pager = this.shadowRoot.querySelector("o-paginator");
      if (pager) {
        pager.addEventListener("o-page", (e) => {
          e.stopPropagation();
          const detail = e.detail;
          this._page = detail.page;
          this.render();
          this.dispatchEvent(new CustomEvent("o-page", {
            bubbles: true,
            composed: true,
            detail
          }));
        });
      }
      this.shadowRoot.querySelectorAll("th[data-key]").forEach((th) => {
        const key = th.dataset.key;
        th.addEventListener("click", () => this.handleSort(key));
      });
      this.shadowRoot.querySelectorAll(".resize-handle").forEach((handle) => {
        const key = handle.dataset.resize;
        const colIdx = this._columns.findIndex((c) => c.key === key);
        const col = this._columns[colIdx];
        handle.addEventListener("click", (e) => e.stopPropagation());
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const startX = e.screenX;
          const th = handle.closest("th");
          const startW = th.offsetWidth || col.width || 100;
          const nextTh = mode === "adjacent" ? th.nextElementSibling : null;
          const nextStartW = nextTh?.offsetWidth ?? 0;
          const onMove = (ev) => {
            const delta = ev.screenX - startX;
            let newW = Math.max(col.minWidth ?? 20, startW + delta);
            if (col.maxWidth)
              newW = Math.min(col.maxWidth, newW);
            th.style.width = `${newW}px`;
            if (mode === "adjacent" && nextTh) {
              const nextCol = this._columns[colIdx + 1];
              let nextW = Math.max(nextCol?.minWidth ?? 20, nextStartW - delta);
              if (nextCol?.maxWidth)
                nextW = Math.min(nextCol.maxWidth, nextW);
              nextTh.style.width = `${nextW}px`;
            }
          };
          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            const offset = this.selectable ? 1 : 0;
            this.shadowRoot.querySelectorAll("th").forEach((t, i) => {
              const colIdx2 = i - offset;
              if (colIdx2 < 0 || colIdx2 >= this._columns.length)
                return;
              const w = parseInt(t.style.width) || t.offsetWidth;
              if (w)
                this._columns[colIdx2] = { ...this._columns[colIdx2], width: w };
            });
            this.persistState();
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
      });
      if (this.selectable) {
        this.shadowRoot.querySelectorAll("tbody [data-select-row]").forEach((cb, i) => {
          const row = this.getSortedData()[i];
          cb.addEventListener("click", (e) => {
            e.stopPropagation();
            if (this._selectedRows.has(row)) {
              this._selectedRows.delete(row);
            } else {
              this._selectedRows.add(row);
            }
            this.dispatchEvent(new CustomEvent("o-row-select", {
              bubbles: true,
              composed: true,
              detail: { selected: this.selected }
            }));
            this.render();
          });
        });
        const headerCb = this.shadowRoot.querySelector("[data-select-all]");
        if (headerCb) {
          headerCb.addEventListener("click", (e) => {
            e.stopPropagation();
            const scope = this._visibleRows;
            const allSelected = scope.length > 0 && scope.every((row) => this._selectedRows.has(row));
            if (allSelected) {
              scope.forEach((row) => this._selectedRows.delete(row));
            } else {
              scope.forEach((row) => this._selectedRows.add(row));
            }
            this.dispatchEvent(new CustomEvent("o-row-select", {
              bubbles: true,
              composed: true,
              detail: { selected: this.selected }
            }));
            this.render();
          });
        }
      }
      if (this.editable) {
        this.shadowRoot.querySelectorAll("input.cell-input").forEach((input) => {
          const key = input.dataset.key;
          const rowIndex = parseInt(input.dataset.rowIndex);
          const col = this._columns.find((c) => c.key === key);
          if (col?.editable !== "always")
            return;
          const commit = () => {
            const row = this.getSortedData()[rowIndex];
            if (!row)
              return;
            const oldVal = String(row[key] ?? "");
            const newVal = input.value;
            if (newVal !== oldVal) {
              row[key] = newVal;
              this.dispatchEvent(new CustomEvent("o-cell-change", {
                bubbles: true,
                composed: true,
                detail: { key, value: newVal, rowIndex, row }
              }));
            }
          };
          input.addEventListener("blur", commit);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              commit();
              input.blur();
            }
          });
        });
        this.shadowRoot.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            this._editingRows.forEach((r) => {
              const orig = this._rowOriginals.get(r);
              if (orig) {
                Object.assign(r, orig);
                this._rowOriginals.delete(r);
              }
            });
            this._editingRows.clear();
            this._rowOriginals.set(row, { ...row });
            this._editingRows.add(row);
            this.render();
          });
        });
        this.shadowRoot.querySelectorAll(".edit-confirm").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            const original = this._rowOriginals.get(row) ?? {};
            const changes = {};
            this.shadowRoot.querySelectorAll(`tr[data-edit-for="${rowIndex}"] input.cell-input`).forEach((input) => {
              const k = input.dataset.key;
              const col = this._columns.find((c) => c.key === k);
              if (col?.editable === "click") {
                row[k] = input.value;
                if (input.value !== String(original[k] ?? ""))
                  changes[k] = input.value;
              }
            });
            this._editingRows.delete(row);
            this._rowOriginals.delete(row);
            if (Object.keys(changes).length > 0) {
              this.dispatchEvent(new CustomEvent("o-row-change", {
                bubbles: true,
                composed: true,
                detail: { rowIndex, row, changes }
              }));
            }
            this.render();
          });
        });
        this.shadowRoot.querySelectorAll(".edit-cancel").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            const original = this._rowOriginals.get(row);
            if (original) {
              Object.assign(row, original);
              this._rowOriginals.delete(row);
            }
            this._editingRows.delete(row);
            this.render();
          });
        });
      }
    }
  }
  customElements.define("o-table", OTable);

  // src/note.ts
  class ONote extends GlassElement {
    static get observedAttributes() {
      return ["variant", "label", "placeholder", "max-length", "value"];
    }
    _tags = [];
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    get variant() {
      return this.getAttribute("variant") ?? "textarea";
    }
    render() {
      if (this.variant === "card")
        this.renderCard();
      else
        this.renderTextarea();
      this.attachNoteHandlers();
    }
    renderTextarea() {
      const label = this.getAttribute("label") ?? "";
      const placeholder = this.getAttribute("placeholder") ?? " ";
      const maxLen = this.getAttribute("max-length");
      const value = this.getAttribute("value") ?? "";
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
        }
        .wrap {
          position: relative;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-xl);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          padding: ${label ? "24px 16px 12px" : "12px 16px"};
          transition: border-color 0.15s;
        }
        .wrap:focus-within { border-color: var(--accent-warm); }
        label {
          position: absolute; top: 8px; left: 16px;
          color: var(--glass-text-muted); font-size: 11px;
          font-family: var(--glass-font); pointer-events: none;
        }
        textarea {
          display: block; width: 100%;
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: var(--glass-font);
          min-height: 80px; overflow: hidden;
        }
        .counter { text-align: right; font-size: 11px; color: var(--glass-text-dim); margin-top: 4px; }
        ${glassScrollbarStyles("textarea")}
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ""}
        <textarea placeholder="${placeholder}"${maxLen ? ` maxlength="${maxLen}"` : ""}>${value}</textarea>
      </div>
      ${maxLen ? `<div class="counter"><span class="count">${value.length}</span> / ${maxLen}</div>` : ""}
    `;
    }
    renderCard() {
      const placeholder = this.getAttribute("placeholder") ?? "Write something…";
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
        }
        .card {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-xl);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .title-input {
          background: none; border: none;
          border-bottom: var(--glass-border-width) solid var(--glass-border);
          color: var(--glass-text); font-size: 18px; font-weight: 600;
          font-family: var(--glass-font); outline: none; padding-bottom: 8px; width: 100%;
        }
        .title-input:focus { border-color: var(--accent-warm); }
        .title-input::placeholder { color: var(--glass-text-dim); }
        .body-area {
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: var(--glass-font);
          min-height: 80px; overflow: hidden; width: 100%;
        }
        .body-area::placeholder { color: var(--glass-text-dim); }
        .tag-area { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .chip {
          background: var(--accent-warm); border-radius: var(--glass-radius-pill);
          padding: 2px 10px; font-size: 12px; color: var(--glass-accent-text); cursor: pointer;
        }
        .tag-input {
          background: none; border: none; color: var(--glass-text);
          font-size: 12px; font-family: var(--glass-font); outline: none; min-width: 80px;
        }
        .tag-input::placeholder { color: var(--glass-text-dim); }
        ${glassScrollbarStyles(".body-area")}
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" />
        <textarea class="body-area" placeholder="${placeholder}"></textarea>
        <div class="tag-area">
          ${this._tags.map((t, i) => `<span class="chip" data-tag-index="${i}">${t} ×</span>`).join("")}
          <input class="tag-input" placeholder="Add tag…" />
        </div>
      </div>
    `;
    }
    attachNoteHandlers() {
      if (this.variant !== "card") {
        const ta = this.shadowRoot.querySelector("textarea");
        const count = this.shadowRoot.querySelector(".count");
        ta?.addEventListener("input", () => {
          ta.style.height = "auto";
          ta.style.height = ta.scrollHeight + "px";
          if (count)
            count.textContent = String(ta.value.length);
          this.dispatchEvent(new CustomEvent("o-change", {
            bubbles: true,
            composed: true,
            detail: { value: ta.value }
          }));
        });
        return;
      }
      const titleInput = this.shadowRoot.querySelector(".title-input");
      const bodyArea = this.shadowRoot.querySelector(".body-area");
      const tagInput = this.shadowRoot.querySelector(".tag-input");
      const fireChange = () => {
        const title = this.shadowRoot.querySelector(".title-input")?.value ?? "";
        const body = this.shadowRoot.querySelector(".body-area")?.value ?? "";
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { title, body, tags: [...this._tags] }
        }));
      };
      titleInput?.addEventListener("input", fireChange);
      bodyArea?.addEventListener("input", () => {
        bodyArea.style.height = "auto";
        bodyArea.style.height = bodyArea.scrollHeight + "px";
        fireChange();
      });
      tagInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && tagInput.value.trim()) {
          this._tags.push(tagInput.value.trim());
          tagInput.value = "";
          this.render();
          fireChange();
        }
      });
      this.shadowRoot.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          this._tags.splice(parseInt(chip.dataset.tagIndex), 1);
          this.render();
          fireChange();
        });
      });
    }
  }
  customElements.define("o-note", ONote);

  // src/dialog.ts
  class ODialog extends GlassElement {
    static get observedAttributes() {
      return ["open"];
    }
    _onKeyDown = null;
    _onClick = null;
    _rendered = false;
    constructor() {
      super();
    }
    connectedCallback() {
      if (!this._rendered) {
        this.render();
        this._rendered = true;
      }
      this._onKeyDown = (e) => {
        if (e.key === "Escape" && this.hasAttribute("open")) {
          this.handleCancel();
        }
      };
      document.addEventListener("keydown", this._onKeyDown);
      this._onClick = (e) => {
        const target = e.target;
        if (target.getAttribute("type") === "submit" || target.closest('[type="submit"]')) {
          e.preventDefault();
          this.handleSubmit();
        }
      };
      this.addEventListener("click", this._onClick);
    }
    disconnectedCallback() {
      if (this._onKeyDown)
        document.removeEventListener("keydown", this._onKeyDown);
      if (this._onClick)
        this.removeEventListener("click", this._onClick);
    }
    attributeChangedCallback(name, _old, _new) {
      if (name !== "open")
        return;
      const backdrop = this.shadowRoot?.querySelector(".backdrop");
      if (!backdrop)
        return;
      if (_new !== null)
        backdrop.classList.add("visible");
      else
        backdrop.classList.remove("visible");
    }
    open() {
      this.setAttribute("open", "");
    }
    close() {
      this.removeAttribute("open");
    }
    handleSubmit() {
      const detail = {};
      this.querySelectorAll("input[name],select[name],textarea[name]").forEach((input) => {
        detail[input.name] = input.value;
      });
      this.querySelectorAll("o-input[name]").forEach((el) => {
        detail[el.getAttribute("name")] = el.value ?? "";
      });
      this.dispatchEvent(new CustomEvent("o-submit", { bubbles: true, composed: true, detail }));
      this.close();
    }
    handleCancel() {
      this.close();
      this.dispatchEvent(new CustomEvent("o-cancel", { bubbles: true, composed: true, detail: null }));
    }
    render() {
      const isOpen = this.hasAttribute("open");
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: contents;
        }
        .backdrop {
          display: flex;
          position: fixed; inset: 0; z-index: 1000;
          background: var(--glass-scrim);
          backdrop-filter: var(--glass-scrim-backdrop);
          align-items: center; justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
        }
        .backdrop.visible {
          opacity: 1;
          visibility: visible;
        }
        .panel {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius-2xl);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          padding: 24px; min-width: 320px; max-width: 90vw;
          color: var(--glass-text);
        }
        .backdrop.visible .panel {
          animation: scaleIn 0.2s ease-out;
        }
        .panel-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
        .panel-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .panel-actions { display: flex; justify-content: flex-end; gap: 8px; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      </style>
      <div class="backdrop${isOpen ? " visible" : ""}">
        <div class="panel" role="dialog" aria-modal="true">
          <div class="panel-title"><slot name="title"></slot></div>
          <div class="panel-body"><slot></slot></div>
          <div class="panel-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `;
      this.shadowRoot.querySelector(".backdrop").addEventListener("click", (e) => {
        if (e.target === e.currentTarget)
          this.handleCancel();
      });
    }
  }
  customElements.define("o-dialog", ODialog);

  // src/toast.ts
  var ICONS = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };
  var COLORS = {
    success: "#4ade80",
    error: "#f87171",
    warning: "#fbbf24",
    info: "#60a5fa"
  };

  class OWCToast extends GlassElement {
    static get observedAttributes() {
      return ["type", "message", "duration"];
    }
    msgEl;
    slotEl;
    timer = null;
    fallbackTimer = null;
    startedAt = 0;
    elapsed = 0;
    durationMs = 3000;
    constructor() {
      super();
    }
    connectedCallback() {
      this.durationMs = parseInt(this.getAttribute("duration") ?? "3000", 10);
      this.render();
      this.updateSlotOrFallback();
      this.startTimer();
      this.addEventListener("mouseenter", this.onMouseEnter);
      this.addEventListener("mouseleave", this.onMouseLeave);
    }
    disconnectedCallback() {
      this.clearTimer();
      this.removeEventListener("mouseenter", this.onMouseEnter);
      this.removeEventListener("mouseleave", this.onMouseLeave);
    }
    attributeChangedCallback(name, _old, _val) {
      if (!this.shadowRoot.firstChild)
        return;
      if (name === "type")
        this.updateAccent();
      if (name === "message")
        this.updateSlotOrFallback();
    }
    render() {
      const type = this.getAttribute("type") ?? "info";
      const color = COLORS[type] ?? COLORS.info;
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: block;
          position: relative;
          min-width: 220px;
          max-width: 360px;
          padding: 10px 36px 10px 14px;
          border-radius: var(--o-toast-radius, var(--glass-radius));
          background: var(--o-toast-bg, var(--glass-bg));
          border: var(--glass-border-width) solid var(--o-toast-border, var(--glass-border));
          backdrop-filter: blur(var(--o-toast-blur, var(--glass-blur)));
          -webkit-backdrop-filter: blur(var(--o-toast-blur, var(--glass-blur)));
          color: var(--o-toast-color, var(--glass-text));
          font-family: var(--glass-font);
          font-size: 14px;
          border-left: 4px solid var(--_accent);
          box-sizing: border-box;
        }
        .icon { margin-right: 8px; font-weight: bold; }
        #msg { display: none; }
        .close {
          position: absolute; top: 6px; right: 8px;
          background: none; border: none; color: inherit;
          cursor: pointer; font-size: 14px; opacity: 0.7; padding: 2px 4px;
        }
        .close:hover { opacity: 1; }
        .progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: var(--_accent); border-radius: 0 0 var(--o-toast-radius, var(--glass-radius)) var(--o-toast-radius, var(--glass-radius));
          width: 100%; transform-origin: left;
          animation: shrink linear both;
          animation-duration: var(--_dur, 3000ms);
        }
        .progress.paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: no-preference) {
          :host { animation: slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
          :host(.exiting) { animation: slideOutRight 0.25s ease-in both; }
          @keyframes slideInRight {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(110%); opacity: 0; }
          }
          @media (max-width: 639px) {
            :host { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
            :host(.exiting) { animation: slideDown 0.25s ease-in both; }
            @keyframes slideUp {
              from { transform: translateY(60px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes slideDown {
              from { transform: translateY(0);    opacity: 1; }
              to   { transform: translateY(60px); opacity: 0; }
            }
          }
        }
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      </style>
      <span class="icon">${ICONS[type] ?? ICONS.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `;
      this.msgEl = this.shadowRoot.querySelector("#msg");
      this.slotEl = this.shadowRoot.querySelector("slot");
      const bar = this.shadowRoot.querySelector(".progress");
      if (bar)
        bar.style.setProperty("--_dur", `${this.durationMs}ms`);
      this.slotEl.addEventListener("slotchange", () => this.updateSlotOrFallback());
      this.shadowRoot.querySelector(".close").addEventListener("click", () => this.dismiss());
      this.style.setProperty("--_accent", color);
    }
    updateSlotOrFallback() {
      if (!this.msgEl || !this.slotEl)
        return;
      const hasSlot = this.slotEl.assignedNodes({ flatten: true }).length > 0;
      if (hasSlot) {
        this.msgEl.style.display = "none";
      } else {
        this.msgEl.style.display = "";
        this.msgEl.textContent = this.getAttribute("message") ?? "";
      }
    }
    updateAccent() {
      const type = this.getAttribute("type") ?? "info";
      const color = COLORS[type] ?? COLORS.info;
      this.style.setProperty("--_accent", color);
      const iconEl = this.shadowRoot.querySelector(".icon");
      if (iconEl)
        iconEl.textContent = ICONS[type] ?? ICONS.info;
    }
    startTimer(remaining) {
      this.startedAt = Date.now();
      const ms = remaining ?? this.durationMs - this.elapsed;
      this.timer = setTimeout(() => this.dismiss(), ms);
      this.fallbackTimer = setTimeout(() => {
        if (this.isConnected)
          this.remove();
      }, ms + 600);
    }
    clearTimer() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.fallbackTimer !== null) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    }
    onMouseEnter = () => {
      this.elapsed += Date.now() - this.startedAt;
      this.clearTimer();
      this.shadowRoot?.querySelector(".progress")?.classList.add("paused");
    };
    onMouseLeave = () => {
      this.startedAt = Date.now();
      this.startTimer(Math.max(0, this.durationMs - this.elapsed));
      this.shadowRoot?.querySelector(".progress")?.classList.remove("paused");
    };
    dismiss() {
      this.clearTimer();
      this.classList.add("exiting");
      this.addEventListener("animationend", () => this.remove(), { once: true });
      setTimeout(() => this.remove(), 400);
    }
  }
  customElements.define("o-toast", OWCToast);
  function ensureContainer() {
    if (!document.getElementById("o-toast-container")) {
      const style = document.createElement("style");
      style.setAttribute("data-owc-toast", "");
      style.textContent = `
      #o-toast-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        top: 1rem;
        right: 1rem;
        pointer-events: none;
      }
      #o-toast-container > * { pointer-events: all; }
      @media (max-width: 639px) {
        #o-toast-container {
          top: auto; right: auto;
          bottom: 1rem; left: 50%;
          transform: translateX(-50%);
          align-items: center;
        }
      }
    `;
      document.head.appendChild(style);
      const container = document.createElement("div");
      container.id = "o-toast-container";
      document.body.appendChild(container);
    }
    return document.getElementById("o-toast-container");
  }
  function toast(content, type, options) {
    const container = ensureContainer();
    const el = document.createElement("o-toast");
    el.setAttribute("type", type);
    if (options?.duration !== undefined) {
      el.setAttribute("duration", String(options.duration));
    }
    el.innerHTML = content;
    container.appendChild(el);
  }

  // src/progress.ts
  class OProgress extends GlassElement {
    _value = 0;
    _timer = null;
    _hideTimer = null;
    _resetTimer = null;
    static get observedAttributes() {
      return ["value"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback(name, _old, next) {
      if (name === "value" && this.isConnected) {
        this._setValue(Math.min(100, Math.max(0, parseFloat(next) || 0)));
      }
    }
    disconnectedCallback() {
      this._stopAuto();
      if (this._hideTimer) {
        clearTimeout(this._hideTimer);
        this._hideTimer = null;
      }
      if (this._resetTimer) {
        clearTimeout(this._resetTimer);
        this._resetTimer = null;
      }
    }
    render() {
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          display: block;
          pointer-events: none;
        }
        .bar {
          height: 3px;
          width: 0%;
          background: var(--glass-progress);
          box-shadow: var(--glass-progress-glow);
          transition: width 0.2s ease, opacity 0.3s ease;
          opacity: 1;
        }
      </style>
      <div class="bar" style="width:0%"></div>
    `;
    }
    _bar() {
      return this.shadowRoot?.querySelector(".bar") ?? null;
    }
    _setValue(v) {
      if (this._hideTimer) {
        clearTimeout(this._hideTimer);
        this._hideTimer = null;
      }
      if (this._resetTimer) {
        clearTimeout(this._resetTimer);
        this._resetTimer = null;
      }
      this._value = v;
      const bar = this._bar();
      if (!bar)
        return;
      bar.style.opacity = "1";
      bar.style.width = `${v}%`;
      if (v >= 100) {
        this._hideTimer = setTimeout(() => {
          bar.style.opacity = "0";
          this._resetTimer = setTimeout(() => {
            bar.style.width = "0%";
            this._value = 0;
          }, 300);
        }, 400);
      }
    }
    _stopAuto() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    }
    static start() {
      const el = OProgress._getInstance();
      el._stopAuto();
      el._timer = setInterval(() => {
        const remaining = 90 - el._value;
        if (remaining <= 0) {
          el._stopAuto();
          return;
        }
        const step = Math.random() * Math.min(remaining * 0.1, 5) + 0.5;
        el._setValue(Math.min(89, el._value + step));
      }, 300);
    }
    static set(v) {
      OProgress._getInstance()._setValue(Math.min(100, Math.max(0, v)));
    }
    static done() {
      const el = OProgress._getInstance();
      el._stopAuto();
      el._setValue(100);
    }
    static _getInstance() {
      let el = document.querySelector("o-progress");
      if (!el) {
        el = document.createElement("o-progress");
        document.body.appendChild(el);
      }
      return el;
    }
  }
  customElements.define("o-progress", OProgress);
  function asyncPlus(...promises) {
    if (promises.length === 0)
      return Promise.resolve([]);
    OProgress.start();
    let settled = 0;
    const total = promises.length;
    const onSettle = () => {
      settled++;
      OProgress.set(Math.round(settled / total * 90));
    };
    return Promise.allSettled(promises.map((p) => p.then((v) => {
      onSettle();
      return v;
    }, (e) => {
      onSettle();
      throw e;
    }))).then((results) => {
      OProgress.done();
      document.dispatchEvent(new CustomEvent("progress-complete", { detail: { results } }));
      return results;
    });
  }

  // src/toggle.ts
  function toOptions(input) {
    return input.map((o) => typeof o === "string" ? { label: o, value: o.toLowerCase() } : o);
  }

  class OToggle extends GlassElement {
    static get observedAttributes() {
      return ["options", "value"];
    }
    _options = [];
    _value = null;
    get options() {
      return this._options;
    }
    set options(v) {
      this._options = toOptions(v);
      if (this._value && !this._options.find((o) => o.value === this._value)) {
        this._value = this._options[0]?.value ?? null;
      }
      if (!this._value)
        this._value = this._options[0]?.value ?? null;
      this.render();
    }
    get value() {
      return this._value ?? "";
    }
    set value(v) {
      if (!this._options.find((o) => o.value === v))
        return;
      this._value = v;
      this.setAttribute("value", v);
      this.updateSelection();
    }
    constructor() {
      super();
      this.shadowRoot.addEventListener("click", this.handleClick);
      this.shadowRoot.addEventListener("keydown", (e) => {
        const ke = e;
        if (ke.key !== "ArrowRight" && ke.key !== "ArrowLeft")
          return;
        const idx = this._options.findIndex((o) => o.value === this._value);
        if (idx === -1)
          return;
        const next = ke.key === "ArrowRight" ? (idx + 1) % this._options.length : (idx - 1 + this._options.length) % this._options.length;
        const opt = this._options[next];
        if (!opt)
          return;
        const prev = this._value;
        this._value = opt.value;
        this.setAttribute("value", opt.value);
        this.updateSelection();
        const tabs = this.shadowRoot.querySelectorAll('[role="tab"]');
        tabs[next]?.focus();
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { value: opt.value, index: next, prev }
        }));
      });
    }
    connectedCallback() {
      if (this._options.length === 0) {
        const children = [...this.querySelectorAll("[value]")];
        if (children.length > 0) {
          this._options = children.map((c) => ({
            label: c.textContent?.trim() ?? "",
            value: c.getAttribute("value") ?? ""
          }));
        }
      }
      if (this._options.length === 0) {
        const attr = this.getAttribute("options");
        if (attr)
          this._options = toOptions(attr.split(",").map((s) => s.trim()));
      }
      if (!this._value)
        this._value = this._options[0]?.value ?? null;
      this.render();
    }
    attributeChangedCallback(name, _old, val) {
      if (name === "options" && val !== null) {
        const parsed = toOptions(val.split(",").map((s) => s.trim()));
        if (this._value && !parsed.find((o) => o.value === this._value)) {
          this._value = parsed[0]?.value ?? null;
        }
        this._options = parsed;
        this.render();
      }
      if (name === "value" && val !== null) {
        if (this._options.find((o) => o.value === val)) {
          this._value = val;
          this.updateSelection();
        }
      }
    }
    handleClick = (e) => {
      const segments = [...this.shadowRoot.querySelectorAll(".segment")];
      const idx = segments.findIndex((s) => s.contains(e.target));
      if (idx === -1)
        return;
      const opt = this._options[idx];
      if (!opt || opt.value === this._value)
        return;
      const prev = this._value;
      this._value = opt.value;
      this.setAttribute("value", opt.value);
      this.updateSelection();
      this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: true,
        composed: true,
        detail: { value: opt.value, index: idx, prev }
      }));
    };
    updateSelection() {
      const container = this.shadowRoot?.querySelector(".container");
      if (!container) {
        this.render();
        return;
      }
      const idx = this._options.findIndex((o) => o.value === this._value);
      container.style.setProperty("--idx", String(idx >= 0 ? idx : 0));
      this.shadowRoot.querySelectorAll(".segment").forEach((s, i) => {
        s.classList.toggle("active", i === idx);
      });
    }
    render() {
      if (!this.shadowRoot)
        return;
      const n = this._options.length;
      const idx = this._options.findIndex((o) => o.value === this._value);
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: inline-flex; }
        .container {
          display: inline-flex;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          border-radius: var(--glass-radius-pill);
          padding: 3px;
          position: relative;
          user-select: none;
          box-shadow: var(--glass-elevation);
          --n: ${n};
          --idx: ${idx >= 0 ? idx : 0};
        }
        .indicator {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / var(--n));
          background: var(--glass-indicator);
          border-radius: var(--glass-radius-pill);
          transform: translateX(calc(var(--idx) * 100%));
          transition: transform 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .segment {
          flex: 1;
          min-width: 48px;
          padding: 6px 14px;
          text-align: center;
          color: var(--glass-text);
          font-size: 14px;
          font-family: var(--glass-font);
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: var(--glass-radius-pill);
        }
        .segment.active { font-weight: 600; }
      </style>
      <div class="container" role="tablist">
        ${n > 0 ? '<div class="indicator"></div>' : ""}
        ${this._options.map((o) => `<div class="segment${o.value === this._value ? " active" : ""}" role="tab" aria-selected="${o.value === this._value}" tabindex="${o.value === this._value ? "0" : "-1"}" data-value="${o.value}">${o.label}</div>`).join("")}
      </div>
    `;
    }
  }
  customElements.define("o-toggle", OToggle);

  // src/search.ts
  class OSearch extends GlassElement {
    static get observedAttributes() {
      return ["placeholder", "value-key", "no-dropdown"];
    }
    _input;
    _data = [];
    _searchKeys = [];
    _renderItem = null;
    _filterFn = null;
    _valueKey = null;
    _currentResults = [];
    get placeholder() {
      return this.getAttribute("placeholder") ?? "Search…";
    }
    set placeholder(v) {
      this.setAttribute("placeholder", v);
    }
    get valueKey() {
      return this._valueKey;
    }
    set valueKey(v) {
      this._valueKey = v;
      this.setAttribute("value-key", v ?? "");
    }
    get noDropdown() {
      return this.hasAttribute("no-dropdown");
    }
    set noDropdown(v) {
      v ? this.setAttribute("no-dropdown", "") : this.removeAttribute("no-dropdown");
    }
    set data(v) {
      this._data = v;
    }
    set searchKeys(v) {
      this._searchKeys = v;
    }
    set renderItem(fn) {
      this._renderItem = fn;
    }
    set filterFn(fn) {
      this._filterFn = fn;
    }
    constructor() {
      super();
      this._input = document.createElement("input");
      this._input.addEventListener("input", this.handleInput);
      this.render();
    }
    connectedCallback() {
      document.addEventListener("click", this.handleDocumentClick);
    }
    disconnectedCallback() {
      document.removeEventListener("click", this.handleDocumentClick);
    }
    attributeChangedCallback(name, _old, val) {
      if (name === "placeholder") {
        this._input.placeholder = val ?? "Search…";
      }
      if (name === "value-key") {
        this._valueKey = val;
        this.updateDropdown();
      }
      if (name === "no-dropdown") {
        this.updateDropdown();
      }
    }
    handleInput = () => {
      const query = this._input.value;
      this.dispatchEvent(new CustomEvent("o-input", {
        bubbles: true,
        composed: true,
        detail: { query }
      }));
      const results = this.filter(query);
      this._currentResults = results;
      this.dispatchEvent(new CustomEvent("o-results", {
        bubbles: true,
        composed: true,
        detail: { query, results }
      }));
      this.updateDropdown();
    };
    filter(query) {
      if (!query)
        return [];
      if (this._filterFn)
        return this._data.filter((item) => this._filterFn(query, item));
      if (this._searchKeys.length === 0)
        return [];
      const q = query.toLowerCase();
      return this._data.filter((item) => this._searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q)));
    }
    handleDocumentClick = (e) => {
      if (e.target instanceof Node && !this.contains(e.target)) {
        this.closeDropdown();
      }
    };
    closeDropdown() {
      const dropdown = this.shadowRoot.querySelector(".dropdown");
      if (dropdown)
        dropdown.style.display = "none";
    }
    updateDropdown() {
      const dropdown = this.shadowRoot.querySelector(".dropdown");
      if (!dropdown)
        return;
      const query = this._input.value;
      const show = !this.noDropdown && this._renderItem !== null && query.length > 0;
      const container = this.shadowRoot.querySelector(".container");
      if (!show) {
        dropdown.style.display = "none";
        if (container)
          container.setAttribute("aria-expanded", "false");
        return;
      }
      dropdown.style.display = "block";
      if (container)
        container.setAttribute("aria-expanded", "true");
      if (this._currentResults.length === 0) {
        dropdown.innerHTML = `<div class="item no-results">No results</div>`;
        return;
      }
      dropdown.innerHTML = this._currentResults.map((item, i) => `<div class="item" role="option" data-index="${i}">${this._renderItem(item)}</div>`).join("");
    }
    handleDropdownClick = (e) => {
      const item = e.target.closest("[data-index]");
      if (!item)
        return;
      const idx = parseInt(item.dataset.index);
      const selected = this._currentResults[idx];
      if (selected === undefined)
        return;
      const query = this._input.value;
      if (this._valueKey) {
        const val = selected[this._valueKey];
        if (val !== undefined)
          this._input.value = String(val);
      }
      this.closeDropdown();
      this.dispatchEvent(new CustomEvent("o-select", {
        bubbles: true,
        composed: true,
        detail: { item: selected, query }
      }));
    };
    render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; position: relative; }
        .container {
          display: flex; align-items: center; gap: 8px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          backdrop-filter: var(--glass-backdrop); -webkit-backdrop-filter: var(--glass-backdrop);
          border-radius: var(--glass-radius-pill); padding: 8px 16px;
          box-shadow: var(--glass-elevation);
        }
        .icon { opacity: 0.6; flex-shrink: 0; }
        input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: var(--glass-font);
        }
        input::placeholder { color: var(--glass-text-muted); }
        .dropdown {
          display: none; position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop); -webkit-backdrop-filter: var(--glass-backdrop);
          border-radius: var(--glass-radius-xl); border: var(--glass-border-width) solid var(--glass-border);
          overflow: hidden; z-index: 10;
          box-shadow: var(--glass-elevation);
        }
        .item {
          padding: 8px 14px; color: var(--glass-text);
          font-size: 14px; font-family: var(--glass-font); cursor: pointer;
        }
        .item:hover { background: var(--glass-hover); }
        .no-results { opacity: 0.5; cursor: default; }
      </style>
      <div class="container" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <span class="icon">\uD83D\uDD0D</span>
      </div>
      <div class="dropdown" role="listbox"></div>
    `;
      const container = shadow.querySelector(".container");
      this._input.placeholder = this.getAttribute("placeholder") ?? "Search…";
      container.appendChild(this._input);
      shadow.querySelector(".dropdown").addEventListener("click", this.handleDropdownClick);
    }
  }
  customElements.define("o-search", OSearch);

  // src/tooltip.ts
  class OTooltip extends GlassElement {
    static get observedAttributes() {
      return ["text", "position"];
    }
    connectedCallback() {
      this.render();
    }
    disconnectedCallback() {
      this.removeEventListener("mouseenter", this.show);
      this.removeEventListener("mouseleave", this.hide);
      this.removeEventListener("focusin", this.show);
      this.removeEventListener("focusout", this.hide);
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    get position() {
      return this.getAttribute("position") ?? "top";
    }
    show = () => {
      this.shadowRoot.querySelector(".tooltip")?.classList.add("visible");
    };
    hide = () => {
      this.shadowRoot.querySelector(".tooltip")?.classList.remove("visible");
    };
    render() {
      const text = this.getAttribute("text") ?? "";
      const pos = this.position;
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { position: relative; display: inline-block; }
        .tooltip {
          position: absolute;
          padding: 6px 12px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          border-radius: var(--glass-radius-lg);
          color: var(--glass-text);
          font-size: 12px;
          font-family: var(--glass-font);
          box-shadow: var(--glass-elevation);
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
    `;
      this.addEventListener("mouseenter", this.show);
      this.addEventListener("mouseleave", this.hide);
      this.addEventListener("focusin", this.show);
      this.addEventListener("focusout", this.hide);
    }
  }
  customElements.define("o-tooltip", OTooltip);

  // src/dropdown.ts
  class ODropdown extends GlassElement {
    _options = [];
    _focusIndex = -1;
    _rendered = false;
    _open = false;
    constructor() {
      super();
    }
    get options() {
      return this._options;
    }
    set options(val) {
      this._options = val;
      this.renderMenu();
    }
    connectedCallback() {
      if (!this._rendered) {
        this.render();
        this._rendered = true;
      }
      document.addEventListener("mousedown", this.handleOutsideMousedown);
      document.addEventListener("keydown", this.handleKeyDown);
    }
    disconnectedCallback() {
      document.removeEventListener("mousedown", this.handleOutsideMousedown);
      document.removeEventListener("keydown", this.handleKeyDown);
    }
    handleOutsideMousedown = (e) => {
      if (e.composedPath().includes(this))
        return;
      if (this._open)
        this.close();
    };
    handleKeyDown = (e) => {
      if (!this._open)
        return;
      const items = Array.from(this.shadowRoot.querySelectorAll('[role="menuitem"]'));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this._focusIndex = Math.min(this._focusIndex + 1, items.length - 1);
        items[this._focusIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this._focusIndex = Math.max(this._focusIndex - 1, 0);
        items[this._focusIndex]?.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (this._focusIndex >= 0)
          items[this._focusIndex]?.click();
      } else if (e.key === "Escape") {
        this.close();
      }
    };
    toggle() {
      if (this._open)
        this.close();
      else
        this.open();
    }
    open() {
      this._open = true;
      this._focusIndex = -1;
      this.shadowRoot?.querySelector(".menu")?.classList.add("open");
    }
    close() {
      this._open = false;
      this._focusIndex = -1;
      this.shadowRoot?.querySelector(".menu")?.classList.remove("open");
    }
    render() {
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host {
          display: inline-block;
          position: relative;
        }
        .trigger {
          cursor: pointer;
        }
        .menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 160px;
          margin-top: 4px;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius);
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-shadow);
          z-index: 100;
          padding: 4px 0;
        }
        .menu.open {
          display: block;
        }
        .item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: var(--glass-font);
          cursor: pointer;
          outline: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .item:hover,
        .item:focus {
          background: var(--glass-hover);
        }
        .icon {
          font-size: 16px;
        }
      </style>
      <div class="trigger"><slot></slot></div>
      <div class="menu" role="menu"></div>
    `;
      let toggling = false;
      const doToggle = () => {
        if (toggling)
          return;
        toggling = true;
        this.toggle();
        requestAnimationFrame(() => {
          toggling = false;
        });
      };
      this.addEventListener("click", doToggle);
      this.addEventListener("o-click", doToggle);
      this.renderMenu();
    }
    renderMenu() {
      const menu = this.shadowRoot?.querySelector(".menu");
      if (!menu)
        return;
      menu.innerHTML = this._options.map((opt) => `
      <button
        class="item"
        role="menuitem"
        tabindex="-1"
        data-value="${opt.value}"
        data-label="${opt.label}"
      >${opt.icon ? `<span class="icon">${opt.icon}</span>` : ""}<span>${opt.label}</span></button>
    `).join("");
      menu.querySelectorAll('[role="menuitem"]').forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const value = item.dataset.value;
          const label = item.dataset.label;
          this.dispatchEvent(new CustomEvent("o-select", {
            bubbles: true,
            composed: true,
            detail: { value, label }
          }));
          this.close();
        });
      });
    }
  }
  customElements.define("o-dropdown", ODropdown);

  // src/tabs.ts
  class OTabs extends GlassElement {
    _value = "";
    _initialized = false;
    constructor() {
      super();
    }
    connectedCallback() {
      if (this.children.length > 0) {
        this.init();
      } else {
        const observer = new MutationObserver(() => {
          if (this.querySelectorAll('[slot="tab"]').length > 0) {
            observer.disconnect();
            this.init();
          }
        });
        observer.observe(this, { childList: true });
        requestAnimationFrame(() => {
          if (!this._initialized) {
            observer.disconnect();
            this.init();
          }
        });
      }
    }
    init() {
      if (this._initialized)
        return;
      this._initialized = true;
      this.querySelectorAll('[slot="tab"]').forEach((el) => {
        el.style.display = "none";
      });
      const tabs = Array.from(this.querySelectorAll('[slot="tab"]'));
      if (!this._value && tabs.length) {
        this._value = tabs[0].dataset.value ?? "";
      }
      this.render();
      this._updatePanels();
    }
    get value() {
      return this._value;
    }
    set value(v) {
      const prev = this._value;
      if (v === prev)
        return;
      this._value = v;
      this._updateTabButtons();
      this._updatePanels();
    }
    render() {
      const tabs = Array.from(this.querySelectorAll('[slot="tab"]'));
      const buttonsHTML = tabs.map((tab) => {
        const val = tab.dataset.value ?? "";
        const active = val === this._value;
        return `<button role="tab" class="tab${active ? " active" : ""}" data-value="${val}" aria-selected="${active}" tabindex="${active ? "0" : "-1"}">${tab.textContent ?? ""}</button>`;
      }).join("");
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .tablist {
          display: flex;
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-radius: var(--glass-radius) var(--glass-radius) 0 0;
          backdrop-filter: var(--glass-backdrop);
          padding: 4px 4px 0;
          gap: 2px;
          box-shadow: var(--glass-elevation);
        }
        .tab {
          flex: 1;
          background: none;
          border: none;
          border-radius: var(--glass-radius-tab) var(--glass-radius-tab) 0 0;
          color: var(--glass-text-muted);
          font-size: 14px;
          font-family: var(--glass-font);
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .tab:hover { background: var(--glass-hover); color: var(--glass-text); }
        .tab.active {
          background: var(--glass-hover);
          color: var(--glass-text);
          border-bottom: 2px solid var(--accent-warm);
        }
        .panel-area {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid var(--glass-border);
          border-top: none;
          border-radius: 0 0 var(--glass-radius) var(--glass-radius);
          backdrop-filter: var(--glass-backdrop);
          padding: 16px;
        }
      </style>
      <div class="tablist" role="tablist">${buttonsHTML}</div>
      <div class="panel-area"><slot></slot></div>
    `;
      this.shadowRoot.querySelector(".tablist").addEventListener("click", (e) => {
        const btn = e.target.closest('[role="tab"]');
        if (!btn)
          return;
        const val = btn.dataset.value ?? "";
        if (val === this._value)
          return;
        const prev = this._value;
        this._value = val;
        this._updateTabButtons();
        this._updatePanels();
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { value: val, prev }
        }));
      });
      this.shadowRoot.querySelector(".tablist").addEventListener("keydown", (e) => {
        const ke = e;
        if (ke.key !== "ArrowLeft" && ke.key !== "ArrowRight")
          return;
        const tabs2 = Array.from(this.querySelectorAll('[slot="tab"]'));
        const values = tabs2.map((t) => t.dataset.value ?? "");
        const idx = values.indexOf(this._value);
        if (idx === -1)
          return;
        const next = ke.key === "ArrowRight" ? (idx + 1) % values.length : (idx - 1 + values.length) % values.length;
        const prev = this._value;
        this._value = values[next];
        this._updateTabButtons();
        this._updatePanels();
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { value: this._value, prev }
        }));
        this.shadowRoot.querySelectorAll('[role="tab"]')[next]?.focus();
      });
    }
    _updateTabButtons() {
      this.shadowRoot.querySelectorAll('[role="tab"]').forEach((btn) => {
        const active = btn.dataset.value === this._value;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
        btn.tabIndex = active ? 0 : -1;
      });
    }
    _updatePanels() {
      this.querySelectorAll("[data-tab]").forEach((panel) => {
        panel.style.display = panel.dataset.tab === this._value ? "" : "none";
      });
    }
  }
  customElements.define("o-tabs", OTabs);

  // src/input.ts
  class OInput extends GlassElement {
    static get observedAttributes() {
      return ["label", "placeholder", "type", "name", "disabled", "error", "success"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    disconnectedCallback() {}
    get value() {
      return this.shadowRoot.querySelector("input")?.value ?? this.getAttribute("value") ?? "";
    }
    set value(v) {
      const input = this.shadowRoot.querySelector("input");
      if (input)
        input.value = v;
    }
    render() {
      const label = this.getAttribute("label") ?? "";
      const placeholder = this.getAttribute("placeholder") ?? "";
      const type = this.getAttribute("type") ?? "text";
      const name = this.getAttribute("name") ?? "";
      const value = this.getAttribute("value") ?? "";
      const disabled = this.hasAttribute("disabled");
      const error = this.getAttribute("error") ?? "";
      const success = this.hasAttribute("success");
      const borderColor = error ? "rgba(239,68,68,0.7)" : success ? "rgba(74,222,128,0.7)" : "var(--glass-border)";
      const focusBorder = error ? "rgba(239,68,68,0.9)" : "var(--accent-warm)";
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .wrap { display: flex; flex-direction: column; gap: 4px; }
        label {
          font-size: 11px;
          font-family: var(--glass-font);
          color: var(--glass-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        input {
          background: var(--glass-bg);
          border: var(--glass-border-width) solid ${borderColor};
          border-radius: var(--glass-radius);
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: var(--glass-font);
          outline: none;
          width: 100%;
          box-sizing: border-box;
          backdrop-filter: var(--glass-backdrop);
          box-shadow: var(--glass-elevation);
          transition: border-color 0.15s;
          opacity: ${disabled ? "0.5" : "1"};
          cursor: ${disabled ? "not-allowed" : "text"};
        }
        input:focus { border-color: ${focusBorder}; }
        input::placeholder { color: var(--glass-text-dim); }
        .error-msg {
          font-size: 11px;
          color: rgba(239,68,68,0.9);
          font-family: var(--glass-font);
        }
      </style>
      <div class="wrap">
        ${label ? "<label></label>" : ""}
        <input
          type="${type}"
          name="${name}"
          ${disabled ? "disabled" : ""}
        />
        ${error ? '<span class="error-msg"></span>' : ""}
      </div>
    `;
      const inputEl = this.shadowRoot.querySelector("input");
      if (label)
        this.shadowRoot.querySelector("label").textContent = label;
      if (error)
        this.shadowRoot.querySelector(".error-msg").textContent = error;
      inputEl.placeholder = placeholder;
      inputEl.value = value;
      inputEl.style.borderColor = borderColor;
      inputEl.addEventListener("input", () => {
        this.dispatchEvent(new CustomEvent("o-input", {
          bubbles: true,
          composed: true,
          detail: { value: inputEl.value }
        }));
      });
      inputEl.addEventListener("blur", () => {
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { value: inputEl.value }
        }));
      });
    }
  }
  customElements.define("o-input", OInput);

  // src/skeleton.ts
  class OSkeleton extends GlassElement {
    static get observedAttributes() {
      return ["variant", "width", "height", "radius", "rows"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    disconnectedCallback() {}
    get variant() {
      return this.getAttribute("variant") ?? "block";
    }
    pulseCSS() {
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
    `;
    }
    render() {
      const v = this.variant;
      if (v === "table")
        this.renderTable();
      else if (v === "panel")
        this.renderPanel();
      else
        this.renderBlock();
    }
    renderBlock() {
      const w = this.getAttribute("width") ?? "100%";
      const h = this.getAttribute("height") ?? "1em";
      const r = this.getAttribute("radius") ?? "6px";
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        ${this.pulseCSS()}
      </style>
      <div class="skel" style="width:${w};height:${h};--skel-r:${r}"></div>
    `;
    }
    renderTable() {
      const rows = Math.max(1, parseInt(this.getAttribute("rows") ?? "5"));
      const colWidths = ["25%", "30%", "20%", "15%"];
      const headerCells = colWidths.map((w) => `<div class="skel cell" style="width:${w}"></div>`).join("");
      const bodyRows = Array.from({ length: rows }, () => colWidths.map((w) => `<div class="skel cell" style="width:${w}"></div>`).join("")).map((cells) => `<div class="row">${cells}</div>`).join("");
      this.shadowRoot.innerHTML = `
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
    `;
    }
    renderPanel() {
      this.shadowRoot.innerHTML = `
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
    `;
    }
  }
  customElements.define("o-skeleton", OSkeleton);

  // src/tree.ts
  class OTreeNode extends HTMLElement {
    static get observedAttributes() {
      return ["label", "open", "icon"];
    }
    attributeChangedCallback() {
      this.closest("o-tree")?.dispatchEvent(new CustomEvent("o-tree-config"));
    }
  }
  var key = (p) => p.join(".");

  class OTree extends GlassElement {
    static get observedAttributes() {
      return ["selectable", "label", "lines"];
    }
    _data = null;
    _open = new Set;
    _seeded = false;
    _selected = null;
    _focus = null;
    get selectable() {
      return this.hasAttribute("selectable");
    }
    set selectable(v) {
      v ? this.setAttribute("selectable", "") : this.removeAttribute("selectable");
    }
    get lines() {
      return !this.hasAttribute("no-lines");
    }
    get data() {
      return this._data ?? this.fromMarkup();
    }
    set data(v) {
      this._data = Array.isArray(v) ? v : [];
      this._seeded = false;
      this.render();
    }
    fromMarkup() {
      const walk = (parent) => Array.from(parent.children).filter((c) => c.tagName === "O-TREE-NODE").map((c) => {
        const kids = walk(c);
        return {
          label: c.getAttribute("label") ?? c.textContent?.trim() ?? "",
          icon: c.getAttribute("icon") ?? undefined,
          open: c.hasAttribute("open"),
          ...kids.length ? { children: kids } : {}
        };
      });
      return walk(this);
    }
    _mo = null;
    connectedCallback() {
      this.addEventListener("o-tree-config", () => this.render());
      this.render();
      queueMicrotask(() => {
        if (!this._data)
          this.render();
      });
      if (typeof MutationObserver !== "undefined") {
        this._mo = new MutationObserver(() => {
          if (!this._data)
            this.render();
        });
        this._mo.observe(this, { childList: true, subtree: true, attributes: true });
      }
    }
    disconnectedCallback() {
      this._mo?.disconnect();
      this._mo = null;
    }
    attributeChangedCallback() {
      this.render();
    }
    seed(nodes, path = []) {
      nodes.forEach((n, i) => {
        const p = [...path, i];
        if (n.open)
          this._open.add(key(p));
        if (n.children)
          this.seed(n.children, p);
      });
    }
    allBranches(nodes, path = [], out = []) {
      nodes.forEach((n, i) => {
        const p = [...path, i];
        if (n.children?.length) {
          out.push(key(p));
          this.allBranches(n.children, p, out);
        }
      });
      return out;
    }
    expandAll() {
      this.allBranches(this.data).forEach((k) => this._open.add(k));
      this.render();
    }
    collapseAll() {
      this._open.clear();
      this.render();
    }
    toggle(path, force) {
      const k = key(path);
      const next = force === undefined ? !this._open.has(k) : force;
      next ? this._open.add(k) : this._open.delete(k);
      const node = this.nodeAt(path);
      if (node)
        this.dispatchEvent(new CustomEvent("o-tree-toggle", {
          bubbles: true,
          composed: true,
          detail: { node, path, open: next }
        }));
      this.render();
    }
    nodeAt(path) {
      let list = this.data, n;
      for (const i of path) {
        n = list?.[i];
        if (!n)
          return null;
        list = n.children ?? [];
      }
      return n ?? null;
    }
    visible(nodes = this.data, path = [], out = []) {
      nodes.forEach((n, i) => {
        const p = [...path, i];
        out.push({ path: p, node: n });
        if (n.children?.length && this._open.has(key(p)))
          this.visible(n.children, p, out);
      });
      return out;
    }
    render() {
      const root = this.shadowRoot;
      if (!root)
        return;
      const data = this.data;
      if (!this._seeded && data.length) {
        this.seed(data);
        this._seeded = true;
      }
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = `
      ${glassBaseStyles()}
      :host { display: block; font-family: var(--glass-font); color: var(--glass-text); }
      [role="tree"] { list-style: none; margin: 0; padding: 4px 2px; }
      [role="group"] { list-style: none; margin: 0; padding: 0; position: relative; }
      li { position: relative; }
      .row {
        display: flex; align-items: center; gap: 6px;
        padding: 4px 8px; border-radius: var(--glass-radius-sm);
        cursor: default; font-size: 13px; color: var(--glass-text);
        border: var(--glass-border-width) solid transparent;
      }
      .row:hover { background: var(--glass-hover); }
      .row:focus-visible { outline: 2px solid var(--accent-warm); outline-offset: -2px; }
      .row[aria-selected="true"] { background: var(--glass-hover); border-color: var(--glass-border); }
      .tw {
        width: 16px; height: 16px; flex: none; display: grid; place-items: center;
        color: var(--glass-text-muted); font-size: 10px; line-height: 1;
        transition: transform .15s;
      }
      .tw.open { transform: rotate(90deg); }
      .tw.leaf { visibility: hidden; }
      .icon { font-size: 12px; opacity: .8; flex: none; }
      .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .count { color: var(--glass-text-dim); font-size: 11px; margin-left: 2px; }
      /* Connector rail sits inside the indent, so pixel's 3px borders never
         double up against a nested row's own edge. */
      .kids { margin-left: 15px; padding-left: 9px; border-left: 1px solid var(--glass-grid); }
      .kids.nolines { border-left-color: transparent; }
      @media (prefers-reduced-motion: reduce) { .tw { transition: none } }
    `;
      root.append(style);
      const tree = document.createElement("ul");
      tree.setAttribute("role", "tree");
      tree.setAttribute("aria-label", this.getAttribute("label") || "Tree");
      root.append(tree);
      const vis = this.visible();
      if (!this._focus || !vis.some((v) => key(v.path) === this._focus)) {
        this._focus = vis.length ? key(vis[0].path) : null;
      }
      const build = (nodes, parent, path, level) => {
        nodes.forEach((n, i) => {
          const p = [...path, i];
          const k = key(p);
          const branch = !!n.children?.length;
          const open = branch && this._open.has(k);
          const li = document.createElement("li");
          const row = document.createElement("div");
          row.className = "row";
          row.setAttribute("role", "treeitem");
          row.setAttribute("aria-level", String(level));
          row.setAttribute("aria-setsize", String(nodes.length));
          row.setAttribute("aria-posinset", String(i + 1));
          if (branch)
            row.setAttribute("aria-expanded", String(open));
          if (this.selectable)
            row.setAttribute("aria-selected", String(this._selected === k));
          row.tabIndex = this._focus === k ? 0 : -1;
          row.dataset.path = k;
          const tw = document.createElement("span");
          tw.className = `tw${branch ? open ? " open" : "" : " leaf"}`;
          tw.textContent = "▶";
          row.append(tw);
          if (n.icon) {
            const ic = document.createElement("span");
            ic.className = "icon";
            ic.textContent = n.icon;
            row.append(ic);
          }
          const lb = document.createElement("span");
          lb.className = "label";
          lb.textContent = n.label;
          row.append(lb);
          if (branch) {
            const c = document.createElement("span");
            c.className = "count";
            c.textContent = String(n.children.length);
            row.append(c);
          }
          row.addEventListener("click", () => {
            this._focus = k;
            if (branch)
              this.toggle(p);
            else
              this.select(p);
            if (!branch)
              this.render();
          });
          row.addEventListener("keydown", (e) => this.onKey(e, p, branch, open));
          li.append(row);
          if (branch && open) {
            const g = document.createElement("ul");
            g.setAttribute("role", "group");
            g.className = `kids${this.lines ? "" : " nolines"}`;
            build(n.children, g, p, level + 1);
            li.append(g);
          }
          parent.append(li);
        });
      };
      build(data, tree, [], 1);
      const active = root.querySelector(`.row[data-path="${this._focus}"]`);
      if (active && this._movedFocus) {
        active.focus();
        this._movedFocus = false;
      }
    }
    _movedFocus = false;
    select(path) {
      const k = key(path);
      this._selected = k;
      const node = this.nodeAt(path);
      if (node)
        this.dispatchEvent(new CustomEvent("o-tree-select", {
          bubbles: true,
          composed: true,
          detail: { node, path, label: node.label }
        }));
    }
    moveTo(k) {
      this._focus = k;
      this._movedFocus = true;
      this.render();
    }
    onKey(e, path, branch, open) {
      const ev = e;
      const vis = this.visible();
      const idx = vis.findIndex((v) => key(v.path) === key(path));
      const go = (i) => {
        if (vis[i])
          this.moveTo(key(vis[i].path));
      };
      switch (ev.key) {
        case "ArrowDown":
          ev.preventDefault();
          go(idx + 1);
          break;
        case "ArrowUp":
          ev.preventDefault();
          go(idx - 1);
          break;
        case "ArrowRight":
          ev.preventDefault();
          if (branch && !open) {
            this._focus = key(path);
            this._movedFocus = true;
            this.toggle(path, true);
          } else if (branch && open)
            go(idx + 1);
          break;
        case "ArrowLeft":
          ev.preventDefault();
          if (branch && open) {
            this._focus = key(path);
            this._movedFocus = true;
            this.toggle(path, false);
          } else if (path.length > 1)
            this.moveTo(key(path.slice(0, -1)));
          break;
        case "Home":
          ev.preventDefault();
          go(0);
          break;
        case "End":
          ev.preventDefault();
          go(vis.length - 1);
          break;
        case "Enter":
        case " ":
          ev.preventDefault();
          if (branch)
            this.toggle(path);
          else {
            this.select(path);
            this.render();
          }
          break;
      }
    }
  }
  if (!customElements.get("o-tree-node"))
    customElements.define("o-tree-node", OTreeNode);
  if (!customElements.get("o-tree"))
    customElements.define("o-tree", OTree);

  // src/chartkit.ts
  var SERIES_SLOTS = 6;
  function seriesVar(i) {
    return `var(--glass-series-${Math.min(i, SERIES_SLOTS - 1) + 1})`;
  }
  var field = (row, key2) => row?.[key2];
  var num = (v) => {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
  };
  function fmt(n) {
    if (!Number.isFinite(n))
      return "—";
    const abs = Math.abs(n);
    const dp = abs >= 100 || Number.isInteger(n) ? 0 : abs >= 1 ? 1 : 2;
    return n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }
  function niceTicks(min, max, target = 5) {
    if (!Number.isFinite(min) || !Number.isFinite(max))
      return [0];
    if (min === max)
      return [min];
    const span = max - min;
    const raw = span / Math.max(1, target);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo;v <= hi + step / 1000; v += step)
      out.push(Math.abs(v) < step / 1000 ? 0 : +v.toFixed(10));
    return out;
  }
  function barPath(x, y, w, h, r = 4, horizontal = false) {
    const rr = Math.max(0, Math.min(r, horizontal ? w : h, w / 2, h / 2));
    if (h <= 0 || w <= 0)
      return "";
    if (rr === 0)
      return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
    if (horizontal) {
      return `M${x},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} H${x} Z`;
    }
    return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
  }
  var svgNS = "http://www.w3.org/2000/svg";
  var el = (name, attrs = {}) => {
    const n = document.createElementNS(svgNS, name);
    for (const [k, v] of Object.entries(attrs))
      n.setAttribute(k, String(v));
    return n;
  };
  function chartBaseStyles() {
    return `
    :host {
      display: block;
      font-family: var(--glass-font);
      color: var(--glass-text);
      container-type: inline-size;
    }
    .wrap {
      background: var(--glass-chart-surface);
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius);
      padding: 14px 16px 12px;
      box-shadow: var(--glass-elevation);
    }
    .title { font-size: 14px; font-weight: 600; margin: 0 0 2px; color: var(--glass-text); }
    .sub   { font-size: 12px; margin: 0 0 10px; color: var(--glass-text-muted); }
    svg { display: block; width: 100%; overflow: visible; }
    .grid  { stroke: var(--glass-grid); stroke-width: 1; }
    .axis-text {
      font-size: 11px; fill: var(--glass-text-muted);
      font-variant-numeric: tabular-nums; font-family: var(--glass-font);
    }
    .mark-label {
      font-size: 11px; fill: var(--glass-text); font-family: var(--glass-font);
      font-variant-numeric: tabular-nums; pointer-events: none;
    }
    .hit { fill: transparent; cursor: default; }
    .legend {
      display: flex; flex-wrap: wrap; gap: 4px 14px;
      margin-top: 10px; font-size: 12px; color: var(--glass-text-muted);
    }
    .legend button {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; padding: 2px 0; cursor: pointer;
      font: inherit; color: inherit; font-family: var(--glass-font);
    }
    .legend .key { width: 12px; height: 12px; border-radius: var(--glass-radius-xs); flex: none; }
    .legend .key.line { height: 3px; border-radius: 2px; }
    .legend button[aria-pressed="false"] { opacity: 0.45; }
    .tip {
      position: absolute; pointer-events: none; z-index: 5;
      background: var(--glass-chrome-bg); color: var(--glass-text);
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius-sm);
      padding: 7px 9px; font-size: 12px; min-width: 96px;
      box-shadow: var(--glass-shadow); opacity: 0; transition: opacity .12s;
      font-family: var(--glass-font);
    }
    .tip.on { opacity: 1; }
    .tip .cat { color: var(--glass-text-muted); margin-bottom: 4px; font-size: 11px; }
    .tip .row { display: flex; align-items: center; gap: 7px; margin-top: 2px; }
    .tip .k { width: 10px; height: 3px; border-radius: 2px; flex: none; }
    /* Values lead, labels follow — the reader already has the series. */
    .tip .v { font-weight: 600; font-variant-numeric: tabular-nums; }
    .tip .n { color: var(--glass-text-muted); }
    .host-rel { position: relative; }
    .tablebtn {
      margin-top: 8px; background: none; cursor: pointer;
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius-sm);
      color: var(--glass-text-muted); font: inherit; font-size: 11px;
      padding: 3px 8px; font-family: var(--glass-font);
    }
    .tablebtn:hover { background: var(--glass-hover); color: var(--glass-text); }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 12px; }
    th, td {
      text-align: left; padding: 5px 8px; color: var(--glass-text);
      border-bottom: 1px solid var(--glass-grid); font-variant-numeric: tabular-nums;
    }
    th { color: var(--glass-text-muted); font-weight: 500; }
    .empty { color: var(--glass-text-muted); font-size: 13px; padding: 20px 0; }
    @media (prefers-reduced-motion: reduce) { .tip { transition: none; } }
  `;
  }

  class OChartElement extends GlassElement {
    _data = [];
    _showTable = false;
    _ro = null;
    _hidden = new Set;
    get data() {
      return this._data;
    }
    set data(v) {
      this._data = Array.isArray(v) ? v : [];
      this.render();
    }
    get chartTitle() {
      return this.getAttribute("chart-title") ?? "";
    }
    set chartTitle(v) {
      this.setAttribute("chart-title", v);
    }
    get description() {
      return this.getAttribute("description") ?? "";
    }
    connectedCallback() {
      this.render();
      if (typeof ResizeObserver !== "undefined") {
        this._ro = new ResizeObserver(() => this.render());
        this._ro.observe(this);
      }
    }
    disconnectedCallback() {
      this._ro?.disconnect();
      this._ro = null;
    }
    attributeChangedCallback(_n, p, x) {
      if (p !== x)
        this.render();
    }
    toggleTable = () => {
      this._showTable = !this._showTable;
      this.render();
    };
    boxWidth() {
      const w = this.getBoundingClientRect().width || parseFloat(this.getAttribute("width") ?? "") || 520;
      return Math.max(220, w);
    }
  }

  // src/bar.ts
  var PAD = { top: 14, right: 14, bottom: 30, left: 46 };
  var MAX_THICK = 24;
  var GAP = 2;

  class OBar extends OChartElement {
    static get observedAttributes() {
      return ["x", "y", "series", "stacked", "horizontal", "chart-title", "description", "height"];
    }
    get x() {
      return this.getAttribute("x") ?? "label";
    }
    get y() {
      return this.getAttribute("y") ?? "value";
    }
    get stacked() {
      return this.hasAttribute("stacked");
    }
    get horizontal() {
      return this.hasAttribute("horizontal");
    }
    get series() {
      const raw = this.getAttribute("series");
      return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    }
    plotHeight() {
      const h = parseFloat(this.getAttribute("height") ?? "");
      return Number.isFinite(h) ? h : 220;
    }
    render() {
      const root = this.shadowRoot;
      if (!root)
        return;
      const rows = this._data;
      const keys = this.series;
      const multi = keys.length > 0;
      const shown = multi ? keys.slice(0, SERIES_SLOTS) : [];
      const folded = multi ? keys.slice(SERIES_SLOTS) : [];
      const active = shown.filter((k) => !this._hidden.has(k));
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = chartBaseStyles();
      root.append(style);
      const wrap = document.createElement("div");
      wrap.className = "wrap host-rel";
      root.append(wrap);
      if (this.chartTitle) {
        const h = document.createElement("p");
        h.className = "title";
        h.textContent = this.chartTitle;
        wrap.append(h);
      }
      if (this.description) {
        const d = document.createElement("p");
        d.className = "sub";
        d.textContent = this.description;
        wrap.append(d);
      }
      if (!rows.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = "No data";
        wrap.append(e);
        return;
      }
      const W = this.boxWidth() - 34;
      const H = this.plotHeight();
      const iw = Math.max(60, W - PAD.left - PAD.right);
      const ih = Math.max(60, H - PAD.top - PAD.bottom);
      const valueOf = (r, k) => num(r[k]);
      const totals = rows.map((r) => multi ? this.stacked ? active.reduce((a, k) => a + valueOf(r, k), 0) : Math.max(0, ...active.map((k) => valueOf(r, k))) : num(r[this.y]));
      const folUnits = folded.length ? rows.map((r) => folded.reduce((a, k) => a + valueOf(r, k), 0)) : rows.map(() => 0);
      const maxV = Math.max(0, ...totals.map((t, i) => t + (this.stacked ? folUnits[i] : 0)));
      const ticks = niceTicks(0, maxV || 1);
      const top = ticks[ticks.length - 1] || 1;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
      svg.setAttribute("aria-label", this.chartTitle || "Bar chart");
      wrap.append(svg);
      for (const t of ticks) {
        const p = t / top;
        if (this.horizontal) {
          const gx = PAD.left + p * iw;
          svg.append(el("line", { class: "grid", x1: gx, x2: gx, y1: PAD.top, y2: PAD.top + ih }));
          const lb = el("text", { class: "axis-text", x: gx, y: PAD.top + ih + 16, "text-anchor": "middle" });
          lb.textContent = fmt(t);
          svg.append(lb);
        } else {
          const gy = PAD.top + ih - p * ih;
          svg.append(el("line", { class: "grid", x1: PAD.left, x2: PAD.left + iw, y1: gy, y2: gy }));
          const lb = el("text", { class: "axis-text", x: PAD.left - 8, y: gy + 4, "text-anchor": "end" });
          lb.textContent = fmt(t);
          svg.append(lb);
        }
      }
      const band = (this.horizontal ? ih : iw) / rows.length;
      const groups = multi ? this.stacked ? 1 : active.length || 1 : 1;
      const thick = Math.min(MAX_THICK, Math.max(3, band * 0.68 / groups - (groups > 1 ? GAP : 0)));
      const single = !multi || active.length <= 1;
      rows.forEach((row, ri) => {
        const cat = String(row[this.x] ?? "");
        const c0 = ri * band + band / 2;
        const stackSegs = [];
        if (multi) {
          active.forEach((k) => stackSegs.push({ key: k, v: valueOf(row, k), slot: shown.indexOf(k) }));
          if (folded.length && folUnits[ri] > 0)
            stackSegs.push({ key: "Other", v: folUnits[ri], slot: SERIES_SLOTS - 1 });
        } else {
          stackSegs.push({ key: this.y, v: num(row[this.y]), slot: 0 });
        }
        let acc = 0;
        stackSegs.forEach((seg, si) => {
          const frac = seg.v / top;
          const colour = single && !multi ? seriesVar(0) : seriesVar(seg.slot);
          let px, py, pw, ph;
          if (this.stacked || stackSegs.length === 1) {
            const len = Math.max(0, frac * (this.horizontal ? iw : ih) - (si ? GAP : 0));
            if (this.horizontal) {
              px = PAD.left + acc / top * iw + (si ? GAP : 0);
              py = PAD.top + c0 - thick / 2;
              pw = len;
              ph = thick;
            } else {
              px = PAD.left + c0 - thick / 2;
              py = PAD.top + ih - acc / top * ih - len - (si ? GAP : 0);
              pw = thick;
              ph = len;
            }
            acc += seg.v;
          } else {
            const off = (si - (stackSegs.length - 1) / 2) * (thick + GAP);
            if (this.horizontal) {
              px = PAD.left;
              py = PAD.top + c0 + off - thick / 2;
              pw = Math.max(0, frac * iw);
              ph = thick;
            } else {
              px = PAD.left + c0 + off - thick / 2;
              py = PAD.top + ih - frac * ih;
              pw = thick;
              ph = Math.max(0, frac * ih);
            }
          }
          if (pw <= 0 || ph <= 0)
            return;
          const isEnd = !this.stacked || si === stackSegs.length - 1;
          const path = el("path", {
            d: barPath(px, py, pw, ph, isEnd ? 4 : 0, this.horizontal),
            fill: colour,
            class: "mark"
          });
          path.setAttribute("data-cat", cat);
          path.setAttribute("data-key", seg.key);
          path.setAttribute("data-val", String(seg.v));
          svg.append(path);
        });
        const tx = this.horizontal ? PAD.left - 8 : PAD.left + c0;
        const ty = this.horizontal ? PAD.top + c0 + 4 : PAD.top + ih + 16;
        const ct = el("text", {
          class: "axis-text",
          x: tx,
          y: ty,
          "text-anchor": this.horizontal ? "end" : "middle"
        });
        ct.textContent = cat;
        svg.append(ct);
        if (!multi) {
          const v = num(row[this.y]);
          const txt = fmt(v);
          const est = txt.length * 6.4;
          const frac = v / top;
          if (this.horizontal) {
            const endX = PAD.left + frac * iw;
            if (endX + est + 8 < PAD.left + iw + PAD.right) {
              const l = el("text", { class: "mark-label", x: endX + 6, y: PAD.top + c0 + 4 });
              l.textContent = txt;
              svg.append(l);
            }
          } else {
            const endY = PAD.top + ih - frac * ih;
            if (endY - 6 > PAD.top && thick > 16) {
              const l = el("text", { class: "mark-label", x: PAD.left + c0, y: endY - 6, "text-anchor": "middle" });
              l.textContent = txt;
              svg.append(l);
            }
          }
        }
        const hit = el("rect", this.horizontal ? { class: "hit", x: PAD.left, y: PAD.top + ri * band, width: iw, height: band } : { class: "hit", x: PAD.left + ri * band, y: PAD.top, width: band, height: ih });
        hit.setAttribute("data-ri", String(ri));
        hit.setAttribute("tabindex", "0");
        hit.setAttribute("role", "button");
        hit.setAttribute("aria-label", `${cat}: ${stackSegs.map((s) => `${s.key} ${fmt(s.v)}`).join(", ")}`);
        svg.append(hit);
      });
      this.attachTip(wrap, svg, rows, multi ? [...active, ...folded.length ? ["Other"] : []] : [this.y], folded);
      if (multi && shown.length + (folded.length ? 1 : 0) >= 2) {
        this.legend(wrap, shown, folded.length > 0);
      }
      this.tableView(wrap, rows, multi ? [...shown, ...folded.length ? ["Other"] : []] : [this.y], folUnits);
    }
    attachTip(wrap, svg, rows, keys, folded) {
      const tip = document.createElement("div");
      tip.className = "tip";
      wrap.append(tip);
      const show = (ri, cx, cy) => {
        const row = rows[ri];
        if (!row)
          return;
        tip.innerHTML = "";
        const cat = document.createElement("div");
        cat.className = "cat";
        cat.textContent = String(row[this.x] ?? "");
        tip.append(cat);
        for (const k of keys) {
          const v = k === "Other" ? folded.reduce((a, f) => a + num(row[f]), 0) : num(row[k]);
          const r = document.createElement("div");
          r.className = "row";
          const key2 = document.createElement("span");
          key2.className = "k";
          const slot = k === "Other" ? SERIES_SLOTS - 1 : Math.max(0, this.series.indexOf(k));
          key2.style.background = seriesVar(this.series.length ? slot : 0);
          const val = document.createElement("span");
          val.className = "v";
          val.textContent = fmt(v);
          const nm = document.createElement("span");
          nm.className = "n";
          nm.textContent = k;
          r.append(key2, val, nm);
          tip.append(r);
        }
        tip.classList.add("on");
        const b = wrap.getBoundingClientRect();
        tip.style.left = `${Math.min(Math.max(6, cx - b.left + 12), b.width - 130)}px`;
        tip.style.top = `${Math.max(4, cy - b.top - 10)}px`;
      };
      const hide = () => tip.classList.remove("on");
      svg.addEventListener("pointermove", (e) => {
        const t = e.target.closest(".hit");
        if (!t)
          return hide();
        show(Number(t.getAttribute("data-ri")), e.clientX, e.clientY);
      });
      svg.addEventListener("pointerleave", hide);
      svg.addEventListener("focusin", (e) => {
        const t = e.target.closest(".hit");
        if (!t)
          return;
        const r = t.getBoundingClientRect();
        show(Number(t.getAttribute("data-ri")), r.left + r.width / 2, r.top);
      });
      svg.addEventListener("focusout", hide);
    }
    legend(wrap, keys, hasOther) {
      const box = document.createElement("div");
      box.className = "legend";
      const items = hasOther ? [...keys, "Other"] : keys;
      items.forEach((k, i) => {
        const b = document.createElement("button");
        b.type = "button";
        const on = !this._hidden.has(k);
        b.setAttribute("aria-pressed", String(on));
        const sw = document.createElement("span");
        sw.className = "key";
        sw.style.background = seriesVar(k === "Other" ? SERIES_SLOTS - 1 : i);
        const t = document.createElement("span");
        t.textContent = k;
        b.append(sw, t);
        if (k !== "Other")
          b.addEventListener("click", () => {
            this._hidden.has(k) ? this._hidden.delete(k) : this._hidden.add(k);
            this.render();
          });
        box.append(b);
      });
      wrap.append(box);
    }
    tableView(wrap, rows, keys, folUnits) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tablebtn";
      btn.textContent = this._showTable ? "Hide table" : "Show table";
      btn.setAttribute("aria-expanded", String(this._showTable));
      btn.addEventListener("click", this.toggleTable);
      wrap.append(btn);
      if (!this._showTable)
        return;
      const tb = document.createElement("table");
      const hr = document.createElement("tr");
      for (const h of [this.x, ...keys]) {
        const th = document.createElement("th");
        th.textContent = h;
        hr.append(th);
      }
      tb.append(hr);
      rows.forEach((r, ri) => {
        const tr = document.createElement("tr");
        const c0 = document.createElement("td");
        c0.textContent = String(r[this.x] ?? "");
        tr.append(c0);
        for (const k of keys) {
          const td = document.createElement("td");
          td.textContent = fmt(k === "Other" ? folUnits[ri] : num(r[k]));
          tr.append(td);
        }
        tb.append(tr);
      });
      wrap.append(tb);
    }
  }
  if (!customElements.get("o-bar"))
    customElements.define("o-bar", OBar);

  // src/line.ts
  var PAD2 = { top: 16, right: 52, bottom: 30, left: 48 };

  class OLine extends OChartElement {
    static get observedAttributes() {
      return ["x", "y", "series", "area", "chart-title", "description", "height"];
    }
    get x() {
      return this.getAttribute("x") ?? "label";
    }
    get y() {
      return this.getAttribute("y") ?? "value";
    }
    get area() {
      return this.hasAttribute("area");
    }
    get series() {
      const raw = this.getAttribute("series");
      return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    }
    plotHeight() {
      const h = parseFloat(this.getAttribute("height") ?? "");
      return Number.isFinite(h) ? h : 220;
    }
    render() {
      const root = this.shadowRoot;
      if (!root)
        return;
      const rows = this._data;
      const declared = this.series;
      const keys = declared.length ? declared : [this.y];
      const shown = keys.slice(0, SERIES_SLOTS);
      const active = shown.filter((k) => !this._hidden.has(k));
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = chartBaseStyles();
      root.append(style);
      const wrap = document.createElement("div");
      wrap.className = "wrap host-rel";
      root.append(wrap);
      if (this.chartTitle) {
        const h = document.createElement("p");
        h.className = "title";
        h.textContent = this.chartTitle;
        wrap.append(h);
      }
      if (this.description) {
        const d = document.createElement("p");
        d.className = "sub";
        d.textContent = this.description;
        wrap.append(d);
      }
      if (!rows.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = "No data";
        wrap.append(e);
        return;
      }
      const W = this.boxWidth() - 34;
      const H = this.plotHeight();
      const iw = Math.max(60, W - PAD2.left - PAD2.right);
      const ih = Math.max(60, H - PAD2.top - PAD2.bottom);
      const all = active.flatMap((k) => rows.map((r) => num(r[k])));
      const lo = Math.min(0, ...all);
      const hi = Math.max(1, ...all);
      const ticks = niceTicks(lo, hi);
      const t0 = ticks[0], t1 = ticks[ticks.length - 1];
      const span = t1 - t0 || 1;
      const px = (i) => PAD2.left + (rows.length === 1 ? iw / 2 : i / (rows.length - 1) * iw);
      const py = (v) => PAD2.top + ih - (v - t0) / span * ih;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
      svg.setAttribute("aria-label", this.chartTitle || "Line chart");
      wrap.append(svg);
      for (const t of ticks) {
        const gy = py(t);
        svg.append(el("line", { class: "grid", x1: PAD2.left, x2: PAD2.left + iw, y1: gy, y2: gy }));
        const lb = el("text", { class: "axis-text", x: PAD2.left - 8, y: gy + 4, "text-anchor": "end" });
        lb.textContent = fmt(t);
        svg.append(lb);
      }
      const every = Math.max(1, Math.ceil(rows.length / Math.max(2, Math.floor(iw / 62))));
      rows.forEach((r, i) => {
        if (i % every && i !== rows.length - 1)
          return;
        const lb = el("text", { class: "axis-text", x: px(i), y: PAD2.top + ih + 16, "text-anchor": "middle" });
        lb.textContent = String(r[this.x] ?? "");
        svg.append(lb);
      });
      const crosshair = el("line", {
        class: "grid",
        x1: 0,
        x2: 0,
        y1: PAD2.top,
        y2: PAD2.top + ih,
        opacity: "0",
        "stroke-width": "1"
      });
      svg.append(crosshair);
      active.forEach((k) => {
        const slot = shown.indexOf(k);
        const colour = seriesVar(slot);
        const pts = rows.map((r, i) => [px(i), py(num(r[k]))]);
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
        if (this.area && active.length === 1) {
          const base = py(Math.max(t0, 0));
          svg.append(el("path", {
            d: `${d} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`,
            fill: colour,
            opacity: "0.1"
          }));
        }
        svg.append(el("path", {
          d,
          fill: "none",
          stroke: colour,
          "stroke-width": "2",
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        }));
        const last = pts[pts.length - 1];
        svg.append(el("circle", {
          cx: last[0],
          cy: last[1],
          r: 4.5,
          fill: colour,
          stroke: "var(--glass-chart-surface)",
          "stroke-width": "2"
        }));
        if (active.length <= 4) {
          const l = el("text", { class: "mark-label", x: last[0] + 9, y: last[1] + 4 });
          l.textContent = fmt(num(rows[rows.length - 1][k]));
          svg.append(l);
        }
      });
      const dots = [];
      active.forEach((k) => {
        const slot = shown.indexOf(k);
        const c = el("circle", {
          cx: 0,
          cy: 0,
          r: 4,
          fill: seriesVar(slot),
          stroke: "var(--glass-chart-surface)",
          "stroke-width": "2",
          opacity: "0"
        });
        dots.push(c);
        svg.append(c);
      });
      const hit = el("rect", {
        class: "hit",
        x: PAD2.left - 4,
        y: PAD2.top,
        width: iw + 8,
        height: ih
      });
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "application");
      hit.setAttribute("aria-label", `${this.chartTitle || "Line chart"}: use arrow keys to step through points`);
      svg.append(hit);
      const tip = document.createElement("div");
      tip.className = "tip";
      wrap.append(tip);
      let idx = -1;
      const at = (i, clientX, clientY) => {
        if (i < 0 || i >= rows.length)
          return;
        idx = i;
        const gx = px(i);
        crosshair.setAttribute("x1", String(gx));
        crosshair.setAttribute("x2", String(gx));
        crosshair.setAttribute("opacity", "1");
        active.forEach((k, di) => {
          const d = dots[di];
          d.setAttribute("cx", String(gx));
          d.setAttribute("cy", String(py(num(rows[i][k]))));
          d.setAttribute("opacity", "1");
        });
        tip.innerHTML = "";
        const cat = document.createElement("div");
        cat.className = "cat";
        cat.textContent = String(rows[i][this.x] ?? "");
        tip.append(cat);
        active.forEach((k) => {
          const r = document.createElement("div");
          r.className = "row";
          const key2 = document.createElement("span");
          key2.className = "k";
          key2.style.background = seriesVar(shown.indexOf(k));
          const v = document.createElement("span");
          v.className = "v";
          v.textContent = fmt(num(rows[i][k]));
          const n = document.createElement("span");
          n.className = "n";
          n.textContent = k;
          r.append(key2, v, n);
          tip.append(r);
        });
        tip.classList.add("on");
        const b = wrap.getBoundingClientRect();
        const lx = clientX !== undefined ? clientX - b.left : gx;
        tip.style.left = `${Math.min(Math.max(6, lx + 12), Math.max(6, b.width - 140))}px`;
        tip.style.top = `${clientY !== undefined ? Math.max(4, clientY - b.top - 10) : PAD2.top}px`;
      };
      const off = () => {
        crosshair.setAttribute("opacity", "0");
        dots.forEach((d) => d.setAttribute("opacity", "0"));
        tip.classList.remove("on");
      };
      svg.addEventListener("pointermove", (e) => {
        const b = svg.getBoundingClientRect();
        const rel = (e.clientX - b.left) / b.width * W;
        if (rel < PAD2.left - 8 || rel > PAD2.left + iw + 8)
          return off();
        const i = rows.length === 1 ? 0 : Math.round((rel - PAD2.left) / iw * (rows.length - 1));
        at(Math.max(0, Math.min(rows.length - 1, i)), e.clientX, e.clientY);
      });
      svg.addEventListener("pointerleave", off);
      hit.addEventListener("focus", () => at(idx < 0 ? 0 : idx));
      hit.addEventListener("blur", off);
      hit.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "ArrowRight") {
          e.preventDefault();
          at(Math.min(rows.length - 1, idx + 1));
        }
        if (k === "ArrowLeft") {
          e.preventDefault();
          at(Math.max(0, idx - 1));
        }
      });
      if (shown.length >= 2) {
        const box = document.createElement("div");
        box.className = "legend";
        shown.forEach((k, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-pressed", String(!this._hidden.has(k)));
          const sw = document.createElement("span");
          sw.className = "key line";
          sw.style.background = seriesVar(i);
          const t = document.createElement("span");
          t.textContent = k;
          b.append(sw, t);
          b.addEventListener("click", () => {
            this._hidden.has(k) ? this._hidden.delete(k) : this._hidden.add(k);
            this.render();
          });
          box.append(b);
        });
        wrap.append(box);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tablebtn";
      btn.textContent = this._showTable ? "Hide table" : "Show table";
      btn.setAttribute("aria-expanded", String(this._showTable));
      btn.addEventListener("click", this.toggleTable);
      wrap.append(btn);
      if (this._showTable) {
        const tb = document.createElement("table");
        const hr = document.createElement("tr");
        for (const h of [this.x, ...shown]) {
          const th = document.createElement("th");
          th.textContent = h;
          hr.append(th);
        }
        tb.append(hr);
        rows.forEach((r) => {
          const tr = document.createElement("tr");
          const c = document.createElement("td");
          c.textContent = String(r[this.x] ?? "");
          tr.append(c);
          for (const k of shown) {
            const td = document.createElement("td");
            td.textContent = fmt(num(r[k]));
            tr.append(td);
          }
          tb.append(tr);
        });
        wrap.append(tb);
      }
    }
  }
  if (!customElements.get("o-line"))
    customElements.define("o-line", OLine);

  // src/pie.ts
  var GAP_DEG = 1.2;

  class OPie extends OChartElement {
    static get observedAttributes() {
      return ["label", "value", "donut", "max-slices", "chart-title", "description", "height"];
    }
    get labelKey() {
      return this.getAttribute("label") ?? "label";
    }
    get valueKey() {
      return this.getAttribute("value") ?? "value";
    }
    get donut() {
      return this.hasAttribute("donut");
    }
    get maxSlices() {
      const n = parseInt(this.getAttribute("max-slices") ?? "", 10);
      return Number.isFinite(n) ? Math.max(2, Math.min(SERIES_SLOTS, n)) : SERIES_SLOTS;
    }
    plotHeight() {
      const h = parseFloat(this.getAttribute("height") ?? "");
      return Number.isFinite(h) ? h : 240;
    }
    slices() {
      const rows = this._data.map((r) => ({
        label: String(r[this.labelKey] ?? ""),
        value: num(r[this.valueKey])
      })).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
      const total = rows.reduce((a, s) => a + s.value, 0) || 1;
      const cap = this.maxSlices;
      const head = rows.slice(0, rows.length > cap ? cap - 1 : cap);
      const tail = rows.slice(head.length);
      const out = head.map((s, i) => ({ ...s, slot: i, pct: s.value / total }));
      if (tail.length) {
        const v = tail.reduce((a, s) => a + s.value, 0);
        out.push({ label: "Other", value: v, slot: SERIES_SLOTS - 1, pct: v / total });
      }
      return out;
    }
    render() {
      const root = this.shadowRoot;
      if (!root)
        return;
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = chartBaseStyles();
      root.append(style);
      const wrap = document.createElement("div");
      wrap.className = "wrap host-rel";
      root.append(wrap);
      if (this.chartTitle) {
        const h = document.createElement("p");
        h.className = "title";
        h.textContent = this.chartTitle;
        wrap.append(h);
      }
      if (this.description) {
        const d = document.createElement("p");
        d.className = "sub";
        d.textContent = this.description;
        wrap.append(d);
      }
      const sl = this.slices();
      if (!sl.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = "No data";
        wrap.append(e);
        return;
      }
      const W = this.boxWidth() - 34;
      const H = this.plotHeight();
      const cx = W / 2, cy = H / 2;
      const R = Math.max(40, Math.min(cx - 74, cy - 12));
      const inner = this.donut ? R * 0.58 : 0;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
      svg.setAttribute("aria-label", this.chartTitle || "Pie chart");
      wrap.append(svg);
      const polar = (r, deg) => {
        const a = (deg - 90) * Math.PI / 180;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      };
      let cur = 0;
      const total = sl.reduce((a, s) => a + s.value, 0) || 1;
      sl.forEach((s) => {
        const sweep = s.value / total * 360;
        const a0 = cur + GAP_DEG / 2;
        const a1 = cur + sweep - GAP_DEG / 2;
        cur += sweep;
        if (a1 <= a0)
          return;
        const large = a1 - a0 > 180 ? 1 : 0;
        const [x0, y0] = polar(R, a0), [x1, y1] = polar(R, a1);
        let d;
        if (inner > 0) {
          const [ix1, iy1] = polar(inner, a1), [ix0, iy0] = polar(inner, a0);
          d = `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${ix1},${iy1} A${inner},${inner} 0 ${large} 0 ${ix0},${iy0} Z`;
        } else {
          d = `M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`;
        }
        const p = el("path", { d, fill: seriesVar(s.slot), class: "mark" });
        p.setAttribute("data-label", s.label);
        p.setAttribute("data-val", String(s.value));
        p.setAttribute("tabindex", "0");
        p.setAttribute("role", "button");
        p.setAttribute("aria-label", `${s.label}: ${fmt(s.value)}, ${(s.pct * 100).toFixed(1)}%`);
        svg.append(p);
        if (s.pct >= 0.06) {
          const mid = (a0 + a1) / 2;
          const [lx, ly] = polar(R + 14, mid);
          const anchor = lx < cx - 2 ? "end" : lx > cx + 2 ? "start" : "middle";
          const t = el("text", {
            class: "mark-label",
            x: lx,
            y: ly + 4,
            "text-anchor": anchor
          });
          t.textContent = `${(s.pct * 100).toFixed(0)}%`;
          svg.append(t);
        }
      });
      if (this.donut) {
        const big = el("text", {
          x: cx,
          y: cy - 2,
          "text-anchor": "middle",
          class: "mark-label",
          "font-size": "20",
          "font-weight": "600"
        });
        big.textContent = fmt(total);
        svg.append(big);
        const cap = el("text", { x: cx, y: cy + 15, "text-anchor": "middle", class: "axis-text" });
        cap.textContent = "total";
        svg.append(cap);
      }
      const tip = document.createElement("div");
      tip.className = "tip";
      wrap.append(tip);
      const show = (label, clientX, clientY) => {
        const s = sl.find((z) => z.label === label);
        if (!s)
          return;
        tip.innerHTML = "";
        const c = document.createElement("div");
        c.className = "cat";
        c.textContent = s.label;
        tip.append(c);
        const r = document.createElement("div");
        r.className = "row";
        const k = document.createElement("span");
        k.className = "k";
        k.style.background = seriesVar(s.slot);
        const v = document.createElement("span");
        v.className = "v";
        v.textContent = fmt(s.value);
        const n = document.createElement("span");
        n.className = "n";
        n.textContent = `${(s.pct * 100).toFixed(1)}%`;
        r.append(k, v, n);
        tip.append(r);
        tip.classList.add("on");
        const b = wrap.getBoundingClientRect();
        tip.style.left = `${Math.min(Math.max(6, clientX - b.left + 12), Math.max(6, b.width - 140))}px`;
        tip.style.top = `${Math.max(4, clientY - b.top - 10)}px`;
      };
      const hide = () => tip.classList.remove("on");
      svg.addEventListener("pointermove", (e) => {
        const t = e.target.closest(".mark");
        if (!t)
          return hide();
        show(t.getAttribute("data-label") ?? "", e.clientX, e.clientY);
      });
      svg.addEventListener("pointerleave", hide);
      svg.addEventListener("focusin", (e) => {
        const t = e.target.closest(".mark");
        if (!t)
          return;
        const r = t.getBoundingClientRect();
        show(t.getAttribute("data-label") ?? "", r.left + r.width / 2, r.top + r.height / 2);
      });
      svg.addEventListener("focusout", hide);
      const box = document.createElement("div");
      box.className = "legend";
      sl.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-pressed", "true");
        b.disabled = true;
        b.style.cursor = "default";
        const sw = document.createElement("span");
        sw.className = "key";
        sw.style.background = seriesVar(s.slot);
        const t = document.createElement("span");
        t.textContent = `${s.label} · ${fmt(s.value)}`;
        b.append(sw, t);
        box.append(b);
      });
      wrap.append(box);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tablebtn";
      btn.textContent = this._showTable ? "Hide table" : "Show table";
      btn.setAttribute("aria-expanded", String(this._showTable));
      btn.addEventListener("click", this.toggleTable);
      wrap.append(btn);
      if (this._showTable) {
        const tb = document.createElement("table");
        const hr = document.createElement("tr");
        for (const h of [this.labelKey, this.valueKey, "share"]) {
          const th = document.createElement("th");
          th.textContent = h;
          hr.append(th);
        }
        tb.append(hr);
        sl.forEach((s) => {
          const tr = document.createElement("tr");
          const a = document.createElement("td");
          a.textContent = s.label;
          const b2 = document.createElement("td");
          b2.textContent = fmt(s.value);
          const c2 = document.createElement("td");
          c2.textContent = `${(s.pct * 100).toFixed(1)}%`;
          tr.append(a, b2, c2);
          tb.append(tr);
        });
        wrap.append(tb);
      }
    }
  }
  if (!customElements.get("o-pie"))
    customElements.define("o-pie", OPie);

  // src/collapse.ts
  var uid = 0;

  class OCollapse extends GlassElement {
    static get observedAttributes() {
      return ["label", "open", "disabled"];
    }
    _id = `oc-${++uid}`;
    _rendered = false;
    get label() {
      return this.getAttribute("label") ?? "";
    }
    set label(v) {
      this.setAttribute("label", v);
    }
    get open() {
      return this.hasAttribute("open");
    }
    set open(v) {
      v ? this.setAttribute("open", "") : this.removeAttribute("open");
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(v) {
      v ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
    }
    get depth() {
      let d = 0;
      let p = this.parentElement;
      while (p) {
        if (p.tagName === "O-COLLAPSE")
          d++;
        p = p.parentElement;
      }
      return d;
    }
    connectedCallback() {
      this.render();
      this._rendered = true;
    }
    attributeChangedCallback(name, prev, next) {
      if (!this._rendered)
        return;
      if (prev === next)
        return;
      if (name === "open") {
        this.sync();
        return;
      }
      this.render();
    }
    toggle(force) {
      if (this.disabled)
        return;
      const next = force === undefined ? !this.open : force;
      if (next === this.open)
        return;
      this.open = next;
      this.dispatchEvent(new CustomEvent("o-collapse-toggle", {
        bubbles: true,
        composed: true,
        detail: { open: next, label: this.label }
      }));
    }
    sync() {
      const root = this.shadowRoot;
      if (!root)
        return;
      const head = root.querySelector(".head");
      const body = root.querySelector(".body");
      head?.setAttribute("aria-expanded", String(this.open));
      body?.classList.toggle("open", this.open);
      head?.classList.toggle("open", this.open);
    }
    onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this.toggle();
      }
    };
    render() {
      const root = this.shadowRoot;
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
        <button class="head${this.open ? " open" : ""}" type="button"
                id="${this._id}-h"
                aria-expanded="${this.open}" aria-controls="${this._id}-b"
                ${this.disabled ? "disabled" : ""}>
          <span class="chev"></span>
          <span class="label">${this.label}</span>
          <span class="count"><slot name="meta"></slot></span>
        </button>
        <div class="body${this.open ? " open" : ""}" id="${this._id}-b" role="region"
             aria-labelledby="${this._id}-h">
          <div class="inner"><div class="pad"><slot></slot></div></div>
        </div>
      </div>
    `;
      const head = root.querySelector(".head");
      head.addEventListener("click", () => this.toggle());
      head.addEventListener("keydown", this.onKey);
    }
  }

  class OCollapseGroup extends GlassElement {
    static get observedAttributes() {
      return ["accordion", "storage-key"];
    }
    get accordion() {
      return this.hasAttribute("accordion");
    }
    set accordion(v) {
      v ? this.setAttribute("accordion", "") : this.removeAttribute("accordion");
    }
    get panels() {
      return Array.from(this.querySelectorAll("o-collapse"));
    }
    get topLevel() {
      return this.panels.filter((p) => p.depth === 0);
    }
    get openLabels() {
      return this.panels.filter((p) => p.open).map((p) => p.label);
    }
    set openLabels(labels) {
      const want = new Set(labels);
      this.panels.forEach((p) => p.toggle(want.has(p.label)));
    }
    connectedCallback() {
      this.attachShadowOnce();
      this.addEventListener("o-collapse-toggle", this.onToggle);
      requestAnimationFrame(() => this.restore());
    }
    disconnectedCallback() {
      this.removeEventListener("o-collapse-toggle", this.onToggle);
    }
    attachShadowOnce() {
      if (this.shadowRoot.childElementCount)
        return;
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
      </style>
      <slot></slot>
    `;
    }
    collapseAll(opts = {}) {
      this.setAll(false, opts);
    }
    expandAll(opts = {}) {
      this.setAll(true, opts);
    }
    setAll(open, opts = {}) {
      const list = opts.topLevelOnly ? this.topLevel : this.panels;
      list.forEach((p) => p.toggle(open));
    }
    collapse(labels) {
      this.setMany(labels, false);
    }
    expand(labels) {
      this.setMany(labels, true);
    }
    setMany(labels, open) {
      const want = new Set(labels);
      this.panels.filter((p) => want.has(p.label)).forEach((p) => p.toggle(open));
    }
    onToggle = (e) => {
      const target = e.target;
      if (this.accordion && e.detail.open) {
        this.panels.filter((p) => p !== target && p.open && p.depth === target.depth).forEach((p) => p.toggle(false));
      }
      this.persist();
    };
    storageArea() {
      const key2 = this.getAttribute("storage-key");
      if (!key2)
        return null;
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    persist() {
      const store = this.storageArea();
      const key2 = this.getAttribute("storage-key");
      if (!store || !key2)
        return;
      try {
        store.setItem(key2, JSON.stringify(this.openLabels));
      } catch {}
    }
    restore() {
      const store = this.storageArea();
      const key2 = this.getAttribute("storage-key");
      if (!store || !key2)
        return;
      try {
        const raw = store.getItem(key2);
        if (!raw)
          return;
        const labels = JSON.parse(raw);
        if (Array.isArray(labels))
          this.openLabels = labels;
      } catch {}
    }
  }
  if (!customElements.get("o-collapse"))
    customElements.define("o-collapse", OCollapse);
  if (!customElements.get("o-collapse-group"))
    customElements.define("o-collapse-group", OCollapseGroup);

  // src/sidebar.ts
  var uid2 = 0;

  class OSidebar extends GlassElement {
    static get observedAttributes() {
      return ["side", "collapsed", "fixed", "width", "rail-width", "label", "breakpoint"];
    }
    _id = `os-${++uid2}`;
    _rendered = false;
    _mq = null;
    _autoCollapsed = false;
    _userSet = false;
    get side() {
      return this.getAttribute("side") === "right" ? "right" : "left";
    }
    set side(v) {
      this.setAttribute("side", v);
    }
    get collapsed() {
      return this.hasAttribute("collapsed");
    }
    set collapsed(v) {
      v ? this.setAttribute("collapsed", "") : this.removeAttribute("collapsed");
    }
    get fixed() {
      return this.hasAttribute("fixed");
    }
    set fixed(v) {
      v ? this.setAttribute("fixed", "") : this.removeAttribute("fixed");
    }
    get width() {
      return Math.max(0, parseInt(this.getAttribute("width") ?? "240") || 240);
    }
    set width(v) {
      this.setAttribute("width", String(v));
    }
    get railWidth() {
      return Math.max(0, parseInt(this.getAttribute("rail-width") ?? "52") || 52);
    }
    set railWidth(v) {
      this.setAttribute("rail-width", String(v));
    }
    get label() {
      return this.getAttribute("label") ?? "";
    }
    set label(v) {
      this.setAttribute("label", v);
    }
    get breakpoint() {
      return Math.max(0, parseInt(this.getAttribute("breakpoint") ?? "820") || 820);
    }
    set breakpoint(v) {
      this.setAttribute("breakpoint", String(v));
    }
    get overlaying() {
      return !!this._mq?.matches;
    }
    get currentWidth() {
      return this.collapsed ? this.railWidth : this.width;
    }
    connectedCallback() {
      this.render();
      this._rendered = true;
      this.watchViewport();
      this.applyResponsiveDefault();
      this.publishOffset();
    }
    disconnectedCallback() {
      this._mq?.removeEventListener("change", this.onViewport);
      this._mq = null;
      if (this.fixed)
        document.documentElement.style.removeProperty("--o-sidebar-offset");
    }
    attributeChangedCallback(name, prev, next) {
      if (!this._rendered)
        return;
      if (prev === next)
        return;
      if (name === "collapsed") {
        this.sync();
        this.publishOffset();
        return;
      }
      if (name === "breakpoint") {
        this.watchViewport();
        this.publishOffset();
        return;
      }
      this.render();
      this.publishOffset();
    }
    toggle(force) {
      const next = force === undefined ? !this.collapsed : force;
      if (next === this.collapsed)
        return;
      this._userSet = true;
      this._autoCollapsed = false;
      this.collapsed = next;
      this.dispatchEvent(new CustomEvent("o-sidebar-toggle", {
        bubbles: true,
        composed: true,
        detail: { collapsed: next }
      }));
    }
    collapse() {
      this.toggle(true);
    }
    expand() {
      this.toggle(false);
    }
    watchViewport() {
      this._mq?.removeEventListener("change", this.onViewport);
      if (typeof window.matchMedia !== "function")
        return;
      this._mq = window.matchMedia(`(max-width: ${this.breakpoint}px)`);
      this._mq.addEventListener("change", this.onViewport);
      this.syncOverlay();
    }
    onViewport = () => {
      this.syncOverlay();
      this.applyResponsiveDefault();
      this.publishOffset();
    };
    applyResponsiveDefault() {
      if (this._userSet)
        return;
      if (this.overlaying && !this.collapsed) {
        this.collapsed = true;
        this._autoCollapsed = true;
      } else if (!this.overlaying && this._autoCollapsed) {
        this.collapsed = false;
        this._autoCollapsed = false;
      }
    }
    syncOverlay() {
      this.classList.toggle("o-sidebar-overlay", this.overlaying);
    }
    publishOffset() {
      if (!this.fixed)
        return;
      const px = this.overlaying ? 0 : this.currentWidth;
      document.documentElement.style.setProperty("--o-sidebar-offset", `${px}px`);
    }
    sync() {
      const root = this.shadowRoot;
      if (!root)
        return;
      const btn = root.querySelector(".toggle");
      btn?.setAttribute("aria-expanded", String(!this.collapsed));
      btn?.setAttribute("title", this.collapsed ? "Expand sidebar" : "Collapse sidebar");
    }
    onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this.toggle();
      }
    };
    render() {
      const root = this.shadowRoot;
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
                  title="${this.collapsed ? "Expand sidebar" : "Collapse sidebar"}">
            <span class="bars" aria-hidden="true"><i></i></span>
          </button>
          <span class="title">${this.label}</span>
        </div>
        <div class="search"><slot name="search"></slot></div>
        <div class="body" id="${this._id}-b" part="body"><slot></slot></div>
        <div class="foot"><slot name="footer"></slot></div>
      </div>
    `;
      const btn = root.querySelector(".toggle");
      btn.addEventListener("click", () => this.toggle());
      btn.addEventListener("keydown", this.onKey);
      this.sync();
    }
  }
  if (!customElements.get("o-sidebar"))
    customElements.define("o-sidebar", OSidebar);

  // src/dropzone.ts
  class ODropZone extends GlassElement {
    static get observedAttributes() {
      return ["cols", "rows", "gap", "disabled"];
    }
    _hovered = null;
    _dragging = false;
    get cols() {
      return Math.max(1, parseInt(this.getAttribute("cols") ?? "3") || 3);
    }
    set cols(v) {
      this.setAttribute("cols", String(v));
    }
    get rows() {
      return Math.max(1, parseInt(this.getAttribute("rows") ?? "2") || 2);
    }
    set rows(v) {
      this.setAttribute("rows", String(v));
    }
    get gap() {
      return Math.max(0, parseInt(this.getAttribute("gap") ?? "8") || 0);
    }
    set gap(v) {
      this.setAttribute("gap", String(v));
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(v) {
      v ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
    }
    connectedCallback() {
      this.render();
      document.addEventListener("o-drag-start", this.onDragStart);
      document.addEventListener("o-drag-move", this.onDragMove);
      document.addEventListener("o-drag-end", this.onDragEnd);
    }
    disconnectedCallback() {
      document.removeEventListener("o-drag-start", this.onDragStart);
      document.removeEventListener("o-drag-move", this.onDragMove);
      document.removeEventListener("o-drag-end", this.onDragEnd);
    }
    attributeChangedCallback() {
      if (this.shadowRoot)
        this.render();
    }
    cellRect(col, row) {
      const r = this.getBoundingClientRect();
      const g = this.gap;
      const cw = (r.width - g * (this.cols + 1)) / this.cols;
      const ch = (r.height - g * (this.rows + 1)) / this.rows;
      return {
        col,
        row,
        x: r.left + g + col * (cw + g),
        y: r.top + g + row * (ch + g),
        width: cw,
        height: ch
      };
    }
    cellAt(px, py) {
      const r = this.getBoundingClientRect();
      if (px < r.left || px > r.right || py < r.top || py > r.bottom)
        return null;
      const g = this.gap;
      const cw = (r.width - g * (this.cols + 1)) / this.cols;
      const ch = (r.height - g * (this.rows + 1)) / this.rows;
      const col = Math.min(this.cols - 1, Math.max(0, Math.floor((px - r.left - g) / (cw + g))));
      const row = Math.min(this.rows - 1, Math.max(0, Math.floor((py - r.top - g) / (ch + g))));
      return this.cellRect(col, row);
    }
    onDragStart = () => {
      if (this.disabled)
        return;
      this._dragging = true;
      this._hovered = null;
      this.shadowRoot?.querySelector(".zone")?.classList.add("active");
    };
    onDragMove = (e) => {
      if (this.disabled || !this._dragging)
        return;
      const d = e.detail;
      if (!d?.rect)
        return;
      const cx = d.rect.x + d.rect.width / 2;
      const cy = d.rect.y + d.rect.height / 2;
      const cell = this.cellAt(cx, cy);
      this._hovered = cell;
      this.highlight(cell);
      if (cell)
        d.setDropZone?.({ x: cell.x, y: cell.y, width: cell.width, height: cell.height });
    };
    onDragEnd = (e) => {
      const wasDragging = this._dragging;
      this._dragging = false;
      this.shadowRoot?.querySelector(".zone")?.classList.remove("active");
      this.highlight(null);
      const cell = this._hovered;
      this._hovered = null;
      if (this.disabled || !wasDragging || !cell)
        return;
      const panel = e.target;
      const d = e.detail;
      if (!d?.rect)
        return;
      const nx = d.x + (cell.x - d.rect.x);
      const ny = d.y + (cell.y - d.rect.y);
      panel.style.transform = `translate(${Math.round(nx)}px, ${Math.round(ny)}px)`;
      panel.style.setProperty("--o-panel-width", `${Math.round(cell.width)}px`);
      panel.style.setProperty("--o-panel-height", `${Math.round(cell.height)}px`);
      this.dispatchEvent(new CustomEvent("o-drop", {
        bubbles: true,
        composed: true,
        detail: { panel, col: cell.col, row: cell.row, cell }
      }));
    };
    highlight(cell) {
      const cells = this.shadowRoot?.querySelectorAll(".cell");
      if (!cells)
        return;
      const idx = cell ? cell.row * this.cols + cell.col : -1;
      cells.forEach((el2, i) => el2.classList.toggle("hot", i === idx));
    }
    render() {
      const total = this.cols * this.rows;
      const cells = Array.from({ length: total }, () => '<div class="cell"></div>').join("");
      this.shadowRoot.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; position: relative; }
        .zone {
          display: grid;
          grid-template-columns: repeat(${this.cols}, 1fr);
          grid-template-rows: repeat(${this.rows}, 1fr);
          gap: ${this.gap}px;
          padding: ${this.gap}px;
          position: absolute; inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
          box-sizing: border-box;
        }
        /* Only visible mid-drag — a permanently drawn grid is visual noise. */
        .zone.active { opacity: 1; }
        .cell {
          border: var(--glass-border-width) dashed var(--glass-border);
          border-radius: var(--glass-radius);
          background: transparent;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .cell.hot {
          border-color: var(--accent-warm);
          border-style: solid;
          background: var(--glass-hover);
        }
        .slotted { position: relative; min-height: 100%; }
      </style>
      <div class="zone">${cells}</div>
      <div class="slotted"><slot></slot></div>
    `;
    }
  }
  if (!customElements.get("o-dropzone"))
    customElements.define("o-dropzone", ODropZone);

  // src/scroll.ts
  class OScroll extends GlassElement {
    static get observedAttributes() {
      return ["direction"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    render() {
      const dir = this.getAttribute("direction") || "y";
      const overflowX = dir === "x" || dir === "both" ? "auto" : "hidden";
      const overflowY = dir === "y" || dir === "both" ? "auto" : "hidden";
      this.shadowRoot.innerHTML = `
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
        ${glassScrollbarStyles(".scroll-area")}
      </style>
      <div class="scroll-area"><slot></slot></div>
    `;
    }
  }
  customElements.define("o-scroll", OScroll);

  // src/index.ts
  installGlobalThemeStyles();
  if (typeof window !== "undefined") {
    window.toast = toast;
    window.OProgress = OProgress;
    window.asyncPlus = asyncPlus;
  }
})();
