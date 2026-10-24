import { state, saveState, isGuestUser } from './state.js';
export { isGuestUser };
import { escapeHtml } from './utils.js';
import { showToast } from './notifications.js';
import {
  signUpWithSupabase,
  signInWithSupabase,
  signInWithGoogle,
  signOutFromSupabase,
  fetchCloudProfile, 
  fetchCloudQuizHistory,
  isSupabaseReady,
  syncCloudProfile
} from './supabase-client.js';

export function setAuthAlert(msg, type = 'error') {
  const alertBox = document.getElementById('authAlertBox');
  if (!alertBox) return;
  if (!msg) {
    alertBox.textContent = '';
    alertBox.className = 'auth-alert hidden';
    return;
  }
  alertBox.className = `auth-alert ${type}`;
  const icon = type === 'error' ? '⚠️' : (type === 'success' ? '✅' : 'ℹ️');
  alertBox.innerHTML = `<span>${icon}</span> <span>${escapeHtml(msg)}</span>`;
}

export function renderAuthSavedProfiles() {
  const list = document.getElementById('authProfileList');
  if (!list) return;
  list.innerHTML = '';
}

export function openAuthModal(mode = 'sign-up') {
  const modal = document.getElementById('authModalOverlay');
  if (!modal) return;
  setAuthAlert('');
  modal.classList.remove('hidden');
  modal.style.setProperty('display', 'flex', 'important');

  const tabSignUp = document.getElementById('authTabSignUp');
  const tabLogin = document.getElementById('authTabLogin');
  const paneSignUp = document.getElementById('authPaneSignUp');
  const paneLogin = document.getElementById('authPaneLogin');

  if (mode === 'sign-up' || mode === 'signup') {
    tabSignUp?.classList.add('active');
    tabLogin?.classList.remove('active');
    paneSignUp?.classList.remove('hidden');
    paneLogin?.classList.add('hidden');
    setTimeout(() => document.getElementById('authSignUpName')?.focus(), 60);
  } else {
    tabSignUp?.classList.remove('active');
    tabLogin?.classList.add('active');
    paneSignUp?.classList.add('hidden');
    paneLogin?.classList.remove('hidden');
    setTimeout(() => document.getElementById('authLoginIdentifier')?.focus(), 60);
  }
}

export function openProfileModal(subtab = 'personalized') {
  const modal = document.getElementById('profileModalOverlay');
  if (!modal) return;
  if (typeof window.syncProfileHubUI === 'function') {
    window.syncProfileHubUI();
  }
  const tabBtn = document.querySelector(`.prof-subtab-btn[data-prof-tab="${subtab}"]`);
  if (tabBtn) tabBtn.click();
  modal.classList.remove('hidden');
  modal.style.setProperty('display', 'flex', 'important');
}

export function closeAllModals() {
  const authModal = document.getElementById('authModalOverlay');
  if (authModal) {
    authModal.classList.add('hidden');
    authModal.style.removeProperty('display');
  }
  const profModal = document.getElementById('profileModalOverlay');
  if (profModal) {
    profModal.classList.add('hidden');
    profModal.style.removeProperty('display');
  }
  const onbModal = document.getElementById('onboardingModalOverlay');
  if (onbModal) {
    onbModal.classList.add('hidden');
    onbModal.style.removeProperty('display');
  }
  document.getElementById('hubNameEditForm')?.classList.add('hidden');
  setAuthAlert('');
}

export async function signUpUser(name, email, password, level, goal) {
  const cleanName = (name || '').trim();
  if (!cleanName || cleanName.length < 2) {
    setAuthAlert('Please enter your full name or nickname (at least 2 characters).');
    document.getElementById('authSignUpName')?.focus();
    return;
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setAuthAlert('Please enter a valid email address (e.g. alex@example.com).');
    document.getElementById('authSignUpEmail')?.focus();
    return;
  }

  const cleanPw = (password || '').trim();
  if (!cleanPw || cleanPw.length < 8) {
    setAuthAlert('Please create a password with at least 8 characters.');
    document.getElementById('authSignUpPassword')?.focus();
    return;
  }

  let cloudUserId = null;
  if (isSupabaseReady()) {
    try {
      const res = await signUpWithSupabase(cleanName, cleanEmail, cleanPw, level, goal);
      if (res?.error && !res.error.toLowerCase().includes('already registered')) {
        if (res.error.toLowerCase().includes('password') || res.error.toLowerCase().includes('valid')) {
          setAuthAlert(res.error);
          return;
        }
      }
      if (res?.user?.id) {
        cloudUserId = res.user.id;
      }
    } catch (e) {
      console.warn('Cloud sign-up fallback:', e);
    }
  }

  if (!Array.isArray(state.users)) state.users = [];
  const existingUser = state.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (existingUser && !cloudUserId) {
    setAuthAlert(`An account with email "${cleanEmail}" already exists. Please log in instead.`);
    return;
  }

  const initials = cleanName.charAt(0).toUpperCase();
  const newUser = {
    id: cloudUserId || ('usr_' + Date.now()),
    name: cleanName,
    initials,
    email: cleanEmail,
    password: cleanPw,
    level: level || 'intermediate',
    goal: goal || 'conversation',
    createdAt: new Date().toISOString()
  };
  state.users.unshift(newUser);

  const newProfile = { name: cleanName, initials, email: cleanEmail, supabaseUserId: cloudUserId, level: level || 'intermediate' };
  state.profiles = Array.isArray(state.profiles) ? [newProfile, ...state.profiles] : [newProfile];
  state.activeProfile = 0;
  state.supabaseUserId = cloudUserId;
  state.personalizedLearning = { ...state.personalizedLearning, level: level || 'intermediate', goal: goal || 'conversation', dailyXpGoal: 100 };
  state.selectedDifficulty = level || 'intermediate';
  state.isLoggedIn = true;
  state.isGuest = false;
  saveState();
  if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
  if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();
  if (typeof window.syncQuizGuestRestrictionsUI === 'function') window.syncQuizGuestRestrictionsUI();

  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');
  closeAllModals();
  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  if (typeof window.setView === 'function') window.setView('dashboard');
  if (cloudUserId && typeof window.showToast === 'function') {
    window.showToast('Account connected to Supabase Cloud! ☁️');
  }

  // Launch onboarding intake interview questionnaire for newly registered user
  setTimeout(() => {
    if (typeof window.openOnboardingModal === 'function') {
      window.openOnboardingModal(true);
    }
  }, 250);
}

