import { state, loadState, saveState, applyStreak, levelForXp, levelLabel } from './state.js';
import { escapeHtml, showToast, formatTopic, capitalize } from './utils.js';
import { renderReviewSection, seedSampleReviewQuestions, startReviewQuiz } from './review.js';
import { renderTenses, renderVocabulary, startQuickQuiz, runAiAdaptiveTest } from './quiz.js';
import { openAuthModal, openProfileModal, closeAllModals, signUpUser, loginUser, continueAsGuest, signOutUser, exportUserData, importUserData } from './auth.js';
import { initLandingScrollAnimations } from './landing.js';
import { bindNavigation, setView as navSetView } from './navigation.js';
import { I18N, translateUI, closeAllLangDropdowns } from './i18n.js';

export function setView(name) {
  navSetView(name, (currentView) => {
    state.currentView = currentView;
    if (currentView === 'dashboard') {
      renderReviewSection();
      renderHistory();
      renderBadges();
    }
  });
}

export function syncProfileHubUI() {
  const profile = state.profiles?.[state.activeProfile] || state.profiles?.[0] || { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' };
  [
    ['profileNameLabel', profile.name],
    ['profileAvatar', profile.initials],
    ['hubAvatar', profile.initials],
    ['hubNameLabel', profile.name],
    ['hubEmailLabel', profile.email]
  ].forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  });

  const badge = document.getElementById('hubLevelBadge');
  if (badge) badge.textContent = `Level ${state.level} · ${levelLabel(state.level)}`;

  const streak = document.getElementById('hubMetricStreak');
  if (streak) streak.textContent = `🔥 ${state.streak}`;

  const xp = document.getElementById('hubMetricXp');
  if (xp) xp.textContent = `⚡ ${state.xp}`;

  const hubLevel = document.getElementById('hubMetricLevel');
  if (hubLevel) hubLevel.textContent = `Lv ${state.level}`;

  const bar = document.getElementById('hubXpBar');
  if (bar) bar.style.width = `${state.xp % 100}%`;

  const progress = document.getElementById('hubXpProgressText');
  if (progress) progress.textContent = `${state.xp % 100} / 100 XP to Level ${state.level + 1}`;

  const reviewCountText = document.getElementById('hubReviewCountText');
  if (reviewCountText) {
    const unmastered = (state.reviewQuestions || []).filter(q => !q.mastered).length;
    reviewCountText.textContent = `${unmastered} question${unmastered === 1 ? '' : 's'}`;
  }

  // Sync personalized learning fields
  if (state.personalizedLearning) {
    const goalSelect = document.getElementById('persGoalSelect');
    if (goalSelect && state.personalizedLearning.goal) {
      goalSelect.value = state.personalizedLearning.goal;
    }
    const notesInput = document.getElementById('persNotesInput');
    if (notesInput && state.personalizedLearning.customNotes) {
      notesInput.value = state.personalizedLearning.customNotes;
    }
  }
}

export function syncLevelUI() {
  state.level = levelForXp(state.xp);
  const ring = 351.9 * (1 - ((state.xp % 100) / 100));
  document.getElementById('bigRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('progRingFg')?.style.setProperty('stroke-dashoffset', String(ring));
  document.getElementById('miniRingFg')?.style.setProperty('stroke-dashoffset', String(65.9 * (1 - ((state.xp % 100) / 100))));

  ['bigRingLevel', 'progRingLevel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(state.level);
  });

  const mini = document.getElementById('miniLevelLabel');
  if (mini) mini.textContent = `Lv ${state.level}`;

  ['dashXpText', 'progXpText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = `${state.xp % 100} / 100 XP (Total: ${state.xp})`;
  });

  ['dashStreak', 'progStreak', 'miniStreak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(state.streak);
  });

  const word = document.getElementById('dashLevelWord');
  if (word) {
    const rawLabel = levelLabel(state.level);
    if (state.lang === 'id') {
      word.textContent = rawLabel === 'Beginner' ? 'Pemula' : rawLabel === 'Advanced' ? 'Mahir' : 'Menengah';
    } else {
      word.textContent = rawLabel;
    }
  }

  syncProfileHubUI();
}

