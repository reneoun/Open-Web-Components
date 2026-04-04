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
    OToggle: () => OToggle,
    OTable: () => OTable,
    OSearch: () => OSearch
  });

  // src/core.ts
  console.log("Open Web Components (OWC) Core Module Loaded - René Oun");
  var _gridEl = null;
  var _gridFadeOut = null;
  function showSnapGrid(snap, offsetX = 0, offsetY = 0) {
    if (snap < 8)
      return;
    if (_gridFadeOut) {
      clearTimeout(_gridFadeOut);
      _gridFadeOut = null;
    }
    if (!_gridEl) {
      _gridEl = document.createElement("div");
      Object.assign(_gridEl.style, {
        position: "fixed",
        inset: "0",
        pointerEvents: "none",
        zIndex: "9998",
        transition: "opacity 200ms ease",
        opacity: "0"
      });
      document.body.appendChild(_gridEl);
    }
    _gridEl.style.backgroundImage = [
      `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)`,
      `linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`
    ].join(",");
    _gridEl.style.backgroundSize = `${snap}px ${snap}px`;
    _gridEl.style.backgroundPosition = `${offsetX % snap}px ${offsetY % snap}px`;
    _gridEl.offsetHeight;
    _gridEl.style.opacity = "1";
  }
  function hideSnapGrid() {
    if (!_gridEl)
      return;
    _gridEl.style.opacity = "0";
    const el = _gridEl;
    _gridFadeOut = setTimeout(() => {
      el.remove();
      if (_gridEl === el)
        _gridEl = null;
      _gridFadeOut = null;
    }, 220);
  }

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
      return ["move", "snap", "resize"];
    }
    dragStart = null;
    dragOffset = { x: 0, y: 0 };
    resizeStart = null;
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    get snapSize() {
      const v = parseInt(this.getAttribute("snap") ?? "1");
      return isNaN(v) || v < 1 ? 1 : v;
    }
    snapTo(v) {
      const s = this.snapSize;
      return Math.round(v / s) * s;
    }
    render() {
      const hasDrag = this.hasAttribute("move");
      const hasResize = this.hasAttribute("resize");
      const prev = this.shadowRoot.querySelector(".panel");
      const savedW = prev?.style.width ?? "";
      const savedH = prev?.style.height ?? "";
      this.shadowRoot.innerHTML = `
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
                ${hasDrag ? '<button class="move-handle" title="Drag to move">⠿</button>' : ""}
                <slot></slot>
                ${hasResize ? `
                    <div class="resize-e"  data-edge="e"></div>
                    <div class="resize-s"  data-edge="s"></div>
                    <div class="resize-se" data-edge="se"></div>
                ` : ""}
            </div>
        `;
      const panel = this.shadowRoot.querySelector(".panel");
      if (savedW)
        panel.style.width = savedW;
      if (savedH)
        panel.style.height = savedH;
      if (this.dragOffset.x || this.dragOffset.y)
        this.style.transform = `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)`;
      if (hasDrag) {
        this.shadowRoot.querySelector(".move-handle").addEventListener("mousedown", this.onDragStart);
      }
      if (hasResize) {
        this.shadowRoot.querySelectorAll("[data-edge]").forEach((el) => el.addEventListener("mousedown", this.onResizeStart));
      }
    }
    onDragStart = (e) => {
      e.preventDefault();
      e.currentTarget.style.cursor = "grabbing";
      this.dragStart = { x: e.screenX - this.dragOffset.x, y: e.screenY - this.dragOffset.y };
      const r = this.shadowRoot.querySelector(".panel").getBoundingClientRect();
      showSnapGrid(this.snapSize, r.left, r.top);
      document.addEventListener("mousemove", this.onDragMove);
      document.addEventListener("mouseup", this.onDragEnd);
    };
    onDragMove = (e) => {
      if (!this.dragStart)
        return;
      const x = this.snapTo(e.screenX - this.dragStart.x);
      const y = this.snapTo(e.screenY - this.dragStart.y);
      this.dragOffset = { x, y };
      this.style.transform = `translate(${x}px, ${y}px)`;
    };
    onDragEnd = () => {
      this.dragStart = null;
      const handle = this.shadowRoot.querySelector(".move-handle");
      if (handle)
        handle.style.cursor = "grab";
      hideSnapGrid();
      document.removeEventListener("mousemove", this.onDragMove);
      document.removeEventListener("mouseup", this.onDragEnd);
    };
    onResizeStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const panel = this.shadowRoot.querySelector(".panel");
      this.resizeStart = {
        x: e.screenX,
        y: e.screenY,
        w: panel.offsetWidth,
        h: panel.offsetHeight,
        edge: e.currentTarget.dataset.edge
      };
      const r = this.shadowRoot.querySelector(".panel").getBoundingClientRect();
      showSnapGrid(this.snapSize, r.left, r.top);
      document.addEventListener("mousemove", this.onResizeMove);
      document.addEventListener("mouseup", this.onResizeEnd);
    };
    onResizeMove = (e) => {
      if (!this.resizeStart)
        return;
      const panel = this.shadowRoot.querySelector(".panel");
      const dx = e.screenX - this.resizeStart.x;
      const dy = e.screenY - this.resizeStart.y;
      const { edge, w, h } = this.resizeStart;
      if (edge === "e" || edge === "se")
        panel.style.width = `${Math.max(120, this.snapTo(w + dx))}px`;
      if (edge === "s" || edge === "se")
        panel.style.height = `${Math.max(40, this.snapTo(h + dy))}px`;
    };
    onResizeEnd = () => {
      this.resizeStart = null;
      hideSnapGrid();
      document.removeEventListener("mousemove", this.onResizeMove);
      document.removeEventListener("mouseup", this.onResizeEnd);
    };
  }
  customElements.define("o-panel", OWCPanel);
  customElements.define("o-button", OWCButton);

  // src/table.ts
  class OTable extends HTMLElement {
    static get observedAttributes() {
      return ["storage", "storage-key", "resize-mode", "selectable", "editable"];
    }
    _columns = [];
    _data = [];
    _sortCol = null;
    _sortDir = "none";
    _selectedRows = new Set;
    _editingRows = new Set;
    _rowOriginals = new Map;
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
      this._selectedRows.clear();
      this._editingRows.clear();
      this._rowOriginals.clear();
      this.render();
    }
    get selected() {
      return this._data.filter((row) => this._selectedRows.has(row));
    }
    get selectable() {
      return this.hasAttribute("selectable");
    }
    get editable() {
      return this.hasAttribute("editable");
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.restoreState();
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
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
          border-collapse: collapse;
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
        tbody tr.selected td { background: rgba(255,255,255,0.12); }
        input[type="checkbox"] {
          width: 15px; height: 15px; cursor: pointer;
          accent-color: rgba(255,255,255,0.9);
        }
        .cell-input {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(251,191,36,0.5);
          border-radius: 4px;
          color: #fff;
          padding: 4px 8px;
          font-size: 13px;
          width: calc(100% - 4px);
          outline: none;
          font-family: sans-serif;
        }
        .cell-input:focus { border-color: rgba(251,191,36,0.9); background: rgba(255,255,255,0.15); }
        .edit-actions { width: 72px; text-align: center; padding: 6px 4px; }
        .edit-btn, .edit-confirm, .edit-cancel {
          background: none; border: none; cursor: pointer;
          font-size: 13px; padding: 2px 4px; opacity: 0.7; color: #fff; border-radius: 3px;
        }
        .edit-btn:hover, .edit-confirm:hover, .edit-cancel:hover { opacity: 1; }
        .edit-confirm { color: rgba(74,222,128,0.9); }
        .edit-cancel { color: rgba(248,113,113,0.9); }
      </style>
      ${(() => {
        const hasClickEditable = this._columns.some((c) => c.editable === "click");
        const editTh = this.editable && hasClickEditable ? '<th style="width:72px"></th>' : "";
        return `<table>
        <thead><tr>
          ${this.selectable ? `<th style="width:36px"><input type="checkbox" data-select-all></th>` : ""}
          ${this._columns.map((c) => this.renderTh(c)).join("")}
          ${editTh}
        </tr></thead>
        <tbody>${this.getSortedData().map((row, i) => this.renderRow(row, i, hasClickEditable)).join("")}</tbody>
      </table>`;
      })()}
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
    renderRow(row, rowIndex, hasClickEditable) {
      const checked = this._selectedRows.has(row) ? " checked" : "";
      const selectedClass = this._selectedRows.has(row) ? ' class="selected"' : "";
      const checkbox = this.selectable ? `<td><input type="checkbox" data-select-row${checked}></td>` : "";
      const isEditing = this._editingRows.has(row);
      let editTd = "";
      if (this.editable && hasClickEditable) {
        editTd = isEditing ? `<td class="edit-actions">
            <button class="edit-confirm" data-row-index="${rowIndex}" title="Confirm">✓</button>
            <button class="edit-cancel" data-row-index="${rowIndex}" title="Cancel">✗</button>
           </td>` : `<td class="edit-actions">
            <button class="edit-btn" data-row-index="${rowIndex}" title="Edit">✏️</button>
           </td>`;
      }
      const cells = this._columns.map((c) => {
        if (this.editable && c.editable && (c.editable === "always" || isEditing)) {
          const val = String(row[c.key] ?? "").replace(/"/g, "&quot;");
          return `<td><input class="cell-input" data-key="${c.key}" data-row-index="${rowIndex}" value="${val}" /></td>`;
        }
        return `<td>${row[c.key] ?? ""}</td>`;
      }).join("");
      return `<tr${selectedClass} data-row-index="${rowIndex}">${checkbox}${cells}${editTd}</tr>`;
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
        handle.addEventListener("click", (e) => e.stopPropagation());
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
            const offset = this.selectable ? 1 : 0;
            this.shadowRoot.querySelectorAll("th").forEach((t, i) => {
              const colIdx2 = i - offset;
              if (colIdx2 < 0 || colIdx2 >= this._columns.length)
                return;
              const w = parseInt(t.style.width) || t.offsetWidth;
              if (w)
                this._columns[colIdx2] = { ...this._columns[colIdx2], width: w };
            });
            this.persistState();
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
      });
      if (this.selectable) {
        this.shadowRoot.querySelectorAll("tbody [data-select-row]").forEach((cb, i) => {
          const row = this.getSortedData()[i];
          cb.addEventListener("click", (e) => {
            e.stopPropagation();
            if (this._selectedRows.has(row)) {
              this._selectedRows.delete(row);
            } else {
              this._selectedRows.add(row);
            }
            this.dispatchEvent(new CustomEvent("o-row-select", {
              bubbles: true,
              composed: true,
              detail: { selected: this.selected }
            }));
            this.render();
          });
        });
        const headerCb = this.shadowRoot.querySelector("[data-select-all]");
        if (headerCb) {
          headerCb.addEventListener("click", (e) => {
            e.stopPropagation();
            const allSelected = this.getSortedData().every((row) => this._selectedRows.has(row));
            if (allSelected) {
              this._selectedRows.clear();
            } else {
              this.getSortedData().forEach((row) => this._selectedRows.add(row));
            }
            this.dispatchEvent(new CustomEvent("o-row-select", {
              bubbles: true,
              composed: true,
              detail: { selected: this.selected }
            }));
            this.render();
          });
        }
      }
      if (this.editable) {
        this.shadowRoot.querySelectorAll("input.cell-input").forEach((input) => {
          const key = input.dataset.key;
          const rowIndex = parseInt(input.dataset.rowIndex);
          const col = this._columns.find((c) => c.key === key);
          if (col?.editable !== "always")
            return;
          const commit = () => {
            const row = this.getSortedData()[rowIndex];
            if (!row)
              return;
            const oldVal = String(row[key] ?? "");
            const newVal = input.value;
            if (newVal !== oldVal) {
              row[key] = newVal;
              this.dispatchEvent(new CustomEvent("o-cell-change", {
                bubbles: true,
                composed: true,
                detail: { key, value: newVal, rowIndex, row }
              }));
            }
          };
          input.addEventListener("blur", commit);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              commit();
              input.blur();
            }
          });
        });
        this.shadowRoot.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            this._rowOriginals.set(row, { ...row });
            this._editingRows.add(row);
            this.render();
          });
        });
        this.shadowRoot.querySelectorAll(".edit-confirm").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            const original = this._rowOriginals.get(row) ?? {};
            const changes = {};
            this.shadowRoot.querySelectorAll(`tr[data-row-index="${rowIndex}"] input.cell-input`).forEach((input) => {
              const k = input.dataset.key;
              const col = this._columns.find((c) => c.key === k);
              if (col?.editable === "click") {
                row[k] = input.value;
                if (input.value !== String(original[k] ?? ""))
                  changes[k] = input.value;
              }
            });
            this._editingRows.delete(row);
            this._rowOriginals.delete(row);
            if (Object.keys(changes).length > 0) {
              this.dispatchEvent(new CustomEvent("o-row-change", {
                bubbles: true,
                composed: true,
                detail: { rowIndex, row, changes }
              }));
            }
            this.render();
          });
        });
        this.shadowRoot.querySelectorAll(".edit-cancel").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rowIndex = parseInt(btn.dataset.rowIndex);
            const row = this.getSortedData()[rowIndex];
            const original = this._rowOriginals.get(row);
            if (original) {
              Object.assign(row, original);
              this._rowOriginals.delete(row);
            }
            this._editingRows.delete(row);
            this.render();
          });
        });
      }
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

  // src/toggle.ts
  function toOptions(input) {
    return input.map((o) => typeof o === "string" ? { label: o, value: o.toLowerCase() } : o);
  }

  class OToggle extends HTMLElement {
    static get observedAttributes() {
      return ["options", "value"];
    }
    _options = [];
    _value = null;
    get options() {
      return this._options;
    }
    set options(v) {
      this._options = toOptions(v);
      if (this._value && !this._options.find((o) => o.value === this._value)) {
        this._value = this._options[0]?.value ?? null;
      }
      if (!this._value)
        this._value = this._options[0]?.value ?? null;
      this.render();
    }
    get value() {
      return this._value ?? "";
    }
    set value(v) {
      if (!this._options.find((o) => o.value === v))
        return;
      this._value = v;
      this.setAttribute("value", v);
      this.updateSelection();
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", this.handleClick);
    }
    connectedCallback() {
      if (this._options.length === 0) {
        const children = [...this.querySelectorAll("[value]")];
        if (children.length > 0) {
          this._options = children.map((c) => ({
            label: c.textContent?.trim() ?? "",
            value: c.getAttribute("value") ?? ""
          }));
        }
      }
      if (this._options.length === 0) {
        const attr = this.getAttribute("options");
        if (attr)
          this._options = toOptions(attr.split(",").map((s) => s.trim()));
      }
      if (!this._value)
        this._value = this._options[0]?.value ?? null;
      this.render();
    }
    attributeChangedCallback(name, _old, val) {
      if (name === "options" && val !== null) {
        const parsed = toOptions(val.split(",").map((s) => s.trim()));
        if (this._value && !parsed.find((o) => o.value === this._value)) {
          this._value = parsed[0]?.value ?? null;
        }
        this._options = parsed;
        this.render();
      }
      if (name === "value" && val !== null) {
        if (this._options.find((o) => o.value === val)) {
          this._value = val;
          this.updateSelection();
        }
      }
    }
    handleClick = (e) => {
      const segments = [...this.shadowRoot.querySelectorAll(".segment")];
      const idx = segments.findIndex((s) => s.contains(e.target));
      if (idx === -1)
        return;
      const opt = this._options[idx];
      if (!opt || opt.value === this._value)
        return;
      const prev = this._value;
      this._value = opt.value;
      this.setAttribute("value", opt.value);
      this.updateSelection();
      this.dispatchEvent(new CustomEvent("o-change", {
        bubbles: true,
        composed: true,
        detail: { value: opt.value, index: idx, prev }
      }));
    };
    updateSelection() {
      const container = this.shadowRoot?.querySelector(".container");
      if (!container) {
        this.render();
        return;
      }
      const idx = this._options.findIndex((o) => o.value === this._value);
      container.style.setProperty("--idx", String(idx >= 0 ? idx : 0));
      this.shadowRoot.querySelectorAll(".segment").forEach((s, i) => {
        s.classList.toggle("active", i === idx);
      });
    }
    render() {
      if (!this.shadowRoot)
        return;
      const n = this._options.length;
      const idx = this._options.findIndex((o) => o.value === this._value);
      this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        .container {
          display: inline-flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 999px;
          padding: 3px;
          position: relative;
          user-select: none;
          --n: ${n};
          --idx: ${idx >= 0 ? idx : 0};
        }
        .indicator {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / var(--n));
          background: rgba(255,255,255,0.25);
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
          color: #fff;
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          position: relative;
          z-index: 1;
          border-radius: 999px;
        }
        .segment.active { font-weight: 600; }
      </style>
      <div class="container">
        ${n > 0 ? '<div class="indicator"></div>' : ""}
        ${this._options.map((o) => `<div class="segment${o.value === this._value ? " active" : ""}" data-value="${o.value}">${o.label}</div>`).join("")}
      </div>
    `;
    }
  }
  customElements.define("o-toggle", OToggle);

  // src/search.ts
  class OSearch extends HTMLElement {
    static get observedAttributes() {
      return ["placeholder", "value-key", "no-dropdown"];
    }
    _input;
    _data = [];
    _searchKeys = [];
    _renderItem = null;
    _filterFn = null;
    _valueKey = null;
    _currentResults = [];
    get placeholder() {
      return this.getAttribute("placeholder") ?? "Search…";
    }
    set placeholder(v) {
      this.setAttribute("placeholder", v);
    }
    get valueKey() {
      return this._valueKey;
    }
    set valueKey(v) {
      this._valueKey = v;
      this.setAttribute("value-key", v ?? "");
    }
    get noDropdown() {
      return this.hasAttribute("no-dropdown");
    }
    set noDropdown(v) {
      v ? this.setAttribute("no-dropdown", "") : this.removeAttribute("no-dropdown");
    }
    set data(v) {
      this._data = v;
    }
    set searchKeys(v) {
      this._searchKeys = v;
    }
    set renderItem(fn) {
      this._renderItem = fn;
    }
    set filterFn(fn) {
      this._filterFn = fn;
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._input = document.createElement("input");
      this._input.addEventListener("input", this.handleInput);
      this.render();
    }
    connectedCallback() {
      document.addEventListener("click", this.handleDocumentClick);
    }
    disconnectedCallback() {
      document.removeEventListener("click", this.handleDocumentClick);
    }
    attributeChangedCallback(name, _old, val) {
      if (name === "placeholder") {
        this._input.placeholder = val ?? "Search…";
      }
      if (name === "value-key") {
        this._valueKey = val;
        this.updateDropdown();
      }
      if (name === "no-dropdown") {
        this.updateDropdown();
      }
    }
    handleInput = () => {
      const query = this._input.value;
      this.dispatchEvent(new CustomEvent("o-input", {
        bubbles: true,
        composed: true,
        detail: { query }
      }));
      const results = this.filter(query);
      this._currentResults = results;
      this.dispatchEvent(new CustomEvent("o-results", {
        bubbles: true,
        composed: true,
        detail: { query, results }
      }));
      this.updateDropdown();
    };
    filter(query) {
      if (!query)
        return [];
      if (this._filterFn)
        return this._data.filter((item) => this._filterFn(query, item));
      if (this._searchKeys.length === 0)
        return [];
      const q = query.toLowerCase();
      return this._data.filter((item) => this._searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q)));
    }
    handleDocumentClick = (e) => {
      if (e.target instanceof Node && !this.contains(e.target)) {
        this.closeDropdown();
      }
    };
    closeDropdown() {
      const dropdown = this.shadowRoot.querySelector(".dropdown");
      if (dropdown)
        dropdown.style.display = "none";
    }
    updateDropdown() {
      const dropdown = this.shadowRoot.querySelector(".dropdown");
      if (!dropdown)
        return;
      const query = this._input.value;
      const show = !this.noDropdown && this._renderItem !== null && query.length > 0;
      if (!show) {
        dropdown.style.display = "none";
        return;
      }
      dropdown.style.display = "block";
      if (this._currentResults.length === 0) {
        dropdown.innerHTML = `<div class="item no-results">No results</div>`;
        return;
      }
      dropdown.innerHTML = this._currentResults.map((item, i) => `<div class="item" data-index="${i}">${this._renderItem(item)}</div>`).join("");
    }
    handleDropdownClick = (e) => {
      const item = e.target.closest("[data-index]");
      if (!item)
        return;
      const idx = parseInt(item.dataset.index);
      const selected = this._currentResults[idx];
      if (selected === undefined)
        return;
      const query = this._input.value;
      if (this._valueKey) {
        const val = selected[this._valueKey];
        if (val !== undefined)
          this._input.value = String(val);
      }
      this.closeDropdown();
      this.dispatchEvent(new CustomEvent("o-select", {
        bubbles: true,
        composed: true,
        detail: { item: selected, query }
      }));
    };
    render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = `
      <style>
        :host { display: block; position: relative; }
        .container {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-radius: 999px; padding: 8px 16px;
        }
        .icon { opacity: 0.6; flex-shrink: 0; }
        input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
        }
        input::placeholder { color: rgba(255,255,255,0.4); }
        .dropdown {
          display: none; position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
          overflow: hidden; z-index: 10;
        }
        .item {
          padding: 8px 14px; color: #fff;
          font-size: 14px; font-family: sans-serif; cursor: pointer;
        }
        .item:hover { background: rgba(255,255,255,0.1); }
        .no-results { opacity: 0.5; cursor: default; }
      </style>
      <div class="container">
        <span class="icon">\uD83D\uDD0D</span>
      </div>
      <div class="dropdown"></div>
    `;
      const container = shadow.querySelector(".container");
      this._input.placeholder = this.getAttribute("placeholder") ?? "Search…";
      container.appendChild(this._input);
      shadow.querySelector(".dropdown").addEventListener("click", this.handleDropdownClick);
    }
  }
  customElements.define("o-search", OSearch);

  // src/note.ts
  class ONote extends HTMLElement {
    static get observedAttributes() {
      return ["variant", "label", "placeholder", "max-length", "value"];
    }
    _tags = [];
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.isConnected)
        this.render();
    }
    get variant() {
      return this.getAttribute("variant") ?? "textarea";
    }
    render() {
      if (this.variant === "card")
        this.renderCard();
      else
        this.renderTextarea();
      this.attachNoteHandlers();
    }
    renderTextarea() {
      const label = this.getAttribute("label") ?? "";
      const placeholder = this.getAttribute("placeholder") ?? " ";
      const maxLen = this.getAttribute("max-length");
      const value = this.getAttribute("value") ?? "";
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
          display: block;
        }
        .wrap {
          position: relative;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          padding: ${label ? "24px 16px 12px" : "12px 16px"};
          transition: border-color 0.15s;
        }
        .wrap:focus-within { border-color: var(--accent-warm); }
        label {
          position: absolute; top: 8px; left: 16px;
          color: rgba(255,255,255,0.5); font-size: 11px;
          font-family: sans-serif; pointer-events: none;
        }
        textarea {
          display: block; width: 100%;
          background: none; border: none; resize: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden;
        }
        .counter { text-align: right; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; }
      </style>
      <div class="wrap">
        ${label ? `<label>${label}</label>` : ""}
        <textarea placeholder="${placeholder}"${maxLen ? ` maxlength="${maxLen}"` : ""}>${value}</textarea>
      </div>
      ${maxLen ? `<div class="counter"><span class="count">${value.length}</span> / ${maxLen}</div>` : ""}
    `;
    }
    renderCard() {
      const placeholder = this.getAttribute("placeholder") ?? "Write something…";
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
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
          border-bottom: 1px solid rgba(255,255,255,0.15);
          color: #fff; font-size: 18px; font-weight: 600;
          font-family: sans-serif; outline: none; padding-bottom: 8px; width: 100%;
        }
        .title-input:focus { border-color: var(--accent-warm); }
        .title-input::placeholder { color: rgba(255,255,255,0.3); }
        .body-area {
          background: none; border: none; resize: none; outline: none;
          color: #fff; font-size: 14px; font-family: sans-serif;
          min-height: 80px; overflow: hidden; width: 100%;
        }
        .body-area::placeholder { color: rgba(255,255,255,0.3); }
        .tag-area { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .chip {
          background: var(--accent-warm); border-radius: 999px;
          padding: 2px 10px; font-size: 12px; color: #000; cursor: pointer;
        }
        .tag-input {
          background: none; border: none; color: #fff;
          font-size: 12px; font-family: sans-serif; outline: none; min-width: 80px;
        }
        .tag-input::placeholder { color: rgba(255,255,255,0.3); }
      </style>
      <div class="card">
        <input class="title-input" placeholder="Title" />
        <textarea class="body-area" placeholder="${placeholder}"></textarea>
        <div class="tag-area">
          ${this._tags.map((t, i) => `<span class="chip" data-tag-index="${i}">${t} ×</span>`).join("")}
          <input class="tag-input" placeholder="Add tag…" />
        </div>
      </div>
    `;
    }
    attachNoteHandlers() {
      if (this.variant !== "card") {
        const ta = this.shadowRoot.querySelector("textarea");
        const count = this.shadowRoot.querySelector(".count");
        ta?.addEventListener("input", () => {
          ta.style.height = "auto";
          ta.style.height = ta.scrollHeight + "px";
          if (count)
            count.textContent = String(ta.value.length);
          this.dispatchEvent(new CustomEvent("o-change", {
            bubbles: true,
            composed: true,
            detail: { value: ta.value }
          }));
        });
        return;
      }
      const titleInput = this.shadowRoot.querySelector(".title-input");
      const bodyArea = this.shadowRoot.querySelector(".body-area");
      const tagInput = this.shadowRoot.querySelector(".tag-input");
      const fireChange = () => {
        const title = this.shadowRoot.querySelector(".title-input")?.value ?? "";
        const body = this.shadowRoot.querySelector(".body-area")?.value ?? "";
        this.dispatchEvent(new CustomEvent("o-change", {
          bubbles: true,
          composed: true,
          detail: { title, body, tags: [...this._tags] }
        }));
      };
      titleInput?.addEventListener("input", fireChange);
      bodyArea?.addEventListener("input", () => {
        bodyArea.style.height = "auto";
        bodyArea.style.height = bodyArea.scrollHeight + "px";
        fireChange();
      });
      tagInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && tagInput.value.trim()) {
          this._tags.push(tagInput.value.trim());
          tagInput.value = "";
          this.render();
          fireChange();
        }
      });
      this.shadowRoot.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          this._tags.splice(parseInt(chip.dataset.tagIndex), 1);
          this.render();
          fireChange();
        });
      });
    }
  }
  customElements.define("o-note", ONote);

  // src/dialog.ts
  class ODialog extends HTMLElement {
    static get observedAttributes() {
      return ["open"];
    }
    _onKeyDown = null;
    _onClick = null;
    _rendered = false;
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      if (!this._rendered) {
        this.render();
        this._rendered = true;
      }
      this._onKeyDown = (e) => {
        if (e.key === "Escape" && this.hasAttribute("open")) {
          this.handleCancel();
        }
      };
      document.addEventListener("keydown", this._onKeyDown);
      this._onClick = (e) => {
        const target = e.target;
        if (target.getAttribute("type") === "submit" || target.closest('[type="submit"]')) {
          e.preventDefault();
          this.handleSubmit();
        }
      };
      this.addEventListener("click", this._onClick);
    }
    disconnectedCallback() {
      if (this._onKeyDown)
        document.removeEventListener("keydown", this._onKeyDown);
      if (this._onClick)
        this.removeEventListener("click", this._onClick);
    }
    attributeChangedCallback(name, _old, _new) {
      if (name !== "open")
        return;
      const backdrop = this.shadowRoot?.querySelector(".backdrop");
      if (!backdrop)
        return;
      if (_new !== null)
        backdrop.classList.add("visible");
      else
        backdrop.classList.remove("visible");
    }
    open() {
      this.setAttribute("open", "");
    }
    close() {
      this.removeAttribute("open");
    }
    handleSubmit() {
      const detail = {};
      this.querySelectorAll("input[name],select[name],textarea[name]").forEach((input) => {
        detail[input.name] = input.value;
      });
      this.dispatchEvent(new CustomEvent("o-submit", { bubbles: true, composed: true, detail }));
      this.close();
    }
    handleCancel() {
      this.close();
      this.dispatchEvent(new CustomEvent("o-cancel", { bubbles: true, composed: true, detail: null }));
    }
    render() {
      const isOpen = this.hasAttribute("open");
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --glass-bg: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.12);
          --glass-blur: 12px;
          --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
          --accent-warm: rgba(251,191,36,0.6);
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
          color: #fff;
        }
        .backdrop.visible .panel {
          animation: scaleIn 0.2s ease-out;
        }
        .panel-title { font-size: 18px; font-weight: 600; margin: 0 0 16px; }
        .panel-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .panel-actions { display: flex; justify-content: flex-end; gap: 8px; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      </style>
      <div class="backdrop${isOpen ? " visible" : ""}">
        <div class="panel">
          <div class="panel-title"><slot name="title"></slot></div>
          <div class="panel-body"><slot></slot></div>
          <div class="panel-actions"><slot name="actions"></slot></div>
        </div>
      </div>
    `;
      this.shadowRoot.querySelector(".backdrop").addEventListener("click", (e) => {
        if (e.target === e.currentTarget)
          this.handleCancel();
      });
    }
  }
  customElements.define("o-dialog", ODialog);

  // src/index.ts
  if (typeof window !== "undefined") {
    window.toast = toast;
  }
})();
