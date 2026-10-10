export { STORAGE_KEY } from './data.js';
import { STORAGE_KEY } from './data.js';

export const createDefaultState = () => ({
  isLoggedIn: false,
  isGuest: true,
  supabaseUserId: null,
  theme: 'dark',
  lang: 'en',
  level: 1,
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  history: [],
  users: [
    { id: 'usr_default', name: 'Learner', initials: 'L', email: 'learner@engsphere.app', password: '', level: 'intermediate', goal: 'conversation' }
  ],
  profiles: [
    { name: 'Learner', initials: 'L', email: 'learner@engsphere.app' }
  ],
  activeProfile: 0,
  personalizedLearning: {
    goal: 'conversation',
    level: 'intermediate',
    dailyXpGoal: 100,
    customNotes: 'Focus on everyday speaking tenses and clear explanations for incorrect choices.'
  },
  currentView: 'dashboard',
  selectedMaterial: 'tenses',
  selectedPracticeTab: 'quiz',
  selectedTopic: 'mixed',
  selectedDifficulty: 'intermediate',
  selectedAIQuestions: 5,
  openTense: null,
  quiz: null,
  ai: null,
  reviewQuestions: [],
  reviewFilter: 'all'
});

export const state = createDefaultState();

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    if (!Array.isArray(state.history)) state.history = [];
    if (!Array.isArray(state.users) || !state.users.length) {
      state.users = createDefaultState().users;
    }
    if (!Array.isArray(state.profiles) || !state.profiles.length) {
      state.profiles = createDefaultState().profiles;
    }
    if (!Array.isArray(state.reviewQuestions)) state.reviewQuestions = [];
    if (!state.personalizedLearning) state.personalizedLearning = createDefaultState().personalizedLearning;
    if (!state.theme || (state.theme !== 'light' && state.theme !== 'dark')) state.theme = 'dark';
    if (!state.lang || (state.lang !== 'id' && state.lang !== 'en')) state.lang = 'en';

    // Reconcile and synchronize learning proficiency level
    const prof = getProficiencyLevel();
    if (!state.selectedDifficulty || (state.selectedDifficulty === 'beginner' && prof !== 'beginner')) {
      state.selectedDifficulty = prof;
    }
    if (state.personalizedLearning) {
      state.personalizedLearning.level = prof;
    }
    if (state.profiles && state.profiles[state.activeProfile]) {
      state.profiles[state.activeProfile].level = prof;
    }

    if (typeof state.isGuest === 'undefined') {
      const activeProf = state.profiles?.[state.activeProfile];
      state.isGuest = !state.isLoggedIn || (activeProf?.name === 'Guest Learner' && !state.supabaseUserId);
    }
  } catch (error) {
    console.warn('Could not read state', error);
  }
}

export function isGuestUser() {
  if (!state.isLoggedIn) return true;
  if (state.isGuest === true) return true;
  const activeProf = state.profiles?.[state.activeProfile];
  if (activeProf && (activeProf.name === 'Guest Learner' || activeProf.email === 'guest@engsphere.app') && !state.supabaseUserId) {
    return true;
  }
  return false;
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save state', error);
  }
}

export function applyStreak() {
  const today = new Date();
  const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (state.lastActiveDay && Math.abs(todayKey - state.lastActiveDay) > 86400000 * 1.5) {
    state.streak = 0;
  }
  state.lastActiveDay = todayKey;
}

export function levelForXp(xp) {
  return Math.max(1, Math.min(9, Math.floor(xp / 100) + 1));
}

export function getProficiencyLevel() {
  const activeProf = state.profiles?.[state.activeProfile] || state.profiles?.[0];
  const matchedUser = (state.users || []).find(u =>
    (activeProf?.email && u.email && u.email.toLowerCase() === activeProf.email.toLowerCase()) ||
    (activeProf?.name && u.name && u.name.toLowerCase() === activeProf.name.toLowerCase())
  );
  const val = state.personalizedLearning?.level || matchedUser?.level || activeProf?.level || state.selectedDifficulty;
  if (val && ['beginner', 'intermediate', 'advanced'].includes(String(val).toLowerCase())) {
    return String(val).toLowerCase();
  }
  return 'intermediate';
}

export function levelLabel(level, preferredProficiency) {
  if (preferredProficiency && ['beginner', 'intermediate', 'advanced'].includes(String(preferredProficiency).toLowerCase())) {
    const p = String(preferredProficiency).toLowerCase();
    return p === 'beginner' ? 'Beginner' : p === 'advanced' ? 'Advanced' : 'Intermediate';
  }
  const prof = getProficiencyLevel();
  if (prof) {
    return prof === 'beginner' ? 'Beginner' : prof === 'advanced' ? 'Advanced' : 'Intermediate';
  }
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Intermediate';
  return 'Advanced';
}