export async function loginUser(identifier, password) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    setAuthAlert('Please enter your email or username to log in.');
    document.getElementById('authLoginIdentifier')?.focus();
    return;
  }

  const cleanPw = (password || '').trim();
  let cloudUserId = null;

  if (cleanId.includes('@') && cleanPw && isSupabaseReady()) {
    try {
      const res = await signInWithSupabase(cleanId.toLowerCase(), cleanPw);
      if (res?.user?.id) {
        cloudUserId = res.user.id;
        state.supabaseUserId = cloudUserId;

        // Fetch cloud profile if exists
        const cloudProf = await fetchCloudProfile(cloudUserId);
        if (cloudProf) {
          if (typeof cloudProf.xp === 'number') state.xp = cloudProf.xp;
          if (typeof cloudProf.level === 'number') state.level = cloudProf.level;
          if (typeof cloudProf.streak === 'number') state.streak = cloudProf.streak;
        }

        // Fetch cloud quiz history
        const cloudHistory = await fetchCloudQuizHistory(cloudUserId);
        if (Array.isArray(cloudHistory) && cloudHistory.length) {
          state.history = cloudHistory.map(row => ({
            label: `Quiz (${row.topic || 'general'})`,
            score: row.score || 0,
            timestamp: new Date(row.created_at).getTime()
          }));
        }
      } else if (res?.error && !state.users.some(u => u.email === cleanId.toLowerCase())) {
        setAuthAlert(res.error);
        return;
      }
    } catch (e) {
      console.warn('Cloud sign-in fallback:', e);
    }
  }

  const matchedUser = (state.users || []).find(u =>
    (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) ||
    (u.name && u.name.toLowerCase() === cleanId.toLowerCase())
  );

  if (matchedUser && matchedUser.password && !cloudUserId) {
    if (matchedUser.password !== cleanPw) {
      setAuthAlert('Incorrect password. Please verify and try again.');
      document.getElementById('authLoginPassword')?.focus();
      return;
    }
  }

  const userName = matchedUser ? matchedUser.name : (cleanId.includes('@') ? cleanId.split('@')[0] : cleanId);
  const userEmail = matchedUser ? matchedUser.email : (cleanId.includes('@') ? cleanId.toLowerCase() : `${cleanId.toLowerCase().replace(/\s+/g, '')}@engsphere.app`);
  const initials = userName.charAt(0).toUpperCase();

  if (!Array.isArray(state.profiles)) state.profiles = [];
  const existingIndex = state.profiles.findIndex(p =>
    (p.email && p.email.toLowerCase() === userEmail.toLowerCase()) ||
    (p.name && p.name.toLowerCase() === userName.toLowerCase())
  );

  if (existingIndex >= 0) {
    state.activeProfile = existingIndex;
    if (cloudUserId) state.profiles[existingIndex].supabaseUserId = cloudUserId;
  } else {
    state.profiles.unshift({ name: userName, initials, email: userEmail, supabaseUserId: cloudUserId });
    state.activeProfile = 0;
  }

  if (matchedUser && matchedUser.level) {
    state.personalizedLearning = { ...state.personalizedLearning, level: matchedUser.level, goal: matchedUser.goal || 'conversation' };
    state.selectedDifficulty = matchedUser.level;
    if (state.profiles && state.profiles[state.activeProfile]) {
      state.profiles[state.activeProfile].level = matchedUser.level;
    }
  }

  const isGuestLogin = cleanId.toLowerCase() === 'guest learner' && !cleanPw;
  state.isGuest = isGuestLogin;
  state.isLoggedIn = true;
  if (isGuestLogin) {
    state.selectedTopic = 'mixed';
    if (state.selectedDifficulty === 'advanced') state.selectedDifficulty = 'intermediate';
  }
  saveState();
  if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
  if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();
  if (typeof window.syncQuizGuestRestrictionsUI === 'function') window.syncQuizGuestRestrictionsUI();

  closeAllModals();
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');
  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  if (typeof window.setView === 'function') window.setView('dashboard');

  if (cloudUserId && typeof window.showToast === 'function') {
    window.showToast('Logged in & synced with Supabase Cloud! ☁️');
  }
}

