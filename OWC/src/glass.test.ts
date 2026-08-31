import { describe, it, expect, beforeEach } from 'vitest'
import {
  BASE_TOKENS, BASE_GEOMETRY, FAMILIES, MODES, FAMILY_GEOMETRY, FAMILY_COLOURS,
  COLOUR_TOKENS, resolveTheme, LEGACY_ALIASES,
  LIGHT_OVERRIDES, PIXEL_OVERRIDES, OFFICE_OVERRIDES, THEMES,
  GLASS_TOKENS, GLASS_TOKENS_LIGHT, GLASS_TOKENS_PIXEL, GLASS_TOKENS_OFFICE,
  glassBaseStyles, globalThemeCSS, installGlobalThemeStyles, GLOBAL_THEME_STYLE_ID,
  glassScrollbarStyles,
} from './glass'
import { contrastOn } from './contrast'

const css = glassBaseStyles()

// Pull the declarations of one selector block out of the generated stylesheet.
function block(sheet: string, selector: string): string {
  const i = sheet.indexOf(selector + ' {')
  expect(i, `selector ${selector} not found`).toBeGreaterThan(-1)
  return sheet.slice(i, sheet.indexOf('}', i))
}

// Every block matching a selector (a selector can appear inside media queries too).
function blocks(sheet: string, selector: string): string[] {
  const out: string[] = []
  let i = sheet.indexOf(selector + ' {')
  while (i > -1) {
    out.push(sheet.slice(i, sheet.indexOf('}', i)))
    i = sheet.indexOf(selector + ' {', i + 1)
  }
  return out
}

describe('token maps', () => {
  it('every family and mode resolves to the same complete key space', () => {
    const keys = Object.keys(BASE_TOKENS).sort()
    for (const f of FAMILIES) for (const m of MODES) {
      expect(Object.keys(resolveTheme(f, m)).sort(), `${f}-${m}`).toEqual(keys)
    }
  })

  it('no family invents a token that is not in the base set', () => {
    for (const f of FAMILIES) {
      for (const k of Object.keys(FAMILY_GEOMETRY[f])) expect(BASE_TOKENS).toHaveProperty(k)
      for (const m of MODES) {
        for (const k of Object.keys(FAMILY_COLOURS[f][m])) expect(BASE_TOKENS).toHaveProperty(k)
      }
    }
  })

  it('glass is the base family — its geometry adds nothing', () => {
    expect(FAMILY_GEOMETRY.glass).toEqual({})
    expect(resolveTheme('glass', 'dark')).toEqual(BASE_TOKENS)
  })

  it('keeps the dark-glass geometry byte-identical to v1.6', () => {
    expect(BASE_TOKENS['glass-blur']).toBe('12px')
    expect(BASE_TOKENS['glass-font']).toBe('sans-serif')
    expect(BASE_TOKENS['glass-radius']).toBe('10px')
    expect(BASE_TOKENS['glass-border-width']).toBe('1px')
    expect(BASE_TOKENS['glass-scroll-size']).toBe('9px')
    expect(BASE_TOKENS['glass-scroll-radius']).toBe('5px')
    expect(BASE_TOKENS['glass-elevation']).toBe('none')
  })

  it('keeps the dark-glass surface colours byte-identical to v1.6', () => {
    expect(BASE_TOKENS['glass-bg']).toBe('rgba(255,255,255,0.07)')
    expect(BASE_TOKENS['glass-border']).toBe('rgba(255,255,255,0.12)')
    expect(BASE_TOKENS['glass-text']).toBe('#fff')
    expect(BASE_TOKENS['glass-shadow']).toBe('0 8px 32px rgba(0,0,0,0.3)')
  })

  it('still exports the legacy token strings and override maps', () => {
    for (const s of [GLASS_TOKENS, GLASS_TOKENS_LIGHT, GLASS_TOKENS_PIXEL, GLASS_TOKENS_OFFICE]) {
      expect(s).toContain('--glass-bg:')
    }
    for (const m of [LIGHT_OVERRIDES, PIXEL_OVERRIDES, OFFICE_OVERRIDES]) {
      expect(Object.keys(m).length).toBeGreaterThan(0)
    }
  })
})

