// Supabase Client & Cloud Data Synchronization
// Connected to project: ENGSPHERE (Singapore)
export const SUPABASE_URL = 'https://nrofcdnxsxssdgecfduj.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_1QdLz7VRMPCKz1Tio-0NaQ_dHkEU5Vr';

let supabaseClient = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return supabaseClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

export function isSupabaseReady() {
  return !!getSupabase();
}

/**
 * Sign Up a new user with Supabase Auth & create initial profile row
 */
export async function signUpWithSupabase(name, email, password, level = 'intermediate', goal = 'conversation') {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase client is not loaded' };

  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          initial_level: level,
          learning_goal: goal
        }
      }
    });

    if (error) return { error: error.message };

    const user = data?.user;
    if (user) {
      // Create initial profile record in 'profiles' table
      const { error: profileError } = await sb.from('profiles').upsert({
        user_id: user.id,
        name: name,
        email: email,
        level: level === 'beginner' ? 1 : (level === 'advanced' ? 6 : 3),
        xp: 0,
        streak: 0,
        last_active_day: new Date().toISOString().split('T')[0]
      }, { onConflict: 'user_id' });

      if (profileError) {
        console.warn('Could not insert profile to cloud table:', profileError);
      }
    }

    return { data, user };
  } catch (err) {
    console.error('Sign up error:', err);
    return { error: err.message || 'Failed to connect to cloud backend' };
  }
}

/**
 * Sign In with email & password via Supabase Auth
 */
export async function signInWithSupabase(email, password) {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase client is not loaded' };

  try {
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { error: error.message };
    return { data, user: data?.user, session: data?.session };
  } catch (err) {
    console.error('Sign in error:', err);
    return { error: err.message || 'Failed to connect to cloud backend' };
  }
}

/**
 * Sign Out from Supabase Auth
 */
export async function signOutFromSupabase() {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.auth.signOut();
  } catch (e) {
    console.warn('Sign out warning:', e);
  }
}

/**
 * Fetch profile data (XP, level, streak) for the active user
 */
export async function fetchCloudProfile(userId) {
  const sb = getSupabase();
  if (!sb || !userId) return null;

  try {
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Fetch profile error:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Fetch cloud profile exception:', e);
    return null;
  }
}

/**
 * Sync active user's XP, level, and streak to Supabase 'profiles' table
 */
export async function syncCloudProfile(userId, profileData) {
  const sb = getSupabase();
  if (!sb || !userId) return false;

  try {
    const { error } = await sb.from('profiles').upsert({
      user_id: userId,
      name: profileData.name || 'Learner',
      email: profileData.email,
      level: profileData.level || 1,
      xp: profileData.xp || 0,
      streak: profileData.streak || 0,
      last_active_day: new Date().toISOString().split('T')[0]
    }, { onConflict: 'user_id' });

    if (error) {
      console.warn('Sync profile error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Sync profile exception:', e);
    return false;
  }
}

/**
 * Record a completed quiz result to Supabase 'quiz_history'
 */
export async function recordCloudQuizHistory(userId, quizData) {
  const sb = getSupabase();
  if (!sb || !userId) return false;

  try {
    const { error } = await sb.from('quiz_history').insert({
      user_id: userId,
      topic: quizData.topic || 'general',
      level: quizData.level || 'intermediate',
      score: quizData.score || 0,
      total: quizData.total || 0
    });

    if (error) {
      console.warn('Record quiz history error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Record quiz history exception:', e);
    return false;
  }
}

/**
 * Load quiz history rows for the active user from Supabase
 */
export async function fetchCloudQuizHistory(userId) {
  const sb = getSupabase();
  if (!sb || !userId) return [];

  try {
    const { data, error } = await sb
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Fetch quiz history error:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('Fetch quiz history exception:', e);
    return [];
  }
}
