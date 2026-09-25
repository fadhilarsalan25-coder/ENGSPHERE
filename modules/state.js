import { STORAGE_KEY } from './data.js';

export const createDefaultState = () => ({
  isLoggedIn: false,
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
    if (!state.theme) state.theme = 'dark';
    if (!state.lang || (state.lang !== 'id' && state.lang !== 'en')) state.lang = 'en';
  } catch (error) {
    console.warn('Could not read state', error);
  }
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

export function levelLabel(level) {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Intermediate';
  return 'Advanced';
}
