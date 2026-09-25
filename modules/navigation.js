import { $, $$, on } from './dom.js';

export function setView(name, onViewChange = () => {}) {
  $$('.view').forEach(view => {
    const active = view.dataset.view === name;
    view.classList.toggle('hidden', !active);
    if (active) {
      view.classList.remove('view-enter');
      void view.offsetWidth;
      view.classList.add('view-enter');
    }
  });
  $$('[data-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.view === name);
  });
  onViewChange(name);
}

export function bindNavigation(onNavigate = () => {}) {
  $$('[data-view]').forEach(button => on(button, 'click', () => onNavigate(button.dataset.view)));
  $$('[data-goto]').forEach(button => on(button, 'click', () => onNavigate(button.dataset.goto)));
}
