import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: ('applicant' | 'admin' | 'client')[];
}

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { profile, loading, user, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);

  // TEMPORARY TESTING MODE - REMOVE BEFORE PRODUCTION
  const isTestingMode = sessionStorage.getItem('testing_mode') === 'true';
  const testingRole = sessionStorage.getItem('testing_role') as 'applicant' | 'admin' | 'client' | null;

  // Wait for profile to load
  useEffect(() => {
    if (!loading && user) {
      if (profile) {
        setProfileLoading(false);
        return;
      }

      // Try to fetch profile directly
      const fetchProfile = async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) {
        setProfileLoading(false);
            return;
          }

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileData) {
            setProfileLoading(false);
          } else {
            // Profile doesn't exist - wait a bit for trigger, then give up
            setTimeout(() => {
              setProfileLoading(false);
            }, 2000);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfileLoading(false);
        }
      };

      fetchProfile();
    } else if (!loading && !user) {
      setProfileLoading(false);
    }
  }, [loading, user, profile]);

  // TEMPORARY TESTING MODE BYPASS - REMOVE BEFORE PRODUCTION
  if (isTestingMode && testingRole && allowedRoles.includes(testingRole)) {
    return <>{children}</>;
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user && !isTestingMode) {
    return <Navigate to="/auth/login" replace />;
  }

  // Profile doesn't exist (skip in testing mode)
  if (!profile && !isTestingMode) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Profile Not Found</CardTitle>
            <CardDescription>
              Your profile could not be loaded from the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Possible reasons:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Profile was not created during account setup</li>
                <li>Database connection issue</li>
                <li>Account setup incomplete</li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                navigate("/auth/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Role doesn't match (skip in testing mode)
  if (profile && !allowedRoles.includes(profile.role) && !isTestingMode) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong>Required role:</strong> {allowedRoles.join(' or ')}
              </p>
              <p className="text-muted-foreground">
                <strong>Your current role:</strong> <span className="font-semibold text-foreground">{profile.role}</span>
            </p>
              <p className="text-xs text-muted-foreground mt-4">
                If you believe this is an error, please contact support or use the correct login page for your role.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                navigate("/auth/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

