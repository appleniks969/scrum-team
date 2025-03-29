import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for correlation analytics
const mockCorrelationData = {
  storyPointToCommitRatio: {
    teams: [
      { name: "Team Alpha", storyPoints: 85, commits: 120, ratio: 0.71, efficiency: 0.85 },
      { name: "Team Beta", storyPoints: 72, commits: 95, ratio: 0.76, efficiency: 0.80 },
      { name: "Team Gamma", storyPoints: 65, commits: 110, ratio: 0.59, efficiency: 0.93 },
      { name: "Team Delta", storyPoints: 45, commits: 65, ratio: 0.69, efficiency: 0.75 },
      { name: "Team Epsilon", storyPoints: 92, commits: 140, ratio: 0.66, efficiency: 0.84 }
    ],
    members: [
      { name: "Alex Johnson", team: "Team Alpha", storyPoints: 24, commits: 32, ratio: 0.75 },
      { name: "Jordan Smith", team: "Team Alpha", storyPoints: 18, commits: 25, ratio: 0.72 },
      { name: "Taylor Roberts", team: "Team Alpha", storyPoints: 22, commits: 30, ratio: 0.73 },
      { name: "Morgan Lee", team: "Team Alpha", storyPoints: 21, commits: 33, ratio: 0.64 },
      { name: "Riley Chen", team: "Team Beta", storyPoints: 15, commits: 28, ratio: 0.54 },
      { name: "Casey Kim", team: "Team Beta", storyPoints: 19, commits: 22, ratio: 0.86 },
      { name: "Avery Patel", team: "Team Beta", storyPoints: 16, commits: 24, ratio: 0.67 },
      { name: "Quinn Wilson", team: "Team Gamma", storyPoints: 22, commits: 35, ratio: 0.63 },
      { name: "Harper Davis", team: "Team Gamma", storyPoints: 20, commits: 27, ratio: 0.74 },
      { name: "Skyler Martinez", team: "Team Delta", storyPoints: 12, commits: 18, ratio: 0.67 },
      { name: "Drew Thompson", team: "Team Delta", storyPoints: 14, commits: 22, ratio: 0.64 },
      { name: "Jamie Rodriguez", team: "Team Epsilon", storyPoints: 25, commits: 40, ratio: 0.63 }
    ]
  },
  planningAccuracy: {
    teams: [
      { name: "Team Alpha", plannedPoints: 100, completedPoints: 85, accuracy: 0.85 },
      { name: "Team Beta", plannedPoints: 90, completedPoints: 72, accuracy: 0.80 },
      { name: "Team Gamma", plannedPoints: 70, completedPoints: 65, accuracy: 0.93 },
      { name: "Team Delta", plannedPoints: 60, completedPoints: 45, accuracy: 0.75 },
      { name: "Team Epsilon", plannedPoints: 110, completedPoints: 92, accuracy: 0.84 }
    ],
    trend: [
      { sprint: "Sprint 1", plannedPoints: 65, completedPoints: 52, accuracy: 0.80 },
      { sprint: "Sprint 2", plannedPoints: 72, completedPoints: 63, accuracy: 0.88 },
      { sprint: "Sprint 3", plannedPoints: 68, completedPoints: 54, accuracy: 0.79 },
      { sprint: "Sprint 4", plannedPoints: 90, completedPoints: 72, accuracy: 0.80 }
    ]
  },
  velocity: {
    teams: [
      { name: "Team Alpha", sprint1: 18, sprint2: 22, sprint3: 20, sprint4: 25, trend: 0.10 },
      { name: "Team Beta", sprint1: 16, sprint2: 19, sprint3: 17, sprint4: 20, trend: 0.07 },
      { name: "Team Gamma", sprint1: 14, sprint2: 16, sprint3: 15, sprint4: 20, trend: 0.14 },
      { name: "Team Delta", sprint1: 10, sprint2: 11, sprint3: 13, sprint4: 11, trend: 0.04 },
      { name: "Team Epsilon", sprint1: 21, sprint2: 23, sprint3: 20, sprint4: 28, trend: 0.11 }
    ],
    overall: [
      { sprint: "Sprint 1", velocity: 79 },
      { sprint: "Sprint 2", velocity: 91 },
      { sprint: "Sprint 3", velocity: 85 },
      { sprint: "Sprint 4", velocity: 104 }
    ]
  },
  consistency: {
    teams: [
      { name: "Team Alpha", consistency: 0.92, variability: 0.08 },
      { name: "Team Beta", consistency: 0.87, variability: 0.13 },
      { name: "Team Gamma", consistency: 0.89, variability: 0.11 },
      { name: "Team Delta", consistency: 0.81, variability: 0.19 },
      { name: "Team Epsilon", consistency: 0.85, variability: 0.15 }
    ],
    sprintData: [
      { 
        sprint: "Sprint 1", 
        teams: [
          { name: "Team Alpha", planned: 20, completed: 18, consistency: 0.90 },
          { name: "Team Beta", planned: 18, completed: 16, consistency: 0.89 },
          { name: "Team Gamma", planned: 16, completed: 14, consistency: 0.88 },
          { name: "Team Delta", planned: 12, completed: 10, consistency: 0.83 },
          { name: "Team Epsilon", planned: 24, completed: 21, consistency: 0.88 }
        ]
      },
      { 
        sprint: "Sprint 2", 
        teams: [
          { name: "Team Alpha", planned: 24, completed: 22, consistency: 0.92 },
          { name: "Team Beta", planned: 20, completed: 19, consistency: 0.95 },
          { name: "Team Gamma", planned: 18, completed: 16, consistency: 0.89 },
          { name: "Team Delta", planned: 14, completed: 11, consistency: 0.79 },
          { name: "Team Epsilon", planned: 26, completed: 23, consistency: 0.88 }
        ]
      },
      { 
        sprint: "Sprint 3", 
        teams: [
          { name: "Team Alpha", planned: 22, completed: 20, consistency: 0.91 },
          { name: "Team Beta", planned: 19, completed: 17, consistency: 0.89 },
          { name: "Team Gamma", planned: 16, completed: 15, consistency: 0.94 },
          { name: "Team Delta", planned: 15, completed: 13, consistency: 0.87 },
          { name: "Team Epsilon", planned: 22, completed: 20, consistency: 0.91 }
        ]
      },
      { 
        sprint: "Sprint 4", 
        teams: [
          { name: "Team Alpha", planned: 26, completed: 25, consistency: 0.96 },
          { name: "Team Beta", planned: 21, completed: 20, consistency: 0.95 },
          { name: "Team Gamma", planned: 20, completed: 20, consistency: 1.00 },
          { name: "Team Delta", planned: 13, completed: 11, consistency: 0.85 },
          { name: "Team Epsilon", planned: 28, completed: 28, consistency: 1.00 }
        ]
      }
    ]
  },
  insights: [
    {
      id: "insight-1",
      type: "observation",
      category: "planning",
      title: "High Correlation Between Story Points and Commits",
      description: "Teams with higher story point completion generally have more commit activity, suggesting good alignment between planning and execution.",
      relevance: "high",
      teams: ["Team Alpha", "Team Epsilon"]
    },
    {
      id: "insight-2",
      type: "anomaly",
      category: "execution",
      title: "Low Story Point to Commit Ratio for Team Gamma",
      description: "Team Gamma has the lowest story point to commit ratio (0.59), indicating they might be making many small commits or struggling with larger stories.",
      relevance: "medium",
      teams: ["Team Gamma"]
    },
    {
      id: "insight-3",
      type: "trend",
      category: "velocity",
      title: "Increasing Velocity Across Teams",
      description: "Overall team velocity has increased by 32% from Sprint 1 to Sprint 4, with Team Gamma showing the strongest growth at 43%.",
      relevance: "high",
      teams: ["Team Gamma"]
    },
    {
      id: "insight-4",
      type: "recommendation",
      category: "consistency",
      title: "Consistency Improvement Opportunity for Team Delta",
      description: "Team Delta has the lowest consistency score (0.81). Consider reviewing their estimation and planning process to improve predictability.",
      relevance: "medium",
      teams: ["Team Delta"]
    },
    {
      id: "insight-5",
      type: "observation",
      category: "individual",
      title: "High Performer Identified",
      description: "Jamie Rodriguez (Team Epsilon) consistently delivers high story points with efficient commit ratios, demonstrating strong productivity.",
      relevance: "medium",
      teams: ["Team Epsilon"]
    }
  ]
};

