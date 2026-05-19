// Dashboard Data Service
// Provides functions to fetch dashboard statistics and analytics

import { supabase } from '@/lib/supabase';
import { fetchClientRecord, resolveCvDownloadLimit } from '@/services/clientPlanHelper';

export interface DashboardStats {
  totalApplicants: number;
  newToday: number;
  newThisWeek: number;
  shortlisted: number;
  activeClients: number;
  totalFolders: number;
  importedApplicants: number;
  jobsPosted: number;
  resumesDownloaded: number;
  cvDownloadsThisMonth: number;
  pendingApprovals: number;
  verifiedProfiles: number;
  applicationsThisMonth: number;
}

export interface CityDistribution {
  city: string;
  count: number;
}

export interface PendingClient {
  id: string;
  company_name: string;
  contact_email: string | null;
  created_at: string;
}

export interface ClientHomeStats {
  cvDownloadsRemaining: number;
  cvDownloadsUsed: number;
  cvDownloadsLimit: number;
  activeJobs: number;
  shortlistedCandidates: number;
  teamMembers: number;
  daysUntilRenewal: number | null;
  subscriptionEndDate: string | null;
  subscriptionStatus: string | null;
}

export interface RegistrationTrend {
  date: string;
  applicants: number;
}

export interface SkillDistribution {
  name: string;
  value: number;
  color?: string;
}

export interface ExperienceDistribution {
  range: string;
  count: number;
}

export interface EducationDistribution {
  level: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  name: string;
  time: string;
  type: 'new' | 'client' | 'import' | 'shortlist' | 'download' | 'job';
}

/**
 * Fetch dashboard statistics for Admin
 */
