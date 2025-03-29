import type { NextApiRequest, NextApiResponse } from 'next';

// Sample data - in a real application this would come from the JIRA API
const mockStoryPointsData = {
  teams: [
    {
      id: "team-alpha",
      name: "Team Alpha",
      sprints: [
        {
          id: 1001,
          name: "Sprint 1",
          startDate: "2023-01-01",
          endDate: "2023-01-14",
          storyPoints: {
            total: 25,
            completed: 18,
            completionRate: 0.72
          }
        },
        {
          id: 1002,
          name: "Sprint 2",
          startDate: "2023-01-15",
          endDate: "2023-01-28",
          storyPoints: {
            total: 30,
            completed: 22,
            completionRate: 0.73
          }
        },
        {
          id: 1003,
          name: "Sprint 3",
          startDate: "2023-01-29",
          endDate: "2023-02-11",
          storyPoints: {
            total: 28,
            completed: 20,
            completionRate: 0.71
          }
        },
        {
          id: 1004,
          name: "Sprint 4",
          startDate: "2023-02-12",
          endDate: "2023-02-25",
          storyPoints: {
            total: 32,
            completed: 25,
            completionRate: 0.78
          }
        }
      ],
      issues: [
        {
          id: "ALPHA-123",
          summary: "Implement user authentication",
          storyPoints: 5,
          status: "Done",
          assignee: "user-1"
        },
        {
          id: "ALPHA-124",
          summary: "Create dashboard UI",
          storyPoints: 8,
          status: "Done",
          assignee: "user-2"
        },
        {
          id: "ALPHA-125",
          summary: "Integrate API endpoints",
          storyPoints: 5,
          status: "In Progress",
          assignee: "user-3"
        },
        {
          id: "ALPHA-126",
          summary: "Fix security vulnerabilities",
          storyPoints: 3,
          status: "Done",
          assignee: "user-4"
        },
        {
          id: "ALPHA-127",
          summary: "Add unit tests",
          storyPoints: 5,
          status: "To Do",
          assignee: "user-1"
        },
        {
          id: "ALPHA-128",
          summary: "Implement data visualization",
          storyPoints: 8,
          status: "In Progress",
          assignee: "user-2"
        }
      ],
      members: [
        {
          id: "user-1",
          name: "Alex Johnson",
          storyPoints: {
            assigned: 10,
            completed: 5,
            inProgress: 0,
            toDo: 5
          }
        },
        {
          id: "user-2",
          name: "Jordan Smith",
          storyPoints: {
            assigned: 16,
            completed: 8,
            inProgress: 8,
            toDo: 0
          }
        },
        {
          id: "user-3",
          name: "Taylor Roberts",
          storyPoints: {
            assigned: 5,
            completed: 0,
            inProgress: 5,
            toDo: 0
          }
        },
        {
          id: "user-4",
          name: "Morgan Lee",
          storyPoints: {
            assigned: 3,
            completed: 3,
            inProgress: 0,
            toDo: 0
          }
        }
      ]
    },
    // Additional teams would be added here...
  ],
  totalStoryPointsCompleted: 295,
  totalStoryPointsPlanned: 359,
  completionRate: 0.82,
  velocityTrend: [
    { sprint: "Sprint 1", velocity: 65 },
    { sprint: "Sprint 2", velocity: 72 },
    { sprint: "Sprint 3", velocity: 68 },
    { sprint: "Sprint 4", velocity: 90 }
  ]
};

type StoryPointsResponse = typeof mockStoryPointsData;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoryPointsResponse | { team: any } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { teamId, sprintId, memberId, startDate, endDate } = req.query;
    
    // If teamId is provided, return data for that specific team
    if (teamId) {
      const team = mockStoryPointsData.teams.find(t => t.id === teamId);
      
      if (!team) {
        return res.status(404).json({ error: `Team with ID ${teamId} not found` });
      }
      
      // Filter sprint data if sprintId is provided
      if (sprintId) {
        const sprint = team.sprints.find(s => s.id === Number(sprintId));
        
        if (!sprint) {
          return res.status(404).json({ error: `Sprint with ID ${sprintId} not found for team ${teamId}` });
        }
        
        return res.status(200).json({
          team: {
            ...team,
            sprints: [sprint],
            issues: team.issues.filter(issue => 
              // In a real implementation, we would use JIRA's API to filter issues by sprint
              // For now, we'll just return all issues
              true
            )
          }
        });
      }
      
      // Filter by member if requested
      if (memberId) {
        const member = team.members.find(m => m.id === memberId);
        
        if (!member) {
          return res.status(404).json({ error: `Member with ID ${memberId} not found for team ${teamId}` });
        }
        
        return res.status(200).json({
          team: {
            ...team,
            members: [member],
            issues: team.issues.filter(issue => issue.assignee === memberId)
          }
        });
      }
      
      // Otherwise, return the full team data
      return res.status(200).json({ team });
    }
    
    // If no specific filters, return the full data
    res.status(200).json(mockStoryPointsData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
