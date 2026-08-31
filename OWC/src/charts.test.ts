import { describe, it, expect, afterEach } from 'vitest'
import './bar'
import './line'
import './pie'
import { niceTicks, fmt, barPath, seriesVar, SERIES_SLOTS } from './chartkit'
import { FAMILIES, MODES, resolveTheme } from './glass'
import type { OBar } from './bar'
import type { OLine } from './line'
import type { OPie } from './pie'

const tick = () => new Promise(r => setTimeout(r, 0))
const mount = (html: string) => { document.body.innerHTML = html }

const SALES = [
  { month: 'Jan', sales: 1200, refunds: 140 },
  { month: 'Feb', sales: 1900, refunds: 210 },
  { month: 'Mar', sales: 1500, refunds: 90 },
]
const OS = [
  { os: 'macOS', n: 480 }, { os: 'Windows', n: 390 }, { os: 'Linux', n: 130 },
]

describe('chartkit', () => {
  it('rounds axis ticks to clean numbers', () => {
    expect(niceTicks(0, 1900)).toEqual([0, 500, 1000, 1500, 2000])
    expect(niceTicks(0, 9)).toEqual([0, 2, 4, 6, 8, 10])
  })

  it('formats values with thousands separators', () => {
    expect(fmt(1200)).toBe('1,200')
    expect(fmt(0)).toBe('0')
  })

  it('rounds the data end but keeps the baseline square', () => {
    const d = barPath(0, 10, 20, 40, 4, false)
    // Starts at the baseline corner and curves only at the far end.
    expect(d.startsWith('M0,50')).toBe(true)
    expect(d).toContain('Q')
    expect(d.trimEnd().endsWith('Z')).toBe(true)
  })

  it('assigns slots in fixed order and never cycles past the ceiling', () => {
    expect(seriesVar(0)).toBe('var(--glass-series-1)')
    expect(seriesVar(5)).toBe('var(--glass-series-6)')
    // A 7th series must fold, not wrap back around to slot 1.
    expect(seriesVar(6)).toBe(`var(--glass-series-${SERIES_SLOTS})`)
    expect(seriesVar(99)).not.toBe('var(--glass-series-1)')
  })
})

describe('chart theme tokens', () => {
  it('defines a chart surface and six series slots in all six combinations', () => {
    for (const f of FAMILIES) for (const m of MODES) {
      const t = resolveTheme(f, m)
      expect(t['glass-chart-surface'], `${f}-${m} surface`).toBeTruthy()
      expect(t['glass-grid'], `${f}-${m} grid`).toBeTruthy()
      for (let i = 1; i <= SERIES_SLOTS; i++) {
        expect(t[`glass-series-${i}`], `${f}-${m} slot ${i}`).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
  })

  it('gives every family x mode a distinct series set (dark is selected, not flipped)', () => {
    for (const f of FAMILIES) {
      const l = resolveTheme(f, 'light'), d = resolveTheme(f, 'dark')
      const same = Array.from({ length: SERIES_SLOTS }, (_, i) =>
        l[`glass-series-${i + 1}`] === d[`glass-series-${i + 1}`])
      // If dark were an automatic flip of light the hexes would match.
      expect(same.every(Boolean), `${f} light/dark identical`).toBe(false)
    }
  })
})

describe('o-bar', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders one mark per row for a single series', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    expect(el.shadowRoot!.querySelectorAll('path.mark')).toHaveLength(3)
  })

  it('paints every bar of a single series in slot 1 — never by value', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    const fills = [...el.shadowRoot!.querySelectorAll('path.mark')].map(p => p.getAttribute('fill'))
    expect(new Set(fills).size).toBe(1)
    expect(fills[0]).toBe('var(--glass-series-1)')
  })

  it('shows no legend for one series but does for two', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const one = document.querySelector('o-bar') as OBar
    one.data = SALES
    await tick()
    expect(one.shadowRoot!.querySelector('.legend')).toBeNull()

    mount('<o-bar x="month" series="sales,refunds"></o-bar>')
    const two = document.querySelector('o-bar') as OBar
    two.data = SALES
    await tick()
    expect(two.shadowRoot!.querySelector('.legend')).toBeTruthy()
  })

  it('keeps a series on its own slot when another is hidden', async () => {
    mount('<o-bar x="month" series="sales,refunds"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    const before = [...el.shadowRoot!.querySelectorAll('path.mark')]
      .filter(p => p.getAttribute('data-key') === 'refunds')
      .map(p => p.getAttribute('fill'))[0]
    const btn = [...el.shadowRoot!.querySelectorAll('.legend button')]
      .find(b => b.textContent?.includes('sales')) as HTMLButtonElement
    btn.click()
    await tick()
    const after = [...el.shadowRoot!.querySelectorAll('path.mark')]
      .filter(p => p.getAttribute('data-key') === 'refunds')
      .map(p => p.getAttribute('fill'))[0]
    // Colour follows the entity: hiding "sales" must not repaint "refunds".
    expect(after).toBe(before)
  })

  it('offers a table view holding every value', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    expect(el.shadowRoot!.querySelector('table')).toBeNull()
    ;(el.shadowRoot!.querySelector('.tablebtn') as HTMLButtonElement).click()
    await tick()
    const txt = el.shadowRoot!.querySelector('table')!.textContent!
    expect(txt).toContain('1,900')
    expect(txt).toContain('Feb')
  })

  it('gives each category a focusable hit target with an accessible name', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    const hits = el.shadowRoot!.querySelectorAll('.hit')
    expect(hits).toHaveLength(3)
    expect(hits[0].getAttribute('tabindex')).toBe('0')
    expect(hits[0].getAttribute('aria-label')).toContain('Jan')
  })

  it('renders an empty state rather than throwing on no data', async () => {
    mount('<o-bar x="month" y="sales"></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = []
    await tick()
    expect(el.shadowRoot!.querySelector('.empty')).toBeTruthy()
  })
})

