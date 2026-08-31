import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './core'

describe('OWCButton', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-button')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-button custom element', () => {
    expect(customElements.get('o-button')).toBeDefined()
  })

  it('renders a <button> in shadow DOM', () => {
    const button = el.shadowRoot!.querySelector('button')
    expect(button).toBeDefined()
  })

  it('has a <slot> for content', () => {
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).toBeDefined()
  })

  it('fires o-click on button click', () => {
    let fired = false
    el.addEventListener('o-click', () => { fired = true })
    el.shadowRoot!.querySelector('button')!.click()
    expect(fired).toBe(true)
  })

  it('o-click event bubbles', () => {
    let fired = false
    document.body.addEventListener('o-click', () => { fired = true })
    el.shadowRoot!.querySelector('button')!.click()
    expect(fired).toBe(true)
  })

  it('o-click event is composed', () => {
    const handler = (e: Event) => {
      expect(e.composed).toBe(true)
    }
    el.addEventListener('o-click', handler)
    el.shadowRoot!.querySelector('button')!.click()
  })
})

describe('OWCPanel', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers as o-panel custom element', () => {
    expect(customElements.get('o-panel')).toBeDefined()
  })

  it('renders .panel div in shadow DOM', () => {
    const panel = el.shadowRoot!.querySelector('.panel')
    expect(panel).toBeDefined()
  })

  it('has a <slot> for content', () => {
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).toBeDefined()
  })

  it('shows .move-handle when move attr set', () => {
    el.setAttribute('move', '')
    const handle = el.shadowRoot!.querySelector('.move-handle')
    expect(handle).toBeDefined()
  })

  it('hides .move-handle when move attr absent', () => {
    const handle = el.shadowRoot!.querySelector('.move-handle')
    expect(handle).toBeNull()
  })

  it('shows resize handles when resize attr set', () => {
    el.setAttribute('resize', '')
    const resizeE = el.shadowRoot!.querySelector('.resize-e')
    const resizeS = el.shadowRoot!.querySelector('.resize-s')
    const resizeSE = el.shadowRoot!.querySelector('.resize-se')
    expect(resizeE).toBeDefined()
    expect(resizeS).toBeDefined()
    expect(resizeSE).toBeDefined()
  })

  it('hides resize handles when resize attr absent', () => {
    const resizeE = el.shadowRoot!.querySelector('.resize-e')
    const resizeS = el.shadowRoot!.querySelector('.resize-s')
    const resizeSE = el.shadowRoot!.querySelector('.resize-se')
    expect(resizeE).toBeNull()
    expect(resizeS).toBeNull()
    expect(resizeSE).toBeNull()
  })
})