type CorrelationResponse = typeof mockCorrelationData;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CorrelationResponse | { error: string } | any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { teamId, metric, startDate, endDate } = req.query;
    
    // If specific metric is requested
    if (metric) {
      const metricName = metric as string;
      
      // Check if the metric exists
      if (!mockCorrelationData[metricName as keyof typeof mockCorrelationData]) {
        return res.status(404).json({ error: `Metric '${metricName}' not found` });
      }
      
      // Return the specific metric data
      const metricData = mockCorrelationData[metricName as keyof typeof mockCorrelationData];
      
      // Filter by team if requested
      if (teamId && typeof metricData === 'object') {
        if ('teams' in metricData) {
          const teamData = metricData.teams.find((team: any) => team.name === teamId);
          
          if (!teamData) {
            return res.status(404).json({ error: `Team '${teamId}' not found for metric '${metricName}'` });
          }
          
          return res.status(200).json({ 
            [metricName]: {
              ...metricData,
              teams: [teamData]
            } 
          });
        }
        
        if ('members' in metricData) {
          const memberData = metricData.members.filter((member: any) => member.team === teamId);
          
          if (memberData.length === 0) {
            return res.status(404).json({ error: `No members found for team '${teamId}' in metric '${metricName}'` });
          }
          
          return res.status(200).json({ 
            [metricName]: {
              ...metricData,
              members: memberData
            } 
          });
        }
      }
      
      // Return the full metric data
      return res.status(200).json({ [metricName]: metricData });
    }
    
    // Filter insights by team if requested
    if (teamId) {
      const filteredInsights = mockCorrelationData.insights.filter(insight => 
        insight.teams.includes(teamId as string)
      );
      
      // Filter other metrics by team
      const filteredStoryPointToCommitRatio = {
        teams: mockCorrelationData.storyPointToCommitRatio.teams.filter(team => team.name === teamId),
        members: mockCorrelationData.storyPointToCommitRatio.members.filter(member => member.team === teamId)
      };
      
      const filteredPlanningAccuracy = {
        teams: mockCorrelationData.planningAccuracy.teams.filter(team => team.name === teamId),
        trend: mockCorrelationData.planningAccuracy.trend // Can't filter trend by team
      };
      
      const filteredVelocity = {
        teams: mockCorrelationData.velocity.teams.filter(team => team.name === teamId),
        overall: mockCorrelationData.velocity.overall // Can't filter overall by team
      };
      
      const filteredConsistency = {
        teams: mockCorrelationData.consistency.teams.filter(team => team.name === teamId),
        sprintData: mockCorrelationData.consistency.sprintData.map(sprint => ({
          ...sprint,
          teams: sprint.teams.filter(team => team.name === teamId)
        }))
      };
      
      return res.status(200).json({
        storyPointToCommitRatio: filteredStoryPointToCommitRatio,
        planningAccuracy: filteredPlanningAccuracy,
        velocity: filteredVelocity,
        consistency: filteredConsistency,
        insights: filteredInsights
      });
    }
    
    // Return the full data if no specific filters
    res.status(200).json(mockCorrelationData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
