/**
 * Import Ellure_NexHire_MasterDataset.xlsx (MASTER_DATA sheet) into Supabase.
 * Run: node scripts/importMasterDataset.js
 */
import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)="?(.+?)"?$/);
      if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

const env = parseEnvFile(join(root, '.env'));
const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const NOTICE_MAP = {
  immediate: { label: 'Immediate', days: 0 },
  '15 days': { label: '15 Days', days: 15 },
  '30 days': { label: '30 Days', days: 30 },
  '45 days': { label: '45 Days', days: 45 },
  '60 days': { label: '60 Days', days: 60 },
  '90 days': { label: '90 Days', days: 90 },
};

function str(v) {
  if (v == null) return '';
  return String(v).trim();
}

function extractDbKey(headerCell) {
  const m = String(headerCell || '').match(/\(([^)]+)\)/);
  return m ? m[1].trim() : '';
}

function loadMasterRows() {
  const wb = readFile(join(root, 'Ellure_NexHire_MasterDataset.xlsx'));
  const sheet = wb.Sheets['MASTER_DATA'] || wb.Sheets[wb.SheetNames[0]];
  const matrix = utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (matrix.length < 3) return [];

  const headers = matrix[1].map(extractDbKey);
  const rows = [];
  for (let i = 2; i < matrix.length; i++) {
    const line = matrix[i];
    if (!line.some((c) => str(c))) continue;
    const raw = {};
    headers.forEach((key, idx) => {
      if (key) raw[key] = line[idx];
    });
    rows.push(raw);
  }
  return rows;
}

function col(raw, ...keys) {
  for (const k of keys) {
    if (raw[k] != null && str(raw[k])) return str(raw[k]);
  }
  return '';
}

function parseExperienceYears(raw) {
  const t = String(raw || '').toLowerCase().trim();
  if (!t || /fresher/i.test(t)) return 0;
  if (/month/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    if (!m) return null;
    const months = parseFloat(m[1]);
    if (months > 480) return null;
    return Math.round((months / 12) * 10) / 10;
  }
  const m = t.match(/([\d.]+)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return n > 40 ? null : n;
}

function parseCtc(raw) {
  const t = String(raw || '').toLowerCase().trim();
  if (!t) return '';
  if (/lpa/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    return m ? `${m[1]} LPA` : raw;
  }
  if (/k\b/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    if (!m) return raw;
    const n = Math.round((parseFloat(m[1]) * 12000) / 100000 * 100) / 100;
    return `${n} LPA`;
  }
  return raw;
}

function normalizeNotice(raw) {
  const key = String(raw || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!key || /fresher/i.test(key)) return NOTICE_MAP.immediate;
  if (/serving|negotiable/i.test(key)) return NOTICE_MAP['30 days'];
  if (/15/.test(key)) return NOTICE_MAP['15 days'];
  if (/45/.test(key)) return NOTICE_MAP['45 days'];
  if (/90|3\s*month/.test(key)) return NOTICE_MAP['90 days'];
  if (/60|2\s*month/.test(key)) return NOTICE_MAP['60 days'];
  return NOTICE_MAP['30 days'];
}

function normalizeExperienceType(raw, years) {
  const t = String(raw || '').trim();
  const lower = t.toLowerCase();
  const allowed = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Expert', 'fresher', 'experienced'];
  const match = allowed.find((a) => a.toLowerCase() === lower);
  if (match) return match === 'fresher' ? 'Fresher' : match;
  if (years === 0) return 'Fresher';
  return t || 'experienced';
}

function normalizeEducation(raw) {
  const t = String(raw || '').toLowerCase();
  if (!t) return 'Graduate';
  if (/ph\.?d|doctorate/.test(t)) return 'Doctorate';
  if (/m\.?tech|mba|mca|masters|post.?grad|pgd/.test(t)) return 'Post Graduate';
  if (/diploma/.test(t)) return 'Diploma';
  if (/12th|xii|hsc/.test(t)) return '12th';
  if (/10th|ssc/.test(t)) return '10th';
  return 'Graduate';
}

function mapRow(raw) {
  const email = col(raw, 'email').toLowerCase();
  const expRaw = col(raw, 'total_experience_years', 'experience_raw_original');
  const expNum = typeof raw.total_experience_years === 'number'
    ? raw.total_experience_years
    : parseExperienceYears(expRaw);
  const notice = normalizeNotice(col(raw, 'notice_period', 'notice_period_raw_original'));
  const eduRaw = col(raw, 'education_level', 'highest_qualification');
  const yearRaw = col(raw, 'year_of_passing');

  return {
    name: col(raw, 'name'),
    email,
    phone: col(raw, 'phone'),
    city: col(raw, 'city'),
    job_role: col(raw, 'job_role'),
    current_designation: col(raw, 'current_designation'),
    current_company: col(raw, 'current_company'),
    total_experience_years: expNum,
    experience_type: normalizeExperienceType(col(raw, 'experience_type'), expNum ?? 0),
    current_ctc: parseCtc(col(raw, 'current_ctc', 'current_ctc_raw_original')),
    expected_ctc: parseCtc(col(raw, 'expected_ctc')),
    notice_period: notice.label,
    education_level: normalizeEducation(eduRaw),
    highest_qualification: col(raw, 'highest_qualification') || eduRaw,
    course_degree_name: col(raw, 'course_degree_name'),
    university: col(raw, 'university_institute_name'),
    passing_year: yearRaw ? parseInt(yearRaw, 10) : null,
    education_board: col(raw, 'education_board'),
    medium: col(raw, 'medium_of_study'),
    key_skills: col(raw, 'key_skills'),
    communication: col(raw, 'communication'),
    registration_date: excelDateToIso(raw.registration_date),
  };
}

function excelDateToIso(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const d = utils.SSF?.parse_date_code?.(v);
    if (d) return new Date(d.y, d.m - 1, d.d).toISOString();
    const ms = (v - 25569) * 86400 * 1000;
    return new Date(ms).toISOString();
  }
  const parsed = new Date(String(v));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

async function findUserIdByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return user?.id ?? null;
}

