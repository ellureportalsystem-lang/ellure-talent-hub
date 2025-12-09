import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth callback error:', error);
          navigate('/auth/login?error=oauth_failed');
          return;
        }

        if (!session || !session.user) {
          console.error('No session found after OAuth');
          navigate('/auth/login?error=no_session');
          return;
        }

        // Wait a moment for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Profile doesn't exist, create it manually (fallback if trigger failed)
          // Use role from metadata or default to applicant
          const userRole = session.user.user_metadata?.role || 'applicant';
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email || `user-${session.user.id}@generated.local`,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              role: userRole, // Use role from metadata, not hardcoded 'applicant'
            });

          if (createError) {
            console.error('Error creating profile:', createError);
          }
        }
        // DO NOT modify existing profile role - preserve admin/client roles
        
        // Refresh profile to get the latest data
        const updatedProfile = await refreshProfile();

        // Navigate based on role
        if (updatedProfile?.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (updatedProfile?.role === 'client') {
          navigate('/dashboard/client');
        } else {
          // For applicants, check if they have completed registration
          // If no applicant record exists, redirect to registration form
          const { data: applicant } = await supabase
            .from('applicants')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (!applicant) {
            // New user, redirect to registration form
            navigate('/auth/applicant-register/step-1');
          } else {
            // Existing applicant, go to dashboard
            navigate('/dashboard/applicant');
          }
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/auth/login?error=callback_error');
      }
    };

    handleCallback();
  }, [navigate, refreshProfile]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src="/logo1.png" alt="Ellure NexHire" className="h-12 w-12 object-contain animate-pulse" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we redirect you to your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;

