import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import { CheckCircle2 } from "lucide-react";

import { PORTAL_ROUTES } from "@/lib/portalRoutes";

import { EllureBrandLogo } from "@/components/auth/EllureBrandLogo";

import { AuthCartoonArt } from "@/components/auth/AuthCartoonArt";

import type { AuthCartoonVariant } from "@/lib/authCartoonAssets";



type NaukriAuthLayoutProps = {

  title: string;

  subtitle?: string;

  welcomeMessage?: string;

  portalBadge?: string;

  promoTitle: string;

  promoItems: string[];

  promoCta?: { label: string; to: string };

  promoTagline?: string;

  cartoonVariant: AuthCartoonVariant;

  children: ReactNode;

  footerLinks?: { label: string; to: string }[];

};



export function NaukriAuthLayout({

  title,

  subtitle,

  welcomeMessage = "Welcome back! Sign in to continue.",

  portalBadge,

  promoTitle,

  promoItems,

  promoCta,

  promoTagline = "Ellure TalentHub — hire faster with Resdex & NVite",

  cartoonVariant,

  children,

  footerLinks = [],

}: NaukriAuthLayoutProps) {

  return (

    <div className="min-h-screen bg-[#f4f5f7]">

      <header className="border-b border-[#e8e8e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">

          <EllureBrandLogo to="/" size="md" />

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#666]">

            <Link to={PORTAL_ROUTES.candidate.login} className="hover:text-[#0566CD] transition-colors">

              For candidates

            </Link>

            <Link to={PORTAL_ROUTES.recruiter.login} className="hover:text-[#0566CD] transition-colors">

              For recruiters

            </Link>

            <Link to={PORTAL_ROUTES.hub} className="font-medium text-[#0566CD]">

              All portals

            </Link>

          </nav>

        </div>

      </header>



      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">

        {/* Promo panel — illustration above copy (Naukri-style left rail) */}

        <div className="hidden lg:flex lg:flex-col lg:justify-center">

          <AuthCartoonArt variant={cartoonVariant} className="mb-6" />



          <h2 className="text-xl font-semibold text-[#333] leading-snug">{promoTitle}</h2>

          <ul className="mt-5 space-y-3.5">

            {promoItems.map((item) => (

              <li key={item} className="flex gap-3 text-sm text-[#555] leading-relaxed">

                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0566CD] mt-0.5" />

                <span>{item}</span>

              </li>

            ))}

          </ul>



          {promoCta && (

            <Link

              to={promoCta.to}

              className="mt-7 inline-flex w-fit rounded border-2 border-[#0566CD] px-5 py-2 text-sm font-semibold text-[#0566CD] hover:bg-[#f0f7ff] transition-colors"

            >

              {promoCta.label}

            </Link>

          )}



          <div className="mt-10 rounded-lg border border-[#e8e8e8] bg-white px-5 py-4 text-center shadow-[0_1px_4px_rgba(0,0,0,0.05)]">

            <p className="text-sm text-[#666]">{promoTagline}</p>

          </div>

        </div>



        {/* Mobile promo — compact illustration */}

        <div className="lg:hidden flex flex-col items-center text-center pb-2">

          <AuthCartoonArt variant={cartoonVariant} className="mb-4 max-w-[260px]" />

          <h2 className="text-lg font-semibold text-[#333]">{promoTitle}</h2>

          <p className="mt-1 text-xs text-[#666] max-w-sm">{promoItems[0]}</p>

        </div>



        {/* Login form */}

        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:flex lg:flex-col lg:justify-center">

          <div className="rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-8">

            <div className="mb-6 flex items-start gap-3">
              <div className="lg:hidden shrink-0">
                <EllureBrandLogo to={false} size="sm" />
              </div>
              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-[#0566CD] uppercase tracking-wide">

                  {welcomeMessage}

                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                  <h1 className="text-xl font-bold text-[#333]">{title}</h1>

                  {portalBadge && (

                    <span className="rounded-full bg-[#f0f7ff] px-2.5 py-0.5 text-[10px] font-semibold text-[#0566CD] border border-[#bfdbfe]">

                      {portalBadge}

                    </span>

                  )}

                </div>

                {subtitle && <p className="mt-1.5 text-sm text-[#666]">{subtitle}</p>}

              </div>

            </div>

            {children}

          </div>



          {footerLinks.length > 0 && (

            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#666]">

              {footerLinks.map((l) => (

                <Link key={l.to} to={l.to} className="hover:text-[#0566CD] hover:underline transition-colors">

                  {l.label}

                </Link>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


