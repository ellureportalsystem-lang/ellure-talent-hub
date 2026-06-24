import type { ReactNode } from "react";

import { candidatePrimaryNav } from "@/components/dashboard/naukri/naukriShellStyles";

import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";

import { NaukriTopNavShell } from "@/components/dashboard/naukri/NaukriTopNavShell";

import { ApplicantMobileBottomNav } from "@/components/dashboard/applicant/ApplicantMobileBottomNav";



type ApplicantNaukriShellProps = {

  settingsPath: string;

  onLogout: () => void | Promise<void>;

  displayName: string;

  email?: string;

  initials: string;

  children: ReactNode;

  headerBadge?: ReactNode;

};



/** Naukri-inspired candidate / jobseeker dashboard shell */

export function ApplicantNaukriShell({

  settingsPath,

  onLogout,

  displayName,

  email,

  initials,

  children,

  headerBadge,

}: ApplicantNaukriShellProps) {

  return (

    <NaukriTopNavShell

      portalLabel="Candidate"

      primaryNav={candidatePrimaryNav}

      settingsPath={settingsPath}

      onLogout={onLogout}

      displayName={displayName}

      email={email}

      initials={initials}

      globalSearchPath="/dashboard/applicant/jobs"

      globalSearchPlaceholder="Search jobs"

      headerBadge={headerBadge}

      megaMenuPortal="candidate"

      savedJobsPath="/dashboard/applicant/saved-jobs"

      hideRecentButton

    >

      <NaukriPageContainer className="pb-20 lg:pb-6">{children}</NaukriPageContainer>

      <ApplicantMobileBottomNav />

    </NaukriTopNavShell>

  );

}

