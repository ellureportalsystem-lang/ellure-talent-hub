// Hook for fetching applicants/candidates
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  job_role?: string;
  skill?: string;
  key_skills?: string;
  current_company?: string;
  current_designation?: string;
  current_ctc?: string;
  expected_ctc?: string;
  total_experience?: string;
  total_experience_numbers?: string;
  notice_period?: string;
  status: string;
  created_at: string;
  is_old_applicant?: boolean;
  highest_qualification?: string;
  education_level?: string;
  city_current_location?: string;
  skill_job_role_applying_for?: string;
  total_experience_years?: number;
  profile_complete_percent?: number;
  is_verified?: boolean;
  verified?: boolean;
  is_actively_looking?: boolean;
  updated_at?: string;
}

export interface UseApplicantsOptions {
  searchQuery?: string;
  filters?: {
    experience?: [number, number];
    salary?: [number, number];
    cities?: string[];
    skills?: string[];
    education?: string[];
    noticePeriod?: string[];
    status?: string[];
  };
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  clientId?: string; // For client-specific access
}

export function useApplicants(options: UseApplicantsOptions = {}) {
  const {
    searchQuery = '',
    filters = {},
    sortField = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 15,
    clientId,
  } = options;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // For clients, we need to get applicant IDs they have access to first
      let accessibleApplicantIds: string[] | null = null;
      
      // Only check client access if clientId is provided and is a valid UUID
      if (clientId && typeof clientId === 'string' && clientId.length > 0) {
        try {
          // Get applicant IDs from client_applicant_access
          const { data: accessData, error: accessError } = await supabase
            .from('client_applicant_access')
            .select('applicant_id')
            .eq('client_id', clientId);

          if (accessError) {
            // If table doesn't exist or query fails, let RLS handle it
            console.warn('Could not fetch client access (RLS will handle):', accessError.message);
            accessibleApplicantIds = null; // Let RLS handle access control
          } else {
            accessibleApplicantIds = accessData?.map(item => item.applicant_id) || [];
          }
        } catch (err) {
          console.warn('Error checking client access:', err);
          // Continue with query - RLS will handle access
          accessibleApplicantIds = null;
        }
      }

      // Build query for applicants
      let query = supabase
        .from('applicants')
        .select('*', { count: 'exact' })
        .eq('is_deleted', false);

      // Apply client access filter
      if (clientId) {
        if (accessibleApplicantIds === null) {
          // Access check failed or table doesn't exist - let RLS handle it
          // Continue with query, RLS will filter results
        } else if (accessibleApplicantIds.length > 0) {
          query = query.in('id', accessibleApplicantIds);
        } else {
          // No access records - return empty result gracefully
          setApplicants([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
      }

      // Text search - use OR with proper field references
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        // Build OR condition for multiple fields
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,job_role.ilike.%${searchTerm}%,key_skills.ilike.%${searchTerm}%`
        );
      }

      // City filter
      if (filters.cities && filters.cities.length > 0) {
        query = query.in('city', filters.cities);
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      // Sort
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) {
        console.error('Error fetching applicants:', queryError);
        console.error('Query details:', {
          clientId,
          searchQuery,
          filters,
          sortField,
          sortOrder,
          page,
          pageSize,
          errorCode: queryError.code,
          errorMessage: queryError.message,
          errorDetails: queryError.details,
          errorHint: queryError.hint
        });
        
        // If it's a permission error (RLS blocking), return empty instead of throwing
        if (queryError.code === 'PGRST301' || 
            queryError.code === '42501' ||
            queryError.message?.includes('permission') || 
            queryError.message?.includes('policy') ||
            queryError.message?.includes('row-level security')) {
          console.warn('Access denied by RLS policy - returning empty results');
          console.warn('This might be because:');
          console.warn('1. User profile role is not set to "admin"');
          console.warn('2. RLS policies are blocking access');
          console.warn('3. is_admin_user() function is not working correctly');
          setApplicants([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
        
        // For other errors, still set loading to false and return empty
        setApplicants([]);
        setTotalCount(0);
        setLoading(false);
        setError(queryError instanceof Error ? queryError : new Error(queryError.message || 'Failed to fetch applicants'));
        return;
      }

      let applicantsData: Applicant[] = (data as Applicant[]) || [];

      // Apply additional filters in memory (experience, salary, skills, etc.)
      let filtered = applicantsData;

      if (filters.experience) {
        const [min, max] = filters.experience;
        filtered = filtered.filter(applicant => {
          const exp = parseFloat(applicant.total_experience_numbers || applicant.total_experience || '0');
          return exp >= min && exp <= max;
        });
      }

      if (filters.salary) {
        const [min, max] = filters.salary;
        filtered = filtered.filter(applicant => {
          const ctc = parseFloat(applicant.current_ctc || '0');
          return ctc >= min && ctc <= max;
        });
      }

      if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(applicant => {
          const skills = (applicant.key_skills || '').toLowerCase();
          return filters.skills!.some(skill => skills.includes(skill.toLowerCase()));
        });
      }

      if (filters.education && filters.education.length > 0) {
        filtered = filtered.filter(applicant => {
          const edu = applicant.highest_qualification || applicant.education_level || '';
          return filters.education!.includes(edu);
        });
      }

      if (filters.noticePeriod && filters.noticePeriod.length > 0) {
        filtered = filtered.filter(applicant => {
          return filters.noticePeriod!.includes(applicant.notice_period || '');
        });
      }

      setApplicants(filtered);
      setTotalCount(count || filtered.length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applicants'));
      console.error('Error fetching applicants:', err);
      setApplicants([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortField, sortOrder, page, pageSize, clientId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  return {
    applicants,
    loading,
    error,
    totalCount,
    refetch: fetchApplicants,
  };
}
