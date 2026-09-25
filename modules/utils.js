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
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

export function formatTopic(topic) {
  const labels = { tenses: 'Tenses', tobe: 'To Be', vocabulary: 'Vocabulary', grammar: 'Grammar', mixed: 'Mixed' };
  return labels[topic] || capitalize(topic) || 'General';
}

export function levelForXp(xp) {
  return Math.max(1, Math.min(9, Math.floor(xp / 100) + 1));
}

export function levelLabel(level) {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Intermediate';
  return 'Advanced';
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'recently';
  const minutes = Math.floor(Math.max(0, Date.now() - timestamp) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
