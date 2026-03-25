import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import './toast'
import { toast } from './toast'

describe('OWCToast', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => vi.useRealTimers())

  it('registers as o-toast', () => {
    expect(customElements.get('o-toast')).toBeDefined()
  })

  it('projects slot content into shadow DOM', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.innerHTML = '<strong>Hello</strong>'
    document.body.appendChild(el)
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).not.toBeNull()
    expect(el.shadowRoot!.querySelector('#msg')).not.toBeNull()
  })

  it('shows message attribute when no slot content', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'info')
    el.setAttribute('message', 'Fallback text')
    document.body.appendChild(el)
    const msg = el.shadowRoot!.querySelector('#msg') as HTMLElement
    expect(msg.textContent).toBe('Fallback text')
    expect(msg.style.display).not.toBe('none')
  })

  it('hides #msg span when slot content present', () => {
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.innerHTML = 'Real content'
    document.body.appendChild(el)
    const msg = el.shadowRoot!.querySelector('#msg') as HTMLElement
    expect(msg.style.display).toBe('none')
  })

  it('removes itself after duration', async () => {
    vi.useFakeTimers()
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.setAttribute('duration', '500')
    el.innerHTML = 'Hi'
    document.body.appendChild(el)
    vi.advanceTimersByTime(1200) // duration + fallback timeout
    expect(document.body.contains(el)).toBe(false)
  })

  it('does not remove itself before duration', () => {
    vi.useFakeTimers()
    const el = document.createElement('o-toast') as HTMLElement
    el.setAttribute('type', 'success')
    el.setAttribute('duration', '3000')
    el.innerHTML = 'Hi'
    document.body.appendChild(el)
    vi.advanceTimersByTime(1000)
    expect(document.body.contains(el)).toBe(true)
  })
})

describe('toast() helper', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.head.querySelectorAll('style[data-owc-toast]').forEach(s => s.remove())
    const container = document.getElementById('o-toast-container')
    container?.remove()
  })

  it('creates container on first call', () => {
    toast('Hello', 'success')
    expect(document.getElementById('o-toast-container')).not.toBeNull()
  })

  it('appends o-toast element', () => {
    toast('Hello', 'success')
    const container = document.getElementById('o-toast-container')!
    expect(container.querySelector('o-toast')).not.toBeNull()
  })

  it('sets content as innerHTML', () => {
    toast('<strong>Hi</strong>', 'error')
    const el = document.querySelector('o-toast')!
    expect(el.innerHTML).toBe('<strong>Hi</strong>')
  })

  it('sets type attribute', () => {
    toast('Hi', 'warning')
    expect(document.querySelector('o-toast')!.getAttribute('type')).toBe('warning')
  })

  it('does not create duplicate containers', () => {
    toast('A', 'info')
    toast('B', 'info')
    expect(document.querySelectorAll('#o-toast-container').length).toBe(1)
  })
})
