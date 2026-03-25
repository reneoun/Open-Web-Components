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

  it('defaults value to first option, no event fired', () => {
    let fired = false
    el.addEventListener('o-change', () => { fired = true })
    ;(el as any).options = ['Day', 'Week']
    expect((el as any).value).toBe('day')
    expect(fired).toBe(false)
  })

  it('value property reflects current selection', () => {
    ;(el as any).options = ['Day', 'Week', 'Month']
    expect((el as any).value).toBe('day')
    ;(el as any).value = 'week'
    expect((el as any).value).toBe('week')
  })

  it('setting value does not fire o-change', () => {
    ;(el as any).options = ['Day', 'Week']
    let fired = false
    el.addEventListener('o-change', () => { fired = true })
    ;(el as any).value = 'week'
    expect(fired).toBe(false)
  })

  it('setting value to unknown string: no-op', () => {
    ;(el as any).options = ['Day', 'Week']
    ;(el as any).value = 'day'
    ;(el as any).value = 'unknown'
    expect((el as any).value).toBe('day')
  })

  it('clicking a segment fires o-change with correct detail', () => {
    ;(el as any).options = ['Day', 'Week', 'Month']
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const segments = el.shadowRoot!.querySelectorAll<HTMLElement>('.segment')
    segments[1].click()
    expect(detail).not.toBeNull()
    expect(detail.value).toBe('week')
    expect(detail.index).toBe(1)
    expect(detail.prev).toBe('day')
  })

  it('clicking already-selected segment does not fire o-change', () => {
    ;(el as any).options = ['Day', 'Week']
    let fired = false
    el.addEventListener('o-change', () => { fired = true })
    const segments = el.shadowRoot!.querySelectorAll<HTMLElement>('.segment')
    segments[0].click() // already selected
    expect(fired).toBe(false)
  })

  it('1 option: clicking does not fire o-change', () => {
    ;(el as any).options = ['Only']
    let fired = false
    el.addEventListener('o-change', () => { fired = true })
    el.shadowRoot!.querySelector<HTMLElement>('.segment')!.click()
    expect(fired).toBe(false)
  })
})
