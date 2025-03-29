// API route for fetching Git pull requests
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubApiClient, GitHubRepositoryRepository, GitHubPullRequestRepository } from '../../../../infrastructure/git-client';
import { GitApplicationService } from '../../../../application/git/git-service';

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
      authorId, 
      repositoryId, 
      status,
      startDate,
      endDate,
      page,
      pageSize
    } = req.query;
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      // Normally we would return mock pull requests here
      // For simplicity, we're returning an empty array for now
      return res.status(200).json([]);
    }
    
    // Build cache key based on query params
    const cacheKey = JSON.stringify({ 
      teamId, 
      authorId, 
      repositoryId, 
      status, 
      startDate, 
      endDate, 
      page, 
      pageSize 
    });
    
    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      return res.status(200).json(cachedResponse.data);
    }

    // Cache miss or expired, fetch fresh data
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG || 'your-organization';
    
    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub token is required but not provided' });
    }
    
    // Create GitHub client and repositories
    const githubClient = new GitHubApiClient(githubToken, githubOrg);
    const repositoryRepository = new GitHubRepositoryRepository(githubClient);
    const pullRequestRepository = new GitHubPullRequestRepository(githubClient, repositoryRepository);
    
    // Create application service
    const gitService = new GitApplicationService(
      repositoryRepository,
      {} as any, // commitRepository is required but not used here
      pullRequestRepository
    );
    
    // Get pull requests
    const pullRequests = await gitService.getPullRequests({
      teamId: teamId as string | undefined,
      authorId: authorId as string | undefined,
      repositoryId: repositoryId as string | undefined,
      status: status as 'open' | 'closed' | 'merged' | 'all' | undefined,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined
    });
    
    // Update cache
    responseCache.set(cacheKey, {
      data: pullRequests,
      timestamp: Date.now()
    });
    
    return res.status(200).json(pullRequests);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch pull requests',
      details: (error as Error).message
    });
  }
}