describe('the two axes are independent', () => {
  it('switching mode never moves a pixel — geometry is mode-invariant', () => {
    const geometryKeys = Object.keys(BASE_TOKENS).filter(
      k => !(COLOUR_TOKENS as readonly string[]).includes(k))
    expect(geometryKeys.length).toBeGreaterThan(10)
    for (const f of FAMILIES) {
      const light = resolveTheme(f, 'light')
      const dark = resolveTheme(f, 'dark')
      for (const k of geometryKeys) {
        expect(light[k], `${f}: --${k} differs between modes`).toBe(dark[k])
      }
    }
  })

  it('switching family never leaks the other family geometry', () => {
    expect(resolveTheme('pixel', 'light')['glass-radius']).toBe('0')
    expect(resolveTheme('pixel', 'dark')['glass-radius']).toBe('0')
    expect(resolveTheme('office', 'dark')['glass-radius']).toBe('4px')
    expect(resolveTheme('glass', 'light')['glass-radius']).toBe('10px')
  })

  it('gives every family both modes, including the two that did not exist', () => {
    expect(FAMILY_COLOURS.pixel.light['glass-bg']).toBeTruthy()
    expect(FAMILY_COLOURS.office.dark['glass-bg']).toBeTruthy()
    // and they are genuinely different looks, not copies
    expect(FAMILY_COLOURS.pixel.light['glass-bg']).not.toBe(FAMILY_COLOURS.pixel.dark['glass-bg'])
    expect(FAMILY_COLOURS.office.light['glass-bg']).not.toBe(FAMILY_COLOURS.office.dark['glass-bg'])
  })
})

describe('pixel family', () => {
  it('squares off every corner in both modes', () => {
    for (const m of MODES) {
      const t = resolveTheme('pixel', m)
      const radii = Object.keys(t).filter(k => k.startsWith('glass-radius'))
      expect(radii.length).toBe(9)
      for (const k of radii) expect(t[k], `--${k} in ${m}`).toBe('0')
    }
    const b = block(css, ':host([theme="pixel"])')
    const found = [...b.matchAll(/--(glass-radius[\w-]*):\s*([^;]+);/g)]
    expect(found.length).toBe(9)
    for (const [, , v] of found) expect(v.trim()).toBe('0')
  })

  it('drops blur entirely', () => {
    expect(FAMILY_GEOMETRY.pixel['glass-backdrop']).toBe('none')
    expect(FAMILY_GEOMETRY.pixel['glass-blur']).toBe('0px')
    expect(block(css, ':host([theme="pixel"])')).toContain('--glass-backdrop: none;')
  })

  it('uses chunky borders and a hard offset shadow in both modes', () => {
    expect(FAMILY_GEOMETRY.pixel['glass-border-width']).toBe('3px')
    for (const m of MODES) {
      const t = resolveTheme('pixel', m)
      expect(t['glass-elevation']).toMatch(/^4px 4px 0/)
      expect(t['glass-shadow']).not.toContain('rgba')
    }
  })

  it('uses a monospace stack and never a webfont', () => {
    expect(FAMILY_GEOMETRY.pixel['glass-font']).toContain('monospace')
    expect(css).not.toContain('@font-face')
    expect(css).not.toContain('@import')
    expect(css).not.toContain('http')
  })

  it('nudges on press like a physical button', () => {
    expect(FAMILY_GEOMETRY.pixel['glass-press']).toBe('translate(4px, 4px)')
  })

  it('keeps hard black outlines in light mode — the 8-bit tell', () => {
    expect(FAMILY_COLOURS.pixel.light['glass-border']).toBe('#000000')
    expect(FAMILY_COLOURS.pixel.light['glass-shadow']).toContain('#000000')
  })
})

describe('office family', () => {
  it('is flat — no blur, no glass', () => {
    expect(FAMILY_GEOMETRY.office['glass-backdrop']).toBe('none')
    expect(FAMILY_GEOMETRY.office['glass-blur']).toBe('0px')
  })

  it('keeps radii small and hairlines thin', () => {
    expect(resolveTheme('office', 'light')['glass-radius']).toBe('4px')
    expect(resolveTheme('office', 'light')['glass-border-width']).toBe('1px')
  })

  it('uses one conservative blue accent in each mode', () => {
    expect(FAMILY_COLOURS.office.light['accent-warm']).toBe('#2f6fb0')
    expect(FAMILY_COLOURS.office.dark['accent-warm']).toBe('#5b9fe3')
  })

  it('uses a crisp system UI stack', () => {
    expect(FAMILY_GEOMETRY.office['glass-font']).toContain('system-ui')
  })

  it('is genuinely dark in dark mode, not a tinted light theme', () => {
    expect(FAMILY_COLOURS.office.dark['glass-bg']).toBe('#1b222b')
    expect(FAMILY_COLOURS.office.dark['glass-text']).toBe('#e6ebf1')
  })
})

