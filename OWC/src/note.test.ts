import { describe, it, expect, beforeEach } from 'vitest'
import './note'

describe('ONote', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-note')
    document.body.appendChild(el)
  })

  it('registers as o-note', () => {
    expect(customElements.get('o-note')).toBeDefined()
  })

  describe('textarea variant (default)', () => {
    it('renders a textarea', () => {
      expect(el.shadowRoot!.querySelector('textarea')).not.toBeNull()
    })

    it('shows label when label attribute is set', () => {
      el.setAttribute('label', 'My Note')
      const label = el.shadowRoot!.querySelector('label')
      expect(label?.textContent).toBe('My Note')
    })

    it('shows no label when label attribute is absent', () => {
      expect(el.shadowRoot!.querySelector('label')).toBeNull()
    })

    it('shows char counter when max-length attribute is set', () => {
      el.setAttribute('max-length', '100')
      expect(el.shadowRoot!.querySelector('.counter')).not.toBeNull()
    })

    it('does not show counter without max-length', () => {
      expect(el.shadowRoot!.querySelector('.counter')).toBeNull()
    })

    it('fires o-change with { value } on textarea input', () => {
      let detail: any = null
      el.addEventListener('o-change', (e: any) => { detail = e.detail })
      const ta = el.shadowRoot!.querySelector('textarea')!
      ta.value = 'hello world'
      ta.dispatchEvent(new Event('input'))
      expect(detail).toEqual({ value: 'hello world' })
    })
  })

  describe('card variant', () => {
    beforeEach(() => {
      el.setAttribute('variant', 'card')
    })

    it('renders a title input', () => {
      expect(el.shadowRoot!.querySelector('.title-input')).not.toBeNull()
    })

    it('renders a body textarea', () => {
      expect(el.shadowRoot!.querySelector('.body-area')).not.toBeNull()
    })

    it('renders a tag input', () => {
      expect(el.shadowRoot!.querySelector('.tag-input')).not.toBeNull()
    })

    it('fires o-change with { title, body, tags } on title input', () => {
      let detail: any = null
      el.addEventListener('o-change', (e: any) => { detail = e.detail })
      const title = el.shadowRoot!.querySelector<HTMLInputElement>('.title-input')!
      title.value = 'Test Title'
      title.dispatchEvent(new Event('input'))
      expect(detail).toMatchObject({ title: 'Test Title', body: '', tags: [] })
    })

    it('adds a chip on Enter in tag input', () => {
      const tagInput = el.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')!
      tagInput.value = 'typescript'
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(el.shadowRoot!.querySelectorAll('.chip').length).toBe(1)
      expect(el.shadowRoot!.querySelector('.chip')!.textContent).toBe('typescript')
    })

    it('fires o-change with tags array after adding tag', () => {
      let detail: any = null
      el.addEventListener('o-change', (e: any) => { detail = e.detail })
      const tagInput = el.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')!
      tagInput.value = 'typescript'
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(detail.tags).toEqual(['typescript'])
    })

    it('removes chip on click and fires o-change', () => {
      const tagInput = el.shadowRoot!.querySelector<HTMLInputElement>('.tag-input')!
      tagInput.value = 'test'
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      let detail: any = null
      el.addEventListener('o-change', (e: any) => { detail = e.detail })
      el.shadowRoot!.querySelector<HTMLElement>('.chip')!.click()
      expect(el.shadowRoot!.querySelectorAll('.chip').length).toBe(0)
      expect(detail.tags).toEqual([])
    })
  })
})
