// Dashboard Data Service
// Provides functions to fetch dashboard statistics and analytics

import { supabase } from '@/lib/supabase';

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
      .select('total_experience, total_experience_numbers')
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
      let exp = 0;
      
      // Try to parse total_experience_numbers first
      if (applicant.total_experience_numbers) {
        const num = parseFloat(applicant.total_experience_numbers.toString());
        if (!isNaN(num)) {
          exp = num;
        }
      } else if (applicant.total_experience) {
        // Try to extract number from text
        const match = applicant.total_experience.toString().match(/(\d+\.?\d*)/);
        if (match) {
          exp = parseFloat(match[1]);
        }
      }

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
