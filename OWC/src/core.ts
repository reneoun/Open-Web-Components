console.log('Open Web Components (OWC) Core Module Loaded - René Oun');

export type Coordinates = { x: number, y: number };

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
    static get observedAttributes() {
        return ['move'];
    }

    private panelEl!: HTMLDivElement;
    private dragStart: Coordinates | null = null;
    private dragOffset: Coordinates = { x: 0, y: 0 };
    private _connected = false;

    constructor() {
        super();
        const panel = document.createElement('div') as HTMLDivElement;
        panel.style.cssText = `
            background: rgba(255,255,255,0.18);
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 16px;
            margin: 8px;
            border-radius: 10px;
            width: fit-content;
            position: relative;
            color: #fff;
            font-family: sans-serif;
            font-size: 14px;
        `;
        this.panelEl = panel;
    }

    connectedCallback() {
        if (this._connected) return;
        this._connected = true;

        this.panelEl.innerHTML = this.innerHTML || '<p style="margin:0">Default Panel Content</p>';
        this.innerHTML = '';

        if (this.hasAttribute('move')) {
            const moveButton = document.createElement('button');
            moveButton.textContent = '⠿';
            moveButton.title = 'Drag to move';
            moveButton.style.cssText = `
                position: absolute; top: 6px; right: 8px;
                background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
                color: #fff; border-radius: 6px; cursor: grab; font-size: 14px;
                padding: 2px 5px; line-height: 1;
            `;
            moveButton.addEventListener('mousedown', this.mouseDownHandler.bind(this));
            this.panelEl.appendChild(moveButton);
        }

        this.appendChild(this.panelEl);
    }

    private mouseDownHandler(e: MouseEvent) {
        e.preventDefault();
        (e.target as HTMLElement).style.cursor = 'grabbing';
        this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    }

    private mouseMoveHandler = (e: MouseEvent) => {
        if (!this.dragStart) return;
        this.dragOffset = { x: e.screenX - this.dragStart.x, y: e.screenY - this.dragStart.y };
        this.panelEl.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`;
    }

    private mouseUpHandler(e: MouseEvent) {
        this.dragStart = null;
        (e.target as HTMLElement).style.cursor = 'grab';
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
    }
}

customElements.define('o-panel', OWCPanel);
customElements.define('o-button', OWCButton);
