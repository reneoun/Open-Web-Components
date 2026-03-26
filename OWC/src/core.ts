console.log('Open Web Components (OWC) Core Module Loaded - René Oun');

export type Coordinates = { x: number, y: number };

// --- Snap grid overlay (shared singleton) ---
let _gridEl: HTMLDivElement | null = null;
let _gridFadeOut: ReturnType<typeof setTimeout> | null = null;

function showSnapGrid(snap: number) {
    if (snap < 8) return;
    if (_gridFadeOut) { clearTimeout(_gridFadeOut); _gridFadeOut = null; }
    if (!_gridEl) {
        _gridEl = document.createElement('div');
        Object.assign(_gridEl.style, {
            position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '9998',
            transition: 'opacity 200ms ease',
            opacity: '0',
        });
        document.body.appendChild(_gridEl);
    }
    _gridEl.style.backgroundImage = [
        `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)`,
        `linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
    ].join(',');
    _gridEl.style.backgroundSize = `${snap}px ${snap}px`;
    // force reflow so transition fires
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

class OWCButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
            <style>
                :host { display: inline-block; }
                button {
                    cursor: pointer;
                    padding: 8px 20px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.3);
                    background: rgba(255,255,255,0.18);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    color: var(--o-button-color, #fff);
                    font-size: 14px;
                    font-family: sans-serif;
                    transition: background 0.2s, transform 0.1s;
                }
                button:hover { background: rgba(255,255,255,0.28); }
                button:active { transform: scale(0.97); }
            </style>
            <button><slot>Button</slot></button>
        `;
        this.shadowRoot!.querySelector('button')!.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('o-click', { bubbles: true, composed: true }));
        });
    }
}

class OWCPanel extends HTMLElement {
    static get observedAttributes() { return ['move', 'snap', 'resize'] }

    private dragStart: Coordinates | null = null;
    private dragOffset: Coordinates = { x: 0, y: 0 };
    private resizeStart: { x: number; y: number; w: number; h: number; edge: string } | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Do NOT render here — attributes are not yet set for parser-created elements
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        if (this.isConnected) this.render();
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

        // Preserve panel dimensions across re-renders
        const prev = this.shadowRoot!.querySelector<HTMLElement>('.panel');
        const savedW = prev?.style.width ?? '';
        const savedH = prev?.style.height ?? '';

        this.shadowRoot!.innerHTML = `
            <style>
                :host { display: inline-block; }
                .panel {
                    background: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    padding: 16px;
                    margin: 8px;
                    border-radius: 10px;
                    min-width: 120px;
                    min-height: 40px;
                    position: relative;
                    color: #fff;
                    font-family: sans-serif;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .move-handle {
                    position: absolute; top: 6px; right: 8px;
                    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
                    color: #fff; border-radius: 6px; cursor: grab; font-size: 14px;
                    padding: 2px 5px; line-height: 1;
                }
                .resize-e {
                    position: absolute; right: 0; top: 20%; bottom: 20%;
                    width: 5px; cursor: ew-resize;
                    background: rgba(255,255,255,0.15); border-radius: 0 10px 10px 0;
                    transition: background 0.15s;
                }
                .resize-s {
                    position: absolute; bottom: 0; left: 20%; right: 20%;
                    height: 5px; cursor: ns-resize;
                    background: rgba(255,255,255,0.15); border-radius: 0 0 10px 10px;
                    transition: background 0.15s;
                }
                .resize-se {
                    position: absolute; right: 0; bottom: 0;
                    width: 14px; height: 14px; cursor: nwse-resize;
                    border-right: 3px solid rgba(255,255,255,0.3);
                    border-bottom: 3px solid rgba(255,255,255,0.3);
                    border-radius: 0 0 10px 0;
                }
                .resize-e:hover, .resize-s:hover { background: rgba(255,255,255,0.35); }
                .resize-se:hover { border-color: rgba(255,255,255,0.6); }
            </style>
            <div class="panel">
                ${hasDrag   ? '<button class="move-handle" title="Drag to move">⠿</button>' : ''}
                <slot></slot>
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

        if (hasDrag) {
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

    private onDragStart = (e: MouseEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
        this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
        showSnapGrid(this.snapSize);
        document.addEventListener('mousemove', this.onDragMove);
        document.addEventListener('mouseup', this.onDragEnd);
    }

    private onDragMove = (e: MouseEvent) => {
        if (!this.dragStart) return;
        const x = this.snapTo(e.screenX - this.dragStart.x);
        const y = this.snapTo(e.screenY - this.dragStart.y);
        this.dragOffset = { x, y };
        this.style.transform = `translate(${x}px, ${y}px)`;
    }

    private onDragEnd = () => {
        this.dragStart = null;
        const handle = this.shadowRoot!.querySelector<HTMLElement>('.move-handle');
        if (handle) handle.style.cursor = 'grab';
        hideSnapGrid();
        document.removeEventListener('mousemove', this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
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
        showSnapGrid(this.snapSize);
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
    }

    private onResizeEnd = () => {
        this.resizeStart = null;
        hideSnapGrid();
        document.removeEventListener('mousemove', this.onResizeMove);
        document.removeEventListener('mouseup', this.onResizeEnd);
    }
}

customElements.define('o-panel', OWCPanel);
customElements.define('o-button', OWCButton);
