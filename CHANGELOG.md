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
