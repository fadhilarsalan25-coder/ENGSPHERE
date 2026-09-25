import { escapeHtml } from './utils.js';

export function showToast(message, isWarn = false) {
  const wrapper = document.getElementById('toastWrap');
  if (!wrapper) return;
  const toast = document.createElement('div');
  toast.className = `toast${isWarn ? ' warn' : ''}`;
  toast.innerHTML = `<span>${isWarn ? '⚠️' : '✨'}</span><span>${escapeHtml(message)}</span>`;
  wrapper.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
