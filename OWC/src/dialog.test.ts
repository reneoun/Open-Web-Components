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

  it('backdrop hidden by default', () => {
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('open() shows backdrop', () => {
    el.open()
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(true)
  })

  it('close() hides backdrop', () => {
    el.open()
    el.close()
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('open attribute presence shows dialog', () => {
    el.setAttribute('open', '')
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(true)
  })

  it('removing open attribute hides dialog', () => {
    el.setAttribute('open', '')
    el.removeAttribute('open')
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('clicking backdrop fires o-cancel and closes', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    el.shadowRoot.querySelector('.backdrop').dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    expect(cancelled).toBe(true)
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('clicking panel does not fire o-cancel', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    el.shadowRoot.querySelector('.panel').dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    expect(cancelled).toBe(false)
  })

  it('Escape key fires o-cancel and closes', () => {
    el.open()
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(cancelled).toBe(true)
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })

  it('Escape key does not fire when dialog is closed', () => {
    let cancelled = false
    el.addEventListener('o-cancel', () => { cancelled = true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(cancelled).toBe(false)
  })

  it('collects named inputs on submit button click, fires o-submit, then closes', () => {
    el.innerHTML = `
      <span slot="title">Test</span>
      <input name="username" value="alice" />
      <input name="role" value="eng" />
      <div slot="actions"><button type="submit">Save</button></div>
    `
    el.open()
    let detail: any = null
    el.addEventListener('o-submit', (e: any) => { detail = e.detail })
    el.querySelector('button[type="submit"]').click()
    expect(detail).toEqual({ username: 'alice', role: 'eng' })
    expect(el.shadowRoot.querySelector('.backdrop').classList.contains('visible')).toBe(false)
  })
})
