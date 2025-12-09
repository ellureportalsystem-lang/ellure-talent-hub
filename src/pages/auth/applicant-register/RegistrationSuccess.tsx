import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, User, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, refreshProfile } = useAuth();
  const applicantId = searchParams.get("applicantId");
  const isDemo = searchParams.get("demo") === "true";
  const [isLoading, setIsLoading] = useState(!isDemo); // Skip loading in demo mode

  useEffect(() => {
    // TEMPORARY: Skip profile check in demo mode
    if (isDemo) {
      setIsLoading(false);
      return;
    }

    // Wait for profile to be created (trigger creates it automatically)
    const checkProfile = async () => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await refreshProfile();
        if (profile) {
          setIsLoading(false);
          // Redirect to profile after 2 seconds
          setTimeout(() => {
            navigate("/dashboard/profile");
          }, 2000);
          return;
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsLoading(false);
    };

    checkProfile();
  }, [profile, refreshProfile, navigate, isDemo]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-elegant">
        <CardContent className="p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto h-24 w-24 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>

          {/* Success Message */}
          {isLoading ? (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-3">
                Building Your Profile...
              </h1>
              <p className="text-muted-foreground mb-8">
                Please wait while we create your profile. You'll be redirected shortly.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-3">
                {isDemo ? "Form Submitted Successfully!" : "Registration Completed Successfully!"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {isDemo ? (
                  <>
                    <span className="block mb-2 font-semibold text-warning">⚠️ Demo Mode</span>
                    Your form has been submitted successfully! This is a demo submission - no data was saved to the database. You can fill the form again to test different scenarios.
                  </>
                ) : (
                  <>
                    Thank you for registering with Ellure Consulting Services. Your application
                    has been submitted successfully and your profile has been created.
                  </>
                )}
              </p>
            </>
          )}

          {/* What's Next */}
          {!isDemo && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Our recruitment team will review your application</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You'll receive an email confirmation within 24 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>If shortlisted, you'll be contacted for the next steps</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can track your application status in your dashboard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
          
          {isDemo && (
            <Card className="mb-8 border-warning/20 bg-warning/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Demo Mode Active</h3>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>No data was saved to the database</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>You can fill the form again to test different scenarios</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>All form validations and UI interactions work normally</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Application Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
            <Card className="border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Application ID</p>
                <p className="font-mono font-semibold">
                  APP-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard/profile">
                <Button size="lg" className="w-full sm:w-auto">
                  <User className="mr-2 h-4 w-4" />
                  View My Profile
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Application Receipt
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationSuccess;
