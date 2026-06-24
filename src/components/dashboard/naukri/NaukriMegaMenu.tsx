import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuLabel,

  DropdownMenuSeparator,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { LayoutGrid } from "lucide-react";

import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";



type NaukriMegaMenuProps = {

  portal: "recruiter" | "admin" | "candidate";

};



const MENUS = {

  recruiter: {

    title: "Recruiter products",

    sections: [

      {

        title: "Search Resumes",

        links: [

          { label: "Advanced Search", to: "/dashboard/client/resdex" },

          { label: "Search Results", to: "/dashboard/client/resdex/results" },

          { label: "Saved Searches", to: "/dashboard/client" },

        ],

      },

      {

        title: "Jobs & Responses",

        links: [

          { label: "Post a Job", to: "/dashboard/client/jobs/post" },

          { label: "Manage Responses", to: "/dashboard/client/jobs/responses" },

          { label: "Send NVite", to: "/dashboard/client/nvite" },

        ],

      },

      {

        title: "Reports",

        links: [

          { label: "Hiring Reports", to: "/dashboard/client/reports" },

          { label: "Resdex Usage", to: "/dashboard/client/reports" },

        ],

      },

    ],

  },

  admin: {

    title: "Admin console",

    sections: [

      {

        title: "Data",

        links: [

          { label: "Candidate search", to: "/dashboard/admin/applicants" },

          { label: "Import Excel", to: "/dashboard/admin/data/import" },

          { label: "Bulk Resumes", to: "/dashboard/admin/data/bulk-resumes" },

        ],

      },

      {

        title: "Management",

        links: [

          { label: "Recruiters", to: "/dashboard/admin/recruiters" },

          { label: "Users & roles", to: "/dashboard/admin/users" },

          { label: "Messages", to: "/dashboard/admin/messages" },

          { label: "Subscriptions", to: "/dashboard/admin/subscriptions" },

          { label: "Analytics", to: "/dashboard/admin/analytics" },

        ],

      },

    ],

  },

  candidate: {

    title: "Candidate tools",

    sections: [

      {

        title: "Jobs",

        links: [

          { label: "Browse Jobs", to: "/dashboard/applicant/jobs" },

          { label: "Saved Jobs", to: "/dashboard/applicant/saved-jobs" },

          { label: "Job Alerts", to: "/dashboard/applicant/job-alerts" },

        ],

      },

      {

        title: "Profile",

        links: [

          { label: "My Profile", to: "/dashboard/applicant" },

          { label: "Applications", to: "/dashboard/applicant/applications" },

          { label: "Profile Views", to: "/dashboard/applicant/profile-views" },

        ],

      },

    ],

  },

} as const;



/** Naukri-style "Talent Cloud" pill with gradient border + products grid */

export function NaukriTalentCloudButton() {

  const menu = MENUS.recruiter;



  return (

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button

          type="button"

          className={cn(

            "hidden lg:inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-[#333]",

            "border border-transparent bg-white",

            "shadow-[0_0_0_1px_#e8e8e8]",

            "hover:shadow-[0_0_0_1px_#0566CD] hover:text-[#0566CD]",

            "relative before:absolute before:inset-0 before:rounded-full before:p-[1px]",

            "before:bg-gradient-to-r before:from-[#0566CD]/40 before:to-[#1A9EB0]/40 before:-z-10"

          )}

          aria-label="Quick links"

        >

          <LayoutGrid className="h-3.5 w-3.5" />

          <span className="hidden 2xl:inline">Quick links</span>

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[420px] p-0 border-[#e8e8e8] shadow-lg">

        <div className="border-b border-[#f0f0f0] px-4 py-3">

          <p className="text-sm font-semibold text-[#333]">{menu.title}</p>

          <p className="text-xs text-[#666]">Quick access to all recruiter tools</p>

        </div>

        <div className="grid grid-cols-3 gap-0 p-2">

          {menu.sections.map((section, si) => (

            <div key={section.title} className={cn("px-2 py-2", si > 0 && "border-l border-[#f0f0f0]")}>

              <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-[#999] font-semibold px-1">

                {section.title}

              </DropdownMenuLabel>

              {section.links.map((link) => (

                <DropdownMenuItem key={link.label} asChild className="px-1">

                  <Link to={link.to} className="cursor-pointer text-sm text-[#333] hover:text-[#0566CD]">

                    {link.label}

                  </Link>

                </DropdownMenuItem>

              ))}

            </div>

          ))}

        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="px-4 py-2.5 bg-[#f9fafb]">

          <Link to="/dashboard/client/billing" className="text-xs font-medium text-[#0566CD] hover:underline">

            View plans &amp; upgrade →

          </Link>

        </div>

      </DropdownMenuContent>

    </DropdownMenu>

  );

}



/** Legacy grid icon menu for admin/candidate portals */

export function NaukriMegaMenu({ portal }: NaukriMegaMenuProps) {

  const menu = MENUS[portal];



  return (

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 hidden lg:inline-flex" aria-label="Products menu">

          <LayoutGrid className="h-4 w-4 text-[#666]" />

        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0 border-[#e8e8e8]">

        <div className="grid grid-cols-2 gap-0 p-2">

          {menu.sections.map((section) => (

            <div key={section.title} className="px-2 py-2">

              <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-[#999] font-semibold">

                {section.title}

              </DropdownMenuLabel>

              {section.links.map((link) => (

                <DropdownMenuItem key={link.label} asChild>

                  <Link to={link.to} className="cursor-pointer text-sm text-[#333]">

                    {link.label}

                  </Link>

                </DropdownMenuItem>

              ))}

            </div>

          ))}

        </div>

      </DropdownMenuContent>

    </DropdownMenu>

  );

}


