import { state, loadState, saveState, applyStreak, levelForXp, levelLabel } from './state.js';
import { escapeHtml, showToast, formatTopic, capitalize } from './utils.js';
import { renderReviewSection, seedSampleReviewQuestions, startReviewQuiz } from './review.js';
import { renderTenses, renderVocabulary, startQuickQuiz, runAiAdaptiveTest } from './quiz.js';
import { openAuthModal, openProfileModal, closeAllModals, signUpUser, loginUser, continueAsGuest, signOutUser, exportUserData, importUserData } from './auth.js';
import { initLandingScrollAnimations } from './landing.js';
import { bindNavigation, setView as navSetView } from './navigation.js';

export const I18N = {
  en: {
    langCode: 'EN',
    langTitle: 'English (EN)',
    switchMsg: 'Switched language to English 🇬🇧',
    hero_title: 'Practice English Until It Clicks.',
    hero_lede: 'Clear lessons on tenses, verb forms, vocabulary and grammar — paired with quizzes that adjust to your level so practice never feels too easy or too hard.',
    landing_login: 'Log in',
    landing_signup: 'Sign up / Get Started',
    landing_cta_start: '🚀 Sign up / Get Started',
    landing_cta_login: 'Log in to account',
    landing_cta_inside: "See what's inside",
    final_start: '🚀 Sign up / Get Started Free',
    final_login: 'I already have an account',
    nav_dashboard: '🏠 Dashboard',
    nav_materials: '📘 Materials',
    nav_practice: '🎯 Practice',
    nav_progress: '📈 Progress',
    dash_start_quiz: 'Start a quiz',
    dash_browse_mat: 'Browse materials',
    dash_greeting: 'Welcome back',
    dash_level_label: 'Level',
    streak_suffix: '-day streak',
    targeted_review: 'Targeted Review',
    targeted_review_sub: 'Questions you answered incorrectly during quizzes. Study the grammar explanations and retry each question until it clicks.',
    start_review_quiz: '⚡ Start Review Quiz',
    clear_mastered: 'Clear Mastered',
    quick_links: 'Quick links',
    materials_title: 'Materials',
    materials_sub: 'Short, practical lessons — read the rule, then check the examples. Everything here also feeds the Practice quizzes.',
    practice_title: 'Practice',
    practice_sub: 'Run the quick static quiz for instant gamified practice, or let the AI tutor build a fresh test around exactly what you want to work on.',
    tab_quick_quiz: 'Quick Quiz',
    tab_ai_test: 'AI Adaptive Test',
    start_quiz_btn: 'Start quiz',
    generate_ai_btn: '✨ Generate my test',
    progress_title: 'Your progress',
    progress_sub: 'Every quiz — quick or AI-generated — adds to your XP and streak.',
    recent_tests: 'Recent tests',
    reset_progress: 'Reset all progress',
    sub_tenses: 'Tenses',
    sub_tobe: 'To Be',
    sub_vocabulary: 'Vocabulary',
    sub_grammar: 'Grammar',
    ql_review_desc: 'Review and retry questions you answered incorrectly.',
    ql_tenses_desc: 'All 12 tenses, explained with examples.',
    ql_tobe_desc: "Am, is, are — and how they're used.",
    ql_vocab_desc: 'Flip cards across 6 everyday topics.',
    ql_grammar_desc: 'Parts of speech and sentence structure.',
    ql_quiz_desc: 'Gamified multiple-choice practice.',
    ql_ai_desc: 'Fresh questions matched to your level.'
  },
  id: {
    langCode: 'ID',
    langTitle: 'Bahasa Indonesia (ID)',
    switchMsg: 'Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩',
    hero_title: 'Latihan Bahasa Inggris Sampai Paham.',
    hero_lede: 'Pelajaran ringkas, umpan balik instan, dan kuis adaptif seiring kemajuan belajar Anda. Gratis berlatih, tanpa iklan, langsung coba.',
    landing_login: 'Masuk',
    landing_signup: 'Daftar / Mulai',
    landing_cta_start: '🚀 Daftar / Mulai Sekarang',
    landing_cta_login: 'Masuk ke akun',
    landing_cta_inside: 'Lihat fitur di dalam',
    final_start: '🚀 Daftar / Mulai Gratis',
    final_login: 'Saya sudah punya akun',
    nav_dashboard: '🏠 Beranda',
    nav_materials: '📘 Materi',
    nav_practice: '🎯 Latihan',
    nav_progress: '📈 Kemajuan',
    dash_start_quiz: 'Mulai kuis',
    dash_browse_mat: 'Lihat materi',
    dash_greeting: 'Selamat datang kembali',
    dash_level_label: 'Tingkat',
    streak_suffix: '-hari streak',
    targeted_review: 'Review Bertarget',
    targeted_review_sub: 'Pertanyaan yang salah saat kuis. Pelajari penjelasan tata bahasanya dan coba lagi sampai paham.',
    start_review_quiz: '⚡ Mulai Kuis Review',
    clear_mastered: 'Hapus yang Dikuasai',
    quick_links: 'Tautan cepat',
    materials_title: 'Materi Belajar',
    materials_sub: 'Pelajaran ringkas & praktis — pelajari aturannya, lalu periksa contoh kalimatnya. Semua materi ini terhubung ke kuis latihan.',
    practice_title: 'Latihan Soal',
    practice_sub: 'Jalankan kuis cepat untuk latihan interaktif, atau biarkan tutor AI membuatkan tes baru sesuai fokus yang ingin Anda latih.',
    tab_quick_quiz: 'Kuis Cepat',
    tab_ai_test: 'Tes Adaptif AI',
    start_quiz_btn: 'Mulai kuis',
    generate_ai_btn: '✨ Buat tes saya',
    progress_title: 'Kemajuan Belajar Anda',
    progress_sub: 'Setiap kuis — baik kuis cepat maupun AI — menambah XP dan streak belajar Anda.',
    recent_tests: 'Tes Terakhir',
    reset_progress: 'Reset semua kemajuan',
    sub_tenses: 'Bentuk Waktu (Tenses)',
    sub_tobe: 'Kata Kerja To Be',
    sub_vocabulary: 'Kosakata (Vocabulary)',
    sub_grammar: 'Tata Bahasa (Grammar)',
    ql_review_desc: 'Tinjau dan ulangi pertanyaan yang sebelumnya salah dijawab.',
    ql_tenses_desc: '12 macam tenses, lengkap dengan rumus dan contoh kalimat.',
    ql_tobe_desc: 'Am, is, are, was, were — fungsi dan cara penggunaannya.',
    ql_vocab_desc: 'Kartu kosakata flip interaktif dalam 6 tema sehari-hari.',
    ql_grammar_desc: 'Bagian kalimat (Parts of Speech) dan aturan tata bahasa.',
    ql_quiz_desc: 'Latihan pilihan ganda cepat dengan sistem XP.',
    ql_ai_desc: 'Soal latihan yang disesuaikan dengan tingkat kemampuan Anda.'
  }
};

