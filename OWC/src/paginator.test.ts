import { describe, it, expect, beforeEach } from 'vitest'
import './paginator'
import './table'
import { pageWindow } from './paginator'

function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }))
}

describe('OPaginator', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-paginator')
    el.setAttribute('total', '95')
    el.setAttribute('page-size', '10')
    document.body.appendChild(el)
  })

  it('registers as o-paginator', () => {
    expect(customElements.get('o-paginator')).toBeDefined()
  })

  it('derives totalPages, start and end from total + page-size', () => {
    expect(el.totalPages).toBe(10)
    expect(el.page).toBe(1)
    expect(el.start).toBe(0)
    expect(el.end).toBe(10)
  })

  it('last page ends at total, not a full page boundary', () => {
    el.page = 10
    expect(el.start).toBe(90)
    expect(el.end).toBe(95)
  })

  it('fires o-page with { page, start, end, totalPages, pageSize }', () => {
    let detail: any = null
    el.addEventListener('o-page', (e: any) => { detail = e.detail })
    el.page = 3
    expect(detail).toEqual({ page: 3, start: 20, end: 30, totalPages: 10, pageSize: 10 })
  })

  it('o-page bubbles and is composed', () => {
    let seen = false
    document.body.addEventListener('o-page', () => { seen = true })
    el.page = 2
    expect(seen).toBe(true)
  })

  it('clamps out-of-range pages instead of throwing', () => {
    el.page = 999
    expect(el.page).toBe(10)
    el.page = -5
    expect(el.page).toBe(1)
  })

  it('does not fire o-page when the page is unchanged', () => {
    let count = 0
    el.addEventListener('o-page', () => { count++ })
    el.page = 1
    expect(count).toBe(0)
  })

  it('clamps the current page down when total shrinks', () => {
    el.page = 9
    el.total = 12 // now only 2 pages
    expect(el.page).toBe(2)
  })

  it('renders a human 1-based range readout', () => {
    expect(el.shadowRoot.querySelector('.range').textContent).toContain('1–10 of 95')
    el.page = 2
    expect(el.shadowRoot.querySelector('.range').textContent).toContain('11–20 of 95')
  })

  it('reads 0 of 0 for an empty dataset', () => {
    el.total = 0
    expect(el.shadowRoot.querySelector('.range').textContent).toContain('0–0 of 0')
  })

  it('disables prev on the first page and next on the last', () => {
    const prev = () => el.shadowRoot.querySelector('[data-goto="prev"]')
    const next = () => el.shadowRoot.querySelector('[data-goto="next"]')
    expect(prev().hasAttribute('disabled')).toBe(true)
    expect(next().hasAttribute('disabled')).toBe(false)
    el.page = 10
    expect(prev().hasAttribute('disabled')).toBe(false)
    expect(next().hasAttribute('disabled')).toBe(true)
  })

  it('ignores clicks on disabled arrows', () => {
    let count = 0
    el.addEventListener('o-page', () => { count++ })
    el.shadowRoot.querySelector('[data-goto="prev"]').click()
    expect(count).toBe(0)
    expect(el.page).toBe(1)
  })

  it('navigates by clicking a page number', () => {
    // From page 1 the window is [1, 2, …, 10], so 2 is the reachable neighbour.
    el.shadowRoot.querySelector('[data-goto="2"]').click()
    expect(el.page).toBe(2)
  })

  it('reachable neighbours shift with the current page', () => {
    el.page = 5
    expect(el.shadowRoot.querySelector('[data-goto="4"]')).toBeTruthy()
    el.shadowRoot.querySelector('[data-goto="4"]').click()
    expect(el.page).toBe(4)
  })

  it('marks the active page with aria-current', () => {
    el.page = 3
    const active = el.shadowRoot.querySelector('.num.active')
    expect(active.textContent).toBe('3')
    expect(active.getAttribute('aria-current')).toBe('page')
  })

  it('a single page still renders and reports totalPages 1', () => {
    el.total = 4
    expect(el.totalPages).toBe(1)
    expect(el.shadowRoot.querySelector('[data-goto="next"]').hasAttribute('disabled')).toBe(true)
  })
})