export function renderBadges() {
  const shelf = document.getElementById('badgeShelf');
  if (!shelf) return;
  const badges = [
    { name: 'First quiz', unlocked: (state.history || []).length >= 1 },
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
  const historyList = state.history || [];
  rows.innerHTML = historyList.length
    ? historyList.slice(0, 8).map(item => `
        <div class="history-row">
          <span>${escapeHtml(item.label)}</span>
          <span class="h-score">${item.score}%</span>
        </div>
      `).join('')
    : '<div class="empty-state">No recent quiz attempts yet. Complete a quiz to build your history!</div>';
}

export function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.body.setAttribute('data-theme', state.theme);
  const label = document.getElementById('themeStatusLabel');
  if (label) label.textContent = state.theme === 'light' ? 'Crisp Light Mode' : 'Dark Navy Mode';
  document.getElementById('themeToggleBtn')?.setAttribute('aria-checked', String(state.theme === 'light'));
  if (persist) saveState();
}

export function toggleTheme() {
  applyTheme(state.theme === 'light' ? 'dark' : 'light');
  showToast(`Switched to ${state.theme === 'light' ? 'Light' : 'Dark'} mode`);
}

export function applyLanguage(lang, persist = true, notify = false) {
  state.lang = lang === 'id' ? 'id' : 'en';
  translateUI(state.lang, state);
  closeAllLangDropdowns();
  if (persist) saveState();
  if (notify) showToast(I18N[state.lang]?.switchMsg || 'Language updated');
}

