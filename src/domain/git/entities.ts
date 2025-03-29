// Domain Entities for Git Context

export interface GitRepository {
  id: string;
  name: string;
  url: string;
  teamId?: string;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  authorEmail: string;
  date: string;
  repository: string;
  teamId?: string;
}

export interface PullRequest {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'closed' | 'merged';
  reviewers: string[];
  repository: string;
  teamId?: string;
}

export interface CodeReview {
  id: number;
  pullRequestId: number;
  reviewer: string;
  submittedAt: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  repository: string;
}

export interface Developer {
  username: string;
  name: string;
  email: string;
  teamId: string;
}

export interface GitMetrics {
  commitCount: number;
  prCount: number;
  prMergedCount: number;
  avgPrTimeToMerge: number;
  codeReviewCount: number;
  avgReviewResponseTime: number;
}

export interface TeamGitMetrics {
  teamId: string;
  teamName: string;
  metrics: GitMetrics;
  memberMetrics: Record<string, GitMetrics>;
}

// Value Objects
export class CommitHash {
  private readonly value: string;

  constructor(value: string) {
    if (!/^[0-9a-f]{7,40}$/i.test(value)) {
      throw new Error("Invalid commit hash format");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  getShortHash(): string {
    return this.value.substring(0, 7);
  }
}

export class TimeToMerge {
  private readonly valueInHours: number;

  constructor(creationTime: Date, mergeTime: Date) {
    const diffMs = mergeTime.getTime() - creationTime.getTime();
    this.valueInHours = diffMs / (1000 * 60 * 60);
  }

  getHours(): number {
    return this.valueInHours;
  }

  getFormattedValue(): string {
    if (this.valueInHours < 24) {
      return `${this.valueInHours.toFixed(1)} hrs`;
    } else {
      const days = Math.floor(this.valueInHours / 24);
      const hours = this.valueInHours % 24;
      return `${days}d ${hours.toFixed(1)}h`;
    }
  }
}

// Repository Interfaces
export interface GitRepositoryRepository {
  findAll(): Promise<GitRepository[]>;
  findByTeam(teamId: string): Promise<GitRepository[]>;
}

export interface CommitRepository {
  findByRepository(repositoryName: string, since?: string, until?: string): Promise<GitCommit[]>;
  findByTeam(teamId: string, since?: string, until?: string): Promise<GitCommit[]>;
  findByAuthor(author: string, since?: string, until?: string): Promise<GitCommit[]>;
}

export interface PullRequestRepository {
  findByRepository(repositoryName: string, status?: string): Promise<PullRequest[]>;
  findByTeam(teamId: string, status?: string): Promise<PullRequest[]>;
  findByAuthor(author: string, status?: string): Promise<PullRequest[]>;
  getReviews(repository: string, pullRequestId: number): Promise<CodeReview[]>;
}
