// API route for fetching reviews for a pull request
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubApiClient, GitHubRepositoryRepository, GitHubPullRequestRepository } from '../../../../../infrastructure/git-client';
import { GitApplicationService } from '../../../../../application/git/git-service';

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
    const { id, repository } = req.query;
    
    if (!id || !repository) {
      return res.status(400).json({ error: 'Pull request ID and repository parameters are required' });
    }
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      // Normally we would return mock reviews here
      // For simplicity, we're returning an empty array for now
      return res.status(200).json([]);
    }
    
    // Build cache key based on query params
    const cacheKey = JSON.stringify({ id, repository });
    
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
    
    // Get reviews for the pull request
    const reviews = await gitService.getCodeReviews(
      repository as string,
      parseInt(id as string, 10)
    );
    
    // Update cache
    responseCache.set(cacheKey, {
      data: reviews,
      timestamp: Date.now()
    });
    
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch pull request reviews',
      details: (error as Error).message
    });
  }
}
