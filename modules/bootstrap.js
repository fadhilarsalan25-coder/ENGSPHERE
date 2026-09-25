import { state, loadState, saveState, applyStreak, levelForXp, levelLabel } from './state.js';
import { escapeHtml, showToast, formatTopic, formatTimeAgo, capitalize } from './utils.js';
import { TENSES, VOCAB, BANK } from './data.js';
import { renderReviewSection, seedSampleReviewQuestions, startReviewQuiz } from './review.js';
import { renderTenses, renderVocabulary, startQuickQuiz, renderQuiz, runAiAdaptiveTest } from './quiz.js';
import { setAuthAlert, openAuthModal, openProfileModal, closeAllModals, renderAuthSavedProfiles, signUpUser, loginUser, continueAsGuest, signOutUser, exportUserData, importUserData } from './auth.js';
import { initLandingScrollAnimations } from './landing.js';

export function syncProfileHubUI() {
  const profile = state.profiles[state.activeProfile] || state.profiles[0] || { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' };
  const nameLabel = document.getElementById('profileNameLabel');
  if (nameLabel) nameLabel.textContent = profile.name || 'Learner';
  const avatar = document.getElementById('profileAvatar');
  if (avatar) avatar.textContent = profile.initials || 'L';
  const hubAvatar = document.getElementById('hubAvatar');
  if (hubAvatar) hubAvatar.textContent = profile.initials || 'L';
  const hubName = document.getElementById('hubNameLabel');
  if (hubName) hubName.textContent = profile.name || 'Learner';
  const hubEmail = document.getElementById('hubEmailLabel');
  if (hubEmail) hubEmail.textContent = profile.email || `${(profile.name || 'learner').toLowerCase().replace(/\s+/g, '')}@engsphere.app`;
  const hubBadge = document.getElementById('hubLevelBadge');
  if (hubBadge) hubBadge.textContent = `Level ${state.level} · ${levelLabel(state.level)}`;
  const hubStreak = document.getElementById('hubMetricStreak');
  if (hubStreak) hubStreak.textContent = `🔥 ${state.streak}`;
  const hubXp = document.getElementById('hubMetricXp');
  if (hubXp) hubXp.textContent = `⚡ ${state.xp}`;
  const hubLevel = document.getElementById('hubMetricLevel');
  if (hubLevel) hubLevel.textContent = `Lv ${state.level}`;

  const xpInLevel = state.xp % 100;
  const hubXpBar = document.getElementById('hubXpBar');
  if (hubXpBar) hubXpBar.style.width = `${xpInLevel}%`;
  const hubXpText = document.getElementById('hubXpProgressText');
  if (hubXpText) hubXpText.textContent = `${xpInLevel} / 100 XP to Level ${state.level + 1}`;
  const hubStreakText = document.getElementById('hubStreakStatusText');
  if (hubStreakText) {
    hubStreakText.textContent = state.streak > 0 ? `🔥 Active ${state.streak}-day streak! Keep up your daily momentum.` : 'Complete today\'s quiz to build your daily streak flame!';
  }
  const hubReviewCount = document.getElementById('hubReviewCountText');
  if (hubReviewCount) {
    const count = (state.reviewQuestions || []).length;
    hubReviewCount.textContent = `${count} question${count === 1 ? '' : 's'}`;
  }
}

export function syncLevelUI() {
  const level = levelForXp(state.xp);
  state.level = level;
  const ring = 351.9 * (1 - ((state.xp % 100) / 100));
  const miniPct = (state.xp % 100) / 100;
  const bigRingFg = document.getElementById('bigRingFg');
  if (bigRingFg) bigRingFg.style.strokeDashoffset = String(ring);
  const miniRingFg = document.getElementById('miniRingFg');
  if (miniRingFg) miniRingFg.style.strokeDashoffset = String(65.9 * (1 - miniPct));
  const progRingFg = document.getElementById('progRingFg');
  if (progRingFg) progRingFg.style.strokeDashoffset = String(ring);

  const bigLevel = document.getElementById('bigRingLevel');
  if (bigLevel) bigLevel.textContent = String(level);
  const miniLevel = document.getElementById('miniLevelLabel');
  if (miniLevel) miniLevel.textContent = 'Lv ' + level;
  const progLevel = document.getElementById('progRingLevel');
  if (progLevel) progLevel.textContent = String(level);

  const dashXp = document.getElementById('dashXpText');
  if (dashXp) dashXp.textContent = (state.xp % 100) + ' / 100 XP (Total: ' + state.xp + ')';
  const progXp = document.getElementById('progXpText');
  if (progXp) progXp.textContent = (state.xp % 100) + ' / 100 XP (Total: ' + state.xp + ')';
  const dashStreak = document.getElementById('dashStreak');
  if (dashStreak) dashStreak.textContent = String(state.streak);
  const progStreak = document.getElementById('progStreak');
  if (progStreak) progStreak.textContent = String(state.streak);
  const miniStreak = document.getElementById('miniStreak');
  if (miniStreak) miniStreak.textContent = String(state.streak);

  const dashLevelWord = document.getElementById('dashLevelWord');
  if (dashLevelWord) dashLevelWord.textContent = levelLabel(level);

  syncProfileHubUI();
}

export function renderBadges() {
  const shelf = document.getElementById('badgeShelf');
  if (!shelf) return;
  const badges = [
    { name: 'First quiz', unlocked: state.history.length >= 1 },
    { name: '10 XP', unlocked: state.xp >= 10 },
    { name: 'Streak 3', unlocked: state.streak >= 3 },
    { name: 'Mastery', unlocked: (state.reviewQuestions || []).some(q => q.mastered) }
  ];
  shelf.innerHTML = badges.map(b => `
    <div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}">
      <div class="b-ic">${b.unlocked ? '🏆' : '🔒'}</div>
      <div class="b-name">${b.name}</div>
    </div>
  `).join('');
}

export function renderHistory() {
  const rows = document.getElementById('historyRows');
  if (!rows) return;
  if (!state.history.length) {
    rows.innerHTML = '<div class="empty-state">No recent quiz attempts yet. Complete a quiz to build your history!</div>';
    return;
  }
  rows.innerHTML = state.history.slice(0, 8).map(item => `
    <div class="history-row">
      <span>${escapeHtml(item.label)}</span>
      <span class="h-score">${item.score}%</span>
    </div>
  `).join('');
}

export function setView(name) {
  state.currentView = name;
  document.querySelectorAll('.view').forEach(view => {
    const active = view.dataset.view === name;
    view.classList.toggle('hidden', !active);
    if (active) {
      view.classList.remove('view-enter');
      void view.offsetWidth;
      view.classList.add('view-enter');
    }
  });
  document.querySelectorAll('.topnav button[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  document.querySelectorAll('.pill[data-msub]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.msub === state.selectedMaterial);
  });
  if (name === 'dashboard') renderReviewSection();
  if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function applyTheme(theme, save = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  const light = state.theme === 'light';
  document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
  document.body.setAttribute('data-theme', light ? 'light' : 'dark');
  const themeLabel = document.getElementById('themeStatusLabel');
  if (themeLabel) themeLabel.textContent = light ? 'Crisp Light Mode' : 'Dark Navy Mode';
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) themeToggle.setAttribute('aria-checked', light ? 'true' : 'false');
  if (save) saveState();
}

