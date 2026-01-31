# Changelog

## [1.4.0] - 2026-01-31
### Changed
- This new version is built with Vite
- The plugin will now check if it is running in a module environment and will then not autoload the CSS. You can still set `cssautoload` to `true` if you like, but your bundler (Vite, Webpack) may not like that. In any of these cases, `import` the CSS file yourself.
- Appearance now no longer loads Animate.css on request, but bundles it in the CSS.

### Added
- Added `container-delay` for auto-elements, that influences how a first element of a group can have a different delay.
- Added `initdelay` for when a slide is loaded/reloaded for the first time.

## [1.3.1] - 2023-11-05
### Changed
- Fixed invisible elements in auto-animate slides

## [1.3.0] - 2023-10-25
### Added
- Added word and character appearances

### Changed
- The plugin is totally refactored and uses a promise.
- Fix for fragments as Appearance items
- Another fix for hidden items in speaker view

## [1.2.1] - 2023-07-22
### Added
- Fix for hidden items in print and speaker view


## [1.2.0] - 2023-05-05
### Added
- Version parity with the regular Appearance plugin.