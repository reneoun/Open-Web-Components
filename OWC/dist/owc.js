var z = Object.defineProperty;
var q = (l, n, t) => n in l ? z(l, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[n] = t;
var a = (l, n, t) => q(l, typeof n != "symbol" ? n + "" : n, t);
const D = `
  --glass-bg: rgba(34,197,94,0.06);
  --glass-border: rgba(34,197,94,0.15);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.06);
  --accent-warm: rgba(22,163,74,0.7);
  --glass-text: #1a2e1a;
  --glass-text-muted: rgba(0,40,0,0.5);
  --glass-text-dim: rgba(0,40,0,0.3);
  --glass-hover: rgba(34,197,94,0.08);
`, M = `
  --glass-bg: rgba(255,255,255,0.07);
  --glass-border: rgba(255,255,255,0.12);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
  --accent-warm: rgba(251,191,36,0.6);
  --glass-text: #fff;
  --glass-text-muted: rgba(255,255,255,0.5);
  --glass-text-dim: rgba(255,255,255,0.3);
  --glass-hover: rgba(255,255,255,0.1);
`;
function p() {
  return `
    :host {
      ${M}
    }
    :host([theme="light"]) {
      ${D}
    }
  `;
}
function _(l = ":host") {
  return `
    /* Firefox */
    ${l} {
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.15) transparent;
    }
    /* Webkit (Chrome, Safari, Edge) */
    ${l}::-webkit-scrollbar { width: 6px; height: 6px; }
    ${l}::-webkit-scrollbar-track { background: transparent; }
    ${l}::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.12);
      border-radius: 3px;
      transition: background 0.2s;
    }
    ${l}::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.3);
    }
    ${l}::-webkit-scrollbar-corner { background: transparent; }
  `;
}
class b extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
}
console.log("Open Web Components (OWC) Core Module Loaded - René Oun");
let g = null, k = null;
function L(l, n = 0, t = 0) {
  l < 8 || (k && (clearTimeout(k), k = null), g || (g = document.createElement("div"), Object.assign(g.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "9998",
    transition: "opacity 200ms ease",
    opacity: "0"
  }), document.body.appendChild(g)), g.style.backgroundImage = [
    "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)"
  ].join(","), g.style.backgroundSize = `${l}px ${l}px`, g.style.backgroundPosition = `${n % l}px ${t % l}px`, g.offsetHeight, g.style.opacity = "1");
}
function T() {
  if (!g) return;
  g.style.opacity = "0";
  const l = g;
  k = setTimeout(() => {
    l.remove(), g === l && (g = null), k = null;
  }, 220);
}
class I extends b {
  constructor() {
    super(), this.shadowRoot.innerHTML = `
            <style>
                ${p()}
                :host { display: inline-block; }
                button {
                    cursor: pointer;
                    padding: 8px 20px;
                    border-radius: 10px;
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    backdrop-filter: blur(var(--glass-blur));
                    -webkit-backdrop-filter: blur(var(--glass-blur));
                    color: var(--o-button-color, var(--glass-text));
                    font-size: 14px;
                    font-family: sans-serif;
                    transition: background 0.2s, transform 0.1s;
                }
                button:hover { background: var(--glass-hover); }
                button:active { transform: scale(0.97); }
            </style>
            <button><slot>Button</slot></button>
        `, this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("o-click", { bubbles: !0, composed: !0 }));
    });
  }
}
class O extends b {
  constructor() {
    super();
    a(this, "dragStart", null);
    a(this, "dragOffset", { x: 0, y: 0 });
    a(this, "resizeStart", null);
    // --- Drag ---
    a(this, "onDragStart", (t) => {
      t.preventDefault(), t.currentTarget.style.cursor = "grabbing", this.dragStart = { x: t.screenX - this.dragOffset.x, y: t.screenY - this.dragOffset.y };
      const e = this.shadowRoot.querySelector(".panel").getBoundingClientRect();
      L(this.snapSize, e.left, e.top), document.addEventListener("mousemove", this.onDragMove), document.addEventListener("mouseup", this.onDragEnd);
    });
    a(this, "onDragMove", (t) => {
      if (!this.dragStart) return;
      const e = this.snapTo(t.screenX - this.dragStart.x), s = this.snapTo(t.screenY - this.dragStart.y);
      this.dragOffset = { x: e, y: s }, this.style.transform = `translate(${e}px, ${s}px)`;
    });
    a(this, "onDragEnd", () => {
      this.dragStart = null;
      const t = this.shadowRoot.querySelector(".move-handle");
      t && (t.style.cursor = "grab"), T(), document.removeEventListener("mousemove", this.onDragMove), document.removeEventListener("mouseup", this.onDragEnd);
    });
    // --- Resize ---
    a(this, "onResizeStart", (t) => {
      t.preventDefault(), t.stopPropagation();
      const e = this.shadowRoot.querySelector(".panel");
      this.resizeStart = {
        x: t.screenX,
        y: t.screenY,
        w: e.offsetWidth,
        h: e.offsetHeight,
        edge: t.currentTarget.dataset.edge
      };
      const s = this.shadowRoot.querySelector(".panel").getBoundingClientRect();
      L(this.snapSize, s.left, s.top), document.addEventListener("mousemove", this.onResizeMove), document.addEventListener("mouseup", this.onResizeEnd);
    });
    a(this, "onResizeMove", (t) => {
      if (!this.resizeStart) return;
      const e = this.shadowRoot.querySelector(".panel"), s = t.screenX - this.resizeStart.x, o = t.screenY - this.resizeStart.y, { edge: i, w: r, h: d } = this.resizeStart;
      (i === "e" || i === "se") && (e.style.width = `${Math.max(120, this.snapTo(r + s))}px`), (i === "s" || i === "se") && (e.style.height = `${Math.max(40, this.snapTo(d + o))}px`);
    });
    a(this, "onResizeEnd", () => {
      this.resizeStart = null, T(), document.removeEventListener("mousemove", this.onResizeMove), document.removeEventListener("mouseup", this.onResizeEnd);
    });
  }
  static get observedAttributes() {
    return ["move", "snap", "resize"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  get snapSize() {
    const t = parseInt(this.getAttribute("snap") ?? "1");
    return isNaN(t) || t < 1 ? 1 : t;
  }
  snapTo(t) {
    const e = this.snapSize;
    return Math.round(t / e) * e;
  }
  render() {
    const t = this.hasAttribute("move"), e = this.hasAttribute("resize"), s = this.shadowRoot.querySelector(".panel"), o = (s == null ? void 0 : s.style.width) ?? "", i = (s == null ? void 0 : s.style.height) ?? "";
    this.shadowRoot.innerHTML = `
            <style>
                ${p()}
                :host { display: inline-block; }
                .panel {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    backdrop-filter: blur(var(--glass-blur));
                    -webkit-backdrop-filter: blur(var(--glass-blur));
                    padding: 16px;
                    margin: 8px;
                    border-radius: 10px;
                    min-width: 120px;
                    min-height: 40px;
                    position: relative;
                    color: var(--glass-text);
                    font-family: sans-serif;
                    font-size: 14px;
                    box-sizing: border-box;
                    overflow: auto;
                }
                .move-handle {
                    position: absolute; top: 6px; right: 8px;
                    background: var(--glass-hover); border: 1px solid var(--glass-border);
                    color: var(--glass-text); border-radius: 6px; cursor: grab; font-size: 14px;
                    padding: 2px 5px; line-height: 1;
                }
                .resize-e {
                    position: absolute; right: 0; top: 20%; bottom: 20%;
                    width: 5px; cursor: ew-resize;
                    background: var(--glass-hover); border-radius: 0 10px 10px 0;
                    transition: background 0.15s;
                }
                .resize-s {
                    position: absolute; bottom: 0; left: 20%; right: 20%;
                    height: 5px; cursor: ns-resize;
                    background: var(--glass-hover); border-radius: 0 0 10px 10px;
                    transition: background 0.15s;
                }
                .resize-se {
                    position: absolute; right: 0; bottom: 0;
                    width: 14px; height: 14px; cursor: nwse-resize;
                    border-right: 3px solid var(--glass-border);
                    border-bottom: 3px solid var(--glass-border);
                    border-radius: 0 0 10px 0;
                }
                .resize-e:hover, .resize-s:hover { background: var(--glass-border); }
                .resize-se:hover { border-color: var(--glass-text-muted); }
                ${_(".panel")}
            </style>
            <div class="panel" role="region">
                ${t ? '<button class="move-handle" title="Drag to move">⠿</button>' : ""}
                <slot></slot>
                ${e ? `
                    <div class="resize-e"  data-edge="e"></div>
                    <div class="resize-s"  data-edge="s"></div>
                    <div class="resize-se" data-edge="se"></div>
                ` : ""}
            </div>
        `;
    const r = this.shadowRoot.querySelector(".panel");
    o && (r.style.width = o), i && (r.style.height = i), (this.dragOffset.x || this.dragOffset.y) && (this.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`), t && this.shadowRoot.querySelector(".move-handle").addEventListener("mousedown", this.onDragStart), e && this.shadowRoot.querySelectorAll("[data-edge]").forEach(
      (d) => d.addEventListener("mousedown", this.onResizeStart)
    );
  }
}
customElements.define("o-panel", O);
customElements.define("o-button", I);
class H extends b {
  constructor() {
    super();
    a(this, "_columns", []);
    a(this, "_data", []);
    a(this, "_sortCol", null);
    a(this, "_sortDir", "none");
    a(this, "_selectedRows", /* @__PURE__ */ new Set());
    a(this, "_editingRows", /* @__PURE__ */ new Set());
    a(this, "_rowOriginals", /* @__PURE__ */ new Map());
  }
  static get observedAttributes() {
    return ["storage", "storage-key", "resize-mode", "selectable", "editable"];
  }
  get columns() {
    return this._columns;
  }
  set columns(t) {
    this._columns = t, this.render();
  }
  get data() {
    return this._data;
  }
  set data(t) {
    this._data = t, this._selectedRows.clear(), this._editingRows.clear(), this._rowOriginals.clear(), this.render();
  }
  get selected() {
    return this._data.filter((t) => this._selectedRows.has(t));
  }
  get selectable() {
    return this.hasAttribute("selectable");
  }
  get editable() {
    return this.hasAttribute("editable");
  }
  connectedCallback() {
    this.restoreState(), this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  getStorage() {
    const t = this.getAttribute("storage");
    return t === "local" ? localStorage : t === "session" ? sessionStorage : null;
  }
  persistState() {
    const t = this.getStorage(), e = this.getAttribute("storage-key");
    if (!t || !e) return;
    const s = {};
    this._columns.forEach((o) => {
      o.width && (s[o.key] = o.width);
    }), t.setItem(e, JSON.stringify({ sortCol: this._sortCol, sortDir: this._sortDir, widths: s }));
  }
  restoreState() {
    const t = this.getStorage(), e = this.getAttribute("storage-key");
    if (!t || !e) return;
    const s = t.getItem(e);
    if (s)
      try {
        const { sortCol: o, sortDir: i, widths: r } = JSON.parse(s);
        this._sortCol = o ?? null, this._sortDir = i ?? "none", r && (this._columns = this._columns.map(
          (d) => r[d.key] != null ? { ...d, width: r[d.key] } : d
        ));
      } catch {
      }
  }
  render() {
    this.shadowRoot && (this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; overflow-x: auto; }
        ${_(":host")}
        table {
          border-collapse: collapse;
          font-family: sans-serif; font-size: 14px;
          background: var(--glass-bg);
          border-radius: 10px; overflow: hidden;
        }
        th, td {
          padding: 10px 14px; text-align: left;
          border-bottom: 1px solid var(--glass-hover);
          color: var(--glass-text); position: relative;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        th {
          background: var(--glass-hover);
          user-select: none;
          backdrop-filter: blur(var(--glass-blur));
        }
        th[data-sortable] { cursor: pointer; }
        tbody tr:hover td { background: var(--glass-hover); }
        .sort-icon { float: right; opacity: 0.5; }
        .resize-handle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 5px; cursor: col-resize;
          background: transparent;
        }
        .resize-handle:hover { background: var(--glass-border); }
        tbody tr.selected td { background: var(--glass-bg); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: var(--glass-text);
        }
        .cell-input {
          background: var(--glass-hover);
          border: 1px solid var(--accent-warm);
          border-radius: 4px;
          color: var(--glass-text);
          padding: 4px 8px;
          font-size: 13px;
          width: calc(100% - 4px);
          outline: none;
          font-family: sans-serif;
        }
        .cell-input:focus { border-color: var(--accent-warm); background: var(--glass-border); }
        .edit-actions { width: 72px; text-align: center; padding: 6px 4px; }
        .edit-btn, .edit-confirm, .edit-cancel {
          background: none; border: none; cursor: pointer;
          font-size: 13px; padding: 2px 4px; opacity: 0.7; color: var(--glass-text); border-radius: 3px;
        }
        .edit-btn:hover, .edit-confirm:hover, .edit-cancel:hover { opacity: 1; }
        .edit-confirm { color: rgba(74,222,128,0.9); }
        .edit-cancel { color: rgba(248,113,113,0.9); }
      </style>
      ${(() => {
      const t = this._columns.some((s) => s.editable === "click"), e = this.editable && t ? '<th style="width:72px"></th>' : "";
      return `<table>
        <thead><tr>
          ${this.selectable ? '<th style="width:36px"><input type="checkbox" data-select-all aria-label="Select all rows"></th>' : ""}
          ${this._columns.map((s) => this.renderTh(s)).join("")}
          ${e}
        </tr></thead>
        <tbody>${this.getSortedData().map((s, o) => this.renderRow(s, o, t)).join("")}</tbody>
      </table>`;
    })()}
    `, this.attachHandlers());
  }
  renderTh(t) {
    const e = t.width ? `${t.width}px` : "fit-content", s = t.minWidth ? `min-width:${t.minWidth}px;` : "", o = t.maxWidth ? `max-width:${t.maxWidth}px;` : "", i = t.sortable ? " data-sortable" : "", r = t.sortable ? `<span class="sort-icon">${this._sortCol === t.key && this._sortDir === "asc" ? "↑" : this._sortCol === t.key && this._sortDir === "desc" ? "↓" : "↕"}</span>` : "";
    return `<th data-key="${t.key}"${i} style="width:${e};${s}${o}">
      ${t.label}${r}
      <div class="resize-handle" data-resize="${t.key}"></div>
    </th>`;
  }
  renderRow(t, e, s) {
    const o = this._selectedRows.has(t) ? " checked" : "", i = this._selectedRows.has(t) ? ' class="selected"' : "", r = this.selectable ? `<td><input type="checkbox" data-select-row${o} aria-label="Select row"></td>` : "", d = this._editingRows.has(t);
    let h = "";
    this.editable && s && (h = d ? `<td class="edit-actions">
            <button class="edit-confirm" data-row-index="${e}" title="Confirm">✓</button>
            <button class="edit-cancel" data-row-index="${e}" title="Cancel">✗</button>
           </td>` : `<td class="edit-actions">
            <button class="edit-btn" data-row-index="${e}" title="Edit">✏️</button>
           </td>`);
    const u = this._columns.map((c) => {
      if (this.editable && c.editable && (c.editable === "always" || d)) {
        const f = String(t[c.key] ?? "").replace(/"/g, "&quot;");
        return `<td><input class="cell-input" data-key="${c.key}" data-row-index="${e}" value="${f}" /></td>`;
      }
      return `<td>${t[c.key] ?? ""}</td>`;
    }).join("");
    return `<tr${i} data-row-index="${e}">${r}${u}${h}</tr>`;
  }
  getSortedData() {
    return !this._sortCol || this._sortDir === "none" ? this._data : [...this._data].sort((t, e) => {
      const s = t[this._sortCol], o = e[this._sortCol];
      if (s == null) return 1;
      if (o == null) return -1;
      const i = s < o ? -1 : s > o ? 1 : 0;
      return this._sortDir === "asc" ? i : -i;
    });
  }
  handleSort(t) {
    const e = this._columns.find((s) => s.key === t);
    e != null && e.sortable && (this._sortCol !== t ? (this._sortCol = t, this._sortDir = "asc") : this._sortDir === "asc" ? this._sortDir = "desc" : (this._sortCol = null, this._sortDir = "none"), this.dispatchEvent(new CustomEvent("o-sort", {
      bubbles: !0,
      composed: !0,
      detail: { col: t, dir: this._sortDir }
    })), this.persistState(), this.render());
  }
  attachHandlers() {
    const t = this.getAttribute("resize-mode") ?? "single";
    if (this.shadowRoot.querySelectorAll("th[data-key]").forEach((e) => {
      const s = e.dataset.key;
      e.addEventListener("click", () => this.handleSort(s));
    }), this.shadowRoot.querySelectorAll(".resize-handle").forEach((e) => {
      const s = e.dataset.resize, o = this._columns.findIndex((r) => r.key === s), i = this._columns[o];
      e.addEventListener("click", (r) => r.stopPropagation()), e.addEventListener("mousedown", (r) => {
        r.preventDefault();
        const d = r.screenX, h = e.closest("th"), u = h.offsetWidth || i.width || 100, c = t === "adjacent" ? h.nextElementSibling : null, f = (c == null ? void 0 : c.offsetWidth) ?? 0, R = (C) => {
          const y = C.screenX - d;
          let w = Math.max(i.minWidth ?? 20, u + y);
          if (i.maxWidth && (w = Math.min(i.maxWidth, w)), h.style.width = `${w}px`, t === "adjacent" && c) {
            const v = this._columns[o + 1];
            let x = Math.max((v == null ? void 0 : v.minWidth) ?? 20, f - y);
            v != null && v.maxWidth && (x = Math.min(v.maxWidth, x)), c.style.width = `${x}px`;
          }
        }, A = () => {
          document.removeEventListener("mousemove", R), document.removeEventListener("mouseup", A);
          const C = this.selectable ? 1 : 0;
          this.shadowRoot.querySelectorAll("th").forEach((y, w) => {
            const v = w - C;
            if (v < 0 || v >= this._columns.length) return;
            const x = parseInt(y.style.width) || y.offsetWidth;
            x && (this._columns[v] = { ...this._columns[v], width: x });
          }), this.persistState();
        };
        document.addEventListener("mousemove", R), document.addEventListener("mouseup", A);
      });
    }), this.selectable) {
      this.shadowRoot.querySelectorAll("tbody [data-select-row]").forEach((s, o) => {
        const i = this.getSortedData()[o];
        s.addEventListener("click", (r) => {
          r.stopPropagation(), this._selectedRows.has(i) ? this._selectedRows.delete(i) : this._selectedRows.add(i), this.dispatchEvent(new CustomEvent("o-row-select", {
            bubbles: !0,
            composed: !0,
            detail: { selected: this.selected }
          })), this.render();
        });
      });
      const e = this.shadowRoot.querySelector("[data-select-all]");
      e && e.addEventListener("click", (s) => {
        s.stopPropagation(), this.getSortedData().every((i) => this._selectedRows.has(i)) ? this._selectedRows.clear() : this.getSortedData().forEach((i) => this._selectedRows.add(i)), this.dispatchEvent(new CustomEvent("o-row-select", {
          bubbles: !0,
          composed: !0,
          detail: { selected: this.selected }
        })), this.render();
      });
    }
    this.editable && (this.shadowRoot.querySelectorAll("input.cell-input").forEach((e) => {
      const s = e.dataset.key, o = parseInt(e.dataset.rowIndex), i = this._columns.find((d) => d.key === s);
      if ((i == null ? void 0 : i.editable) !== "always") return;
      const r = () => {
        const d = this.getSortedData()[o];
        if (!d) return;
        const h = String(d[s] ?? ""), u = e.value;
        u !== h && (d[s] = u, this.dispatchEvent(new CustomEvent("o-cell-change", {
          bubbles: !0,
          composed: !0,
          detail: { key: s, value: u, rowIndex: o, row: d }
        })));
      };
      e.addEventListener("blur", r), e.addEventListener("keydown", (d) => {
        d.key === "Enter" && (r(), e.blur());
      });
    }), this.shadowRoot.querySelectorAll(".edit-btn").forEach((e) => {
      e.addEventListener("click", (s) => {
        s.stopPropagation();
        const o = parseInt(e.dataset.rowIndex), i = this.getSortedData()[o];
        this._rowOriginals.set(i, { ...i }), this._editingRows.add(i), this.render();
      });
    }), this.shadowRoot.querySelectorAll(".edit-confirm").forEach((e) => {
      e.addEventListener("click", (s) => {
        s.stopPropagation();
        const o = parseInt(e.dataset.rowIndex), i = this.getSortedData()[o], r = this._rowOriginals.get(i) ?? {}, d = {};
        this.shadowRoot.querySelectorAll(
          `tr[data-row-index="${o}"] input.cell-input`
        ).forEach((h) => {
          const u = h.dataset.key, c = this._columns.find((f) => f.key === u);
          (c == null ? void 0 : c.editable) === "click" && (i[u] = h.value, h.value !== String(r[u] ?? "") && (d[u] = h.value));
        }), this._editingRows.delete(i), this._rowOriginals.delete(i), Object.keys(d).length > 0 && this.dispatchEvent(new CustomEvent("o-row-change", {
          bubbles: !0,
          composed: !0,
          detail: { rowIndex: o, row: i, changes: d }
        })), this.render();
      });
    }), this.shadowRoot.querySelectorAll(".edit-cancel").forEach((e) => {
      e.addEventListener("click", (s) => {
        s.stopPropagation();
        const o = parseInt(e.dataset.rowIndex), i = this.getSortedData()[o], r = this._rowOriginals.get(i);
        r && (Object.assign(i, r), this._rowOriginals.delete(i)), this._editingRows.delete(i), this.render();
      });
    }));
  }
}
customElements.define("o-table", H);
class W extends b {
  constructor() {
    super();
    a(this, "_tags", []);
  }
  static get observedAttributes() {
    return ["variant", "label", "placeholder", "max-length", "value"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  get variant() {
    return this.getAttribute("variant") ?? "textarea";
  }
  render() {
    this.variant === "card" ? this.renderCard() : this.renderTextarea(), this.attachNoteHandlers();
  }
  renderTextarea() {
    const t = this.getAttribute("label") ?? "", e = this.getAttribute("placeholder") ?? " ", s = this.getAttribute("max-length"), o = this.getAttribute("value") ?? "";
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: block;
        }
        .wrap {
          position: relative;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: ${t ? "24px 16px 12px" : "12px 16px"};
          transition: border-color 0.15s;
        }
        .wrap:focus-within { border-color: var(--accent-warm); }
        label {
          position: absolute; top: 8px; left: 16px;
          color: var(--glass-text-muted); font-size: 11px;
          font-family: sans-serif; pointer-events: none;
        }
        textarea {
          display: block; width: 100%;
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden;
        }
        .counter { text-align: right; font-size: 11px; color: var(--glass-text-dim); margin-top: 4px; }
        ${_("textarea")}
      </style>
      <div class="wrap">
        ${t ? `<label>${t}</label>` : ""}
        <textarea placeholder="${e}"${s ? ` maxlength="${s}"` : ""}>${o}</textarea>
      </div>
      ${s ? `<div class="counter"><span class="count">${o.length}</span> / ${s}</div>` : ""}
    `;
  }
  renderCard() {
    const t = this.getAttribute("placeholder") ?? "Write something…";
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: block;
        }
        .card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .title-input {
          background: none; border: none;
          border-bottom: 1px solid var(--glass-border);
          color: var(--glass-text); font-size: 18px; font-weight: 600;
          font-family: sans-serif; outline: none; padding-bottom: 8px; width: 100%;
        }
        .title-input:focus { border-color: var(--accent-warm); }
        .title-input::placeholder { color: var(--glass-text-dim); }
        .body-area {
          background: none; border: none; resize: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden; width: 100%;
        }
        .body-area::placeholder { color: var(--glass-text-dim); }
        .tag-area { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .chip {
          background: var(--accent-warm); border-radius: 999px;
          padding: 2px 10px; font-size: 12px; color: #000; cursor: pointer;
        }
        .tag-input {
          background: none; border: none; color: var(--glass-text);
          font-size: 12px; font-family: sans-serif; outline: none; min-width: 80px;
        }
        .tag-input::placeholder { color: var(--glass-text-dim); }
        ${_(".body-area")}
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" />
        <textarea class="body-area" placeholder="${t}"></textarea>
        <div class="tag-area">
          ${this._tags.map((e, s) => `<span class="chip" data-tag-index="${s}">${e} ×</span>`).join("")}
          <input class="tag-input" placeholder="Add tag…" />
        </div>
      </div>
    `;
  }
  attachNoteHandlers() {
    if (this.variant !== "card") {
      const i = this.shadowRoot.querySelector("textarea"), r = this.shadowRoot.querySelector(".count");
      i == null || i.addEventListener("input", () => {
        i.style.height = "auto", i.style.height = i.scrollHeight + "px", r && (r.textContent = String(i.value.length)), this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: !0,
          composed: !0,
          detail: { value: i.value }
        }));
      });
      return;
    }
    const t = this.shadowRoot.querySelector(".title-input"), e = this.shadowRoot.querySelector(".body-area"), s = this.shadowRoot.querySelector(".tag-input"), o = () => {
      var d, h;
      const i = ((d = this.shadowRoot.querySelector(".title-input")) == null ? void 0 : d.value) ?? "", r = ((h = this.shadowRoot.querySelector(".body-area")) == null ? void 0 : h.value) ?? "";
      this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { title: i, body: r, tags: [...this._tags] }
      }));
    };
    t == null || t.addEventListener("input", o), e == null || e.addEventListener("input", () => {
      e.style.height = "auto", e.style.height = e.scrollHeight + "px", o();
    }), s == null || s.addEventListener("keydown", (i) => {
      i.key === "Enter" && s.value.trim() && (this._tags.push(s.value.trim()), s.value = "", this.render(), o());
    }), this.shadowRoot.querySelectorAll(".chip").forEach((i) => {
      i.addEventListener("click", () => {
        this._tags.splice(parseInt(i.dataset.tagIndex), 1), this.render(), o();
      });
    });
  }
}
customElements.define("o-note", W);
class P extends b {
  constructor() {
    super();
    a(this, "_onKeyDown", null);
    a(this, "_onClick", null);
    a(this, "_rendered", !1);
  }
  static get observedAttributes() {
    return ["open"];
  }
  connectedCallback() {
    this._rendered || (this.render(), this._rendered = !0), this._onKeyDown = (t) => {
      t.key === "Escape" && this.hasAttribute("open") && this.handleCancel();
    }, document.addEventListener("keydown", this._onKeyDown), this._onClick = (t) => {
      const e = t.target;
      (e.getAttribute("type") === "submit" || e.closest('[type="submit"]')) && (t.preventDefault(), this.handleSubmit());
    }, this.addEventListener("click", this._onClick);
  }
  disconnectedCallback() {
    this._onKeyDown && document.removeEventListener("keydown", this._onKeyDown), this._onClick && this.removeEventListener("click", this._onClick);
  }
  attributeChangedCallback(t, e, s) {
    var i;
    if (t !== "open") return;
    const o = (i = this.shadowRoot) == null ? void 0 : i.querySelector(".backdrop");
    o && (s !== null ? o.classList.add("visible") : o.classList.remove("visible"));
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
  }
  handleSubmit() {
    const t = {};
    this.querySelectorAll("input[name],select[name],textarea[name]").forEach((e) => {
      t[e.name] = e.value;
    }), this.querySelectorAll("o-input[name]").forEach((e) => {
      t[e.getAttribute("name")] = e.value ?? "";
    }), this.dispatchEvent(new CustomEvent("o-submit", { bubbles: !0, composed: !0, detail: t })), this.close();
  }
  handleCancel() {
    this.close(), this.dispatchEvent(new CustomEvent("o-cancel", { bubbles: !0, composed: !0, detail: null }));
  }
  render() {
    const t = this.hasAttribute("open");
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: contents;
        }
        .backdrop {
          display: flex;
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          align-items: center; justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
        }
        .backdrop.visible {
          opacity: 1;
          visibility: visible;
        }
        .panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: 24px; min-width: 320px; max-width: 90vw;
          color: var(--glass-text);
        }
        .backdrop.visible .panel {
          animation: scaleIn 0.2s ease-out;
        }
        .panel-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
        .panel-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .panel-actions { display: flex; justify-content: flex-end; gap: 8px; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      </style>
      <div class="backdrop${t ? " visible" : ""}">
        <div class="panel" role="dialog" aria-modal="true">
          <div class="panel-title"><slot name="title"></slot></div>
          <div class="panel-body"><slot></slot></div>
          <div class="panel-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `, this.shadowRoot.querySelector(".backdrop").addEventListener("click", (e) => {
      e.target === e.currentTarget && this.handleCancel();
    });
  }
}
customElements.define("o-dialog", P);
const E = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ"
}, S = {
  success: "#4ade80",
  error: "#f87171",
  warning: "#fbbf24",
  info: "#60a5fa"
};
class K extends b {
  constructor() {
    super();
    a(this, "msgEl");
    a(this, "slotEl");
    a(this, "timer", null);
    a(this, "fallbackTimer", null);
    a(this, "startedAt", 0);
    a(this, "elapsed", 0);
    a(this, "durationMs", 3e3);
    a(this, "onMouseEnter", () => {
      var t, e;
      this.elapsed += Date.now() - this.startedAt, this.clearTimer(), (e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".progress")) == null || e.classList.add("paused");
    });
    a(this, "onMouseLeave", () => {
      var t, e;
      this.startedAt = Date.now(), this.startTimer(Math.max(0, this.durationMs - this.elapsed)), (e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".progress")) == null || e.classList.remove("paused");
    });
  }
  static get observedAttributes() {
    return ["type", "message", "duration"];
  }
  connectedCallback() {
    this.durationMs = parseInt(this.getAttribute("duration") ?? "3000", 10), this.render(), this.updateSlotOrFallback(), this.startTimer(), this.addEventListener("mouseenter", this.onMouseEnter), this.addEventListener("mouseleave", this.onMouseLeave);
  }
  disconnectedCallback() {
    this.clearTimer(), this.removeEventListener("mouseenter", this.onMouseEnter), this.removeEventListener("mouseleave", this.onMouseLeave);
  }
  attributeChangedCallback(t, e, s) {
    this.shadowRoot.firstChild && (t === "type" && this.updateAccent(), t === "message" && this.updateSlotOrFallback());
  }
  render() {
    const t = this.getAttribute("type") ?? "info", e = S[t] ?? S.info;
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: block;
          position: relative;
          min-width: 220px;
          max-width: 360px;
          padding: 10px 36px 10px 14px;
          border-radius: var(--o-toast-radius, 10px);
          background: var(--o-toast-bg, var(--glass-bg));
          border: 1px solid var(--o-toast-border, var(--glass-border));
          backdrop-filter: blur(var(--o-toast-blur, var(--glass-blur)));
          -webkit-backdrop-filter: blur(var(--o-toast-blur, var(--glass-blur)));
          color: var(--o-toast-color, var(--glass-text));
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
      <span class="icon">${E[t] ?? E.info}</span>
      <span id="msg"></span>
      <slot></slot>
      <button class="close" aria-label="Close">✕</button>
      <div class="progress"></div>
    `, this.msgEl = this.shadowRoot.querySelector("#msg"), this.slotEl = this.shadowRoot.querySelector("slot");
    const s = this.shadowRoot.querySelector(".progress");
    s && s.style.setProperty("--_dur", `${this.durationMs}ms`), this.slotEl.addEventListener("slotchange", () => this.updateSlotOrFallback()), this.shadowRoot.querySelector(".close").addEventListener("click", () => this.dismiss()), this.style.setProperty("--_accent", e);
  }
  updateSlotOrFallback() {
    if (!this.msgEl || !this.slotEl) return;
    this.slotEl.assignedNodes({ flatten: !0 }).length > 0 ? this.msgEl.style.display = "none" : (this.msgEl.style.display = "", this.msgEl.textContent = this.getAttribute("message") ?? "");
  }
  updateAccent() {
    const t = this.getAttribute("type") ?? "info", e = S[t] ?? S.info;
    this.style.setProperty("--_accent", e);
    const s = this.shadowRoot.querySelector(".icon");
    s && (s.textContent = E[t] ?? E.info);
  }
  startTimer(t) {
    this.startedAt = Date.now();
    const e = t ?? this.durationMs - this.elapsed;
    this.timer = setTimeout(() => this.dismiss(), e), this.fallbackTimer = setTimeout(() => {
      this.isConnected && this.remove();
    }, e + 600);
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null), this.fallbackTimer !== null && (clearTimeout(this.fallbackTimer), this.fallbackTimer = null);
  }
  dismiss() {
    this.clearTimer(), this.classList.add("exiting"), this.addEventListener("animationend", () => this.remove(), { once: !0 }), setTimeout(() => this.remove(), 400);
  }
}
customElements.define("o-toast", K);
function j() {
  if (!document.getElementById("o-toast-container")) {
    const l = document.createElement("style");
    l.setAttribute("data-owc-toast", ""), l.textContent = `
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
    `, document.head.appendChild(l);
    const n = document.createElement("div");
    n.id = "o-toast-container", document.body.appendChild(n);
  }
  return document.getElementById("o-toast-container");
}
function X(l, n, t) {
  const e = j(), s = document.createElement("o-toast");
  s.setAttribute("type", n), (t == null ? void 0 : t.duration) !== void 0 && s.setAttribute("duration", String(t.duration)), s.innerHTML = l, e.appendChild(s);
}
class m extends b {
  constructor() {
    super(...arguments);
    a(this, "_value", 0);
    a(this, "_timer", null);
    a(this, "_hideTimer", null);
    a(this, "_resetTimer", null);
  }
  static get observedAttributes() {
    return ["value"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, e, s) {
    t === "value" && this.isConnected && this._setValue(Math.min(100, Math.max(0, parseFloat(s) || 0)));
  }
  disconnectedCallback() {
    this._stopAuto(), this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null), this._resetTimer && (clearTimeout(this._resetTimer), this._resetTimer = null);
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          display: block;
          pointer-events: none;
        }
        .bar {
          height: 3px;
          width: 0%;
          background: rgba(74,222,128,0.85);
          box-shadow: 0 0 8px rgba(74,222,128,0.5);
          transition: width 0.2s ease, opacity 0.3s ease;
          opacity: 1;
        }
      </style>
      <div class="bar" style="width:0%"></div>
    `;
  }
  _bar() {
    var t;
    return ((t = this.shadowRoot) == null ? void 0 : t.querySelector(".bar")) ?? null;
  }
  _setValue(t) {
    this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null), this._resetTimer && (clearTimeout(this._resetTimer), this._resetTimer = null), this._value = t;
    const e = this._bar();
    e && (e.style.opacity = "1", e.style.width = `${t}%`, t >= 100 && (this._hideTimer = setTimeout(() => {
      e.style.opacity = "0", this._resetTimer = setTimeout(() => {
        e.style.width = "0%", this._value = 0;
      }, 300);
    }, 400)));
  }
  _stopAuto() {
    this._timer && (clearInterval(this._timer), this._timer = null);
  }
  static start() {
    const t = m._getInstance();
    t._stopAuto(), t._timer = setInterval(() => {
      const e = 90 - t._value;
      if (e <= 0) {
        t._stopAuto();
        return;
      }
      const s = Math.random() * Math.min(e * 0.1, 5) + 0.5;
      t._setValue(Math.min(89, t._value + s));
    }, 300);
  }
  static set(t) {
    m._getInstance()._setValue(Math.min(100, Math.max(0, t)));
  }
  static done() {
    const t = m._getInstance();
    t._stopAuto(), t._setValue(100);
  }
  static _getInstance() {
    let t = document.querySelector("o-progress");
    return t || (t = document.createElement("o-progress"), document.body.appendChild(t)), t;
  }
}
customElements.define("o-progress", m);
function B(...l) {
  if (l.length === 0) return Promise.resolve([]);
  m.start();
  let n = 0;
  const t = l.length, e = () => {
    n++, m.set(Math.round(n / t * 90));
  };
  return Promise.allSettled(
    l.map((s) => s.then((o) => (e(), o), (o) => {
      throw e(), o;
    }))
  ).then((s) => (m.done(), document.dispatchEvent(new CustomEvent("progress-complete", { detail: { results: s } })), s));
}
function $(l) {
  return l.map(
    (n) => typeof n == "string" ? { label: n, value: n.toLowerCase() } : n
  );
}
class F extends b {
  constructor() {
    super();
    a(this, "_options", []);
    a(this, "_value", null);
    a(this, "handleClick", (t) => {
      const s = [...this.shadowRoot.querySelectorAll(".segment")].findIndex((r) => r.contains(t.target));
      if (s === -1) return;
      const o = this._options[s];
      if (!o || o.value === this._value) return;
      const i = this._value;
      this._value = o.value, this.setAttribute("value", o.value), this.updateSelection(), this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: o.value, index: s, prev: i }
      }));
    });
    this.shadowRoot.addEventListener("click", this.handleClick), this.shadowRoot.addEventListener("keydown", (t) => {
      var h;
      const e = t;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const s = this._options.findIndex((u) => u.value === this._value);
      if (s === -1) return;
      const o = e.key === "ArrowRight" ? (s + 1) % this._options.length : (s - 1 + this._options.length) % this._options.length, i = this._options[o];
      if (!i) return;
      const r = this._value;
      this._value = i.value, this.setAttribute("value", i.value), this.updateSelection(), (h = this.shadowRoot.querySelectorAll('[role="tab"]')[o]) == null || h.focus(), this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: i.value, index: o, prev: r }
      }));
    });
  }
  static get observedAttributes() {
    return ["options", "value"];
  }
  get options() {
    return this._options;
  }
  set options(t) {
    var e, s;
    this._options = $(t), this._value && !this._options.find((o) => o.value === this._value) && (this._value = ((e = this._options[0]) == null ? void 0 : e.value) ?? null), this._value || (this._value = ((s = this._options[0]) == null ? void 0 : s.value) ?? null), this.render();
  }
  get value() {
    return this._value ?? "";
  }
  set value(t) {
    this._options.find((e) => e.value === t) && (this._value = t, this.setAttribute("value", t), this.updateSelection());
  }
  connectedCallback() {
    var t;
    if (this._options.length === 0) {
      const e = [...this.querySelectorAll("[value]")];
      e.length > 0 && (this._options = e.map((s) => {
        var o;
        return {
          label: ((o = s.textContent) == null ? void 0 : o.trim()) ?? "",
          value: s.getAttribute("value") ?? ""
        };
      }));
    }
    if (this._options.length === 0) {
      const e = this.getAttribute("options");
      e && (this._options = $(e.split(",").map((s) => s.trim())));
    }
    this._value || (this._value = ((t = this._options[0]) == null ? void 0 : t.value) ?? null), this.render();
  }
  attributeChangedCallback(t, e, s) {
    var o;
    if (t === "options" && s !== null) {
      const i = $(s.split(",").map((r) => r.trim()));
      this._value && !i.find((r) => r.value === this._value) && (this._value = ((o = i[0]) == null ? void 0 : o.value) ?? null), this._options = i, this.render();
    }
    t === "value" && s !== null && this._options.find((i) => i.value === s) && (this._value = s, this.updateSelection());
  }
  updateSelection() {
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector(".container");
    if (!t) {
      this.render();
      return;
    }
    const e = this._options.findIndex((o) => o.value === this._value);
    t.style.setProperty("--idx", String(e >= 0 ? e : 0)), this.shadowRoot.querySelectorAll(".segment").forEach((o, i) => {
      o.classList.toggle("active", i === e);
    });
  }
  render() {
    if (!this.shadowRoot) return;
    const t = this._options.length, e = this._options.findIndex((s) => s.value === this._value);
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: inline-flex; }
        .container {
          display: inline-flex;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 999px;
          padding: 3px;
          position: relative;
          user-select: none;
          --n: ${t};
          --idx: ${e >= 0 ? e : 0};
        }
        .indicator {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / var(--n));
          background: var(--glass-border);
          border-radius: 999px;
          transform: translateX(calc(var(--idx) * 100%));
          transition: transform 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .segment {
          flex: 1;
          min-width: 48px;
          padding: 6px 14px;
          text-align: center;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: 999px;
        }
        .segment.active { font-weight: 600; }
      </style>
      <div class="container" role="tablist">
        ${t > 0 ? '<div class="indicator"></div>' : ""}
        ${this._options.map(
      (s) => `<div class="segment${s.value === this._value ? " active" : ""}" role="tab" aria-selected="${s.value === this._value}" tabindex="${s.value === this._value ? "0" : "-1"}" data-value="${s.value}">${s.label}</div>`
    ).join("")}
      </div>
    `;
  }
}
customElements.define("o-toggle", F);
class N extends b {
  constructor() {
    super();
    a(this, "_input");
    a(this, "_data", []);
    a(this, "_searchKeys", []);
    a(this, "_renderItem", null);
    a(this, "_filterFn", null);
    a(this, "_valueKey", null);
    a(this, "_currentResults", []);
    a(this, "handleInput", () => {
      const t = this._input.value;
      this.dispatchEvent(new CustomEvent("o-input", {
        bubbles: !0,
        composed: !0,
        detail: { query: t }
      }));
      const e = this.filter(t);
      this._currentResults = e, this.dispatchEvent(new CustomEvent("o-results", {
        bubbles: !0,
        composed: !0,
        detail: { query: t, results: e }
      })), this.updateDropdown();
    });
    a(this, "handleDocumentClick", (t) => {
      t.target instanceof Node && !this.contains(t.target) && this.closeDropdown();
    });
    a(this, "handleDropdownClick", (t) => {
      const e = t.target.closest("[data-index]");
      if (!e) return;
      const s = parseInt(e.dataset.index), o = this._currentResults[s];
      if (o === void 0) return;
      const i = this._input.value;
      if (this._valueKey) {
        const r = o[this._valueKey];
        r !== void 0 && (this._input.value = String(r));
      }
      this.closeDropdown(), this.dispatchEvent(new CustomEvent("o-select", {
        bubbles: !0,
        composed: !0,
        detail: { item: o, query: i }
      }));
    });
    this._input = document.createElement("input"), this._input.addEventListener("input", this.handleInput), this.render();
  }
  static get observedAttributes() {
    return ["placeholder", "value-key", "no-dropdown"];
  }
  get placeholder() {
    return this.getAttribute("placeholder") ?? "Search…";
  }
  set placeholder(t) {
    this.setAttribute("placeholder", t);
  }
  get valueKey() {
    return this._valueKey;
  }
  set valueKey(t) {
    this._valueKey = t, this.setAttribute("value-key", t ?? "");
  }
  get noDropdown() {
    return this.hasAttribute("no-dropdown");
  }
  set noDropdown(t) {
    t ? this.setAttribute("no-dropdown", "") : this.removeAttribute("no-dropdown");
  }
  set data(t) {
    this._data = t;
  }
  set searchKeys(t) {
    this._searchKeys = t;
  }
  set renderItem(t) {
    this._renderItem = t;
  }
  set filterFn(t) {
    this._filterFn = t;
  }
  connectedCallback() {
    document.addEventListener("click", this.handleDocumentClick);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick);
  }
  attributeChangedCallback(t, e, s) {
    t === "placeholder" && (this._input.placeholder = s ?? "Search…"), t === "value-key" && (this._valueKey = s, this.updateDropdown()), t === "no-dropdown" && this.updateDropdown();
  }
  filter(t) {
    if (!t) return [];
    if (this._filterFn) return this._data.filter((s) => this._filterFn(t, s));
    if (this._searchKeys.length === 0) return [];
    const e = t.toLowerCase();
    return this._data.filter(
      (s) => this._searchKeys.some(
        (o) => String(s[o] ?? "").toLowerCase().includes(e)
      )
    );
  }
  closeDropdown() {
    const t = this.shadowRoot.querySelector(".dropdown");
    t && (t.style.display = "none");
  }
  updateDropdown() {
    const t = this.shadowRoot.querySelector(".dropdown");
    if (!t) return;
    const e = this._input.value, s = !this.noDropdown && this._renderItem !== null && e.length > 0, o = this.shadowRoot.querySelector(".container");
    if (!s) {
      t.style.display = "none", o && o.setAttribute("aria-expanded", "false");
      return;
    }
    if (t.style.display = "block", o && o.setAttribute("aria-expanded", "true"), this._currentResults.length === 0) {
      t.innerHTML = '<div class="item no-results">No results</div>';
      return;
    }
    t.innerHTML = this._currentResults.map(
      (i, r) => `<div class="item" role="option" data-index="${r}">${this._renderItem(i)}</div>`
    ).join("");
  }
  render() {
    const t = this.shadowRoot;
    t.innerHTML = `
      <style>
        ${p()}
        :host { display: block; position: relative; }
        .container {
          display: flex; align-items: center; gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 999px; padding: 8px 16px;
        }
        .icon { opacity: 0.6; flex-shrink: 0; }
        input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--glass-text); font-size: 14px; font-family: sans-serif;
        }
        input::placeholder { color: var(--glass-text-muted); }
        .dropdown {
          display: none; position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 12px; border: 1px solid var(--glass-border);
          overflow: hidden; z-index: 10;
        }
        .item {
          padding: 8px 14px; color: var(--glass-text);
          font-size: 14px; font-family: sans-serif; cursor: pointer;
        }
        .item:hover { background: var(--glass-hover); }
        .no-results { opacity: 0.5; cursor: default; }
      </style>
      <div class="container" role="combobox" aria-expanded="false" aria-haspopup="listbox">
        <span class="icon">🔍</span>
      </div>
      <div class="dropdown" role="listbox"></div>
    `;
    const e = t.querySelector(".container");
    this._input.placeholder = this.getAttribute("placeholder") ?? "Search…", e.appendChild(this._input), t.querySelector(".dropdown").addEventListener("click", this.handleDropdownClick);
  }
}
customElements.define("o-search", N);
class Y extends b {
  constructor() {
    super(...arguments);
    a(this, "show", () => {
      var t;
      (t = this.shadowRoot.querySelector(".tooltip")) == null || t.classList.add("visible");
    });
    a(this, "hide", () => {
      var t;
      (t = this.shadowRoot.querySelector(".tooltip")) == null || t.classList.remove("visible");
    });
  }
  static get observedAttributes() {
    return ["text", "position"];
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    this.removeEventListener("mouseenter", this.show), this.removeEventListener("mouseleave", this.hide), this.removeEventListener("focusin", this.show), this.removeEventListener("focusout", this.hide);
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  get position() {
    return this.getAttribute("position") ?? "top";
  }
  render() {
    const t = this.getAttribute("text") ?? "", e = this.position;
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { position: relative; display: inline-block; }
        .tooltip {
          position: absolute;
          padding: 6px 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 8px;
          color: var(--glass-text);
          font-size: 12px;
          font-family: sans-serif;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 1000;
        }
        .tooltip.visible { opacity: 1; }
        .top { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .left { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
        .right { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
      </style>
      <slot></slot>
      <div class="tooltip ${e}" role="tooltip">${t}</div>
    `, this.addEventListener("mouseenter", this.show), this.addEventListener("mouseleave", this.hide), this.addEventListener("focusin", this.show), this.addEventListener("focusout", this.hide);
  }
}
customElements.define("o-tooltip", Y);
class V extends b {
  constructor() {
    super();
    a(this, "_options", []);
    a(this, "_focusIndex", -1);
    a(this, "_rendered", !1);
    a(this, "_open", !1);
    a(this, "handleOutsideMousedown", (t) => {
      t.composedPath().includes(this) || this._open && this.close();
    });
    a(this, "handleKeyDown", (t) => {
      var s, o, i;
      if (!this._open) return;
      const e = Array.from(this.shadowRoot.querySelectorAll('[role="menuitem"]'));
      t.key === "ArrowDown" ? (t.preventDefault(), this._focusIndex = Math.min(this._focusIndex + 1, e.length - 1), (s = e[this._focusIndex]) == null || s.focus()) : t.key === "ArrowUp" ? (t.preventDefault(), this._focusIndex = Math.max(this._focusIndex - 1, 0), (o = e[this._focusIndex]) == null || o.focus()) : t.key === "Enter" ? (t.preventDefault(), this._focusIndex >= 0 && ((i = e[this._focusIndex]) == null || i.click())) : t.key === "Escape" && this.close();
    });
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this._options = t, this.renderMenu();
  }
  connectedCallback() {
    this._rendered || (this.render(), this._rendered = !0), document.addEventListener("mousedown", this.handleOutsideMousedown), document.addEventListener("keydown", this.handleKeyDown);
  }
  disconnectedCallback() {
    document.removeEventListener("mousedown", this.handleOutsideMousedown), document.removeEventListener("keydown", this.handleKeyDown);
  }
  toggle() {
    this._open ? this.close() : this.open();
  }
  open() {
    var t, e;
    this._open = !0, this._focusIndex = -1, (e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".menu")) == null || e.classList.add("open");
  }
  close() {
    var t, e;
    this._open = !1, this._focusIndex = -1, (e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".menu")) == null || e.classList.remove("open");
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: inline-block;
          position: relative;
        }
        .trigger {
          cursor: pointer;
        }
        .menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 160px;
          margin-top: 4px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          z-index: 100;
          padding: 4px 0;
        }
        .menu.open {
          display: block;
        }
        .item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          outline: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .item:hover,
        .item:focus {
          background: var(--glass-hover);
        }
        .icon {
          font-size: 16px;
        }
      </style>
      <div class="trigger"><slot></slot></div>
      <div class="menu" role="menu"></div>
    `;
    let t = !1;
    const e = () => {
      t || (t = !0, this.toggle(), requestAnimationFrame(() => {
        t = !1;
      }));
    };
    this.addEventListener("click", e), this.addEventListener("o-click", e), this.renderMenu();
  }
  renderMenu() {
    var e;
    const t = (e = this.shadowRoot) == null ? void 0 : e.querySelector(".menu");
    t && (t.innerHTML = this._options.map((s) => `
      <button
        class="item"
        role="menuitem"
        tabindex="-1"
        data-value="${s.value}"
        data-label="${s.label}"
      >${s.icon ? `<span class="icon">${s.icon}</span>` : ""}<span>${s.label}</span></button>
    `).join(""), t.querySelectorAll('[role="menuitem"]').forEach((s) => {
      s.addEventListener("click", (o) => {
        o.stopPropagation();
        const i = s.dataset.value, r = s.dataset.label;
        this.dispatchEvent(new CustomEvent("o-select", {
          bubbles: !0,
          composed: !0,
          detail: { value: i, label: r }
        })), this.close();
      });
    }));
  }
}
customElements.define("o-dropdown", V);
class G extends b {
  constructor() {
    super();
    a(this, "_value", "");
    a(this, "_initialized", !1);
  }
  connectedCallback() {
    if (this.children.length > 0)
      this.init();
    else {
      const t = new MutationObserver(() => {
        this.querySelectorAll('[slot="tab"]').length > 0 && (t.disconnect(), this.init());
      });
      t.observe(this, { childList: !0 }), requestAnimationFrame(() => {
        this._initialized || (t.disconnect(), this.init());
      });
    }
  }
  init() {
    if (this._initialized) return;
    this._initialized = !0, this.querySelectorAll('[slot="tab"]').forEach((e) => {
      e.style.display = "none";
    });
    const t = Array.from(this.querySelectorAll('[slot="tab"]'));
    !this._value && t.length && (this._value = t[0].dataset.value ?? ""), this.render(), this._updatePanels();
  }
  get value() {
    return this._value;
  }
  set value(t) {
    const e = this._value;
    t !== e && (this._value = t, this._updateTabButtons(), this._updatePanels());
  }
  render() {
    const e = Array.from(this.querySelectorAll('[slot="tab"]')).map((s) => {
      const o = s.dataset.value ?? "", i = o === this._value;
      return `<button role="tab" class="tab${i ? " active" : ""}" data-value="${o}" aria-selected="${i}" tabindex="${i ? "0" : "-1"}">${s.textContent ?? ""}</button>`;
    }).join("");
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; }
        .tablist {
          display: flex;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px 10px 0 0;
          backdrop-filter: blur(var(--glass-blur));
          padding: 4px 4px 0;
          gap: 2px;
        }
        .tab {
          flex: 1;
          background: none;
          border: none;
          border-radius: 7px 7px 0 0;
          color: var(--glass-text-muted);
          font-size: 14px;
          font-family: sans-serif;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .tab:hover { background: var(--glass-hover); color: var(--glass-text); }
        .tab.active {
          background: var(--glass-hover);
          color: var(--glass-text);
          border-bottom: 2px solid var(--accent-warm);
        }
        .panel-area {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-top: none;
          border-radius: 0 0 10px 10px;
          backdrop-filter: blur(var(--glass-blur));
          padding: 16px;
        }
      </style>
      <div class="tablist" role="tablist">${e}</div>
      <div class="panel-area"><slot></slot></div>
    `, this.shadowRoot.querySelector(".tablist").addEventListener("click", (s) => {
      const o = s.target.closest('[role="tab"]');
      if (!o) return;
      const i = o.dataset.value ?? "";
      if (i === this._value) return;
      const r = this._value;
      this._value = i, this._updateTabButtons(), this._updatePanels(), this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: i, prev: r }
      }));
    }), this.shadowRoot.querySelector(".tablist").addEventListener("keydown", (s) => {
      var c;
      const o = s;
      if (o.key !== "ArrowLeft" && o.key !== "ArrowRight") return;
      const r = Array.from(this.querySelectorAll('[slot="tab"]')).map((f) => f.dataset.value ?? ""), d = r.indexOf(this._value);
      if (d === -1) return;
      const h = o.key === "ArrowRight" ? (d + 1) % r.length : (d - 1 + r.length) % r.length, u = this._value;
      this._value = r[h], this._updateTabButtons(), this._updatePanels(), this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this._value, prev: u }
      })), (c = this.shadowRoot.querySelectorAll('[role="tab"]')[h]) == null || c.focus();
    });
  }
  _updateTabButtons() {
    this.shadowRoot.querySelectorAll('[role="tab"]').forEach((t) => {
      const e = t.dataset.value === this._value;
      t.classList.toggle("active", e), t.setAttribute("aria-selected", String(e)), t.tabIndex = e ? 0 : -1;
    });
  }
  _updatePanels() {
    this.querySelectorAll("[data-tab]").forEach((t) => {
      t.style.display = t.dataset.tab === this._value ? "" : "none";
    });
  }
}
customElements.define("o-tabs", G);
class U extends b {
  static get observedAttributes() {
    return ["label", "placeholder", "type", "name", "disabled", "error", "success"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  disconnectedCallback() {
  }
  get value() {
    var n;
    return ((n = this.shadowRoot.querySelector("input")) == null ? void 0 : n.value) ?? this.getAttribute("value") ?? "";
  }
  set value(n) {
    const t = this.shadowRoot.querySelector("input");
    t && (t.value = n);
  }
  render() {
    const n = this.getAttribute("label") ?? "", t = this.getAttribute("placeholder") ?? "", e = this.getAttribute("type") ?? "text", s = this.getAttribute("name") ?? "", o = this.getAttribute("value") ?? "", i = this.hasAttribute("disabled"), r = this.getAttribute("error") ?? "", d = this.hasAttribute("success"), h = r ? "rgba(239,68,68,0.7)" : d ? "rgba(74,222,128,0.7)" : "var(--glass-border)", u = r ? "rgba(239,68,68,0.9)" : "var(--accent-warm)";
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; }
        .wrap { display: flex; flex-direction: column; gap: 4px; }
        label {
          font-size: 11px;
          font-family: sans-serif;
          color: var(--glass-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        input {
          background: var(--glass-bg);
          border: 1px solid ${h};
          border-radius: 10px;
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          backdrop-filter: blur(var(--glass-blur));
          transition: border-color 0.15s;
          opacity: ${i ? "0.5" : "1"};
          cursor: ${i ? "not-allowed" : "text"};
        }
        input:focus { border-color: ${u}; }
        input::placeholder { color: var(--glass-text-dim); }
        .error-msg {
          font-size: 11px;
          color: rgba(239,68,68,0.9);
          font-family: sans-serif;
        }
      </style>
      <div class="wrap">
        ${n ? "<label></label>" : ""}
        <input
          type="${e}"
          name="${s}"
          ${i ? "disabled" : ""}
        />
        ${r ? '<span class="error-msg"></span>' : ""}
      </div>
    `;
    const c = this.shadowRoot.querySelector("input");
    n && (this.shadowRoot.querySelector("label").textContent = n), r && (this.shadowRoot.querySelector(".error-msg").textContent = r), c.placeholder = t, c.value = o, c.style.borderColor = h, c.addEventListener("input", () => {
      this.dispatchEvent(new CustomEvent("o-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: c.value }
      }));
    }), c.addEventListener("blur", () => {
      this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: c.value }
      }));
    });
  }
}
customElements.define("o-input", U);
class J extends b {
  static get observedAttributes() {
    return ["variant", "width", "height", "radius", "rows"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  disconnectedCallback() {
  }
  get variant() {
    return this.getAttribute("variant") ?? "block";
  }
  pulseCSS() {
    return `
      @keyframes o-pulse {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.9; }
      }
      .skel {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--skel-r, 6px);
        animation: o-pulse 1.4s ease-in-out infinite;
        backdrop-filter: blur(var(--glass-blur));
      }
    `;
  }
  render() {
    const n = this.variant;
    n === "table" ? this.renderTable() : n === "panel" ? this.renderPanel() : this.renderBlock();
  }
  renderBlock() {
    const n = this.getAttribute("width") ?? "100%", t = this.getAttribute("height") ?? "1em", e = this.getAttribute("radius") ?? "6px";
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; }
        ${this.pulseCSS()}
      </style>
      <div class="skel" style="width:${n};height:${t};--skel-r:${e}"></div>
    `;
  }
  renderTable() {
    const n = Math.max(1, parseInt(this.getAttribute("rows") ?? "5")), t = ["25%", "30%", "20%", "15%"], e = t.map((o) => `<div class="skel cell" style="width:${o}"></div>`).join(""), s = Array.from(
      { length: n },
      () => t.map((o) => `<div class="skel cell" style="width:${o}"></div>`).join("")
    ).map((o) => `<div class="row">${o}</div>`).join("");
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; }
        ${this.pulseCSS()}
        .table { display: flex; flex-direction: column; gap: 8px; }
        .row {
          display: flex; gap: 12px; align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .header .cell { height: 12px; }
        .cell { height: 14px; }
      </style>
      <div class="table">
        <div class="row header">${e}</div>
        ${s}
      </div>
    `;
  }
  renderPanel() {
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host { display: block; }
        ${this.pulseCSS()}
        .panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          backdrop-filter: blur(var(--glass-blur));
          padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .title { height: 18px; width: 55%; }
        .line  { height: 13px; }
        .short { width: 70%; }
      </style>
      <div class="panel">
        <div class="skel title"></div>
        <div class="skel line"></div>
        <div class="skel line short"></div>
      </div>
    `;
  }
}
customElements.define("o-skeleton", J);
class Q extends b {
  static get observedAttributes() {
    return ["direction"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.isConnected && this.render();
  }
  render() {
    const n = this.getAttribute("direction") || "y", t = n === "x" || n === "both" ? "auto" : "hidden", e = n === "y" || n === "both" ? "auto" : "hidden";
    this.shadowRoot.innerHTML = `
      <style>
        ${p()}
        :host {
          display: block;
        }
        .scroll-area {
          overflow-x: ${t};
          overflow-y: ${e};
          width: 100%;
          height: 100%;
        }
        ${_(".scroll-area")}
      </style>
      <div class="scroll-area"><slot></slot></div>
    `;
  }
}
customElements.define("o-scroll", Q);
typeof window < "u" && (window.toast = X, window.OProgress = m, window.asyncPlus = B);
export {
  M as GLASS_TOKENS,
  D as GLASS_TOKENS_LIGHT,
  b as GlassElement,
  V as ODropdown,
  U as OInput,
  m as OProgress,
  Q as OScroll,
  N as OSearch,
  J as OSkeleton,
  H as OTable,
  G as OTabs,
  F as OToggle,
  Y as OTooltip,
  K as OWCToast,
  B as asyncPlus,
  p as glassBaseStyles,
  _ as glassScrollbarStyles,
  X as toast
};
