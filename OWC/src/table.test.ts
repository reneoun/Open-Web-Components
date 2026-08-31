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

  describe('editable', () => {
    let el: any

    beforeEach(() => {
      document.body.innerHTML = ''
      el = document.createElement('o-table')
      el.setAttribute('editable', '')
      el.columns = [
        { key: 'name',   label: 'Name',   editable: 'always' },
        { key: 'role',   label: 'Role',   editable: 'click'  },
        { key: 'status', label: 'Status' }
      ]
      el.data = [{ name: 'Alice', role: 'Eng', status: 'Active' }]
      document.body.appendChild(el)
    })

    it('renders input for always-editable column', () => {
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')
      expect(input).not.toBeNull()
    })

    it('does not render input for read-only column', () => {
      const inputs = [...el.shadowRoot.querySelectorAll<HTMLInputElement>('input.cell-input')]
      expect(inputs.map(i => i.dataset.key)).not.toContain('status')
    })

    it('renders edit button for rows with click-editable columns', () => {
      expect(el.shadowRoot.querySelector('.edit-btn')).not.toBeNull()
    })

    it('does not show input for click-editable column before edit button clicked', () => {
      const input = el.shadowRoot.querySelector('input.cell-input[data-key="role"]')
      expect(input).toBeNull()
    })

    it('click edit button shows edit form row below', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const editRow = el.shadowRoot.querySelector('tr.edit-row')
      expect(editRow).not.toBeNull()
      const keys = [...editRow.querySelectorAll<HTMLInputElement>('input.cell-input')]
        .map(i => i.dataset.key)
      expect(keys).toContain('role')
    })

    it('click edit button highlights original row', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const origRow = el.shadowRoot.querySelector('tr.editing-highlight')
      expect(origRow).not.toBeNull()
    })

    it('original row stays read-only when editing (click-editable cells)', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const origRow = el.shadowRoot.querySelector('tr[data-row-index="0"]')
      const roleInput = origRow.querySelector('input.cell-input[data-key="role"]')
      expect(roleInput).toBeNull()
    })

    it('click edit button shows confirm button in edit form row', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const editRow = el.shadowRoot.querySelector('tr.edit-row')
      expect(editRow.querySelector('.edit-confirm')).not.toBeNull()
    })

    it('click edit button shows cancel button in edit form row', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const editRow = el.shadowRoot.querySelector('tr.edit-row')
      expect(editRow.querySelector('.edit-cancel')).not.toBeNull()
    })

    it('only one row editable at a time', () => {
      el.data = [
        { name: 'Alice', role: 'Eng', status: 'Active' },
        { name: 'Bob', role: 'Design', status: 'Away' }
      ]
      el.shadowRoot.querySelector('.edit-btn').click()
      expect(el.shadowRoot.querySelectorAll('tr.edit-row').length).toBe(1)
      // After re-render, second row's edit btn is now the only .edit-btn
      el.shadowRoot.querySelector('.edit-btn').click()
      expect(el.shadowRoot.querySelectorAll('tr.edit-row').length).toBe(1)
      expect(el.shadowRoot.querySelector('tr.edit-row').dataset.editFor).toBe('1')
    })

    it('fires o-cell-change on blur when always-editable value changed', () => {
      let detail: any = null
      el.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')!
      input.value = 'Bob'
      input.dispatchEvent(new Event('blur'))
      expect(detail).not.toBeNull()
      expect(detail.key).toBe('name')
      expect(detail.value).toBe('Bob')
      expect(detail.rowIndex).toBe(0)
      expect(detail.row).toEqual({ name: 'Bob', role: 'Eng', status: 'Active' })
    })

    it('does not fire o-cell-change when value unchanged on blur', () => {
      let fired = false
      el.addEventListener('o-cell-change', () => { fired = true })
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')!
      input.value = 'Alice'
      input.dispatchEvent(new Event('blur'))
      expect(fired).toBe(false)
    })

    it('fires o-row-change on confirm with changed click-editable values', () => {
      let detail: any = null
      el.addEventListener('o-row-change', (e: any) => { detail = e.detail })
      el.shadowRoot.querySelector('.edit-btn').click()
      const editRow = el.shadowRoot.querySelector('tr.edit-row')
      const input = editRow.querySelector<HTMLInputElement>('input.cell-input[data-key="role"]')!
      input.value = 'Design'
      editRow.querySelector('.edit-confirm').click()
      expect(detail).not.toBeNull()
      expect(detail.changes).toEqual({ role: 'Design' })
      expect(detail.rowIndex).toBe(0)
      expect(detail.row).toEqual({ name: 'Alice', role: 'Design', status: 'Active' })
    })

    it('confirm removes edit form row', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      expect(el.shadowRoot.querySelector('tr.edit-row')).not.toBeNull()
      el.shadowRoot.querySelector('tr.edit-row .edit-confirm').click()
      expect(el.shadowRoot.querySelector('tr.edit-row')).toBeNull()
    })

    it('cancel restores original row values and removes edit row', () => {
      el.shadowRoot.querySelector('.edit-btn').click()
      const editRow = el.shadowRoot.querySelector('tr.edit-row')
      const input = editRow.querySelector<HTMLInputElement>('input.cell-input[data-key="role"]')!
      input.value = 'Design'
      editRow.querySelector('.edit-cancel').click()
      expect(el.shadowRoot.querySelector('tr.edit-row')).toBeNull()
      const cells = [...el.shadowRoot.querySelectorAll('tbody tr td')]
      expect(cells[1].textContent).toBe('Eng')
    })

    it('Enter keypress on always-editable input fires o-cell-change', () => {
      let detail: any = null
      el.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
      const input = el.shadowRoot.querySelector<HTMLInputElement>('input.cell-input[data-key="name"]')!
      input.value = 'Charlie'
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      expect(detail).not.toBeNull()
      expect(detail.key).toBe('name')
      expect(detail.value).toBe('Charlie')
    })

    describe('without editable attribute', () => {
      let el2: any

      beforeEach(() => {
        document.body.innerHTML = ''
        el2 = document.createElement('o-table')
        el2.columns = [{ key: 'name', label: 'Name', editable: 'always' }]
        el2.data = [{ name: 'Alice' }]
        document.body.appendChild(el2)
      })

      afterEach(() => {
        document.body.innerHTML = ''
      })

      it('no edit controls when editable attribute absent', () => {
        expect(el2.shadowRoot.querySelector('input.cell-input')).toBeNull()
      })
    })
  })
})