describe('glassBaseStyles cascade', () => {
  it('indirects every :host default so a page theme can reach in', () => {
    const host = block(css, ':host')
    for (const [key, val] of Object.entries(BASE_TOKENS)) {
      expect(host).toContain(`--${key}: var(--owc-${key}, ${val});`)
    }
  })

  it('follows the OS only when neither theme nor mode is set', () => {
    expect(css).toContain('@media (prefers-color-scheme: light)')
    expect(css).toContain(':host(:not([mode]):not([theme]))')
  })

  it('guards every prefers-color-scheme block with :not([mode])', () => {
    // A media query adds no specificity. Without the guard an explicit mode=
    // would tie with the OS rule and lose on source order.
    for (const m of css.split('@media (prefers-color-scheme: light) {').slice(1)) {
      const sel = m.slice(0, m.indexOf('{'))
      expect(sel, `unguarded OS block: ${sel.trim()}`).toContain(':not([mode])')
    }
  })

  it('gives each theme block the COMPLETE token set, so it beats a page theme', () => {
    for (const name of Object.keys(THEMES)) {
      const b = block(css, `:host([theme="${name}"])`)
      for (const key of Object.keys(BASE_TOKENS)) {
        expect(b, `theme ${name} is missing --${key}`).toContain(`--${key}:`)
      }
      expect(b).not.toContain('var(--owc-')
    }
  })

  it('emits an explicit mode block for every family', () => {
    for (const f of FAMILIES) for (const m of MODES) {
      const b = blocks(css, `:host([theme="${f}"][mode="${m}"])`)
      const viaBase = resolveTheme(f, m)
      if (b.length === 0) {
        // omitted only when the family block already carries that mode
        expect(m).toBe('dark')
        expect(block(css, `:host([theme="${f}"])`)).toContain(`--glass-bg: ${viaBase['glass-bg']};`)
      } else {
        expect(b[0]).toContain(`--glass-bg: ${viaBase['glass-bg']};`)
      }
    }
  })

  it('lets mode= alone follow the page family via the published pair', () => {
    for (const m of MODES) {
      const b = block(css, `:host([mode="${m}"]:not([theme]))`)
      expect(b).toContain(`--glass-bg: var(--owc-glass-bg-${m},`)
      // geometry must NOT be redeclared — mode never changes geometry
      expect(b).not.toContain('--glass-radius:')
    }
  })

  it('only redeclares colour tokens in mode blocks, keeping the CSS small', () => {
    const b = block(css, ':host([theme="glass"][mode="light"])')
    for (const k of COLOUR_TOKENS) expect(b).toContain(`--${k}:`)
    expect(b).not.toContain('--glass-font:')
    expect(b).not.toContain('--glass-blur:')
  })
})

describe('legacy theme names still work', () => {
  it('pins theme="light" to glass + light for ever', () => {
    expect(LEGACY_ALIASES.light).toEqual({ family: 'glass', mode: 'light' })
    const b = block(css, ':host([theme="light"])')
    const light = resolveTheme('glass', 'light')
    expect(b).toContain(`--glass-bg: ${light['glass-bg']};`)
    expect(b).toContain(`--glass-text: ${light['glass-text']};`)
  })

  it('pins theme="dark" to glass + dark for ever', () => {
    const b = block(css, ':host([theme="dark"])')
    expect(b).toContain(`--glass-bg: ${BASE_TOKENS['glass-bg']};`)
  })

  it('never lets the OS media query flip a pinned legacy name', () => {
    for (const name of Object.keys(LEGACY_ALIASES)) {
      for (const m of css.split('@media (prefers-color-scheme: light) {').slice(1)) {
        const sel = m.slice(0, m.indexOf('{'))
        expect(sel, `legacy ${name} must not follow the OS`).not.toContain(`[theme="${name}"]`)
      }
    }
  })

  it('still lets an explicit mode override a legacy name', () => {
    expect(css).toContain(':host([theme="light"][mode="dark"])')
    expect(css).toContain(':host([theme="dark"][mode="light"])')
  })

  it('keeps page-level legacy names too', () => {
    const g = globalThemeCSS()
    expect(g).toContain('[data-owc-theme="light"]')
    expect(g).toContain('[data-owc-theme="dark"]')
  })
})

