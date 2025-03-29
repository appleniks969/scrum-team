import useSWR from 'swr';
import fetcher from '../utils/swrFetcher';

// Types for JIRA data
export interface Team {
  id: string;
  name: string;
  boardId: number;
}

export interface Sprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  boardId: number;
}

export interface CompletionStats {
  teamId: string;
  teamName: string;
  sprintId: number;
  sprintName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  memberStats: MemberCompletionStats[];
  date: string;
}

export interface MemberCompletionStats {
  accountId: string;
  displayName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
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

// Hook for fetching teams
export function useTeams() {
  const { data, error, isLoading } = useSWR('/api/jira/teams', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false
  });

  return {
    teams: (data || []) as Team[],
    loading: isLoading,
    error
  };
}

// Hook for fetching team by ID
export function useTeam(teamId: string | null) {
  const { data, error, isLoading } = useSWR(
    teamId ? `/api/jira/teams?id=${teamId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    team: data as Team | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching sprints by team
export function useSprints(teamId: string | null) {
  const { data, error, isLoading } = useSWR(
    teamId ? `/api/jira/sprints?teamId=${teamId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    sprints: (data || []) as Sprint[],
    loading: isLoading,
    error
  };
}

// Hook for fetching team completion stats
export function useTeamStats(
  teamId: string | null, 
  sprintId?: number,
  startDate?: string,
  endDate?: string
) {
  const { data, error, isLoading } = useSWR(
    teamId
      ? buildUrl('/api/jira/stats', {
          teamId,
          sprintId: sprintId?.toString(),
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
    stats: data as CompletionStats | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching all teams stats
export function useAllTeamsStats(startDate?: string, endDate?: string) {
  const { data, error, isLoading } = useSWR(
    buildUrl('/api/jira/stats', {
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
    stats: (data || []) as CompletionStats[],
    loading: isLoading,
    error
  };
}

// Hook for fetching member stats
export function useMemberStats(
  memberId: string | null,
  startDate?: string,
  endDate?: string
) {
  const { data, error, isLoading } = useSWR(
    memberId
      ? buildUrl('/api/jira/stats', {
          memberId,
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
    stats: data as MemberCompletionStats | null,
    loading: isLoading,
    error
  };
}
