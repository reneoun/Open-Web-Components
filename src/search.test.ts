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
})
