// o-tree — a collapsible tree.
//
// Accepts either a nested `.data` array or declarative <o-tree-node> markup.
// Either way the whole tree renders inside o-tree's own shadow root, and
// <o-tree-node> is config rather than a renderer — like <option> inside a
// <select>. That is an accessibility decision, not a stylistic one: a
// role="tree" whose treeitems each live in a separate shadow root does not
// form a valid accessibility tree, because the structure the screen reader
// walks is broken at every boundary. Rendering in one root keeps
// tree > treeitem > group intact.
//
// Keyboard follows the WAI-ARIA tree pattern, including roving tabindex: the
// tree is one tab stop, and arrows move within it.

import { GlassElement, glassBaseStyles } from './glass';

export interface TreeNodeData {
  label: string;
  children?: TreeNodeData[];
  open?: boolean;
  icon?: string;
  value?: unknown;
}

export interface OTreeSelectDetail { node: TreeNodeData; path: number[]; label: string }
export interface OTreeToggleDetail { node: TreeNodeData; path: number[]; open: boolean }

/** Declarative config node. Renders nothing itself. */
export class OTreeNode extends HTMLElement {
  static get observedAttributes() { return ['label', 'open', 'icon'] }
  attributeChangedCallback() { this.closest('o-tree')?.dispatchEvent(new CustomEvent('o-tree-config')) }
}

const key = (p: number[]) => p.join('.');

export class OTree extends GlassElement {
  static get observedAttributes() { return ['selectable', 'label', 'lines'] }

  private _data: TreeNodeData[] | null = null;
  private _open = new Set<string>();
  private _seeded = false;
  private _selected: string | null = null;
  private _focus: string | null = null;

  get selectable() { return this.hasAttribute('selectable') }
  set selectable(v: boolean) { v ? this.setAttribute('selectable', '') : this.removeAttribute('selectable') }

  get lines() { return !this.hasAttribute('no-lines') }

  get data(): TreeNodeData[] { return this._data ?? this.fromMarkup() }
  set data(v: TreeNodeData[]) { this._data = Array.isArray(v) ? v : []; this._seeded = false; this.render() }

  /** Read declarative <o-tree-node> children into the same shape as .data. */
  private fromMarkup(): TreeNodeData[] {
    const walk = (parent: Element): TreeNodeData[] =>
      Array.from(parent.children)
        .filter(c => c.tagName === 'O-TREE-NODE')
        .map(c => {
          const kids = walk(c);
          return {
            label: c.getAttribute('label') ?? c.textContent?.trim() ?? '',
            icon: c.getAttribute('icon') ?? undefined,
            open: c.hasAttribute('open'),
            ...(kids.length ? { children: kids } : {}),
          };
        });
    return walk(this);
  }

  private _mo: MutationObserver | null = null;

  connectedCallback() {
    this.addEventListener('o-tree-config', () => this.render());
    this.render();
    // Declarative <o-tree-node> children are not necessarily parsed and
    // upgraded by the time the host connects, so the first render can see an
    // empty light DOM. Re-read once the current task drains, and keep watching
    // so markup edited later is picked up too.
    queueMicrotask(() => { if (!this._data) this.render() });
    if (typeof MutationObserver !== 'undefined') {
      this._mo = new MutationObserver(() => { if (!this._data) this.render() });
      this._mo.observe(this, { childList: true, subtree: true, attributes: true });
    }
  }

  disconnectedCallback() { this._mo?.disconnect(); this._mo = null }

  attributeChangedCallback() { this.render() }

  /** Seed open state once from `open` flags in the source data. */
  private seed(nodes: TreeNodeData[], path: number[] = []) {
    nodes.forEach((n, i) => {
      const p = [...path, i];
      if (n.open) this._open.add(key(p));
      if (n.children) this.seed(n.children, p);
    });
  }