describe('OWCPanel drag overlays and events', () => {
  let el: HTMLElement

  // The overlays are appended straight to document.body and tagged with
  // data-owc-overlay, which is also the documented hook for pages to target them.
  const grid = () => document.querySelector<HTMLElement>('[data-owc-overlay="grid"]') ?? undefined
  const zone = () => document.querySelector<HTMLElement>('[data-owc-overlay="dropzone"]') ?? undefined

  const down = (t: Element, x = 100, y = 100) =>
    t.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: x, screenY: y }))
  const move = (x: number, y: number) =>
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, screenX: x, screenY: y }))
  const up = () => document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    el.setAttribute('move', '')
    el.setAttribute('snap', '20')
    el.setAttribute('resize', '')
    document.body.appendChild(el)
  })

  afterEach(() => {
    up()
    document.body.innerHTML = ''
  })

  it('shows the snap grid while dragging', () => {
    expect(grid()).toBeUndefined()
    down(el.shadowRoot!.querySelector('.move-handle')!)
    expect(grid()).toBeDefined()
  })

  it('draws grid lines that contrast with the theme', () => {
    el.setAttribute('theme', 'light')
    down(el.shadowRoot!.querySelector('.move-handle')!)
    // light theme must use dark lines, never white-on-white
    const img = grid()!.style.backgroundImage.replace(/\s+/g, '')
    expect(img).toContain('rgba(0,0,0')
    expect(img).not.toContain('rgba(255,255,255')
  })

  it('shows a drop zone while dragging', () => {
    down(el.shadowRoot!.querySelector('.move-handle')!)
    move(300, 200)
    expect(zone()).toBeDefined()
    expect(zone()!.style.borderStyle).toBe('dashed')
  })

  it('raises the dragged panel above the overlays, and restores after', () => {
    down(el.shadowRoot!.querySelector('.move-handle')!)
    expect(Number(el.style.zIndex)).toBeGreaterThan(9998)
    up()
    expect(el.style.zIndex).toBe('')
  })

  it('fires o-drag-start, o-drag-move and o-drag-end', () => {
    const seen: string[] = []
    ;['o-drag-start', 'o-drag-move', 'o-drag-end']
      .forEach(n => el.addEventListener(n, () => seen.push(n)))
    down(el.shadowRoot!.querySelector('.move-handle')!)
    move(300, 200)
    up()
    expect(seen).toContain('o-drag-start')
    expect(seen).toContain('o-drag-move')
    expect(seen).toContain('o-drag-end')
  })

  it('o-drag-move lets a listener redirect the drop zone', () => {
    el.addEventListener('o-drag-move', (e) => {
      (e as CustomEvent).detail.setDropZone({ x: 11, y: 22, width: 333, height: 44 })
    })
    down(el.shadowRoot!.querySelector('.move-handle')!)
    move(300, 200)
    expect(zone()!.style.left).toBe('11px')
    expect(zone()!.style.top).toBe('22px')
    expect(zone()!.style.width).toBe('333px')
  })

  it('o-drag-move can suppress the drop zone with null', () => {
    el.addEventListener('o-drag-move', (e) => {
      (e as CustomEvent).detail.setDropZone(null)
    })
    down(el.shadowRoot!.querySelector('.move-handle')!)
    move(300, 200)
    expect(zone()?.style.opacity).not.toBe('1')
  })

  it('hides both overlays after the drag ends', () => {
    down(el.shadowRoot!.querySelector('.move-handle')!)
    move(300, 200)
    up()
    expect(grid()?.style.opacity).not.toBe('1')
    expect(zone()?.style.opacity).not.toBe('1')
  })

  it('fires o-resize-start / o-resize-end and outlines the new size', () => {
    const seen: string[] = []
    ;['o-resize-start', 'o-resize-end'].forEach(n => el.addEventListener(n, () => seen.push(n)))
    down(el.shadowRoot!.querySelector('.resize-se')!, 0, 0)
    expect(zone()).toBeDefined()
    move(200, 120)
    up()
    expect(seen).toEqual(['o-resize-start', 'o-resize-end'])
  })

  it('ignores a stray mouseup with no drag in progress', () => {
    let fired = 0
    el.addEventListener('o-drag-end', () => { fired++ })
    up()
    expect(fired).toBe(0)
  })
})

describe('OWCPanel scrolling vs handles', () => {
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    el.setAttribute('move', '')
    el.setAttribute('resize', '')
    el.innerHTML = '<p>content</p>'
    document.body.appendChild(el)
  })

  afterEach(() => { document.body.innerHTML = '' })

  it('slots content into a .content scroller', () => {
    const content = el.shadowRoot!.querySelector('.content')
    expect(content).not.toBeNull()
    expect(content!.querySelector('slot')).not.toBeNull()
  })

  it('keeps the resize handles OUT of the scroller so they do not scroll away', () => {
    const content = el.shadowRoot!.querySelector('.content')!
    for (const sel of ['.resize-e', '.resize-s', '.resize-se']) {
      const handle = el.shadowRoot!.querySelector(sel)!
      expect(handle).not.toBeNull()
      expect(content.contains(handle)).toBe(false)          // not inside the scroller
      expect(handle.parentElement!.classList.contains('panel')).toBe(true)
    }
  })

  it('keeps the ⠿ handle out of the scroller too', () => {
    const content = el.shadowRoot!.querySelector('.content')!
    const grip = el.shadowRoot!.querySelector('.move-handle')!
    expect(content.contains(grip)).toBe(false)
  })

  it('.panel itself does not scroll', () => {
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    const panelBlock = css.slice(css.indexOf('.panel {'), css.indexOf('.content {'))
    expect(panelBlock).toContain('overflow: hidden')
  })

  it('insets the scroller from the resize strips when resizable', () => {
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    expect(css).toContain('.panel.has-resize > .content')
    expect(el.shadowRoot!.querySelector('.panel')!.classList.contains('has-resize')).toBe(true)
  })

  it('scrollbars are themed via tokens, not hard-coded white', () => {
    const css = el.shadowRoot!.querySelector('style')!.textContent!
    expect(css).toContain('var(--glass-scroll-thumb)')
    // both axes sized, so horizontal overflow gets a visible bar
    expect(css).toMatch(/::-webkit-scrollbar \{[^}]*height:/)
    // the thumb itself must not hard-code a colour (rgba elsewhere is fine — the
    // glass tokens are literals by definition)
    const thumb = css.slice(css.indexOf('::-webkit-scrollbar-thumb {'))
      .slice(0, css.slice(css.indexOf('::-webkit-scrollbar-thumb {')).indexOf('}'))
    expect(thumb).toContain('var(--glass-scroll-thumb)')
    expect(thumb).not.toMatch(/rgba\(/)
  })
})

