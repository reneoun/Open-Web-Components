// o-bar — column/bar chart for comparing magnitude.
//
// One series is the common case and takes ONE colour for every bar: colouring
// nominal bars by their own value would spend the identity channel
// re-encoding what bar length already shows. Slots 1..N are for genuinely
// separate series, where the colour means "which series", not "how much".

import {
  OChartElement, chartBaseStyles, seriesVar, barPath, niceTicks, num, fmt, el,
  SERIES_SLOTS, type Datum,
} from './chartkit';

const PAD = { top: 14, right: 14, bottom: 30, left: 46 };
const MAX_THICK = 24;   // never fill the slot — the leftover band is air
const GAP = 2;          // the surface gap does the separating, not a stroke

export class OBar extends OChartElement {
  static get observedAttributes() {
    return ['x', 'y', 'series', 'stacked', 'horizontal', 'chart-title', 'description', 'height']
  }

  get x() { return this.getAttribute('x') ?? 'label' }
  get y() { return this.getAttribute('y') ?? 'value' }
  get stacked() { return this.hasAttribute('stacked') }
  get horizontal() { return this.hasAttribute('horizontal') }

  /** Series field names; empty means a single series read from `y`. */
  get series(): string[] {
    const raw = this.getAttribute('series');
    return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
  }

  private plotHeight(): number {
    const h = parseFloat(this.getAttribute('height') ?? '');
    return Number.isFinite(h) ? h : 220;
  }