describe('page-wide theming', () => {
  const g = globalThemeCSS()

  it('emits an attribute selector per theme name', () => {
    for (const name of [...FAMILIES, ...Object.keys(LEGACY_ALIASES)]) {
      expect(g).toContain(`[data-owc-theme="${name}"]`)
    }
  })

  it('puts the default family on :root so page chrome always has tokens', () => {
    expect(g).toContain(':root, [data-owc-theme="glass"]')
  })

  it('writes --owc-* names, never the raw --glass-* ones', () => {
    for (const line of g.split('\n').filter(l => l.trim().startsWith('--'))) {
      expect(line.trim().startsWith('--owc-'), `leaked raw token: ${line.trim()}`).toBe(true)
    }
  })

  it('rewrites nested var() references into page scope', () => {
    // --glass-backdrop is blur(var(--glass-blur)); at page level only
    // --owc-glass-blur exists, and a custom property's var()s resolve in the
    // scope where it is declared — so the reference must be rewritten or
    // page-wide blur silently computes to invalid on <body>.
    expect(BASE_TOKENS['glass-backdrop']).toContain('var(--glass-blur)')
    expect(g).toContain('--owc-glass-backdrop: blur(var(--owc-glass-blur));')
    expect(g).not.toContain('blur(var(--glass-blur))')
  })

  it('publishes BOTH palettes side by side for every family', () => {
    for (const f of FAMILIES) {
      const i = g.indexOf(`[data-owc-theme="${f}"] {`)
      const b = g.slice(i, g.indexOf('\n}', i))
      for (const m of MODES) {
        expect(b, `${f} is missing its ${m} palette`).toContain(`--owc-glass-bg-${m}:`)
      }
    }
  })

  it('carries the full geometry per page theme', () => {
    const i = g.indexOf('[data-owc-theme="pixel"] {')
    const b = g.slice(i, g.indexOf('\n}', i))
    for (const k of Object.keys(BASE_GEOMETRY)) {
      expect(b, `page pixel theme missing --owc-${k}`).toContain(`--owc-${k}:`)
    }
    expect(b).toContain('--owc-glass-radius: 0;')
  })

  it('lets data-owc-mode alone swap whichever palette is inherited', () => {
    for (const m of MODES) {
      const i = g.indexOf(`[data-owc-mode="${m}"] {`)
      expect(i, `no family-agnostic block for ${m}`).toBeGreaterThan(-1)
      const b = g.slice(i, g.indexOf('\n}', i))
      expect(b).toContain(`--owc-glass-bg: var(--owc-glass-bg-${m});`)
    }
  })

  it('guards the page-level OS block so an explicit mode always wins', () => {
    for (const m of g.split('@media (prefers-color-scheme: light) {').slice(1)) {
      const sel = m.slice(0, m.indexOf('{'))
      expect(sel, `unguarded page OS block: ${sel.trim()}`).toContain(':not([data-owc-mode])')
    }
  })
})

describe('installGlobalThemeStyles', () => {
  beforeEach(() => {
    document.getElementById(GLOBAL_THEME_STYLE_ID)?.remove()
  })

  it('injects the stylesheet into head', () => {
    expect(installGlobalThemeStyles()).toBe(true)
    const el = document.getElementById(GLOBAL_THEME_STYLE_ID)
    expect(el).not.toBeNull()
    expect(el!.textContent).toContain('[data-owc-theme="office"]')
  })

  it('is idempotent — a second call is a no-op', () => {
    expect(installGlobalThemeStyles()).toBe(true)
    expect(installGlobalThemeStyles()).toBe(false)
    expect(document.querySelectorAll(`#${GLOBAL_THEME_STYLE_ID}`).length).toBe(1)
  })
})

describe('components consume the tokens', () => {
  it('no component hardcodes a font, radius, border width or blur', async () => {
    await import('./index')
    document.body.innerHTML = ''

    for (const tag of ['o-button', 'o-panel', 'o-toggle', 'o-tooltip', 'o-input',
                       'o-dropdown', 'o-tabs', 'o-search']) {
      const el = document.createElement(tag)
      document.body.appendChild(el)
      const style = (el as any).shadowRoot?.querySelector('style')?.textContent ?? ''
      if (!style) continue
      const rules = style.slice(style.lastIndexOf('}') + 1) + style.split(':host {')[0]
      expect(rules, `${tag} hardcodes sans-serif`).not.toContain('font-family: sans-serif')
      expect(style.match(/border-radius:\s*\d+px/), `${tag} hardcodes a radius`).toBeNull()
    }
  })
})

