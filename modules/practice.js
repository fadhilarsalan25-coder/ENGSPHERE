import { $, $$, on, toggleHidden } from './dom.js';

export function selectPracticeTab(tab) {
  $$('[data-ptab]').forEach(button => {
    button.classList.toggle('active', button.dataset.ptab === tab);
  });
  const quiz = $('#ptab-quiz');
  const ai = $('#ptab-ai');
  toggleHidden(quiz, tab !== 'quiz');
  toggleHidden(ai, tab !== 'ai');
}

export function bindPracticeTabs(onSelect = () => {}) {
  $$('[data-ptab]').forEach(button => on(button, 'click', () => {
    const tab = button.dataset.ptab;
    selectPracticeTab(tab);
    onSelect(tab);
  }));
}

export function renderProgressDots(total, current) {
  return Array.from({ length: total }, (_, index) =>
    `<span class="dot ${index < current ? 'done' : index === current ? 'current' : ''}"></span>`
  ).join('');
}
