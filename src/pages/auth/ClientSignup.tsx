import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ClientSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactPerson: "",
    phone: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.companyName) {
      toast({
        title: "Error",
        description: "Email and Company Name are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          data: {
            role: "client",
            full_name: formData.contactPerson || "",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered") || 
            authError.message.includes("already been registered")) {
          // User exists - sign in and create client record
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: formData.password,
          });

          if (signInError || !signInData.user) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "default",
            });
            navigate("/client/auth/login");
            setIsLoading(false);
            return;
          }

          // Get profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", signInData.user.id)
            .maybeSingle();

          if (!profile) {
            toast({
              title: "Error",
              description: "Profile not found. Please contact support.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          // Check if client record exists
          const { data: existingClient } = await supabase
            .from("clients")
            .select("*")
            .eq("user_id", profile.id)
            .maybeSingle();

          if (existingClient) {
            toast({
              title: "Account Exists",
              description: "You already have a client account. Please sign in instead.",
              variant: "default",
            });
            navigate("/client/auth/login");
            setIsLoading(false);
            return;
          }

          // Create client record
          const { data: clientData, error: clientError } = await supabase
            .from("clients")
            .insert({
              user_id: profile.id,
              email: normalizedEmail,
              company_name: formData.companyName,
              contact_person: formData.contactPerson || null,
              phone: formData.phone || null,
            })
            .select()
            .single();

          if (clientError) {
            toast({
              title: "Error",
              description: `Failed to create client account: ${clientError.message}`,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          toast({
            title: "Client Account Created!",
            description: "Your client account has been created. You can now access the dashboard.",
          });
          navigate("/dashboard/client");
          setIsLoading(false);
          return;
        }

        toast({
          title: "Error",
          description: authError.message || "Failed to create account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Wait for profile to be created
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        toast({
          title: "Error",
          description: "Account created but profile setup failed. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Step 4: Create client record
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert({
          user_id: profile.id,
          email: normalizedEmail,
          company_name: formData.companyName,
          contact_person: formData.contactPerson || null,
          phone: formData.phone || null,
        })
        .select()
        .single();

      if (clientError) {
        toast({
          title: "Error",
          description: `Account created but client setup failed: ${clientError.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Step 5: Check if session exists, if not sign in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: formData.password,
        });

        if (signInError) {
          toast({
            title: "Account Created",
            description: "Your account was created. Please sign in.",
            variant: "default",
          });
          navigate("/client/auth/login");
          setIsLoading(false);
          return;
        }
      }

      toast({
        title: "Client Account Created Successfully!",
        description: "Your client account has been created. You can now access the dashboard.",
      });

      navigate("/dashboard/client");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Client Sign Up</CardTitle>
              </div>
              <Link to="/client/auth/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
            <CardDescription>
              Create a client account to access the talent pool and manage shortlists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  type="text"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 8 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-medium mb-1">Auto-Approved</p>
                    <p>
                      Your client account will be created and automatically approved. 
                      You can access the dashboard immediately after registration.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Building2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Client Account
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/client/auth/login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignup;
