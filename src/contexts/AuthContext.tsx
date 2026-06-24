import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getSignInErrorMessage } from '@/lib/authErrorMessages';
import { resolveEmailFromPhone, resolveSignInEmail } from '@/lib/resolveSignInEmail';
import { Profile, UserRole } from '@/types/database.types';
import { clearSupabaseAuthStorage, isInvalidSessionError } from '@/lib/authSessionUtils';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, portal?: 'applicant' | 'admin' | 'client') => Promise<{ error: any }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const resetAuthState = useCallback(() => {
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const clearStaleSession = useCallback(async () => {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // Server may reject invalid refresh tokens — still clear local storage.
    }
    clearSupabaseAuthStorage();
    resetAuthState();
  }, [resetAuthState]);

  // Fetch profile from database with proper timeout and error handling
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data: { user: authUser }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError) {
        if (isInvalidSessionError(getUserError)) {
          await clearStaleSession();
        }
        return null;
      }
      
      if (!authUser || authUser.id !== userId) {
        console.warn('⚠️ Auth user mismatch:', { 
          requestedId: userId, 
          authUserId: authUser?.id 
        });
        return null;
      }

      // Fetch profile with explicit timeout and error handling
      console.log('📡 Querying profiles table...');
      
      // Use Promise.race with a timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout after 3 seconds')), 3000)
      );
      
      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;
      if (error) {
        // Handle timeout
        if (error.message?.includes('timeout')) {
          console.error('⏱️ Profile fetch timeout for user:', userId);
          // Try one more quick retry without timeout
          try {
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
            
            if (retryError) {
              console.error('❌ Retry also failed:', retryError);
              return null;
            }
            
            if (retryData) {
              console.log('✅ Profile fetched on retry:', retryData);
              return retryData as Profile;
            }
          } catch (retryErr) {
            console.error('❌ Retry exception:', retryErr);
          }
          return null;
        }
        
        // If profile not found, return null (not an error)
        if (error.code === 'PGRST116' || error.message?.includes('No rows') || error.message?.includes('not found')) {
          console.warn('⚠️ Profile not found for user:', userId);
          console.warn('This might mean the profile was not created by the trigger');
          return null;
        }
        
        // For RLS/permission errors
        if (error.code === '42501' || error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
          console.error('🔒 RLS Policy Error - Cannot access profile:', error);
          console.error('User ID:', userId);
          console.error('This might be an RLS policy issue');
          return null;
        }
        
        // For other errors, log and return null
        console.error('❌ Error fetching profile:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return null;
      }

      if (!data) {
        console.warn('⚠️ Profile query returned null for user:', userId);
        return null;
      }

      console.log('✅ Profile fetched successfully:', { 
        id: data.id, 
        email: data.email, 
        role: data.role 
      });
      return data as Profile;
    } catch (error: any) {
      if (error.message?.includes('timeout')) {
        return null;
      }
      if (error.code === 'PGRST116' || error.message?.includes('No rows') || error.message?.includes('not found')) {
        return null;
      }
      return null;
    }
  }, [clearStaleSession]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error && isInvalidSessionError(error)) {
          await clearStaleSession();
          if (mounted) setLoading(false);
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id).then((profileData) => {
            if (mounted && profileData) setProfile(profileData);
          });
        }
      } catch (error) {
        console.warn("Auth session init failed, clearing stale session:", error);
        await clearStaleSession();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED" && !session) {
        await clearStaleSession();
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id)
          .then((profileData) => {
            if (profileData) setProfile(profileData);
          })
          .catch((err) => {
            console.error("Profile fetch error in auth state change:", err);
          });
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [clearStaleSession, fetchProfile]);

  const signIn = async (
    email: string,
    password: string,
    portal?: 'applicant' | 'admin' | 'client'
  ) => {
    try {
      const resolvedEmail = await resolveSignInEmail(email);
      console.log('🔐 Attempting login for:', resolvedEmail);

      const passwordsToTry = password === password.trim()
        ? [password]
        : [password, password.trim()];

      let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['data'] | null = null;
      let error: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['error'] | null = null;

      for (const pwd of passwordsToTry) {
        const result = await supabase.auth.signInWithPassword({
          email: resolvedEmail,
          password: pwd,
        });
        data = result.data;
        error = result.error;
        if (!error) break;
        if (!/invalid login credentials/i.test(error.message || '')) break;
      }

      if (error) {
        console.error('❌ Login error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        const isNetworkError = error.status === 0 || 
          /failed to fetch|network error|load failed|err_name_not_resolved/i.test(error.message || '');
        const normalizedError = isNetworkError
          ? { ...error, message: 'Cannot reach the server. Check your internet connection and that your Supabase project URL in .env is correct and the project is not paused.' }
          : { ...error, message: getSignInErrorMessage(error.message || 'Invalid credentials', portal ?? 'default') };
        return { error: normalizedError };
      }

      if (data?.user) {
        console.log('✅ Login successful for user:', data.user.id);
        void (async () => {
          const { data: current } = await supabase
            .from('profiles')
            .select('login_count')
            .eq('id', data.user!.id)
            .maybeSingle();
          await supabase
            .from('profiles')
            .update({
              last_login_at: new Date().toISOString(),
              login_count: (current?.login_count ?? 0) + 1,
            })
            .eq('id', data.user!.id);
        })();
        fetchProfile(data.user.id).then((profileData) => {
          if (profileData) setProfile(profileData);
        }).catch((err) => {
          console.error('Profile fetch error (non-blocking):', err);
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('❌ Unexpected login error:', error);
      // Normalize "Failed to fetch" and similar network errors
      const msg = error?.message || '';
      const isNetworkError = /failed to fetch|network error|load failed|err_name_not_resolved/i.test(msg);
      const normalizedError = isNetworkError
        ? { message: 'Cannot reach the server. Check your internet connection and that your Supabase project URL in .env is correct and the project is not paused.', status: 0 }
        : error;
      return { error: normalizedError };
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const resolved = await resolveEmailFromPhone(phone);
      if ('error' in resolved) {
        return { error: { message: resolved.error } };
      }
      return await signIn(resolved.email, password, 'applicant');
    } catch (error: any) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/google/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        return { error };
      }

      // OAuth will redirect, so we don't need to handle success here
      return { error: null };
    } catch (error: any) {
      console.error('❌ Unexpected Google OAuth error:', error);
      return { error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      await supabase.auth.signOut({ scope: "local" });
    }
    clearSupabaseAuthStorage();
    resetAuthState();
  }, [resetAuthState]);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    const profileData = await fetchProfile(user.id);
    if (profileData) setProfile(profileData);
    return profileData;
  }, [user, fetchProfile]);

  const value = {
    user,
    profile,
    role: (profile?.role as UserRole) ?? null,
    session,
    loading,
    signIn,
    signInWithPhone,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

