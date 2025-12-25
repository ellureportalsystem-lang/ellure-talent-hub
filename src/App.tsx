import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Services from "./pages/Services";
import Features from "./pages/Features";
import Industries from "./pages/Industries";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import ApplicantLogin from "./pages/auth/ApplicantLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import ClientLogin from "./pages/auth/ClientLogin";
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
import ApplicantDashboard from "./pages/dashboard/ApplicantDashboard";
import ApplicantProfile from "./pages/dashboard/applicant/ApplicantProfile";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/features" element={<Features />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/auth/applicant" element={<ApplicantLogin />} />
          <Route path="/auth/admin" element={<AdminLogin />} />
          <Route path="/auth/client" element={<ClientLogin />} />
          {/* Registration Routes */}
          <Route path="/auth/register" element={<AccountCreationMethod />} />
          <Route path="/auth/register/email" element={<EmailSignUp />} />
          <Route path="/auth/register/phone" element={<PhoneSignUp />} />
          <Route path="/auth/register/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/register/set-password" element={<SetPassword />} />
          {/* Applicant Registration Steps */}
          <Route path="/auth/applicant-register/step-1" element={<Step1BasicInfo />} />
          <Route path="/auth/applicant-register/step-2" element={<Step2Address />} />
          <Route path="/auth/applicant-register/step-2-education" element={<Step2Education />} />
          <Route path="/auth/applicant-register/step-3" element={<Step3Education />} />
          <Route path="/auth/applicant-register/step-3-professional" element={<Step3Professional />} />
          <Route path="/auth/applicant-register/step-4" element={<Step4Experience />} />
          <Route path="/auth/applicant-register/step-4-upload" element={<Step4Upload />} />
          <Route path="/auth/applicant-register/step-5" element={<Step5Skills />} />
          <Route path="/auth/applicant-register/step-6" element={<Step4Upload />} />
          <Route path="/auth/applicant-register/step-7" element={<Step7Review />} />
          <Route path="/auth/applicant-register/success" element={<RegistrationSuccess />} />
          {/* Dashboard Routes */}
          <Route path="/dashboard/applicant/profile" element={<ApplicantProfile />} />
          <Route path="/dashboard/applicant" element={<ApplicantDashboard />} />
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          <Route path="/dashboard/client/*" element={<ClientDashboard />} />
          {/* Redirect /auth/login to /auth/applicant for backward compatibility */}
          <Route path="/auth/login" element={<ApplicantLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
