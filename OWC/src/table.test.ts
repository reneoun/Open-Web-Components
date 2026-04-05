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

  // --- selectable ---

  describe('selectable', () => {
    let el: any

    beforeEach(() => {
      document.body.innerHTML = ''
      el = document.createElement('o-table')
      el.setAttribute('selectable', '')
      el.columns = [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]
      el.data = [{ name: 'Alice', role: 'Eng' }, { name: 'Bob', role: 'Design' }]
      document.body.appendChild(el)
    })

    it('adds a checkbox th when selectable', () => {
      const headers = el.shadowRoot.querySelectorAll('th')
      expect(headers.length).toBe(3) // checkbox + 2 columns
      expect(headers[0].querySelector('input[type="checkbox"]')).not.toBeNull()
    })

    it('adds a checkbox td per row', () => {
      const rows = el.shadowRoot.querySelectorAll('tbody tr')
      rows.forEach((tr: Element) => {
        expect(tr.querySelector('td input[type="checkbox"]')).not.toBeNull()
      })
    })

    it('selected is empty by default', () => {
      expect(el.selected).toEqual([])
    })

    it('clicking a row checkbox selects that row', () => {
      const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
      cb.click()
      expect(el.selected).toEqual([{ name: 'Alice', role: 'Eng' }])
    })

    it('clicking a selected row checkbox deselects it', () => {
      const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
      cb.click()
      cb.click()
      expect(el.selected).toEqual([])
    })

    it('fires o-row-select with selected rows on change', () => {
      let detail: any = null
      el.addEventListener('o-row-select', (e: any) => { detail = e.detail })
      const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
      cb.click()
      expect(detail).toEqual({ selected: [{ name: 'Alice', role: 'Eng' }] })
    })

    it('header checkbox selects all rows', () => {
      const headerCb = el.shadowRoot.querySelector('thead input[type="checkbox"]') as HTMLInputElement
      headerCb.click()
      expect(el.selected).toEqual([{ name: 'Alice', role: 'Eng' }, { name: 'Bob', role: 'Design' }])
    })

    it('header checkbox when all selected deselects all', () => {
      const headerCb = el.shadowRoot.querySelector('thead input[type="checkbox"]') as HTMLInputElement
      headerCb.click() // select all
      headerCb.click() // deselect all
      expect(el.selected).toEqual([])
    })

    it('reassigning data resets selection', () => {
      const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
      cb.click()
      expect(el.selected.length).toBe(1)
      el.data = [{ name: 'Carol', role: 'Mgmt' }]
      expect(el.selected).toEqual([])
    })

    it('selected rows are visually highlighted', () => {
      const cb = el.shadowRoot.querySelector('tbody tr input[type="checkbox"]') as HTMLInputElement
      cb.click()
      const selectedTr = el.shadowRoot.querySelector('tbody tr.selected')
      expect(selectedTr).not.toBeNull()
    })
  })

  describe('editable — always mode', () => {
    let el: any

    beforeEach(() => {
      document.body.innerHTML = ''
      el = document.createElement('o-table')
      el.setAttribute('editable', '')
      el.columns = [
        { key: 'name', label: 'Name', editable: 'always' },
        { key: 'role', label: 'Role' },
      ]
      el.data = [{ name: 'Alice', role: 'Engineer' }]
      document.body.appendChild(el)
    })

    it('renders input for always-editable column', () => {
      const input = el.shadowRoot.querySelector('[data-edit-always]')
      expect(input).not.toBeNull()
      expect(input.value).toBe('Alice')
    })

    it('non-editable column stays plain text', () => {
      const tds = el.shadowRoot.querySelectorAll('tbody td')
      expect(tds[1].querySelector('input')).toBeNull()
      expect(tds[1].textContent).toBe('Engineer')
    })

    it('fires o-cell-change on input change event', () => {
      let detail: any = null
      el.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
      const input = el.shadowRoot.querySelector('[data-edit-always]') as HTMLInputElement
      input.value = 'Bob'
      input.dispatchEvent(new Event('change'))
      expect(detail).toMatchObject({ key: 'name', value: 'Bob', rowIndex: 0 })
      expect(detail.row).toMatchObject({ name: 'Bob', role: 'Engineer' })
    })

    it('fires o-cell-change on Enter key', () => {
      let detail: any = null
      el.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
      const input = el.shadowRoot.querySelector('[data-edit-always]') as HTMLInputElement
      input.value = 'Carol'
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(detail).toMatchObject({ key: 'name', value: 'Carol' })
    })

    it('updates internal data after o-cell-change', () => {
      const input = el.shadowRoot.querySelector('[data-edit-always]') as HTMLInputElement
      input.value = 'Dave'
      input.dispatchEvent(new Event('change'))
      expect(el.data[0].name).toBe('Dave')
    })
  })

  describe('editable — click mode', () => {
    let el: any

    beforeEach(() => {
      document.body.innerHTML = ''
      el = document.createElement('o-table')
      el.setAttribute('editable', '')
      el.columns = [
        { key: 'name', label: 'Name', editable: 'click' },
        { key: 'role', label: 'Role' },
      ]
      el.data = [{ name: 'Alice', role: 'Engineer' }]
      document.body.appendChild(el)
    })

    it('renders pencil button for click-editable rows', () => {
      expect(el.shadowRoot.querySelector('[data-edit-row]')).not.toBeNull()
    })

    it('renders Actions header column', () => {
      const headers = [...el.shadowRoot.querySelectorAll('th')]
      expect(headers.some((th: any) => th.textContent.trim() === 'Actions')).toBe(true)
    })

    it('clicking pencil puts row in edit mode (shows input)', () => {
      el.shadowRoot.querySelector('[data-edit-row]').click()
      expect(el.shadowRoot.querySelector('[data-edit-click]')).not.toBeNull()
    })

    it('clicking pencil shows confirm and cancel buttons', () => {
      el.shadowRoot.querySelector('[data-edit-row]').click()
      expect(el.shadowRoot.querySelector('[data-confirm]')).not.toBeNull()
      expect(el.shadowRoot.querySelector('[data-cancel]')).not.toBeNull()
    })

    it('fires o-row-change with changes on confirm', () => {
      el.shadowRoot.querySelector('[data-edit-row]').click()
      const input = el.shadowRoot.querySelector('[data-edit-click]') as HTMLInputElement
      input.value = 'Bob'
      let detail: any = null
      el.addEventListener('o-row-change', (e: any) => { detail = e.detail })
      el.shadowRoot.querySelector('[data-confirm]').click()
      expect(detail).toMatchObject({ rowIndex: 0, changes: { name: 'Bob' } })
      expect(detail.row).toMatchObject({ name: 'Bob', role: 'Engineer' })
    })

    it('updates internal data after confirm', () => {
      el.shadowRoot.querySelector('[data-edit-row]').click()
      const input = el.shadowRoot.querySelector('[data-edit-click]') as HTMLInputElement
      input.value = 'Carol'
      el.shadowRoot.querySelector('[data-confirm]').click()
      expect(el.data[0].name).toBe('Carol')
    })

    it('cancel exits edit mode without firing o-row-change', () => {
      el.shadowRoot.querySelector('[data-edit-row]').click()
      let fired = false
      el.addEventListener('o-row-change', () => { fired = true })
      el.shadowRoot.querySelector('[data-cancel]').click()
      expect(fired).toBe(false)
      expect(el.shadowRoot.querySelector('[data-edit-row]')).not.toBeNull()
    })
  })
})
