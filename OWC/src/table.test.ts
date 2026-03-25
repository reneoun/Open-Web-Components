import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './table'

describe('OTable', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-table')
    document.body.appendChild(el)
  })

  afterEach(() => localStorage.clear())

  it('registers as o-table', () => {
    expect(customElements.get('o-table')).toBeDefined()
  })

  it('renders column headers', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th')
    expect(th?.textContent?.trim()).toContain('Name')
  })

  it('renders data rows', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
    const rows = el.shadowRoot!.querySelectorAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('applies fit-content width when column has no width', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name' }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th') as HTMLElement
    expect(th.style.width).toBe('fit-content')
  })

  it('applies px width when column has width', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name', width: 200 }]
    ;(el as any).data = []
    const th = el.shadowRoot!.querySelector('th') as HTMLElement
    expect(th.style.width).toBe('200px')
  })

  // Task 2: Sorting
  it('sorts asc on first header click (sortable col)', () => {
    ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
    ;(el as any).data = [{ age: 30 }, { age: 20 }, { age: 25 }]
    el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
    const cells = el.shadowRoot!.querySelectorAll('td')
    expect([...cells].map(c => c.textContent)).toEqual(['20', '25', '30'])
  })

  it('sorts desc on second click', () => {
    ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
    ;(el as any).data = [{ age: 30 }, { age: 20 }]
    const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
    th.click(); th.click()
    const cells = el.shadowRoot!.querySelectorAll('td')
    expect([...cells].map(c => c.textContent)).toEqual(['30', '20'])
  })

  it('clears sort on third click', () => {
    ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
    ;(el as any).data = [{ age: 30 }, { age: 20 }]
    const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
    th.click(); th.click(); th.click()
    const cells = el.shadowRoot!.querySelectorAll('td')
    expect([...cells].map(c => c.textContent)).toEqual(['30', '20'])
  })

  it('fires o-sort event', () => {
    ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
    ;(el as any).data = []
    let event: CustomEvent | null = null
    el.addEventListener('o-sort', (e) => { event = e as CustomEvent })
    el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
    expect(event).not.toBeNull()
    expect((event as any).detail).toEqual({ col: 'age', dir: 'asc' })
  })

  it('does not sort non-sortable columns', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name', sortable: false }]
    ;(el as any).data = [{ name: 'Bob' }, { name: 'Alice' }]
    el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
    const cells = el.shadowRoot!.querySelectorAll('td')
    expect([...cells].map(c => c.textContent)).toEqual(['Bob', 'Alice'])
  })

  // Task 3: Column resize
  it('resizes column on drag (single mode)', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name', width: 200 }]
    ;(el as any).data = []
    const handle = el.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!
    handle.dispatchEvent(new MouseEvent('mousedown', { screenX: 0, bubbles: true }))
    document.dispatchEvent(new MouseEvent('mousemove', { screenX: 50 }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
    expect(parseInt(th.style.width)).toBe(250)
  })

  it('respects minWidth constraint', () => {
    ;(el as any).columns = [{ key: 'name', label: 'Name', width: 100, minWidth: 80 }]
    ;(el as any).data = []
    const handle = el.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!
    handle.dispatchEvent(new MouseEvent('mousedown', { screenX: 0, bubbles: true }))
    document.dispatchEvent(new MouseEvent('mousemove', { screenX: -50 }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    const th = el.shadowRoot!.querySelector<HTMLElement>('th')!
    expect(parseInt(th.style.width)).toBeGreaterThanOrEqual(80)
  })

  // Task 4: State persistence
  it('persists sort state to localStorage', () => {
    el.setAttribute('storage', 'local')
    el.setAttribute('storage-key', 'test-table')
    ;(el as any).columns = [{ key: 'age', label: 'Age', sortable: true }]
    ;(el as any).data = []
    el.shadowRoot!.querySelector<HTMLElement>('th')!.click()
    const saved = JSON.parse(localStorage.getItem('test-table')!)
    expect(saved.sortCol).toBe('age')
    expect(saved.sortDir).toBe('asc')
  })

  it('restores sort state from localStorage on connect', () => {
    localStorage.setItem('test-table', JSON.stringify({ sortCol: 'age', sortDir: 'desc', widths: {} }))
    const el2 = document.createElement('o-table') as any
    el2.setAttribute('storage', 'local')
    el2.setAttribute('storage-key', 'test-table')
    el2.columns = [{ key: 'age', label: 'Age', sortable: true }]
    el2.data = [{ age: 10 }, { age: 5 }]
    document.body.appendChild(el2)
    const cells = el2.shadowRoot!.querySelectorAll('td')
    expect([...cells].map((c: HTMLElement) => c.textContent)).toEqual(['10', '5'])
  })
})
