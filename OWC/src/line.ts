// o-line — trend over time.
//
// The crosshair finds the X: a hairline tracks the pointer, snaps to the
// nearest data position, and one tooltip reports every series at that X. The
// reader aims at a date, never at a 2px stroke.

import {
  OChartElement, chartBaseStyles, seriesVar, niceTicks, num, fmt, el,
  SERIES_SLOTS,
} from './chartkit';

const PAD = { top: 16, right: 52, bottom: 30, left: 48 };

export class OLine extends OChartElement {
  static get observedAttributes() {
    return ['x', 'y', 'series', 'area', 'chart-title', 'description', 'height']
  }

  get x() { return this.getAttribute('x') ?? 'label' }
  get y() { return this.getAttribute('y') ?? 'value' }
  get area() { return this.hasAttribute('area') }

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
    const declared = this.series;
    const keys = declared.length ? declared : [this.y];
    const shown = keys.slice(0, SERIES_SLOTS);
    const active = shown.filter(k => !this._hidden.has(k));

    root.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = chartBaseStyles();
    root.append(style);
    const wrap = document.createElement('div');
    wrap.className = 'wrap host-rel';
    root.append(wrap);

    if (this.chartTitle) {
      const h = document.createElement('p'); h.className = 'title';
      h.textContent = this.chartTitle; wrap.append(h);
    }
    if (this.description) {
      const d = document.createElement('p'); d.className = 'sub';
      d.textContent = this.description; wrap.append(d);
    }
    if (!rows.length) {
      const e = document.createElement('div');
      e.className = 'empty'; e.textContent = 'No data'; wrap.append(e); return;
    }

    const W = this.boxWidth() - 34;
    const H = this.plotHeight();
    const iw = Math.max(60, W - PAD.left - PAD.right);
    const ih = Math.max(60, H - PAD.top - PAD.bottom);

