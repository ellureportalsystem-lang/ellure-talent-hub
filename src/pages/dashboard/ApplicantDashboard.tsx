import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, FileText, Award, Clock, Download, LogOut, Edit, CheckCircle2, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { openResumePreview } from "@/lib/resumePreview";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CandidateFAQs } from "@/components/CandidateFAQs";

const ApplicantDashboard = ({ embedded = false }: { embedded?: boolean }) => {
  const { profile, user, signOut } = useAuth();
  const [applicantData, setApplicantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicantData = async () => {
      // Don't wait for profile - if user is logged in, proceed
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Set a timeout to stop loading even if fetch fails
      const loadingTimeout = setTimeout(() => {
        console.warn('⏱️ Loading timeout - proceeding without applicant data');
        setLoading(false);
      }, 5000); // 5 second max loading time

      const fetchWithRetry = async (retries = 2) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            // Try to fetch applicant data by applicant_id first, then by user_id
            let query = supabase.from('applicants').select('*');
            
            if (profile?.applicant_id) {
              query = query.eq('id', profile.applicant_id);
            } else if (user?.id) {
              query = query.eq('user_id', user.id);
            }

            const { data, error } = await query.single();

            if (error) {
              // If not found, that's okay
              if (error.code === 'PGRST116') {
                console.log('Applicant data not found - this is okay');
                setLoading(false);
                return;
              }
              
              // Network errors - retry
              const isNetworkError = error.message?.includes('Failed to fetch') || 
                                     error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                                     error.message?.includes('TypeError');
              
              if (isNetworkError && attempt < retries) {
                console.warn(`Network error fetching applicant data (attempt ${attempt + 1}/${retries + 1}), retrying...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                continue;
              }
              
              console.error('Error fetching applicant data:', error);
              setLoading(false);
              return;
            }

            if (data) {
              setApplicantData(data);
            }
            clearTimeout(loadingTimeout);
            setLoading(false);
            return;
          } catch (error: any) {
            const isNetworkError = error.message?.includes('Failed to fetch') || 
                                   error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                                   error.name === 'TypeError';
            
            if (isNetworkError && attempt < retries) {
              console.warn(`Network error (attempt ${attempt + 1}/${retries + 1}), retrying...`);
              await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
              continue;
            }
            
            console.error('Error fetching applicant data:', error);
            if (attempt === retries) {
              clearTimeout(loadingTimeout);
              setLoading(false);
            }
          }
        }
        clearTimeout(loadingTimeout);
        setLoading(false);
      };

      fetchWithRetry();
      
      return () => {
        clearTimeout(loadingTimeout);
      };
    };

    fetchApplicantData();
  }, [profile, user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/applicant");
  };

  // Helper functions to get data
  const getFullName = () => {
    return profile?.full_name || applicantData?.full_name || applicantData?.name || "Not provided";
  };

  const getInitials = () => {
    const name = getFullName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "U";
  };

  const getEmail = () => {
    return profile?.email || applicantData?.email_address || applicantData?.email || "Not provided";
  };

  const getPhone = () => {
    return profile?.phone || applicantData?.mobile_number || applicantData?.phone || "Not provided";
  };

  const getLocation = () => {
    return profile?.location || applicantData?.city_current_location || applicantData?.city || "Not specified";
  };

  const getExperience = () => {
    const exp = applicantData?.total_experience || applicantData?.total_experience_numbers;
    if (exp) {
      return `${exp} ${exp.includes('year') ? '' : 'years'}`;
    }
    return "Not specified";
  };

  const getCurrentDesignation = () => {
    return applicantData?.current_designation || applicantData?.job_role || "Not specified";
  };

  const getSkills = () => {
    const skills = profile?.key_skills || applicantData?.key_skill || applicantData?.key_skills;
    if (skills) {
      // Split by comma, semicolon, or newline
      return skills.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 5);
    }
    return [];
  };

  const getCurrentCTC = () => {
    return applicantData?.current_ctc || "Not specified";
  };

  const getExpectedCTC = () => {
    return applicantData?.exp_ctc || applicantData?.expected_ctc || "Not specified";
  };

  const getEducation = () => {
    const degree = applicantData?.course_degree_name || applicantData?.course_degree || "Not specified";
    const university = applicantData?.university_institute_name || applicantData?.university || "";
    const year = applicantData?.year_of_passing || applicantData?.passing_year || "";
    const percentage = applicantData?.percentage || "";
    
    return { degree, university, year, percentage };
  };

  const getResumeFile = () => {
    return profile?.resume_file || applicantData?.upload_cv_any_format || applicantData?.resume_file;
  };

  const profileCompletion = profile?.profile_complete_percent || applicantData?.profile_complete_percent || 0;
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviews: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const applicantId = profile?.applicant_id ?? applicantData?.id;
      if (!applicantId) return;
      const { data } = await supabase
        .from("job_applications")
        .select("current_stage")
        .eq("applicant_id", applicantId);
      if (!data) return;
      setApplicationStats({
        total: data.length,
        pending: data.filter((a) => a.current_stage === "applied" || a.current_stage === "screening").length,
        shortlisted: data.filter((a) => a.current_stage === "shortlisted").length,
        interviews: data.filter((a) =>
          ["interview_scheduled", "interviewed", "offer"].includes(a.current_stage ?? "")
        ).length,
      });
    };
    void loadStats();
  }, [profile?.applicant_id, applicantData?.id]);

  // Show loading only if we have a user but no profile/applicant data yet
  // Don't block if user is logged in - show dashboard with available data
  if (loading && user && !profile && !applicantData) {
    return (
      <div
        className={
          embedded
            ? "flex min-h-[40vh] items-center justify-center py-12"
            : "min-h-screen bg-gradient-subtle flex items-center justify-center"
        }
      >
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
          {!embedded && (
            <p className="text-xs text-muted-foreground">This may take a few seconds</p>
          )}
        </div>
      </div>
    );
  }
  
  // If no user, redirect to login
  if (!user) {
    navigate("/auth/applicant");
    return null;
  }

  const cardClass = embedded
    ? "rounded-xl border border-border bg-card shadow-sm"
    : "shadow-lg";

  return (
    <div
      className={
        embedded
          ? "w-full min-w-0 max-w-6xl mx-auto p-4 lg:p-6 text-foreground"
          : "min-h-screen bg-gradient-subtle"
      }
    >
      {!embedded && (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-1">
            <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-12 w-auto object-contain" />
            <div className="flex flex-col leading-none items-start">
              <span className="text-xl font-bold" style={{ color: '#3d4853' }}>Ellure</span>
              <span className="text-xl font-bold -mt-2" style={{ color: '#0566cd' }}>NexHire</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      )}

      <div className={embedded ? "space-y-6" : "container py-8"}>
        {/* Profile Header Card */}
        <Card className={embedded ? `mb-6 ${cardClass}` : "mb-8 shadow-lg"}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {profile?.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt={getFullName()}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className={
                    embedded
                      ? "h-24 w-24 rounded-full bg-primary/15 text-primary flex items-center justify-center text-3xl font-bold border border-primary/20"
                      : "h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold"
                  }
                >
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{getFullName()}</h2>
                  <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Active</span>
                </div>
                <p className="text-muted-foreground">
                  {getCurrentDesignation()} | {getLocation()} | {getExperience()} experience
                </p>
                {getSkills().length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getSkills().map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="default" onClick={() => navigate("/dashboard/applicant/settings")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit settings
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const u = getResumeFile();
                    if (!u) return;
                    try {
                      await openResumePreview(u);
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Could not open resume");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className={embedded ? `mb-6 ${cardClass}` : "mb-8"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Profile Completion
            </CardTitle>
            <CardDescription>
              Complete your profile to increase visibility to recruiters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Basic information added</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Education details added</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Resume uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Add certifications (optional)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className={embedded ? "grid md:grid-cols-4 gap-4 mb-6" : "grid md:grid-cols-4 gap-4 mb-8"}>
          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.total}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.shortlisted}</p>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={embedded ? cardClass : undefined}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.interviews}</p>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Sections */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{getFullName()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{getEmail()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{getPhone()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{getLocation()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{getExperience()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current CTC</p>
                    <p className="font-medium">{getCurrentCTC()}</p>
                  </div>
                  {getExpectedCTC() !== "Not specified" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Expected CTC</p>
                      <p className="font-medium">{getExpectedCTC()}</p>
                    </div>
                  )}
                  {applicantData?.current_company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Current Company</p>
                      <p className="font-medium">{applicantData.current_company}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const education = getEducation();
                    if (education.degree !== "Not specified" || education.university || education.year) {
                      return (
                        <div className="border-l-2 border-primary pl-4">
                          <p className="font-medium">{education.degree}</p>
                          {applicantData?.highest_qualification && (
                            <p className="text-sm text-muted-foreground">{applicantData.highest_qualification}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {education.university && `${education.university} • `}
                            {education.year && `${education.year}${education.percentage ? ` • ${education.percentage}` : ''}`}
                            {!education.university && !education.year && "Education details not provided"}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p className="text-sm text-muted-foreground">Education details not provided</p>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getResumeFile() ? (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{getResumeFile().split('/').pop() || 'Resume'}</p>
                        <p className="text-sm text-muted-foreground">
                          {applicantData?.created_at 
                            ? `Uploaded ${new Date(applicantData.created_at).toLocaleDateString()}`
                            : 'Resume available'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        const u = getResumeFile();
                        if (!u) return;
                        try {
                          await openResumePreview(u);
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Could not open resume");
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">No resume uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Profile viewed by TCS", time: "2 hours ago", type: "info" },
                    { action: "Shortlisted by Infosys", time: "1 day ago", type: "success" },
                    { action: "Application submitted", time: "2 days ago", type: "default" },
                    { action: "Resume updated", time: "3 days ago", type: "default" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.type === "success" ? "bg-success" :
                        activity.type === "info" ? "bg-info" :
                        "bg-muted-foreground"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Update your skills
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    Add certifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => navigate("/dashboard/applicant/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    Complete profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={embedded ? cardClass : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CandidateFAQs />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;