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

  // Fetch profile from database - simplified, no infinite retries
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // Use getUser() to ensure we have the latest user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser || authUser.id !== userId) {
        return null;
      }

      // Fetch profile directly
      const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
        .single();

        if (error) {
        // If profile not found, return null (don't retry)
          if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          return null;
        }
        // For other errors, log and return null
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
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
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
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
        return { error };
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
      return { error };
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