describe('editable cell input box model', () => {
  // happy-dom has no layout engine, so a true rendered-width assertion is not
  // possible here — that measurement is done in the browser pass. What IS
  // pinnable is the CSS contract that makes the width border-proof, which is
  // exactly what regressed: a content-box input with a hardcoded `- 4px` fudge
  // overflowed its cell by padding + 2x border, and td{overflow:hidden} clipped
  // it out of sight. Worst in pixel, whose border is 3px rather than 1px.
  const css = () => {
    const t = document.createElement('o-table') as any
    document.body.appendChild(t)
    t.columns = [{ key: 'name', label: 'Name', editable: 'always' }]
    t.data = [{ name: 'Ada' }]
    t.setAttribute('editable', '')
    const style = t.shadowRoot.querySelector('style').textContent as string
    document.body.removeChild(t)
    return style
  }

  it('sizes the input with border-box so padding and border are absorbed', () => {
    const s = css()
    const block = s.slice(s.indexOf('.cell-input {'), s.indexOf('.cell-input:focus'))
    expect(block).toContain('box-sizing: border-box')
    expect(block).toMatch(/width:\s*100%/)
  })

  it('no longer hardcodes a 1px-border width fudge', () => {
    const block = css()
    expect(block).not.toContain('calc(100% - 4px)')
  })

  it('derives the input border from the theme, not a fixed width', () => {
    const s = css()
    const block = s.slice(s.indexOf('.cell-input {'), s.indexOf('.cell-input:focus'))
    expect(block).toContain('var(--glass-border-width)')
  })

  it('gives an editing cell its own gutter so a thick border clears the edge', () => {
    const s = css()
    expect(s).toContain('td.cell-edit')
  })

  it('marks always-editable cells so the gutter rule can target them', () => {
    const t = document.createElement('o-table') as any
    document.body.appendChild(t)
    t.columns = [{ key: 'name', label: 'Name', editable: 'always' }]
    t.data = [{ name: 'Ada' }]
    t.setAttribute('editable', '')
    const td = t.shadowRoot.querySelector('td.cell-edit')
    expect(td).toBeTruthy()
    expect(td.querySelector('input.cell-input')).toBeTruthy()
    document.body.removeChild(t)
  })

  it('tokenises the confirm and cancel colours instead of hardcoding them', () => {
    const s = css()
    // NB: not asserting the raw rgba is absent from the whole sheet — it is now
    // legitimately present as glass-dark's own --glass-positive token value.
    // What matters is that the rule references the token rather than a literal.
    expect(s).toContain('.edit-confirm { color: var(--glass-positive); }')
    expect(s).toContain('.edit-cancel { color: var(--glass-negative); }')
  })
})
