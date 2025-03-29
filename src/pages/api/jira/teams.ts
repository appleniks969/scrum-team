// API route for fetching teams
import { NextApiRequest, NextApiResponse } from 'next';
import { JiraApiClient, JiraTeamRepository } from '../../../infrastructure/jira-client';
import { JiraApplicationService } from '../../../application/jira/jira-service';
import { mockTeams } from '../../../mocks/teamData';

// Cache for response data (in a real app, use Redis or similar)
let responseCache: {
  data: any;
  timestamp: number;
} | null = null;

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';

    if (useMockData) {
      // Use mock data instead of calling the JIRA API
      if (req.method === 'GET') {
        const { id } = req.query;
        
        if (id) {
          // Fetch specific team from mock data
          const team = mockTeams.find(team => team.id === id);
          if (!team) {
            return res.status(404).json({ error: 'Team not found' });
          }
          return res.status(200).json(team);
        } else {
          // Return all mock teams
          return res.status(200).json(mockTeams);
        }
      }
    }
    
    // Check cache first
    if (responseCache && (Date.now() - responseCache.timestamp) < CACHE_TTL) {
      return res.status(200).json(responseCache.data);
    }

    // Cache miss or expired, fetch fresh data
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const jiraUsername = process.env.JIRA_USERNAME;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    
    if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
      // Fallback to mock data if API credentials are not configured
      if (req.method === 'GET') {
        const { id } = req.query;
        
        if (id) {
          // Fetch specific team from mock data
          const team = mockTeams.find(team => team.id === id);
          if (!team) {
            return res.status(404).json({ error: 'Team not found' });
          }
          return res.status(200).json(team);
        } else {
          // Return all mock teams
          return res.status(200).json(mockTeams);
        }
      }
    }
    
    // Create JIRA client and repositories
    const jiraClient = new JiraApiClient(jiraBaseUrl, jiraUsername, jiraApiToken);
    const teamRepository = new JiraTeamRepository(jiraClient);
    
    // Create application service
    const jiraService = new JiraApplicationService(
      teamRepository,
      null as any, // Not needed for this endpoint
      null as any  // Not needed for this endpoint
    );
    
    // Handle the request based on HTTP method
    if (req.method === 'GET') {
      // Get team ID from query parameters
      const { id } = req.query;
      
      if (id) {
        // Fetch specific team
        const team = await jiraService.getTeamById(id as string);
        if (!team) {
          return res.status(404).json({ error: 'Team not found' });
        }
        
        responseCache = {
          data: team,
          timestamp: Date.now()
        };
        
        return res.status(200).json(team);
      } else {
        // Fetch all teams
        const teams = await jiraService.getAllTeams();
        
        responseCache = {
          data: teams,
          timestamp: Date.now()
        };
        
        return res.status(200).json(teams);
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch teams',
      details: (error as Error).message
    });
  }
}