describe('pageWindow', () => {
  it('lists every page when the count is small', () => {
    expect(pageWindow(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('elides the tail when near the start', () => {
    expect(pageWindow(2, 20)).toEqual([1, 2, 3, null, 20])
  })

  it('elides both sides in the middle', () => {
    expect(pageWindow(10, 20)).toEqual([1, null, 9, 10, 11, null, 20])
  })

  it('elides the head when near the end', () => {
    expect(pageWindow(19, 20)).toEqual([1, null, 18, 19, 20])
  })

  it('always includes first and last', () => {
    const w = pageWindow(10, 40)
    expect(w[0]).toBe(1)
    expect(w[w.length - 1]).toBe(40)
  })
})

describe('OTable pagination', () => {
  let table: any

  beforeEach(() => {
    document.body.innerHTML = ''
    table = document.createElement('o-table')
    table.setAttribute('page-size', '10')
    table.setAttribute('editable', '')
    document.body.appendChild(table)
    table.columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true, editable: 'always' },
    ]
    table.data = makeRows(95)
  })

  const bodyRows = () => table.shadowRoot.querySelectorAll('tbody tr')
  // The name column is always-editable, so it renders an <input>; the id cell
  // is the reliable identity read.
  const rowId = (tr: Element) => tr.querySelector('td')!.textContent!.trim()

  it('renders only one page of rows', () => {
    expect(bodyRows().length).toBe(10)
  })

  it('renders every row when page-size is absent', () => {
    table.removeAttribute('page-size')
    table.data = makeRows(25)
    expect(bodyRows().length).toBe(25)
  })

  it('embeds a pager reflecting the row count', () => {
    const pager = table.shadowRoot.querySelector('o-paginator')
    expect(pager).toBeTruthy()
    expect(pager.getAttribute('total')).toBe('95')
  })

  it('shows the next slice on page 2', () => {
    table.page = 2
    expect(rowId(bodyRows()[0])).toBe('11')
  })

  // The core regression: data-row-index must stay absolute into the sorted
  // view, or an edit on page 2 silently rewrites a row from page 1.
  it('keeps data-row-index absolute across pages', () => {
    table.page = 2
    const idx = bodyRows()[0].getAttribute('data-row-index')
    expect(idx).toBe('10')
  })

  it('edits the correct row on a later page', () => {
    table.page = 3
    let detail: any = null
    table.addEventListener('o-cell-change', (e: any) => { detail = e.detail })
    const input = table.shadowRoot.querySelector('tbody tr input.cell-input')
    input.value = 'EDITED'
    input.dispatchEvent(new Event('blur')) // commit binds to blur / Enter
    expect(detail).not.toBeNull()
    expect(detail.rowIndex).toBe(20)
    expect(detail.row.id).toBe(21)
  })

  it('paginates the sorted view, not the raw data', () => {
    table.shadowRoot.querySelectorAll('th[data-key]')[0].click() // id asc
    table.shadowRoot.querySelectorAll('th[data-key]')[0].click() // id desc
    expect(rowId(bodyRows()[0])).toBe('95')
    table.page = 2
    expect(rowId(bodyRows()[0])).toBe('85')
  })

  it('resets to page 1 when data is replaced', () => {
    table.page = 5
    table.data = makeRows(30)
    expect(table.page).toBe(1)
    expect(rowId(bodyRows()[0])).toBe('1')
  })

  it('clamps the page when a filter shrinks the dataset', () => {
    table.page = 9
    table.data = makeRows(12)
    expect(table.page).toBe(1)
    expect(bodyRows().length).toBe(10)
  })

  it('re-emits o-page from the table itself', () => {
    let detail: any = null
    table.addEventListener('o-page', (e: any) => { detail = e.detail })
    const pager = table.shadowRoot.querySelector('o-paginator') as any
    pager.page = 4
    expect(detail).not.toBeNull()
    expect(detail.page).toBe(4)
    expect(table.page).toBe(4)
  })

  it('selection survives paging away and back', () => {
    table.setAttribute('selectable', '')
    table.data = makeRows(95)
    const cb = table.shadowRoot.querySelector('tbody input[type="checkbox"]') as HTMLInputElement
    cb.click()
    const selectedId = (table.selected[0] as any).id
    expect(table.selected.length).toBe(1)
    table.page = 5
    expect(table.selected.length).toBe(1)
    table.page = 1
    expect(table.selected.length).toBe(1)
    expect((table.selected[0] as any).id).toBe(selectedId)
  })

  it('select-all scopes to the visible page when paginated', () => {
    table.setAttribute('selectable', '')
    table.data = makeRows(95)
    table.shadowRoot.querySelector('[data-select-all]').click()
    expect(table.selected.length).toBe(10)
  })

  it('select-all still covers every row when unpaginated', () => {
    table.removeAttribute('page-size')
    table.setAttribute('selectable', '')
    table.data = makeRows(25)
    table.shadowRoot.querySelector('[data-select-all]').click()
    expect(table.selected.length).toBe(25)
  })
})
