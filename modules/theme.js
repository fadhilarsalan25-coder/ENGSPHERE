import { state } from './state.js';
import { saveState } from './storage.js';

export function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  const light = state.theme === 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.body.setAttribute('data-theme', state.theme);
  const label = document.getElementById('themeStatusLabel');
  if (label) {
    if (state.lang === 'id') {
      label.textContent = light ? 'Mode Biru Muda Terang' : 'Mode Biru Navy';
    } else {
      label.textContent = light ? 'Crisp Light Blue Mode' : 'Dark Navy Mode';
    }
  }
  const toggle = document.getElementById('themeToggleBtn');
  if (toggle) toggle.setAttribute('aria-checked', String(light));
  if (persist) saveState();
}

export function toggleTheme(showToast = () => {}) {
  const next = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  if (typeof showToast === 'function') {
    const isId = state.lang === 'id';
    showToast(isId
      ? `Beralih ke ${next === 'light' ? 'Mode Biru Muda Terang' : 'Mode Biru Navy'}`
      : `Switched to ${next === 'light' ? 'Light Blue' : 'Dark Navy'} mode`
    );
  }
}
