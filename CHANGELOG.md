# Azota God Mode — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [15.3.0] — 2026-06-28

### Added
- Combined Cinematic Cyberpunk Dark Emerald UI into single overlay
- Auto Pilot system with loop review & auto submit
- MathJax / No-Reload File Sync
- Result Page Learn: extract correct answers from completed tests
- Đúng/Sai (True/False) support with pattern filling
- Tự luận (Essay) detection & answer extraction
- Composite Pilot input format: `time,percent,submit,formula`
- T/F scoring formula support: `equal`, `tapered`, or custom values

### Changed
- Refactored all functions into modular architecture
- Improved fuzzy matching algorithm (60% character overlap threshold)
- Enhanced question detection across multiple DOM layouts
- Better CSS animations and visual feedback
- Draggable UI with position persistence

### Fixed
- Multiple question selector fallback chain
- Essay native setter for React-controlled textareas
- Pilot pause/resume state management
- Info icon tooltip toggle behavior

## [14.0.0] — 2026-05-01

### Added
- Result page answer extraction
- Highlight correct answers on result page
- Quick Fill ABCD buttons
- Random answer mode

### Changed
- Simplified DB key structure

## [13.0.0] — 2026-04-10

### Added
- Initial Learn/Review system
- LocalStorage memory backend
- Keyboard shortcuts (Alt+L/R/P/S)
- Toggle visibility with backtick (`) key
