import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './skeleton'

describe('OSkeleton', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-skeleton')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-skeleton', () => {
    expect(customElements.get('o-skeleton')).toBeDefined()
  })

  it('block variant renders a single .skel element', () => {
    expect(el.shadowRoot.querySelector('.skel')).not.toBeNull()
  })

  it('block variant applies width attribute as inline style', () => {
    el.setAttribute('width', '200px')
    expect(el.shadowRoot.querySelector('.skel').style.width).toBe('200px')
  })

  it('block variant applies height attribute as inline style', () => {
    el.setAttribute('height', '40px')
    expect(el.shadowRoot.querySelector('.skel').style.height).toBe('40px')
  })

  it('table variant renders a .header row', () => {
    el.setAttribute('variant', 'table')
    expect(el.shadowRoot.querySelector('.header')).not.toBeNull()
  })

  it('table variant defaults to 5 body rows', () => {
    el.setAttribute('variant', 'table')
    const rows = el.shadowRoot.querySelectorAll('.row:not(.header)')
    expect(rows.length).toBe(5)
  })

  it('table variant renders correct number of body rows from rows attribute', () => {
    el.setAttribute('variant', 'table')
    el.setAttribute('rows', '3')
    const rows = el.shadowRoot.querySelectorAll('.row:not(.header)')
    expect(rows.length).toBe(3)
  })

  it('panel variant renders .title element', () => {
    el.setAttribute('variant', 'panel')
    expect(el.shadowRoot.querySelector('.title')).not.toBeNull()
  })

  it('panel variant renders two .line elements', () => {
    el.setAttribute('variant', 'panel')
    expect(el.shadowRoot.querySelectorAll('.line').length).toBe(2)
  })
})
