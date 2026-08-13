# Changelog

## [Unreleased]

### Added
- `o-panel handle="<selector>"` — drag by your own element (e.g. a panel header) instead of
  the ⠿ button, which is then dropped. Interactive controls inside the handle
  (`select`/`button`/`input`/`textarea`/`a`/`label`/`summary`) still receive their clicks, and
  the ⠿ remains as a fallback until the handle exists (IIFE builds connect before children
  are parsed).
- `o-panel` drag/resize events: `o-drag-start`, `o-drag-move`, `o-drag-end`,
  `o-resize-start`, `o-resize-move`, `o-resize-end`. Consumers no longer have to patch
  internals to react to a drop.
- `o-panel` **drop zone** overlay — dashed outline of where the panel will land.
  Redirect it from `o-drag-move` via `detail.setDropZone(rect)`, or hide it with `null`.
- Overlays are tagged `data-owc-overlay="grid" | "dropzone"` for styling/targeting.

### Fixed
- **`o-panel` handles no longer scroll with the content.** `.panel` was the scrolling
  box *and* the positioning context for the ⠿ / resize handles, so they drifted as you
  scrolled. Content now lives in an inner `.content` scroller and the handles are its
  siblings, pinned to the panel. When `resize` is set, the scroller is inset 6px so the
  scrollbars don't sit underneath the resize strips.
- **Scrollbars are visible again.** `glassScrollbarStyles` hard-coded white at 0.12
  alpha, i.e. invisible on light themes ("this panel has no scrollbar"). Colours are now
  glass tokens (`--glass-scroll-thumb`, `--glass-scroll-thumb-hover`,
  `--glass-scroll-track`), the bar is 9px, the track is tinted, and **both axes are
  sized** so horizontal overflow gets a bar too.
- Snap grid was effectively invisible on light backgrounds: it drew white lines at
  0.12 alpha regardless of theme. Now theme-aware (dark lines on light themes),
  stronger, with every 5th line emphasised.
- The dragged panel is raised above the overlays instead of being criss-crossed by them.
- Grid/drop-zone overlays are recreated if the page has replaced `document.body`
  (the cached node was orphaned and nothing was drawn).
- A stray `mouseup` no longer emits a drag/resize end when nothing was in progress.

## [1.2.1] - 2026-04-08

### Fixed
- `o-tabs` now works with IIFE bundles loaded in `<head>` (deferred child parsing)
- `o-dropdown` no longer double-toggles when used with `o-button`
- Demo page visibility on dark backgrounds (dark theme token overrides)

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