export async function loginWithGoogle() {
  setAuthAlert('');
  if (!isSupabaseReady()) {
    setAuthAlert('Supabase client is not ready. Please try again.');
    return;
  }
  const res = await signInWithGoogle();
  if (res?.error) {
    setAuthAlert(res.error);
  }
}

export function continueAsGuest() {
  state.isGuest = true;
  state.isLoggedIn = true;
  state.supabaseUserId = null;
  state.selectedTopic = 'mixed';
  if (state.selectedDifficulty === 'advanced') {
    state.selectedDifficulty = 'intermediate';
  }
  loginUser('Guest Learner', '');
}

export function signOutUser() {
  state.isLoggedIn = false;
  state.isGuest = true;
  state.supabaseUserId = null;
  state.selectedTopic = 'mixed';
  if (state.selectedDifficulty === 'advanced') state.selectedDifficulty = 'intermediate';
  signOutFromSupabase();
  saveState();
  closeAllModals();
  if (typeof window.syncQuizGuestRestrictionsUI === 'function') window.syncQuizGuestRestrictionsUI();
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('landing')?.classList.remove('hidden');
  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
}

export function exportUserData() {
  const backupData = { app: 'EngSphere', version: '1.2.0', exportedAt: new Date().toISOString(), state };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', `engsphere-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function importUserData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const importedState = parsed.state || parsed;
      Object.assign(state, importedState);
    } catch (error) {
      console.error(error);
    }
  };
  reader.readAsText(file);
}

/* ========================================================
   ONBOARDING / INTAKE INTERVIEW QUESTIONNAIRE
   ======================================================== */

