import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import GoogleCallback from "./pages/auth/GoogleCallback";
import ApplicantLogin from "./pages/auth/ApplicantLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import ClientLogin from "./pages/auth/ClientLogin";
import ForceChangePassword from "./pages/auth/ForceChangePassword";

// Account Creation Pages
import AccountCreationMethod from "./pages/auth/register/AccountCreationMethod";
import EmailSignUp from "./pages/auth/register/EmailSignUp";
import PhoneSignUp from "./pages/auth/register/PhoneSignUp";
import VerifyOTP from "./pages/auth/register/VerifyOTP";
import SetPassword from "./pages/auth/register/SetPassword";

// Registration Steps
import Step1BasicInfo from "./pages/auth/applicant-register/Step1BasicInfo";
import Step2Address from "./pages/auth/applicant-register/Step2Address";
import Step3Education from "./pages/auth/applicant-register/Step3Education";
import Step4Experience from "./pages/auth/applicant-register/Step4Experience";
import Step5Skills from "./pages/auth/applicant-register/Step5Skills";
import Step6Upload from "./pages/auth/applicant-register/Step4Upload";
import Step7Review from "./pages/auth/applicant-register/Step7Review";
import RegistrationSuccess from "./pages/auth/applicant-register/RegistrationSuccess";

// Dashboards
import ApplicantDashboard from "./pages/dashboard/ApplicantDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import ApplicantProfile from "./pages/dashboard/applicant/ApplicantProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            {/* Keep old routes for backward compatibility */}
            <Route path="/auth/applicant" element={<ApplicantLogin />} />
            <Route path="/auth/admin" element={<AdminLogin />} />
            <Route path="/auth/client" element={<ClientLogin />} />
            
            {/* Account Creation Routes */}
            <Route path="/auth/register" element={<AccountCreationMethod />} />
            <Route path="/auth/register/email" element={<EmailSignUp />} />
            <Route path="/auth/register/phone" element={<PhoneSignUp />} />
            <Route path="/auth/register/verify-otp" element={<VerifyOTP />} />
            <Route path="/auth/register/set-password" element={<SetPassword />} />
            
            {/* Registration Form Routes - Phase 2 (7 Steps) - Requires Authentication */}
            <Route 
              path="/auth/applicant-register/step-1" 
              element={
                <ProtectedRoute>
                  <Step1BasicInfo />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-2" 
              element={
                <ProtectedRoute>
                  <Step2Address />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-3" 
              element={
                <ProtectedRoute>
                  <Step3Education />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-4" 
              element={
                <ProtectedRoute>
                  <Step4Experience />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-5" 
              element={
                <ProtectedRoute>
                  <Step5Skills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-6" 
              element={
                <ProtectedRoute>
                  <Step6Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/step-7" 
              element={
                <ProtectedRoute>
                  <Step7Review />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/applicant-register/success" 
              element={
                <ProtectedRoute>
                  <RegistrationSuccess />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="/auth/force-change-password"
              element={
                <ProtectedRoute>
                  <ForceChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applicant"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['applicant']}>
                    <ApplicantDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['applicant']}>
                    <ApplicantProfile />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applicant/profile"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['applicant']}>
                    <ApplicantProfile />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/client/*"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
