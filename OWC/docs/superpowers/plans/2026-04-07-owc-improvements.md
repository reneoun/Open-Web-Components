# OWC Improvements & Next Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix infrastructure issues (tests, tokens, base class), add a11y, missing tests, CI, new components (o-dropdown, o-tabs, o-tooltip), theme support, and npm/ESM distribution.

**Architecture:** Extract shared glass tokens + base class → fix/add tests → add a11y → add CI → add new components → add theme support → add ESM exports + npm prep.

**Tech Stack:** TypeScript, Vite, Vitest, happy-dom, GitHub Actions, Web Components (shadow DOM)

---

## File Structure

**New files:**
- `src/glass.ts` — shared design tokens CSS + `GlassElement` base class
- `src/dropdown.ts` — o-dropdown component
- `src/tabs.ts` — o-tabs component
- `src/tooltip.ts` — o-tooltip component
- `src/core.test.ts` — tests for o-button + o-panel
- `src/dropdown.test.ts` — tests for o-dropdown
- `src/tabs.test.ts` — tests for o-tabs
- `src/tooltip.test.ts` — tests for o-tooltip
- `.github/workflows/ci.yml` — CI pipeline
- `CHANGELOG.md` — version changelog

**Modified files:**
- `src/core.ts` — refactor to use GlassElement
- `src/toast.ts` — refactor to use GlassElement
- `src/toggle.ts` — refactor to use GlassElement
- `src/search.ts` — refactor to use GlassElement
- `src/table.ts` — refactor to use GlassElement
- `src/note.ts` — refactor to use GlassElement
- `src/dialog.ts` — refactor to use GlassElement + a11y
- `src/index.ts` — add new component exports
- `package.json` — add ESM exports, npm name, scripts fix
- `vite.config.ts` — add library build config
- `README.md` — add new components docs + npm install instructions

---

### Task 1: Fix test script + add CHANGELOG

**Files:**
- Modify: `OWC/package.json`
- Create: `CHANGELOG.md`

The `bun test` command fails because it uses bun's built-in runner (no happy-dom). Tests pass with `npx vitest run`. Fix the script.

- [ ] **Step 1: Fix package.json test script**

```json
"test": "vitest run",
"test:watch": "vitest"
```