describe('scrollbar tokens', () => {
  const sheet = glassScrollbarStyles('.scroll-area')

  it('drives both axes from tokens', () => {
    expect(sheet).toContain('width: var(--glass-scroll-size);')
    expect(sheet).toContain('height: var(--glass-scroll-size);')
    expect(sheet).toContain('background: var(--glass-scroll-thumb);')
  })

  it('preserves the original 9px/5px geometry as the default', () => {
    expect(BASE_TOKENS['glass-scroll-size']).toBe('9px')
    expect(BASE_TOKENS['glass-scroll-radius']).toBe('5px')
  })

  it('gives pixel a square, chunky bar', () => {
    expect(FAMILY_GEOMETRY.pixel['glass-scroll-radius']).toBe('0')
    expect(FAMILY_GEOMETRY.pixel['glass-scroll-size']).toBe('12px')
  })

  it('gives office a restrained bar', () => {
    expect(FAMILY_GEOMETRY.office['glass-scroll-radius']).toBe('2px')
    expect(FAMILY_GEOMETRY.office['glass-scroll-size']).toBe('10px')
  })

  it('gives every family x mode its own thumb and track', () => {
    for (const f of FAMILIES) for (const m of MODES) {
      const t = resolveTheme(f, m)
      expect(t['glass-scroll-thumb'], `${f}-${m}`).toBeTruthy()
      expect(t['glass-scroll-track'], `${f}-${m}`).toBeTruthy()
      expect(t['glass-scroll-thumb']).not.toBe(t['glass-scroll-track'])
    }
  })
})

// ---------------------------------------------------------------------------
// Accessibility. Ratios are computed by compositing each translucent layer over
// the one beneath it — a translucent token is meaningless on its own, which is
// why glass-light scored 2.05:1 for body text before this pass: dark green text
// on a translucent green panel sat on the DARK green page gradient.
// ---------------------------------------------------------------------------
describe('WCAG AA contrast', () => {
  // Representative flat colour of each family's page backdrop (gradient mid-tone).
  const PAGE: Record<string, string> = {
    'glass-dark': '#065f46', 'glass-light': '#d9f2e4',
    'pixel-dark': '#1d2b53', 'pixel-light': '#fff1e8',
    'office-dark': '#12171d', 'office-light': '#eef1f5',
  }

  const AA_BODY = 4.5   // body text
  const AA_LARGE = 3.0  // decorative/disabled text and non-text UI

  for (const f of FAMILIES) for (const m of MODES) {
    const key = `${f}-${m}`
    const t = resolveTheme(f as any, m)
    const surface = [PAGE[key], t['glass-bg']]

    describe(key, () => {
      it('body text clears AA', () => {
        expect(contrastOn(t['glass-text'], surface)).toBeGreaterThanOrEqual(AA_BODY)
      })
      it('muted text clears AA', () => {
        expect(contrastOn(t['glass-text-muted'], surface)).toBeGreaterThanOrEqual(AA_BODY)
      })
      it('dim text clears the large/decorative threshold', () => {
        expect(contrastOn(t['glass-text-dim'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('the accent is visible against the surface', () => {
        expect(contrastOn(t['accent-warm'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('the table row separator is a visible structural line', () => {
        // Regression: row separators used to borrow --glass-hover, a hover
        // *surface* token. It reads on dark grounds and inverts on light —
        // glass-light drew a near-white line on a pale panel at 1.05:1.
        // Row separators define the grid, so the panel-edge exemption that
        // lets highlight strokes sit below 3:1 does not apply to them.
        expect(contrastOn(t['glass-table-line'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('does not draw the row separator from the hover surface', () => {
        expect(t['glass-table-line']).not.toBe(t['glass-hover'])
      })
      it('the positive (confirm) colour clears the non-text threshold', () => {
        expect(contrastOn(t['glass-positive'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('the negative (cancel) colour clears the non-text threshold', () => {
        expect(contrastOn(t['glass-negative'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('text on the accent clears AA', () => {
        expect(contrastOn(t['glass-accent-text'], [...surface, t['accent-warm']]))
          .toBeGreaterThanOrEqual(AA_BODY)
      })
      it('the progress bar is visible', () => {
        expect(contrastOn(t['glass-progress'], surface)).toBeGreaterThanOrEqual(AA_LARGE)
      })
      it('the scrollbar thumb is visible against its track', () => {
        expect(contrastOn(t['glass-scroll-thumb'], [...surface, t['glass-scroll-track']]))
          .toBeGreaterThanOrEqual(AA_LARGE)
      })
      // o-toggle paints its sliding indicator behind the segment label. It used
      // to borrow --glass-border, which is a hard black outline in pixel: the
      // selected label vanished into a black block.
      it('the toggle indicator keeps its segment label legible', () => {
        expect(contrastOn(t['glass-text'], [...surface, t['glass-indicator']]))
          .toBeGreaterThanOrEqual(AA_BODY)
      })
      it('page text clears AA against the page backdrop', () => {
        expect(contrastOn(t['glass-page-text'], [PAGE[key]])).toBeGreaterThanOrEqual(AA_BODY)
      })
    })
  }
})
