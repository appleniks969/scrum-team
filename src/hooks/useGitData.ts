import useSWR from 'swr';
import fetcher from '../utils/swrFetcher';

// Types for Git data
export interface GitRepository {
  id: string;
  name: string;
  url: string;
  teamId?: string;
  description?: string;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: {
    username: string;
    name: string;
    email: string;
  };
  date: string;
  repository: string;
  teamId?: string;
}

export interface PullRequest {
  id: number;
  title: string;
  createdBy: {
    username: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'closed' | 'merged';
  reviewers: Array<{
    username: string;
    displayName: string;
  }>;
  repository: string;
  teamId?: string;
  branch: string;
  baseBranch: string;
  url: string;
}

export interface GitMetrics {
  commitCount: number;
  prCount: number;
  prMergedCount: number;
  avgPrTimeToMerge: number;
  codeReviewCount: number;
  avgReviewResponseTime: number;
  linesAdded: number;
  linesRemoved: number;
  date: string;
}

export interface TeamGitMetrics {
  teamId: string;
  teamName: string;
  metrics: GitMetrics;
  memberMetrics: Record<string, GitMetrics>;
  repositories: string[];
  date: string;
}

// Helper function to build URL with query parameters
const buildUrl = (base: string, params: Record<string, string | undefined>) => {
  const url = new URL(base, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Hook for fetching Git metrics for a team
export function useTeamGitMetrics(
  teamId: string | null,
  startDate?: string,
  endDate?: string
) {
  const { data, error, isLoading } = useSWR(
    teamId
      ? buildUrl('/api/git/metrics', {
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
    metrics: data as TeamGitMetrics | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching Git metrics for a member
export function useMemberGitMetrics(
  memberId: string | null,
  startDate?: string,
  endDate?: string
) {
  const { data, error, isLoading } = useSWR(
    memberId
      ? buildUrl('/api/git/metrics', {
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
    metrics: data as GitMetrics | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching Git metrics for a repository
export function useRepositoryGitMetrics(
  repositoryId: string | null,
  startDate?: string,
  endDate?: string
) {
  const { data, error, isLoading } = useSWR(
    repositoryId
      ? buildUrl('/api/git/metrics', {
          repositoryId,
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
    metrics: data as GitMetrics | null,
    loading: isLoading,
    error
  };
}

// Hook for fetching pull requests
export function usePullRequests(
  params: {
    teamId?: string;
    authorId?: string;
    repositoryId?: string;
    status?: 'open' | 'closed' | 'merged' | 'all';
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }
) {
  // Build the URL with query parameters
  const queryParams: Record<string, string | undefined> = {
    teamId: params.teamId,
    authorId: params.authorId,
    repositoryId: params.repositoryId,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page?.toString(),
    pageSize: params.pageSize?.toString()
  };
  
  const { data, error, isLoading } = useSWR(
    buildUrl('/api/git/pull-requests', queryParams),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    pullRequests: (data || []) as PullRequest[],
    loading: isLoading,
    error
  };
}

// Hook for fetching repositories
export function useRepositories(teamId?: string) {
  const { data, error, isLoading } = useSWR(
    buildUrl('/api/git/repositories', {
      teamId
    }),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  return {
    repositories: (data || []) as GitRepository[],
    loading: isLoading,
    error
  };
}
