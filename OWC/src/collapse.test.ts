import { describe, it, expect, afterEach, vi } from 'vitest'
import './collapse'
import type { OCollapse, OCollapseGroup } from './collapse'

const tick = () => new Promise(r => setTimeout(r, 0))

function mount(html: string) {
  document.body.innerHTML = html
  return document.body
}

describe('o-collapse', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders its label and starts closed by default', async () => {
    mount('<o-collapse label="Basics">content</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    expect(el.open).toBe(false)
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toBe('Basics')
  })

  it('honours the open attribute at mount', async () => {
    mount('<o-collapse open label="Open">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    expect(el.open).toBe(true)
    expect(el.shadowRoot!.querySelector('.body')!.classList.contains('open')).toBe(true)
  })

  it('toggles on header click and fires o-collapse-toggle', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const spy = vi.fn()
    el.addEventListener('o-collapse-toggle', spy)
    const head = el.shadowRoot!.querySelector('.head') as HTMLElement
    head.click()
    expect(el.open).toBe(true)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0].detail).toEqual({ open: true, label: 'A' })
  })

  it('bubbles and composes the toggle event out of the shadow root', async () => {
    mount('<div id="host"><o-collapse label="A">x</o-collapse></div>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const spy = vi.fn()
    document.getElementById('host')!.addEventListener('o-collapse-toggle', spy)
    el.toggle()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('does not fire when the state would not change', async () => {
    mount('<o-collapse open label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const spy = vi.fn()
    el.addEventListener('o-collapse-toggle', spy)
    el.toggle(true)
    expect(spy).not.toHaveBeenCalled()
  })

  it('ignores interaction when disabled', async () => {
    mount('<o-collapse disabled label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    el.toggle()
    expect(el.open).toBe(false)
  })

  it('toggles on Enter and Space', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const head = el.shadowRoot!.querySelector('.head') as HTMLElement
    head.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(el.open).toBe(true)
    head.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(el.open).toBe(false)
  })

  it('keeps aria-expanded in step with open state', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const head = el.shadowRoot!.querySelector('.head')!
    expect(head.getAttribute('aria-expanded')).toBe('false')
    el.toggle()
    expect(head.getAttribute('aria-expanded')).toBe('true')
  })

  it('wires aria-controls to the region it actually controls', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const head = el.shadowRoot!.querySelector('.head')!
    const body = el.shadowRoot!.querySelector('.body')!
    expect(head.getAttribute('aria-controls')).toBe(body.id)
    expect(body.getAttribute('aria-labelledby')).toBe(head.id)
  })

  it('gives nested instances distinct ids so ARIA does not collide', async () => {
    mount('<o-collapse label="A"><o-collapse label="B">x</o-collapse></o-collapse>')
    await tick()
    const [a, b] = Array.from(document.querySelectorAll('o-collapse')) as OCollapse[]
    const aId = a.shadowRoot!.querySelector('.head')!.id
    const bId = b.shadowRoot!.querySelector('.head')!.id
    expect(aId).toBeTruthy()
    expect(aId).not.toBe(bId)
  })

  it('reports nesting depth', async () => {
    mount('<o-collapse label="A"><o-collapse label="B"><o-collapse label="C">x</o-collapse></o-collapse></o-collapse>')
    await tick()
    const [a, b, c] = Array.from(document.querySelectorAll('o-collapse')) as OCollapse[]
    expect(a.depth).toBe(0)
    expect(b.depth).toBe(1)
    expect(c.depth).toBe(2)
  })

  it('leaves a child open when the parent closes, so state is restored on reopen', async () => {
    mount('<o-collapse open label="A"><o-collapse open label="B">x</o-collapse></o-collapse>')
    await tick()
    const [a, b] = Array.from(document.querySelectorAll('o-collapse')) as OCollapse[]
    a.toggle(false)
    expect(a.open).toBe(false)
    expect(b.open).toBe(true)
    a.toggle(true)
    expect(b.open).toBe(true)
  })

  it('does not rebuild the slot when only open changes', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const body = el.shadowRoot!.querySelector('.body')
    el.toggle()
    expect(el.shadowRoot!.querySelector('.body')).toBe(body)
  })

  it('themes from tokens rather than hardcoded colours', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    // Slice past glassBaseStyles(), whose :host block legitimately holds the
    // literal token VALUES. Only this component's own rules are under test.
    const rules = css.slice(css.indexOf(':host { display: block'))
    expect(rules).not.toMatch(/#[0-9a-f]{3,8}\b/i)
    expect(rules).not.toMatch(/rgba?\(/i)
    expect(rules).toContain('var(--glass-border-width)')
    expect(rules).toContain('var(--glass-font)')
  })

  it('respects prefers-reduced-motion', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    expect(css).toContain('prefers-reduced-motion')
  })

  it('animates via grid-template-rows, not a max-height magic number', async () => {
    mount('<o-collapse label="A">x</o-collapse>')
    const el = document.querySelector('o-collapse') as OCollapse
    await tick()
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    expect(css).toContain('grid-template-rows: 0fr')
    expect(css).toContain('grid-template-rows: 1fr')
    expect(css).not.toContain('max-height')
  })
})

