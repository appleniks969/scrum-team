// Application service for Git context
import { 
  GitRepositoryRepository, 
  CommitRepository, 
  PullRequestRepository,
} from '../../domain/git/entities';

import { 
  GitRepositoryDto, 
  GitCommitDto, 
  PullRequestDto, 
  CodeReviewDto, 
  GitMetricsDto,
  TeamGitMetricsDto,
  GetGitMetricsRequestDto,
  GetPullRequestsRequestDto
} from '../dtos/git-dtos';

export class GitApplicationService {
  private repositoryRepository: GitRepositoryRepository;
  private commitRepository: CommitRepository;
  private pullRequestRepository: PullRequestRepository;
  private teamNameMapping: Record<string, string>;

  constructor(
    repositoryRepository: GitRepositoryRepository,
    commitRepository: CommitRepository,
    pullRequestRepository: PullRequestRepository,
    teamNameMapping: Record<string, string> = {}
  ) {
    this.repositoryRepository = repositoryRepository;
    this.commitRepository = commitRepository;
    this.pullRequestRepository = pullRequestRepository;
    this.teamNameMapping = teamNameMapping;
  }

  async getAllRepositories(): Promise<GitRepositoryDto[]> {
    try {
      const repositories = await this.repositoryRepository.findAll();
      return repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        url: repo.url,
        teamId: repo.teamId
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories. Please try again later.');
    }
  }

