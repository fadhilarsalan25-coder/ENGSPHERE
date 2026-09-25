import { state, loadState, saveState, applyStreak, levelForXp, levelLabel } from './state.js';
import { escapeHtml, showToast, formatTopic, capitalize } from './utils.js';
import { renderReviewSection, seedSampleReviewQuestions, startReviewQuiz } from './review.js';
import { renderTenses, renderVocabulary, startQuickQuiz, runAiAdaptiveTest } from './quiz.js';
import { openAuthModal, openProfileModal, closeAllModals, signUpUser, loginUser, continueAsGuest, signOutUser, exportUserData, importUserData } from './auth.js';
import { initLandingScrollAnimations } from './landing.js';

export function syncProfileHubUI() {
  const profile = state.profiles?.[state.activeProfile] || state.profiles?.[0] || { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' };
  [['profileNameLabel', profile.name], ['profileAvatar', profile.initials], ['hubAvatar', profile.initials], ['hubNameLabel', profile.name], ['hubEmailLabel', profile.email]].forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = value || ''; });
  const badge = document.getElementById('hubLevelBadge'); if (badge) badge.textContent = `Level ${state.level} · ${levelLabel(state.level)}`;
  const streak = document.getElementById('hubMetricStreak'); if (streak) streak.textContent = `🔥 ${state.streak}`;
  const xp = document.getElementById('hubMetricXp'); if (xp) xp.textContent = `⚡ ${state.xp}`;
  const hubLevel = document.getElementById('hubMetricLevel'); if (hubLevel) hubLevel.textContent = `Lv ${state.level}`;
  const bar = document.getElementById('hubXpBar'); if (bar) bar.style.width = `${state.xp % 100}%`;
  const progress = document.getElementById('hubXpProgressText'); if (progress) progress.textContent = `${state.xp % 100} / 100 XP to Level ${state.level + 1}`;
}

export function syncLevelUI() {
  state.level = levelForXp(state.xp);
  const ring = 351.9 * (1 - ((state.xp % 100) / 100));
  document.getElementById('bigRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('progRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('miniRingFg')?.style.setProperty('stroke-dashoffset', String(65.9 * (1 - ((state.xp % 100) / 100))));
  ['bigRingLevel', 'progRingLevel'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = String(state.level); });
  const mini = document.getElementById('miniLevelLabel'); if (mini) mini.textContent = `Lv ${state.level}`;
  ['dashXpText', 'progXpText'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = `${state.xp % 100} / 100 XP (Total: ${state.xp})`; });
  ['dashStreak', 'progStreak', 'miniStreak'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = String(state.streak); });
  const word = document.getElementById('dashLevelWord'); if (word) word.textContent = levelLabel(state.level);
  syncProfileHubUI();
}

export function renderBadges() {
  const shelf = document.getElementById('badgeShelf');
  if (!shelf) return;
  const badges = [{ name: 'First quiz', unlocked: state.history.length >= 1 }, { name: '10 XP', unlocked: state.xp >= 10 }, { name: 'Streak 3', unlocked: state.streak >= 3 }, { name: 'Mastery', unlocked: state.reviewQuestions.some(q => q.mastered) }];
  shelf.innerHTML = badges.map(b => `<div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}"><div class="b-ic">${b.unlocked ? '🏆' : '🔒'}</div><div class="b-name">${b.name}</div></div>`).join('');
}

export function renderHistory() {
  const rows = document.getElementById('historyRows');
  if (!rows) return;
  rows.innerHTML = state.history.length ? state.history.slice(0, 8).map(item => `<div class="history-row"><span>${escapeHtml(item.label)}</span><span class="h-score">${item.score}%</span></div>`).join('') : '<div class="empty-state">No recent quiz attempts yet. Complete a quiz to build your history!</div>';
}

export function setView(name) {
  state.currentView = name;
  document.querySelectorAll('.view').forEach(view => { const active = view.dataset.view === name; view.classList.toggle('hidden', !active); if (active) { view.classList.remove('view-enter'); void view.offsetWidth; view.classList.add('view-enter'); } });
  document.querySelectorAll('.topnav button[data-view]').forEach(btn => btn.classList.toggle('active', btn.dataset.view === name));
  if (name === 'dashboard') renderReviewSection();
  if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.body.setAttribute('data-theme', state.theme);
  const label = document.getElementById('themeStatusLabel'); if (label) label.textContent = state.theme === 'light' ? 'Crisp Light Mode' : 'Dark Navy Mode';
  document.getElementById('themeToggleBtn')?.setAttribute('aria-checked', String(state.theme === 'light'));
  if (persist) saveState();
}

export function toggleTheme() { applyTheme(state.theme === 'light' ? 'dark' : 'light'); showToast(`Switched to ${state.theme === 'light' ? 'Light' : 'Dark'} mode`); }

