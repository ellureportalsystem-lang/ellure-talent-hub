import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const PhoneSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const e164 = `+91${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: {
          shouldCreateUser: true,
          data: { role: "applicant" },
        },
      });

      if (error) throw error;

      sessionStorage.setItem("signup_phone", phone);
      sessionStorage.setItem("signup_method", "phone");
      sessionStorage.removeItem("signup_email");

      toast({
        title: "Verification code sent",
        description: `Check SMS on +91 ${phone} for your code.`,
      });

      navigate("/auth/register/verify-otp");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification code",
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
              <Phone className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sign up with Phone</CardTitle>
          <CardDescription>
            Enter your phone number to receive a verification code via Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(value);
                }}
                required
                disabled={isLoading}
                autoComplete="tel"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">Enter your 10-digit mobile number</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || phone.length !== 10}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <Button variant="ghost" className="w-full" onClick={() => navigate("/auth/register")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
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

export default PhoneSignUp;
