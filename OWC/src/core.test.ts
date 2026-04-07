import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './core'

describe('OWCButton', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-button')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-button custom element', () => {
    expect(customElements.get('o-button')).toBeDefined()
  })

  it('renders a <button> in shadow DOM', () => {
    const button = el.shadowRoot!.querySelector('button')
    expect(button).toBeDefined()
  })

  it('has a <slot> for content', () => {
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).toBeDefined()
  })

  it('fires o-click on button click', () => {
    let fired = false
    el.addEventListener('o-click', () => { fired = true })
    el.shadowRoot!.querySelector('button')!.click()
    expect(fired).toBe(true)
  })

  it('o-click event bubbles', () => {
    let fired = false
    document.body.addEventListener('o-click', () => { fired = true })
    el.shadowRoot!.querySelector('button')!.click()
    expect(fired).toBe(true)
  })

  it('o-click event is composed', () => {
    const handler = (e: Event) => {
      expect(e.composed).toBe(true)
    }
    el.addEventListener('o-click', handler)
    el.shadowRoot!.querySelector('button')!.click()
  })
})

describe('OWCPanel', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-panel custom element', () => {
    expect(customElements.get('o-panel')).toBeDefined()
  })

  it('renders .panel div in shadow DOM', () => {
    const panel = el.shadowRoot!.querySelector('.panel')
    expect(panel).toBeDefined()
  })

  it('has a <slot> for content', () => {
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).toBeDefined()
  })

  it('shows .move-handle when move attr set', () => {
    el.setAttribute('move', '')
    const handle = el.shadowRoot!.querySelector('.move-handle')
    expect(handle).toBeDefined()
  })

  it('hides .move-handle when move attr absent', () => {
    const handle = el.shadowRoot!.querySelector('.move-handle')
    expect(handle).toBeNull()
  })

  it('shows resize handles when resize attr set', () => {
    el.setAttribute('resize', '')
    const resizeE = el.shadowRoot!.querySelector('.resize-e')
    const resizeS = el.shadowRoot!.querySelector('.resize-s')
    const resizeSE = el.shadowRoot!.querySelector('.resize-se')
    expect(resizeE).toBeDefined()
    expect(resizeS).toBeDefined()
    expect(resizeSE).toBeDefined()
  })

  it('hides resize handles when resize attr absent', () => {
    const resizeE = el.shadowRoot!.querySelector('.resize-e')
    const resizeS = el.shadowRoot!.querySelector('.resize-s')
    const resizeSE = el.shadowRoot!.querySelector('.resize-se')
    expect(resizeE).toBeNull()
    expect(resizeS).toBeNull()
    expect(resizeSE).toBeNull()
  })
})
