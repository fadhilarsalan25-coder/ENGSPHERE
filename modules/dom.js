/* Shared DOM helpers for feature modules. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function on(element, event, handler, options) {
  element?.addEventListener(event, handler, options);
  return element;
}

export function toggleHidden(element, hidden) {
  element?.classList.toggle('hidden', hidden);
}

export function setText(selector, value, root = document) {
  const element = typeof selector === 'string' ? $(selector, root) : selector;
  if (element) element.textContent = value;
  return element;
}
