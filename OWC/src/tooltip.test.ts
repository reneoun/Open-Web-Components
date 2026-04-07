import { describe, it, expect, beforeEach } from 'vitest'
import './tooltip'

describe('OTooltip', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-tooltip')
    el.setAttribute('text', 'Hello tooltip')
    document.body.appendChild(el)
  })

  it('registers as o-tooltip', () => {
    expect(customElements.get('o-tooltip')).toBeDefined()
  })

  it('renders slot for trigger content', () => {
    expect(el.shadowRoot.querySelector('slot')).not.toBeNull()
  })

  it('tooltip hidden by default (no .visible class)', () => {
    const tip = el.shadowRoot.querySelector('.tooltip')
    expect(tip).not.toBeNull()
    expect(tip.classList.contains('visible')).toBe(false)
  })

  it('shows tooltip text from text attribute', () => {
    const tip = el.shadowRoot.querySelector('.tooltip')
    expect(tip.textContent).toBe('Hello tooltip')
  })

  it('position defaults to top (has .top class)', () => {
    const tip = el.shadowRoot.querySelector('.tooltip')
    expect(tip.classList.contains('top')).toBe(true)
  })

  it('supports position="bottom" (has .bottom class)', () => {
    el.setAttribute('position', 'bottom')
    const tip = el.shadowRoot.querySelector('.tooltip')
    expect(tip.classList.contains('bottom')).toBe(true)
  })

  it('has role="tooltip" on tooltip element', () => {
    const tip = el.shadowRoot.querySelector('.tooltip')
    expect(tip.getAttribute('role')).toBe('tooltip')
  })
})
