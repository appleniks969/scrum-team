// Git API Client Implementation
import { Octokit } from '@octokit/rest';
import { 
  GitRepository, 
  GitCommit, 
  PullRequest, 
  CodeReview, 
  Developer,
  GitRepositoryRepository,
  CommitRepository,
  PullRequestRepository
} from '../domain/git/entities';

export class GitHubApiClient {
  private octokit: Octokit;
  private orgName: string;

  constructor(authToken: string, orgName: string) {
    this.octokit = new Octokit({
      auth: authToken
    });
    this.orgName = orgName;
  }

  // Fetch repositories for the organization
  async getRepositories(): Promise<any[]> {
    try {
      const { data } = await this.octokit.repos.listForOrg({
        org: this.orgName,
        type: 'all',
        per_page: 100
      });
      
      return data || [];
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }

  // Fetch commits for a repository
  async getCommits(
    repository: string,
    since?: string,
    until?: string
  ): Promise<any[]> {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner: this.orgName,
        repo: repository,
        since,
        until,
        per_page: 100
      });
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching commits for ${repository}:`, error);
      return [];
    }
  }

  // Fetch pull requests for a repository
  async getPullRequests(
    repository: string,
    state: 'open' | 'closed' | 'all' = 'all'
  ): Promise<any[]> {
    try {
      const { data } = await this.octokit.pulls.list({
        owner: this.orgName,
        repo: repository,
        state,
        sort: 'created',
        direction: 'desc',
        per_page: 100
      });
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching pull requests for ${repository}:`, error);
      return [];
    }
  }

  // Fetch reviews for a pull request
  async getPullRequestReviews(
    repository: string,
    pullRequestNumber: number
  ): Promise<any[]> {
    try {
      const { data } = await this.octokit.pulls.listReviews({
        owner: this.orgName,
        repo: repository,
        pull_number: pullRequestNumber
      });
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching reviews for PR #${pullRequestNumber} in ${repository}:`, error);
      return [];
    }
  }

  // Fetch organization members
  async getOrganizationMembers(): Promise<any[]> {
    try {
      const { data } = await this.octokit.orgs.listMembers({
        org: this.orgName,
        per_page: 100
      });
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching members for organization ${this.orgName}:`, error);
      return [];
    }
  }
}

// Repository implementations
export class GitHubRepositoryRepository implements GitRepositoryRepository {
  private gitHubClient: GitHubApiClient;
  private teamMappings: Record<string, string>; // Maps repo names to team IDs

  constructor(gitHubClient: GitHubApiClient, teamMappings: Record<string, string> = {}) {
    this.gitHubClient = gitHubClient;
    this.teamMappings = teamMappings;
  }

  async findAll(): Promise<GitRepository[]> {
    const repositories = await this.gitHubClient.getRepositories();
    
    return repositories.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      url: repo.html_url,
      teamId: this.teamMappings[repo.name]
    }));
  }

  async findByTeam(teamId: string): Promise<GitRepository[]> {
    const allRepos = await this.findAll();
    return allRepos.filter(repo => repo.teamId === teamId);
  }
}

export class GitHubCommitRepository implements CommitRepository {
  private gitHubClient: GitHubApiClient;
  private repositoryRepository: GitHubRepositoryRepository;
  private developerMappings: Record<string, string>; // Maps GitHub usernames to team members

  constructor(
    gitHubClient: GitHubApiClient, 
    repositoryRepository: GitHubRepositoryRepository,
    developerMappings: Record<string, string> = {}
  ) {
    this.gitHubClient = gitHubClient;
    this.repositoryRepository = repositoryRepository;
    this.developerMappings = developerMappings;
  }

  async findByRepository(repositoryName: string, since?: string, until?: string): Promise<GitCommit[]> {
    const commits = await this.gitHubClient.getCommits(repositoryName, since, until);
    
    return commits.map(commit => this.mapGitHubCommitToEntity(commit, repositoryName));
  }

  async findByTeam(teamId: string, since?: string, until?: string): Promise<GitCommit[]> {
    const repositories = await this.repositoryRepository.findByTeam(teamId);
    const allCommits: GitCommit[] = [];
    
    for (const repo of repositories) {
      const commits = await this.findByRepository(repo.name, since, until);
      allCommits.push(...commits);
    }
    
    return allCommits;
  }

  async findByAuthor(author: string, since?: string, until?: string): Promise<GitCommit[]> {
    // In a real implementation, we would use GitHub's search API
    // For now, we'll fetch all commits and filter by author
    const repositories = await this.repositoryRepository.findAll();
    const allCommits: GitCommit[] = [];
    
    for (const repo of repositories) {
      const repoCommits = await this.findByRepository(repo.name, since, until);
      const authorCommits = repoCommits.filter(commit => commit.author === author);
      allCommits.push(...authorCommits);
    }
    
    return allCommits;
  }

  private mapGitHubCommitToEntity(commit: any, repository: string): GitCommit {
    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.author?.login || commit.commit.author.name,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      repository,
      teamId: undefined // In a real implementation, we would determine this
    };
  }
}

export class GitHubPullRequestRepository implements PullRequestRepository {
  private gitHubClient: GitHubApiClient;
  private repositoryRepository: GitHubRepositoryRepository;

  constructor(
    gitHubClient: GitHubApiClient, 
    repositoryRepository: GitHubRepositoryRepository
  ) {
    this.gitHubClient = gitHubClient;
    this.repositoryRepository = repositoryRepository;
  }

  async findByRepository(repositoryName: string, status?: string): Promise<PullRequest[]> {
    const state = status === 'merged' ? 'closed' : status as 'open' | 'closed' | 'all' || 'all';
    const prs = await this.gitHubClient.getPullRequests(repositoryName, state);
    
    // Filter merged PRs if needed
    const filteredPRs = status === 'merged' 
      ? prs.filter(pr => pr.merged_at !== null) 
      : prs;
    
    return filteredPRs.map(pr => this.mapGitHubPRToEntity(pr, repositoryName));
  }

  async findByTeam(teamId: string, status?: string): Promise<PullRequest[]> {
    const repositories = await this.repositoryRepository.findByTeam(teamId);
    const allPRs: PullRequest[] = [];
    
    for (const repo of repositories) {
      const prs = await this.findByRepository(repo.name, status);
      allPRs.push(...prs);
    }
    
    return allPRs;
  }

  async findByAuthor(author: string, status?: string): Promise<PullRequest[]> {
    // In a real implementation, we would use GitHub's search API
    // For now, we'll fetch all PRs and filter by author
    const repositories = await this.repositoryRepository.findAll();
    const allPRs: PullRequest[] = [];
    
    for (const repo of repositories) {
      const repoPRs = await this.findByRepository(repo.name, status);
      const authorPRs = repoPRs.filter(pr => pr.createdBy === author);
      allPRs.push(...authorPRs);
    }
    
    return allPRs;
  }

  async getReviews(repository: string, pullRequestId: number): Promise<CodeReview[]> {
    const reviews = await this.gitHubClient.getPullRequestReviews(repository, pullRequestId);
    
    return reviews.map(review => ({
      id: review.id,
      pullRequestId,
      reviewer: review.user?.login || 'Unknown',
      submittedAt: review.submitted_at || new Date().toISOString(),
      state: review.state as 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED',
      repository
    }));
  }

  private mapGitHubPRToEntity(pr: any, repository: string): PullRequest {
    return {
      id: pr.number,
      title: pr.title,
      createdBy: pr.user?.login || 'Unknown',
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      status: pr.merged_at ? 'merged' : pr.state as 'open' | 'closed',
      reviewers: pr.requested_reviewers?.map((reviewer: any) => reviewer.login) || [],
      repository,
      teamId: undefined // In a real implementation, we would determine this
    };
  }
}
