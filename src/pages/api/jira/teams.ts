// API route for fetching teams
import { NextApiRequest, NextApiResponse } from 'next';
import { JiraFactory } from '../../../infrastructure/factories/jira-factory';
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
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get team ID from query parameters
    const { id } = req.query;
    
    // Check if we should use mock data
    const useMockData = process.env.USE_MOCK_DATA === 'true';

    if (useMockData) {
      // Use mock data instead of calling the JIRA API
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
    
    // Check cache first if no specific ID is requested
    if (!id && responseCache && (Date.now() - responseCache.timestamp) < CACHE_TTL) {
      return res.status(200).json(responseCache.data);
    }

    try {
      // Use the factory to create repositories
      const { teamRepository } = JiraFactory.createRepositories();
      
      if (id) {
        // Fetch specific team
        const team = await teamRepository.findById(id as string);
        if (!team) {
          return res.status(404).json({ error: 'Team not found' });
        }
        
        return res.status(200).json(team);
      } else {
        // Fetch all teams
        const teams = await teamRepository.findAll();
        
        // Update cache
        responseCache = {
          data: teams,
          timestamp: Date.now()
        };
        
        return res.status(200).json({ teams });
      }
    } catch (error) {
      console.error('Error fetching teams from JIRA API:', error);
      
      // Fallback to mock data if API call fails
      if (id) {
        const team = mockTeams.find(team => team.id === id);
        if (!team) {
          return res.status(404).json({ error: 'Team not found' });
        }
        return res.status(200).json(team);
      } else {
        console.warn('Falling back to mock team data due to API error');
        return res.status(200).json({ teams: mockTeams });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch teams',
      details: (error as Error).message
    });
  }
}