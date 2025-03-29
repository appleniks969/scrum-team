import useSWR from 'swr';
import { CompletionStats, MemberCompletionStats } from './useJiraData';
import { GitMetrics, TeamGitMetrics } from './useGitData';
import fetcher from '../utils/swrFetcher';

// Types for integrated metrics
export interface IntegratedTeamMetrics {
  teamId: string;
  teamName: string;
  jiraMetrics: CompletionStats;
  gitMetrics: TeamGitMetrics;
  correlations: {
    storyPointToCommitRatio: number;
    planningAccuracy: number;
    velocity: number;
    consistency: number;
  };
  date: string;
}

export interface IntegratedMemberMetrics {
  accountId: string;
  displayName: string;
  teamId: string;
  teamName: string;
  jiraMetrics: MemberCompletionStats;
  gitMetrics: GitMetrics;
  correlations: {
    storyPointToCommitRatio: number;
    reviewQuality: number;
    contribution: number;
    velocityIndex: number;
  };
  date: string;
}

export interface CorrelationInsight {
  id: string;
  type: 'team' | 'member' | 'organization';
  targetId: string;
  targetName: string;
  insightText: string;
  metricName: string;
  metricValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  severity: 'info' | 'warning' | 'critical' | 'positive';
  date: string;
}

export interface OverviewMetrics {
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  totalCommits: number;
  totalPRs: number;
  totalReviews: number;
  avgPrTimeToMerge: number;
  activeTeams: number;
  activeMembers: number;
  teamMetricsSummary: TeamMetricsSummary[];
  date: string;
}

export interface TeamMetricsSummary {
  teamId: string;
  teamName: string;
  storyPoints: number;
  commits: number;
  prs: number;
  completionPercentage: number;
}

// Helper function to build URL with query parameters
const buildUrl = (base: string, params: Record<string, string | undefined>) => {
  // Check if code is running in browser or server environment
  const isClient = typeof window !== 'undefined';
  
  let url: URL;
  
  if (isClient) {
    // Client-side: use window.location.origin
    url = new URL(base, window.location.origin);
  } else {
    // Server-side: use environment variable or default
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    url = new URL(base, baseUrl);
  }
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Hook for fetching integrated team metrics
export function useIntegratedTeamMetrics(
  teamId: string | null,
  startDate?: string,
  endDate?: string
) {
  const shouldFetch = !!teamId;
  
  const { data, error, isLoading } = useSWR(
    shouldFetch 
      ? buildUrl('/api/metrics/integrated', {
          type: 'team',
          teamId,
          startDate,
          endDate
        })
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    metrics: data as IntegratedTeamMetrics | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching integrated member metrics
export function useIntegratedMemberMetrics(
  memberId: string | null,
  teamId?: string,
  startDate?: string,
  endDate?: string
) {
  const shouldFetch = !!memberId;
  
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? buildUrl('/api/metrics/integrated', {
          type: 'member',
          memberId,
          teamId,
          startDate,
          endDate
        })
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    metrics: data as IntegratedMemberMetrics | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching correlation insights
export function useCorrelationInsights(
  params: {
    teamId?: string;
    memberId?: string;
    insightType?: 'team' | 'member' | 'organization';
    severity?: 'info' | 'warning' | 'critical' | 'positive';
    limit?: number;
  }
) {
  const { data, error, isLoading } = useSWR(
    buildUrl('/api/metrics/integrated', {
      type: 'insights',
      teamId: params.teamId,
      memberId: params.memberId,
      insightType: params.insightType,
      severity: params.severity,
      limit: params.limit?.toString()
    }),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    insights: (data || []) as CorrelationInsight[],
    loading: isLoading,
    error
  };
}

// Hook for fetching overview metrics
export function useOverviewMetrics(startDate?: string, endDate?: string) {
  const { data, error, isLoading } = useSWR(
    buildUrl('/api/metrics/integrated', {
      type: 'overview',
      startDate,
      endDate
    }),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    metrics: data as OverviewMetrics | null,
    loading: isLoading,
    error
  };
}
