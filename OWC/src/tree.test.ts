import { describe, it, expect, afterEach } from 'vitest'
import './tree'
import type { OTree, TreeNodeData } from './tree'

const tick = () => new Promise(r => setTimeout(r, 0))
const mount = (html: string) => { document.body.innerHTML = html }
const get = () => document.querySelector('o-tree') as OTree
const rows = (t: OTree) => Array.from(t.shadowRoot!.querySelectorAll('.row')) as HTMLElement[]
const labels = (t: OTree) => rows(t).map(r => r.querySelector('.label')!.textContent)

const FS: TreeNodeData[] = [
  {
    label: 'src', open: true, children: [
      { label: 'components', children: [{ label: 'button.ts' }, { label: 'table.ts' }] },
      { label: 'index.ts' },
    ],
  },
  { label: 'README.md' },
]

const key = (el: HTMLElement, k: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))

describe('o-tree', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders from a nested data property', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    expect(labels(t)).toContain('src')
    expect(labels(t)).toContain('README.md')
  })

  it('reads declarative o-tree-node markup as config', async () => {
    mount(`<o-tree>
      <o-tree-node label="src" open>
        <o-tree-node label="index.ts"></o-tree-node>
      </o-tree-node>
    </o-tree>`)
    const t = get(); await tick()
    expect(labels(t)).toEqual(['src', 'index.ts'])
  })

  it('honours open flags when seeding, and hides closed children', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    // src is open so its children show; components is closed so its do not.
    expect(labels(t)).toContain('components')
    expect(labels(t)).not.toContain('button.ts')
  })

  it('expandAll reveals every descendant and collapseAll hides them', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    t.expandAll()
    expect(labels(t)).toContain('button.ts')
    t.collapseAll()
    expect(labels(t)).toEqual(['src', 'README.md'])
  })

  it('fires o-tree-toggle with node, path and open state', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const seen: unknown[] = []
    t.addEventListener('o-tree-toggle', e => seen.push((e as CustomEvent).detail))
    t.toggle([0], false)
    expect(seen).toEqual([{ node: FS[0], path: [0], open: false }])
  })

  it('fires o-tree-select on a leaf, bubbling and composed', async () => {
    mount('<o-tree selectable></o-tree>')
    const t = get(); t.data = FS
    await tick()
    let detail: { label?: string } = {}
    let composed = false
    document.addEventListener('o-tree-select', e => {
      detail = (e as CustomEvent).detail; composed = (e as CustomEvent).composed
    }, { once: true })
    const leaf = rows(t).find(r => r.querySelector('.label')!.textContent === 'README.md')!
    leaf.click()
    expect(detail.label).toBe('README.md')
    expect(composed).toBe(true)
  })

  it('marks branches with aria-expanded and leaves without it', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const byLabel = (l: string) => rows(t).find(r => r.querySelector('.label')!.textContent === l)!
    expect(byLabel('src').getAttribute('aria-expanded')).toBe('true')
    expect(byLabel('components').getAttribute('aria-expanded')).toBe('false')
    expect(byLabel('README.md').hasAttribute('aria-expanded')).toBe(false)
  })

  it('sets aria-level per depth and uses tree/treeitem/group roles', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick(); t.expandAll()
    const byLabel = (l: string) => rows(t).find(r => r.querySelector('.label')!.textContent === l)!
    expect(t.shadowRoot!.querySelector('[role="tree"]')).toBeTruthy()
    expect(byLabel('src').getAttribute('aria-level')).toBe('1')
    expect(byLabel('components').getAttribute('aria-level')).toBe('2')
    expect(byLabel('button.ts').getAttribute('aria-level')).toBe('3')
    expect(t.shadowRoot!.querySelectorAll('[role="group"]').length).toBeGreaterThan(0)
  })

  it('uses a roving tabindex — exactly one row is tabbable', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick(); t.expandAll()
    const tabbable = rows(t).filter(r => r.tabIndex === 0)
    expect(tabbable).toHaveLength(1)
  })

  it('ArrowRight expands a closed branch; ArrowLeft collapses it again', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const closed = () => rows(t).find(r => r.querySelector('.label')!.textContent === 'components')!
    key(closed(), 'ArrowRight')
    expect(labels(t)).toContain('button.ts')
    key(closed(), 'ArrowLeft')
    expect(labels(t)).not.toContain('button.ts')
  })

  it('ArrowDown moves focus to the next visible row', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const first = rows(t)[0]
    expect(first.tabIndex).toBe(0)
    key(first, 'ArrowDown')
    expect(rows(t)[1].tabIndex).toBe(0)
    expect(rows(t)[0].tabIndex).toBe(-1)
  })

  it('End jumps to the last visible row and Home back to the first', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    key(rows(t)[0], 'End')
    const r = rows(t)
    expect(r[r.length - 1].tabIndex).toBe(0)
    key(r[r.length - 1], 'Home')
    expect(rows(t)[0].tabIndex).toBe(0)
  })

  it('ArrowLeft on a leaf moves to its parent rather than doing nothing', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const leaf = rows(t).find(r => r.querySelector('.label')!.textContent === 'index.ts')!
    key(leaf, 'ArrowLeft')
    const parent = rows(t).find(r => r.querySelector('.label')!.textContent === 'src')!
    expect(parent.tabIndex).toBe(0)
  })

  it('renders a connector rail inside the indent, not on the row itself', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const kids = t.shadowRoot!.querySelector('.kids') as HTMLElement
    expect(kids).toBeTruthy()
    const css = t.shadowRoot!.querySelector('style')!.textContent!
    // The rail is a border on the group, so a nested row's own border in the
    // pixel theme cannot double against it.
    expect(css).toMatch(/\.kids\s*\{[^}]*border-left/)
  })

  it('distinguishes leaves from branches in the twisty affordance', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = FS
    await tick()
    const byLabel = (l: string) => rows(t).find(r => r.querySelector('.label')!.textContent === l)!
    expect(byLabel('README.md').querySelector('.tw')!.classList.contains('leaf')).toBe(true)
    expect(byLabel('src').querySelector('.tw')!.classList.contains('leaf')).toBe(false)
  })

  it('survives an empty tree without throwing', async () => {
    mount('<o-tree></o-tree>')
    const t = get(); t.data = []
    await tick()
    expect(rows(t)).toHaveLength(0)
  })
})
