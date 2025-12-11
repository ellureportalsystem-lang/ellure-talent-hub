import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = sessionStorage.getItem("signup_email");
  const phone = sessionStorage.getItem("signup_phone");
  const method = sessionStorage.getItem("signup_method");

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    
    // For now, hardcoded OTP is "123456"
    if (otpString !== "123456") {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // OTP verified, navigate to password setup
      navigate("/auth/register/set-password");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email && !phone) {
    // If no email/phone in session, redirect back
    navigate("/auth/register");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify Your {method === "email" ? "Email" : "Phone"}</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {method === "email" ? email : phone}
          </CardDescription>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Use code: <span className="font-mono font-semibold text-primary">123456</span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otp.join("").length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
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
              Didn't receive the code?{" "}
              <button
                onClick={() => {
                  // Resend OTP logic here
                  toast({
                    title: "Code Resent",
                    description: "Use code: 123456",
                  });
                }}
                className="text-primary hover:underline font-semibold"
              >
                Resend
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;