async function processRow(row, stats) {
  const emailMatch = String(row.email || '').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';
  if (!email) {
    stats.failed++;
    console.log('❌ skip: missing email');
    return;
  }

  try {
    let userId = await findUserIdByEmail(email);
    let authCreated = false;

    if (!userId) {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email,
        password: 'applicant@123',
        email_confirm: true,
        user_metadata: { full_name: row.name, role: 'applicant' },
      });
      if (authErr) {
        if (authErr.message?.includes('already')) {
          userId = await findUserIdByEmail(email);
        } else {
          throw authErr;
        }
      } else {
        userId = authData.user.id;
        authCreated = true;
      }
    }

    const applicantPayload = {
      name: row.name,
      email,
      phone: row.phone,
      city: row.city,
      city_current_location: row.city,
      job_role: row.job_role || null,
      skill_job_role_applying_for: row.job_role || null,
      current_designation: row.current_designation || null,
      current_company: row.current_company || null,
      total_experience_years: row.total_experience_years,
      experience_type: row.experience_type,
      current_ctc: row.current_ctc || null,
      expected_ctc: row.expected_ctc || null,
      notice_period: row.notice_period,
      education_level: row.education_level,
      highest_qualification: row.highest_qualification,
      course_degree_name: row.course_degree_name || null,
      university: row.university || null,
      university_institute_name: row.university || null,
      passing_year: row.passing_year,
      education_board: row.education_board || null,
      medium: row.medium || null,
      medium_of_study: row.medium || null,
      key_skills: row.key_skills || null,
      communication: row.communication || null,
      is_old_applicant: true,
      status: 'submitted',
      profile_visibility: 'clients_only',
      is_actively_looking: true,
      is_deleted: false,
      user_id: userId,
      registration_date: row.registration_date ? new Date(row.registration_date).toISOString() : new Date().toISOString(),
    };

    const { data: existing } = await supabase.from('applicants').select('id').eq('email', email).maybeSingle();

    let applicantId;
    if (existing?.id) {
      const { data: updated, error: upErr } = await supabase
        .from('applicants')
        .update({ ...applicantPayload, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select('id')
        .single();
      if (upErr) throw upErr;
      applicantId = updated.id;
      stats.updated++;
      console.log(`🔄 Updated: ${email}`);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('applicants')
        .insert(applicantPayload)
        .select('id')
        .single();
      if (insErr) throw insErr;
      applicantId = inserted.id;
      stats.inserted++;
      console.log(`✅ Inserted: ${email}${authCreated ? ' (+auth)' : ''}`);
    }

    if (userId) {
      await supabase.from('profiles').upsert(
        {
          id: userId,
          email,
          full_name: row.name,
          display_name: row.name,
          phone: row.phone,
          role: 'applicant',
          applicant_id: applicantId,
          is_old_applicant: true,
          key_skills: row.key_skills || null,
          location: row.city,
        },
        { onConflict: 'id' }
      );
    }

    await supabase.rpc('refresh_applicant_search_index', { p_applicant_id: applicantId });
    await supabase.rpc('calculate_profile_completion', { applicant_uuid: applicantId });

    stats.processed++;
  } catch (err) {
    stats.failed++;
    console.log(`❌ Failed ${email}: ${err.message}`);
  }
}

async function main() {
  const rawRows = loadMasterRows();
  const rows = rawRows.map(mapRow).filter((r) => r.email);

  const seen = new Set();
  const unique = [];
  for (const r of rows) {
    if (seen.has(r.email)) continue;
    seen.add(r.email);
    unique.push(r);
  }

  console.log(`\n📊 Importing ${unique.length} unique rows from master dataset...\n`);

  const stats = { processed: 0, inserted: 0, updated: 0, failed: 0 };
  for (const row of unique) {
    await processRow(row, stats);
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Total processed: ${stats.processed}`);
  console.log(`Inserted:        ${stats.inserted}`);
  console.log(`Updated:         ${stats.updated}`);
  console.log(`Failed:          ${stats.failed}`);
  console.log('=============================\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
