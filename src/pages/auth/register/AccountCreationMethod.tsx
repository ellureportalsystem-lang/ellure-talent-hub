import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, ArrowRight } from "lucide-react";

const AccountCreationMethod = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Choose how you'd like to register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => navigate("/auth/register/email")}
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            variant="outline"
          >
            <Mail className="h-6 w-6" />
            <span className="text-base">Continue with Email</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => navigate("/auth/register/phone")}
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            variant="outline"
          >
            <Phone className="h-6 w-6" />
            <span className="text-base">Continue with Phone</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate("/auth/applicant")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountCreationMethod;
