# JavaScript module layout

The application now has an ES-module boundary under `modules/`:

- `state.js` — state shape and defaults
- `storage.js` — localStorage persistence and normalization
- `utils.js` — shared formatting and HTML-safety helpers
- `theme.js` — theme state and DOM synchronization
- `i18n.js` — language constants and language-switching helpers
- `notifications.js` — toast notifications
- `index.js` — public module entry point

`script.js` is intentionally retained as the compatibility runtime in this
commit so existing saved state and event wiring are not changed. The extracted
modules are side-effect free (apart from explicit DOM helper calls) and provide
the seams needed to move the remaining feature groups—materials, quizzes,
review, authentication, navigation, and landing animations—without changing
behavior. Import `modules/index.js` from future feature modules.
