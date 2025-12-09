import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Chrome, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AccountCreationMethod = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to sign up with Google",
          variant: "destructive",
        });
      } else {
        // Google OAuth will redirect, so we don't need to navigate here
        toast({
          title: "Redirecting to Google...",
          description: "Please complete authentication with Google",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Choose how you'd like to create your applicant account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Option */}
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/auth/register/email")}
            disabled={isLoading}
          >
            <Mail className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Sign up with Email</div>
              <div className="text-xs text-muted-foreground">We'll send you an OTP to verify</div>
            </div>
          </Button>

          {/* Phone Option */}
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate("/auth/register/phone")}
            disabled={isLoading}
          >
            <Phone className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Sign up with Phone</div>
              <div className="text-xs text-muted-foreground">We'll send you an OTP via SMS</div>
            </div>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Option */}
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 transition-colors"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <div className="text-center">
              <div className="font-semibold">Continue with Google</div>
              <div className="text-xs text-muted-foreground">Quick and secure sign up</div>
            </div>
          </Button>

          {/* Back to Login */}
          <div className="pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountCreationMethod;

