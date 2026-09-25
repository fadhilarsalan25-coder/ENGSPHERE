export function escapeHtml(value) {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatTopic(topic) {
  const map = {
    tenses: 'Tenses',
    tobe: 'To Be',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    mixed: 'Mixed'
  };
  return map[topic] || capitalize(topic) || 'General';
}

export function formatTimeAgo(ts) {
  if (!ts) return 'recently';
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function showToast(message, isWarn = false) {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const toast = document.createElement('div');
  toast.className = 'toast' + (isWarn ? ' warn' : '');
  toast.innerHTML = `<span>${isWarn ? '⚠️' : '✨'}</span><span>${escapeHtml(message)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
