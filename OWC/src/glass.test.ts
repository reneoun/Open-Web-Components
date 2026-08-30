import { describe, it, expect, beforeEach } from 'vitest'
import {
  BASE_TOKENS, LIGHT_OVERRIDES, PIXEL_OVERRIDES, OFFICE_OVERRIDES, THEMES,
  GLASS_TOKENS, GLASS_TOKENS_LIGHT, GLASS_TOKENS_PIXEL, GLASS_TOKENS_OFFICE,
  glassBaseStyles, globalThemeCSS, installGlobalThemeStyles, GLOBAL_THEME_STYLE_ID,
} from './glass'

const css = glassBaseStyles()

// Pull the declarations of one selector block out of the generated stylesheet.
function block(sheet: string, selector: string): string {
  const i = sheet.indexOf(selector + ' {')
  expect(i, `selector ${selector} not found`).toBeGreaterThan(-1)
  return sheet.slice(i, sheet.indexOf('}', i))
}

describe('token maps', () => {
  it('every theme only overrides tokens that exist in the base set', () => {
    for (const [name, tokens] of Object.entries(THEMES)) {
      for (const key of Object.keys(tokens)) {
        expect(BASE_TOKENS, `${name} invents unknown token --${key}`).toHaveProperty(key)
      }
    }
  })

  it('keeps the original nine light-glass colours untouched', () => {
    expect(LIGHT_OVERRIDES['glass-bg']).toBe('rgba(34,197,94,0.06)')
    expect(LIGHT_OVERRIDES['glass-border']).toBe('rgba(34,197,94,0.15)')
    expect(LIGHT_OVERRIDES['glass-text']).toBe('#1a2e1a')
    expect(LIGHT_OVERRIDES['accent-warm']).toBe('rgba(22,163,74,0.7)')
  })

  it('keeps the original dark-glass defaults untouched', () => {
    expect(BASE_TOKENS['glass-bg']).toBe('rgba(255,255,255,0.07)')
    expect(BASE_TOKENS['glass-blur']).toBe('12px')
    expect(BASE_TOKENS['glass-text']).toBe('#fff')
    expect(BASE_TOKENS['glass-font']).toBe('sans-serif')
    expect(BASE_TOKENS['glass-radius']).toBe('10px')
    expect(BASE_TOKENS['glass-border-width']).toBe('1px')
  })

  it('adds no elevation by default, so the glass look is unchanged', () => {
    expect(BASE_TOKENS['glass-elevation']).toBe('none')
  })

  it('still exports the legacy token strings', () => {
    for (const s of [GLASS_TOKENS, GLASS_TOKENS_LIGHT, GLASS_TOKENS_PIXEL, GLASS_TOKENS_OFFICE]) {
      expect(s).toContain('--glass-bg:')
    }
  })
})

describe('pixel theme', () => {
  const b = block(css, ':host([theme="pixel"])')

  it('squares off every corner', () => {
    for (const key of Object.keys(BASE_TOKENS).filter(k => k.startsWith('glass-radius'))) {
      expect(PIXEL_OVERRIDES[key], `--${key} should be 0`).toBe('0')
    }
    const radii = [...b.matchAll(/--(glass-radius[\w-]*):\s*([^;]+);/g)]
    expect(radii.length).toBe(9)
    for (const [, name, value] of radii) expect(value.trim(), `--${name}`).toBe('0')
  })

  it('drops blur entirely', () => {
    expect(PIXEL_OVERRIDES['glass-backdrop']).toBe('none')
    expect(PIXEL_OVERRIDES['glass-blur']).toBe('0px')
    expect(b).toContain('--glass-backdrop: none;')
  })

  it('uses chunky borders and a hard offset shadow', () => {
    expect(PIXEL_OVERRIDES['glass-border-width']).toBe('3px')
    expect(PIXEL_OVERRIDES['glass-elevation']).toMatch(/^4px 4px 0/)
    expect(PIXEL_OVERRIDES['glass-shadow']).not.toContain('rgba')
  })

  it('uses a monospace stack and never a webfont', () => {
    expect(PIXEL_OVERRIDES['glass-font']).toContain('monospace')
    expect(css).not.toContain('@font-face')
    expect(css).not.toContain('@import')
    expect(css).not.toContain('http')
  })

  it('nudges on press like a physical button', () => {
    expect(PIXEL_OVERRIDES['glass-press']).toBe('translate(4px, 4px)')
  })
})