// 5 Rich Onboarding Interview Questions for English Learners
export const ONBOARDING_QUESTIONS = [
  {
    key: 'status',
    stepNumber: 1,
    badge: '👤 Status & Keseharian',
    badgeEn: '👤 Current Background',
    titleId: 'Apa status atau aktivitas utamamu saat ini?',
    titleEn: 'What is your current occupation or status?',
    subtitleId: 'EngSphere akan menyesuaikan konteks latihan, materi contoh, dan kosakata dengan dunia keseharianmu.',
    subtitleEn: 'We tailor practice contexts, examples, and vocabulary to match your everyday activities.',
    options: [
      {
        value: 'student_school',
        icon: '🎒',
        labelId: 'Pelajar Sekolah (SD / SMP / SMA / SMK)',
        labelEn: 'School Student (K-12)',
        descId: 'Fokus materi kurikulum sekolah, pemahaman dasar grammar, dan persiapan ujian.',
        descEn: 'School curriculum, core grammar foundation, and exam preparation.'
      },
      {
        value: 'college',
        icon: '🎓',
        labelId: 'Mahasiswa / Universitas',
        labelEn: 'University Student',
        descId: 'Kebutuhan skripsi, jurnal akademik, presentasi kampus, dan program pertukaran.',
        descEn: 'Academic research, thesis writing, presentations, and student exchange.'
      },
      {
        value: 'employee',
        icon: '💼',
        labelId: 'Karyawan / Profesional Kerja',
        labelEn: 'Working Professional / Employee',
        descId: 'Meeting bahasa Inggris, email profesional, presentasi bisnis, dan karir multinasional.',
        descEn: 'Workplace meetings, corporate emailing, presentations, and career advancement.'
      },
      {
        value: 'entrepreneur',
        icon: '🏢',
        labelId: 'Pebisnis / Wirausaha / Freelancer',
        labelEn: 'Entrepreneur / Freelancer',
        descId: 'Komunikasi dengan klien global, negosiasi kemitraan luar negeri, dan branding.',
        descEn: 'Pitching international clients, cross-border partnerships, and global trade.'
      },
      {
        value: 'jobseeker',
        icon: '🌍',
        labelId: 'Pencari Kerja (Job Seeker)',
        labelEn: 'Job Seeker / Career Switcher',
        descId: 'Persiapan wawancara kerja (job interview) bahasa Inggris dan CV internasional.',
        descEn: 'English job interview mastery, resume screening, and global opportunities.'
      },
      {
        value: 'general',
        icon: '🏡',
        labelId: 'Umum / Pembelajar Mandiri',
        labelEn: 'Lifelong Learner / General',
        descId: 'Mengisi waktu luang secara produktif, mengasah daya ingat, dan memperluas wawasan.',
        descEn: 'Self-enrichment, cognitive sharpness, and confident global perspective.'
      }
    ]
  },
  {
    key: 'goal',
    stepNumber: 2,
    badge: '🎯 Keperluan & Target',
    badgeEn: '🎯 Primary Motivation',
    titleId: 'Apa keperluan atau target utamamu belajar bahasa Inggris?',
    titleEn: 'What is your primary goal for learning English?',
    subtitleId: 'Tujuan ini akan menjadi kompas prioritas tantangan harian dan kuis yang direkomendasikan untukmu.',
    subtitleEn: 'This goal guides your daily challenges and recommended practice quizzes.',
    options: [
      {
        value: 'career',
        icon: '💼',
        labelId: 'Karir & Komunikasi Tempat Kerja',
        labelEn: 'Career & Workplace Communication',
        descId: 'Percaya diri saat berbicara di meeting, membalas email cepat, dan negosiasi.',
        descEn: 'Speak confidently during corporate meetings, client calls, and written emails.'
      },
      {
        value: 'exam',
        icon: '🎯',
        labelId: 'Persiapan Ujian & Beasiswa (IELTS / TOEFL / TOEIC)',
        labelEn: 'Standardized Exams & Scholarships',
        descId: 'Mengejar skor tinggi untuk beasiswa LPDP, kuliah luar negeri, atau syarat kerja.',
        descEn: 'Target high band scores for overseas study, government scholarships, and visas.'
      },
      {
        value: 'conversation',
        icon: '🗣️',
        labelId: 'Percakapan Sehari-hari & Kelancaran Spontan',
        labelEn: 'Daily Conversation & Speaking Fluency',
        descId: 'Mengatasi rasa gugup dan "blank", agar bisa ngobrol santai tanpa takut salah grammar.',
        descEn: 'Overcome hesitation and fear of mistakes to chat naturally in social settings.'
      },
      {
        value: 'travel',
        icon: '✈️',
        labelId: 'Traveling & Sosialisasi Global',
        labelEn: 'Travel & Global Socializing',
        descId: 'Mandiri saat ke luar negeri: di bandara, restoran, hotel, dan berteman dengan turis.',
        descEn: 'Navigate international journeys, transit, ordering, and making friends worldwide.'
      },
      {
        value: 'media',
        icon: '🎬',
        labelId: 'Menikmati Film, Buku & Konten Global',
        labelEn: 'Global Media, Books & Podcasts',
        descId: 'Menonton video/film tanpa subtitle, membaca artikel ilmiah, dan mendengar podcast.',
        descEn: 'Watch media without subtitles, understand podcasts, and read articles easily.'
      },
      {
        value: 'growth',
        icon: '🧠',
        labelId: 'Pengembangan Diri & Hobi Produktif',
        labelEn: 'Self-Development & Personal Growth',
        descId: 'Menguasai bahasa internasional sebagai investasi keterampilan hidup jangka panjang.',
        descEn: 'Lifelong cognitive agility and mastering the world’s primary bridge language.'
      }
    ]
  },
  {
    key: 'level',
    stepNumber: 3,
    badge: '📈 Tingkat Kemampuan',
    badgeEn: '📈 Current Proficiency',
    titleId: 'Bagaimana perkiraan tingkat kemampuanmu saat ini?',
    titleEn: 'How would you rate your current English proficiency?',
    subtitleId: 'Pilih yang paling menggambarkan rasa percayamu. Level ini menentukan tingkat kesulitan kuis awal.',
    subtitleEn: 'Choose what best matches your current baseline. This calibrates your initial quiz difficulty.',
    options: [
      {
        value: 'beginner',
        icon: '🌱',
        labelId: 'Pemula (Beginner / A1-A2)',
        labelEn: 'Beginner (A1-A2)',
        descId: 'Tahu kosakata dasar dan pola "to be" simpel, tapi masih bingung membuat kalimat utuh.',
        descEn: 'Familiar with basic words and simple "to be", but struggle constructing full sentences.'
      },
      {
        value: 'intermediate',
        icon: '🌿',
        labelId: 'Menengah (Intermediate / B1-B2)',
        labelEn: 'Intermediate (B1-B2)',
        descId: 'Paham percakapan umum, namun sering ragu pada 16 tenses dan ekspresi baku. (Paling Populer)',
        descEn: 'Can converse generally, but hesitate over complex tenses and formal expressions. (Most Popular)'
      },
      {
        value: 'advanced',
        icon: '🦅',
        labelId: 'Mahir (Advanced / C1-C2)',
        labelEn: 'Advanced (C1-C2)',
        descId: 'Lancar berkomunikasi, ingin memperdalam nuansa idiom, gaya bahasa formal, dan ketepatan tinggi.',
        descEn: 'Fluent and articulate, aiming to polish nuanced idioms and high-precision grammar.'
      }
    ]
  },
  {
    key: 'focusArea',
    stepNumber: 4,
    badge: '🔍 Area Fokus Utama',
    badgeEn: '🔍 Priority Skill Focus',
    titleId: 'Keahlian mana yang paling ingin kamu prioritaskan?',
    titleEn: 'Which skill area do you want to strengthen first?',
    subtitleId: 'EngSphere akan memprioritaskan bank soal dan kartu rangkuman yang relevan dengan skill ini.',
    subtitleEn: 'EngSphere will prioritize relevant quizzes and study summaries for this skill.',
    options: [
      {
        value: 'speaking',
        icon: '🗣️',
        labelId: 'Speaking & Respons Percakapan',
        labelEn: 'Speaking & Conversational Agility',
        descId: 'Melatih kelancaran lidah, respons cepat tanpa mikir terjemahan di kepala, dan pelafalan.',
        descEn: 'Train natural reflexes, speak without translating in your head, and build confidence.'
      },
      {
        value: 'grammar',
        icon: '🧩',
        labelId: 'Grammar & Pemahaman 16 Tenses',
        labelEn: 'Grammar Mastery & Tense System',
        descId: 'Fondasi susunan kata, kata kerja to be, auxiliary verbs, dan 16 pola tenses.',
        descEn: 'Core sentence structures, to be verbs, auxiliary rules, and all 16 tense aspects.'
      },
      {
        value: 'vocabulary',
        icon: '📚',
        labelId: 'Kosakata Oxford (Core 3000™ / 5000™)',
        labelEn: 'Oxford Core Vocabulary (3000™ / 5000™)',
        descId: 'Menambah ribuan kata praktis yang sering muncul dalam kehidupan nyata dan tes.',
        descEn: 'Acquire thousands of high-frequency words that appear in authentic conversations and tests.'
      },
      {
        value: 'listening',
        icon: '🎧',
        labelId: 'Listening & Pemahaman Audio',
        labelEn: 'Listening Comprehension & Accents',
        descId: 'Membiasakan telinga menangkap ucapan cepat, singkatan natural, dan intonasi penutur asli.',
        descEn: 'Train ears to decode fast speech, natural contractions, and native accents.'
      },
      {
        value: 'writing',
        icon: '✍️',
        labelId: 'Writing & Penyusunan Kalimat Baku',
        labelEn: 'Writing & Formal Composition',
        descId: 'Menyusun kalimat efektif, paragraf kohesif, dan pesan profesional bebas salah ketik.',
        descEn: 'Draft structured sentences, cohesive paragraphs, and polished professional texts.'
      }
    ]
  },
  {
    key: 'dailyCommitment',
    stepNumber: 5,
    badge: '⏱️ Komitmen Waktu Harian',
    badgeEn: '⏱️ Daily Time Target',
    titleId: 'Berapa menit kamu bisa menyisihkan waktu belajar per hari?',
    titleEn: 'How much time can you commit to practicing each day?',
    subtitleId: 'Belajar 15 menit setiap hari terbukti 4x lebih membekas daripada belajar 3 jam seminggu sekali.',
    subtitleEn: '15 minutes daily is proven 4x more effective than cramming for 3 hours once a week.',
    options: [
      {
        value: '5',
        icon: '⚡',
        labelId: '5 Menit / Hari (Santai)',
        labelEn: '5 Mins / Day (Casual)',
        descId: '1 kuis kilat per hari · Target 50 XP harian · Menjaga streak tanpa beban.',
        descEn: '1 fast quiz per day · 50 daily XP · Stress-free streak maintenance.'
      },
      {
        value: '15',
        icon: '🎯',
        labelId: '15 Menit / Hari (Teratur — Paling Ideal)',
        labelEn: '15 Mins / Day (Standard — Most Popular)',
        descId: '2 kuis + baca materi · Target 100 XP harian · Hasil seimbang dan konsisten.',
        descEn: '2 quizzes + material review · 100 daily XP · Balanced, compounding progress.'
      },
      {
        value: '30',
        icon: '🔥',
        labelId: '30 Menit / Hari (Serius)',
        labelEn: '30 Mins / Day (Serious)',
        descId: '4 kuis + hafalan flashcard · Target 200 XP harian · Peningkatan pesat dalam 1 bulan.',
        descEn: '4 quizzes + flashcard drills · 200 daily XP · Rapid noticeable fluency jump.'
      },
      {
        value: '45',
        icon: '🚀',
        labelId: '45+ Menit / Hari (Intensif)',
        labelEn: '45+ Mins / Day (Intensive)',
        descId: 'Latihan mendalam & tes simulasi · Target 300 XP harian · Persiapan tes mendesak.',
        descEn: 'Deep-dive theory & full test drills · 300 daily XP · Fast-track test readiness.'
      }
    ]
  }
];

