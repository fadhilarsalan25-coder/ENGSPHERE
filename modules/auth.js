import { state } from './state.js';
import { escapeHtml } from './utils.js';

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
  const profiles = state.profiles || [];
  if (!profiles.length) {
    list.innerHTML = '<div style="font-size:.82rem;color:var(--muted-dim);padding:.4rem;">No saved profiles on this browser yet.</div>';
    return;
  }
  profiles.forEach((profile, idx) => {
    const row = document.createElement('div');
    row.className = 'profile-row' + (idx === state.activeProfile ? ' selected' : '');
    row.innerHTML = `
      <div class="avatar sm">${escapeHtml(profile.initials || 'L')}</div>
      <div class="profile-row-info">
        <strong>${escapeHtml(profile.name || 'Learner')}</strong>
        <span>${escapeHtml(profile.email || 'learner@engsphere.app')} · Level ${state.level}</span>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" style="font-size:.74rem;padding:.2rem .5rem;">Use</button>
    `;
    row.addEventListener('click', () => {
      const idInput = document.getElementById('authLoginIdentifier');
      if (idInput) idInput.value = profile.email || profile.name;
      state.activeProfile = idx;
      if (typeof window.loginUser === 'function') {
        window.loginUser(profile.email || profile.name, '');
      }
    });
    list.appendChild(row);
  });
}

export function openAuthModal(mode = 'signup') {
  const modal = document.getElementById('authModalOverlay');
  if (!modal) return;
  setAuthAlert('');
  modal.classList.remove('hidden');

  const tabSignUp = document.getElementById('authTabSignUp');
  const tabLogin = document.getElementById('authTabLogin');
  const paneSignUp = document.getElementById('authPaneSignUp');
  const paneLogin = document.getElementById('authPaneLogin');

  if (mode === 'signup') {
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
  renderAuthSavedProfiles();
}

export function openProfileModal() {
  const modal = document.getElementById('profileModalOverlay');
  if (!modal) return;
  modal.classList.remove('hidden');
}

export function closeAllModals() {
  document.getElementById('authModalOverlay')?.classList.add('hidden');
  document.getElementById('profileModalOverlay')?.classList.add('hidden');
  document.getElementById('hubNameEditForm')?.classList.add('hidden');
  setAuthAlert('');
}

export function signUpUser(name, email, password, level, goal) {
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

  if (!Array.isArray(state.users)) state.users = [];
  const existingUser = state.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    setAuthAlert(`An account with email "${cleanEmail}" already exists. Please log in instead.`);
    return;
  }

  const initials = cleanName.charAt(0).toUpperCase();
  const newUser = { id: 'usr_' + Date.now(), name: cleanName, initials, email: cleanEmail, password: cleanPw, level: level || 'intermediate', goal: goal || 'conversation', createdAt: new Date().toISOString() };
  state.users.unshift(newUser);

  const newProfile = { name: cleanName, initials, email: cleanEmail };
  state.profiles = Array.isArray(state.profiles) ? [newProfile, ...state.profiles] : [newProfile];
  state.activeProfile = 0;
  state.personalizedLearning = { ...state.personalizedLearning, level: level || 'intermediate', goal: goal || 'conversation', dailyXpGoal: 100 };
  state.selectedDifficulty = level || 'intermediate';
  state.isLoggedIn = true;

  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');
  closeAllModals();
  if (typeof window.setView === 'function') window.setView('dashboard');
}

export function loginUser(identifier, password) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    setAuthAlert('Please enter your email or username to log in.');
    document.getElementById('authLoginIdentifier')?.focus();
    return;
  }

  const matchedUser = (state.users || []).find(u =>
    (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) ||
    (u.name && u.name.toLowerCase() === cleanId.toLowerCase())
  );

  const cleanPw = (password || '').trim();
  if (matchedUser && matchedUser.password) {
    if (matchedUser.password !== cleanPw) {
      setAuthAlert('Incorrect password. Please verify and try again.');
      document.getElementById('authLoginPassword')?.focus();
      return;
    }
  }

  const userName = matchedUser ? matchedUser.name : cleanId;
  const userEmail = matchedUser ? matchedUser.email : `${cleanId.toLowerCase().replace(/\s+/g, '')}@engsphere.app`;
  const initials = userName.charAt(0).toUpperCase();

  if (!Array.isArray(state.profiles)) state.profiles = [];
  const existingIndex = state.profiles.findIndex(p =>
    (p.email && p.email.toLowerCase() === userEmail.toLowerCase()) ||
    (p.name && p.name.toLowerCase() === userName.toLowerCase())
  );

  if (existingIndex >= 0) state.activeProfile = existingIndex;
  else {
    state.profiles.unshift({ name: userName, initials, email: userEmail });
    state.activeProfile = 0;
  }

  if (matchedUser && matchedUser.level) {
    state.personalizedLearning = { ...state.personalizedLearning, level: matchedUser.level, goal: matchedUser.goal || 'conversation' };
    state.selectedDifficulty = matchedUser.level;
  }

  state.isLoggedIn = true;
  closeAllModals();
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');
  if (typeof window.setView === 'function') window.setView('dashboard');
}

export function continueAsGuest() {
  loginUser('Guest Learner', '');
}

export function signOutUser() {
  state.isLoggedIn = false;
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('landing')?.classList.remove('hidden');
  if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
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