describe('OWCPanel handle attribute', () => {
  let el: HTMLElement

  const down = (t: Element) =>
    t.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 10, screenY: 10 }))
  const up = () => document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

  // children first, then move/handle: mirrors how the parser builds these panels
  const build = (inner: string, handle = 'header') => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    el.innerHTML = inner
    el.setAttribute('move', '')
    el.setAttribute('snap', '20')
    if (handle) el.setAttribute('handle', handle)
    document.body.appendChild(el)
    return el
  }

  afterEach(() => { up(); document.body.innerHTML = '' })

  it('drops the built-in ⠿ when the handle matches', () => {
    build('<header>Title</header>')
    expect(el.shadowRoot!.querySelector('.move-handle')).toBeNull()
  })

  it('keeps the ⠿ when the handle selector matches nothing', () => {
    build('<div>no header here</div>', '.nope')
    expect(el.shadowRoot!.querySelector('.move-handle')).not.toBeNull()
  })

  it('starts a drag from the light-DOM handle', () => {
    build('<header>Title</header>')
    let started = false
    el.addEventListener('o-drag-start', () => { started = true })
    down(el.querySelector('header')!)
    expect(started).toBe(true)
  })

  it('marks the handle grabbable and unselectable', () => {
    build('<header>Title</header>')
    const h = el.querySelector('header') as HTMLElement
    expect(h.style.cursor).toBe('grab')
    expect(h.style.userSelect).toBe('none')
  })

  it('does NOT drag when a control inside the handle is used', () => {
    build('<header>Title <select><option>a</option></select> <button>x</button></header>')
    let started = false
    el.addEventListener('o-drag-start', () => { started = true })
    down(el.querySelector('select')!)
    down(el.querySelector('button')!)
    expect(started).toBe(false)
  })

  it('does NOT drag from panel content outside the handle', () => {
    build('<header>Title</header><p class="body">content</p>')
    let started = false
    el.addEventListener('o-drag-start', () => { started = true })
    down(el.querySelector('.body')!)
    expect(started).toBe(false)
  })

  it('picks up a handle added after connect (deferred child parsing)', async () => {
    document.body.innerHTML = ''
    el = document.createElement('o-panel')
    el.setAttribute('move', '')
    el.setAttribute('handle', 'header')
    document.body.appendChild(el)            // connects with no children yet
    expect(el.shadowRoot!.querySelector('.move-handle')).not.toBeNull()   // fallback

    el.innerHTML = '<header>Late</header>'
    await new Promise(r => setTimeout(r, 0)) // let the MutationObserver run
    expect(el.shadowRoot!.querySelector('.move-handle')).toBeNull()
    let started = false
    el.addEventListener('o-drag-start', () => { started = true })
    down(el.querySelector('header')!)
    expect(started).toBe(true)
  })
})

describe('OWCButton part exposure', () => {
  it('exposes the inner button as part="button" for external sizing', () => {
    document.body.innerHTML = ''
    const btn = document.createElement('o-button')
    document.body.appendChild(btn)
    const inner = btn.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('part')).toBe('button')
  })
})