export async function getAdminDashboardStats(dateRange: '7days' | '30days' | 'quarter' | 'ytd' = '7days'): Promise<DashboardStats> {
  try {
    // Calculate date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let startDate: Date;
    switch (dateRange) {
      case '7days':
        startDate = weekAgo;
        break;
      case '30days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = weekAgo;
    }

    // Total applicants (not deleted)
    const { count: totalApplicants } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    // New today
    const { count: newToday } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .gte('created_at', today.toISOString());

    // New this week
    const { count: newThisWeek } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .gte('created_at', weekAgo.toISOString());

    // Shortlisted (from shortlist_items)
    const { count: shortlisted } = await supabase
      .from('shortlist_items')
      .select('*', { count: 'exact', head: true });

    // Active clients
    const { count: activeClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Total folders (shortlists)
    const { count: totalFolders } = await supabase
      .from('shortlists')
      .select('*', { count: 'exact', head: true });

    // Imported applicants (old applicants)
    const { count: importedApplicants } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .not('date', 'is', null); // Has legacy date field

    // Jobs posted
    // Skip if jobs table or status column doesn't exist
    let jobsPosted = 0;
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id')
        .eq('status', 'active');
      
      if (error) {
        // If column doesn't exist, skip this stat
        if (error.code === '42703' || error.message?.includes('does not exist')) {
          console.debug('Jobs table or status column does not exist, skipping jobs count');
        } else {
          console.warn('Error fetching jobs count:', error);
        }
        jobsPosted = 0;
      } else {
        jobsPosted = data?.length || 0;
      }
    } catch (error: any) {
      if (error?.code === '42703' || error?.message?.includes('does not exist')) {
        console.debug('Jobs table or status column does not exist, skipping jobs count');
      } else {
        console.warn('Exception fetching jobs count:', error);
      }
      jobsPosted = 0;
    }

    // Resumes downloaded (from applicant_files where file_type is resume)
    // Skip if applicant_files table or file_type column doesn't exist
    let resumesDownloaded = 0;
    try {
      const { data, error } = await supabase
        .from('applicant_files')
        .select('id')
        .eq('file_type', 'resume');
      
      if (error) {
        // If column doesn't exist, skip this stat
        if (error.code === '42703' || error.message?.includes('does not exist')) {
          console.debug('Applicant_files table or file_type column does not exist, skipping resumes count');
        } else {
          console.warn('Error fetching resumes count:', error);
        }
        resumesDownloaded = 0;
      } else {
        resumesDownloaded = data?.length || 0;
      }
    } catch (error: any) {
      if (error?.code === '42703' || error?.message?.includes('does not exist')) {
        console.debug('Applicant_files table or file_type column does not exist, skipping resumes count');
      } else {
        console.warn('Exception fetching resumes count:', error);
      }
      resumesDownloaded = 0;
    }

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    let cvDownloadsThisMonth = 0;
    try {
      const { count } = await supabase
        .from('cv_download_log')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart);
      cvDownloadsThisMonth = count || 0;
    } catch {
      cvDownloadsThisMonth = 0;
    }

    const { count: pendingApprovals } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false);

    const { count: verifiedByFlag } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .eq('is_verified', true);

    const { count: verifiedLegacy } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .eq('verified', true);

    const verifiedProfiles = Math.max(verifiedByFlag || 0, verifiedLegacy || 0);

    let applicationsThisMonth = 0;
    try {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .gte('applied_at', monthStart);
      applicationsThisMonth = count || 0;
    } catch {
      applicationsThisMonth = 0;
    }

    return {
      totalApplicants: totalApplicants || 0,
      newToday: newToday || 0,
      newThisWeek: newThisWeek || 0,
      shortlisted: shortlisted || 0,
      activeClients: activeClients || 0,
      totalFolders: totalFolders || 0,
      importedApplicants: importedApplicants || 0,
      jobsPosted: jobsPosted || 0,
      resumesDownloaded: resumesDownloaded || 0,
      cvDownloadsThisMonth,
      pendingApprovals: pendingApprovals || 0,
      verifiedProfiles: verifiedProfiles || 0,
      applicationsThisMonth,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

/**
 * Fetch registration trend data for charts
 */
export async function getRegistrationTrend(dateRange: '7days' | '30days' = '7days'): Promise<RegistrationTrend[]> {
  try {
    const days = dateRange === '7days' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch applicants grouped by date
    const { data, error } = await supabase
      .from('applicants')
      .select('created_at')
      .eq('is_deleted', false)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const grouped: Record<string, number> = {};
    data?.forEach(applicant => {
      const date = new Date(applicant.created_at);
      const dateKey = date.toISOString().split('T')[0];
      grouped[dateKey] = (grouped[dateKey] || 0) + 1;
    });

    // Fill in missing dates with 0
    const result: RegistrationTrend[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      result.push({
        date: dayName,
        applicants: grouped[dateKey] || 0,
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching registration trend:', error);
    return [];
  }
}

/**
 * Fetch skill distribution for pie chart
 */
export async function getSkillDistribution(limit: number = 6): Promise<SkillDistribution[]> {
  try {
    // Fetch applicants with key_skills
    const { data, error } = await supabase
      .from('applicants')
      .select('key_skills')
      .eq('is_deleted', false)
      .not('key_skills', 'is', null);

    if (error) throw error;

    // Parse and count skills
    const skillCounts: Record<string, number> = {};
    data?.forEach(applicant => {
      if (applicant.key_skills) {
        // Handle comma-separated or other formats
        const skills = applicant.key_skills
          .toString()
          .split(/[,;|]/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    // Also check normalized applicant_skills table
    const { data: normalizedSkills } = await supabase
      .from('applicant_skills')
      .select('skill_name');

    normalizedSkills?.forEach(skill => {
      if (skill.skill_name) {
        skillCounts[skill.skill_name] = (skillCounts[skill.skill_name] || 0) + 1;
      }
    });

    // Convert to array and sort
    const sorted = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit - 1); // Keep one slot for "Others"

    // Calculate "Others"
    const topSkillsTotal = sorted.reduce((sum, [, count]) => sum + count, 0);
    const allSkillsTotal = Object.values(skillCounts).reduce((sum, count) => sum + count, 0);
    const othersCount = allSkillsTotal - topSkillsTotal;

    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--warning))',
      'hsl(var(--success))',
      'hsl(var(--info))',
      'hsl(var(--muted-foreground))',
    ];

    const result: SkillDistribution[] = sorted.map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));

    if (othersCount > 0) {
      result.push({
        name: 'Others',
        value: othersCount,
        color: colors[colors.length - 1],
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching skill distribution:', error);
    return [];
  }
}

/**
 * Fetch experience distribution
 */
export async function getExperienceDistribution(): Promise<ExperienceDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('total_experience_years, total_experience_numbers, total_experience')
      .eq('is_deleted', false);

    if (error) throw error;

    const ranges = {
      'Fresher': 0,
      '1-3 yrs': 0,
      '3-5 yrs': 0,
      '5-8 yrs': 0,
      '8+ yrs': 0,
    };

    data?.forEach(applicant => {
      let exp = applicant.total_experience_years != null
        ? Number(applicant.total_experience_years)
        : NaN;

      if (isNaN(exp) && applicant.total_experience_numbers) {
        exp = parseFloat(applicant.total_experience_numbers.toString());
      }
      if (isNaN(exp) && applicant.total_experience) {
        const match = applicant.total_experience.toString().match(/(\d+\.?\d*)/);
        if (match) exp = parseFloat(match[1]);
      }
      if (isNaN(exp)) exp = 0;

      if (exp === 0) ranges['Fresher']++;
      else if (exp < 3) ranges['1-3 yrs']++;
      else if (exp < 5) ranges['3-5 yrs']++;
      else if (exp < 8) ranges['5-8 yrs']++;
      else ranges['8+ yrs']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));
  } catch (error) {
    console.error('Error fetching experience distribution:', error);
    return [];
  }
}

/**
 * Fetch education distribution
 */
export async function getEducationDistribution(): Promise<EducationDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('highest_qualification, education_level')
      .eq('is_deleted', false);

    if (error) throw error;

    const counts: Record<string, number> = {};

    data?.forEach(applicant => {
      const level = applicant.highest_qualification || applicant.education_level || 'Others';
      counts[level] = (counts[level] || 0) + 1;
    });

    // Sort by count and return top 5
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([level, count]) => ({
        level,
        count,
      }));
  } catch (error) {
    console.error('Error fetching education distribution:', error);
    return [];
  }
}