describe('o-collapse-group', () => {
  afterEach(() => { document.body.innerHTML = ''; localStorage.clear() })

  const GROUP = `
    <o-collapse-group>
      <o-collapse open label="One"><o-collapse open label="One-A">x</o-collapse></o-collapse>
      <o-collapse open label="Two">y</o-collapse>
    </o-collapse-group>`

  it('finds every descendant panel, and the top level separately', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    expect(g.panels.length).toBe(3)
    expect(g.topLevel.map(p => p.label)).toEqual(['One', 'Two'])
  })

  it('collapseAll closes every panel including nested ones', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.collapseAll()
    expect(g.panels.every(p => !p.open)).toBe(true)
  })

  it('collapseAll({ topLevelOnly }) leaves nested state intact', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.collapseAll({ topLevelOnly: true })
    expect(g.topLevel.every(p => !p.open)).toBe(true)
    expect(g.panels.find(p => p.label === 'One-A')!.open).toBe(true)
  })

  it('expandAll reopens everything', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.collapseAll()
    g.expandAll()
    expect(g.panels.every(p => p.open)).toBe(true)
  })

  it('collapses multiple named panels without touching the rest', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.collapse(['One', 'One-A'])
    expect(g.panels.find(p => p.label === 'One')!.open).toBe(false)
    expect(g.panels.find(p => p.label === 'One-A')!.open).toBe(false)
    expect(g.panels.find(p => p.label === 'Two')!.open).toBe(true)
  })

  it('openLabels reflects and sets state', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    expect(g.openLabels.sort()).toEqual(['One', 'One-A', 'Two'])
    g.openLabels = ['Two']
    expect(g.openLabels).toEqual(['Two'])
  })

  it('accordion mode closes same-depth siblings only', async () => {
    mount(`
      <o-collapse-group accordion>
        <o-collapse label="A"><o-collapse label="A1">x</o-collapse></o-collapse>
        <o-collapse label="B">y</o-collapse>
      </o-collapse-group>`)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    const a = g.panels.find(p => p.label === 'A')!
    const a1 = g.panels.find(p => p.label === 'A1')!
    const b = g.panels.find(p => p.label === 'B')!
    a.toggle(true)
    a1.toggle(true)
    // Opening the child must not close its own parent.
    expect(a.open).toBe(true)
    expect(a1.open).toBe(true)
    b.toggle(true)
    expect(a.open).toBe(false)
    expect(b.open).toBe(true)
  })

  it('persists and restores open state via storage-key', async () => {
    mount(`
      <o-collapse-group storage-key="oc-test">
        <o-collapse open label="One">x</o-collapse>
        <o-collapse label="Two">y</o-collapse>
      </o-collapse-group>`)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.panels.find(p => p.label === 'Two')!.toggle(true)
    expect(JSON.parse(localStorage.getItem('oc-test')!).sort()).toEqual(['One', 'Two'])
  })

  it('survives a corrupt stored value', async () => {
    localStorage.setItem('oc-bad', '{not json')
    mount(`
      <o-collapse-group storage-key="oc-bad">
        <o-collapse open label="One">x</o-collapse>
      </o-collapse-group>`)
    await tick()
    await new Promise(r => requestAnimationFrame(() => r(null)))
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    expect(g.panels[0].open).toBe(true)
  })

  it('does no storage work without a storage-key', async () => {
    mount(GROUP)
    await tick()
    const g = document.querySelector('o-collapse-group') as OCollapseGroup
    g.collapseAll()
    expect(localStorage.length).toBe(0)
  })
})
