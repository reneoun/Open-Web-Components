(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // src/index.ts
  var exports_src = {};
  __export(exports_src, {
    toast: () => toast,
    OWCToast: () => OWCToast,
    OTable: () => OTable
  });

  // src/core.ts
  console.log("Open Web Components (OWC) Core Module Loaded - René Oun");

  class OWCButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
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
      this.shadowRoot.querySelector("button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("o-click", { bubbles: true, composed: true }));
      });
    }
  }

  class OWCPanel extends HTMLElement {
    static get observedAttributes() {
      return ["move"];
    }
    panelEl;
    dragStart = null;
    dragOffset = { x: 0, y: 0 };
    constructor() {
      super();
      const panel = document.createElement("div");
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
      this.innerHTML = "";
      this.panelEl = panel;
      if (this.hasAttribute("move")) {
        const moveButton = document.createElement("button");
        moveButton.textContent = "⠿";
        moveButton.title = "Drag to move";
        moveButton.style.cssText = `
                position: absolute; top: 6px; right: 8px;
                background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
                color: #fff; border-radius: 6px; cursor: grab; font-size: 14px;
                padding: 2px 5px; line-height: 1;
            `;
        moveButton.addEventListener("mousedown", this.mouseDownHandler.bind(this));
        panel.appendChild(moveButton);
      }
      this.appendChild(panel);
    }
    mouseDownHandler(e) {
      e.preventDefault();
      e.target.style.cursor = "grabbing";
      this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler.bind(this));
    }
    mouseMoveHandler = (e) => {
      if (!this.dragStart)
        return;
      this.dragOffset = { x: e.screenX - this.dragStart.x, y: e.screenY - this.dragStart.y };
      this.panelEl.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`;
    };
    mouseUpHandler(e) {
      this.dragStart = null;
      e.target.style.cursor = "grab";
      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler.bind(this));
    }
  }
  customElements.define("o-panel", OWCPanel);
  customElements.define("o-button", OWCButton);

  // src/table.ts
  class OTable extends HTMLElement {
    static get observedAttributes() {
      return ["storage", "storage-key", "resize-mode"];
    }
    _columns = [];
    _data = [];
    _sortCol = null;
    _sortDir = "none";
    get columns() {
      return this._columns;
    }
    set columns(v) {
      this._columns = v;
      this.render();
    }
    get data() {
      return this._data;
    }
    set data(v) {
      this._data = v;
      this.render();
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.restoreState();
      this.render();
    }
    getStorage() {
      const s = this.getAttribute("storage");
      if (s === "local")
        return localStorage;
      if (s === "session")
        return sessionStorage;
      return null;
    }
    persistState() {
      const store = this.getStorage();
      const key = this.getAttribute("storage-key");
      if (!store || !key)
        return;
      const widths = {};
      this._columns.forEach((c) => {
        if (c.width)
          widths[c.key] = c.width;
      });
      store.setItem(key, JSON.stringify({ sortCol: this._sortCol, sortDir: this._sortDir, widths }));
    }
    restoreState() {
      const store = this.getStorage();
      const key = this.getAttribute("storage-key");
      if (!store || !key)
        return;
      const raw = store.getItem(key);
      if (!raw)
        return;
      try {
        const { sortCol, sortDir, widths } = JSON.parse(raw);
        this._sortCol = sortCol ?? null;
        this._sortDir = sortDir ?? "none";
        if (widths) {
          this._columns = this._columns.map((c) => widths[c.key] != null ? { ...c, width: widths[c.key] } : c);
        }
      } catch {
      }
    }
    render() {
      if (!this.shadowRoot)
        return;
      this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; overflow-x: auto; }
        table {
          width: 100%; border-collapse: collapse;
          font-family: sans-serif; font-size: 14px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px; overflow: hidden;
        }
        th, td {
          padding: 10px 14px; text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: #fff; position: relative;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        th {
          background: rgba(255,255,255,0.15);
          user-select: none;
          backdrop-filter: blur(10px);
        }
        th[data-sortable] { cursor: pointer; }
        tbody tr:hover td { background: rgba(255,255,255,0.06); }
        .sort-icon { float: right; opacity: 0.5; }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: rgba(255,255,255,0.3); }
      </style>
      <table>
        <thead><tr>${this._columns.map((c) => this.renderTh(c)).join("")}</tr></thead>
        <tbody>${this.getSortedData().map((row) => this.renderRow(row)).join("")}</tbody>
      </table>
    `;
      this.attachHandlers();
    }
    renderTh(col) {
      const w = col.width ? `${col.width}px` : "fit-content";
      const minW = col.minWidth ? `min-width:${col.minWidth}px;` : "";
      const maxW = col.maxWidth ? `max-width:${col.maxWidth}px;` : "";
      const sortable = col.sortable ? " data-sortable" : "";
      const icon = col.sortable ? `<span class="sort-icon">${this._sortCol === col.key && this._sortDir === "asc" ? "↑" : this._sortCol === col.key && this._sortDir === "desc" ? "↓" : "↕"}</span>` : "";
      return `<th data-key="${col.key}"${sortable} style="width:${w};${minW}${maxW}">
      ${col.label}${icon}
      <div class="resize-handle" data-resize="${col.key}"></div>
    </th>`;
    }
    renderRow(row) {
      return `<tr>${this._columns.map((c) => `<td>${row[c.key] ?? ""}</td>`).join("")}</tr>`;
    }
    getSortedData() {
      if (!this._sortCol || this._sortDir === "none")
        return this._data;
      return [...this._data].sort((a, b) => {
        const av = a[this._sortCol];
        const bv = b[this._sortCol];
        if (av == null)
          return 1;
        if (bv == null)
          return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return this._sortDir === "asc" ? cmp : -cmp;
      });
    }
    handleSort(key) {
      const col = this._columns.find((c) => c.key === key);
      if (!col?.sortable)
        return;
      if (this._sortCol !== key) {
        this._sortCol = key;
        this._sortDir = "asc";
      } else if (this._sortDir === "asc")
        this._sortDir = "desc";
      else {
        this._sortCol = null;
        this._sortDir = "none";
      }
      this.dispatchEvent(new CustomEvent("o-sort", {
        bubbles: true,
        composed: true,
        detail: { col: key, dir: this._sortDir }
      }));
      this.persistState();
      this.render();
    }
    attachHandlers() {
      const mode = this.getAttribute("resize-mode") ?? "single";
      this.shadowRoot.querySelectorAll("th[data-key]").forEach((th) => {
        const key = th.dataset.key;
        th.addEventListener("click", () => this.handleSort(key));
      });
      this.shadowRoot.querySelectorAll(".resize-handle").forEach((handle) => {
        const key = handle.dataset.resize;
        const colIdx = this._columns.findIndex((c) => c.key === key);
        const col = this._columns[colIdx];
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const startX = e.screenX;
          const th = handle.closest("th");
          const startW = th.offsetWidth || col.width || 100;
          const nextTh = mode === "adjacent" ? th.nextElementSibling : null;
          const nextStartW = nextTh?.offsetWidth ?? 0;
          const onMove = (ev) => {
            const delta = ev.screenX - startX;
            let newW = Math.max(col.minWidth ?? 20, startW + delta);
            if (col.maxWidth)
              newW = Math.min(col.maxWidth, newW);
            th.style.width = `${newW}px`;
            if (mode === "adjacent" && nextTh) {
              const nextCol = this._columns[colIdx + 1];
              let nextW = Math.max(nextCol?.minWidth ?? 20, nextStartW - delta);
              if (nextCol?.maxWidth)
                nextW = Math.min(nextCol.maxWidth, nextW);
              nextTh.style.width = `${nextW}px`;
            }
          };
          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            this.shadowRoot.querySelectorAll("th").forEach((t, i) => {
              const w = parseInt(t.style.width) || t.offsetWidth;
              if (w)
                this._columns[i] = { ...this._columns[i], width: w };
            });
            this.persistState();
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
      });
    }
  }
  customElements.define("o-table", OTable);

  // src/toast.ts
  var ICONS = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };
  var COLORS = {
    success: "#4ade80",
    error: "#f87171",
    warning: "#fbbf24",
    info: "#60a5fa"
  };

  class OWCToast extends HTMLElement {
    static get observedAttributes() {
      return ["type", "message", "duration"];
    }
    msgEl;
    slotEl;
    timer = null;
    fallbackTimer = null;
    startedAt = 0;
    elapsed = 0;
    durationMs = 3000;
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.durationMs = parseInt(this.getAttribute("duration") ?? "3000", 10);
      this.render();
      this.updateSlotOrFallback();
      this.startTimer();
      this.addEventListener("mouseenter", this.onMouseEnter);
      this.addEventListener("mouseleave", this.onMouseLeave);
    }
    disconnectedCallback() {
      this.clearTimer();
      this.removeEventListener("mouseenter", this.onMouseEnter);
      this.removeEventListener("mouseleave", this.onMouseLeave);
    }
    attributeChangedCallback(name, _old, _val) {
      if (!this.shadowRoot.firstChild)
        return;
      if (name === "type")
        this.updateAccent();
      if (name === "message")
        this.updateSlotOrFallback();
    }
    render() {
      const type = this.getAttribute("type") ?? "info";
      const color = COLORS[type] ?? COLORS.info;
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          min-width: 220px;
          max-width: 360px;
          padding: 10px 36px 10px 14px;
          border-radius: var(--o-toast-radius, 10px);
          background: var(--o-toast-bg, rgba(255,255,255,0.18));
          border: 1px solid var(--o-toast-border, rgba(255,255,255,0.3));
          backdrop-filter: blur(var(--o-toast-blur, 10px));
          -webkit-backdrop-filter: blur(var(--o-toast-blur, 10px));
          color: var(--o-toast-color, #fff);
          font-family: sans-serif;
          font-size: 14px;
          border-left: 4px solid var(--_accent);
          box-sizing: border-box;
        }
        .icon { margin-right: 8px; font-weight: bold; }
        #msg { display: none; }
        .close {
          position: absolute; top: 6px; right: 8px;
          background: none; border: none; color: inherit;
          cursor: pointer; font-size: 14px; opacity: 0.7; padding: 2px 4px;
        }
        .close:hover { opacity: 1; }
        .progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: var(--_accent); border-radius: 0 0 var(--o-toast-radius, 10px) var(--o-toast-radius, 10px);
          width: 100%; transform-origin: left;
          animation: shrink linear both;
          animation-duration: var(--_dur, 3000ms);
        }
        .progress.paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: no-preference) {
          :host { animation: slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
          :host(.exiting) { animation: slideOutRight 0.25s ease-in both; }
          @keyframes slideInRight {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(110%); opacity: 0; }
          }
          @media (max-width: 639px) {
            :host { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
            :host(.exiting) { animation: slideDown 0.25s ease-in both; }
            @keyframes slideUp {
              from { transform: translateY(60px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes slideDown {
              from { transform: translateY(0);    opacity: 1; }
              to   { transform: translateY(60px); opacity: 0; }
            }
          }
        }
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      </style>
      <span class="icon">${ICONS[type] ?? ICONS.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `;
      this.msgEl = this.shadowRoot.querySelector("#msg");
      this.slotEl = this.shadowRoot.querySelector("slot");
      const bar = this.shadowRoot.querySelector(".progress");
      if (bar)
        bar.style.setProperty("--_dur", `${this.durationMs}ms`);
      this.slotEl.addEventListener("slotchange", () => this.updateSlotOrFallback());
      this.shadowRoot.querySelector(".close").addEventListener("click", () => this.dismiss());
      this.style.setProperty("--_accent", color);
    }
    updateSlotOrFallback() {
      if (!this.msgEl || !this.slotEl)
        return;
      const hasSlot = this.slotEl.assignedNodes({ flatten: true }).length > 0;
      if (hasSlot) {
        this.msgEl.style.display = "none";
      } else {
        this.msgEl.style.display = "";
        this.msgEl.textContent = this.getAttribute("message") ?? "";
      }
    }
    updateAccent() {
      const type = this.getAttribute("type") ?? "info";
      const color = COLORS[type] ?? COLORS.info;
      this.style.setProperty("--_accent", color);
      const iconEl = this.shadowRoot.querySelector(".icon");
      if (iconEl)
        iconEl.textContent = ICONS[type] ?? ICONS.info;
    }
    startTimer(remaining) {
      this.startedAt = Date.now();
      const ms = remaining ?? this.durationMs - this.elapsed;
      this.timer = setTimeout(() => this.dismiss(), ms);
      this.fallbackTimer = setTimeout(() => {
        if (this.isConnected)
          this.remove();
      }, ms + 600);
    }
    clearTimer() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.fallbackTimer !== null) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    }
    onMouseEnter = () => {
      this.elapsed += Date.now() - this.startedAt;
      this.clearTimer();
      this.shadowRoot?.querySelector(".progress")?.classList.add("paused");
    };
    onMouseLeave = () => {
      this.startedAt = Date.now();
      this.startTimer(Math.max(0, this.durationMs - this.elapsed));
      this.shadowRoot?.querySelector(".progress")?.classList.remove("paused");
    };
    dismiss() {
      this.clearTimer();
      this.classList.add("exiting");
      this.addEventListener("animationend", () => this.remove(), { once: true });
      setTimeout(() => this.remove(), 400);
    }
  }
  customElements.define("o-toast", OWCToast);
  function ensureContainer() {
    if (!document.getElementById("o-toast-container")) {
      const style = document.createElement("style");
      style.setAttribute("data-owc-toast", "");
      style.textContent = `
      #o-toast-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        top: 1rem;
        right: 1rem;
        pointer-events: none;
      }
      #o-toast-container > * { pointer-events: all; }
      @media (max-width: 639px) {
        #o-toast-container {
          top: auto; right: auto;
          bottom: 1rem; left: 50%;
          transform: translateX(-50%);
          align-items: center;
        }
      }
    `;
      document.head.appendChild(style);
      const container = document.createElement("div");
      container.id = "o-toast-container";
      document.body.appendChild(container);
    }
    return document.getElementById("o-toast-container");
  }
  function toast(content, type, options) {
    const container = ensureContainer();
    const el = document.createElement("o-toast");
    el.setAttribute("type", type);
    if (options?.duration !== undefined) {
      el.setAttribute("duration", String(options.duration));
    }
    el.innerHTML = content;
    container.appendChild(el);
  }

  // src/index.ts
  if (typeof window !== "undefined") {
    window.toast = toast;
  }
})();