// In-memory working draft while answering questionnaire
let currentStep = 0;
let draftAnswers = {
  status: 'employee',
  goal: 'career',
  level: 'intermediate',
  focusArea: 'speaking',
  dailyCommitment: '15'
};

export function initOnboarding() {
  const modal = document.getElementById('onboardingModalOverlay');
  if (!modal) return;

  // Next / Prev / Skip / Finish buttons
  document.getElementById('onboardingPrevBtn')?.addEventListener('click', () => {
    if (currentStep > 0) {
      renderOnboardingStep(currentStep - 1);
    }
  });

  document.getElementById('onboardingNextBtn')?.addEventListener('click', () => {
    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      renderOnboardingStep(currentStep + 1);
    } else {
      // Step 5 completed -> show final summary step
      renderOnboardingStep(ONBOARDING_QUESTIONS.length);
    }
  });

  document.getElementById('onboardingSkipBtn')?.addEventListener('click', () => {
    finishOnboarding(true);
  });

  document.getElementById('onboardingFinishBtn')?.addEventListener('click', () => {
    finishOnboarding(false);
  });

  document.getElementById('closeOnboardingModalBtn')?.addEventListener('click', () => {
    finishOnboarding(true);
  });

  // Re-open from Profile Hub
  document.getElementById('reopenOnboardingBtn')?.addEventListener('click', () => {
    // Close profile modal first
    const profModal = document.getElementById('profileModalOverlay');
    if (profModal) {
      profModal.classList.add('hidden');
      profModal.style.removeProperty('display');
    }
    openOnboardingModal(true);
  });

  // Render initial profile summary if already completed
  renderOnboardingProfileSummary();
}

