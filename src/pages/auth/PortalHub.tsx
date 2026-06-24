import { Link } from "react-router-dom";

import { Building2, Shield, UserCircle, ArrowRight } from "lucide-react";

import { PORTAL_ROUTES } from "@/lib/portalRoutes";

import { EllureBrandLogo } from "@/components/auth/EllureBrandLogo";

import { AuthCartoonArt } from "@/components/auth/AuthCartoonArt";



const portals = [

  {

    role: "Candidate",

    desc: "Search jobs, manage applications, build your profile",

    icon: UserCircle,

    login: PORTAL_ROUTES.candidate.login,

    register: PORTAL_ROUTES.candidate.register,

    color: "border-emerald-200 hover:border-emerald-400",

    iconBg: "bg-emerald-50 text-emerald-600",

    cartoon: "candidate" as const,

  },

  {

    role: "Recruiter",

    desc: "Resdex search, NVite, jobs & hiring pipeline",

    icon: Building2,

    login: PORTAL_ROUTES.recruiter.login,

    register: PORTAL_ROUTES.recruiter.signup,

    color: "border-blue-200 hover:border-[#0566CD]",

    iconBg: "bg-blue-50 text-[#0566CD]",

    cartoon: "recruiter" as const,

  },

  {

    role: "Admin",

    desc: "Portal operations, data import, recruiters & plans",

    icon: Shield,

    login: PORTAL_ROUTES.admin.login,

    register: PORTAL_ROUTES.admin.signup,

    color: "border-slate-200 hover:border-slate-400",

    iconBg: "bg-slate-100 text-slate-700",

    cartoon: "admin" as const,

  },

] as const;



export default function PortalHub() {

  return (

    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">

      <header className="border-b border-[#e8e8e8] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

        <EllureBrandLogo to="/" size="md" showTagline />

      </header>



      <main className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-5xl">

          <div className="text-center mb-8">

            <AuthCartoonArt variant="hub" className="mx-auto mb-4 max-w-[300px]" />

            <p className="text-sm font-medium text-[#0566CD]">Welcome to Ellure TalentHub</p>

            <h1 className="mt-1 text-2xl font-bold text-[#333] sm:text-3xl">

              Choose your portal

            </h1>

            <p className="mt-2 text-[#666] text-sm sm:text-base">

              Each portal is secured separately — use the login for your role only.

            </p>

          </div>



          <div className="grid gap-4 sm:grid-cols-3">

            {portals.map((p) => (

              <div

                key={p.role}

                className={`rounded-xl border-2 bg-white p-6 transition-shadow hover:shadow-lg ${p.color}`}

              >

                <div className={`inline-flex rounded-lg p-3 ${p.iconBg}`}>

                  <p.icon className="h-6 w-6" />

                </div>

                <h2 className="mt-4 text-lg font-bold text-[#333]">{p.role}</h2>

                <p className="mt-2 text-sm text-[#666] leading-relaxed">{p.desc}</p>

                <div className="mt-6 space-y-2">

                  <Link

                    to={p.login}

                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0566CD] py-2.5 text-sm font-semibold text-white hover:bg-[#0066c0]"

                  >

                    Login

                    <ArrowRight className="h-4 w-4" />

                  </Link>

                  {p.role !== "Admin" && (

                    <Link

                      to={p.register}

                      className="block w-full text-center text-sm text-[#0566CD] hover:underline py-1"

                    >

                      {p.role === "Candidate" ? "Register for free" : "Sign up"}

                    </Link>

                  )}

                </div>

              </div>

            ))}

          </div>



          <p className="mt-8 text-center text-xs text-[#666]">

            Wrong portal? You will be redirected after login based on your account role.

          </p>

        </div>

      </main>

    </div>

  );

}


