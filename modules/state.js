/* Shared application state and defaults. */
export const STORAGE_KEY = 'engsphere-state';

export const createDefaultState = () => ({
  isLoggedIn: false,
  theme: 'dark',
  lang: 'en',
  level: 1,
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  history: [],
  users: [{ id: 'usr_default', name: 'Learner', initials: 'L', email: 'learner@engsphere.app', password: '', level: 'intermediate', goal: 'conversation' }],
  profiles: [{ name: 'Learner', initials: 'L', email: 'learner@engsphere.app' }],
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
