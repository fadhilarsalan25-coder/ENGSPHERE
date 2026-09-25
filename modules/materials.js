import { $, $$, on, toggleHidden } from './dom.js';

const MATERIAL_PANELS = {
  tenses: 'msub-tenses',
  tobe: 'msub-tobe',
  vocabulary: 'msub-vocabulary',
  grammar: 'msub-grammar'
};

export function selectMaterial(material) {
  $$('[data-msub]').forEach(button => {
    button.classList.toggle('active', button.dataset.msub === material);
  });
  Object.entries(MATERIAL_PANELS).forEach(([key, id]) => {
    const panel = $(`#${id}`);
    if (!panel) return;
    const active = key === material;
    toggleHidden(panel, !active);
    if (active) {
      panel.classList.remove('tab-pane-enter');
      void panel.offsetWidth;
      panel.classList.add('tab-pane-enter');
    }
  });
}

export function bindMaterialTabs(onSelect = () => {}) {
  $$('[data-msub]').forEach(button => on(button, 'click', () => {
    const material = button.dataset.msub;
    selectMaterial(material);
    onSelect(material);
  }));
}
