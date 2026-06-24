export type ApplicantMatchRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type MatchResult =
  | { status: 'matched'; applicant: ApplicantMatchRow }
  | { status: 'ambiguous'; reason: string; candidates: ApplicantMatchRow[] }
  | { status: 'none'; reason: string };

export type MatchMode = 'auto' | 'name' | 'email';

/** Lowercase, trim, collapse inner spaces, normalize separators */
export function normalizeToken(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[_]+/g, ' ')
    .replace(/[.]+/g, ' ')
    .replace(/\s+/g, ' ');
}

export function fileStem(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || filename;
  return base.replace(/\.[^.]+$/i, '').trim();
}

function firstName(name: string): string {
  const n = normalizeToken(name);
  const parts = n.split(' ').filter(Boolean);
  return parts[0] || '';
}

function stemLooksLikeEmail(stem: string): boolean {
  return stem.includes('@');
}

function normalizePhone(s: string): string {
  const digits = s.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function stemLooksLikePhone(stem: string): boolean {
  const digits = stem.replace(/\D/g, "");
  return digits.length === 10;
}

export function matchApplicantByFileName(
  filename: string,
  applicants: ApplicantMatchRow[],
  mode: MatchMode = 'auto'
): MatchResult {
  const stemRaw = fileStem(filename);
  if (!stemRaw) {
    return { status: 'none', reason: 'Empty file name' };
  }

  const stem = normalizeToken(stemRaw);

  if (mode !== 'name' && (mode === 'email' || (mode === 'auto' && stemLooksLikeEmail(stemRaw)))) {
    const emailKey = stemRaw.trim().toLowerCase();
    const hits = applicants.filter((a) => (a.email || '').trim().toLowerCase() === emailKey);
    if (hits.length === 1) return { status: 'matched', applicant: hits[0] };
    if (hits.length > 1) {
      return { status: 'ambiguous', reason: 'Multiple applicants share this email', candidates: hits };
    }
    const loose = applicants.filter(
      (a) => normalizeToken(a.email) === normalizeToken(stemRaw) || (a.email || '').toLowerCase() === emailKey
    );
    if (loose.length === 1) return { status: 'matched', applicant: loose[0] };
    if (mode === 'email') {
      return { status: 'none', reason: `No applicant with email "${stemRaw}"` };
    }
  }

  if (mode === 'email' && !stemLooksLikeEmail(stemRaw)) {
    return { status: 'none', reason: 'Email mode: file name must look like an email (include @ before the extension)' };
  }

  const byFullName = applicants.filter((a) => normalizeToken(a.name) === stem);
  if (byFullName.length === 1) return { status: 'matched', applicant: byFullName[0] };
  if (byFullName.length > 1) {
    return { status: 'ambiguous', reason: 'Multiple applicants with the same full name', candidates: byFullName };
  }

  if (mode === 'name') {
    return { status: 'none', reason: `No applicant with full name matching "${stemRaw}"` };
  }

  const byEmailLocal = applicants.filter((a) => {
    const local = (a.email || '').split('@')[0]?.trim().toLowerCase() || '';
    return local && (local === stem || stem === normalizeToken(local));
  });
  if (byEmailLocal.length === 1) return { status: 'matched', applicant: byEmailLocal[0] };
  if (byEmailLocal.length > 1) {
    return { status: 'ambiguous', reason: 'Multiple applicants share the same email local-part', candidates: byEmailLocal };
  }

  if (mode === 'auto' && stemLooksLikePhone(stemRaw)) {
    const phoneKey = normalizePhone(stemRaw);
    const byPhone = applicants.filter((a) => normalizePhone(a.phone || '') === phoneKey);
    if (byPhone.length === 1) return { status: 'matched', applicant: byPhone[0] };
    if (byPhone.length > 1) {
      return { status: 'ambiguous', reason: 'Multiple applicants share this phone number', candidates: byPhone };
    }
  }

  const first = stem.split(' ')[0];
  if (first.length >= 2) {
    const byFirst = applicants.filter((a) => firstName(a.name) === first);
    if (byFirst.length === 1) return { status: 'matched', applicant: byFirst[0] };
    if (byFirst.length > 1) {
      return {
        status: 'ambiguous',
        reason: `Several applicants share the first name "${first}" — use full name or email in the file name`,
        candidates: byFirst,
      };
    }
  }

  const partial = applicants.filter((a) => {
    const nn = normalizeToken(a.name);
    return nn.startsWith(stem) || stem.startsWith(nn);
  });
  if (partial.length === 1) return { status: 'matched', applicant: partial[0] };
  if (partial.length > 1) {
    return { status: 'ambiguous', reason: 'Multiple partial name matches', candidates: partial };
  }

  return { status: 'none', reason: `No applicant matched "${stemRaw}"` };
}
