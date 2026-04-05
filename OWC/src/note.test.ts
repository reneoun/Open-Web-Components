import { describe, it, expect, beforeEach } from 'vitest'
import './note'

describe('ONote - textarea variant', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-note')
    document.body.appendChild(el)
  })

  it('registers as o-note', () => {
    expect(customElements.get('o-note')).toBeDefined()
  })

  it('renders textarea by default', () => {
    expect(el.shadowRoot.querySelector('textarea')).not.toBeNull()
  })

  it('shows label when label attribute set', () => {
    el.setAttribute('label', 'Notes')
    const label = el.shadowRoot.querySelector('label')
    expect(label?.textContent?.trim()).toBe('Notes')
  })

  // Fix 1: .counter is outer element; .count is inner span holding current count
  // Counter displays full "n / max" format
  it('shows character counter when max-length set', () => {
    el.setAttribute('max-length', '100')
    const counter = el.shadowRoot.querySelector('.counter')
    expect(counter).not.toBeNull()
    expect(counter!.textContent?.trim()).toBe('0 / 100')
  })

  it('counter updates on input', () => {
    el.setAttribute('max-length', '100')
    const ta = el.shadowRoot.querySelector('textarea')!
    ta.value = 'hello'
    ta.dispatchEvent(new Event('input'))
    expect(el.shadowRoot.querySelector('.count')!.textContent).toBe('5')
  })

  it('fires o-change with { value } on input', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const ta = el.shadowRoot.querySelector('textarea')!
    ta.value = 'hello'
    ta.dispatchEvent(new Event('input'))
    expect(detail).toEqual({ value: 'hello' })
  })

  it('uses placeholder attribute on textarea', () => {
    el.setAttribute('placeholder', 'Write here')
    const ta = el.shadowRoot.querySelector('textarea')!
    expect(ta.getAttribute('placeholder')).toBe('Write here')
  })

  // Fix 2: value attribute sets textarea value
  it('sets textarea value from value attribute', () => {
    el.setAttribute('value', 'hello')
    const ta = el.shadowRoot.querySelector('textarea')!
    expect(ta.value).toBe('hello')
  })

  // Fix 5: max-length → maxlength passthrough on textarea
  it('passes max-length as maxlength attribute on textarea', () => {
    el.setAttribute('max-length', '50')
    const ta = el.shadowRoot.querySelector('textarea')!
    expect(ta.getAttribute('maxlength')).toBe('50')
  })

  // auto-resize tested visually — happy-dom does not compute scrollHeight
})

describe('ONote - card variant', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-note')
    el.setAttribute('variant', 'card')
    document.body.appendChild(el)
  })

  it('renders card with title input, body textarea, and tag area', () => {
    expect(el.shadowRoot.querySelector('.title-input')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.body-area')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.tag-area')).not.toBeNull()
  })

  it('adds a chip on Enter in tag input', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'bug'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(el.shadowRoot.querySelector('.chip')).not.toBeNull()
    expect(el.shadowRoot.querySelector('.chip')!.textContent).toContain('bug')
  })

  it('does not add empty chip on Enter', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = '   '
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(el.shadowRoot.querySelector('.chip')).toBeNull()
  })

  it('removes chip on chip click', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'bug'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    el.shadowRoot.querySelector('.chip')!.click()
    expect(el.shadowRoot.querySelector('.chip')).toBeNull()
  })

  it('fires o-change with { title, body, tags } on title input', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const titleInput = el.shadowRoot.querySelector<HTMLInputElement>('.title-input')!
    titleInput.value = 'My Note'
    titleInput.dispatchEvent(new Event('input'))
    expect(detail).toMatchObject({ title: 'My Note', body: '', tags: [] })
  })

  it('fires o-change with updated tags after add', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'urgent'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(detail).toMatchObject({ tags: ['urgent'] })
  })

  // Fix 3: o-change fires when body textarea receives input
  it('fires o-change with { title, body, tags } on body textarea input', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const bodyArea = el.shadowRoot.querySelector<HTMLTextAreaElement>('.body-area')!
    bodyArea.value = 'some text'
    bodyArea.dispatchEvent(new Event('input'))
    expect(detail).toEqual({ title: '', body: 'some text', tags: [] })
  })

  // Fix 4: o-change fires after chip removal with tags: []
  it('fires o-change with tags: [] after chip removal', () => {
    const tagInput = el.shadowRoot.querySelector<HTMLInputElement>('.tag-input')!
    tagInput.value = 'bug'
    tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    el.shadowRoot.querySelector('.chip')!.click()
    expect(detail).toMatchObject({ tags: [] })
  })

  // Fix 6: placeholder attribute sets placeholder on .body-area textarea
  it('sets placeholder on body textarea from placeholder attribute', () => {
    el.setAttribute('placeholder', 'Notes here')
    const bodyArea = el.shadowRoot.querySelector<HTMLTextAreaElement>('.body-area')!
    expect(bodyArea.getAttribute('placeholder')).toBe('Notes here')
  })
})