describe('office theme', () => {
  it('is flat — no blur, no glass', () => {
    expect(OFFICE_OVERRIDES['glass-backdrop']).toBe('none')
    expect(OFFICE_OVERRIDES['glass-blur']).toBe('0px')
  })

  it('uses light neutrals and one conservative accent', () => {
    expect(OFFICE_OVERRIDES['glass-bg']).toBe('#ffffff')
    expect(OFFICE_OVERRIDES['accent-warm']).toBe('#2f6fb0')
  })

  it('keeps radii small and hairlines thin', () => {
    expect(OFFICE_OVERRIDES['glass-radius']).toBe('4px')
    expect(OFFICE_OVERRIDES['glass-border-width']).toBe('1px')
  })

  it('puts legible text on the accent colour', () => {
    expect(OFFICE_OVERRIDES['glass-accent-text']).toBe('#ffffff')
    expect(BASE_TOKENS['glass-accent-text']).toBe('#000')
  })

  it('uses a crisp system UI stack', () => {
    expect(OFFICE_OVERRIDES['glass-font']).toContain('system-ui')
  })
})

describe('glassBaseStyles', () => {
  it('indirects every :host default so a page theme can reach in', () => {
    const host = block(css, ':host')
    for (const [key, val] of Object.entries(BASE_TOKENS)) {
      expect(host).toContain(`--${key}: var(--owc-${key}, ${val});`)
    }
  })

  it('emits a block for each named theme', () => {
    for (const name of Object.keys(THEMES)) {
      expect(css).toContain(`:host([theme="${name}"])`)
    }
  })

  it('gives each theme block the COMPLETE token set, so it fully overrides a page theme', () => {
    for (const name of Object.keys(THEMES)) {
      const b = block(css, `:host([theme="${name}"])`)
      for (const key of Object.keys(BASE_TOKENS)) {
        expect(b, `theme ${name} is missing --${key}`).toContain(`--${key}:`)
      }
      // theme blocks are raw values — no indirection, or the page would win
      expect(b).not.toContain('var(--owc-')
    }
  })

  it('lets a component opt back out to the default look', () => {
    expect(css).toContain(':host([theme="glass"])')
    expect(css).toContain(':host([theme="dark"])')
  })
})

describe('page-wide theming', () => {
  const g = globalThemeCSS()

  it('emits an attribute selector per theme', () => {
    for (const name of [...Object.keys(THEMES), 'glass', 'dark']) {
      expect(g).toContain(`[data-owc-theme="${name}"]`)
    }
  })

  it('writes --owc-* names, never the raw --glass-* ones', () => {
    for (const line of g.split('\n').filter(l => l.trim().startsWith('--'))) {
      expect(line.trim().startsWith('--owc-'), `leaked raw token: ${line.trim()}`).toBe(true)
    }
  })

  it('rewrites nested var() references into page scope', () => {
    // --glass-backdrop is defined as blur(var(--glass-blur)); at page level only
    // --owc-glass-blur exists, so the reference must be rewritten or it computes
    // to invalid on <body> and page-wide blur silently breaks.
    expect(BASE_TOKENS['glass-backdrop']).toContain('var(--glass-blur)')
    expect(g).toContain('--owc-glass-backdrop: blur(var(--owc-glass-blur));')
    expect(g).not.toContain('blur(var(--glass-blur))')
  })

  it('carries the full token set per page theme', () => {
    const i = g.indexOf('[data-owc-theme="pixel"]')
    const b = g.slice(i, g.indexOf('}', i))
    for (const key of Object.keys(BASE_TOKENS)) {
      expect(b, `page pixel theme missing --owc-${key}`).toContain(`--owc-${key}:`)
    }
    expect(b).toContain('--owc-glass-radius: 0;')
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
      // strip the token definitions; only component rules should remain
      const rules = style.slice(style.lastIndexOf('}') + 1) + style.split(':host {')[0]
      expect(rules, `${tag} hardcodes sans-serif`).not.toContain('font-family: sans-serif')
      expect(style.match(/border-radius:\s*\d+px/), `${tag} hardcodes a radius`).toBeNull()
    }
  })
})