export function toggleTheme() {
  const nextTheme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme, true);
  showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`);
}

export const I18N = {
  en: { langCode: 'EN', langTitle: 'English (EN)', switchMsg: 'Switched language to English 🇬🇧' },
  id: { langCode: 'ID', langTitle: 'Bahasa Indonesia (ID)', switchMsg: 'Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩' }
};

export function closeAllLangDropdowns() {
  document.querySelectorAll('.lang-dropdown').forEach(dd => dd.classList.add('hidden'));
  document.querySelectorAll('.lang-switcher-wrap').forEach(w => {
    w.classList.remove('open');
    const btn = w.querySelector('.lang-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

export function applyLanguage(lang, save = true) {
  if (lang !== 'id' && lang !== 'en') lang = 'en';
  state.lang = lang;
  const t = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-opt').forEach(opt => opt.classList.toggle('active', opt.dataset.setLang === lang));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  closeAllLangDropdowns();
  if (save) {
    saveState();
    showToast(t.switchMsg);
  }
}

export function initLanguageSwitcher() {
  const pairs = [
    { btn: 'landingLangBtn', dd: 'landingLangDropdown', wrap: 'landingLangWrap' },
    { btn: 'appLangBtn', dd: 'appLangDropdown', wrap: 'appLangWrap' },
    { btn: 'modalLangBtn', dd: 'modalLangDropdown', wrap: 'modalLangWrap' }
  ];
  pairs.forEach(({ btn, dd, wrap }) => {
    const buttonEl = document.getElementById(btn);
    const dropdownEl = document.getElementById(dd);
    const wrapEl = document.getElementById(wrap);
    if (buttonEl && dropdownEl && wrapEl) {
      buttonEl.addEventListener('click', e => {
        e.stopPropagation();
        const wasOpen = !dropdownEl.classList.contains('hidden');
        closeAllLangDropdowns();
        if (!wasOpen) {
          dropdownEl.classList.remove('hidden');
          wrapEl.classList.add('open');
          buttonEl.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
  document.querySelectorAll('.lang-opt[data-set-lang]').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      applyLanguage(opt.dataset.setLang, true);
    });
  });
  document.addEventListener('click', closeAllLangDropdowns);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllLangDropdowns();
  });
}

export function bindChipSelectors() {
  document.querySelectorAll('[data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedTopic = btn.dataset.topic;
      document.querySelectorAll('[data-topic]').forEach(i => i.classList.toggle('active', i === btn && (i.closest('#quizTopicChips') || i.closest('#aiTopicChips'))));
    });
  });

  document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedDifficulty = btn.dataset.diff;
      document.querySelectorAll('[data-diff]').forEach(i => i.classList.toggle('active', i === btn));
    });
  });

  document.querySelectorAll('[data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedAIQuestions = Number(btn.dataset.count);
      document.querySelectorAll('[data-count]').forEach(i => i.classList.toggle('active', i === btn));
    });
  });

  document.querySelectorAll('[data-msub]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedMaterial = btn.dataset.msub;
      document.querySelectorAll('[data-msub]').forEach(i => i.classList.toggle('active', i === btn));
      const hideMap = { tenses: 'msub-tenses', tobe: 'msub-tobe', vocabulary: 'msub-vocabulary', grammar: 'msub-grammar' };
      Object.entries(hideMap).forEach(([key, id]) => {
        const node = document.getElementById(id);
        if (node) {
          const isMatch = key === state.selectedMaterial;
          node.classList.toggle('hidden', !isMatch);
        }
      });
    });
  });

  document.querySelectorAll('[data-ptab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.ptab;
      document.querySelectorAll('[data-ptab]').forEach(b => b.classList.toggle('active', b === btn));
      const qNode = document.getElementById('ptab-quiz');
      const aNode = document.getElementById('ptab-ai');
      if (qNode) qNode.classList.toggle('hidden', tab !== 'quiz');
      if (aNode) aNode.classList.toggle('hidden', tab !== 'ai');
    });
  });

  document.getElementById('startQuizBtn')?.addEventListener('click', startQuickQuiz);
  document.getElementById('generateAiBtn')?.addEventListener('click', () => {
    const area = document.getElementById('aiPlayArea');
    if (!area) return;
    area.innerHTML = `<div class="card quiz-question" style="text-align:center;padding:var(--sp-6);"><h3>${formatTopic(state.selectedTopic)} · ${capitalize(state.selectedDifficulty)} Test</h3><button class="btn btn-primary" id="aiStartBtn">Start Test</button></div>`;
    document.getElementById('aiStartBtn')?.addEventListener('click', runAiAdaptiveTest);
  });

  document.querySelectorAll('[data-review-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.reviewFilter = btn.dataset.reviewFilter;
      document.querySelectorAll('[data-review-filter]').forEach(b => b.classList.toggle('active', b === btn));
      renderReviewSection();
    });
  });

  document.getElementById('startReviewQuizBtn')?.addEventListener('click', startReviewQuiz);
  document.getElementById('clearMasteredBtn')?.addEventListener('click', () => {
    state.reviewQuestions = state.reviewQuestions.filter(q => !q.mastered);
    renderReviewSection();
  });
}

export function initNavigation() {
  document.querySelectorAll('.topnav button[data-view]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.goto));
  });

  document.getElementById('appHomeBtn')?.addEventListener('click', () => setView('dashboard'));
  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn2')?.addEventListener('click', closeAllModals);
  document.getElementById('landingLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingSignUpBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('getStartedBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('switchToLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToSignUpBtn')?.addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('authQuickGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('authLoginGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('profilePillBtn')?.addEventListener('click', openProfileModal);
  document.getElementById('hubSignOutBtn')?.addEventListener('click', signOutUser);
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  document.getElementById('authSignUpForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput = document.getElementById('authSignUpName');
    const emailInput = document.getElementById('authSignUpEmail');
    const passwordInput = document.getElementById('authSignUpPassword');
    const activeLevel = document.querySelector('#authLevelChips .pill.active')?.dataset.level || 'intermediate';
    const activeGoal = document.querySelector('#authGoalChips .pill.active')?.dataset.goal || 'conversation';
    signUpUser(nameInput?.value, emailInput?.value, passwordInput?.value, activeLevel, activeGoal);
  });

  document.getElementById('authLoginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const identifierInput = document.getElementById('authLoginIdentifier');
    const passwordInput = document.getElementById('authLoginPassword');
    loginUser(identifierInput?.value, passwordInput?.value);
  });

  document.getElementById('exportDataBtn')?.addEventListener('click', exportUserData);
  document.getElementById('importBackupInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) importUserData(file);
  });

  document.querySelectorAll('.help-summary').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.closest('.help-item');
      if (!parent) return;
      const isOpen = parent.classList.toggle('open');
      const content = parent.querySelector('.help-content');
      if (content) content.style.display = isOpen ? 'block' : 'none';
    });
  });
}

export function init() {
  loadState();
  applyTheme(state.theme || 'dark', false);
  applyLanguage(state.lang || 'en', false);
  initLanguageSwitcher();
  applyStreak();
  syncLevelUI();
  renderTenses();
  renderVocabulary();
  renderBadges();
  renderHistory();
  renderReviewSection();
  initNavigation();
  bindChipSelectors();
  initLandingScrollAnimations();

  if (state.isLoggedIn) {
    document.getElementById('landing')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
    setView(state.currentView || 'dashboard');
  } else {
    document.getElementById('landing')?.classList.remove('hidden');
    document.getElementById('app')?.classList.add('hidden');
  }

  saveState();
}
