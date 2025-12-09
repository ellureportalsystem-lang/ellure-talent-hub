import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Download, Star, Edit, Trash2, FileText, ArrowLeft, Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ApplicantProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Applicant ID is missing",
          variant: "destructive",
        });
        navigate("/dashboard/admin/applicants");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch applicant data
        const { data: applicantData, error: applicantError } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', id)
          .single();

        if (applicantError) {
          console.error('Error fetching applicant:', applicantError);
          toast({
            title: "Error",
            description: "Failed to load applicant data",
            variant: "destructive",
          });
          return;
        }

        setApplicant(applicantData);

        // Fetch profile data if user_id exists
        if (applicantData?.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', applicantData.user_id)
            .single();

          if (!profileError && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantData();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard/admin/applicants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applicants
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Applicant not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use real data from database, fallback to defaults for missing fields
  const applicantData = {
    name: applicant.name || applicant.full_name || "N/A",
    email: applicant.email || applicant.email_address || profile?.email || "N/A",
    phone: applicant.phone || applicant.mobile_number || profile?.phone || "N/A",
    city: applicant.city || applicant.city_current_location || profile?.location || "N/A",
    skill: applicant.skill || applicant.skill_job_role_applying_for || profile?.key_skills || "N/A",
    status: applicant.status || "Active",
    experience: applicant.total_experience ? `${applicant.total_experience} years` : applicant.experience || "N/A",
    currentCompany: applicant.current_company || applicant.company_name || "N/A",
    designation: applicant.current_designation || applicant.designation || "N/A",
    currentCTC: applicant.current_ctc || "N/A",
    expectedCTC: applicant.expected_ctc || "N/A",
    education: applicant.highest_qualification || applicant.education_level || profile?.education || "N/A",
    university: applicant.university_institute_name || applicant.university || "N/A",
    passingYear: applicant.year_of_passing || applicant.passing_year || "N/A",
    percentage: applicant.percentage || applicant.cgpa || "N/A",
    skills: applicant.key_skills ? (typeof applicant.key_skills === 'string' ? applicant.key_skills.split(',').map(s => s.trim()) : applicant.key_skills) : (profile?.key_skills ? (typeof profile.key_skills === 'string' ? profile.key_skills.split(',').map(s => s.trim()) : profile.key_skills) : []),
    profileImage: applicant.profile_image || profile?.profile_image || null,
    resumeFile: applicant.resume_file || profile?.resume_file || null,
  };

  const activityLog = [
    { id: 1, action: "Profile viewed by Admin", time: "Just now" },
    // Add more activity logs from database if available
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/dashboard/admin/applicants")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applicants
        </Button>

        {/* Profile Header */}
        <Card className="shadow-elegant mb-6">
          <CardContent className="p-8">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  {applicantData.profileImage ? (
                    <img src={applicantData.profileImage} alt={applicantData.name} />
                  ) : (
                    <div className="bg-gradient-primary flex items-center justify-center h-full w-full">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{applicantData.name}</h1>
                  <p className="text-xl text-muted-foreground mb-3">{applicantData.skill}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {applicantData.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-primary" />
                      {applicantData.experience}
                    </span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Status: {applicantData.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="default">
                  <Star className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {applicantData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {applicantData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {applicantData.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {applicantData.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Experience */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Company</p>
                  <p className="font-medium">{applicantData.currentCompany}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">{applicantData.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current CTC</p>
                  <p className="font-medium">{applicantData.currentCTC}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected CTC</p>
                  <p className="font-medium">{applicantData.expectedCTC}</p>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Education Details */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Details
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="font-medium">{applicantData.education}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-medium">{applicantData.university}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year of Passing</p>
                  <p className="font-medium">{applicantData.passingYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentage/CGPA</p>
                  <p className="font-medium">{applicantData.percentage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Key Skills */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Key Skills</CardTitle>
              </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {applicantData.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Documents */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="h-96 border border-dashed rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{applicantData.resumeFile || "No resume uploaded"}</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Actions */}
            <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                <Select defaultValue={applicantData.status.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Remarks</label>
                <Textarea 
                  placeholder="Add internal notes about this applicant..."
                  rows={4}
                />
              </div>

              <Button className="w-full">
                Save Changes
              </Button>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-muted pl-4 pb-4 last:pb-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileView;
