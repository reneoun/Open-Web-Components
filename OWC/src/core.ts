import { GlassElement, glassBaseStyles, glassScrollbarStyles } from './glass'

console.log('Open Web Components (OWC) Core Module Loaded - René Oun');

export type Coordinates = { x: number, y: number };
export type Rect = { x: number, y: number, width: number, height: number };

// Overlays live in document.body, outside any shadow root, so they cannot read the
// glass custom properties. These mirror the two token sets from glass.ts.
const OVERLAY_COLORS = {
    dark: {
        gridMinor: 'rgba(255,255,255,0.22)',
        gridMajor: 'rgba(255,255,255,0.40)',
        zoneLine: 'rgba(251,191,36,0.85)',
        zoneFill: 'rgba(251,191,36,0.12)',
    },
    light: {
        gridMinor: 'rgba(0,0,0,0.16)',
        gridMajor: 'rgba(0,0,0,0.30)',
        zoneLine: 'rgba(22,163,74,0.85)',
        zoneFill: 'rgba(22,163,74,0.14)',
    },
} as const;

export type OverlayTheme = keyof typeof OVERLAY_COLORS;

/** Overlays sit above page content; the panel being dragged is raised above them. */
const Z_GRID = 9997;
const Z_ZONE = 9998;
const Z_DRAGGED = 9999;

/** `kind` is exposed as data-owc-overlay so pages can restyle or target the overlays. */
function makeOverlay(z: number, kind: 'grid' | 'dropzone'): HTMLDivElement {
    const el = document.createElement('div');
    el.setAttribute('data-owc-overlay', kind);
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, {
        position: 'fixed', pointerEvents: 'none', zIndex: String(z),
        transition: 'opacity 160ms ease', opacity: '0',
    });
    document.body.appendChild(el);
    return el;
}

// --- Snap grid overlay (shared singleton) ---
let _gridEl: HTMLDivElement | null = null;
let _gridFadeOut: ReturnType<typeof setTimeout> | null = null;

function showSnapGrid(snap: number, offsetX = 0, offsetY = 0, theme: OverlayTheme = 'dark') {
    if (snap < 8) return;
    if (_gridFadeOut) { clearTimeout(_gridFadeOut); _gridFadeOut = null; }
    // isConnected guard: if the page replaced its body, the cached node is orphaned
    // and styling it would draw nothing.
    if (!_gridEl || !_gridEl.isConnected) {
        _gridEl = makeOverlay(Z_GRID, 'grid');
        _gridEl.style.inset = '0';
    }
    const c = OVERLAY_COLORS[theme];
    // Every 5th line is drawn stronger, so the grid reads as a grid rather than as
    // a flat wash — and both sets are dark-on-light or light-on-dark, never white
    // on white (which is why the grid used to be invisible in light themes).
    _gridEl.style.backgroundImage = [
        `linear-gradient(${c.gridMajor} 1px, transparent 1px)`,
        `linear-gradient(90deg, ${c.gridMajor} 1px, transparent 1px)`,
        `linear-gradient(${c.gridMinor} 1px, transparent 1px)`,
        `linear-gradient(90deg, ${c.gridMinor} 1px, transparent 1px)`,
    ].join(',');
    _gridEl.style.backgroundSize =
        `${snap * 5}px ${snap * 5}px, ${snap * 5}px ${snap * 5}px, ${snap}px ${snap}px, ${snap}px ${snap}px`;
    const ox = ((offsetX % snap) + snap) % snap;
    const oy = ((offsetY % snap) + snap) % snap;
    _gridEl.style.backgroundPosition = `${ox}px ${oy}px, ${ox}px ${oy}px, ${ox}px ${oy}px, ${ox}px ${oy}px`;
    // force reflow so the transition fires
    void _gridEl.offsetHeight;
    _gridEl.style.opacity = '1';
}

function hideSnapGrid() {
    if (!_gridEl) return;
    _gridEl.style.opacity = '0';
    const el = _gridEl;
    _gridFadeOut = setTimeout(() => {
        el.remove();
        if (_gridEl === el) _gridEl = null;
        _gridFadeOut = null;
    }, 220);
}

// --- Drop zone overlay (shared singleton) ---
// Shows where the panel will land. Defaults to the panel's own snapped rect; a
// consumer can redirect it from `o-drag-move` via detail.setDropZone(rect).
let _zoneEl: HTMLDivElement | null = null;
let _zoneFadeOut: ReturnType<typeof setTimeout> | null = null;

