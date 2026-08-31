// o-pie — part-to-whole, at a glance.
//
// Deliberately constrained, because a pie is easy to misuse: it reads a
// share at a glance and nothing more. It is NOT for comparing close values
// (a bar is), and a two-slice pie is a stat tile wearing a costume. The tail
// past `max-slices` folds into "Other" rather than seating a 7th hue, and
// every slice is direct-labelled so identity never rests on colour alone.

import {
  OChartElement, chartBaseStyles, seriesVar, num, fmt, el,
  SERIES_SLOTS,
} from './chartkit';

const GAP_DEG = 1.2; // the surface gap, expressed as an angle

interface Slice { label: string; value: number; slot: number; pct: number }

export class OPie extends OChartElement {
  static get observedAttributes() {
    return ['label', 'value', 'donut', 'max-slices', 'chart-title', 'description', 'height']
  }

  get labelKey() { return this.getAttribute('label') ?? 'label' }
  get valueKey() { return this.getAttribute('value') ?? 'value' }
  get donut() { return this.hasAttribute('donut') }
  get maxSlices() {
    const n = parseInt(this.getAttribute('max-slices') ?? '', 10);
    return Number.isFinite(n) ? Math.max(2, Math.min(SERIES_SLOTS, n)) : SERIES_SLOTS;
  }

  private plotHeight(): number {
    const h = parseFloat(this.getAttribute('height') ?? '');
    return Number.isFinite(h) ? h : 240;
  }

  /** Sorted desc, tail folded into a single "Other" wearing the last slot. */
  private slices(): Slice[] {
    const rows = this._data.map(r => ({
      label: String(r[this.labelKey] ?? ''), value: num(r[this.valueKey]),
    })).filter(s => s.value > 0).sort((a, b) => b.value - a.value);
    const total = rows.reduce((a, s) => a + s.value, 0) || 1;
    const cap = this.maxSlices;
    const head = rows.slice(0, rows.length > cap ? cap - 1 : cap);
    const tail = rows.slice(head.length);
    const out: Slice[] = head.map((s, i) => ({ ...s, slot: i, pct: s.value / total }));
    if (tail.length) {
      const v = tail.reduce((a, s) => a + s.value, 0);
      out.push({ label: 'Other', value: v, slot: SERIES_SLOTS - 1, pct: v / total });
    }
    return out;
  }