describe('o-line', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('draws a 2px round-capped path per series', async () => {
    mount('<o-line x="month" series="sales,refunds"></o-line>')
    const el = document.querySelector('o-line') as OLine
    el.data = SALES
    await tick()
    const strokes = [...el.shadowRoot!.querySelectorAll('path[stroke]')]
    expect(strokes.length).toBe(2)
    expect(strokes[0].getAttribute('stroke-width')).toBe('2')
    expect(strokes[0].getAttribute('stroke-linecap')).toBe('round')
  })

  it('rings end markers in the surface colour so crossings stay legible', async () => {
    mount('<o-line x="month" y="sales"></o-line>')
    const el = document.querySelector('o-line') as OLine
    el.data = SALES
    await tick()
    const dot = el.shadowRoot!.querySelector('circle')!
    expect(Number(dot.getAttribute('r'))).toBeGreaterThanOrEqual(4)
    expect(dot.getAttribute('stroke')).toBe('var(--glass-chart-surface)')
    expect(dot.getAttribute('stroke-width')).toBe('2')
  })

  it('keeps the area fill a wash, never a saturated block', async () => {
    mount('<o-line x="month" y="sales" area></o-line>')
    const el = document.querySelector('o-line') as OLine
    el.data = SALES
    await tick()
    const fill = [...el.shadowRoot!.querySelectorAll('path[opacity]')][0]
    expect(Number(fill.getAttribute('opacity'))).toBeLessThanOrEqual(0.15)
  })

  it('exposes an arrow-key readout over the plot', async () => {
    mount('<o-line x="month" y="sales"></o-line>')
    const el = document.querySelector('o-line') as OLine
    el.data = SALES
    await tick()
    const hit = el.shadowRoot!.querySelector('.hit')!
    expect(hit.getAttribute('tabindex')).toBe('0')
    expect(hit.getAttribute('aria-label')).toMatch(/arrow keys/i)
  })
})

describe('o-pie', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders one slice per category', async () => {
    mount('<o-pie label="os" value="n"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = OS
    await tick()
    expect(el.shadowRoot!.querySelectorAll('path.mark')).toHaveLength(3)
  })

  it('folds the tail into a single Other slice past the cap', async () => {
    mount('<o-pie label="os" value="n" max-slices="3"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = [
      { os: 'a', n: 50 }, { os: 'b', n: 40 }, { os: 'c', n: 30 },
      { os: 'd', n: 20 }, { os: 'e', n: 10 },
    ]
    await tick()
    const labels = [...el.shadowRoot!.querySelectorAll('path.mark')]
      .map(p => p.getAttribute('data-label'))
    expect(labels).toHaveLength(3)
    expect(labels).toContain('Other')
    // Other carries the whole tail: 30 + 20 + 10
    const other = [...el.shadowRoot!.querySelectorAll('path.mark')]
      .find(p => p.getAttribute('data-label') === 'Other')!
    expect(Number(other.getAttribute('data-val'))).toBe(60)
  })

  it('never seats more slices than the slot ceiling', async () => {
    mount('<o-pie label="os" value="n"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = Array.from({ length: 12 }, (_, i) => ({ os: `s${i}`, n: 12 - i }))
    await tick()
    expect(el.shadowRoot!.querySelectorAll('path.mark').length)
      .toBeLessThanOrEqual(SERIES_SLOTS)
  })

  it('always carries a legend, since slices are identified by colour', async () => {
    mount('<o-pie label="os" value="n"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = OS
    await tick()
    expect(el.shadowRoot!.querySelectorAll('.legend button').length).toBe(3)
  })

  it('gives each slice a focusable accessible name with its share', async () => {
    mount('<o-pie label="os" value="n"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = OS
    await tick()
    const first = el.shadowRoot!.querySelector('path.mark')!
    expect(first.getAttribute('tabindex')).toBe('0')
    expect(first.getAttribute('aria-label')).toMatch(/macOS.*%/)
  })

  it('reaches every value through the table view', async () => {
    mount('<o-pie label="os" value="n"></o-pie>')
    const el = document.querySelector('o-pie') as OPie
    el.data = OS
    await tick()
    ;(el.shadowRoot!.querySelector('.tablebtn') as HTMLButtonElement).click()
    await tick()
    const txt = el.shadowRoot!.querySelector('table')!.textContent!
    for (const r of OS) expect(txt).toContain(r.os)
  })
})

describe('stacked bar segment ends', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('rounds only the outermost segment, keeping interior ones square', async () => {
    mount('<o-bar x="month" series="sales,refunds" stacked></o-bar>')
    const el = document.querySelector('o-bar') as OBar
    el.data = SALES
    await tick()
    const jan = [...el.shadowRoot!.querySelectorAll('path.mark')]
      .filter(p => p.getAttribute('data-cat') === 'Jan')
    expect(jan.length).toBe(2)
    // The first (bottom) segment has no curve; the last one does.
    expect(jan[0].getAttribute('d')).not.toContain('Q')
    expect(jan[jan.length - 1].getAttribute('d')).toContain('Q')
  })
})
