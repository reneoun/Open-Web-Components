console.log('Open Web Components (OWC) Core Module Loaded - René Oun');

export type Coordinates = { x: number, y: number };
export type CentralDataType = {
    start?: Coordinates;
    end?: Coordinates;
    panel?: HTMLDivElement;
}

declare global {
    interface Window {
        CENTRAL_DATA?: CentralDataType
    }
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
    static get observedAttributes() {
        return ['move'];
    }

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
        panel.innerHTML = this.innerHTML || '<p style="margin:0">Default Panel Content</p>';
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
            panel.appendChild(moveButton);
        }

        this.appendChild(panel);
        window.CENTRAL_DATA = { panel };
    }

    private mouseDownHandler(e: MouseEvent) {
        e.preventDefault();
        (e.target as HTMLElement).style.cursor = 'grabbing';
        if (window.CENTRAL_DATA) {
            window.CENTRAL_DATA.start = { x: e.screenX, y: e.screenY };
        }
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    }

    private mouseMoveHandler(e: MouseEvent) {
        if (window.CENTRAL_DATA?.panel && window.CENTRAL_DATA.start) {
            const { panel, start } = window.CENTRAL_DATA;
            panel.style.transform = `translate(${e.screenX - start.x}px, ${e.screenY - start.y}px)`;
            window.CENTRAL_DATA.end = { x: e.clientX, y: e.clientY };
        }
    }

    private mouseUpHandler(e: MouseEvent) {
        (e.target as HTMLElement).style.cursor = 'grab';
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
    }
}

customElements.define('o-panel', OWCPanel);
customElements.define('o-button', OWCButton);
