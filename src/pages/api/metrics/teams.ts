import type { NextApiRequest, NextApiResponse } from 'next';

// This would typically come from our services and repositories
// For now, we'll use mock data
const mockTeamsData = [
  { 
    id: "team-alpha", 
    name: "Team Alpha", 
    storyPoints: { completed: 85, total: 100 }, 
    commits: 120, 
    pullRequests: 28, 
    efficiency: 0.85 
  },
  { 
    id: "team-beta", 
    name: "Team Beta", 
    storyPoints: { completed: 72, total: 90 }, 
    commits: 95, 
    pullRequests: 22, 
    efficiency: 0.80 
  },
  { 
    id: "team-gamma", 
    name: "Team Gamma", 
    storyPoints: { completed: 65, total: 70 }, 
    commits: 110, 
    pullRequests: 15, 
    efficiency: 0.93 
  },
  { 
    id: "team-delta", 
    name: "Team Delta", 
    storyPoints: { completed: 45, total: 60 }, 
    commits: 65, 
    pullRequests: 12, 
    efficiency: 0.75 
  },
  { 
    id: "team-epsilon", 
    name: "Team Epsilon", 
    storyPoints: { completed: 92, total: 110 }, 
    commits: 140, 
    pullRequests: 35, 
    efficiency: 0.84 
  },
  { 
    id: "team-zeta", 
    name: "Team Zeta", 
    storyPoints: { completed: 57, total: 80 }, 
    commits: 75, 
    pullRequests: 20, 
    efficiency: 0.71 
  },
  { 
    id: "team-eta", 
    name: "Team Eta", 
    storyPoints: { completed: 68, total: 75 }, 
    commits: 88, 
    pullRequests: 18, 
    efficiency: 0.91 
  },
  { 
    id: "team-theta", 
    name: "Team Theta", 
    storyPoints: { completed: 79, total: 95 }, 
    commits: 105, 
    pullRequests: 25, 
    efficiency: 0.83 
  }
];

// Additional mock data for team details, with sprint data, members, etc.
const mockTeamDetailsData = {
  "team-alpha": {
    id: "team-alpha",
    name: "Team Alpha",
    storyPoints: { completed: 85, total: 100 },
    commits: 120,
    pullRequests: 28,
    efficiency: 0.85,
    sprintData: [
      { sprint: "Sprint 1", storyPoints: 18, commits: 25, prs: 6, efficiency: 0.81 },
      { sprint: "Sprint 2", storyPoints: 22, commits: 30, prs: 7, efficiency: 0.83 },
      { sprint: "Sprint 3", storyPoints: 20, commits: 32, prs: 8, efficiency: 0.87 },
      { sprint: "Sprint 4", storyPoints: 25, commits: 33, prs: 7, efficiency: 0.89 }
    ],
    members: [
      { id: "user-1", name: "Alex Johnson", teamName: "Team Alpha", metrics: { storyPoints: 24, commits: 32, pullRequests: 8, reviews: 12, responseTime: 6.2 } },
      { id: "user-2", name: "Jordan Smith", teamName: "Team Alpha", metrics: { storyPoints: 18, commits: 25, pullRequests: 5, reviews: 8, responseTime: 4.5 } },
      { id: "user-3", name: "Taylor Roberts", teamName: "Team Alpha", metrics: { storyPoints: 22, commits: 30, pullRequests: 7, reviews: 10, responseTime: 5.1 } },
      { id: "user-4", name: "Morgan Lee", teamName: "Team Alpha", metrics: { storyPoints: 21, commits: 33, pullRequests: 8, reviews: 14, responseTime: 3.9 } }
    ],
    commitToPointRatio: [
      { name: "Alex", storyPoints: 24, commitCount: 32, ratio: 0.75 },
      { name: "Jordan", storyPoints: 18, commitCount: 25, ratio: 0.72 },
      { name: "Taylor", storyPoints: 22, commitCount: 30, ratio: 0.73 },
      { name: "Morgan", storyPoints: 21, commitCount: 33, ratio: 0.64 }
    ]
  },
  // Additional team details would be added here...
};

type TeamsResponseData = typeof mockTeamsData;
type TeamDetailResponseData = typeof mockTeamDetailsData["team-alpha"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeamsResponseData | TeamDetailResponseData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { id, startDate, endDate } = req.query;
    
    // If an ID is provided, return details for that specific team
    if (id) {
      const teamId = id as string;
      const teamDetails = mockTeamDetailsData[teamId];
      
      if (!teamDetails) {
        return res.status(404).json({ error: `Team with ID ${teamId} not found` });
      }
      
      // In a real implementation, we would filter data based on date range
      // For now, we'll just return the mock data
      return res.status(200).json(teamDetails);
    }
    
    // Otherwise, return the list of all teams
    let teams = [...mockTeamsData];
    
    // In a real implementation, we would filter and sort teams based on query parameters
    // For now, we'll just return the mock data
    
    res.status(200).json(teams);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
