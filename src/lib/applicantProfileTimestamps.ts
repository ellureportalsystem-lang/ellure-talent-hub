export type ApplicantTimestampFields = {
  last_profile_updated_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

/** Best available "last updated" timestamp for an applicant row. */
export function getApplicantLastUpdated(
  row: ApplicantTimestampFields | null | undefined
): string | null {
  if (!row) return null;
  return row.last_profile_updated_at ?? row.updated_at ?? row.created_at ?? null;
}

/** Fields to set on `applicants` when the profile is edited. */
export function applicantProfileTouchFields(at?: string): {
  updated_at: string;
  last_profile_updated_at: string;
} {
  const ts = at ?? new Date().toISOString();
  return { updated_at: ts, last_profile_updated_at: ts };
}
