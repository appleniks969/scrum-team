import type { NextApiRequest, NextApiResponse } from 'next';

// This would typically come from our services and repositories
// For now, we'll use mock data
const mockData = {
  storyPoints: {
    total: 359,
    completed: 295,
    completionPercentage: 82.17,
    trend: 3.5
  },
  git: {
    commits: 530,
    pullRequests: 112,
    mergedPullRequests: 98,
    openPullRequests: 14,
    trend: 5.2
  },
  teams: {
    total: 10,
    active: 10
  },
  weeklyTrends: [
    { week: 'Week 1', storyPoints: 45, commits: 62, prs: 15 },
    { week: 'Week 2', storyPoints: 52, commits: 78, prs: 18 },
    { week: 'Week 3', storyPoints: 48, commits: 70, prs: 16 },
    { week: 'Week 4', storyPoints: 60, commits: 85, prs: 22 }
  ],
  teamMetrics: [
    { name: 'Team Alpha', storyPoints: 85, commits: 120, prs: 28, efficiency: 0.85 },
    { name: 'Team Beta', storyPoints: 72, commits: 95, prs: 22, efficiency: 0.80 },
    { name: 'Team Gamma', storyPoints: 65, commits: 110, prs: 15, efficiency: 0.93 },
    { name: 'Team Delta', storyPoints: 45, commits: 65, prs: 12, efficiency: 0.75 },
    { name: 'Team Epsilon', storyPoints: 92, commits: 140, prs: 35, efficiency: 0.84 }
  ],
  correlationData: [
    { name: 'Team Alpha', storyPoints: 85, commitCount: 120, ratio: 0.71 },
    { name: 'Team Beta', storyPoints: 72, commitCount: 95, ratio: 0.76 },
    { name: 'Team Gamma', storyPoints: 65, commitCount: 110, ratio: 0.59 },
    { name: 'Team Delta', storyPoints: 45, commitCount: 65, ratio: 0.69 },
    { name: 'Team Epsilon', storyPoints: 92, commitCount: 140, ratio: 0.66 }
  ]
};

type ResponseData = {
  storyPoints: {
    total: number;
    completed: number;
    completionPercentage: number;
    trend: number;
  };
  git: {
    commits: number;
    pullRequests: number;
    mergedPullRequests: number;
    openPullRequests: number;
    trend: number;
  };
  teams: {
    total: number;
    active: number;
  };
  weeklyTrends: {
    week: string;
    storyPoints: number;
    commits: number;
    prs: number;
  }[];
  teamMetrics: {
    name: string;
    storyPoints: number;
    commits: number;
    prs: number;
    efficiency: number;
  }[];
  correlationData: {
    name: string;
    storyPoints: number;
    commitCount: number;
    ratio: number;
  }[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { startDate, endDate, teamId } = req.query;
    
    // In a real implementation, we would use these parameters to filter the data
    // For now, we'll just return the mock data
    
    res.status(200).json(mockData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
