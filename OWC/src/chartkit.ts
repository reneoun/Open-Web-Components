// Shared machinery for o-bar / o-line / o-pie.
//
// The mark specs here are not taste — they are the data-viz rules the three
// chart components all have to obey, kept in one place so they cannot drift
// apart: thin marks, a 2px surface gap doing the separating (never a stroke
// around a mark), hairline solid gridlines, and text that never wears the
// series colour.
//
// Series colour comes from the theme as --glass-series-1..6, so a chart is
// correct in all six family x mode combinations for the same reason every
// other component is: it reads tokens. The slots are assigned in fixed order
// and never cycled — a 7th category folds into "Other" rather than inventing
// a hue that would be indistinguishable under colour-vision deficiency.

import { GlassElement } from './glass';

export const SERIES_SLOTS = 6;

/** Fixed-order slot colour. Callers must fold past SERIES_SLOTS, never cycle. */
export function seriesVar(i: number): string {
  return `var(--glass-series-${Math.min(i, SERIES_SLOTS - 1) + 1})`;
}

export interface Datum { [k: string]: unknown }

/** Read a field off a row, tolerating missing keys. */
export const field = (row: Datum, key: string): unknown => row?.[key];

export const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : 0;
};

/** Thousands-separated, trimming pointless decimals. */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const dp = abs >= 100 || Number.isInteger(n) ? 0 : abs >= 1 ? 1 : 2;
  return n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * Axis ticks on clean numbers (0 / 1,000 / 2,000) — they carry the values that
 * are deliberately not direct-labelled, so they must read as round.
 */
export function niceTicks(min: number, max: number, target = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) return [min];
  const span = max - min;
  const raw = span / Math.max(1, target);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 1000; v += step) out.push(Math.abs(v) < step / 1000 ? 0 : +v.toFixed(10));
  return out;
}

/** Rounded at the data end, square at the baseline — never a pill. */
export function barPath(x: number, y: number, w: number, h: number, r = 4, horizontal = false): string {
  const rr = Math.max(0, Math.min(r, horizontal ? w : h, w / 2, h / 2));
  if (h <= 0 || w <= 0) return '';
  // A zero radius emits a plain rectangle rather than degenerate zero-length
  // curves — same pixels, but the path stays readable and assertable.
  if (rr === 0) return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
  if (horizontal) {
    return `M${x},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} H${x} Z`;
  }
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

export const svgNS = 'http://www.w3.org/2000/svg';
export const el = (name: string, attrs: Record<string, string | number> = {}): SVGElement => {
  const n = document.createElementNS(svgNS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
};

/**
 * Styles every chart shares. Text tokens for all text; the series colour lives
 * on marks only. Gridlines are hairline and solid — dashing reads as
 * "threshold" when it is only a grid.
 */
export function chartBaseStyles(): string {
  return `
    :host {
      display: block;
      font-family: var(--glass-font);
      color: var(--glass-text);
      container-type: inline-size;
    }
    .wrap {
      background: var(--glass-chart-surface);
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius);
      padding: 14px 16px 12px;
      box-shadow: var(--glass-elevation);
    }
    .title { font-size: 14px; font-weight: 600; margin: 0 0 2px; color: var(--glass-text); }
    .sub   { font-size: 12px; margin: 0 0 10px; color: var(--glass-text-muted); }
    svg { display: block; width: 100%; overflow: visible; }
    .grid  { stroke: var(--glass-grid); stroke-width: 1; }
    .axis-text {
      font-size: 11px; fill: var(--glass-text-muted);
      font-variant-numeric: tabular-nums; font-family: var(--glass-font);
    }
    .mark-label {
      font-size: 11px; fill: var(--glass-text); font-family: var(--glass-font);
      font-variant-numeric: tabular-nums; pointer-events: none;
    }
    .hit { fill: transparent; cursor: default; }
    .legend {
      display: flex; flex-wrap: wrap; gap: 4px 14px;
      margin-top: 10px; font-size: 12px; color: var(--glass-text-muted);
    }
    .legend button {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; padding: 2px 0; cursor: pointer;
      font: inherit; color: inherit; font-family: var(--glass-font);
    }
    .legend .key { width: 12px; height: 12px; border-radius: var(--glass-radius-xs); flex: none; }
    .legend .key.line { height: 3px; border-radius: 2px; }
    .legend button[aria-pressed="false"] { opacity: 0.45; }
    .tip {
      position: absolute; pointer-events: none; z-index: 5;
      background: var(--glass-chrome-bg); color: var(--glass-text);
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius-sm);
      padding: 7px 9px; font-size: 12px; min-width: 96px;
      box-shadow: var(--glass-shadow); opacity: 0; transition: opacity .12s;
      font-family: var(--glass-font);
    }
    .tip.on { opacity: 1; }
    .tip .cat { color: var(--glass-text-muted); margin-bottom: 4px; font-size: 11px; }
    .tip .row { display: flex; align-items: center; gap: 7px; margin-top: 2px; }
    .tip .k { width: 10px; height: 3px; border-radius: 2px; flex: none; }
    /* Values lead, labels follow — the reader already has the series. */
    .tip .v { font-weight: 600; font-variant-numeric: tabular-nums; }
    .tip .n { color: var(--glass-text-muted); }
    .host-rel { position: relative; }
    .tablebtn {
      margin-top: 8px; background: none; cursor: pointer;
      border: var(--glass-border-width) solid var(--glass-border);
      border-radius: var(--glass-radius-sm);
      color: var(--glass-text-muted); font: inherit; font-size: 11px;
      padding: 3px 8px; font-family: var(--glass-font);
    }
    .tablebtn:hover { background: var(--glass-hover); color: var(--glass-text); }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 12px; }
    th, td {
      text-align: left; padding: 5px 8px; color: var(--glass-text);
      border-bottom: 1px solid var(--glass-grid); font-variant-numeric: tabular-nums;
    }
    th { color: var(--glass-text-muted); font-weight: 500; }
    .empty { color: var(--glass-text-muted); font-size: 13px; padding: 20px 0; }
    @media (prefers-reduced-motion: reduce) { .tip { transition: none; } }
  `;
}

/**
 * Base for the chart elements: data plumbing, the table-view twin, and a
 * resize observer. The table view is not optional — it is what keeps every
 * value reachable when a mark is too small to label or the colour is hard to
 * tell apart, so a tooltip never becomes the only way to read a number.
 */
export abstract class OChartElement extends GlassElement {
  protected _data: Datum[] = [];
  protected _showTable = false;
  protected _ro: ResizeObserver | null = null;
  protected _hidden = new Set<string>();

  get data(): Datum[] { return this._data }
  set data(v: Datum[]) { this._data = Array.isArray(v) ? v : []; this.render() }

  get chartTitle() { return this.getAttribute('chart-title') ?? '' }
  set chartTitle(v: string) { this.setAttribute('chart-title', v) }

  get description() { return this.getAttribute('description') ?? '' }

  connectedCallback() {
    this.render();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => this.render());
      this._ro.observe(this);
    }
  }

  disconnectedCallback() { this._ro?.disconnect(); this._ro = null }

  attributeChangedCallback(_n: string, p: string | null, x: string | null) {
    if (p !== x) this.render();
  }

  protected toggleTable = () => { this._showTable = !this._showTable; this.render() };

  /** Width available for the plot; falls back when laid out at zero (tests). */
  protected boxWidth(): number {
    const w = this.getBoundingClientRect().width || parseFloat(this.getAttribute('width') ?? '') || 520;
    return Math.max(220, w);
  }

  abstract render(): void;
}