export function applyLanguage(lang, persist = true) { state.lang = lang === 'id' ? 'id' : 'en'; document.documentElement.lang = state.lang; document.querySelectorAll('.lang-opt').forEach(opt => opt.classList.toggle('active', opt.dataset.setLang === state.lang)); if (persist) saveState(); }
export function initLanguageSwitcher() { document.querySelectorAll('.lang-opt[data-set-lang]').forEach(opt => opt.addEventListener('click', () => applyLanguage(opt.dataset.setLang))); document.querySelectorAll('.lang-switcher-wrap').forEach(wrap => { const button = wrap.querySelector('.lang-btn'); const dropdown = wrap.querySelector('.lang-dropdown'); button?.addEventListener('click', e => { e.stopPropagation(); dropdown?.classList.toggle('hidden'); }); }); document.addEventListener('click', () => document.querySelectorAll('.lang-dropdown').forEach(dropdown => dropdown.classList.add('hidden'))); }

export function bindChipSelectors() {
  document.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => { state.selectedTopic = btn.dataset.topic; document.querySelectorAll('[data-topic]').forEach(item => item.classList.toggle('active', item === btn)); }));
  document.querySelectorAll('[data-diff]').forEach(btn => btn.addEventListener('click', () => { state.selectedDifficulty = btn.dataset.diff; document.querySelectorAll('[data-diff]').forEach(item => item.classList.toggle('active', item === btn)); }));
  document.querySelectorAll('[data-count]').forEach(btn => btn.addEventListener('click', () => { state.selectedAIQuestions = Number(btn.dataset.count); document.querySelectorAll('[data-count]').forEach(item => item.classList.toggle('active', item === btn)); }));
  document.querySelectorAll('[data-msub]').forEach(btn => btn.addEventListener('click', () => { state.selectedMaterial = btn.dataset.msub; document.querySelectorAll('[data-msub]').forEach(item => item.classList.toggle('active', item === btn)); ['tenses', 'tobe', 'vocabulary', 'grammar'].forEach(key => document.getElementById(`msub-${key}`)?.classList.toggle('hidden', key !== state.selectedMaterial)); }));
  document.querySelectorAll('[data-ptab]').forEach(btn => btn.addEventListener('click', () => { const tab = btn.dataset.ptab; document.querySelectorAll('[data-ptab]').forEach(item => item.classList.toggle('active', item === btn)); document.getElementById('ptab-quiz')?.classList.toggle('hidden', tab !== 'quiz'); document.getElementById('ptab-ai')?.classList.toggle('hidden', tab !== 'ai'); }));
  document.getElementById('startQuizBtn')?.addEventListener('click', startQuickQuiz);
  document.getElementById('generateAiBtn')?.addEventListener('click', runAiAdaptiveTest);
  document.querySelectorAll('[data-review-filter]').forEach(btn => btn.addEventListener('click', () => { state.reviewFilter = btn.dataset.reviewFilter; renderReviewSection(); }));
  document.getElementById('startReviewQuizBtn')?.addEventListener('click', startReviewQuiz);
  document.getElementById('clearMasteredBtn')?.addEventListener('click', () => { state.reviewQuestions = state.reviewQuestions.filter(q => !q.mastered); saveState(); renderReviewSection(); });
}

export function initNavigation() {
  document.querySelectorAll('.topnav button[data-view], [data-goto]').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view || btn.dataset.goto)));
  document.getElementById('appHomeBtn')?.addEventListener('click', () => setView('dashboard'));
  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn2')?.addEventListener('click', closeAllModals);
  document.getElementById('landingLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingSignUpBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('getStartedBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('authQuickGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('authLoginGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('profilePillBtn')?.addEventListener('click', openProfileModal);
  document.getElementById('hubSignOutBtn')?.addEventListener('click', signOutUser);
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('authTabSignUp')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('authTabLogin')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToSignUpBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('authSignUpForm')?.addEventListener('submit', e => { e.preventDefault(); signUpUser(document.getElementById('authSignUpName')?.value, document.getElementById('authSignUpEmail')?.value, document.getElementById('authSignUpPassword')?.value, document.querySelector('#authLevelChips .pill.active')?.dataset.level || 'intermediate', document.querySelector('#authGoalChips .pill.active')?.dataset.goal || 'conversation'); });
  document.getElementById('authLoginForm')?.addEventListener('submit', e => { e.preventDefault(); loginUser(document.getElementById('authLoginIdentifier')?.value, document.getElementById('authLoginPassword')?.value); });
  document.getElementById('exportDataBtn')?.addEventListener('click', exportUserData);
  document.getElementById('importBackupInput')?.addEventListener('change', e => importUserData(e.target.files?.[0]));
}

export function init() {
  window.setView = setView;
  window.loginUser = loginUser;
  loadState(); applyTheme(state.theme, false); applyLanguage(state.lang, false); initLanguageSwitcher(); applyStreak(); syncLevelUI(); renderTenses(); renderVocabulary(); renderBadges(); renderHistory(); renderReviewSection(); initNavigation(); bindChipSelectors(); initLandingScrollAnimations();
  document.getElementById('landing')?.classList.toggle('hidden', state.isLoggedIn);
  document.getElementById('app')?.classList.toggle('hidden', !state.isLoggedIn);
  if (state.isLoggedIn) setView(state.currentView || 'dashboard');
  saveState();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
