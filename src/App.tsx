import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, ForceLightTheme } from "@/components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import Features from "./pages/Features";
import Industries from "./pages/Industries";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ApplicantLogin from "./pages/auth/ApplicantLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminSignup from "./pages/auth/AdminSignup";
import ClientLogin from "./pages/auth/ClientLogin";
import ClientSignup from "./pages/auth/ClientSignup";
import AccountCreationMethod from "./pages/auth/register/AccountCreationMethod";
import EmailSignUp from "./pages/auth/register/EmailSignUp";
import PhoneSignUp from "./pages/auth/register/PhoneSignUp";
import VerifyOTP from "./pages/auth/register/VerifyOTP";
import SetPassword from "./pages/auth/register/SetPassword";
import Step1BasicInfo from "./pages/auth/applicant-register/Step1BasicInfo";
import Step2Address from "./pages/auth/applicant-register/Step2Address";
import Step2Education from "./pages/auth/applicant-register/Step2Education";
import Step3Education from "./pages/auth/applicant-register/Step3Education";
import Step3Professional from "./pages/auth/applicant-register/Step3Professional";
import Step4Experience from "./pages/auth/applicant-register/Step4Experience";
import Step4Upload from "./pages/auth/applicant-register/Step4Upload";
import Step5Skills from "./pages/auth/applicant-register/Step5Skills";
import Step7Review from "./pages/auth/applicant-register/Step7Review";
import RegistrationSuccess from "./pages/auth/applicant-register/RegistrationSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";
import GoogleCallback from "./pages/auth/GoogleCallback";
import ForceChangePassword from "./pages/auth/ForceChangePassword";
import ApplicantProfile from "./pages/dashboard/applicant/ApplicantProfile";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="ellure-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          {/* Website pages - always light theme */}
          <Route path="/" element={<ForceLightTheme><Landing /></ForceLightTheme>} />
          <Route path="/about" element={<ForceLightTheme><About /></ForceLightTheme>} />
          <Route path="/services" element={<ForceLightTheme><Services /></ForceLightTheme>} />
          <Route path="/features" element={<ForceLightTheme><Features /></ForceLightTheme>} />
          <Route path="/industries" element={<ForceLightTheme><Industries /></ForceLightTheme>} />
          <Route path="/contact" element={<ForceLightTheme><Contact /></ForceLightTheme>} />
          <Route path="/faq" element={<ForceLightTheme><FAQ /></ForceLightTheme>} />
          <Route path="/privacy" element={<ForceLightTheme><Privacy /></ForceLightTheme>} />
          <Route path="/terms" element={<ForceLightTheme><Terms /></ForceLightTheme>} />
          {/* Auth pages - always light theme */}
          <Route path="/auth/login" element={<ForceLightTheme><ApplicantLogin /></ForceLightTheme>} />
          <Route path="/auth/forgot-password" element={<ForceLightTheme><ForgotPassword /></ForceLightTheme>} />
          <Route path="/auth/google/callback" element={<ForceLightTheme><GoogleCallback /></ForceLightTheme>} />
          <Route path="/auth/force-change-password" element={<ForceLightTheme><ForceChangePassword /></ForceLightTheme>} />
          <Route path="/auth/applicant" element={<ForceLightTheme><ApplicantLogin /></ForceLightTheme>} />
          <Route path="/admin/auth/login" element={<ForceLightTheme><AdminLogin /></ForceLightTheme>} />
          <Route path="/admin/auth/signup" element={<ForceLightTheme><AdminSignup /></ForceLightTheme>} />
          <Route path="/client/auth/login" element={<ForceLightTheme><ClientLogin /></ForceLightTheme>} />
          <Route path="/client/auth/signup" element={<ForceLightTheme><ClientSignup /></ForceLightTheme>} />
          <Route path="/auth/admin" element={<ForceLightTheme><AdminLogin /></ForceLightTheme>} />
          <Route path="/auth/client" element={<ForceLightTheme><ClientLogin /></ForceLightTheme>} />
          {/* Registration Routes - always light theme */}
          <Route path="/auth/register" element={<ForceLightTheme><AccountCreationMethod /></ForceLightTheme>} />
          <Route path="/auth/register/email" element={<ForceLightTheme><EmailSignUp /></ForceLightTheme>} />
          <Route path="/auth/register/phone" element={<ForceLightTheme><PhoneSignUp /></ForceLightTheme>} />
          <Route path="/auth/register/verify-otp" element={<ForceLightTheme><VerifyOTP /></ForceLightTheme>} />
          <Route path="/auth/register/set-password" element={<ForceLightTheme><SetPassword /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-1" element={<ForceLightTheme><Step1BasicInfo /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-2" element={<ForceLightTheme><Step2Address /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-2-education" element={<ForceLightTheme><Step2Education /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-3" element={<ForceLightTheme><Step3Education /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-3-professional" element={<ForceLightTheme><Step3Professional /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-4" element={<ForceLightTheme><Step4Experience /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-4-upload" element={<ForceLightTheme><Step4Upload /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-5" element={<ForceLightTheme><Step5Skills /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-6" element={<ForceLightTheme><Step4Upload /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/step-7" element={<ForceLightTheme><Step7Review /></ForceLightTheme>} />
          <Route path="/auth/applicant-register/success" element={<ForceLightTheme><RegistrationSuccess /></ForceLightTheme>} />
          {/* Dashboard Routes - respect user's theme preference */}
          <Route path="/dashboard/applicant" element={<ApplicantProfile />} />
          <Route path="/dashboard/applicant/profile" element={<ApplicantProfile />} />
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          <Route path="/dashboard/client/*" element={<ClientDashboard />} />
          <Route path="*" element={<ForceLightTheme><NotFound /></ForceLightTheme>} />
        </Routes>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
