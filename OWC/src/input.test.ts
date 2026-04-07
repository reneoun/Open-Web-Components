import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './input'

describe('OInput', () => {
  let el: any

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-input')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-input', () => {
    expect(customElements.get('o-input')).toBeDefined()
  })

  it('renders label when label attribute set', () => {
    el.setAttribute('label', 'Name')
    const label = el.shadowRoot.querySelector('label')
    expect(label).not.toBeNull()
    expect(label.textContent).toBe('Name')
  })

  it('does not render label when label attribute absent', () => {
    expect(el.shadowRoot.querySelector('label')).toBeNull()
  })

  it('sets input type from type attribute (default: text)', () => {
    expect(el.shadowRoot.querySelector('input').type).toBe('text')
    el.setAttribute('type', 'password')
    expect(el.shadowRoot.querySelector('input').type).toBe('password')
  })

  it('fires o-input on keystroke with { value }', () => {
    let detail: any = null
    el.addEventListener('o-input', (e: any) => { detail = e.detail })
    const input = el.shadowRoot.querySelector('input')
    input.value = 'hello'
    input.dispatchEvent(new Event('input'))
    expect(detail).toMatchObject({ value: 'hello' })
  })

  it('fires o-change on blur with { value }', () => {
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const input = el.shadowRoot.querySelector('input')
    input.value = 'world'
    input.dispatchEvent(new Event('blur'))
    expect(detail).toMatchObject({ value: 'world' })
  })

  it('shows error message when error attribute set', () => {
    el.setAttribute('error', 'Required field')
    const msg = el.shadowRoot.querySelector('.error-msg')
    expect(msg).not.toBeNull()
    expect(msg.textContent).toBe('Required field')
  })

  it('does not show error message when error attribute absent', () => {
    expect(el.shadowRoot.querySelector('.error-msg')).toBeNull()
  })

  it('.value getter returns current input value', () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'test'
    expect(el.value).toBe('test')
  })

  it('.value setter updates the input element', () => {
    el.value = 'preset'
    expect(el.shadowRoot.querySelector('input').value).toBe('preset')
  })

  it('disabled attribute disables the input', () => {
    el.setAttribute('disabled', '')
    expect(el.shadowRoot.querySelector('input').disabled).toBe(true)
  })

  it('reflects placeholder attribute on inner input', () => {
    el.setAttribute('placeholder', 'Enter text...')
    expect(el.shadowRoot.querySelector('input').placeholder).toBe('Enter text...')
  })

  it('reflects name attribute on inner input', () => {
    el.setAttribute('name', 'username')
    expect(el.shadowRoot.querySelector('input').name).toBe('username')
  })

  it('success attribute applies green border style', () => {
    el.setAttribute('success', '')
    const input = el.shadowRoot.querySelector('input')
    expect(input.style.borderColor).not.toBe('')
  })

  it('error attribute applies red border style', () => {
    el.setAttribute('error', 'Bad input')
    const input = el.shadowRoot.querySelector('input')
    expect(input.style.borderColor).not.toBe('')
  })
})
