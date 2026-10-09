import { state, saveState } from './state.js';
import { escapeHtml } from './utils.js';
import {
  signUpWithSupabase,
  signInWithSupabase,
  signOutFromSupabase,
  fetchCloudProfile,
  fetchCloudQuizHistory,
  isSupabaseReady
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
  saveState();
  if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
  if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();

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

  state.isLoggedIn = true;
  saveState();
  if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
  if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();

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

export function continueAsGuest() {
  loginUser('Guest Learner', '');
}

export function signOutUser() {
  state.isLoggedIn = false;
  state.supabaseUserId = null;
  signOutFromSupabase();
  saveState();
  closeAllModals();
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
