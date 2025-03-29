// API route for fetching Git metrics
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubApiClient, GitHubRepositoryRepository, GitHubCommitRepository, GitHubPullRequestRepository } from '../../../infrastructure/git-client';
import { GitApplicationService } from '../../../application/git/git-service';
import { mockTeamGitMetrics } from '../../../mocks/gitData';

// Cache for response data
const responseCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse query parameters
    const { 
      teamId, 
      memberId, 
      repositoryId,
      startDate, 
      endDate 
    } = req.query;
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      if (teamId) {
        // Return mock team Git metrics
        const teamIdString = teamId as string;
        if (mockTeamGitMetrics[teamIdString]) {
          return res.status(200).json(mockTeamGitMetrics[teamIdString]);
        } else {
          return res.status(404).json({ error: `Team with ID ${teamIdString} not found` });
        }
      } else if (memberId) {
        // Find team containing this member
        const memberIdString = memberId as string;
        const teamWithMember = Object.values(mockTeamGitMetrics).find(team => 
          team.memberMetrics && team.memberMetrics[memberIdString]
        );
        
        if (teamWithMember && teamWithMember.memberMetrics[memberIdString]) {
          return res.status(200).json(teamWithMember.memberMetrics[memberIdString]);
        } else {
          return res.status(404).json({ error: `Member with ID ${memberIdString} not found` });
        }
      } else {
        // Return all teams Git metrics
        return res.status(200).json(Object.values(mockTeamGitMetrics));
      }
    }    
    
    // Build cache key based on query params
    const cacheKey = JSON.stringify({ teamId, memberId, repositoryId, startDate, endDate });
    
    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      return res.status(200).json(cachedResponse.data);
    }

    // Cache miss or expired, fetch fresh data
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG || 'your-organization';
    
    if (!githubToken) {
      // If credentials are missing, fall back to mock data
      if (teamId) {
        // Return mock team Git metrics
        const teamIdString = teamId as string;
        if (mockTeamGitMetrics[teamIdString]) {
          return res.status(200).json(mockTeamGitMetrics[teamIdString]);
        } else {
          return res.status(404).json({ error: `Team with ID ${teamIdString} not found` });
        }
      } else if (memberId) {
        // Find team containing this member
        const memberIdString = memberId as string;
        const teamWithMember = Object.values(mockTeamGitMetrics).find(team => 
          team.memberMetrics && team.memberMetrics[memberIdString]
        );
        
        if (teamWithMember && teamWithMember.memberMetrics[memberIdString]) {
          return res.status(200).json(teamWithMember.memberMetrics[memberIdString]);
        } else {
          return res.status(404).json({ error: `Member with ID ${memberIdString} not found` });
        }
      } else {
        // Return all teams Git metrics
        return res.status(200).json(Object.values(mockTeamGitMetrics));
      }
    }
    
    // Create GitHub client and repositories
    const githubClient = new GitHubApiClient(githubToken, githubOrg);
    const repositoryRepository = new GitHubRepositoryRepository(githubClient);
    const commitRepository = new GitHubCommitRepository(githubClient, repositoryRepository);
    const pullRequestRepository = new GitHubPullRequestRepository(githubClient, repositoryRepository);
    
    // Create application service
    const gitService = new GitApplicationService(
      repositoryRepository,
      commitRepository,
      pullRequestRepository
    );
    
    // Get Git metrics
    const metrics = await gitService.getGitMetrics({
      teamId: teamId as string,
      memberId: memberId as string,
      repositoryId: repositoryId as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    
    // Update cache
    responseCache.set(cacheKey, {
      data: metrics,
      timestamp: Date.now()
    });
    
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch Git metrics',
      details: (error as Error).message
    });
  }
}
