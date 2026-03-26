import { describe, it, expect, beforeEach } from 'vitest'
import './search'

describe('OSearch', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-search')
    document.body.appendChild(el)
  })

  it('registers as o-search', () => {
    expect(customElements.get('o-search')).toBeDefined()
  })

  it('renders an input element', () => {
    expect(el.shadowRoot!.querySelector('input')).not.toBeNull()
  })

  it('placeholder attribute sets input placeholder', () => {
    el.setAttribute('placeholder', 'Find...')
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
    expect(input.placeholder).toBe('Find...')
  })

  it('placeholder attribute change updates placeholder without destroying input', () => {
    const input1 = el.shadowRoot!.querySelector('input')
    el.setAttribute('placeholder', 'New placeholder')
    const input2 = el.shadowRoot!.querySelector('input')
    expect(input1).toBe(input2) // same element, not recreated
    expect((input2 as HTMLInputElement).placeholder).toBe('New placeholder')
  })

  function fireInput(el: HTMLElement, value: string) {
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  it('typing fires o-input with { query }', () => {
    let detail: any = null
    el.addEventListener('o-input', (e: any) => { detail = e.detail })
    fireInput(el, 'ali')
    expect(detail).toEqual({ query: 'ali' })
  })

  it('typing fires o-results with filtered array using searchKeys', () => {
    ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
    ;(el as any).searchKeys = ['name']
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'ali')
    expect(detail.query).toBe('ali')
    expect(detail.results).toEqual([{ name: 'Alice' }])
  })

  it('o-results fires with empty array when no matches', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'xyz')
    expect(detail.results).toEqual([])
  })

  it('o-results fires even when no-dropdown is present', () => {
    el.setAttribute('no-dropdown', '')
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'ali')
    expect(detail.results).toEqual([{ name: 'Alice' }])
  })

  it('o-results fires even when renderItem is not set', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'ali')
    expect(detail.results).toEqual([{ name: 'Alice' }])
  })

  it('custom filterFn overrides default filter', () => {
    ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
    ;(el as any).filterFn = (_q: string, item: any) => item.name === 'Bob'
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'anything')
    expect(detail.results).toEqual([{ name: 'Bob' }])
  })

  it('searchKeys not set: default filter returns no matches', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    // searchKeys intentionally not set
    let detail: any = null
    el.addEventListener('o-results', (e: any) => { detail = e.detail })
    fireInput(el, 'ali')
    expect(detail.results).toEqual([])
  })

  it('renderItem output appears in dropdown items', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => `<strong>${item.name}</strong>`
    fireInput(el, 'ali')
    const items = el.shadowRoot!.querySelectorAll('.item[data-index]')
    expect(items.length).toBe(1)
    expect(items[0].innerHTML).toBe('<strong>Alice</strong>')
  })

  it('dropdown hidden when no-dropdown present', () => {
    el.setAttribute('no-dropdown', '')
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, 'ali')
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
    expect(dropdown.style.display).toBe('none')
  })

  it('dropdown hidden when query is empty', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, '')
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
    expect(dropdown.style.display).toBe('none')
  })

  it('dropdown shows No results when query non-empty but no matches', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, 'xyz')
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
    expect(dropdown.style.display).toBe('block')
    expect(dropdown.querySelector('.no-results')).not.toBeNull()
  })

  it('clicking dropdown item fires o-select with { item, query }', () => {
    ;(el as any).data = [{ name: 'Alice' }, { name: 'Bob' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, 'ali')
    let detail: any = null
    el.addEventListener('o-select', (e: any) => { detail = e.detail })
    el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
    expect(detail.item).toEqual({ name: 'Alice' })
    expect(detail.query).toBe('ali')
  })

  it('clicking item fills input with item[valueKey]', () => {
    ;(el as any).data = [{ name: 'Alice', id: 1 }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    el.setAttribute('value-key', 'name')
    fireInput(el, 'ali')
    el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('Alice')
  })

  it('clicking item with missing valueKey field leaves input unchanged', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    el.setAttribute('value-key', 'nonexistent')
    fireInput(el, 'ali')
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
    input.value = 'ali' // set explicitly as fireInput already did, but be explicit
    el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
    expect(input.value).toBe('ali') // unchanged
  })

  it('clicking item closes dropdown', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, 'ali')
    el.shadowRoot!.querySelector<HTMLElement>('[data-index="0"]')!.click()
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
    expect(dropdown.style.display).toBe('none')
  })

  it('click-outside closes dropdown', () => {
    ;(el as any).data = [{ name: 'Alice' }]
    ;(el as any).searchKeys = ['name']
    ;(el as any).renderItem = (item: any) => item.name
    fireInput(el, 'ali')
    // click outside: dispatch click on document.body (not inside el)
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }))
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
    expect(dropdown.style.display).toBe('none')
  })
})