export function initLanguageSwitcher() {
  document.querySelectorAll('.lang-opt[data-set-lang]').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage(opt.dataset.setLang, true, true);
    });
  });

  document.querySelectorAll('.lang-switcher-wrap').forEach(wrap => {
    const button = wrap.querySelector('.lang-btn');
    const dropdown = wrap.querySelector('.lang-dropdown');
    button?.addEventListener('click', e => {
      e.stopPropagation();
      const isHidden = dropdown?.classList.contains('hidden');
      closeAllLangDropdowns();
      if (isHidden) {
        dropdown?.classList.remove('hidden');
        wrap.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    closeAllLangDropdowns();
  });
}

export function bindChipSelectors() {
  // Topic chips (Quick quiz & AI)
  document.querySelectorAll('#quizTopicChips [data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedTopic = btn.dataset.topic;
      document.querySelectorAll('#quizTopicChips [data-topic]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });
  document.querySelectorAll('#aiTopicChips [data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedTopic = btn.dataset.topic;
      document.querySelectorAll('#aiTopicChips [data-topic]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // Difficulty chips
  document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedDifficulty = btn.dataset.diff;
      document.querySelectorAll('#quizDifficultyChips [data-diff]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });
  document.querySelectorAll('#aiDifficultyChips [data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedDifficulty = btn.dataset.diff;
      document.querySelectorAll('#aiDifficultyChips [data-diff]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // AI question count chips
  document.querySelectorAll('#aiCountChips [data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedAIQuestions = Number(btn.dataset.count);
      document.querySelectorAll('#aiCountChips [data-count]').forEach(item => item.classList.toggle('active', item === btn));
    });
  });

  // Materials subtabs
  document.querySelectorAll('[data-msub]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedMaterial = btn.dataset.msub;
      document.querySelectorAll('[data-msub]').forEach(item => item.classList.toggle('active', item === btn));
      ['tenses', 'tobe', 'vocabulary', 'grammar'].forEach(key => {
        document.getElementById(`msub-${key}`)?.classList.toggle('hidden', key !== state.selectedMaterial);
      });
    });
  });

  // Practice subtabs (supports both data-psub and data-ptab)
  document.querySelectorAll('[data-psub], [data-ptab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.psub || btn.dataset.ptab;
      state.selectedPracticeTab = tab;
      document.querySelectorAll('[data-psub], [data-ptab]').forEach(item => item.classList.toggle('active', (item.dataset.psub || item.dataset.ptab) === tab));
      document.getElementById('psub-quiz')?.classList.toggle('hidden', tab !== 'quiz');
      document.getElementById('psub-ai')?.classList.toggle('hidden', tab !== 'ai');
      document.getElementById('ptab-quiz')?.classList.toggle('hidden', tab !== 'quiz');
      document.getElementById('ptab-ai')?.classList.toggle('hidden', tab !== 'ai');
    });
  });

  // Start Quick Quiz and Generate AI Test
  document.getElementById('startQuizBtn')?.addEventListener('click', startQuickQuiz);
  document.getElementById('generateAiBtn')?.addEventListener('click', runAiAdaptiveTest);

  // Review filters & actions
  document.querySelectorAll('[data-review-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.reviewFilter = btn.dataset.reviewFilter;
      document.querySelectorAll('[data-review-filter]').forEach(item => item.classList.toggle('active', item === btn));
      renderReviewSection();
    });
  });
  document.getElementById('startReviewQuizBtn')?.addEventListener('click', startReviewQuiz);
  document.getElementById('clearMasteredBtn')?.addEventListener('click', () => {
    state.reviewQuestions = (state.reviewQuestions || []).filter(q => !q.mastered);
    saveState();
    renderReviewSection();
    showToast('Cleared mastered questions');
  });

  // Quicklinks on Dashboard
  document.querySelectorAll('[data-goto-material]').forEach(card => {
    card.addEventListener('click', () => {
      const mat = card.dataset.gotoMaterial;
      setView('materials');
      const matBtn = document.querySelector(`[data-msub="${mat}"]`);
      if (matBtn) matBtn.click();
    });
  });
  document.querySelectorAll('[data-goto-practice]').forEach(card => {
    card.addEventListener('click', () => {
      const pTab = card.dataset.gotoPractice;
      setView('practice');
      const pBtn = document.querySelector(`[data-psub="${pTab}"], [data-ptab="${pTab}"]`);
      if (pBtn) pBtn.click();
    });
  });
  document.querySelectorAll('[data-goto-review]').forEach(card => {
    card.addEventListener('click', () => {
      setView('dashboard');
      document.getElementById('reviewSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Profile modal settings tabs
  document.querySelectorAll('.prof-subtab-btn[data-prof-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.profTab;
      document.querySelectorAll('.prof-subtab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('profPanelDataControl')?.classList.toggle('hidden', tab !== 'data-control');
      document.getElementById('profPanelPersonalized')?.classList.toggle('hidden', tab !== 'personalized');
      document.getElementById('profPanelHelp')?.classList.toggle('hidden', tab !== 'help-center');
    });
  });

  // Help center accordion
  document.querySelectorAll('.help-item .help-summary').forEach(summary => {
    summary.addEventListener('click', () => {
      const parent = summary.closest('.help-item');
      if (!parent) return;
      const isOpen = parent.classList.contains('open');
      parent.classList.toggle('open', !isOpen);
      const content = parent.querySelector('.help-content');
      if (content) content.style.display = isOpen ? 'none' : 'block';
    });
  });

  // Edit name in Profile Hub
  document.getElementById('hubEditNameBtn')?.addEventListener('click', () => {
    const form = document.getElementById('hubNameEditForm');
    const input = document.getElementById('hubNameEditInput');
    if (form && input) {
      form.classList.remove('hidden');
      const profile = state.profiles?.[state.activeProfile] || { name: 'Learner' };
      input.value = profile.name;
      input.focus();
    }
  });
  document.getElementById('hubCancelNameBtn')?.addEventListener('click', () => {
    document.getElementById('hubNameEditForm')?.classList.add('hidden');
  });
  document.getElementById('hubSaveNameBtn')?.addEventListener('click', () => {
    const input = document.getElementById('hubNameEditInput');
    const newName = (input?.value || '').trim();
    if (!newName) return;
    if (!state.profiles) state.profiles = [];
    if (!state.profiles[state.activeProfile]) {
      state.profiles[state.activeProfile] = { name: newName, initials: newName.charAt(0).toUpperCase(), email: 'learner@engsphere.app' };
    } else {
      state.profiles[state.activeProfile].name = newName;
      state.profiles[state.activeProfile].initials = newName.charAt(0).toUpperCase();
    }
    saveState();
    syncProfileHubUI();
    document.getElementById('hubNameEditForm')?.classList.add('hidden');
    showToast(`Display name updated to "${newName}"`);
  });

  // Settings Actions: Clear Review Mistakes, History, and Full Reset
  document.getElementById('clearReviewQueueBtn')?.addEventListener('click', () => {
    state.reviewQuestions = [];
    saveState();
    renderReviewSection();
    syncProfileHubUI();
    showToast('Review mistake queue cleared');
  });
  document.getElementById('clearQuizHistoryBtn')?.addEventListener('click', () => {
    state.history = [];
    saveState();
    renderHistory();
    renderBadges();
    showToast('Quiz history cleared');
  });
  const handleResetAll = () => {
    state.xp = 0;
    state.level = 1;
    state.streak = 0;
    state.history = [];
    state.reviewQuestions = [];
    saveState();
    syncLevelUI();
    renderBadges();
    renderHistory();
    renderReviewSection();
    showToast('All learning data has been reset');
  };
  document.getElementById('hubResetAllBtn')?.addEventListener('click', handleResetAll);
  document.getElementById('resetProgressBtn')?.addEventListener('click', handleResetAll);

  // Personalized Learning Save
  document.getElementById('savePersonalizedBtn')?.addEventListener('click', () => {
    const goalSelect = document.getElementById('persGoalSelect');
    const notesInput = document.getElementById('persNotesInput');
    const activeLevelBtn = document.querySelector('#persLevelChips .pill.active');
    const activeGoalBtn = document.querySelector('#persGoalChips .pill.active');

    state.personalizedLearning = {
      goal: goalSelect?.value || 'conversation',
      level: activeLevelBtn?.dataset.persLevel || state.selectedDifficulty || 'intermediate',
      dailyXpGoal: Number(activeGoalBtn?.dataset.dailyXp || 100),
      customNotes: notesInput?.value || ''
    };
    saveState();
    showToast('Personalized preferences saved! 🎯');
  });

  // Auth chip selectors
  document.querySelectorAll('#authLevelChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#authLevelChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#authGoalChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#authGoalChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#persLevelChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#persLevelChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  document.querySelectorAll('#persGoalChips .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#persGoalChips .pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Password visibility toggles
  document.getElementById('toggleSignUpPwBtn')?.addEventListener('click', () => {
    const input = document.getElementById('authSignUpPassword');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('toggleLoginPwBtn')?.addEventListener('click', () => {
    const input = document.getElementById('authLoginPassword');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });
}

export function initNavigation() {
  document.querySelectorAll('.topnav button[data-view], [data-goto]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view || btn.dataset.goto));
  });

  document.getElementById('appHomeBtn')?.addEventListener('click', () => setView('dashboard'));
  document.getElementById('dashStartQuizBtn')?.addEventListener('click', () => setView('practice'));
  document.getElementById('dashBrowseMatBtn')?.addEventListener('click', () => setView('materials'));

  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeProfileModalBtn2')?.addEventListener('click', closeAllModals);

  document.getElementById('authModalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAllModals();
  });
  document.getElementById('profileModalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAllModals();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  document.getElementById('landingLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingSignUpBtn')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('getStartedBtn')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('getStartedBtn2')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('landingHeroLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('landingBottomLoginBtn')?.addEventListener('click', () => openAuthModal('login'));

  document.getElementById('authQuickGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('authLoginGuestBtn')?.addEventListener('click', continueAsGuest);
  document.getElementById('profilePillBtn')?.addEventListener('click', openProfileModal);
  document.getElementById('hubSignOutBtn')?.addEventListener('click', signOutUser);
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  document.getElementById('authTabSignUp')?.addEventListener('click', () => openAuthModal('sign-up'));
  document.getElementById('authTabLogin')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('switchToSignUpBtn')?.addEventListener('click', () => openAuthModal('sign-up'));

  document.getElementById('authSignUpForm')?.addEventListener('submit', e => {
    e.preventDefault();
    signUpUser(
      document.getElementById('authSignUpName')?.value,
      document.getElementById('authSignUpEmail')?.value,
      document.getElementById('authSignUpPassword')?.value,
      document.querySelector('#authLevelChips .pill.active')?.dataset.level || 'intermediate',
      document.querySelector('#authGoalChips .pill.active')?.dataset.goal || 'conversation'
    );
  });

  document.getElementById('authLoginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    loginUser(
      document.getElementById('authLoginIdentifier')?.value,
      document.getElementById('authLoginPassword')?.value
    );
  });

  document.getElementById('exportDataBtn')?.addEventListener('click', exportUserData);
  document.getElementById('importBackupInput')?.addEventListener('change', e => importUserData(e.target.files?.[0]));
}

export function init() {
  window.setView = setView;
  window.loginUser = loginUser;
  window.openAuthModal = openAuthModal;
  window.syncLevelUI = syncLevelUI;
  window.renderBadges = renderBadges;
  window.renderHistory = renderHistory;

  loadState();
  applyTheme(state.theme, false);
  applyLanguage(state.lang, false);
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

  const isLogged = Boolean(state.isLoggedIn);
  if (isLogged) {
    setView(state.currentView || 'dashboard');
  } else {
    setView('landing');
  }
  saveState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
