// API route for fetching JIRA metrics
import { NextApiRequest, NextApiResponse } from 'next';
import { JiraApiClient, JiraTeamRepository, JiraSprintRepository, JiraIssueRepository } from '../../../infrastructure/jira-client';
import { JiraApplicationService } from '../../../application/jira/jira-service';
import { mockTeamStats } from '../../../mocks/teamStatsData';

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
      sprintId, 
      memberId,
      startDate, 
      endDate 
    } = req.query;
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      if (teamId) {
        // Return mock team stats
        const teamIdString = teamId as string;
        if (mockTeamStats[teamIdString]) {
          return res.status(200).json(mockTeamStats[teamIdString]);
        } else {
          return res.status(404).json({ error: `Team with ID ${teamIdString} not found` });
        }
      } else if (memberId) {
        // Find team containing this member
        const memberIdString = memberId as string;
        const teamWithMember = Object.values(mockTeamStats).find(stats => 
          stats.memberStats.some(member => member.accountId === memberIdString)
        );
        
        if (teamWithMember) {
          const memberStats = teamWithMember.memberStats.find(m => m.accountId === memberIdString);
          return res.status(200).json(memberStats);
        } else {
          return res.status(404).json({ error: `Member with ID ${memberIdString} not found` });
        }
      } else {
        // Return all teams stats
        return res.status(200).json(Object.values(mockTeamStats));
      }
    }
    
    // Build cache key based on query params
    const cacheKey = JSON.stringify({ teamId, sprintId, memberId, startDate, endDate });
    
    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      return res.status(200).json(cachedResponse.data);
    }

    // Cache miss or expired, fetch fresh data
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const jiraUsername = process.env.JIRA_USERNAME;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    
    if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
      // If credentials are missing but USE_MOCK_DATA is not true, fall back to mock data
      if (teamId) {
        // Return mock team stats
        const teamIdString = teamId as string;
        if (mockTeamStats[teamIdString]) {
          return res.status(200).json(mockTeamStats[teamIdString]);
        } else {
          return res.status(404).json({ error: `Team with ID ${teamIdString} not found` });
        }
      } else if (memberId) {
        // Find team containing this member
        const memberIdString = memberId as string;
        const teamWithMember = Object.values(mockTeamStats).find(stats => 
          stats.memberStats.some(member => member.accountId === memberIdString)
        );
        
        if (teamWithMember) {
          const memberStats = teamWithMember.memberStats.find(m => m.accountId === memberIdString);
          return res.status(200).json(memberStats);
        } else {
          return res.status(404).json({ error: `Member with ID ${memberIdString} not found` });
        }
      } else {
        // Return all teams stats
        return res.status(200).json(Object.values(mockTeamStats));
      }
    }
    
    // Create JIRA client and repositories
    const jiraClient = new JiraApiClient(jiraBaseUrl, jiraUsername, jiraApiToken);
    const teamRepository = new JiraTeamRepository(jiraClient);
    const sprintRepository = new JiraSprintRepository(jiraClient, teamRepository);
    const issueRepository = new JiraIssueRepository(jiraClient, teamRepository);
    
    // Create application service
    const jiraService = new JiraApplicationService(
      teamRepository,
      sprintRepository,
      issueRepository
    );
    
    // Handle different endpoints based on query parameters
    if (teamId) {
      // Fetch team stats
      const stats = await jiraService.getTeamCompletionStats({
        teamId: teamId as string,
        sprintId: sprintId ? parseInt(sprintId as string) : undefined,
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      // Update cache
      responseCache.set(cacheKey, {
        data: stats,
        timestamp: Date.now()
      });
      
      return res.status(200).json(stats);
    } else if (memberId) {
      // Fetch member stats
      const stats = await jiraService.getMemberCompletionStats({
        accountId: memberId as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      // Update cache
      responseCache.set(cacheKey, {
        data: stats,
        timestamp: Date.now()
      });
      
      return res.status(200).json(stats);
    } else {
      // Fetch all teams stats
      const stats = await jiraService.getAllTeamsCompletionStats(
        startDate as string,
        endDate as string
      );
      
      // Update cache
      responseCache.set(cacheKey, {
        data: stats,
        timestamp: Date.now()
      });
      
      return res.status(200).json(stats);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metrics',
      details: (error as Error).message
    });
  }
}
