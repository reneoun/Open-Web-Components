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
})
