import './bootstrap.js';
import { setView } from './bootstrap.js';
import { openAuthModal } from './auth.js';
import { state, saveState } from './state.js';
import { getSupabase, fetchCloudProfile } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.setView = setView;
    window.openAuthModal = openAuthModal;

    // Check for existing Supabase cloud session
    const sb = getSupabase();
    if (sb) {
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user?.id) {
          state.isLoggedIn = true;
          state.isGuest = false;
          state.supabaseUserId = session.user.id;
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.display_name || userEmail.split('@')[0] || 'Learner';

          if (!Array.isArray(state.profiles)) state.profiles = [];
          const idx = state.profiles.findIndex(p => p.email === userEmail || p.supabaseUserId === session.user.id);
          if (idx >= 0) {
            state.activeProfile = idx;
          } else {
            state.profiles.unshift({
              name: userName,
              initials: userName.charAt(0).toUpperCase(),
              email: userEmail,
              supabaseUserId: session.user.id
            });
            state.activeProfile = 0;
          }

          const cloudProf = await fetchCloudProfile(session.user.id);
          if (cloudProf) {
            if (typeof cloudProf.xp === 'number') state.xp = cloudProf.xp;
            if (typeof cloudProf.level === 'number') state.level = cloudProf.level;
            if (typeof cloudProf.streak === 'number') state.streak = cloudProf.streak;
          }

          const initialLevel = session.user.user_metadata?.initial_level;
          if (initialLevel && ['beginner', 'intermediate', 'advanced'].includes(initialLevel.toLowerCase())) {
            state.selectedDifficulty = initialLevel.toLowerCase();
            if (state.personalizedLearning) {
              state.personalizedLearning.level = initialLevel.toLowerCase();
            }
            if (state.profiles && state.profiles[state.activeProfile]) {
              state.profiles[state.activeProfile].level = initialLevel.toLowerCase();
            }
          }

          saveState();
          if (typeof window.syncLevelUI === 'function') window.syncLevelUI();
          if (typeof window.syncProfileHubUI === 'function') window.syncProfileHubUI();
        }
      } catch (e) {
        console.warn('Session check fallback:', e);
      }
    }

    // Preserve logged-in state if user was already active
    if (!state.isLoggedIn) {
      setView('landing');
    } else {
      setView(state.currentView || 'dashboard');
    }

    // Attach primary landing CTAs
    const buttons = [
      { id: 'getStartedBtn', mode: 'sign-up' },
      { id: 'getStartedBtn2', mode: 'sign-up' },
      { id: 'landingSignUpBtn', mode: 'sign-up' },
      { id: 'landingLoginBtn', mode: 'login' },
      { id: 'landingHeroLoginBtn', mode: 'login' },
      { id: 'landingBottomLoginBtn', mode: 'login' }
    ];

    buttons.forEach(({ id, mode }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => openAuthModal(mode));
      }
    });

    console.log('EngSphere Global Navigation & Supabase Cloud Activated! ✅');
  } catch (error) {
    console.error('Failed to activate EngSphere navigation:', error);
  }
});
