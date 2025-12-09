import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const SetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmailOrPhone, setHasEmailOrPhone] = useState(false);

  const email = sessionStorage.getItem("signup_email");
  const phone = sessionStorage.getItem("signup_phone");
  const method = sessionStorage.getItem("signup_method");

  // Check for email/phone in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!email && !phone) {
      navigate("/auth/register");
    } else {
      setHasEmailOrPhone(true);
    }
  }, [email, phone, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Normalize email: lowercase and trim
      const normalizedEmail = method === "email" && email ? email.trim().toLowerCase() : undefined;
      const normalizedPhone = method === "phone" && phone ? phone.trim() : undefined;

      // Use signUp to create user (following signUpApplicant pattern)
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        phone: normalizedPhone ? `+91${normalizedPhone}` : undefined,
        password: password,
        options: {
          data: {
            role: "applicant",
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Handle "already registered" - route to sign-in flow
        if (error.message.includes("already registered") || 
            error.message.includes("already been registered") ||
            error.message.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "This account already exists. Please sign in instead.",
            variant: "destructive",
          });
          navigate("/auth/login");
          return;
        }
        
        // Other errors
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        throw new Error("Failed to create account - no user returned");
      }

      // Wait for auth session (if magic link requires confirmation, you may need to signIn)
      const { data: sessionData } = await supabase.auth.getSession();
      let currentSession = sessionData.session;

      if (!currentSession) {
        // Fallback: try to sign in (temporary)
        console.log("No session after signup, attempting sign in...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          phone: normalizedPhone ? `+91${normalizedPhone}` : undefined,
          password: password,
        });

        if (signInError) {
          console.error("Sign in error:", signInError);
          toast({
            title: "Account Created",
            description: "Your account was created but requires email confirmation. Please check your email or try signing in.",
          });
          navigate("/auth/login");
          setIsLoading(false);
          return;
        }

        if (signInData.session) {
          currentSession = signInData.session;
        }
      }

      // Now profile trigger should have created a profiles row. Fetch profile.
      const userId = currentSession?.user?.id || data.user.id;
      const userMetadata = currentSession?.user?.user_metadata || data.user.user_metadata;
      
      // Get role from metadata or default to applicant
      const userRole = userMetadata?.role || 'applicant';
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!profile) {
        // Fallback create profile manually - use role from metadata
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: normalizedEmail || data.user.email || '',
            full_name: '',
            role: userRole, // Use role from metadata, not hardcoded 'applicant'
          });

        if (createError) {
          console.error('Error creating profile:', createError);
        }
      }
      // DO NOT modify existing profile role - database trigger handles this correctly

      // Clear session storage
      sessionStorage.removeItem("signup_email");
      sessionStorage.removeItem("signup_phone");
      sessionStorage.removeItem("signup_method");

      toast({
        title: "Account Created!",
        description: "Your account has been created successfully. Please complete your registration.",
      });

      // Refresh profile to get the newly created profile
      await refreshProfile();

      // Navigate to registration form
      navigate("/auth/applicant-register/step-1");
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking for email/phone
  if (!hasEmailOrPhone) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set Your Password</CardTitle>
          <CardDescription>
            Create a secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || password !== confirmPassword || password.length < 8}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/auth/register/verify-otp")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;