    const all = active.flatMap(k => rows.map(r => num(r[k])));
    const lo = Math.min(0, ...all);
    const hi = Math.max(1, ...all);
    const ticks = niceTicks(lo, hi);
    const t0 = ticks[0], t1 = ticks[ticks.length - 1];
    const span = (t1 - t0) || 1;
    const px = (i: number) => PAD.left + (rows.length === 1 ? iw / 2 : (i / (rows.length - 1)) * iw);
    const py = (v: number) => PAD.top + ih - ((v - t0) / span) * ih;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }) as SVGSVGElement;
    svg.setAttribute('aria-label', this.chartTitle || 'Line chart');
    wrap.append(svg);

    for (const t of ticks) {
      const gy = py(t);
      svg.append(el('line', { class: 'grid', x1: PAD.left, x2: PAD.left + iw, y1: gy, y2: gy }));
      const lb = el('text', { class: 'axis-text', x: PAD.left - 8, y: gy + 4, 'text-anchor': 'end' });
      lb.textContent = fmt(t); svg.append(lb);
    }

    // X labels thinned to whatever fits, so they never collide.
    const every = Math.max(1, Math.ceil(rows.length / Math.max(2, Math.floor(iw / 62))));
    rows.forEach((r, i) => {
      if (i % every && i !== rows.length - 1) return;
      const lb = el('text', { class: 'axis-text', x: px(i), y: PAD.top + ih + 16, 'text-anchor': 'middle' });
      lb.textContent = String(r[this.x] ?? ''); svg.append(lb);
    });

    const crosshair = el('line', {
      class: 'grid', x1: 0, x2: 0, y1: PAD.top, y2: PAD.top + ih,
      opacity: '0', 'stroke-width': '1',
    });
    svg.append(crosshair);

    active.forEach(k => {
      const slot = shown.indexOf(k);
      const colour = seriesVar(slot);
      const pts = rows.map((r, i) => [px(i), py(num(r[k]))] as const);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

      // Area is a wash at ~10% — a saturated block would shout over the line.
      if (this.area && active.length === 1) {
        const base = py(Math.max(t0, 0));
        svg.append(el('path', {
          d: `${d} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`,
          fill: colour, opacity: '0.1',
        }));
      }
      svg.append(el('path', {
        d, fill: 'none', stroke: colour, 'stroke-width': '2',
        'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      }));

      // End marker: >= 8px with a 2px surface ring so it stays legible where
      // series cross. The ring is spacing, not a border drawn to separate.
      const last = pts[pts.length - 1];
      svg.append(el('circle', {
        cx: last[0], cy: last[1], r: 4.5, fill: colour,
        stroke: 'var(--glass-chart-surface)', 'stroke-width': '2',
      }));

      // Direct-label the endpoint when the series count is small enough for
      // labels to stay sparse; the legend and tooltip carry the rest.
      if (active.length <= 4) {
        const l = el('text', { class: 'mark-label', x: last[0] + 9, y: last[1] + 4 });
        l.textContent = fmt(num(rows[rows.length - 1][k]));
        svg.append(l);
      }
    });

    const dots: SVGElement[] = [];
    active.forEach(k => {
      const slot = shown.indexOf(k);
      const c = el('circle', {
        cx: 0, cy: 0, r: 4, fill: seriesVar(slot),
        stroke: 'var(--glass-chart-surface)', 'stroke-width': '2', opacity: '0',
      });
      dots.push(c); svg.append(c);
    });

    const hit = el('rect', {
      class: 'hit', x: PAD.left - 4, y: PAD.top, width: iw + 8, height: ih,
    });
    hit.setAttribute('tabindex', '0');
    hit.setAttribute('role', 'application');
    hit.setAttribute('aria-label', `${this.chartTitle || 'Line chart'}: use arrow keys to step through points`);
    svg.append(hit);

    const tip = document.createElement('div');
    tip.className = 'tip'; wrap.append(tip);

    let idx = -1;
    const at = (i: number, clientX?: number, clientY?: number) => {
      if (i < 0 || i >= rows.length) return;
      idx = i;
      const gx = px(i);
      crosshair.setAttribute('x1', String(gx));
      crosshair.setAttribute('x2', String(gx));
      crosshair.setAttribute('opacity', '1');
      active.forEach((k, di) => {
        const d = dots[di];
        d.setAttribute('cx', String(gx));
        d.setAttribute('cy', String(py(num(rows[i][k]))));
        d.setAttribute('opacity', '1');
      });
      tip.innerHTML = '';
      const cat = document.createElement('div');
      cat.className = 'cat'; cat.textContent = String(rows[i][this.x] ?? '');
      tip.append(cat);
      // One tooltip, every series — the pointer never has to find a line.
      active.forEach(k => {
        const r = document.createElement('div'); r.className = 'row';
        const key = document.createElement('span'); key.className = 'k';
        key.style.background = seriesVar(shown.indexOf(k));
        const v = document.createElement('span'); v.className = 'v'; v.textContent = fmt(num(rows[i][k]));
        const n = document.createElement('span'); n.className = 'n'; n.textContent = k;
        r.append(key, v, n); tip.append(r);
      });
      tip.classList.add('on');
      const b = wrap.getBoundingClientRect();
      const lx = clientX !== undefined ? clientX - b.left : gx;
      tip.style.left = `${Math.min(Math.max(6, lx + 12), Math.max(6, b.width - 140))}px`;
      tip.style.top = `${clientY !== undefined ? Math.max(4, clientY - b.top - 10) : PAD.top}px`;
    };
    const off = () => {
      crosshair.setAttribute('opacity', '0');
      dots.forEach(d => d.setAttribute('opacity', '0'));
      tip.classList.remove('on');
    };

    svg.addEventListener('pointermove', e => {
      const b = svg.getBoundingClientRect();
      const rel = ((e.clientX - b.left) / b.width) * W;
      if (rel < PAD.left - 8 || rel > PAD.left + iw + 8) return off();
      const i = rows.length === 1 ? 0
        : Math.round(((rel - PAD.left) / iw) * (rows.length - 1));
      at(Math.max(0, Math.min(rows.length - 1, i)), e.clientX, e.clientY);
    });
    svg.addEventListener('pointerleave', off);
    hit.addEventListener('focus', () => at(idx < 0 ? 0 : idx));
    hit.addEventListener('blur', off);
    hit.addEventListener('keydown', e => {
      const k = (e as KeyboardEvent).key;
      if (k === 'ArrowRight') { e.preventDefault(); at(Math.min(rows.length - 1, idx + 1)) }
      if (k === 'ArrowLeft') { e.preventDefault(); at(Math.max(0, idx - 1)) }
    });

    if (shown.length >= 2) {
      const box = document.createElement('div');
      box.className = 'legend';
      shown.forEach((k, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(!this._hidden.has(k)));
        const sw = document.createElement('span');
        sw.className = 'key line';
        sw.style.background = seriesVar(i);
        const t = document.createElement('span'); t.textContent = k;
        b.append(sw, t);
        b.addEventListener('click', () => {
          this._hidden.has(k) ? this._hidden.delete(k) : this._hidden.add(k);
          this.render();
        });
        box.append(b);
      });
      wrap.append(box);
    }

    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'tablebtn';
    btn.textContent = this._showTable ? 'Hide table' : 'Show table';
    btn.setAttribute('aria-expanded', String(this._showTable));
    btn.addEventListener('click', this.toggleTable);
    wrap.append(btn);
    if (this._showTable) {
      const tb = document.createElement('table');
      const hr = document.createElement('tr');
      for (const h of [this.x, ...shown]) {
        const th = document.createElement('th'); th.textContent = h; hr.append(th);
      }
      tb.append(hr);
      rows.forEach(r => {
        const tr = document.createElement('tr');
        const c = document.createElement('td'); c.textContent = String(r[this.x] ?? ''); tr.append(c);
        for (const k of shown) {
          const td = document.createElement('td'); td.textContent = fmt(num(r[k])); tr.append(td);
        }
        tb.append(tr);
      });
      wrap.append(tb);
    }
  }
}

if (!customElements.get('o-line')) customElements.define('o-line', OLine);