export function openOnboardingModal(forceReset = false) {
  const modal = document.getElementById('onboardingModalOverlay');
  if (!modal) return;

  // Pre-populate with existing state if available
  if (state.onboarding && !forceReset) {
    draftAnswers.status = state.onboarding.status || 'employee';
    draftAnswers.goal = state.onboarding.goal || 'career';
    draftAnswers.level = state.onboarding.level || state.selectedDifficulty || 'intermediate';
    draftAnswers.focusArea = state.onboarding.focusArea || 'speaking';
    draftAnswers.dailyCommitment = String(state.onboarding.dailyCommitment || '15');
  } else if (state.personalizedLearning) {
    draftAnswers.goal = state.personalizedLearning.goal || 'career';
    draftAnswers.level = state.personalizedLearning.level || 'intermediate';
    draftAnswers.dailyCommitment = state.personalizedLearning.dailyXpGoal >= 200 ? '30' : (state.personalizedLearning.dailyXpGoal >= 100 ? '15' : '5');
  }

  currentStep = 0;
  renderOnboardingStep(0);

  modal.classList.remove('hidden');
  modal.style.setProperty('display', 'flex', 'important');
}

export function closeOnboardingModal() {
  const modal = document.getElementById('onboardingModalOverlay');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.removeProperty('display');
}

export function renderOnboardingStep(stepIdx) {
  currentStep = stepIdx;
  const isIndo = (state.lang || 'id') === 'id';
  const totalSteps = ONBOARDING_QUESTIONS.length;

  const progressBar = document.getElementById('onboardingProgressBar');
  const stepCounter = document.getElementById('onboardingStepCounter');
  const questionContainer = document.getElementById('onboardingQuestionPane');
  const summaryContainer = document.getElementById('onboardingSummaryPane');
  const prevBtn = document.getElementById('onboardingPrevBtn');
  const nextBtn = document.getElementById('onboardingNextBtn');
  const skipBtn = document.getElementById('onboardingSkipBtn');
  const finishBtn = document.getElementById('onboardingFinishBtn');

  // If final summary step (stepIdx == totalSteps)
  if (stepIdx >= totalSteps) {
    if (progressBar) progressBar.style.width = '100%';
    if (stepCounter) stepCounter.textContent = isIndo ? 'Rencana Belajar Siap! 🎉' : 'Personalized Plan Ready! 🎉';
    
    questionContainer?.classList.add('hidden');
    summaryContainer?.classList.remove('hidden');
    
    prevBtn?.classList.remove('hidden');
    nextBtn?.classList.add('hidden');
    skipBtn?.classList.add('hidden');
    finishBtn?.classList.remove('hidden');

    renderSummaryPane();
    return;
  }

  // Regular Question Step
  questionContainer?.classList.remove('hidden');
  summaryContainer?.classList.add('hidden');
  finishBtn?.classList.add('hidden');
  skipBtn?.classList.remove('hidden');
  nextBtn?.classList.remove('hidden');

  if (prevBtn) {
    prevBtn.classList.toggle('hidden', stepIdx === 0);
  }

  // Calculate percentage
  const pct = Math.round(((stepIdx + 1) / (totalSteps + 1)) * 100);
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (stepCounter) {
    stepCounter.textContent = isIndo
      ? `Pertanyaan ${stepIdx + 1} dari ${totalSteps}`
      : `Question ${stepIdx + 1} of ${totalSteps}`;
  }

  const q = ONBOARDING_QUESTIONS[stepIdx];
  const activeValue = draftAnswers[q.key];

  // Render question card
  if (questionContainer) {
    questionContainer.innerHTML = `
      <div class="onboard-step-badge">${isIndo ? q.badge : q.badgeEn}</div>
      <h3 class="onboard-question-title">${isIndo ? q.titleId : q.titleEn}</h3>
      <p class="onboard-question-sub">${isIndo ? q.subtitleId : q.subtitleEn}</p>
      
      <div class="onboard-options-grid">
        ${q.options.map(opt => {
          const isSelected = activeValue === opt.value;
          return `
            <div class="onboard-option-card ${isSelected ? 'selected' : ''}" data-opt-key="${q.key}" data-opt-val="${opt.value}">
              <div class="onboard-option-icon">${opt.icon}</div>
              <div class="onboard-option-content">
                <div class="onboard-option-label">${isIndo ? opt.labelId : opt.labelEn}</div>
                <div class="onboard-option-desc">${isIndo ? opt.descId : opt.descEn}</div>
              </div>
              <div class="onboard-option-check">${isSelected ? '✓' : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach click handlers to option cards
    questionContainer.querySelectorAll('.onboard-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.optKey;
        const val = card.dataset.optVal;
        draftAnswers[key] = val;

        // Visual update
        questionContainer.querySelectorAll('.onboard-option-card').forEach(c => {
          const match = c.dataset.optVal === val;
          c.classList.toggle('selected', match);
          c.querySelector('.onboard-option-check').textContent = match ? '✓' : '';
        });

        // Auto advance smoothly after brief tactile feedback
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            renderOnboardingStep(currentStep + 1);
          } else {
            renderOnboardingStep(totalSteps);
          }
        }, 220);
      });
    });
  }
}