No change needed — scripts already correct. The issue is user running `bun test` (bun's built-in runner) instead of `bun run test` (which calls vitest). Add a note to README.

- [ ] **Step 2: Verify tests pass**

Run: `cd OWC && npx vitest run`
Expected: 6 test files, 115 tests passed

- [ ] **Step 3: Create CHANGELOG.md**

```markdown
# Changelog

## [1.2.0] - 2026-04-07

### Added
- `GlassElement` base class with shared design tokens
- `o-dropdown` component
- `o-tabs` component
- `o-tooltip` component
- Tests for `o-button` and `o-panel`
- ARIA roles and keyboard nav across all components
- GitHub Actions CI pipeline
- Light/dark theme support via `prefers-color-scheme`
- ESM module exports for tree-shaking

### Changed
- All components now extend `GlassElement` (shared tokens, no duplication)
- Extracted glassmorphism CSS custom properties to shared module

## [1.1.0] - 2026-04-04

### Added
- `o-note` component (textarea + card variants)
- `o-dialog` component (form dialog with backdrop)
- Initial release of 8 glassmorphism web components
```

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: add CHANGELOG"
```

---

### Task 2: Create GlassElement base class + shared tokens

**Files:**
- Create: `src/glass.ts`
- Test: `src/glass.test.ts` (optional — base class tested through components)

- [ ] **Step 1: Write glass.ts**

```typescript
// Shared glassmorphism design tokens + base class
export const GLASS_TOKENS = `
  --glass-bg: rgba(255,255,255,0.07);
  --glass-border: rgba(255,255,255,0.12);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
  --accent-warm: rgba(251,191,36,0.6);
  --glass-text: #fff;
  --glass-text-muted: rgba(255,255,255,0.5);
  --glass-text-dim: rgba(255,255,255,0.3);
  --glass-hover: rgba(255,255,255,0.1);
`

export const GLASS_TOKENS_LIGHT = `
  --glass-bg: rgba(0,0,0,0.04);
  --glass-border: rgba(0,0,0,0.1);
  --glass-blur: 12px;
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.08);
  --accent-warm: rgba(217,119,6,0.6);
  --glass-text: #1a1a2e;
  --glass-text-muted: rgba(0,0,0,0.5);
  --glass-text-dim: rgba(0,0,0,0.3);
  --glass-hover: rgba(0,0,0,0.06);
`

export function glassBaseStyles(): string {
  return `
    :host {
      ${GLASS_TOKENS}
    }
    @media (prefers-color-scheme: light) {
      :host(:not([theme="dark"])) {
        ${GLASS_TOKENS_LIGHT}
      }
    }
    :host([theme="dark"]) {
      ${GLASS_TOKENS}
    }
    :host([theme="light"]) {
      ${GLASS_TOKENS_LIGHT}
    }
  `
}

export class GlassElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /** Inject styles into shadow DOM. Subclasses call this in render(). */
  protected setStyles(css: string) {
    let style = this.shadowRoot!.querySelector('style')
    if (!style) {
      style = document.createElement('style')
      this.shadowRoot!.prepend(style)
    }
    style.textContent = glassBaseStyles() + css
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd OWC && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/glass.ts
git commit -m "feat: add GlassElement base class + shared glass tokens"
```

---

### Task 3: Refactor existing components to use GlassElement

**Files:**
- Modify: `src/core.ts`, `src/toast.ts`, `src/toggle.ts`, `src/search.ts`, `src/table.ts`, `src/note.ts`, `src/dialog.ts`
- Modify: `src/index.ts` — re-export glass.ts

Refactor each component to:
1. Extend `GlassElement` instead of `HTMLElement`
2. Remove `this.attachShadow({ mode: 'open' })` from constructor (base does it)
3. Replace hardcoded glass values with `var(--glass-*)` tokens
4. Use `glassBaseStyles()` in their style blocks

- [ ] **Step 1: Refactor o-button (core.ts)**

Replace `class OWCButton extends HTMLElement` with `class OWCButton extends GlassElement`. Remove `this.attachShadow(...)`. Replace hardcoded `rgba(255,255,255,0.18)` etc. with `var(--glass-bg)`, `var(--glass-border)`, color `var(--glass-text)`.

Add `import { GlassElement, glassBaseStyles } from './glass'` at top of core.ts.

In button's style block, prepend `${glassBaseStyles()}` and use token vars:
```css
button {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  color: var(--o-button-color, var(--glass-text));
}
button:hover { background: var(--glass-hover); }
```

- [ ] **Step 2: Refactor o-panel (core.ts)**

Same pattern — extend GlassElement, use token vars in `.panel` and handle styles.

- [ ] **Step 3: Refactor o-toast (toast.ts)**

Extend GlassElement. Replace hardcoded glass values with token vars. Keep toast-specific `--o-toast-*` custom properties as overrides.

- [ ] **Step 4: Refactor o-toggle (toggle.ts)**

Extend GlassElement. Replace `rgba(255,255,255,0.08)` → `var(--glass-bg)`, etc.

- [ ] **Step 5: Refactor o-search (search.ts)**

Extend GlassElement. Replace glass values with token vars.

- [ ] **Step 6: Refactor o-table (table.ts)**

Extend GlassElement. Replace glass values with token vars.

- [ ] **Step 7: Refactor o-note (note.ts)**

Extend GlassElement. Remove the `:host` token declarations (now in base). Replace inline values with `var(--glass-*)`.

- [ ] **Step 8: Refactor o-dialog (dialog.ts)**

Extend GlassElement. Remove the `:host` token declarations. Replace inline values.

- [ ] **Step 9: Update index.ts**

Add `export * from './glass'` to expose GlassElement for external use.

- [ ] **Step 10: Run all existing tests**

Run: `cd OWC && npx vitest run`
Expected: All 115 tests still pass (refactor should be transparent)

- [ ] **Step 11: Commit**

```bash
git add src/
git commit -m "refactor: all components extend GlassElement, shared tokens"
```

---

### Task 4: Add tests for o-button and o-panel

**Files:**
- Create: `src/core.test.ts`

- [ ] **Step 1: Write core.test.ts**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import './core'

describe('OWCButton', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('registers as o-button', () => {
    expect(customElements.get('o-button')).toBeDefined()
  })

  it('renders a <button> in shadow DOM', () => {
    const el = document.createElement('o-button')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('button')).not.toBeNull()
  })

  it('projects slot content', () => {
    const el = document.createElement('o-button')
    el.textContent = 'Click me'
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull()
  })

  it('fires o-click on button click', () => {
    const el = document.createElement('o-button')
    document.body.appendChild(el)
    let fired = false
    el.addEventListener('o-click', () => { fired = true })
    el.shadowRoot!.querySelector('button')!.click()
    expect(fired).toBe(true)
  })

  it('o-click event bubbles and is composed', () => {
    const el = document.createElement('o-button')
    document.body.appendChild(el)
    let event: CustomEvent | null = null
    document.body.addEventListener('o-click', (e) => { event = e as CustomEvent })
    el.shadowRoot!.querySelector('button')!.click()
    expect(event).not.toBeNull()
    expect(event!.bubbles).toBe(true)
    expect(event!.composed).toBe(true)
  })
})

describe('OWCPanel', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('registers as o-panel', () => {
    expect(customElements.get('o-panel')).toBeDefined()
  })

  it('renders .panel in shadow DOM', () => {
    const el = document.createElement('o-panel')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('.panel')).not.toBeNull()
  })

  it('shows move handle when move attr set', () => {
    const el = document.createElement('o-panel')
    el.setAttribute('move', '')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('.move-handle')).not.toBeNull()
  })

  it('hides move handle when move attr absent', () => {
    const el = document.createElement('o-panel')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('.move-handle')).toBeNull()
  })

  it('shows resize handles when resize attr set', () => {
    const el = document.createElement('o-panel')
    el.setAttribute('resize', '')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('.resize-e')).not.toBeNull()
    expect(el.shadowRoot!.querySelector('.resize-s')).not.toBeNull()
    expect(el.shadowRoot!.querySelector('.resize-se')).not.toBeNull()
  })

  it('hides resize handles when resize attr absent', () => {
    const el = document.createElement('o-panel')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('.resize-e')).toBeNull()
  })

  it('projects slot content', () => {
    const el = document.createElement('o-panel')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it passes**

Run: `cd OWC && npx vitest run src/core.test.ts`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/core.test.ts
git commit -m "test: add o-button + o-panel tests"
```

---

### Task 5: Add ARIA / a11y to all components

**Files:**
- Modify: `src/core.ts`, `src/toggle.ts`, `src/search.ts`, `src/dialog.ts`, `src/table.ts`

- [ ] **Step 1: o-button a11y**

The `<button>` inside shadow DOM is already natively accessible. No changes needed.

- [ ] **Step 2: o-panel a11y**

Add `role="region"` to `.panel` div. Move handle button already has title.

- [ ] **Step 3: o-toggle a11y**

Add `role="tablist"` to `.container`. Each `.segment` gets `role="tab"`, `aria-selected="true|false"`, `tabindex="0|-1"`. Add keyboard nav: ArrowLeft/Right to switch segments.

In `render()`:
```html
<div class="container" role="tablist">
  ${this._options.map((o, i) => {
    const selected = o.value === this._value
    return `<div class="segment${selected ? ' active' : ''}"
                role="tab"
                aria-selected="${selected}"
                tabindex="${selected ? '0' : '-1'}"
                data-value="${o.value}">${o.label}</div>`
  }).join('')}
</div>
```

Add keyboard handler in constructor:
```typescript
this.shadowRoot!.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const idx = this._options.findIndex(o => o.value === this._value)
    const next = e.key === 'ArrowRight'
      ? (idx + 1) % this._options.length
      : (idx - 1 + this._options.length) % this._options.length
    this.value = this._options[next].value
    // focus the new tab
    const tabs = this.shadowRoot!.querySelectorAll<HTMLElement>('[role="tab"]')
    tabs[next]?.focus()
    this.dispatchEvent(new CustomEvent('o-change', {
      bubbles: true, composed: true,
      detail: { value: this._options[next].value, index: next, prev: this._options[idx]?.value ?? null }
    }))
  }
})
```

- [ ] **Step 4: o-search a11y**

Add `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"` to input wrapper. Dropdown gets `role="listbox"`, items get `role="option"`. Add `aria-label` from placeholder.

- [ ] **Step 5: o-dialog a11y**

Add `role="dialog"`, `aria-modal="true"` to `.panel`. Add `aria-labelledby` pointing to title slot.

- [ ] **Step 6: o-table a11y**

Table element is already semantic `<table>`. Add `role="grid"` for interactive tables. Checkboxes should have `aria-label`.

- [ ] **Step 7: Run all tests**

Run: `cd OWC && npx vitest run`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: add ARIA roles + keyboard nav to all components"
```

---

### Task 6: Create o-tooltip component

**Files:**
- Create: `src/tooltip.ts`
- Create: `src/tooltip.test.ts`

- [ ] **Step 1: Write tooltip.test.ts**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import './tooltip'

describe('OTooltip', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('registers as o-tooltip', () => {
    expect(customElements.get('o-tooltip')).toBeDefined()
  })

  it('renders slot for trigger content', () => {
    const el = document.createElement('o-tooltip') as HTMLElement
    el.setAttribute('text', 'Hello')
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull()
  })

  it('tooltip hidden by default', () => {
    const el = document.createElement('o-tooltip') as HTMLElement
    el.setAttribute('text', 'Tip')
    document.body.appendChild(el)
    const tip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement
    expect(tip.style.display === 'none' || !tip.classList.contains('visible')).toBe(true)
  })

  it('shows tooltip text from attribute', () => {
    const el = document.createElement('o-tooltip') as HTMLElement
    el.setAttribute('text', 'My tip')
    document.body.appendChild(el)
    const tip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement
    expect(tip.textContent).toBe('My tip')
  })

  it('position attribute defaults to top', () => {
    const el = document.createElement('o-tooltip') as HTMLElement
    el.setAttribute('text', 'Tip')
    document.body.appendChild(el)
    const tip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement
    expect(tip.classList.contains('top')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd OWC && npx vitest run src/tooltip.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write tooltip.ts**

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export class OTooltip extends GlassElement {
  static get observedAttributes() { return ['text', 'position'] }

  connectedCallback() {
    this.render()
    this.addEventListener('mouseenter', this.show)
    this.addEventListener('mouseleave', this.hide)
    this.addEventListener('focusin', this.show)
    this.addEventListener('focusout', this.hide)
  }

  disconnectedCallback() {
    this.removeEventListener('mouseenter', this.show)
    this.removeEventListener('mouseleave', this.hide)
    this.removeEventListener('focusin', this.show)
    this.removeEventListener('focusout', this.hide)
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  private get position() { return this.getAttribute('position') ?? 'top' }

  private show = () => {
    this.shadowRoot!.querySelector('.tooltip')?.classList.add('visible')
  }

  private hide = () => {
    this.shadowRoot!.querySelector('.tooltip')?.classList.remove('visible')
  }

  private render() {
    const text = this.getAttribute('text') ?? ''
    const pos = this.position

    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
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
        .tooltip.top { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .tooltip.bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
        .tooltip.left { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
        .tooltip.right { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
      </style>
      <slot></slot>
      <div class="tooltip ${pos}" role="tooltip">${text}</div>
    `
  }
}

