import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './sidebar';
import type { OSidebar } from './sidebar';

function mount(html: string): OSidebar {
  document.body.innerHTML = html;
  return document.querySelector('o-sidebar') as OSidebar;
}

describe('o-sidebar', () => {
  beforeEach(() => {
    // happy-dom has no matchMedia by default; the component must survive both
    // its presence and absence, so most tests run with a controllable stub.
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: false,
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.style.removeProperty('--o-sidebar-offset');
  });

  it('registers as a custom element', () => {
    expect(customElements.get('o-sidebar')).toBeTruthy();
  });

  it('renders a shadow root with a toggle and a default slot', () => {
    const el = mount('<o-sidebar label="Nav"></o-sidebar>');
    expect(el.shadowRoot?.querySelector('.toggle')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
  });

  it('defaults to left side, expanded, not fixed', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    expect(el.side).toBe('left');
    expect(el.collapsed).toBe(false);
    expect(el.fixed).toBe(false);
  });

  it('reflects side="right"', () => {
    const el = mount('<o-sidebar side="right"></o-sidebar>');
    expect(el.side).toBe('right');
  });

  it('exposes width and rail-width with sane defaults', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    expect(el.width).toBe(240);
    expect(el.railWidth).toBe(52);
  });

  it('parses width and rail-width attributes', () => {
    const el = mount('<o-sidebar width="300" rail-width="60"></o-sidebar>');
    expect(el.width).toBe(300);
    expect(el.railWidth).toBe(60);
  });

  it('falls back to defaults on garbage numeric attributes', () => {
    const el = mount('<o-sidebar width="abc" rail-width="abc"></o-sidebar>');
    expect(el.width).toBe(240);
    expect(el.railWidth).toBe(52);
  });

  it('currentWidth follows the collapsed state', () => {
    const el = mount('<o-sidebar width="300" rail-width="60"></o-sidebar>');
    expect(el.currentWidth).toBe(300);
    el.collapsed = true;
    expect(el.currentWidth).toBe(60);
  });

  it('toggle() flips collapsed', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    el.toggle();
    expect(el.collapsed).toBe(true);
    el.toggle();
    expect(el.collapsed).toBe(false);
  });

  it('toggle(force) sets an explicit state', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    el.toggle(false);
    expect(el.collapsed).toBe(false);
    el.toggle(true);
    expect(el.collapsed).toBe(true);
  });

  it('collapse() and expand() are aliases for toggle', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    el.collapse();
    expect(el.collapsed).toBe(true);
    el.expand();
    expect(el.collapsed).toBe(false);
  });

  it('fires o-sidebar-toggle with { collapsed }, bubbling and composed', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const spy = vi.fn();
    document.addEventListener('o-sidebar-toggle', spy);
    el.toggle();
    expect(spy).toHaveBeenCalledTimes(1);
    const ev = spy.mock.calls[0][0] as CustomEvent;
    expect(ev.detail.collapsed).toBe(true);
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
    document.removeEventListener('o-sidebar-toggle', spy);
  });

  it('does not fire on a no-op toggle', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const spy = vi.fn();
    el.addEventListener('o-sidebar-toggle', spy);
    el.toggle(false); // already expanded
    expect(spy).not.toHaveBeenCalled();
  });

  it('clicking the toggle button collapses it', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const btn = el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement;
    btn.click();
    expect(el.collapsed).toBe(true);
  });

  it('Enter and Space on the toggle activate it', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const btn = el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement;
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.collapsed).toBe(true);
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(el.collapsed).toBe(false);
  });

  it('keeps aria-expanded in sync with collapsed', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const btn = () => el.shadowRoot?.querySelector('.toggle') as HTMLElement;
    expect(btn().getAttribute('aria-expanded')).toBe('true');
    el.toggle();
    expect(btn().getAttribute('aria-expanded')).toBe('false');
  });

  it('the toggle controls the body region by id', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const btn = el.shadowRoot?.querySelector('.toggle') as HTMLElement;
    const body = el.shadowRoot?.querySelector('.body') as HTMLElement;
    expect(btn.getAttribute('aria-controls')).toBe(body.id);
    expect(body.id).toBeTruthy();
  });

  it('the toggle carries an accessible name', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const btn = el.shadowRoot?.querySelector('.toggle') as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });

  it('does NOT unmount slotted content when collapsed', () => {
    // The rail keeps rendering children so light-DOM selectors held by the page
    // (scroll-spy, anchor wiring) keep resolving in both states.
    const el = mount('<o-sidebar><nav id="nav"><a href="#a">A</a></nav></o-sidebar>');
    el.collapse();
    expect(document.querySelectorAll('#nav a').length).toBe(1);
    expect(el.querySelector('#nav')).toBeTruthy();
  });

  it('collapsing does not re-render the shadow root', () => {
    // Re-rendering on collapse would drop focus and restart the transition.
    const el = mount('<o-sidebar></o-sidebar>');
    const body = el.shadowRoot?.querySelector('.body');
    el.collapse();
    expect(el.shadowRoot?.querySelector('.body')).toBe(body);
  });

  it('publishes --o-sidebar-offset when fixed', () => {
    mount('<o-sidebar fixed width="240"></o-sidebar>');
    expect(document.documentElement.style.getPropertyValue('--o-sidebar-offset')).toBe('240px');
  });

  it('offset follows the rail width when collapsed', () => {
    const el = mount('<o-sidebar fixed width="240" rail-width="52"></o-sidebar>');
    el.collapse();
    expect(document.documentElement.style.getPropertyValue('--o-sidebar-offset')).toBe('52px');
  });

  it('does not publish an offset when not fixed', () => {
    mount('<o-sidebar width="240"></o-sidebar>');
    expect(document.documentElement.style.getPropertyValue('--o-sidebar-offset')).toBe('');
  });

  it('clears the offset when a fixed sidebar is removed', () => {
    const el = mount('<o-sidebar fixed></o-sidebar>');
    el.remove();
    expect(document.documentElement.style.getPropertyValue('--o-sidebar-offset')).toBe('');
  });

  it('publishes a zero offset while overlaying a narrow viewport', () => {
    // A fixed sidebar that reserved a gutter would eat a phone screen.
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const el = mount('<o-sidebar fixed width="240"></o-sidebar>');
    expect(el.overlaying).toBe(true);
    expect(document.documentElement.style.getPropertyValue('--o-sidebar-offset')).toBe('0px');
  });

  it('marks itself with a class while overlaying so the page can react', () => {
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const el = mount('<o-sidebar fixed></o-sidebar>');
    expect(el.classList.contains('o-sidebar-overlay')).toBe(true);
  });

  it('uses the breakpoint attribute in its media query', () => {
    const spy = vi.fn().mockImplementation((q: string) => ({
      matches: false, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    (window as any).matchMedia = spy;
    mount('<o-sidebar fixed breakpoint="600"></o-sidebar>');
    expect(spy).toHaveBeenCalledWith('(max-width: 600px)');
  });

  it('survives an environment with no matchMedia', () => {
    delete (window as any).matchMedia;
    expect(() => mount('<o-sidebar fixed></o-sidebar>')).not.toThrow();
  });

  it('defaults to the rail on a narrow viewport', () => {
    // Expanded, a fixed sidebar covers most of a phone screen.
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const el = mount('<o-sidebar fixed></o-sidebar>');
    expect(el.collapsed).toBe(true);
  });

  it('stays expanded on a wide viewport', () => {
    const el = mount('<o-sidebar fixed></o-sidebar>');
    expect(el.collapsed).toBe(false);
  });

  it('does not override an explicit user toggle when the viewport changes', () => {
    let handler: null | (() => void) = null;
    const fire = () => { (handler as (() => void) | null)?.(); };
    let matches = false;
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      get matches() { return matches },
      media: q,
      addEventListener: (_: string, h: () => void) => { handler = h },
      removeEventListener: vi.fn(),
    }));
    const el = mount('<o-sidebar fixed></o-sidebar>');
    el.expand();          // no-op, already expanded
    el.collapse();        // user collapses
    el.expand();          // user deliberately expands again
    matches = true;
    fire();               // viewport goes narrow
    // The user asked for it open; the responsive default must not fight them.
    expect(el.collapsed).toBe(false);
  });

  it('restores the expanded default when the viewport widens again', () => {
    let handler: null | (() => void) = null;
    const fire = () => { (handler as (() => void) | null)?.(); };
    let matches = true;
    (window as any).matchMedia = vi.fn().mockImplementation((q: string) => ({
      get matches() { return matches },
      media: q,
      addEventListener: (_: string, h: () => void) => { handler = h },
      removeEventListener: vi.fn(),
    }));
    const el = mount('<o-sidebar fixed></o-sidebar>');
    expect(el.collapsed).toBe(true);   // auto-collapsed while narrow
    matches = false;
    fire();
    expect(el.collapsed).toBe(false);  // and auto-restored
  });

  it('exposes named slots for search and footer', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    expect(el.shadowRoot?.querySelector('slot[name="search"]')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('slot[name="footer"]')).toBeTruthy();
  });

  it('renders the label into the header', () => {
    const el = mount('<o-sidebar label="Components"></o-sidebar>');
    expect(el.shadowRoot?.querySelector('.title')?.textContent).toContain('Components');
  });

  it('styles come from tokens, not hardcoded colours', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const css = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    const wrap = css.slice(css.indexOf('.wrap {'), css.indexOf('.head {'));
    expect(wrap).toContain('var(--glass-');
    // Scope the literal-colour check to this component's OWN rules. Slicing
    // from the first `:host {` would include glassBaseStyles()' token
    // definitions, which are the palette and are hex/rgba by definition.
    const own = css.slice(css.indexOf('.wrap {'));
    expect(own).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(own).not.toMatch(/\brgba?\(/);
  });

  it('respects prefers-reduced-motion', () => {
    const el = mount('<o-sidebar></o-sidebar>');
    const css = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(css).toContain('prefers-reduced-motion');
  });
});