function renderSummaryPane() {
  const container = document.getElementById('onboardingSummaryPane');
  if (!container) return;

  const isIndo = (state.lang || 'id') === 'id';

  // Find labels for selected values
  const statusQ = ONBOARDING_QUESTIONS.find(q => q.key === 'status');
  const goalQ = ONBOARDING_QUESTIONS.find(q => q.key === 'goal');
  const levelQ = ONBOARDING_QUESTIONS.find(q => q.key === 'level');
  const focusQ = ONBOARDING_QUESTIONS.find(q => q.key === 'focusArea');
  const timeQ = ONBOARDING_QUESTIONS.find(q => q.key === 'dailyCommitment');

  const statusObj = statusQ?.options.find(o => o.value === draftAnswers.status) || statusQ?.options[2];
  const goalObj = goalQ?.options.find(o => o.value === draftAnswers.goal) || goalQ?.options[0];
  const levelObj = levelQ?.options.find(o => o.value === draftAnswers.level) || levelQ?.options[1];
  const focusObj = focusQ?.options.find(o => o.value === draftAnswers.focusArea) || focusQ?.options[0];
  const timeObj = timeQ?.options.find(o => o.value === draftAnswers.dailyCommitment) || timeQ?.options[1];

  const userName = state.profiles?.[state.activeProfile]?.name || 'Learner';

  container.innerHTML = `
    <div class="onboard-summary-header">
      <div class="onboard-celebrate-badge">🎉 ${isIndo ? 'Kurikulum Personal Siap!' : 'Custom Curriculum Ready!'}</div>
      <h3>${isIndo ? `Halo, ${userName}! Ini Rencana Belajarmu:` : `Hello, ${userName}! Here is Your Study Plan:`}</h3>
      <p>${isIndo ? 'Berdasarkan wawancara singkatmu, kami telah mengoptimalkan tingkat kesulitan materi, kuis harian, dan target XP-mu.' : 'Based on your interview answers, we tuned your practice difficulty, daily quizzes, and XP targets.'}</p>
    </div>

    <div class="onboard-summary-cards">
      <div class="onboard-sum-card">
        <span class="sum-icon">${statusObj.icon}</span>
        <div class="sum-text">
          <span class="sum-label">${isIndo ? 'Status Pengguna' : 'User Status'}</span>
          <span class="sum-val">${isIndo ? statusObj.labelId : statusObj.labelEn}</span>
        </div>
      </div>

      <div class="onboard-sum-card">
        <span class="sum-icon">${goalObj.icon}</span>
        <div class="sum-text">
          <span class="sum-label">${isIndo ? 'Tujuan Utama' : 'Primary Target'}</span>
          <span class="sum-val">${isIndo ? goalObj.labelId : goalObj.labelEn}</span>
        </div>
      </div>

      <div class="onboard-sum-card">
        <span class="sum-icon">${levelObj.icon}</span>
        <div class="sum-text">
          <span class="sum-label">${isIndo ? 'Tingkat Kesulitan Kuis' : 'Quiz Proficiency Level'}</span>
          <span class="sum-val">${isIndo ? levelObj.labelId : levelObj.labelEn}</span>
        </div>
      </div>

      <div class="onboard-sum-card">
        <span class="sum-icon">${focusObj.icon}</span>
        <div class="sum-text">
          <span class="sum-label">${isIndo ? 'Fokus Prioritas' : 'Priority Focus'}</span>
          <span class="sum-val">${isIndo ? focusObj.labelId : focusObj.labelEn}</span>
        </div>
      </div>

      <div class="onboard-sum-card highlight">
        <span class="sum-icon">${timeObj.icon}</span>
        <div class="sum-text">
          <span class="sum-label">${isIndo ? 'Komitmen Harian' : 'Daily Goal'}</span>
          <span class="sum-val">${isIndo ? timeObj.labelId : timeObj.labelEn}</span>
        </div>
      </div>
    </div>

    <!-- Welcome Gift Box -->
    <div class="onboard-gift-box">
      <div class="gift-icon">🎁</div>
      <div class="gift-text">
        <strong>${isIndo ? 'Bonus Selamat Datang: +50 XP Starter' : 'Welcome Gift: +50 Starter XP'}</strong>
        <span>${isIndo ? 'Telah ditambahkan ke akunmu untuk mengawali perjalanan belajar bahasa Inggris dengan gemilang!' : 'Credited to your account to kickstart your English learning journey!'}</span>
      </div>
    </div>
  `;
}

