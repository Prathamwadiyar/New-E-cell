import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getProfileByUserId } from '../services/directoryStorage';

const DirectoryAuthContext = createContext(null);

// Map a Supabase auth user to the app's user shape. Handles nullable email.
const mapUser = (user) => {
  if (!user) return null;
  const email = user.email || null;
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    (email ? email.split('@')[0] : 'Student');
  return { uid: user.id, email, displayName, role: 'student' };
};

export const DirectoryAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Admin authorization is derived from the protected user_roles table (RLS
  // returns the caller's own role row), never from a localStorage flag or a
  // frontend passcode. Profile is fetched via RLS-scoped queries.
  const loadRoleAndProfile = useCallback(async (user) => {
    if (!user) {
      setStudentProfile(null);
      setIsAdmin(false);
      return;
    }
    try {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      setIsAdmin(roleRow?.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
    const prof = await getProfileByUserId(user.id);
    setStudentProfile(prof);
  }, []);

  // Restore session on mount and subscribe to auth-state changes.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const s = data.session;
      setSession(s);
      setCurrentUser(mapUser(s?.user));
      loadRoleAndProfile(s?.user).finally(() => {
        if (active) setIsLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCurrentUser(mapUser(nextSession?.user));
      loadRoleAndProfile(nextSession?.user);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, [loadRoleAndProfile]);

  const refreshProfile = useCallback(async () => {
    if (currentUser?.uid) {
      const p = await getProfileByUserId(currentUser.uid);
      setStudentProfile(p);
      return p;
    }
    return null;
  }, [currentUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true, user: mapUser(data.user) };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName || formData.name || '' } },
      });
      if (error) return { success: false, error: error.message };
      // With email confirmation enabled a session may not exist yet; the
      // signup trigger has already created a draft profile row.
      return { success: true, user: mapUser(data.user) };
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth. Requires the Google provider to be enabled in Supabase.
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(null);
    setStudentProfile(null);
    setIsAdmin(false);
  };

  return (
    <DirectoryAuthContext.Provider
      value={{
        currentUser,
        session,
        studentProfile,
        isAdmin,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshProfile,
        setStudentProfile,
      }}
    >
      {children}
    </DirectoryAuthContext.Provider>
  );
};

export const useDirectoryAuth = () => {
  const context = useContext(DirectoryAuthContext);
  if (!context) {
    throw new Error('useDirectoryAuth must be used within a DirectoryAuthProvider');
  }
  return context;
};