/**
 * Fetch recent activity
 */
export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  try {
    // Fetch recent applicants
    const { data: recentApplicants, error: applicantsError } = await supabase
      .from('applicants')
      .select('id, name, created_at, is_old_applicant')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (applicantsError) throw applicantsError;

    const activities: RecentActivity[] = recentApplicants?.map((applicant, index) => ({
      id: applicant.id,
      action: applicant.is_old_applicant ? 'Applicant imported' : 'New applicant registered',
      name: applicant.name || 'Unknown',
      time: formatTimeAgo(new Date(applicant.created_at)),
      type: applicant.is_old_applicant ? 'import' : 'new',
    })) || [];

    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

/**
 * Format time ago string
 */
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  return date.toLocaleDateString();
}

/**
 * Fetch client dashboard stats
 */
export async function getClientDashboardStats(clientId?: string): Promise<{
  totalCandidates: number;
  shortlisted: number;
  favorites: number;
  availableCandidates: number;
}> {
  try {
    // If clientId provided, only count candidates they have access to
    let query = supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    if (clientId) {
      // Use client_applicant_access table
      query = supabase
        .from('client_applicant_access')
        .select('applicant_id', { count: 'exact', head: true })
        .eq('client_id', clientId);
    }

    const { count: totalCandidates } = await query;

    // Shortlisted (from shortlist_items where client has access)
    const { count: shortlisted } = await supabase
      .from('shortlist_items')
      .select('*', { count: 'exact', head: true });

    // For now, favorites and available are same as total
    // TODO: Implement favorites when that feature is added

    return {
      totalCandidates: totalCandidates || 0,
      shortlisted: shortlisted || 0,
      favorites: 0, // TODO: Implement favorites
      availableCandidates: totalCandidates || 0,
    };
  } catch (error) {
    console.error('Error fetching client dashboard stats:', error);
    return {
      totalCandidates: 0,
      shortlisted: 0,
      favorites: 0,
      availableCandidates: 0,
    };
  }
}

/** Registration trend from profiles.created_at (last 30 days) */
export async function getProfileRegistrationTrend(days = 30): Promise<RegistrationTrend[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const grouped: Record<string, number> = {};
    data?.forEach((row) => {
      const dateKey = new Date(row.created_at).toISOString().split('T')[0];
      grouped[dateKey] = (grouped[dateKey] || 0) + 1;
    });

    const result: RegistrationTrend[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applicants: grouped[dateKey] || 0,
      });
    }
    return result;
  } catch (error) {
    console.error('Error fetching profile registration trend:', error);
    return [];
  }
}

/** Top skills from applicant_search_index */
export async function getTopSkillsFromSearchIndex(limit = 10): Promise<SkillDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('applicant_search_index')
      .select('key_skills')
      .not('key_skills', 'is', null);

    if (error) throw error;

    const skillCounts: Record<string, number> = {};
    data?.forEach((row) => {
      const raw = row.key_skills;
      const skills: string[] = Array.isArray(raw)
        ? raw.map(String)
        : String(raw || '')
            .split(/[,;|]/)
            .map((s) => s.trim())
            .filter(Boolean);
      skills.forEach((skill) => {
        const key = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
        if (key) skillCounts[key] = (skillCounts[key] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error('Error fetching search index skills:', error);
    return getSkillDistribution(limit);
  }
}

export async function getCityDistribution(limit = 10): Promise<CityDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('applicant_search_index')
      .select('location_city')
      .not('location_city', 'is', null);

    if (error) throw error;

    const counts: Record<string, number> = {};
    data?.forEach((row) => {
      const city = String(row.location_city || '').trim();
      if (city) counts[city] = (counts[city] || 0) + 1;
    });

    if (Object.keys(counts).length === 0) {
      const { data: applicants } = await supabase
        .from('applicants')
        .select('city')
        .eq('is_deleted', false)
        .not('city', 'is', null);
      applicants?.forEach((a) => {
        const city = String(a.city || '').trim();
        if (city) counts[city] = (counts[city] || 0) + 1;
      });
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([city, count]) => ({ city, count }));
  } catch (error) {
    console.error('Error fetching city distribution:', error);
    return [];
  }
}

export async function getPendingClients(limit = 10): Promise<PendingClient[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, contact_email, created_at')
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as PendingClient[];
  } catch (error) {
    console.error('Error fetching pending clients:', error);
    return [];
  }
}

