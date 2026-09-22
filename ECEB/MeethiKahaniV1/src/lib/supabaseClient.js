import { createClient } from '@supabase/supabase-js';

const LOCAL_CRED_KEY = 'mk_supabase_credentials';

export const getSupabaseCredentials = () => {
  let url = import.meta.env.VITE_SUPABASE_URL || '';
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  try {
    const saved = localStorage.getItem(LOCAL_CRED_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        url = parsed.url;
        key = parsed.key;
      }
    }
  } catch (e) {
    console.warn('Unable to access localStorage for Supabase credentials');
  }

  const isConfigured = Boolean(
    url &&
    key &&
    !url.includes('your-supabase-project') &&
    !key.includes('your-supabase-anon-key')
  );

  return { url, key, isConfigured };
};

export const saveSupabaseCredentials = (url, key) => {
  try {
    localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
    window.location.reload();
  } catch (e) {
    console.error('Failed to save Supabase credentials:', e);
  }
};

export const clearSupabaseCredentials = () => {
  try {
    localStorage.removeItem(LOCAL_CRED_KEY);
    window.location.reload();
  } catch (e) {
    console.error('Failed to clear Supabase credentials:', e);
  }
};

const creds = getSupabaseCredentials();

export const supabase = creds.isConfigured
  ? createClient(creds.url, creds.key)
  : null;

export const isSupabaseConfigured = () => {
  return getSupabaseCredentials().isConfigured && supabase !== null;
};

/* ====================================================================
   AUTH HELPERS — Email & Password + OTP
   ==================================================================== */

/**
 * Sign in with email & password
 */
export const signInWithPassword = async (email, password) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password
  });
  if (error) throw error;
  return data;
};

/**
 * Sign up with email & password
 */
export const signUpWithPassword = async (email, password, metadata = {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
};

/**
 * Step 1: Send OTP to user's email via Supabase Auth
 * Supabase sends a 6-digit OTP code to the provided email automatically.
 */
export const sendEmailOtp = async (email) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set up your database connection first.');
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true // creates new user if not exists (handles both signup & login)
    }
  });
  if (error) throw error;
  return data;
};

/**
 * Step 2: Verify the 6-digit OTP code entered by the user
 * Returns the Supabase session and user on success.
 */
export const verifyEmailOtp = async (email, token) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set up your database connection first.');
  }
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email'
  });
  if (error) throw error;
  return data; // { session, user }
};

/**
 * Sign out current user from Supabase Auth session
 */
export const signOutUser = async () => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Sign out error:', error);
};

/**
 * Get current authenticated session
 */
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Listen to auth state changes (login, logout, token refresh)
 * @param {Function} callback - receives (event, session)
 * @returns unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured()) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
};
