// o-dropzone — a grid landing area for movable o-panels.
//
// The zone stays invisible until a panel starts dragging. While a drag is in
// flight it shows its grid, highlights the cell under the panel, and on release
// snaps the panel to fill that cell.
//
// It deliberately does NOT own layout: panels keep their free-drag behaviour and
// nothing reflows. Dropping onto an occupied cell simply overlaps — see `o-drop`.
//
// It hooks the drag through o-panel's existing public contract rather than
// reimplementing dragging: `o-drag-move` exposes detail.setDropZone(rect), which
// redirects the shared landing preview, and `o-drag-end` fires after the overlays
// are torn down so a listener can reposition the panel.

import { GlassElement, glassBaseStyles } from './glass';

export interface DropZoneCell {
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragDetail {
  x: number;
  y: number;
  rect: { x: number; y: number; width: number; height: number };
  setDropZone?: (r: { x: number; y: number; width: number; height: number } | null) => void;
}

export class ODropZone extends GlassElement {
  static get observedAttributes() { return ['cols', 'rows', 'gap', 'disabled'] }

  /** The cell the in-flight panel is currently over, or null when outside. */
  private _hovered: DropZoneCell | null = null;
  private _dragging = false;

  get cols() { return Math.max(1, parseInt(this.getAttribute('cols') ?? '3') || 3) }
  set cols(v: number) { this.setAttribute('cols', String(v)) }

  get rows() { return Math.max(1, parseInt(this.getAttribute('rows') ?? '2') || 2) }
  set rows(v: number) { this.setAttribute('rows', String(v)) }

  get gap() { return Math.max(0, parseInt(this.getAttribute('gap') ?? '8') || 0) }
  set gap(v: number) { this.setAttribute('gap', String(v)) }

  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v: boolean) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled') }

  connectedCallback() {
    this.render();
    // Document-level so a panel can be dragged IN from outside the zone, not just
    // rearranged within it. Each zone independently tests its own bounds.
    document.addEventListener('o-drag-start', this.onDragStart as EventListener);
    document.addEventListener('o-drag-move', this.onDragMove as EventListener);
    document.addEventListener('o-drag-end', this.onDragEnd as EventListener);
  }

  disconnectedCallback() {
    document.removeEventListener('o-drag-start', this.onDragStart as EventListener);
    document.removeEventListener('o-drag-move', this.onDragMove as EventListener);
    document.removeEventListener('o-drag-end', this.onDragEnd as EventListener);
  }

  attributeChangedCallback() { if (this.shadowRoot) this.render() }

  /** Geometry of one cell, in viewport coordinates. */
  cellRect(col: number, row: number): DropZoneCell {
    const r = this.getBoundingClientRect();
    const g = this.gap;
    const cw = (r.width - g * (this.cols + 1)) / this.cols;
    const ch = (r.height - g * (this.rows + 1)) / this.rows;
    return {
      col, row,
      x: r.left + g + col * (cw + g),
      y: r.top + g + row * (ch + g),
      width: cw,
      height: ch,
    };
  }

  /**
   * The cell containing a point. Returns null outside the zone — which is what
   * makes dragging back out release the panel to free positioning.
   */
  cellAt(px: number, py: number): DropZoneCell | null {
    const r = this.getBoundingClientRect();
    if (px < r.left || px > r.right || py < r.top || py > r.bottom) return null;
    const g = this.gap;
    const cw = (r.width - g * (this.cols + 1)) / this.cols;
    const ch = (r.height - g * (this.rows + 1)) / this.rows;
    const col = Math.min(this.cols - 1, Math.max(0, Math.floor((px - r.left - g) / (cw + g))));
    const row = Math.min(this.rows - 1, Math.max(0, Math.floor((py - r.top - g) / (ch + g))));
    return this.cellRect(col, row);
  }

  private onDragStart = () => {
    if (this.disabled) return;
    this._dragging = true;
    this._hovered = null;
    this.shadowRoot?.querySelector('.zone')?.classList.add('active');
  }

  private onDragMove = (e: CustomEvent<DragDetail>) => {
    if (this.disabled || !this._dragging) return;
    const d = e.detail;
    if (!d?.rect) return;
    // Track by the panel's centre: matching on the top-left corner makes a large
    // panel claim the cell above-left of where it visually sits.
    const cx = d.rect.x + d.rect.width / 2;
    const cy = d.rect.y + d.rect.height / 2;
    const cell = this.cellAt(cx, cy);
    this._hovered = cell;
    this.highlight(cell);
    // Redirect the shared landing preview onto the cell, so the dashed rect the
    // user sees is the cell they'll actually land in.
    if (cell) d.setDropZone?.({ x: cell.x, y: cell.y, width: cell.width, height: cell.height });
  }

  private onDragEnd = (e: CustomEvent<DragDetail>) => {
    const wasDragging = this._dragging;
    this._dragging = false;
    this.shadowRoot?.querySelector('.zone')?.classList.remove('active');
    this.highlight(null);
    const cell = this._hovered;
    this._hovered = null;
    if (this.disabled || !wasDragging || !cell) return;

    const panel = e.target as HTMLElement;
    const d = e.detail;
    if (!d?.rect) return;

    // The panel is positioned by a translate() offset from its natural flow spot,
    // so translate by the delta between where it is and where the cell is rather
    // than assigning an absolute position.
    const nx = d.x + (cell.x - d.rect.x);
    const ny = d.y + (cell.y - d.rect.y);
    panel.style.transform = `translate(${Math.round(nx)}px, ${Math.round(ny)}px)`;

    // Size the panel to fill the cell. These size the inner .panel box, which is
    // also what the translate above aligned to the cell origin — so the visible
    // panel fills the cell exactly. The host ends up marginally larger (the
    // panel carries a margin); that is invisible and keeps the two in step.
    panel.style.setProperty('--o-panel-width', `${Math.round(cell.width)}px`);
    panel.style.setProperty('--o-panel-height', `${Math.round(cell.height)}px`);

    this.dispatchEvent(new CustomEvent('o-drop', {
      bubbles: true, composed: true,
      detail: { panel, col: cell.col, row: cell.row, cell },
    }));
  }

  private highlight(cell: DropZoneCell | null) {
    const cells = this.shadowRoot?.querySelectorAll<HTMLElement>('.cell');
    if (!cells) return;
    const idx = cell ? cell.row * this.cols + cell.col : -1;
    cells.forEach((el, i) => el.classList.toggle('hot', i === idx));
  }

  private render() {
    const total = this.cols * this.rows;
    const cells = Array.from({ length: total }, () => '<div class="cell"></div>').join('');
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; position: relative; }
        .zone {
          display: grid;
          grid-template-columns: repeat(${this.cols}, 1fr);
          grid-template-rows: repeat(${this.rows}, 1fr);
          gap: ${this.gap}px;
          padding: ${this.gap}px;
          position: absolute; inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
          box-sizing: border-box;
        }
        /* Only visible mid-drag — a permanently drawn grid is visual noise. */
        .zone.active { opacity: 1; }
        .cell {
          border: var(--glass-border-width) dashed var(--glass-border);
          border-radius: var(--glass-radius);
          background: transparent;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .cell.hot {
          border-color: var(--accent-warm);
          border-style: solid;
          background: var(--glass-hover);
        }
        .slotted { position: relative; min-height: 100%; }
      </style>
      <div class="zone">${cells}</div>
      <div class="slotted"><slot></slot></div>
    `;
  }
}

if (!customElements.get('o-dropzone')) customElements.define('o-dropzone', ODropZone);