  async getRepositoriesByTeam(teamId: string): Promise<GitRepositoryDto[]> {
    try {
      const repositories = await this.repositoryRepository.findByTeam(teamId);
      return repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        url: repo.url,
        teamId: repo.teamId
      }));
    } catch (error) {
      console.error(`Error fetching repositories for team ${teamId}:`, error);
      throw new Error('Failed to fetch team repositories. Please try again later.');
    }
  }

  async getCommitsByRepository(
    repository: string,
    since?: string,
    until?: string
  ): Promise<GitCommitDto[]> {
    try {
      const commits = await this.commitRepository.findByRepository(repository, since, until);
      return commits.map(commit => ({
        sha: commit.sha,
        message: commit.message,
        author: {
          username: commit.author,
          name: commit.author,
          email: commit.authorEmail
        },
        date: commit.date,
        repository: commit.repository,
        teamId: commit.teamId
      }));
    } catch (error) {
      console.error(`Error fetching commits for repository ${repository}:`, error);
      throw new Error('Failed to fetch commit data. Please try again later.');
    }
  }

  async getCommitsByTeam(
    teamId: string,
    since?: string,
    until?: string
  ): Promise<GitCommitDto[]> {
    try {
      const commits = await this.commitRepository.findByTeam(teamId, since, until);
      return commits.map(commit => ({
        sha: commit.sha,
        message: commit.message,
        author: {
          username: commit.author,
          name: commit.author,
          email: commit.authorEmail
        },
        date: commit.date,
        repository: commit.repository,
        teamId: commit.teamId
      }));
    } catch (error) {
      console.error(`Error fetching commits for team ${teamId}:`, error);
      throw new Error('Failed to fetch team commit data. Please try again later.');
    }
  }

  async getPullRequests(request: GetPullRequestsRequestDto): Promise<PullRequestDto[]> {
    try {
      let pullRequests: PullRequestDto[] = [];
      
      if (request.repositoryId) {
        const prs = await this.pullRequestRepository.findByRepository(
          request.repositoryId,
          request.status
        );
        
        pullRequests = this.mapPullRequestsToDtos(prs);
      } else if (request.teamId) {
        const prs = await this.pullRequestRepository.findByTeam(
          request.teamId,
          request.status
        );
        
        pullRequests = this.mapPullRequestsToDtos(prs);
      } else if (request.authorId) {
        const prs = await this.pullRequestRepository.findByAuthor(
          request.authorId,
          request.status
        );
        
        pullRequests = this.mapPullRequestsToDtos(prs);
      } else {
        throw new Error('At least one filter (repository, team, or author) must be provided');
      }
      
      // Apply date filtering if provided
      if (request.startDate || request.endDate) {
        pullRequests = pullRequests.filter(pr => {
          const prDate = new Date(pr.createdAt).getTime();
          
          if (request.startDate && request.endDate) {
            const startTime = new Date(request.startDate).getTime();
            const endTime = new Date(request.endDate).getTime();
            return prDate >= startTime && prDate <= endTime;
          } else if (request.startDate) {
            const startTime = new Date(request.startDate).getTime();
            return prDate >= startTime;
          } else if (request.endDate) {
            const endTime = new Date(request.endDate).getTime();
            return prDate <= endTime;
          }
          
          return true;
        });
      }
      
      // Apply pagination if provided
      if (request.page !== undefined && request.pageSize !== undefined) {
        const start = (request.page - 1) * request.pageSize;
        const end = start + request.pageSize;
        pullRequests = pullRequests.slice(start, end);
      }
      
      return pullRequests;
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      throw new Error('Failed to fetch pull request data. Please try again later.');
    }
  }

  async getCodeReviews(
    repository: string,
    pullRequestId: number
  ): Promise<CodeReviewDto[]> {
    try {
      const reviews = await this.pullRequestRepository.getReviews(
        repository,
        pullRequestId
      );
      
      return reviews.map(review => ({
        id: review.id,
        pullRequestId: review.pullRequestId,
        pullRequestTitle: 'Pull Request', // In a real implementation, we would fetch the title
        reviewer: {
          username: review.reviewer,
          displayName: review.reviewer
        },
        submittedAt: review.submittedAt,
        state: review.state,
        repository: review.repository,
        url: `https://github.com/repository/${review.repository}/pull/${review.pullRequestId}`,
        comments: 0 // In a real implementation, we would fetch the comment count
      }));
    } catch (error) {
      console.error(`Error fetching reviews for PR #${pullRequestId} in ${repository}:`, error);
      throw new Error('Failed to fetch code review data. Please try again later.');
    }
  }

  async getGitMetrics(request: GetGitMetricsRequestDto): Promise<GitMetricsDto | TeamGitMetricsDto> {
    try {
      const now = new Date().toISOString();
      
      if (request.teamId) {
        // Calculate team metrics
        const teamName = this.teamNameMapping[request.teamId] || 'Unknown Team';
        const repositories = await this.repositoryRepository.findByTeam(request.teamId);
        const commits = await this.commitRepository.findByTeam(
          request.teamId,
          request.startDate,
          request.endDate
        );
        
        const pullRequests = await this.pullRequestRepository.findByTeam(
          request.teamId
        );
        
        const mergedPRs = pullRequests.filter(pr => pr.status === 'merged');
        
        // Calculate average PR time to merge (in hours)
        let avgPrTimeToMerge = 0;
        if (mergedPRs.length > 0) {
          const totalHours = mergedPRs.reduce((total, pr) => {
            const createdDate = new Date(pr.createdAt);
            // In a real implementation, this would be the actual merge date
            const mergedDate = new Date(pr.updatedAt);
            const diffHours = (mergedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
            return total + diffHours;
          }, 0);
          
          avgPrTimeToMerge = totalHours / mergedPRs.length;
        }
        
        // Collect member metrics
        const memberIds = new Set<string>();
        commits.forEach(commit => {
          if (commit.author) {
            memberIds.add(commit.author);
          }
        });
        
        const memberMetrics: Record<string, GitMetricsDto> = {};
        
        for (const memberId of memberIds) {
          const memberCommits = commits.filter(commit => commit.author === memberId);
          const memberPRs = pullRequests.filter(pr => pr.createdBy === memberId);
          const memberMergedPRs = memberPRs.filter(pr => pr.status === 'merged');
          
          // Calculate member's average PR time to merge
          let memberAvgPrTimeToMerge = 0;
          if (memberMergedPRs.length > 0) {
            const totalHours = memberMergedPRs.reduce((total, pr) => {
              const createdDate = new Date(pr.createdAt);
              const mergedDate = new Date(pr.updatedAt); // Simplified
              const diffHours = (mergedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
              return total + diffHours;
            }, 0);
            
            memberAvgPrTimeToMerge = totalHours / memberMergedPRs.length;
          }
          
          memberMetrics[memberId] = {
            commitCount: memberCommits.length,
            prCount: memberPRs.length,
            prMergedCount: memberMergedPRs.length,
            avgPrTimeToMerge: memberAvgPrTimeToMerge,
            codeReviewCount: 0, // Simplified - would require additional queries
            avgReviewResponseTime: 0, // Simplified
            linesAdded: 0, // Simplified
            linesRemoved: 0, // Simplified
            date: now
          };
        }
        
        return {
          teamId: request.teamId,
          teamName,
          metrics: {
            commitCount: commits.length,
            prCount: pullRequests.length,
            prMergedCount: mergedPRs.length,
            avgPrTimeToMerge,
            codeReviewCount: 0, // Simplified
            avgReviewResponseTime: 0, // Simplified
            linesAdded: 0, // Simplified
            linesRemoved: 0, // Simplified
            date: now
          },
          memberMetrics,
          repositories: repositories.map(repo => repo.name),
          date: now
        };
      } else if (request.memberId) {
        // Calculate member metrics
        const memberCommits = await this.commitRepository.findByAuthor(
          request.memberId,
          request.startDate,
          request.endDate
        );
        
        const memberPRs = await this.pullRequestRepository.findByAuthor(
          request.memberId
        );
        
        const mergedPRs = memberPRs.filter(pr => pr.status === 'merged');
        
        // Calculate average PR time to merge
        let avgPrTimeToMerge = 0;
        if (mergedPRs.length > 0) {
          const totalHours = mergedPRs.reduce((total, pr) => {
            const createdDate = new Date(pr.createdAt);
            const mergedDate = new Date(pr.updatedAt); // Simplified
            const diffHours = (mergedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
            return total + diffHours;
          }, 0);
          
          avgPrTimeToMerge = totalHours / mergedPRs.length;
        }
        
        return {
          commitCount: memberCommits.length,
          prCount: memberPRs.length,
          prMergedCount: mergedPRs.length,
          avgPrTimeToMerge,
          codeReviewCount: 0, // Simplified
          avgReviewResponseTime: 0, // Simplified
          linesAdded: 0, // Simplified
          linesRemoved: 0, // Simplified
          date: now
        };
      } else if (request.repositoryId) {
        // Calculate repository metrics
        const repositoryCommits = await this.commitRepository.findByRepository(
          request.repositoryId,
          request.startDate,
          request.endDate
        );
        
        const repositoryPRs = await this.pullRequestRepository.findByRepository(
          request.repositoryId
        );
        
        const mergedPRs = repositoryPRs.filter(pr => pr.status === 'merged');
        
        // Calculate average PR time to merge
        let avgPrTimeToMerge = 0;
        if (mergedPRs.length > 0) {
          const totalHours = mergedPRs.reduce((total, pr) => {
            const createdDate = new Date(pr.createdAt);
            const mergedDate = new Date(pr.updatedAt); // Simplified
            const diffHours = (mergedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
            return total + diffHours;
          }, 0);
          
          avgPrTimeToMerge = totalHours / mergedPRs.length;
        }
        
        return {
          commitCount: repositoryCommits.length,
          prCount: repositoryPRs.length,
          prMergedCount: mergedPRs.length,
          avgPrTimeToMerge,
          codeReviewCount: 0, // Simplified
          avgReviewResponseTime: 0, // Simplified
          linesAdded: 0, // Simplified
          linesRemoved: 0, // Simplified
          date: now
        };
      } else {
        throw new Error('At least one filter (team, member, or repository) must be provided');
      }
    } catch (error) {
      console.error('Error calculating Git metrics:', error);
      throw new Error('Failed to calculate Git metrics. Please try again later.');
    }
  }

  private mapPullRequestsToDtos(prs: any[]): PullRequestDto[] {
    return prs.map(pr => ({
      id: pr.id,
      title: pr.title,
      createdBy: {
        username: pr.createdBy,
        displayName: pr.createdBy
      },
      createdAt: pr.createdAt,
      updatedAt: pr.updatedAt,
      status: pr.status,
      reviewers: pr.reviewers.map((reviewer: string) => ({
        username: reviewer,
        displayName: reviewer
      })),
      repository: pr.repository,
      teamId: pr.teamId,
      branch: 'feature-branch', // Simplified
      baseBranch: 'main', // Simplified
      url: `https://github.com/repository/${pr.repository}/pull/${pr.id}`
    }));
  }
}