export function closeAllLangDropdowns() {
  document.querySelectorAll('.lang-dropdown').forEach(dropdown => dropdown.classList.add('hidden'));
  document.querySelectorAll('.lang-switcher-wrap').forEach(wrapper => {
    wrapper.classList.remove('open');
    wrapper.querySelector('.lang-btn')?.setAttribute('aria-expanded', 'false');
  });
}

export function translateUI(lang, state) {
  const selected = lang === 'id' ? 'id' : 'en';
  const t = I18N[selected];
  if (!t) return;
  document.documentElement.lang = selected;

  // 1. All elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) element.textContent = t[key];
  });

  // 2. Language switcher button labels
  ['landingLangLabel', 'appLangLabel', 'modalLangLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t.langCode;
  });

  // 3. Language options checkmarks and active state
  document.querySelectorAll('.lang-opt').forEach(opt => {
    const isActive = opt.dataset.setLang === selected;
    opt.classList.toggle('active', isActive);
    const check = opt.querySelector('.lang-check');
    if (check) {
      check.classList.toggle('hidden', !isActive);
      check.style.display = isActive ? 'inline-block' : 'none';
    }
  });

  // 4. Subtabs pills
  const tensesTab = document.querySelector('[data-msub="tenses"]');
  if (tensesTab) tensesTab.textContent = t.sub_tenses;
  const tobeTab = document.querySelector('[data-msub="tobe"]');
  if (tobeTab) tobeTab.textContent = t.sub_tobe;
  const vocabTab = document.querySelector('[data-msub="vocabulary"]');
  if (vocabTab) vocabTab.textContent = t.sub_vocabulary;
  const grammarTab = document.querySelector('[data-msub="grammar"]');
  if (grammarTab) grammarTab.textContent = t.sub_grammar;

  // 5. Practice subtabs
  const quizTab = document.querySelector('[data-psub="quiz"]');
  if (quizTab) quizTab.textContent = t.tab_quick_quiz;
  const aiTab = document.querySelector('[data-psub="ai"]');
  if (aiTab) aiTab.textContent = t.tab_ai_test;

  // 6. Level ring text
  document.querySelectorAll('.ring-label .l').forEach(el => {
    el.textContent = t.dash_level_label;
  });

  // 7. Streak suffix
  document.querySelectorAll('.streak-line').forEach(el => {
    const streakNum = state?.streak || 0;
    el.innerHTML = `🔥 <span id="dashStreak">${streakNum}</span>${t.streak_suffix}`;
  });

  // 8. Dashboard description
  const dashDesc = document.getElementById('dashDesc');
  if (dashDesc && state) {
    const currentDiff = state.selectedDifficulty || 'intermediate';
    const diffWord = selected === 'id' ? (currentDiff === 'beginner' ? 'Pemula' : currentDiff === 'advanced' ? 'Mahir' : 'Menengah') : currentDiff;
    dashDesc.innerHTML = selected === 'id'
      ? `Tingkat belajar Anda: <strong id="dashLevelWord">${diffWord}</strong>. Buka materi pelajaran atau mulai kuis untuk menjaga streak Anda.`
      : `You're set to <strong id="dashLevelWord">${diffWord}</strong> level. Jump back into a lesson or run a quick quiz to keep your streak alive.`;
  }

  // 9. Quicklink card descriptions
  document.querySelectorAll('.ql-item').forEach(item => {
    const h3 = item.querySelector('h3');
    const p = item.querySelector('p');
    if (item.dataset.gotoReview) {
      if (h3) h3.textContent = t.targeted_review;
      if (p) p.textContent = t.ql_review_desc;
    } else if (item.dataset.gotoMaterial === 'tenses') {
      if (h3) h3.textContent = t.sub_tenses;
      if (p) p.textContent = t.ql_tenses_desc;
    } else if (item.dataset.gotoMaterial === 'tobe') {
      if (h3) h3.textContent = t.sub_tobe;
      if (p) p.textContent = t.ql_tobe_desc;
    } else if (item.dataset.gotoMaterial === 'vocabulary') {
      if (h3) h3.textContent = t.sub_vocabulary;
      if (p) p.textContent = t.ql_vocab_desc;
    } else if (item.dataset.gotoMaterial === 'grammar') {
      if (h3) h3.textContent = t.sub_grammar;
      if (p) p.textContent = t.ql_grammar_desc;
    } else if (item.dataset.gotoPractice === 'quiz') {
      if (h3) h3.textContent = t.tab_quick_quiz;
      if (p) p.textContent = t.ql_quiz_desc;
    } else if (item.dataset.gotoPractice === 'ai') {
      if (h3) h3.textContent = t.tab_ai_test;
      if (p) p.textContent = t.ql_ai_desc;
    }
  });
}

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
  window.applyLanguage = applyLanguage;
  window.translateUI = translateUI;

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
