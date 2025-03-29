// API route for fetching integrated metrics
import { NextApiRequest, NextApiResponse } from 'next';
import { JiraApiClient, JiraTeamRepository, JiraSprintRepository, JiraIssueRepository } from '../../../infrastructure/jira-client';
import { GitHubApiClient, GitHubRepositoryRepository, GitHubCommitRepository, GitHubPullRequestRepository } from '../../../infrastructure/git-client';
import { JiraApplicationService } from '../../../application/jira/jira-service';
import { GitApplicationService } from '../../../application/git/git-service';
import { IntegratedMetricsService } from '../../../application/metrics/integrated-metrics-service';
import { 
  mockIntegratedTeamMetrics, 
  mockOverviewMetrics, 
  generateMockInsights 
} from '../../../mocks/integratedMetricsData';

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
      type,
      startDate, 
      endDate 
    } = req.query;
    
    // Build cache key based on query params
    const cacheKey = JSON.stringify({ teamId, memberId, type, startDate, endDate });
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      // Return appropriate mock data based on request type
      let mockData;
      
      switch (type) {
        case 'team':
          if (!teamId) {
            return res.status(400).json({ error: 'Team ID is required for team metrics' });
          }
          mockData = mockIntegratedTeamMetrics[teamId as string];
          if (!mockData) {
            return res.status(404).json({ error: `Team with ID ${teamId} not found` });
          }
          break;
          
        case 'member':
          if (!memberId) {
            return res.status(400).json({ error: 'Member ID is required for member metrics' });
          }
          // Find team containing this member
          const memberIdString = memberId as string;
          mockData = {}; // Placeholder, would properly generate member metrics
          break;
          
        case 'insights':
          mockData = generateMockInsights(teamId as string);
          break;
          
        case 'overview':
          mockData = mockOverviewMetrics;
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid metrics type' });
      }
      
      return res.status(200).json(mockData);
    }
    
    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      return res.status(200).json(cachedResponse.data);
    }

    // Cache miss or expired, fetch fresh data
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const jiraUsername = process.env.JIRA_USERNAME;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG || 'your-organization';
    
    if (!jiraBaseUrl || !jiraUsername || !jiraApiToken || !githubToken) {
      // If real credentials are missing, fall back to mock data
      // Return appropriate mock data based on request type
      let mockData;
      
      switch (type) {
        case 'team':
          if (!teamId) {
            return res.status(400).json({ error: 'Team ID is required for team metrics' });
          }
          mockData = mockIntegratedTeamMetrics[teamId as string];
          if (!mockData) {
            return res.status(404).json({ error: `Team with ID ${teamId} not found` });
          }
          break;
          
        case 'member':
          if (!memberId) {
            return res.status(400).json({ error: 'Member ID is required for member metrics' });
          }
          // Placeholder for member metrics
          mockData = {};
          break;
          
        case 'insights':
          mockData = generateMockInsights(teamId as string);
          break;
          
        case 'overview':
          mockData = mockOverviewMetrics;
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid metrics type' });
      }
      
      return res.status(200).json(mockData);
    }
    
    // Create JIRA client and repositories
    const jiraClient = new JiraApiClient(jiraBaseUrl, jiraUsername, jiraApiToken);
    const teamRepository = new JiraTeamRepository(jiraClient);
    const sprintRepository = new JiraSprintRepository(jiraClient, teamRepository);
    const issueRepository = new JiraIssueRepository(jiraClient, teamRepository);
    
    // Create GitHub client and repositories
    const githubClient = new GitHubApiClient(githubToken, githubOrg);
    const repositoryRepository = new GitHubRepositoryRepository(githubClient);
    const commitRepository = new GitHubCommitRepository(githubClient, repositoryRepository);
    const pullRequestRepository = new GitHubPullRequestRepository(githubClient, repositoryRepository);
    
    // Create application services
    const jiraService = new JiraApplicationService(
      teamRepository,
      sprintRepository,
      issueRepository
    );
    
    const gitService = new GitApplicationService(
      repositoryRepository,
      commitRepository,
      pullRequestRepository
    );
    
    const metricsService = new IntegratedMetricsService(
      jiraService,
      gitService
    );
    
    // Handle different endpoints based on query parameters and type
    let data;
    const metricsRequest = {
      teamId: teamId as string,
      memberId: memberId as string,
      startDate: startDate as string,
      endDate: endDate as string
    };
    
    switch (type) {
      case 'team':
        if (!teamId) {
          return res.status(400).json({ error: 'Team ID is required for team metrics' });
        }
        data = await metricsService.getIntegratedTeamMetrics(metricsRequest);
        break;
      
      case 'member':
        if (!memberId) {
          return res.status(400).json({ error: 'Member ID is required for member metrics' });
        }
        data = await metricsService.getIntegratedMemberMetrics(metricsRequest);
        break;
      
      case 'insights':
        data = await metricsService.getCorrelationInsights({
          teamId: teamId as string,
          memberId: memberId as string,
          limit: 10
        });
        break;
      
      case 'overview':
        data = await metricsService.getOverviewMetrics(
          startDate as string,
          endDate as string
        );
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid metrics type' });
    }
    
    // Update cache
    responseCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch integrated metrics',
      details: (error as Error).message
    });
  }
}
