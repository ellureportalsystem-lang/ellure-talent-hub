import { Link } from "react-router-dom";
import { Construction, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND_NAME } from "@/lib/brand";

export default function AuthMaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F8FAFC] via-white to-[#E9F0FF]">
      <header className="border-b border-[#E2E8F0]/80 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-6">
        <Link to="/" className="inline-flex items-center" aria-label={`${BRAND_NAME} home`}>
          <BrandLogo size="sm" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0566CD]/10 text-[#0566CD] ring-1 ring-[#0566CD]/15">
            <Construction className="h-8 w-8" aria-hidden />
          </div>

          <h1 className="font-poppins text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Portals temporarily unavailable
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Candidate, recruiter, and admin login are under development. Please check back soon.
          </p>

          <p className="mt-2 text-sm text-[#94A3B8]">
            You can still browse our public website in the meantime.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 rounded-full px-8 font-semibold">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to website
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-8">
              <Link to="/contact">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Contact us
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
