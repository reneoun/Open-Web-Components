import { describe, it, expect, beforeEach } from 'vitest'
import './tabs'

describe('OTabs', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-tabs')
    el.innerHTML = `
      <div slot="tab" data-value="a">Tab A</div>
      <div slot="tab" data-value="b">Tab B</div>
      <div data-tab="a">Content A</div>
      <div data-tab="b">Content B</div>
    `
    document.body.appendChild(el)
  })

  it('registers as o-tabs', () => {
    expect(customElements.get('o-tabs')).toBeDefined()
  })

  it('renders tab buttons from [slot="tab"] children', () => {
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]')
    expect(tabs.length).toBe(2)
    expect(tabs[0].textContent?.trim()).toBe('Tab A')
    expect(tabs[1].textContent?.trim()).toBe('Tab B')
  })

  it('first tab is active by default', () => {
    expect((el as any).value).toBe('a')
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
  })

  it('fires o-change on tab click with { value, prev }', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    el.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')[1].click()
    expect(detail).not.toBeNull()
    expect(detail.value).toBe('b')
    expect(detail.prev).toBe('a')
  })

  it('shows/hides content panels based on active tab', () => {
    const panels = el.querySelectorAll<HTMLElement>('[data-tab]')
    // first panel visible, second hidden
    expect(panels[0].style.display).not.toBe('none')
    expect(panels[1].style.display).toBe('none')

    // click second tab
    el.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')[1].click()
    expect(panels[0].style.display).toBe('none')
    expect(panels[1].style.display).not.toBe('none')
  })

  it('value setter switches active tab without firing o-change', () => {
    let fired = false
    el.addEventListener('o-change', () => { fired = true })
    ;(el as any).value = 'b'
    expect((el as any).value).toBe('b')
    expect(fired).toBe(false)
    expect(el.shadowRoot!.querySelectorAll('[role="tab"]')[1].getAttribute('aria-selected')).toBe('true')
  })
})