  private allBranches(nodes: TreeNodeData[], path: number[] = [], out: string[] = []): string[] {
    nodes.forEach((n, i) => {
      const p = [...path, i];
      if (n.children?.length) { out.push(key(p)); this.allBranches(n.children, p, out) }
    });
    return out;
  }

  expandAll() { this.allBranches(this.data).forEach(k => this._open.add(k)); this.render() }
  collapseAll() { this._open.clear(); this.render() }

  toggle(path: number[], force?: boolean) {
    const k = key(path);
    const next = force === undefined ? !this._open.has(k) : force;
    next ? this._open.add(k) : this._open.delete(k);
    const node = this.nodeAt(path);
    if (node) this.dispatchEvent(new CustomEvent<OTreeToggleDetail>('o-tree-toggle', {
      bubbles: true, composed: true, detail: { node, path, open: next },
    }));
    this.render();
  }

  private nodeAt(path: number[]): TreeNodeData | null {
    let list = this.data, n: TreeNodeData | undefined;
    for (const i of path) { n = list?.[i]; if (!n) return null; list = n.children ?? [] }
    return n ?? null;
  }

  /** Flattened list of currently visible rows — the keyboard walks this. */
  private visible(nodes = this.data, path: number[] = [], out: { path: number[]; node: TreeNodeData }[] = []) {
    nodes.forEach((n, i) => {
      const p = [...path, i];
      out.push({ path: p, node: n });
      if (n.children?.length && this._open.has(key(p))) this.visible(n.children, p, out);
    });
    return out;
  }

  render() {
    const root = this.shadowRoot;
    if (!root) return;
    const data = this.data;
    // Seed only once there is something to seed from: declarative children can
    // arrive after the first render, and latching on an empty tree would drop
    // every `open` flag in the markup.
    if (!this._seeded && data.length) { this.seed(data); this._seeded = true }

    root.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = `
      ${glassBaseStyles()}
      :host { display: block; font-family: var(--glass-font); color: var(--glass-text); }
      [role="tree"] { list-style: none; margin: 0; padding: 4px 2px; }
      [role="group"] { list-style: none; margin: 0; padding: 0; position: relative; }
      li { position: relative; }
      .row {
        display: flex; align-items: center; gap: 6px;
        padding: 4px 8px; border-radius: var(--glass-radius-sm);
        cursor: default; font-size: 13px; color: var(--glass-text);
        border: var(--glass-border-width) solid transparent;
      }
      .row:hover { background: var(--glass-hover); }
      .row:focus-visible { outline: 2px solid var(--accent-warm); outline-offset: -2px; }
      .row[aria-selected="true"] { background: var(--glass-hover); border-color: var(--glass-border); }
      .tw {
        width: 16px; height: 16px; flex: none; display: grid; place-items: center;
        color: var(--glass-text-muted); font-size: 10px; line-height: 1;
        transition: transform .15s;
      }
      .tw.open { transform: rotate(90deg); }
      .tw.leaf { visibility: hidden; }
      .icon { font-size: 12px; opacity: .8; flex: none; }
      .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .count { color: var(--glass-text-dim); font-size: 11px; margin-left: 2px; }
      /* Connector rail sits inside the indent, so pixel's 3px borders never
         double up against a nested row's own edge. */
      .kids { margin-left: 15px; padding-left: 9px; border-left: 1px solid var(--glass-grid); }
      .kids.nolines { border-left-color: transparent; }
      @media (prefers-reduced-motion: reduce) { .tw { transition: none } }
    `;
    root.append(style);

    const tree = document.createElement('ul');
    tree.setAttribute('role', 'tree');
    tree.setAttribute('aria-label', this.getAttribute('label') || 'Tree');
    root.append(tree);

    const vis = this.visible();
    if (!this._focus || !vis.some(v => key(v.path) === this._focus)) {
      this._focus = vis.length ? key(vis[0].path) : null;
    }

    const build = (nodes: TreeNodeData[], parent: HTMLElement, path: number[], level: number) => {
      nodes.forEach((n, i) => {
        const p = [...path, i];
        const k = key(p);
        const branch = !!n.children?.length;
        const open = branch && this._open.has(k);

        const li = document.createElement('li');
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('role', 'treeitem');
        row.setAttribute('aria-level', String(level));
        row.setAttribute('aria-setsize', String(nodes.length));
        row.setAttribute('aria-posinset', String(i + 1));
        if (branch) row.setAttribute('aria-expanded', String(open));
        if (this.selectable) row.setAttribute('aria-selected', String(this._selected === k));
        // Roving tabindex: exactly one row is tabbable.
        row.tabIndex = this._focus === k ? 0 : -1;
        row.dataset.path = k;

        const tw = document.createElement('span');
        tw.className = `tw${branch ? (open ? ' open' : '') : ' leaf'}`;
        tw.textContent = '▶';
        row.append(tw);

        if (n.icon) {
          const ic = document.createElement('span');
          ic.className = 'icon'; ic.textContent = n.icon; row.append(ic);
        }
        const lb = document.createElement('span');
        lb.className = 'label'; lb.textContent = n.label; row.append(lb);
        if (branch) {
          const c = document.createElement('span');
          c.className = 'count'; c.textContent = String(n.children!.length); row.append(c);
        }

        row.addEventListener('click', () => {
          this._focus = k;
          if (branch) this.toggle(p);
          else this.select(p);
          if (!branch) this.render();
        });
        row.addEventListener('keydown', e => this.onKey(e, p, branch, open));
        li.append(row);

        if (branch && open) {
          const g = document.createElement('ul');
          g.setAttribute('role', 'group');
          g.className = `kids${this.lines ? '' : ' nolines'}`;
          build(n.children!, g, p, level + 1);
          li.append(g);
        }
        parent.append(li);
      });
    };
    build(data, tree, [], 1);

    const active = root.querySelector<HTMLElement>(`.row[data-path="${this._focus}"]`);
    if (active && this._movedFocus) { active.focus(); this._movedFocus = false }
  }

