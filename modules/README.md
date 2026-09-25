# EngSphere JavaScript modules

The browser entry point is `modules/app.js`, loaded as an ES module by `index.html`.

## Layout

- `app.js` — application boundary and compatibility bridge
- `state.js`, `storage.js` — state and persistence
- `utils.js`, `dom.js`, `notifications.js` — shared infrastructure
- `theme.js`, `i18n.js` — cross-cutting UI preferences
- `navigation.js` — view navigation
- `materials.js` — materials tab behaviour
- `practice.js` — practice tab and quiz UI helpers

The legacy runtime is currently imported only from `app.js`. This is deliberate:
it preserves localStorage data and all existing behaviour while individual feature
areas are extracted without a risky all-at-once rewrite. New code must be added
to a focused module and imported through `app.js`; the compatibility import can
be removed after the remaining legacy handlers have been migrated.

All modules use explicit imports/exports and browser-compatible relative paths.
