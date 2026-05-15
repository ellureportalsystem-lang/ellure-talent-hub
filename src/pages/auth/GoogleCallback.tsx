import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          navigate("/auth/login");
          return;
        }

        if (!session?.user) {
          console.error("❌ No session found");
          navigate("/auth/login");
          return;
        }

        console.log("✅ Google OAuth callback successful for user:", session.user.id);

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("❌ Error checking profile:", profileError);
          navigate("/auth/login");
          return;
        }

        // If profile doesn't exist, create one
        if (!existingProfile) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: session.user.id,
            email: session.user.email || `user-${session.user.id}@generated.local`,
            email_address: session.user.email || `user-${session.user.id}@generated.local`,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            role: session.user.user_metadata?.role || "applicant",
          });

          if (insertError) {
            console.error("❌ Error creating profile:", insertError);
            navigate("/auth/login");
            return;
          }

          console.log("✅ Profile created for Google OAuth user");
        }

        // Refresh profile to get the latest data
        const profile = await refreshProfile();

        // Navigate based on role
        if (profile?.role === "admin") {
          navigate("/dashboard/admin");
        } else if (profile?.role === "client") {
          navigate("/dashboard/client");
        } else {
          // Default to applicant flow - redirect to profile page
          navigate("/dashboard/applicant/profile");
        }
      } catch (error: any) {
        console.error("❌ Unexpected error in Google callback:", error);
        navigate("/auth/login");
      }
    };

    handleCallback();
  }, [navigate, refreshProfile]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
