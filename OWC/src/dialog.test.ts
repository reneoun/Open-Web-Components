import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './dialog'

describe('ODialog', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-dialog')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-dialog', () => {
    expect(customElements.get('o-dialog')).toBeDefined()
  })

  it('is hidden by default (no open attribute)', () => {
    expect(el.hasAttribute('open')).toBe(false)
  })

  it('open() adds open attribute', () => {
    el.open()
    expect(el.hasAttribute('open')).toBe(true)
  })

  it('close() removes open attribute', () => {
    el.open()
    el.close()
    expect(el.hasAttribute('open')).toBe(false)
  })

  it('fires o-cancel on Escape when open', () => {
    el.open()
    let fired = false
    el.addEventListener('o-cancel', () => { fired = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(fired).toBe(true)
  })

  it('does not fire o-cancel on Escape when closed', () => {
    let fired = false
    el.addEventListener('o-cancel', () => { fired = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(fired).toBe(false)
  })

  it('close() is called when Escape fires o-cancel', () => {
    el.open()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(el.hasAttribute('open')).toBe(false)
  })

  it('fires o-submit with named input values', () => {
    el.open()
    const input = document.createElement('input')
    input.name = 'username'
    input.value = 'alice'
    el.appendChild(input)
    let detail: any = null
    el.addEventListener('o-submit', (e: any) => { detail = e.detail })
    el._submit()
    expect(detail).toEqual({ username: 'alice' })
  })

  it('close() is called after _submit()', () => {
    el.open()
    el._submit()
    expect(el.hasAttribute('open')).toBe(false)
  })

  it('cleans up keydown listener on disconnectedCallback', () => {
    el.open()
    el.disconnectedCallback()
    let fired = false
    el.addEventListener('o-cancel', () => { fired = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(fired).toBe(false)
  })
})
