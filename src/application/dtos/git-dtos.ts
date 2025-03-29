// Data Transfer Objects for Git Context

export interface GitRepositoryDto {
  id: string;
  name: string;
  url: string;
  teamId?: string;
  description?: string;
}

export interface GitCommitDto {
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
  linesAdded?: number;
  linesRemoved?: number;
}

export interface PullRequestDto {
  id: number;
  title: string;
  createdBy: {
    username: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  mergedAt?: string;
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

export interface CodeReviewDto {
  id: number;
  pullRequestId: number;
  pullRequestTitle: string;
  reviewer: {
    username: string;
    displayName: string;
  };
  submittedAt: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  repository: string;
  url: string;
  comments?: number;
}

export interface GitMetricsDto {
  commitCount: number;
  prCount: number;
  prMergedCount: number;
  avgPrTimeToMerge: number;
  codeReviewCount: number;
  avgReviewResponseTime: number;
  linesAdded: number;
  linesRemoved: number;
  date: string; // For caching and versioning
}

export interface TeamGitMetricsDto {
  teamId: string;
  teamName: string;
  metrics: GitMetricsDto;
  memberMetrics: Record<string, GitMetricsDto>;
  repositories: string[];
  date: string;
}

// Request DTOs
export interface GetGitMetricsRequestDto {
  teamId?: string;
  memberId?: string;
  repositoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetPullRequestsRequestDto {
  teamId?: string;
  authorId?: string;
  repositoryId?: string;
  status?: 'open' | 'closed' | 'merged' | 'all';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
