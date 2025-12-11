import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const EmailSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll use hardcoded OTP "123456"
      // Store email in sessionStorage for OTP verification page
      sessionStorage.setItem("signup_email", email.trim().toLowerCase());
      sessionStorage.setItem("signup_method", "email");
      
      // In production, you would send OTP here:
      // const { error } = await supabase.auth.signInWithOtp({
      //   email: email.trim(),
      //   options: {
      //     shouldCreateUser: true,
      //   }
      // });

      toast({
        title: "OTP Sent",
        description: `OTP sent to ${email}. Use code: 123456`,
      });

      // Navigate to OTP verification
      navigate("/auth/register/verify-otp");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
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
          <CardTitle className="text-2xl">Sign up with Email</CardTitle>
          <CardDescription>
            Enter your email address to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/auth/register")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="text-primary hover:underline font-semibold"
              >
                Sign in
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSignUp;