function showDropZone(rect: Rect, theme: OverlayTheme = 'dark') {
    if (_zoneFadeOut) { clearTimeout(_zoneFadeOut); _zoneFadeOut = null; }
    if (!_zoneEl || !_zoneEl.isConnected) _zoneEl = makeOverlay(Z_ZONE, 'dropzone');
    const c = OVERLAY_COLORS[theme];
    Object.assign(_zoneEl.style, {
        left: `${Math.round(rect.x)}px`,
        top: `${Math.round(rect.y)}px`,
        width: `${Math.round(rect.width)}px`,
        height: `${Math.round(rect.height)}px`,
        borderStyle: 'dashed',
        borderWidth: '2px',
        borderColor: c.zoneLine,
        borderRadius: '10px',
        background: c.zoneFill,
        boxSizing: 'border-box',
    });
    void _zoneEl.offsetHeight;
    _zoneEl.style.opacity = '1';
}

function hideDropZone() {
    if (!_zoneEl) return;
    _zoneEl.style.opacity = '0';
    const el = _zoneEl;
    _zoneFadeOut = setTimeout(() => {
        el.remove();
        if (_zoneEl === el) _zoneEl = null;
        _zoneFadeOut = null;
    }, 220);
}

class OWCButton extends GlassElement {
    constructor() {
        super();
        this.shadowRoot!.innerHTML = `
            <style>
                ${glassBaseStyles()}
                :host { display: inline-block; }
                button {
                    cursor: pointer;
                    padding: 8px 20px;
                    border-radius: var(--glass-radius);
                    border: var(--glass-border-width) solid var(--glass-border);
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-backdrop);
                    -webkit-backdrop-filter: var(--glass-backdrop);
                    color: var(--o-button-color, var(--glass-text));
                    font-size: 14px;
                    font-family: var(--glass-font);
                    box-shadow: var(--glass-elevation);
                    transition: background 0.2s, transform 0.1s;
                }
                button:hover { background: var(--glass-hover); }
                button:active { transform: var(--glass-press); }
            </style>
            <button><slot>Button</slot></button>
        `;
        this.shadowRoot!.querySelector('button')!.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('o-click', { bubbles: true, composed: true }));
        });
    }
}

/** Controls inside a drag handle must stay clickable rather than starting a drag. */
const INTERACTIVE = 'select,button,input,textarea,a,label,summary,[contenteditable]';

class OWCPanel extends GlassElement {
    static get observedAttributes() { return ['move', 'snap', 'resize', 'handle'] }

    private dragStart: Coordinates | null = null;
    private dragOffset: Coordinates = { x: 0, y: 0 };
    private resizeStart: { x: number; y: number; w: number; h: number; edge: string } | null = null;
    private prevZIndex = '';
    private activeHandle: HTMLElement | null = null;
    private handleWatcher: MutationObserver | null = null;

    constructor() {
        super();
        // Do NOT render here — attributes are not yet set for parser-created elements
    }

    connectedCallback() {
        this.render();
        // Delegated, so it keeps working when the light DOM is re-rendered
        this.addEventListener('mousedown', this.onHostMouseDown);
        this.watchForHandle();
    }

    disconnectedCallback() {
        this.removeEventListener('mousedown', this.onHostMouseDown);
        this.handleWatcher?.disconnect();
        this.handleWatcher = null;
    }

    attributeChangedCallback() {
        if (this.isConnected) { this.render(); this.watchForHandle(); }
    }

    /** The light-DOM element named by `handle`, if it exists yet. */
    private get lightHandle(): HTMLElement | null {
        const sel = this.getAttribute('handle');
        return sel ? this.querySelector<HTMLElement>(sel) : null;
    }

    // Bundled as an IIFE in <head>, so a parser-created panel connects before its
    // children exist (same problem o-tabs has). Watch until the handle shows up,
    // then re-render to drop the built-in ⠿ and mark the handle grabbable.
    private watchForHandle() {
        this.handleWatcher?.disconnect();
        this.handleWatcher = null;
        if (!this.getAttribute('handle') || this.lightHandle) return;
        this.handleWatcher = new MutationObserver(() => {
            if (this.lightHandle) {
                this.handleWatcher?.disconnect();
                this.handleWatcher = null;
                this.render();
            }
        });
        this.handleWatcher.observe(this, { childList: true, subtree: true });
    }

    private onHostMouseDown = (e: MouseEvent) => {
        if (!this.hasAttribute('move') || !this.getAttribute('handle')) return;
        if (this.dragStart) return;
        const target = e.target as Element | null;
        const handle = this.lightHandle;
        if (!target || !handle) return;
        if (!handle.contains(target)) return;         // outside the handle
        if (target.closest(INTERACTIVE)) return;      // let the control have the click
        this.activeHandle = handle;
        this.onDragStart(e);
    }

    private get snapSize() {
        const v = parseInt(this.getAttribute('snap') ?? '1');
        return isNaN(v) || v < 1 ? 1 : v;
    }

    private snapTo(v: number) {
        const s = this.snapSize;
        return Math.round(v / s) * s;
    }

