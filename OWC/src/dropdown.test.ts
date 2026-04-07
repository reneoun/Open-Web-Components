import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './dropdown'

describe('ODropdown', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-dropdown')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-dropdown', () => {
    expect(customElements.get('o-dropdown')).toBeDefined()
  })

  it('renders trigger slot and .menu', () => {
    expect(el.shadowRoot.querySelector('.trigger')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.menu')).not.toBeNull()
  })

  it('menu hidden by default (no .open class)', () => {
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })

  it('toggle() opens menu', () => {
    el.toggle()
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(true)
  })

  it('toggle() closes already-open menu', () => {
    el.toggle()
    el.toggle()
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })

  it('renders options set via JS with role="menuitem"', () => {
    el.options = [
      { label: 'Alpha', value: 'a' },
      { label: 'Beta', value: 'b' },
    ]
    const items = el.shadowRoot.querySelectorAll('[role="menuitem"]')
    expect(items.length).toBe(2)
    expect(items[0].textContent).toContain('Alpha')
    expect(items[1].textContent).toContain('Beta')
  })

  it('fires o-select on item click with correct detail', () => {
    el.options = [{ label: 'Alpha', value: 'a' }]
    el.toggle()
    let detail: any = null
    el.addEventListener('o-select', (e: any) => { detail = e.detail })
    el.shadowRoot.querySelector('[role="menuitem"]').click()
    expect(detail).toEqual({ value: 'a', label: 'Alpha' })
  })

  it('closes after selection', () => {
    el.options = [{ label: 'Alpha', value: 'a' }]
    el.toggle()
    el.shadowRoot.querySelector('[role="menuitem"]').click()
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })

  it('close() method closes menu', () => {
    el.toggle()
    el.close()
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })

  it('renders icon when provided', () => {
    el.options = [{ label: 'Star', value: 's', icon: '⭐' }]
    const icon = el.shadowRoot.querySelector('.icon')
    expect(icon).not.toBeNull()
    expect(icon.textContent).toContain('⭐')
  })

  it('Escape key closes open menu', () => {
    el.toggle()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })

  it('outside mousedown closes open menu', () => {
    el.toggle()
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(el.shadowRoot.querySelector('.menu').classList.contains('open')).toBe(false)
  })
})
