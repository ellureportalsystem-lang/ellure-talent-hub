import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database.types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
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

  // Fetch profile from database with proper timeout and error handling
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      // Use getUser() to ensure we have the latest user data
      const { data: { user: authUser }, error: getUserError } = await supabase.auth.getUser();
      
      if (getUserError) {
        console.error('❌ Error getting auth user:', getUserError);
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
      // Handle timeout
      if (error.message?.includes('timeout')) {
        console.error('⏱️ Profile fetch timeout/aborted for user:', userId);
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
      console.error('❌ Exception fetching profile:', error);
      console.error('Exception details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Don't block on profile fetch - fetch in background
      if (session?.user) {
        // Fetch profile in background, don't await
        fetchProfile(session.user.id)
          .then(profileData => {
            if (profileData) {
              setProfile(profileData);
            }
          })
          .catch(err => {
            console.error('Profile fetch error in auth state change (non-blocking):', err);
          });
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        // Normalize network/DNS errors (ERR_NAME_NOT_RESOLVED, offline, CORS, etc.) for user-friendly message
        const isNetworkError = error.status === 0 || 
          /failed to fetch|network error|load failed|err_name_not_resolved/i.test(error.message || '');
        const normalizedError = isNetworkError
          ? { ...error, message: 'Cannot reach the server. Check your internet connection and that your Supabase project URL in .env is correct and the project is not paused.' }
          : error;
        return { error: normalizedError };
      }

      if (data.user) {
        console.log('✅ Login successful for user:', data.user.id);
        // Don't block on profile fetch - let it happen in background
        // The auth state change listener will fetch it automatically
        fetchProfile(data.user.id).then(profileData => {
          if (profileData) {
            setProfile(profileData);
          }
        }).catch(err => {
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
      // Supabase requires email for password auth, so we need to find user by phone
      // First, try to find profile with this phone number
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email, email_address')
        .or(`phone.eq.${phone},mobile_number.eq.${phone}`)
        .single();

      if (!profileData) {
        return { error: { message: 'No account found with this phone number' } };
      }

      // Use email to sign in
      const email = profileData.email || profileData.email_address;
      if (!email) {
        return { error: { message: 'No email associated with this phone number' } };
      }

      return await signIn(email, password);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
      return profileData;
    }
    return null;
  };

  const value = {
    user,
    profile,
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