  render() {
    const root = this.shadowRoot;
    if (!root) return;
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

    const sl = this.slices();
    if (!sl.length) {
      const e = document.createElement('div');
      e.className = 'empty'; e.textContent = 'No data'; wrap.append(e); return;
    }

    const W = this.boxWidth() - 34;
    const H = this.plotHeight();
    const cx = W / 2, cy = H / 2;
    const R = Math.max(40, Math.min(cx - 74, cy - 12));
    const inner = this.donut ? R * 0.58 : 0;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }) as SVGSVGElement;
    svg.setAttribute('aria-label', this.chartTitle || 'Pie chart');
    wrap.append(svg);

    const polar = (r: number, deg: number) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
    };

    let cur = 0;
    const total = sl.reduce((a, s) => a + s.value, 0) || 1;
    sl.forEach(s => {
      const sweep = (s.value / total) * 360;
      // The gap is the separator; never a stroke drawn around the slice.
      const a0 = cur + GAP_DEG / 2;
      const a1 = cur + sweep - GAP_DEG / 2;
      cur += sweep;
      if (a1 <= a0) return;
      const large = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = polar(R, a0), [x1, y1] = polar(R, a1);
      let d: string;
      if (inner > 0) {
        const [ix1, iy1] = polar(inner, a1), [ix0, iy0] = polar(inner, a0);
        d = `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${ix1},${iy1} A${inner},${inner} 0 ${large} 0 ${ix0},${iy0} Z`;
      } else {
        d = `M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`;
      }
      const p = el('path', { d, fill: seriesVar(s.slot), class: 'mark' });
      p.setAttribute('data-label', s.label);
      p.setAttribute('data-val', String(s.value));
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', `${s.label}: ${fmt(s.value)}, ${(s.pct * 100).toFixed(1)}%`);
      svg.append(p);

      // Direct label outside the arc — only when the slice is big enough to
      // deserve one. Small slices live in the legend, tooltip and table.
      if (s.pct >= 0.06) {
        const mid = (a0 + a1) / 2;
        const [lx, ly] = polar(R + 14, mid);
        const anchor = lx < cx - 2 ? 'end' : lx > cx + 2 ? 'start' : 'middle';
        const t = el('text', {
          class: 'mark-label', x: lx, y: ly + 4, 'text-anchor': anchor,
        });
        t.textContent = `${(s.pct * 100).toFixed(0)}%`;
        svg.append(t);
      }
    });

    if (this.donut) {
      const big = el('text', {
        x: cx, y: cy - 2, 'text-anchor': 'middle', class: 'mark-label',
        'font-size': '20', 'font-weight': '600',
      });
      big.textContent = fmt(total);
      svg.append(big);
      const cap = el('text', { x: cx, y: cy + 15, 'text-anchor': 'middle', class: 'axis-text' });
      cap.textContent = 'total';
      svg.append(cap);
    }

    // Tooltip: the mark is the hit target, and focus shows what hover shows.
    const tip = document.createElement('div');
    tip.className = 'tip'; wrap.append(tip);
    const show = (label: string, clientX: number, clientY: number) => {
      const s = sl.find(z => z.label === label); if (!s) return;
      tip.innerHTML = '';
      const c = document.createElement('div');
      c.className = 'cat'; c.textContent = s.label; tip.append(c);
      const r = document.createElement('div'); r.className = 'row';
      const k = document.createElement('span'); k.className = 'k';
      k.style.background = seriesVar(s.slot);
      const v = document.createElement('span'); v.className = 'v'; v.textContent = fmt(s.value);
      const n = document.createElement('span'); n.className = 'n';
      n.textContent = `${(s.pct * 100).toFixed(1)}%`;
      r.append(k, v, n); tip.append(r);
      tip.classList.add('on');
      const b = wrap.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(6, clientX - b.left + 12), Math.max(6, b.width - 140))}px`;
      tip.style.top = `${Math.max(4, clientY - b.top - 10)}px`;
    };
    const hide = () => tip.classList.remove('on');
    svg.addEventListener('pointermove', e => {
      const t = (e.target as Element).closest('.mark');
      if (!t) return hide();
      show(t.getAttribute('data-label') ?? '', e.clientX, e.clientY);
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focusin', e => {
      const t = (e.target as Element).closest('.mark'); if (!t) return;
      const r = (t as SVGGraphicsElement).getBoundingClientRect();
      show(t.getAttribute('data-label') ?? '', r.left + r.width / 2, r.top + r.height / 2);
    });
    svg.addEventListener('focusout', hide);

    // A pie always carries a legend: slices are identified by colour, so the
    // dependable identity channel has to be present.
    const box = document.createElement('div');
    box.className = 'legend';
    sl.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.disabled = true;
      b.style.cursor = 'default';
      const sw = document.createElement('span'); sw.className = 'key';
      sw.style.background = seriesVar(s.slot);
      const t = document.createElement('span');
      t.textContent = `${s.label} · ${fmt(s.value)}`;
      b.append(sw, t); box.append(b);
    });
    wrap.append(box);

    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'tablebtn';
    btn.textContent = this._showTable ? 'Hide table' : 'Show table';
    btn.setAttribute('aria-expanded', String(this._showTable));
    btn.addEventListener('click', this.toggleTable);
    wrap.append(btn);
    if (this._showTable) {
      const tb = document.createElement('table');
      const hr = document.createElement('tr');
      for (const h of [this.labelKey, this.valueKey, 'share']) {
        const th = document.createElement('th'); th.textContent = h; hr.append(th);
      }
      tb.append(hr);
      sl.forEach(s => {
        const tr = document.createElement('tr');
        const a = document.createElement('td'); a.textContent = s.label;
        const b2 = document.createElement('td'); b2.textContent = fmt(s.value);
        const c2 = document.createElement('td'); c2.textContent = `${(s.pct * 100).toFixed(1)}%`;
        tr.append(a, b2, c2); tb.append(tr);
      });
      wrap.append(tb);
    }
  }
}

if (!customElements.get('o-pie')) customElements.define('o-pie', OPie);