  private _movedFocus = false;

  private select(path: number[]) {
    const k = key(path);
    this._selected = k;
    const node = this.nodeAt(path);
    if (node) this.dispatchEvent(new CustomEvent<OTreeSelectDetail>('o-tree-select', {
      bubbles: true, composed: true, detail: { node, path, label: node.label },
    }));
  }

  private moveTo(k: string) { this._focus = k; this._movedFocus = true; this.render() }

  private onKey(e: Event, path: number[], branch: boolean, open: boolean) {
    const ev = e as KeyboardEvent;
    const vis = this.visible();
    const idx = vis.findIndex(v => key(v.path) === key(path));
    const go = (i: number) => { if (vis[i]) this.moveTo(key(vis[i].path)) };
    switch (ev.key) {
      case 'ArrowDown': ev.preventDefault(); go(idx + 1); break;
      case 'ArrowUp': ev.preventDefault(); go(idx - 1); break;
      case 'ArrowRight':
        ev.preventDefault();
        if (branch && !open) { this._focus = key(path); this._movedFocus = true; this.toggle(path, true) }
        else if (branch && open) go(idx + 1);
        break;
      case 'ArrowLeft':
        ev.preventDefault();
        if (branch && open) { this._focus = key(path); this._movedFocus = true; this.toggle(path, false) }
        else if (path.length > 1) this.moveTo(key(path.slice(0, -1)));
        break;
      case 'Home': ev.preventDefault(); go(0); break;
      case 'End': ev.preventDefault(); go(vis.length - 1); break;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        if (branch) this.toggle(path); else { this.select(path); this.render() }
        break;
    }
  }
}

if (!customElements.get('o-tree-node')) customElements.define('o-tree-node', OTreeNode);
if (!customElements.get('o-tree')) customElements.define('o-tree', OTree);
