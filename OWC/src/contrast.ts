// WCAG 2.1 contrast maths, with alpha compositing.
//
// Not exported from index.ts on purpose: this is a design-time tool for the
// theme tests and the contrast audit script, and never ships in the bundle.

export type RGBA = [number, number, number, number];

export function parseColour(c: string): RGBA {
  const s = c.trim();
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
  }
  const fn = s.match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const p = fn[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  throw new Error(`cannot parse colour: ${c}`);
}

/** Composite src over dst; returns an opaque colour. */
export function over(src: RGBA, dst: RGBA): RGBA {
  const [sr, sg, sb, sa] = src;
  const [dr, dg, db] = dst;
  return [sr * sa + dr * (1 - sa), sg * sa + dg * (1 - sa), sb * sa + db * (1 - sa), 1];
}

const channel = (v: number) => {
  const x = v / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

export function luminance([r, g, b]: RGBA): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Contrast of a (possibly translucent) foreground against a stack of layers,
 * furthest first. Translucent tokens are meaningless without the layers beneath
 * them, which is exactly why the old audit under-reported glass.
 */
export function contrastOn(foreground: string, layers: string[]): number {
  let base = parseColour(layers[0]);
  for (const l of layers.slice(1)) base = over(parseColour(l), base);
  const fg = over(parseColour(foreground), base);
  const a = luminance(fg);
  const b = luminance(base);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
