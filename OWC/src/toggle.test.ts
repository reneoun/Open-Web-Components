import { describe, it, expect, beforeEach } from 'vitest'
import './toggle'

describe('OToggle', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-toggle')
    document.body.appendChild(el)
  })

  it('registers as o-toggle', () => {
    expect(customElements.get('o-toggle')).toBeDefined()
  })

  it('renders segments from options attribute', () => {
    el.setAttribute('options', 'Day,Week,Month')
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(3)
    expect(segments[0].textContent?.trim()).toBe('Day')
    expect(segments[2].textContent?.trim()).toBe('Month')
  })

  it('renders from JS options string array', () => {
    ;(el as any).options = ['Day', 'Week', 'Month']
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(3)
  })

  it('renders from JS options object array', () => {
    ;(el as any).options = [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }]
    const segments = el.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(2)
    expect(segments[0].textContent?.trim()).toBe('Day')
  })

  it('reads options from child elements at connectedCallback', () => {
    document.body.innerHTML = ''
    const parent = document.createElement('div')
    parent.innerHTML = `
      <o-toggle>
        <span value="day">Day</span>
        <span value="week">Week</span>
      </o-toggle>
    `
    document.body.appendChild(parent)
    const toggle = parent.querySelector('o-toggle')!
    const segments = toggle.shadowRoot!.querySelectorAll('.segment')
    expect(segments.length).toBe(2)
    expect(segments[1].textContent?.trim()).toBe('Week')
  })

  it('renders empty with 0 options, no error', () => {
    ;(el as any).options = []
    expect(() => el.shadowRoot!.querySelectorAll('.segment')).not.toThrow()
    expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(0)
  })

  it('renders single segment with 1 option', () => {
    ;(el as any).options = ['Only']
    expect(el.shadowRoot!.querySelectorAll('.segment').length).toBe(1)
  })
})
