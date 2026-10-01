export const I18N = { 
  en: {
    langCode: 'EN',
    langTitle: 'English (EN)',
    switchMsg: 'Switched language to English 🇬🇧',
    hero_title: 'Practice English Until It Clicks.',
    hero_lede: 'Short lessons, instant feedback, and quizzes that adapt as you improve. Free to practice, no ads, no sign-up wall to explore.',
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
    level_beginner: 'Beginner',
    level_intermediate: 'Intermediate',
    level_advanced: 'Advanced',
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
    level_beginner: 'Pemula',
    level_intermediate: 'Menengah',
    level_advanced: 'Mahir',
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
  document.documentElement.lang = selected;

  // 1. All elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) {
      element.textContent = t[key];
    }
  });

  // 2. Language switcher button labels
  const labelText = t.langCode;
  ['landingLangLabel', 'appLangLabel', 'modalLangLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = labelText;
  });

  // 3. Language options checkmarks and active state
  document.querySelectorAll('.lang-opt').forEach(opt => {
    const isActive = opt.dataset.setLang === selected;
    opt.classList.toggle('active', isActive);
  });
  document.getElementById('checkLandingEn')?.classList.toggle('hidden', selected !== 'en');
  document.getElementById('checkLandingId')?.classList.toggle('hidden', selected !== 'id');
  document.getElementById('checkAppEn')?.classList.toggle('hidden', selected !== 'en');
  document.getElementById('checkAppId')?.classList.toggle('hidden', selected !== 'id');
  document.getElementById('checkModalEn')?.classList.toggle('hidden', selected !== 'en');
  document.getElementById('checkModalId')?.classList.toggle('hidden', selected !== 'id');

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
    const diffWord = currentDiff === 'beginner' ? t.level_beginner : currentDiff === 'advanced' ? t.level_advanced : t.level_intermediate;
    if (selected === 'id') {
      dashDesc.innerHTML = `Tingkat belajar Anda: <strong id="dashLevelWord">${diffWord}</strong>. Buka materi pelajaran atau mulai kuis untuk menjaga streak Anda.`;
    } else {
      dashDesc.innerHTML = `You're set to <strong id="dashLevelWord">${diffWord}</strong> level. Jump back into a lesson or run a quick quiz to keep your streak alive.`;
    }
  }

  // 9. Quicklink card descriptions
  const qlItems = document.querySelectorAll('.ql-item');
  qlItems.forEach(item => {
    if (item.dataset.gotoReview) {
      item.querySelector('h3').textContent = t.targeted_review;
      item.querySelector('p').textContent = t.ql_review_desc;
    } else if (item.dataset.gotoMaterial === 'tenses') {
      item.querySelector('h3').textContent = t.sub_tenses;
      item.querySelector('p').textContent = t.ql_tenses_desc;
    } else if (item.dataset.gotoMaterial === 'tobe') {
      item.querySelector('h3').textContent = t.sub_tobe;
      item.querySelector('p').textContent = t.ql_tobe_desc;
    } else if (item.dataset.gotoMaterial === 'vocabulary') {
      item.querySelector('h3').textContent = t.sub_vocabulary;
      item.querySelector('p').textContent = t.ql_vocab_desc;
    } else if (item.dataset.gotoMaterial === 'grammar') {
      item.querySelector('h3').textContent = t.sub_grammar;
      item.querySelector('p').textContent = t.ql_grammar_desc;
    } else if (item.dataset.gotoPractice === 'quiz') {
      item.querySelector('h3').textContent = t.tab_quick_quiz;
      item.querySelector('p').textContent = t.ql_quiz_desc;
    } else if (item.dataset.gotoPractice === 'ai') {
      item.querySelector('h3').textContent = t.tab_ai_test;
      item.querySelector('p').textContent = t.ql_ai_desc;
    }
  });
}

export function applyLanguage(lang, { state, saveState, showToast } = {}) {
  const selected = lang === 'id' ? 'id' : 'en';
  if (state) state.lang = selected;
  translateUI(selected, state);
  closeAllLangDropdowns();
  if (saveState) saveState();
  if (showToast) showToast(I18N[selected].switchMsg);
}
