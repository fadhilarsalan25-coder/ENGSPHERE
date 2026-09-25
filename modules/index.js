/*
 * ES-module boundary for the application.
 *
 * The current script.js remains the compatibility runtime while features are
 * extracted into modules incrementally. New code should import shared state,
 * storage, utilities, theme, i18n and notifications from this directory rather
 * than adding more code to script.js.
 */
export { state, STORAGE_KEY, createDefaultState } from './state.js';
export { loadState, saveState } from './storage.js';
export * from './utils.js';
export { applyTheme, toggleTheme } from './theme.js';
export { I18N, applyLanguage, closeAllLangDropdowns } from './i18n.js';
export { showToast } from './notifications.js';
