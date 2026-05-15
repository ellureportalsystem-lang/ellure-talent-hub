// Hook for fetching dashboard statistics
import { useState, useEffect } from 'react';
import {
  getAdminDashboardStats,
  getRegistrationTrend,
  getSkillDistribution,
  getExperienceDistribution,
  getEducationDistribution,
  getRecentActivity,
  DashboardStats,
  RegistrationTrend,
  SkillDistribution,
  ExperienceDistribution,
  EducationDistribution,
  RecentActivity,
} from '@/services/dashboardService';

export function useAdminDashboardStats(dateRange: '7days' | '30days' | 'quarter' | 'ytd' = '7days') {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminDashboardStats(dateRange);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [dateRange]);

  return { stats, loading, error };
}

export function useRegistrationTrend(dateRange: '7days' | '30days' = '7days') {
  const [data, setData] = useState<RegistrationTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrend() {
      try {
        setLoading(true);
        const trendData = await getRegistrationTrend(dateRange);
        setData(trendData);
      } catch (err) {
        console.error('Error fetching registration trend:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrend();
  }, [dateRange]);

  return { data, loading };
}

export function useSkillDistribution(limit: number = 6) {
  const [data, setData] = useState<SkillDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        setLoading(true);
        const distribution = await getSkillDistribution(limit);
        setData(distribution);
      } catch (err) {
        console.error('Error fetching skill distribution:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDistribution();
  }, [limit]);

  return { data, loading };
}

export function useExperienceDistribution() {
  const [data, setData] = useState<ExperienceDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        setLoading(true);
        const distribution = await getExperienceDistribution();
        setData(distribution);
      } catch (err) {
        console.error('Error fetching experience distribution:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDistribution();
  }, []);

  return { data, loading };
}

export function useEducationDistribution() {
  const [data, setData] = useState<EducationDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        setLoading(true);
        const distribution = await getEducationDistribution();
        setData(distribution);
      } catch (err) {
        console.error('Error fetching education distribution:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDistribution();
  }, []);

  return { data, loading };
}

export function useRecentActivity(limit: number = 10) {
  const [data, setData] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const activity = await getRecentActivity(limit);
        setData(activity);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [limit]);

  return { data, loading };
}
