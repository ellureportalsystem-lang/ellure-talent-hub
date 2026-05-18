import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import EnterpriseApplicantProfile from "@/pages/dashboard/admin/EnterpriseApplicantProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const ApplicantProfile = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noApplicantFound, setNoApplicantFound] = useState(false);

  useEffect(() => {
    const fetchApplicantId = async () => {
      if (authLoading) return;
      if (!user?.id) {
        setLoading(false);
        navigate("/auth/applicant");
        return;
      }

      try {
        setNoApplicantFound(false);
        if (profile?.applicant_id) {
          setApplicantId(profile.applicant_id);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('applicants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching applicant:', error);
        }

        if (data?.id) {
          setApplicantId(data.id);
        } else {
          setNoApplicantFound(true);
        }
      } catch (error) {
        console.error('Error in fetchApplicantId:', error);
        setNoApplicantFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantId();
  }, [user, profile, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/applicant");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (noApplicantFound || !applicantId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 rounded-lg border bg-card p-8 shadow-sm">
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Complete your profile</h2>
            <p className="text-muted-foreground text-sm">
              Your account is set up, but we don&apos;t have an applicant profile yet. Complete the registration steps to build your profile and apply for roles.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/auth/applicant-register/step-1">Complete profile</Link>
            </Button>
            <Button variant="outline" onClick={() => navigate("/auth/applicant")}>
              Back to login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Applicant Dashboard Header */}
      <header className="sticky top-0 z-[60] bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-9 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground">Ellure</span>
              <span className="text-sm font-bold text-primary -mt-0.5">NexHire</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Hi, <span className="font-medium text-foreground">{firstName}</span>
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <EnterpriseApplicantProfile viewMode="applicant" applicantId={applicantId} />
    </div>
  );
};

export default ApplicantProfile;