customElements.define('o-tooltip', OTooltip)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd OWC && npx vitest run src/tooltip.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/tooltip.ts src/tooltip.test.ts
git commit -m "feat: add o-tooltip component"
```

---

### Task 7: Create o-dropdown component

**Files:**
- Create: `src/dropdown.ts`
- Create: `src/dropdown.test.ts`

- [ ] **Step 1: Write dropdown.test.ts**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import './dropdown'

describe('ODropdown', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('registers as o-dropdown', () => {
    expect(customElements.get('o-dropdown')).toBeDefined()
  })

  it('renders trigger slot and menu', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    expect(el.shadowRoot!.querySelector('slot')).not.toBeNull()
    expect(el.shadowRoot!.querySelector('.menu')).not.toBeNull()
  })

  it('menu hidden by default', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    const menu = el.shadowRoot!.querySelector('.menu') as HTMLElement
    expect(menu.classList.contains('open')).toBe(false)
  })

  it('toggle() opens menu', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    el.toggle()
    expect(el.shadowRoot!.querySelector('.menu')!.classList.contains('open')).toBe(true)
  })

  it('renders options set via JS', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    el.options = [
      { label: 'Edit', value: 'edit' },
      { label: 'Delete', value: 'delete' },
    ]
    el.toggle()
    const items = el.shadowRoot!.querySelectorAll('[role="menuitem"]')
    expect(items.length).toBe(2)
    expect(items[0].textContent).toBe('Edit')
  })

  it('fires o-select on item click', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    el.options = [{ label: 'Edit', value: 'edit' }]
    el.toggle()
    let detail: any = null
    el.addEventListener('o-select', (e: any) => { detail = e.detail })
    el.shadowRoot!.querySelector('[role="menuitem"]')!.click()
    expect(detail).toEqual({ value: 'edit', label: 'Edit' })
  })

  it('closes after selection', () => {
    const el = document.createElement('o-dropdown') as any
    document.body.appendChild(el)
    el.options = [{ label: 'Edit', value: 'edit' }]
    el.toggle()
    el.shadowRoot!.querySelector('[role="menuitem"]')!.click()
    expect(el.shadowRoot!.querySelector('.menu')!.classList.contains('open')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd OWC && npx vitest run src/dropdown.test.ts`