function finishOnboarding(skipped = false) {
  const isIndo = (state.lang || 'id') === 'id';
  const minutes = parseInt(draftAnswers.dailyCommitment, 10) || 15;
  const xpTarget = minutes >= 45 ? 300 : (minutes >= 30 ? 200 : (minutes >= 15 ? 100 : 50));

  // 1. Update state.onboarding
  state.onboarding = {
    completed: true,
    status: draftAnswers.status || 'employee',
    goal: draftAnswers.goal || 'career',
    level: draftAnswers.level || 'intermediate',
    focusArea: draftAnswers.focusArea || 'speaking',
    dailyCommitment: minutes,
    completedAt: new Date().toISOString(),
    skipped: !!skipped
  };

  // 2. Synchronize learning calibration
  state.selectedDifficulty = draftAnswers.level || 'intermediate';
  state.selectedTopic = draftAnswers.focusArea === 'grammar' ? 'tenses' : 'mixed';

  if (!state.personalizedLearning) {
    state.personalizedLearning = {};
  }
  state.personalizedLearning.goal = draftAnswers.goal || 'career';
  state.personalizedLearning.level = draftAnswers.level || 'intermediate';
  state.personalizedLearning.dailyXpGoal = xpTarget;

  // 3. Sync active profile
  if (state.profiles && state.profiles[state.activeProfile]) {
    state.profiles[state.activeProfile].level = draftAnswers.level || 'intermediate';
  }

  // 4. Award bonus starter XP if not skipped & not awarded yet
  if (!skipped) {
    state.xp = (state.xp || 0) + 50;
    if ((state.streak || 0) === 0) {
      state.streak = 1;
    }
  }

  // Save to persistence
  saveState();

  // Sync Cloud if authenticated
  if (state.supabaseUserId) {
    syncCloudProfile(state.supabaseUserId, {
      xp: state.xp,
      level: state.level,
      streak: state.streak
    }).catch(err => console.warn('Cloud sync after onboarding:', err));
  }

  // UI Updates
  if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
  if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();
  renderOnboardingProfileSummary();

  closeOnboardingModal();

  // Toast feedback
  if (skipped) {
    showToast(isIndo ? 'Survei dilewati. Kamu bisa mengisinya kapan saja di menu Profil!' : 'Survey skipped. You can update it anytime in Profile settings!');
  } else {
    showToast(isIndo ? 'Profil belajarmu berhasil disimpan! +50 XP Starter Bonus didapatkan 🎉' : 'Learning profile saved! +50 Starter XP unlocked 🎉');
  }
}

export function renderOnboardingProfileSummary() {
  const container = document.getElementById('hubOnboardingSummaryGrid');
  if (!container) return;

  const isIndo = (state.lang || 'id') === 'id';
  const ob = state.onboarding;

  if (!ob || !ob.completed) {
    container.innerHTML = `
      <div style="grid-column:1/-1;padding:.75rem;background:var(--navy-900);border-radius:var(--r-sm);border:1px dashed var(--line);text-align:center;font-size:.85rem;color:var(--muted);">
        <span>${isIndo ? 'Wawancara profil belajar belum diisi.' : 'Learning profile survey not completed yet.'}</span>
      </div>
    `;
    return;
  }

  const statusQ = ONBOARDING_QUESTIONS.find(q => q.key === 'status');
  const goalQ = ONBOARDING_QUESTIONS.find(q => q.key === 'goal');
  const levelQ = ONBOARDING_QUESTIONS.find(q => q.key === 'level');
  const focusQ = ONBOARDING_QUESTIONS.find(q => q.key === 'focusArea');

  const statusObj = statusQ?.options.find(o => o.value === ob.status);
  const goalObj = goalQ?.options.find(o => o.value === ob.goal);
  const levelObj = levelQ?.options.find(o => o.value === ob.level);
  const focusObj = focusQ?.options.find(o => o.value === ob.focusArea);

  container.innerHTML = `
    <div class="onboard-chip-item">
      <span class="chip-k">${isIndo ? 'Status' : 'Status'}</span>
      <span class="chip-v">${statusObj ? (isIndo ? statusObj.labelId.split('(')[0] : statusObj.labelEn.split('(')[0]) : (ob.status || '-')}</span>
    </div>
    <div class="onboard-chip-item">
      <span class="chip-k">${isIndo ? 'Keperluan' : 'Goal'}</span>
      <span class="chip-v">${goalObj ? (isIndo ? goalObj.labelId.split('(')[0] : goalObj.labelEn.split('(')[0]) : (ob.goal || '-')}</span>
    </div>
    <div class="onboard-chip-item">
      <span class="chip-k">${isIndo ? 'Tingkat' : 'Level'}</span>
      <span class="chip-v">${levelObj ? (isIndo ? levelObj.labelId.split('(')[0] : levelObj.labelEn.split('(')[0]) : (ob.level || '-')}</span>
    </div>
    <div class="onboard-chip-item">
      <span class="chip-k">${isIndo ? 'Fokus' : 'Focus'}</span>
      <span class="chip-v">${focusObj ? (isIndo ? focusObj.labelId.split('(')[0] : focusObj.labelEn.split('(')[0]) : (ob.focusArea || '-')}</span>
    </div>
    <div class="onboard-chip-item">
      <span class="chip-k">${isIndo ? 'Target Harian' : 'Daily Goal'}</span>
      <span class="chip-v">${ob.dailyCommitment || 15} ${isIndo ? 'Menit/hari' : 'Mins/day'}</span>
    </div>
  `;
}

