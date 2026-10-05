import { $, $$, on } from './dom.js';

export function setView(name, onViewChange = () => {}) {
  if (name === 'landing') {
    const landing = $('#landing');
    const app = $('#app');
    if (landing) landing.classList.remove('hidden');
    if (app) app.classList.add('hidden');
    if (typeof onViewChange === 'function') onViewChange(name);
    return;
  }

  const landing = $('#landing');
  const app = $('#app');
  if (landing) landing.classList.add('hidden');
  if (app) app.classList.remove('hidden');

  $$('.view').forEach(view => {
    const active = view.dataset.view === name;
    view.classList.toggle('hidden', !active);
    if (active) {
      view.classList.remove('view-enter');
      void view.offsetWidth;
      view.classList.add('view-enter');
    }
  });

  $$('.topnav button[data-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.view === name);
  });

  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;

  if (typeof onViewChange === 'function') {
    onViewChange(name);
  }
}

export function bindNavigation(onNavigate = () => {}) {
  $$('.topnav button[data-view]').forEach(button => on(button, 'click', () => onNavigate(button.dataset.view)));
  $$('[data-goto]').forEach(button => on(button, 'click', () => onNavigate(button.dataset.goto)));
}