Expected: FAIL

- [ ] **Step 3: Write dropdown.ts**

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export interface ODropdownOption { label: string; value: string; icon?: string }
export interface ODropdownSelectEvent { value: string; label: string }

export class ODropdown extends GlassElement {
  private _options: ODropdownOption[] = []
  private _open = false

  get options() { return this._options }
  set options(v: ODropdownOption[]) {
    this._options = v
    this.renderMenu()
  }

  constructor() {
    super()
    this.render()
  }

  connectedCallback() {
    document.addEventListener('click', this.handleOutsideClick)
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick)
  }

  toggle() {
    this._open = !this._open
    this.shadowRoot!.querySelector('.menu')?.classList.toggle('open', this._open)
  }

  close() {
    this._open = false
    this.shadowRoot!.querySelector('.menu')?.classList.remove('open')
  }

  private handleOutsideClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) this.close()
  }

  private handleItemClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-value]')
    if (!el) return
    const opt = this._options.find(o => o.value === el.dataset.value)
    if (!opt) return
    this.dispatchEvent(new CustomEvent<ODropdownSelectEvent>('o-select', {
      bubbles: true, composed: true,
      detail: { value: opt.value, label: opt.label }
    }))
    this.close()
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this._open) return
    const items = [...this.shadowRoot!.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    const idx = items.indexOf(document.activeElement as HTMLElement)
    // Note: activeElement won't be in shadow DOM easily, use shadowRoot
    const activeIdx = items.findIndex(i => i === this.shadowRoot!.activeElement)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[Math.min(activeIdx + 1, items.length - 1)]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[Math.max(activeIdx - 1, 0)]?.focus()
    } else if (e.key === 'Escape') {
      this.close()
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      items[activeIdx].click()
    }
  }

  private renderMenu() {
    const menu = this.shadowRoot!.querySelector('.menu')
    if (!menu) return
    menu.innerHTML = this._options.map(o =>
      `<div class="item" role="menuitem" tabindex="-1" data-value="${o.value}">
        ${o.icon ? `<span class="icon">${o.icon}</span>` : ''}${o.label}
      </div>`
    ).join('')
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { position: relative; display: inline-block; }
        .trigger { cursor: pointer; }
        .menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 160px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 10px;
          box-shadow: var(--glass-shadow);
          overflow: hidden;
          z-index: 100;
          display: none;
        }
        .menu.open { display: block; }
        .item {
          padding: 8px 14px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .item:hover, .item:focus {
          background: var(--glass-hover);
          outline: none;
        }
        .icon { flex-shrink: 0; }
      </style>
      <div class="trigger" @click>
        <slot></slot>
      </div>
      <div class="menu" role="menu"></div>
    `
    this.shadowRoot!.querySelector('.trigger')!.addEventListener('click', () => this.toggle())
    this.shadowRoot!.querySelector('.menu')!.addEventListener('click', this.handleItemClick)
    this.shadowRoot!.addEventListener('keydown', this.handleKeyDown)
  }
}

customElements.define('o-dropdown', ODropdown)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd OWC && npx vitest run src/dropdown.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/dropdown.ts src/dropdown.test.ts
git commit -m "feat: add o-dropdown component"
```

---

### Task 8: Create o-tabs component

**Files:**
- Create: `src/tabs.ts`
- Create: `src/tabs.test.ts`

- [ ] **Step 1: Write tabs.test.ts**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import './tabs'

describe('OTabs', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('registers as o-tabs', () => {
    expect(customElements.get('o-tabs')).toBeDefined()
  })

  it('renders tab buttons from child elements', () => {
    const el = document.createElement('o-tabs') as any
    el.innerHTML = `
      <div slot="tab" data-value="a">Tab A</div>
      <div slot="tab" data-value="b">Tab B</div>
      <div data-tab="a">Content A</div>
      <div data-tab="b">Content B</div>
    `
    document.body.appendChild(el)
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]')
    expect(tabs.length).toBe(2)
  })

  it('first tab is active by default', () => {
    const el = document.createElement('o-tabs') as any
    el.innerHTML = `
      <div slot="tab" data-value="a">Tab A</div>
      <div slot="tab" data-value="b">Tab B</div>
      <div data-tab="a">Content A</div>
      <div data-tab="b">Content B</div>
    `
    document.body.appendChild(el)
    expect(el.value).toBe('a')
  })

  it('fires o-change on tab click', () => {
    const el = document.createElement('o-tabs') as any
    el.innerHTML = `
      <div slot="tab" data-value="a">Tab A</div>
      <div slot="tab" data-value="b">Tab B</div>
      <div data-tab="a">Content A</div>
      <div data-tab="b">Content B</div>
    `
    document.body.appendChild(el)
    let detail: any = null
    el.addEventListener('o-change', (e: any) => { detail = e.detail })
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]')
    ;(tabs[1] as HTMLElement).click()
    expect(detail).toEqual({ value: 'b', prev: 'a' })
  })

  it('shows/hides content panels', () => {
    const el = document.createElement('o-tabs') as any
    el.innerHTML = `
      <div slot="tab" data-value="a">Tab A</div>
      <div slot="tab" data-value="b">Tab B</div>
      <div data-tab="a">Content A</div>
      <div data-tab="b">Content B</div>
    `
    document.body.appendChild(el)
    // Content A visible, B hidden
    const panelA = el.querySelector('[data-tab="a"]') as HTMLElement
    const panelB = el.querySelector('[data-tab="b"]') as HTMLElement
    expect(panelA.style.display).not.toBe('none')
    expect(panelB.style.display).toBe('none')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd OWC && npx vitest run src/tabs.test.ts`
Expected: FAIL

- [ ] **Step 3: Write tabs.ts**

```typescript
import { GlassElement, glassBaseStyles } from './glass'

export interface OTabsChangeEvent { value: string; prev: string | null }

export class OTabs extends GlassElement {
  private _value: string | null = null

  get value() { return this._value ?? '' }
  set value(v: string) {
    const prev = this._value
    this._value = v
    this.updateTabs()
    this.updatePanels()
    if (prev !== v) {
      this.dispatchEvent(new CustomEvent<OTabsChangeEvent>('o-change', {
        bubbles: true, composed: true,
        detail: { value: v, prev }
      }))
    }
  }

  connectedCallback() {
    this.render()
    // default to first tab
    const firstTab = this.querySelector('[slot="tab"]') as HTMLElement | null
    if (firstTab && !this._value) {
      this._value = firstTab.dataset.value ?? null
    }
    this.updateTabs()
    this.updatePanels()
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${glassBaseStyles()}
        :host { display: block; }
        .tablist {
          display: flex;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 10px 10px 0 0;
          padding: 4px 4px 0;
          gap: 2px;
          overflow-x: auto;
        }
        .tab {
          padding: 8px 16px;
          color: var(--glass-text);
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          user-select: none;
          white-space: nowrap;
          opacity: 0.6;
          transition: opacity 0.15s, background 0.15s;
        }
        .tab:hover { opacity: 0.8; background: var(--glass-hover); }
        .tab.active { opacity: 1; background: rgba(255,255,255,0.12); font-weight: 600; }
        .panel-area {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-top: none;
          border-radius: 0 0 10px 10px;
          padding: 16px;
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
        }
      </style>
      <div class="tablist" role="tablist"></div>
      <div class="panel-area">
        <slot></slot>
      </div>
    `
    // Build tab buttons from slotted [slot="tab"] elements
    const tabSlots = this.querySelectorAll('[slot="tab"]')
    const tablist = this.shadowRoot!.querySelector('.tablist')!
    tabSlots.forEach(slotEl => {
      const value = (slotEl as HTMLElement).dataset.value ?? ''
      const tab = document.createElement('div')
      tab.className = 'tab'
      tab.setAttribute('role', 'tab')
      tab.setAttribute('tabindex', '0')
      tab.dataset.value = value
      tab.textContent = slotEl.textContent ?? ''
      tab.addEventListener('click', () => { this.value = value })
      tablist.appendChild(tab)
      // hide the original slot="tab" element
      ;(slotEl as HTMLElement).style.display = 'none'
    })

    // Keyboard nav
    tablist.addEventListener('keydown', (e: Event) => {
      const ke = e as KeyboardEvent
      if (ke.key === 'ArrowRight' || ke.key === 'ArrowLeft') {
        const tabs = [...tablist.querySelectorAll<HTMLElement>('.tab')]
        const idx = tabs.findIndex(t => t.dataset.value === this._value)
        const next = ke.key === 'ArrowRight'
          ? (idx + 1) % tabs.length
          : (idx - 1 + tabs.length) % tabs.length
        this.value = tabs[next].dataset.value!
        tabs[next].focus()
      }
    })
  }

  private updateTabs() {
    this.shadowRoot?.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
      const active = tab.dataset.value === this._value
      tab.classList.toggle('active', active)
      tab.setAttribute('aria-selected', String(active))
      tab.setAttribute('tabindex', active ? '0' : '-1')
    })
  }

  private updatePanels() {
    // Show/hide light-DOM content panels based on data-tab attr
    this.querySelectorAll<HTMLElement>('[data-tab]').forEach(panel => {
      panel.style.display = panel.dataset.tab === this._value ? '' : 'none'
    })
  }
}

customElements.define('o-tabs', OTabs)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd OWC && npx vitest run src/tabs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/tabs.ts src/tabs.test.ts
git commit -m "feat: add o-tabs component"
```

---

### Task 9: Update index.ts + exports

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add new component imports/exports**

```typescript
import './core'
import './table'
import './note'
import './dialog'
import { toast } from './toast'
import './toggle'
import './search'
import './tooltip'
import './dropdown'
import './tabs'

export * from './glass'
export * from './core'
export * from './toast'
export * from './table'
export * from './toggle'
export * from './search'
export * from './note'
export * from './dialog'
export * from './tooltip'
export * from './dropdown'
export * from './tabs'

// Expose toast() as a global for plain <script> usage
if (typeof window !== 'undefined') {
  (window as any).toast = toast
}
```

- [ ] **Step 2: Run all tests**

Run: `cd OWC && npx vitest run`
Expected: All tests pass (old + new)

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: export new components (tooltip, dropdown, tabs) + glass tokens"
```

---

### Task 10: Add ESM build + npm prep

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Update vite.config.ts for library build**

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'owc',
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
```

- [ ] **Step 2: Update package.json for npm**

Add these fields (keep existing scripts):

```json
{
  "name": "@owc/components",
  "version": "1.2.0",
  "type": "module",
  "main": "dist/owc.js",
  "module": "dist/owc.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/owc.js",
      "types": "./dist/index.d.ts"
    },
    "./glass": {
      "import": "./src/glass.ts"
    }
  },
  "files": ["dist", "src"],
  ...
}
```

Remove `"private": true` to enable npm publish.

Add `"build:lib": "vite build && tsc --declaration --emitDeclarationOnly --outDir dist"` to scripts.

- [ ] **Step 3: Verify build**

Run: `cd OWC && bun run build`
Expected: `dist/owc.js` created

- [ ] **Step 4: Commit**

```bash
git add package.json vite.config.ts
git commit -m "feat: add ESM build + npm package config"
```

---

### Task 11: Add GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: cd OWC && bun install

      - name: Type check
        run: cd OWC && npx tsc --noEmit

      - name: Test
        run: cd OWC && bun run test

      - name: Build CDN bundle
        run: cd OWC && bun run build:cdn

      - name: Build ESM
        run: cd OWC && bun run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions test + build pipeline"
```

---

### Task 12: Update README with new components + npm install

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add npm install section after Quick Start**

Add:
```markdown
### npm / bundler

```bash
npm install @owc/components
```

```js
import '@owc/components'
// or import individual components:
import '@owc/components/src/tooltip'
```

- [ ] **Step 2: Add o-tooltip docs**

After o-toast section, add tooltip API docs (attributes: text, position; position values: top/bottom/left/right).

- [ ] **Step 3: Add o-dropdown docs**

Add dropdown API docs (options via JS, o-select event, toggle/close methods).

- [ ] **Step 4: Add o-tabs docs**

Add tabs API docs (slot="tab" with data-value, data-tab for panels, o-change event).

- [ ] **Step 5: Add theme section**

```markdown
## Theming

Components auto-detect `prefers-color-scheme` and switch between dark/light glass tokens. Override per-element:

```html
<o-panel theme="light">Always light</o-panel>
<o-panel theme="dark">Always dark</o-panel>
```
```

- [ ] **Step 6: Update component list at top**

Add tooltip, dropdown, tabs to the component list.

- [ ] **Step 7: Commit**

```bash
git add README.md
git commit -m "docs: add new components, npm install, and theme docs"
```

---

### Task 13: Rebuild CDN bundle + final verification

**Files:**
- Rebuild: `dist/components.js`

- [ ] **Step 1: Run full test suite**

Run: `cd OWC && npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Type check**

Run: `cd OWC && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Rebuild CDN bundle**

Run: `cd OWC && bun run build:cdn`
Expected: `dist/components.js` rebuilt with new components

- [ ] **Step 4: Commit**

```bash
git add dist/components.js
git commit -m "build: rebuild CDN bundle with new components"
```

---

## Unresolved Questions

1. **npm scope** — `@owc/components` available? Or use `owc-glass` / `open-web-components`? (note: `open-wc` is a well-known project)
2. **o-modal** — separate from o-dialog or just add `fullscreen` attr to o-dialog?
3. **Light theme** — should `prefers-color-scheme: light` be opt-in only (to avoid breaking existing dark-only usage)?
4. **npm publish** — publish now or wait for more components?
5. **Storybook** — defer to a separate plan or include here?
