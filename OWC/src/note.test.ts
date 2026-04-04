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

  it('shows character counter when max-length set', () => {
    el.setAttribute('max-length', '100')
    const counter = el.shadowRoot.querySelector('.counter')
    expect(counter).not.toBeNull()
    expect(counter!.textContent).toContain('100')
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
})