describe('OWCButton confirm mode', () => {
  let el: any
  const clickBtn = (host: HTMLElement) =>
    (host.shadowRoot!.querySelector('button') as HTMLButtonElement).click()

  beforeEach(() => { document.body.innerHTML = '' })
  afterEach(() => { document.body.innerHTML = '' })

  const make = (attrs: Record<string, string> = {}) => {
    const b = document.createElement('o-button') as any
    for (const [k, v] of Object.entries(attrs)) b.setAttribute(k, v)
    b.textContent = 'Delete'
    document.body.appendChild(b)
    return b
  }

  // The regression that matters most: confirm is additive, so a button without
  // the attribute must behave exactly as it always has.
  it('a button without confirm fires o-click on the first click', () => {
    el = make()
    let fired = 0
    el.addEventListener('o-click', () => fired++)
    clickBtn(el)
    expect(fired).toBe(1)
  })

  it('does NOT fire o-click on the first click when confirm is set', () => {
    el = make({ confirm: '' })
    let fired = 0
    el.addEventListener('o-click', () => fired++)
    clickBtn(el)
    expect(fired).toBe(0)
    expect(el.isPending).toBe(true)
  })

  it('fires o-click on the second click, marked confirmed', () => {
    el = make({ confirm: '' })
    const seen: any[] = []
    el.addEventListener('o-click', (e: any) => seen.push(e.detail))
    clickBtn(el)
    clickBtn(el)
    expect(seen.length).toBe(1)
    expect(seen[0].confirmed).toBe(true)
    expect(el.isPending).toBe(false)
  })

  it('emits o-confirm-pending when it arms', () => {
    el = make({ confirm: 'Really?', 'confirm-timeout': '1200' })
    const seen: any[] = []
    el.addEventListener('o-confirm-pending', (e: any) => seen.push(e.detail))
    clickBtn(el)
    expect(seen.length).toBe(1)
    expect(seen[0].text).toBe('Really?')
    expect(seen[0].timeout).toBe(1200)
  })

  it('shows the prompt text and hides the label while pending', () => {
    el = make({ confirm: 'Really delete?' })
    clickBtn(el)
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.hasAttribute('data-pending')).toBe(true)
    expect(btn.querySelector('.prompt').textContent).toBe('Really delete?')
  })

  it('falls back to a default prompt when confirm has no value', () => {
    el = make({ confirm: '' })
    clickBtn(el)
    expect(el.shadowRoot.querySelector('.prompt').textContent).toBe('Are you sure?')
  })

  it('reflects the pending state in the accessible name and announces it', () => {
    el = make({ confirm: 'Really delete?' })
    clickBtn(el)
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-label')).toBe('Really delete?')
    expect(btn.getAttribute('aria-live')).toBe('assertive')
  })

  it('reverts and emits o-confirm-cancel when the window lapses', async () => {
    el = make({ confirm: '', 'confirm-timeout': '40' })
    const cancels: any[] = []
    let fired = 0
    el.addEventListener('o-confirm-cancel', (e: any) => cancels.push(e.detail))
    el.addEventListener('o-click', () => fired++)
    clickBtn(el)
    await new Promise(r => setTimeout(r, 80))
    expect(el.isPending).toBe(false)
    expect(cancels[0].reason).toBe('timeout')
    expect(fired).toBe(0)
    expect(el.shadowRoot.querySelector('button').hasAttribute('data-pending')).toBe(false)
  })

  it('arming a second confirm button cancels the first', () => {
    const a = make({ confirm: '' })
    const b = make({ confirm: '' })
    const cancels: any[] = []
    a.addEventListener('o-confirm-cancel', (e: any) => cancels.push(e.detail))
    clickBtn(a)
    expect(a.isPending).toBe(true)
    clickBtn(b)
    expect(a.isPending).toBe(false)
    expect(b.isPending).toBe(true)
    expect(cancels[0].reason).toBe('superseded')
  })

  it('cancelConfirm() abandons without firing o-click', () => {
    el = make({ confirm: '' })
    let fired = 0
    el.addEventListener('o-click', () => fired++)
    clickBtn(el)
    el.cancelConfirm()
    expect(el.isPending).toBe(false)
    expect(fired).toBe(0)
  })

  it('ties the sweep duration to the real timeout', () => {
    el = make({ confirm: '', 'confirm-timeout': '5000' })
    clickBtn(el)
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.style.getPropertyValue('--owc-confirm-duration')).toBe('5000ms')
  })

  it('rejects a non-positive confirm-timeout and uses the default', () => {
    el = make({ confirm: '', 'confirm-timeout': '-1' })
    expect(el.confirmTimeout).toBe(3000)
  })
})
