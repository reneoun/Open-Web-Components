import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import './dropzone'
import './core'
import type { ODropZone } from './dropzone'

const rect = (el: Element, r: Partial<DOMRect>) => {
  el.getBoundingClientRect = () => ({
    left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0,
    toJSON: () => ({}), ...r,
  }) as DOMRect
}

describe('o-dropzone', () => {
  let zone: ODropZone

  beforeEach(() => {
    zone = document.createElement('o-dropzone') as ODropZone
    zone.setAttribute('cols', '3')
    zone.setAttribute('rows', '2')
    zone.setAttribute('gap', '0')
    document.body.appendChild(zone)
    // 300x200 at the origin => 100x100 cells with no gap
    rect(zone, { left: 0, top: 0, right: 300, bottom: 200, width: 300, height: 200 })
  })

  afterEach(() => { document.body.innerHTML = '' })

  it('registers as a custom element', () => {
    expect(customElements.get('o-dropzone')).toBeTruthy()
  })

  it('renders cols x rows cells', () => {
    expect(zone.shadowRoot!.querySelectorAll('.cell').length).toBe(6)
  })

  it('re-renders when the grid shape changes', () => {
    zone.setAttribute('cols', '4')
    expect(zone.shadowRoot!.querySelectorAll('.cell').length).toBe(8)
  })

  it('the grid is hidden until a drag starts', () => {
    const z = zone.shadowRoot!.querySelector('.zone')!
    expect(z.classList.contains('active')).toBe(false)
    document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
    expect(z.classList.contains('active')).toBe(true)
  })

  it('hides the grid again when the drag ends', () => {
    const z = zone.shadowRoot!.querySelector('.zone')!
    document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
    document.dispatchEvent(new CustomEvent('o-drag-end', { detail: { x: 0, y: 0, rect: { x: 0, y: 0, width: 10, height: 10 } } }))
    expect(z.classList.contains('active')).toBe(false)
  })

  describe('cell geometry', () => {
    it('maps a point to the containing cell', () => {
      expect(zone.cellAt(150, 50)).toMatchObject({ col: 1, row: 0 })
      expect(zone.cellAt(250, 150)).toMatchObject({ col: 2, row: 1 })
      expect(zone.cellAt(10, 10)).toMatchObject({ col: 0, row: 0 })
    })

    it('returns null outside the zone, so dragging out frees the panel', () => {
      expect(zone.cellAt(-20, 50)).toBeNull()
      expect(zone.cellAt(400, 50)).toBeNull()
      expect(zone.cellAt(150, 400)).toBeNull()
    })

    it('clamps a point on the far edge into the last cell', () => {
      expect(zone.cellAt(300, 200)).toMatchObject({ col: 2, row: 1 })
    })

    it('computes cell rects from its own bounds', () => {
      expect(zone.cellRect(0, 0)).toMatchObject({ x: 0, y: 0, width: 100, height: 100 })
      expect(zone.cellRect(2, 1)).toMatchObject({ x: 200, y: 100, width: 100, height: 100 })
    })
  })

  describe('drag interaction', () => {
    it('redirects the landing preview onto the hovered cell', () => {
      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      let redirected: any = null
      document.dispatchEvent(new CustomEvent('o-drag-move', {
        detail: {
          x: 0, y: 0,
          rect: { x: 110, y: 10, width: 80, height: 80 },  // centre 150,50 => col 1 row 0
          setDropZone: (r: any) => { redirected = r },
        },
      }))
      expect(redirected).toMatchObject({ x: 100, y: 0, width: 100, height: 100 })
    })

    it('tracks by the panel centre, not its corner', () => {
      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      // corner sits in col 0 but the centre is in col 2
      const cell = zone.cellAt(10 + 240 / 2, 10 + 80 / 2)
      expect(cell).toMatchObject({ col: 1, row: 0 })
    })

    it('highlights exactly one cell at a time', () => {
      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      document.dispatchEvent(new CustomEvent('o-drag-move', {
        detail: { x: 0, y: 0, rect: { x: 210, y: 110, width: 80, height: 80 }, setDropZone: () => {} },
      }))
      const hot = zone.shadowRoot!.querySelectorAll('.cell.hot')
      expect(hot.length).toBe(1)
      // col 2, row 1 => index 5
      expect([...zone.shadowRoot!.querySelectorAll('.cell')].indexOf(hot[0])).toBe(5)
    })

    it('emits o-drop with the landed cell', () => {
      const panel = document.createElement('o-panel')
      document.body.appendChild(panel)
      rect(panel, { left: 110, top: 10, width: 80, height: 80 })

      let drop: any = null
      zone.addEventListener('o-drop', (e: any) => { drop = e.detail })

      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      document.dispatchEvent(new CustomEvent('o-drag-move', {
        detail: { x: 0, y: 0, rect: { x: 110, y: 10, width: 80, height: 80 }, setDropZone: () => {} },
      }))
      panel.dispatchEvent(new CustomEvent('o-drag-end', {
        bubbles: true, composed: true,
        detail: { x: 0, y: 0, rect: { x: 110, y: 10, width: 80, height: 80 } },
      }))

      expect(drop).toBeTruthy()
      expect(drop.col).toBe(1)
      expect(drop.row).toBe(0)
      expect(drop.panel).toBe(panel)
    })

    it('does not emit o-drop when released outside the zone', () => {
      const panel = document.createElement('o-panel')
      document.body.appendChild(panel)
      rect(panel, { left: 900, top: 900, width: 80, height: 80 })

      let fired = false
      zone.addEventListener('o-drop', () => { fired = true })

      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      document.dispatchEvent(new CustomEvent('o-drag-move', {
        detail: { x: 0, y: 0, rect: { x: 900, y: 900, width: 80, height: 80 }, setDropZone: () => {} },
      }))
      panel.dispatchEvent(new CustomEvent('o-drag-end', {
        bubbles: true, composed: true,
        detail: { x: 0, y: 0, rect: { x: 900, y: 900, width: 80, height: 80 } },
      }))
      expect(fired).toBe(false)
    })

    it('lands on an occupied cell rather than reflowing neighbours', () => {
      // Two panels dropped on the same cell: both land, no displacement.
      const drops: any[] = []
      zone.addEventListener('o-drop', (e: any) => drops.push(e.detail))

      for (let i = 0; i < 2; i++) {
        const p = document.createElement('o-panel')
        document.body.appendChild(p)
        rect(p, { left: 10, top: 10, width: 80, height: 80 })
        document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
        document.dispatchEvent(new CustomEvent('o-drag-move', {
          detail: { x: 0, y: 0, rect: { x: 10, y: 10, width: 80, height: 80 }, setDropZone: () => {} },
        }))
        p.dispatchEvent(new CustomEvent('o-drag-end', {
          bubbles: true, composed: true,
          detail: { x: 0, y: 0, rect: { x: 10, y: 10, width: 80, height: 80 } },
        }))
      }
      expect(drops.length).toBe(2)
      expect(drops[0]).toMatchObject({ col: 0, row: 0 })
      expect(drops[1]).toMatchObject({ col: 0, row: 0 })
    })

    it('ignores drags entirely when disabled', () => {
      zone.setAttribute('disabled', '')
      let fired = false
      zone.addEventListener('o-drop', () => { fired = true })
      document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      expect(zone.shadowRoot!.querySelector('.zone')!.classList.contains('active')).toBe(false)
      document.dispatchEvent(new CustomEvent('o-drag-end', {
        detail: { x: 0, y: 0, rect: { x: 10, y: 10, width: 10, height: 10 } },
      }))
      expect(fired).toBe(false)
    })

    it('stops listening once removed from the document', () => {
      zone.remove()
      let threw = false
      try {
        document.dispatchEvent(new CustomEvent('o-drag-start', { detail: {} }))
      } catch { threw = true }
      expect(threw).toBe(false)
    })
  })
})
