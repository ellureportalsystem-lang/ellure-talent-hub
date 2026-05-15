import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const AdminSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
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

    if (!formData.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create auth user
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      console.log("Step 1: Attempting to create auth user...", { email: normalizedEmail });
      
      let authData, authError;
      try {
        console.log("Calling supabase.auth.signUp()...");
        
        // Signup without timeout - let it complete naturally
        // The trigger might be slow, but we'll handle it with retries and fallbacks
        console.log("Calling supabase.auth.signUp()...");
        const signUpResult = await supabase.auth.signUp({
          email: normalizedEmail,
          password: formData.password,
          options: {
            data: {
              role: "admin", // Set as 'admin' directly
              full_name: formData.fullName || "",
            },
            emailRedirectTo: undefined, // Don't redirect after email confirmation
          },
        });
        
        console.log("Signup call completed, processing result...");
        authData = signUpResult.data;
        authError = signUpResult.error;
      } catch (signupException: any) {
        console.error("❌ Exception during signup:", signupException);
        console.error("Exception details:", {
          message: signupException.message,
          stack: signupException.stack,
          name: signupException.name
        });
        authError = signupException;
        authData = null;
      }
      
      console.log("Step 1 Result:", { 
        hasUser: !!authData?.user, 
        hasError: !!authError,
        error: authError?.message,
        errorName: authError?.name,
        errorStatus: authError?.status,
        user: authData?.user ? { id: authData.user.id, email: authData.user.email } : null,
        session: authData?.session ? "exists" : "null"
      });

      if (authError) {
        console.error("❌ Signup error:", authError);
        console.error("Error details:", {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
        
        if (authError.message.includes("already registered") || 
            authError.message.includes("already been registered") ||
            authError.message.includes("User already registered")) {
          console.log("User already exists, will handle in repeated signup flow");
          // Continue to repeated signup handling below
        } else {
          toast({
            title: "Error",
            description: authError.message || "Failed to create account. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Check if user already exists (repeated signup)
      // If no user was returned, the user already exists
      if (!authData?.user) {
        console.log("⚠️ User already exists (repeated signup), checking for existing profile and admin_users record...");
        
        // User already exists - sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: formData.password,
        });

        if (signInError || !signInData.user) {
          console.error("❌ Sign in error:", signInError);
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "default",
          });
          navigate("/admin/auth/login");
          setIsLoading(false);
          return;
        }

        // Get the user ID from the signed-in user
        const existingUserId = signInData.user.id;
        console.log("✅ Signed in existing user, ID:", existingUserId);

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", existingUserId)
          .maybeSingle();

        if (profileError || !existingProfile) {
          console.error("❌ Profile not found for existing user:", profileError);
          toast({
            title: "Error",
            description: "Account exists but profile is missing. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Check if admin_users record already exists
        const { data: existingAdminUser } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", existingProfile.id)
          .maybeSingle();

        if (existingAdminUser) {
          console.log("Existing admin_users record found:", existingAdminUser);
          if (existingAdminUser.status === 'pending') {
            toast({
              title: "Request Already Submitted",
              description: "You already have a pending admin access request. Please wait for approval.",
              variant: "default",
            });
          } else if (existingAdminUser.status === 'approved') {
            toast({
              title: "Account Exists",
              description: "You already have an admin account. Please sign in instead.",
              variant: "default",
            });
            navigate("/admin/auth/login");
          } else {
            toast({
              title: "Request Exists",
              description: "You already have an admin request. Please contact support.",
              variant: "default",
            });
          }
          setIsLoading(false);
          return;
        }

        // User exists but no admin_users record - create it
        console.log("User exists but no admin_users record, creating one...");
        const { data: newAdminUser, error: createAdminError } = await supabase
          .from("admin_users")
          .insert({
            user_id: existingProfile.id,
            email: normalizedEmail,
            full_name: formData.fullName || existingProfile.full_name || "",
            phone: formData.phone || existingProfile.phone || null,
            admin_role: "admin", // Auto-approve: set to 'admin'
            status: "approved", // Auto-approve: set to 'approved'
          })
          .select()
          .single();

        if (createAdminError) {
          console.error("❌ Failed to create admin_users record:", createAdminError);
          toast({
            title: "Warning",
            description: `Account exists but admin request failed: ${createAdminError.message}. Please contact support.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        console.log("✅ Created admin_users record for existing user:", newAdminUser);
        toast({
          title: "Admin Account Created Successfully!",
          description: "Your admin account has been created and approved. You can now sign in.",
          variant: "default",
        });
        setIsLoading(false);
        setTimeout(() => navigate("/admin/auth/login"), 1500);
        return;
      }

      // ============================================================
      // NEW USER FLOW - User was successfully created
      // ============================================================
      console.log("✅ New user created successfully!");
      console.log("User ID:", authData.user.id, "Email:", authData.user.email);
      console.log("Continuing to Step 2...");

      // Step 2: Wait for profile to be created (by trigger) with retries
      console.log("Step 2: Waiting for profile trigger...");
      let profile = null;
      const maxProfileAttempts = 10; // Try for up to 5 seconds
      let profileAttempts = 0;
      
      while (!profile && profileAttempts < maxProfileAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        profileAttempts++;
        
        console.log(`Step 3: Fetching profile (attempt ${profileAttempts}/${maxProfileAttempts})...`);
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();
        
        if (profileData) {
          profile = profileData;
          console.log(`✅ Profile found after ${profileAttempts} attempts:`, profile);
          break;
        }
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("❌ Profile fetch error:", profileError);
          break; // Stop retrying on non-404 errors
        }
        
        if (profileAttempts % 3 === 0) {
          console.log(`Still waiting for profile... (attempt ${profileAttempts}/${maxProfileAttempts})`);
        }
      }
      
      // If profile still not found, create it manually
      if (!profile) {
        console.log("Profile not found after waiting, creating manually...");
        const { data: newProfile, error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: normalizedEmail,
            phone: formData.phone || null,
            full_name: formData.fullName || "",
            role: "applicant", // Set as 'applicant' initially (will be changed to 'admin' on approval)
          })
          .select()
          .single();

        if (createProfileError) {
          console.error("❌ Profile creation error:", createProfileError);
          toast({
            title: "Error",
            description: `Account created but profile setup failed: ${createProfileError.message}. Please contact support.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        console.log("✅ Profile created manually:", newProfile);
        profile = newProfile;
        profileId = newProfile.id;
      } else if (!profile) {
        // Profile doesn't exist, create it
        console.log("Profile not found, creating manually...");
        const { data: newProfile, error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: normalizedEmail,
            phone: formData.phone || null,
            full_name: formData.fullName || "",
            role: "applicant", // Set as 'applicant' initially (will be changed to 'admin' on approval)
          })
          .select()
          .single();

        if (createProfileError) {
          console.error("❌ Profile creation error:", createProfileError);
          toast({
            title: "Error",
            description: `Account created but profile setup failed: ${createProfileError.message}. Please contact support.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        console.log("✅ Profile created manually:", newProfile);
        profile = newProfile;
        profileId = newProfile.id;
      } else {
        console.log("✅ Profile found:", profile);
        profileId = profile.id;
      }

      console.log("Step 3 Complete - Profile ID:", profileId);

      // Step 4: Check if admin_users record already exists
      console.log("Step 4: Checking for existing admin_users record...", { profileId });
      const { data: existingAdminUser, error: checkError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", profileId)
        .maybeSingle();

      console.log("Step 4 Result:", { 
        hasExisting: !!existingAdminUser, 
        hasError: !!checkError,
        error: checkError?.message 
      });

      if (existingAdminUser) {
        // Admin user record already exists
        console.log("Existing admin_users record found:", existingAdminUser);
        if (existingAdminUser.status === 'pending') {
          toast({
            title: "Request Already Submitted",
            description: "You already have a pending admin access request. Please wait for approval.",
            variant: "default",
          });
        } else if (existingAdminUser.status === 'approved') {
          toast({
            title: "Account Exists",
            description: "You already have an admin account. Please sign in instead.",
            variant: "default",
          });
          navigate("/admin/auth/login");
        } else {
          toast({
            title: "Request Exists",
            description: "You already have an admin request on file.",
            variant: "default",
          });
        }
        setIsLoading(false);
        return;
      }

      // Step 5: Create admin_users record
      console.log("Step 5: Creating admin_users record...", { 
        profileId, 
        email: normalizedEmail,
        fullName: formData.fullName,
        phone: formData.phone 
      });
      
      try {
        const { data: adminUserData, error: adminUserError } = await supabase
          .from("admin_users")
          .insert({
            user_id: profileId,
            email: normalizedEmail,
            full_name: formData.fullName || "",
            phone: formData.phone || null,
            admin_role: "admin", // Auto-approve: set to 'admin'
            status: "approved", // Auto-approve: set to 'approved'
          })
          .select()
          .single();

        console.log("Step 5 Result:", { 
          hasData: !!adminUserData, 
          hasError: !!adminUserError,
          error: adminUserError?.message,
          errorCode: adminUserError?.code,
          errorDetails: adminUserError?.details,
          errorHint: adminUserError?.hint
        });

        if (adminUserError) {
          console.error("❌ Admin user creation error:", adminUserError);
          console.error("Error code:", adminUserError.code);
          console.error("Error message:", adminUserError.message);
          console.error("Error details:", adminUserError.details);
          console.error("Error hint:", adminUserError.hint);
          
          // Check if it's a duplicate key error
          if (adminUserError.code === '23505' || adminUserError.message.includes('duplicate') || adminUserError.message.includes('unique')) {
            toast({
              title: "Request Already Exists",
              description: "You already have an admin access request. Please wait for approval or contact support.",
              variant: "default",
            });
          } else if (adminUserError.code === '42501' || adminUserError.message.includes('row-level security') || adminUserError.message.includes('RLS')) {
            toast({
              title: "Permission Denied",
              description: "Unable to create admin request due to security policy. Please contact support.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Warning",
              description: `Account created but admin request failed: ${adminUserError.message}. Please contact support.`,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }
        
        if (!adminUserData) {
          console.error("❌ Admin user data is null after insert");
          toast({
            title: "Warning",
            description: "Account created but admin request failed. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        console.log("✅ Step 5 Success: admin_users record created", adminUserData);
        
        // Verify the record was actually created
        console.log("Step 5.1: Verifying admin_users record was created...");
        const { data: verifyAdminUser, error: verifyError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", profileId)
          .maybeSingle();
        
        if (verifyError) {
          console.error("❌ Verification error:", verifyError);
        }
        
        if (!verifyAdminUser) {
          console.error("❌ Verification failed: admin_users record not found after insert");
          toast({
            title: "Warning",
            description: "Admin request may not have been saved. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        console.log("✅ Verified: admin_users record exists", verifyAdminUser);
      } catch (insertError: any) {
        console.error("❌ Unexpected error during admin_users insert:", insertError);
        toast({
          title: "Error",
          description: `Failed to create admin request: ${insertError.message || 'Unknown error'}. Please contact support.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Step 6: Ensure profile role is 'applicant' (will be changed to 'admin' on approval)
      console.log("Step 6: Ensuring profile role is correct...");
      if (profile && profile.role !== 'applicant' && profile.role !== 'admin') {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "applicant" })
          .eq("id", profileId);
        
        if (updateError) {
          console.error("Profile role update error:", updateError);
        }
      }

      // Success message
      console.log("Step 7: Signup complete, showing success message");
      toast({
        title: "Admin Account Created Successfully!",
        description: "Your admin account has been created and approved. You can now sign in.",
        variant: "default",
      });

      // Set loading to false immediately
      setIsLoading(false);

      // Redirect to login after a short delay (non-blocking)
      console.log("Step 8: Scheduling redirect to login...");
      setTimeout(() => {
        console.log("Redirecting to login...");
        navigate("/admin/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
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
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Admin Sign Up</CardTitle>
              </div>
              <Link to="/admin/auth/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
            <CardDescription>
              Create an admin account. Your request will be reviewed and approved by an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
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
                      Your admin account will be created and automatically approved. 
                      You can sign in immediately after registration.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <UserPlus className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Request Admin Access
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/admin/auth/login"
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

export default AdminSignup;
