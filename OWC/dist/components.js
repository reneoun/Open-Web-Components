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
    resolveTheme: () => resolveTheme,
    pageWindow: () => pageWindow,
    pageScrollbarStyles: () => pageScrollbarStyles,
    installGlobalThemeStyles: () => installGlobalThemeStyles,
    globalThemeCSS: () => globalThemeCSS,
    glassScrollbarStyles: () => glassScrollbarStyles,
    glassBaseStyles: () => glassBaseStyles,
    asyncPlus: () => asyncPlus,
    THEMES: () => THEMES,
    PIXEL_OVERRIDES: () => PIXEL_OVERRIDES,
    OWCToast: () => OWCToast,
    OTooltip: () => OTooltip,
    OToggle: () => OToggle,
    OTabs: () => OTabs,
    OTable: () => OTable,
    OSkeleton: () => OSkeleton,
    OSearch: () => OSearch,
    OScroll: () => OScroll,
    OProgress: () => OProgress,
    OPaginator: () => OPaginator,
    OInput: () => OInput,
    OFFICE_OVERRIDES: () => OFFICE_OVERRIDES,
    ODropdown: () => ODropdown,
    ODropZone: () => ODropZone,
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
    "glass-chrome-border"
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
        "glass-chrome-border": "rgba(255,255,255,0.1)"
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
        "glass-chrome-border": "rgba(4,90,60,0.18)"
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
        "glass-chrome-border": "#000000"
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
        "glass-chrome-border": "#000000"
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
        "glass-chrome-border": "#333e4a"
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
        "glass-chrome-border": "#d5dae1"
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
          border-bottom: var(--glass-border-width) solid var(--glass-hover);
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
      cells.forEach((el, i) => el.classList.toggle("hot", i === idx));
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
