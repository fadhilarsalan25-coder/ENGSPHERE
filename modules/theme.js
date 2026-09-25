import { state } from './state.js';
import { saveState } from './storage.js';

export function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  const light = state.theme === 'light';
  document.documentElement.toggleAttribute('data-theme', light);
  document.body.toggleAttribute('data-theme', light);
  document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
  document.body.setAttribute('data-theme', light ? 'light' : 'dark');
  const label = document.getElementById('themeStatusLabel');
  if (label) label.textContent = light ? 'Crisp Light Mode' : 'Dark Navy Mode';
  const toggle = document.getElementById('themeToggleBtn');
  if (toggle) toggle.setAttribute('aria-checked', String(light));
  if (persist) saveState();
}

export function toggleTheme(showToast = () => {}) {
  const next = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} mode`);
}