export async function approveClient(clientId: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .update({
      is_active: true,
      approved_at: new Date().toISOString(),
      subscription_status: 'trial',
    })
    .eq('id', clientId);
  if (error) throw new Error(error.message);
}

export async function getClientHomeStats(clientId: string): Promise<ClientHomeStats> {
  try {
    const client = await fetchClientRecord(clientId);
    const plan = client.subscription_plans;
    const cvLimit = resolveCvDownloadLimit(client, plan);
    const cvUsed = (client.cv_downloads_used_this_month as number) ?? 0;

    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'active');

    const { data: shortlists } = await supabase
      .from('shortlists')
      .select('id')
      .eq('client_id', clientId);
    const shortlistIds = (shortlists || []).map((s) => s.id);
    let shortlistedCandidates = 0;
    if (shortlistIds.length) {
      const { count } = await supabase
        .from('shortlist_items')
        .select('*', { count: 'exact', head: true })
        .in('shortlist_id', shortlistIds);
      shortlistedCandidates = count || 0;
    }

    const { count: teamMembers } = await supabase
      .from('client_team_members')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .neq('status', 'inactive');

    const endRaw = (client as { subscription_end_date?: string })?.subscription_end_date;
    let daysUntilRenewal: number | null = null;
    if (endRaw) {
      const end = new Date(endRaw);
      daysUntilRenewal = Math.ceil((end.getTime() - Date.now()) / 86400000);
    }

    return {
      cvDownloadsRemaining: Math.max(0, cvLimit - cvUsed),
      cvDownloadsUsed: cvUsed,
      cvDownloadsLimit: cvLimit,
      activeJobs: activeJobs || 0,
      shortlistedCandidates,
      teamMembers: teamMembers || 0,
      daysUntilRenewal,
      subscriptionEndDate: endRaw || null,
      subscriptionStatus: (client as { subscription_status?: string })?.subscription_status || null,
    };
  } catch (error) {
    console.error('Error fetching client home stats:', error);
    return {
      cvDownloadsRemaining: 0,
      cvDownloadsUsed: 0,
      cvDownloadsLimit: 0,
      activeJobs: 0,
      shortlistedCandidates: 0,
      teamMembers: 0,
      daysUntilRenewal: null,
      subscriptionEndDate: null,
      subscriptionStatus: null,
    };
  }
}

export async function getClientRecentProfileViews(clientId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('profile_views')
      .select('*, applicants(id, name, key_skills, total_experience_years, city)')
      .eq('client_id', clientId)
      .order('viewed_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function getClientTopJobs(clientId: string, limit = 3) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, status, applications_count')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchFilterCities(): Promise<string[]> {
  const { data: indexCities } = await supabase
    .from('applicant_search_index')
    .select('location_city')
    .not('location_city', 'is', null)
    .neq('location_city', '');

  if (indexCities && indexCities.length > 0) {
    const unique = [...new Set(indexCities.map((r) => r.location_city).filter(Boolean))].sort();
    return unique as string[];
  }

  const { data: appCities } = await supabase
    .from('applicants')
    .select('city')
    .not('city', 'is', null)
    .eq('is_deleted', false);

  return [...new Set(appCities?.map((r) => r.city).filter(Boolean) ?? [])].sort() as string[];
}

export async function fetchFilterSkills(): Promise<string[]> {
  const { data } = await supabase
    .from('applicants')
    .select('key_skills')
    .not('key_skills', 'is', null)
    .neq('key_skills', '')
    .eq('is_deleted', false);

  const skills = new Set<string>();
  data?.forEach((r) => {
    r.key_skills?.split(',').forEach((s: string) => {
      const clean = s.trim();
      if (clean.length > 1 && clean.length < 50) skills.add(clean);
    });
  });
  return [...skills].sort();
}

export async function fetchFilterCompanies(): Promise<string[]> {
  const { data } = await supabase
    .from('applicants')
    .select('current_company')
    .not('current_company', 'is', null)
    .neq('current_company', '')
    .eq('is_deleted', false);
  return [...new Set(data?.map((r) => r.current_company).filter(Boolean) ?? [])].sort() as string[];
}

export async function fetchFilterJobRoles(): Promise<string[]> {
  const { data } = await supabase
    .from('applicants')
    .select('job_role')
    .not('job_role', 'is', null)
    .neq('job_role', '')
    .eq('is_deleted', false);
  return [...new Set(data?.map((r) => r.job_role).filter(Boolean) ?? [])].sort() as string[];
}