    private render() {
        const hasDrag   = this.hasAttribute('move');
        const hasResize = this.hasAttribute('resize');
        // A `handle` selector replaces the ⠿ button — but only once it actually
        // matches something, so a bad selector can't leave the panel undraggable.
        const light     = hasDrag ? this.lightHandle : null;
        const showGrip  = hasDrag && !light;
        if (light) {
            light.style.cursor = 'grab';
            light.style.userSelect = 'none';
            (light.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'none';
        }

        // Preserve panel dimensions across re-renders
        const prev = this.shadowRoot!.querySelector<HTMLElement>('.panel');
        const savedW = prev?.style.width ?? '';
        const savedH = prev?.style.height ?? '';

        this.shadowRoot!.innerHTML = `
            <style>
                ${glassBaseStyles()}
                :host { display: inline-block; }
                .panel {
                    background: var(--glass-bg);
                    border: var(--glass-border-width) solid var(--glass-border);
                    backdrop-filter: var(--glass-backdrop);
                    -webkit-backdrop-filter: var(--glass-backdrop);
                    margin: 8px;
                    border-radius: var(--glass-radius);
                    min-width: 120px;
                    min-height: 40px;
                    position: relative;
                    color: var(--glass-text);
                    font-family: var(--glass-font);
                    font-size: 14px;
                    box-shadow: var(--glass-elevation);
                    box-sizing: border-box;
                    /* NOT the scroller: the drag/resize handles are absolutely
                       positioned in here, and children of a scrolling box scroll
                       with its content. .content scrolls instead. */
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .content {
                    padding: 16px;
                    flex: 1 1 auto;
                    min-height: 0;      /* let it shrink inside the flex column */
                    overflow: auto;
                }
                /* Keep the scrollbars clear of the resize strips, which sit on the
                   panel's right/bottom edges. */
                .panel.has-resize > .content { margin-right: 6px; margin-bottom: 6px; }
                .move-handle {
                    position: absolute; top: 6px; right: 8px;
                    background: var(--glass-hover); border: var(--glass-border-width) solid var(--glass-border);
                    color: var(--glass-text); border-radius: var(--glass-radius-md); cursor: grab; font-size: 14px;
                    padding: 2px 5px; line-height: 1;
                }
                .resize-e {
                    position: absolute; right: 0; top: 20%; bottom: 20%;
                    width: 5px; cursor: ew-resize;
                    background: var(--glass-hover); border-radius: 0 var(--glass-radius) var(--glass-radius) 0;
                    transition: background 0.15s;
                }
                .resize-s {
                    position: absolute; bottom: 0; left: 20%; right: 20%;
                    height: 5px; cursor: ns-resize;
                    background: var(--glass-hover); border-radius: 0 0 var(--glass-radius) var(--glass-radius);
                    transition: background 0.15s;
                }
                .resize-se {
                    position: absolute; right: 0; bottom: 0;
                    width: 14px; height: 14px; cursor: nwse-resize;
                    border-right: 3px solid var(--glass-border);
                    border-bottom: 3px solid var(--glass-border);
                    border-radius: 0 0 var(--glass-radius) 0;
                }
                .resize-e:hover, .resize-s:hover { background: var(--glass-border); }
                .resize-se:hover { border-color: var(--glass-text-muted); }
                ${glassScrollbarStyles('.content')}
            </style>
            <div class="panel${hasResize ? ' has-resize' : ''}" role="region">
                ${showGrip  ? '<button class="move-handle" title="Drag to move">⠿</button>' : ''}
                <div class="content"><slot></slot></div>
                ${hasResize ? `
                    <div class="resize-e"  data-edge="e"></div>
                    <div class="resize-s"  data-edge="s"></div>
                    <div class="resize-se" data-edge="se"></div>
                ` : ''}
            </div>
        `;

        const panel = this.shadowRoot!.querySelector<HTMLElement>('.panel')!;
        if (savedW) panel.style.width  = savedW;
        if (savedH) panel.style.height = savedH;
        if (this.dragOffset.x || this.dragOffset.y)
            this.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`;

        if (showGrip) {
            this.shadowRoot!.querySelector('.move-handle')!
                .addEventListener('mousedown', this.onDragStart);
        }
        if (hasResize) {
            this.shadowRoot!.querySelectorAll('[data-edge]').forEach(el =>
                el.addEventListener('mousedown', this.onResizeStart)
            );
        }
    }

    // --- Drag ---

    /** Which overlay palette to use: explicit theme attribute, else the OS preference. */
    private get overlayTheme(): OverlayTheme {
        if (this.getAttribute('theme') === 'light') return 'light';
        if (this.hasAttribute('theme')) return 'dark';
        return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches
            ? 'light' : 'dark';
    }

    private panelRect(): Rect {
        const el = this.shadowRoot!.querySelector<HTMLElement>('.panel');
        const r = el ? el.getBoundingClientRect() : this.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
    }

    private emit(name: string, detail: Record<string, unknown>) {
        this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
    }

    /** Draw the drop zone, letting listeners of `o-drag-move` redirect it. */
    private updateDropZone(x: number, y: number) {
        let zone: Rect | null = this.panelRect();
        this.emit('o-drag-move', {
            x, y,
            rect: { ...zone },
            setDropZone: (r: Rect | null) => { zone = r; },
        });
        if (zone) showDropZone(zone, this.overlayTheme); else hideDropZone();
    }

    private onDragStart = (e: MouseEvent) => {
        e.preventDefault();
        this.activeHandle = this.activeHandle
            ?? (e.currentTarget instanceof HTMLElement ? e.currentTarget : null);
        if (this.activeHandle) this.activeHandle.style.cursor = 'grabbing';
        this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
        // keep the dragged panel above the grid / drop zone overlays
        this.prevZIndex = this.style.zIndex;
        this.style.zIndex = String(Z_DRAGGED);
        const r = this.panelRect();
        showSnapGrid(this.snapSize, r.x, r.y, this.overlayTheme);
        this.emit('o-drag-start', { x: this.dragOffset.x, y: this.dragOffset.y, rect: r });
        this.updateDropZone(this.dragOffset.x, this.dragOffset.y);
        document.addEventListener('mousemove', this.onDragMove);
        document.addEventListener('mouseup', this.onDragEnd);
    }

    private onDragMove = (e: MouseEvent) => {
        if (!this.dragStart) return;
        const x = this.snapTo(e.screenX - this.dragStart.x);
        const y = this.snapTo(e.screenY - this.dragStart.y);
        this.dragOffset = { x, y };
        this.style.transform = `translate(${x}px, ${y}px)`;
        this.updateDropZone(x, y);
    }

    private onDragEnd = () => {
        if (!this.dragStart) return;   // ignore stray mouseup
        this.dragStart = null;
        if (this.activeHandle) this.activeHandle.style.cursor = 'grab';
        this.activeHandle = null;
        hideSnapGrid();
        hideDropZone();
        this.style.zIndex = this.prevZIndex;
        document.removeEventListener('mousemove', this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        // fires last, so listeners can reposition the panel with overlays already gone
        this.emit('o-drag-end', {
            x: this.dragOffset.x, y: this.dragOffset.y, rect: this.panelRect(),
        });
    }

    // --- Resize ---

    private onResizeStart = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const panel = this.shadowRoot!.querySelector<HTMLElement>('.panel')!;
        this.resizeStart = {
            x: e.screenX, y: e.screenY,
            w: panel.offsetWidth, h: panel.offsetHeight,
            edge: (e.currentTarget as HTMLElement).dataset.edge!
        };
        const r = this.panelRect();
        showSnapGrid(this.snapSize, r.x, r.y, this.overlayTheme);
        showDropZone(r, this.overlayTheme);
        this.emit('o-resize-start', {
            width: this.resizeStart.w, height: this.resizeStart.h, edge: this.resizeStart.edge,
        });
        document.addEventListener('mousemove', this.onResizeMove);
        document.addEventListener('mouseup', this.onResizeEnd);
    }

    private onResizeMove = (e: MouseEvent) => {
        if (!this.resizeStart) return;
        const panel = this.shadowRoot!.querySelector<HTMLElement>('.panel')!;
        const dx = e.screenX - this.resizeStart.x;
        const dy = e.screenY - this.resizeStart.y;
        const { edge, w, h } = this.resizeStart;
        if (edge === 'e' || edge === 'se')
            panel.style.width  = `${Math.max(120, this.snapTo(w + dx))}px`;
        if (edge === 's' || edge === 'se')
            panel.style.height = `${Math.max(40,  this.snapTo(h + dy))}px`;
        // outline the size it will settle at
        showDropZone(this.panelRect(), this.overlayTheme);
        this.emit('o-resize-move', { width: panel.offsetWidth, height: panel.offsetHeight, edge });
    }

    private onResizeEnd = () => {
        if (!this.resizeStart) return;   // ignore stray mouseup
        this.resizeStart = null;
        hideSnapGrid();
        hideDropZone();
        document.removeEventListener('mousemove', this.onResizeMove);
        document.removeEventListener('mouseup', this.onResizeEnd);
        const panel = this.shadowRoot!.querySelector<HTMLElement>('.panel');
        this.emit('o-resize-end', {
            width: panel?.offsetWidth ?? 0, height: panel?.offsetHeight ?? 0,
        });
    }
}

customElements.define('o-panel', OWCPanel);
customElements.define('o-button', OWCButton);