  render() {
    const root = this.shadowRoot;
    if (!root) return;
    const rows = this._data;
    const keys = this.series;
    const multi = keys.length > 0;
    // Past the slot ceiling the tail folds into one "Other" band — never a
    // generated 7th hue, which would be indistinguishable under CVD.
    const shown = multi ? keys.slice(0, SERIES_SLOTS) : [];
    const folded = multi ? keys.slice(SERIES_SLOTS) : [];
    const active = shown.filter(k => !this._hidden.has(k));

    root.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = chartBaseStyles();
    root.append(style);

    const wrap = document.createElement('div');
    wrap.className = 'wrap host-rel';
    root.append(wrap);

    if (this.chartTitle) {
      const h = document.createElement('p');
      h.className = 'title'; h.textContent = this.chartTitle; wrap.append(h);
    }
    if (this.description) {
      const d = document.createElement('p');
      d.className = 'sub'; d.textContent = this.description; wrap.append(d);
    }
    if (!rows.length) {
      const e = document.createElement('div');
      e.className = 'empty'; e.textContent = 'No data'; wrap.append(e); return;
    }

    const W = this.boxWidth() - 34;
    const H = this.plotHeight();
    const iw = Math.max(60, W - PAD.left - PAD.right);
    const ih = Math.max(60, H - PAD.top - PAD.bottom);

    const valueOf = (r: Datum, k: string) => num(r[k]);
    const totals = rows.map(r => multi
      ? (this.stacked ? active.reduce((a, k) => a + valueOf(r, k), 0)
                      : Math.max(0, ...active.map(k => valueOf(r, k))))
      : num(r[this.y]));
    const folUnits = folded.length
      ? rows.map(r => folded.reduce((a, k) => a + valueOf(r, k), 0))
      : rows.map(() => 0);
    const maxV = Math.max(0, ...totals.map((t, i) => t + (this.stacked ? folUnits[i] : 0)));
    const ticks = niceTicks(0, maxV || 1);
    const top = ticks[ticks.length - 1] || 1;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }) as SVGSVGElement;
    svg.setAttribute('aria-label', this.chartTitle || 'Bar chart');
    wrap.append(svg);

    // --- gridlines + value axis (hairline, solid, recessive) ---
    for (const t of ticks) {
      const p = t / top;
      if (this.horizontal) {
        const gx = PAD.left + p * iw;
        svg.append(el('line', { class: 'grid', x1: gx, x2: gx, y1: PAD.top, y2: PAD.top + ih }));
        const lb = el('text', { class: 'axis-text', x: gx, y: PAD.top + ih + 16, 'text-anchor': 'middle' });
        lb.textContent = fmt(t); svg.append(lb);
      } else {
        const gy = PAD.top + ih - p * ih;
        svg.append(el('line', { class: 'grid', x1: PAD.left, x2: PAD.left + iw, y1: gy, y2: gy }));
        const lb = el('text', { class: 'axis-text', x: PAD.left - 8, y: gy + 4, 'text-anchor': 'end' });
        lb.textContent = fmt(t); svg.append(lb);
      }
    }

    const band = (this.horizontal ? ih : iw) / rows.length;
    const groups = multi ? (this.stacked ? 1 : active.length || 1) : 1;
    const thick = Math.min(MAX_THICK, Math.max(3, (band * 0.68) / groups - (groups > 1 ? GAP : 0)));
    const single = !multi || active.length <= 1;

    rows.forEach((row, ri) => {
      const cat = String(row[this.x] ?? '');
      const c0 = ri * band + band / 2;

      const stackSegs: { key: string; v: number; slot: number }[] = [];
      if (multi) {
        active.forEach(k => stackSegs.push({ key: k, v: valueOf(row, k), slot: shown.indexOf(k) }));
        if (folded.length && folUnits[ri] > 0) stackSegs.push({ key: 'Other', v: folUnits[ri], slot: SERIES_SLOTS - 1 });
      } else {
        stackSegs.push({ key: this.y, v: num(row[this.y]), slot: 0 });
      }

      let acc = 0;
      stackSegs.forEach((seg, si) => {
        const frac = seg.v / top;
        // Single series -> every bar wears slot 1 (identity is not the job here).
        const colour = single && !multi ? seriesVar(0) : seriesVar(seg.slot);
        let px: number, py: number, pw: number, ph: number;

        if (this.stacked || stackSegs.length === 1) {
          const len = Math.max(0, frac * (this.horizontal ? iw : ih) - (si ? GAP : 0));
          if (this.horizontal) {
            px = PAD.left + (acc / top) * iw + (si ? GAP : 0);
            py = PAD.top + c0 - thick / 2; pw = len; ph = thick;
          } else {
            px = PAD.left + c0 - thick / 2;
            py = PAD.top + ih - ((acc / top) * ih) - len - (si ? GAP : 0);
            pw = thick; ph = len;
          }
          acc += seg.v;
        } else {
          const off = (si - (stackSegs.length - 1) / 2) * (thick + GAP);
          if (this.horizontal) {
            px = PAD.left; py = PAD.top + c0 + off - thick / 2;
            pw = Math.max(0, frac * iw); ph = thick;
          } else {
            px = PAD.left + c0 + off - thick / 2;
            py = PAD.top + ih - frac * ih; pw = thick; ph = Math.max(0, frac * ih);
          }
        }

        if (pw <= 0 || ph <= 0) return;
        // Only the outermost segment carries the rounded data-end. Interior
        // segments of a stack are square at both ends — rounding each one
        // would read as a row of separate pills rather than one bar.
        const isEnd = !this.stacked || si === stackSegs.length - 1;
        const path = el('path', {
          d: barPath(px, py, pw, ph, isEnd ? 4 : 0, this.horizontal),
          fill: colour, class: 'mark',
        });
        path.setAttribute('data-cat', cat);
        path.setAttribute('data-key', seg.key);
        path.setAttribute('data-val', String(seg.v));
        svg.append(path);
      });

      // Category tick
      const tx = this.horizontal ? PAD.left - 8 : PAD.left + c0;
      const ty = this.horizontal ? PAD.top + c0 + 4 : PAD.top + ih + 16;
      const ct = el('text', {
        class: 'axis-text', x: tx, y: ty,
        'text-anchor': this.horizontal ? 'end' : 'middle',
      });
      ct.textContent = cat;
      svg.append(ct);

      // Direct label — only for a single series, and only when it fits
      // outside the bar end. A number on every mark of every series is chaos.
      if (!multi) {
        const v = num(row[this.y]);
        const txt = fmt(v);
        const est = txt.length * 6.4;
        const frac = v / top;
        if (this.horizontal) {
          const endX = PAD.left + frac * iw;
          if (endX + est + 8 < PAD.left + iw + PAD.right) {
            const l = el('text', { class: 'mark-label', x: endX + 6, y: PAD.top + c0 + 4 });
            l.textContent = txt; svg.append(l);
          }
        } else {
          const endY = PAD.top + ih - frac * ih;
          if (endY - 6 > PAD.top && thick > 16) {
            const l = el('text', { class: 'mark-label', x: PAD.left + c0, y: endY - 6, 'text-anchor': 'middle' });
            l.textContent = txt; svg.append(l);
          }
        }
      }

      // Hit target spans the whole band (>= the mark + its gap), never just paint.
      const hit = el('rect', this.horizontal
        ? { class: 'hit', x: PAD.left, y: PAD.top + ri * band, width: iw, height: band }
        : { class: 'hit', x: PAD.left + ri * band, y: PAD.top, width: band, height: ih });
      hit.setAttribute('data-ri', String(ri));
      hit.setAttribute('tabindex', '0');
      hit.setAttribute('role', 'button');
      hit.setAttribute('aria-label', `${cat}: ${stackSegs.map(s => `${s.key} ${fmt(s.v)}`).join(', ')}`);
      svg.append(hit);
    });

    this.attachTip(wrap, svg, rows, multi ? [...active, ...(folded.length ? ['Other'] : [])] : [this.y], folded);
    if (multi && shown.length + (folded.length ? 1 : 0) >= 2) {
      this.legend(wrap, shown, folded.length > 0);
    }
    this.tableView(wrap, rows, multi ? [...shown, ...(folded.length ? ['Other'] : [])] : [this.y], folUnits);
  }

  private attachTip(
    wrap: HTMLElement, svg: SVGSVGElement, rows: Datum[], keys: string[], folded: string[],
  ) {
    const tip = document.createElement('div');
    tip.className = 'tip'; wrap.append(tip);
    const show = (ri: number, cx: number, cy: number) => {
      const row = rows[ri]; if (!row) return;
      tip.innerHTML = '';
      const cat = document.createElement('div');
      cat.className = 'cat'; cat.textContent = String(row[this.x] ?? '');
      tip.append(cat);
      for (const k of keys) {
        const v = k === 'Other' ? folded.reduce((a, f) => a + num(row[f]), 0) : num(row[k]);
        const r = document.createElement('div'); r.className = 'row';
        const key = document.createElement('span'); key.className = 'k';
        const slot = k === 'Other' ? SERIES_SLOTS - 1 : Math.max(0, this.series.indexOf(k));
        key.style.background = seriesVar(this.series.length ? slot : 0);
        const val = document.createElement('span'); val.className = 'v'; val.textContent = fmt(v);
        const nm = document.createElement('span'); nm.className = 'n'; nm.textContent = k;
        r.append(key, val, nm); tip.append(r);
      }
      tip.classList.add('on');
      const b = wrap.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(6, cx - b.left + 12), b.width - 130)}px`;
      tip.style.top = `${Math.max(4, cy - b.top - 10)}px`;
    };
    const hide = () => tip.classList.remove('on');
    svg.addEventListener('pointermove', e => {
      const t = (e.target as Element).closest('.hit');
      if (!t) return hide();
      show(Number(t.getAttribute('data-ri')), e.clientX, e.clientY);
    });
    svg.addEventListener('pointerleave', hide);
    // Keyboard focus shows exactly what hover shows.
    svg.addEventListener('focusin', e => {
      const t = (e.target as Element).closest('.hit'); if (!t) return;
      const r = (t as SVGGraphicsElement).getBoundingClientRect();
      show(Number(t.getAttribute('data-ri')), r.left + r.width / 2, r.top);
    });
    svg.addEventListener('focusout', hide);
  }

  private legend(wrap: HTMLElement, keys: string[], hasOther: boolean) {
    const box = document.createElement('div');
    box.className = 'legend';
    const items = hasOther ? [...keys, 'Other'] : keys;
    items.forEach((k, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const on = !this._hidden.has(k);
      b.setAttribute('aria-pressed', String(on));
      const sw = document.createElement('span');
      sw.className = 'key';
      // Colour follows the entity, not its position — hiding a series must
      // never repaint the survivors, so the slot is fixed by name.
      sw.style.background = seriesVar(k === 'Other' ? SERIES_SLOTS - 1 : i);
      const t = document.createElement('span'); t.textContent = k;
      b.append(sw, t);
      if (k !== 'Other') b.addEventListener('click', () => {
        this._hidden.has(k) ? this._hidden.delete(k) : this._hidden.add(k);
        this.render();
      });
      box.append(b);
    });
    wrap.append(box);
  }

  private tableView(wrap: HTMLElement, rows: Datum[], keys: string[], folUnits: number[]) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'tablebtn';
    btn.textContent = this._showTable ? 'Hide table' : 'Show table';
    btn.setAttribute('aria-expanded', String(this._showTable));
    btn.addEventListener('click', this.toggleTable);
    wrap.append(btn);
    if (!this._showTable) return;

    const tb = document.createElement('table');
    const hr = document.createElement('tr');
    for (const h of [this.x, ...keys]) {
      const th = document.createElement('th'); th.textContent = h; hr.append(th);
    }
    tb.append(hr);
    rows.forEach((r, ri) => {
      const tr = document.createElement('tr');
      const c0 = document.createElement('td'); c0.textContent = String(r[this.x] ?? ''); tr.append(c0);
      for (const k of keys) {
        const td = document.createElement('td');
        td.textContent = fmt(k === 'Other' ? folUnits[ri] : num(r[k]));
        tr.append(td);
      }
      tb.append(tr);
    });
    wrap.append(tb);
  }
}

if (!customElements.get('o-bar')) customElements.define('o-bar', OBar);
