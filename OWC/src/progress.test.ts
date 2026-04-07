import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { OProgress } from './progress'
import './progress'

describe('OProgress', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    const el = document.createElement('o-progress')
    document.body.appendChild(el)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('registers as o-progress', () => {
    expect(customElements.get('o-progress')).toBeDefined()
  })

  it('bar starts at 0% width', () => {
    const el = document.querySelector('o-progress') as any
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('0%')
  })

  it('value attribute sets bar width', () => {
    const el = document.querySelector('o-progress') as any
    el.setAttribute('value', '60')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('60%')
  })

  it('value attribute clamps to 0-100', () => {
    const el = document.querySelector('o-progress') as any
    el.setAttribute('value', '150')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('100%')
    el.setAttribute('value', '-10')
    expect(el.shadowRoot.querySelector('.bar').style.width).toBe('0%')
  })

  it('OProgress.set() sets bar width', () => {
    OProgress.set(75)
    const bar = document.querySelector('o-progress')!.shadowRoot!.querySelector('.bar') as HTMLElement
    expect(bar.style.width).toBe('75%')
  })

  it('OProgress.set() clamps above 100 to 100%', () => {
    OProgress.set(200)
    const bar = document.querySelector('o-progress')!.shadowRoot!.querySelector('.bar') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('OProgress.done() sets bar to 100%', () => {
    OProgress.done()
    const bar = document.querySelector('o-progress')!.shadowRoot!.querySelector('.bar') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('OProgress.start() does not throw', () => {
    expect(() => OProgress.start()).not.toThrow()
    OProgress.done()
  })

  it('OProgress.set() clamps below 0 to 0%', () => {
    OProgress.set(-50)
    const bar = document.querySelector('o-progress')!.shadowRoot!.querySelector('.bar') as HTMLElement
    expect(bar.style.width).toBe('0%')
  })

  it('OProgress.start() is safe to call multiple times (continues from current position)', () => {
    OProgress.set(30)
    OProgress.start()
    OProgress.start() // second call should not throw or reset
    const bar = document.querySelector('o-progress')!.shadowRoot!.querySelector('.bar') as HTMLElement
    expect(bar.style.width).toBe('30%')
    OProgress.done()
  })

  it('_getInstance() creates o-progress element when none exists in DOM', () => {
    document.body.innerHTML = '' // remove the element set up in beforeEach
    OProgress.set(50)
    const el = document.querySelector('o-progress')
    expect(el).not.toBeNull()
    expect((el!.shadowRoot!.querySelector('.bar') as HTMLElement).style.width).toBe('50%')
  })
})
