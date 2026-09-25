/*
 * EngSphere module entry point.
 *
 * The compatibility import is intentionally kept at the edge while the legacy
 * runtime is migrated feature-by-feature into modules/. This keeps the app
 * working for existing users and gives every new feature a real ES module
 * boundary.
 */
import './state.js';
import './storage.js';
import './utils.js';
import './notifications.js';
import './theme.js';
import './i18n.js';

// Keep the existing runtime behaviour during the incremental migration.
// script.js is not referenced by index.html directly anymore.
import '../script.js';
