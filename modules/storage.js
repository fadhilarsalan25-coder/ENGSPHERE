import { STORAGE_KEY, state, createDefaultState } from './state.js';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    Object.assign(state, createDefaultState(), JSON.parse(raw));
    if (!Array.isArray(state.history)) state.history = [];
    if (!Array.isArray(state.users) || !state.users.length) state.users = createDefaultState().users;
    if (!Array.isArray(state.profiles) || !state.profiles.length) state.profiles = createDefaultState().profiles;
    if (!Array.isArray(state.reviewQuestions)) state.reviewQuestions = [];
    if (!state.personalizedLearning) state.personalizedLearning = createDefaultState().personalizedLearning;
    if (!state.theme) state.theme = 'dark';
    if (!['en', 'id'].includes(state.lang)) state.lang = 'en';
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
