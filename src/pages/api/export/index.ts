import type { NextApiRequest, NextApiResponse } from 'next';
import { normalizeExportParams } from '../../../utils/exportUtils';

// Sample export data - in a real app, this would be fetched from your database or APIs
const mockExportData = {
  jira: {
    teams: [
      { 
        id: "team-alpha", 
        name: "Team Alpha", 
        sprint: "Sprint 4",
        plannedPoints: 32,
        completedPoints: 25, 
        completionRate: 0.78,
        remainingPoints: 7,
        issues: 35,
        issuesDone: 18,
        issuesInProgress: 8,
        issuesToDo: 5,
        issuesCodeReview: 4
      },
      { 
        id: "team-beta", 
        name: "Team Beta", 
        sprint: "Sprint 4",
        plannedPoints: 24,
        completedPoints: 20, 
        completionRate: 0.83,
        remainingPoints: 4,
        issues: 30,
        issuesDone: 15,
        issuesInProgress: 6,
        issuesToDo: 4,
        issuesCodeReview: 5
      }
    ],
    members: [
      { name: "Alex Johnson", team: "Team Alpha", assigned: 10, completed: 5, percentage: 50 },
      { name: "Jordan Smith", team: "Team Alpha", assigned: 16, completed: 8, percentage: 50 },
      { name: "Taylor Roberts", team: "Team Alpha", assigned: 5, completed: 0, percentage: 0 },
      { name: "Morgan Lee", team: "Team Alpha", assigned: 3, completed: 3, percentage: 100 },
      { name: "Riley Chen", team: "Team Beta", assigned: 8, completed: 6, percentage: 75 },
      { name: "Casey Kim", team: "Team Beta", assigned: 7, completed: 4, percentage: 57.1 },
      { name: "Avery Patel", team: "Team Beta", assigned: 9, completed: 5, percentage: 55.6 }
    ],
    sprints: [
      { 
        name: "Sprint 1", 
        startDate: "2023-01-01", 
        endDate: "2023-01-14", 
        plannedPoints: 65, 
        completedPoints: 52, 
        completionRate: 0.80
      },
      { 
        name: "Sprint 2", 
        startDate: "2023-01-15", 
        endDate: "2023-01-28", 
        plannedPoints: 72, 
        completedPoints: 63, 
        completionRate: 0.88
      },
      { 
        name: "Sprint 3", 
        startDate: "2023-01-29", 
        endDate: "2023-02-11", 
        plannedPoints: 68, 
        completedPoints: 54, 
        completionRate: 0.79
      },
      { 
        name: "Sprint 4", 
        startDate: "2023-02-12", 
        endDate: "2023-02-25", 
        plannedPoints: 90, 
        completedPoints: 72, 
        completionRate: 0.80
      }
    ]
  },
  git: {
    commits: [
      { author: "Alex Johnson", team: "Team Alpha", count: 32, date: "2023-02" },
      { author: "Jordan Smith", team: "Team Alpha", count: 25, date: "2023-02" },
      { author: "Taylor Roberts", team: "Team Alpha", count: 30, date: "2023-02" },
      { author: "Morgan Lee", team: "Team Alpha", count: 33, date: "2023-02" },
      { author: "Riley Chen", team: "Team Beta", count: 28, date: "2023-02" },
      { author: "Casey Kim", team: "Team Beta", count: 22, date: "2023-02" },
      { author: "Avery Patel", team: "Team Beta", count: 24, date: "2023-02" }
    ],
    pullRequests: [
      { author: "Alex Johnson", team: "Team Alpha", open: 1, merged: 7, timeToMerge: 1.5 },
      { author: "Jordan Smith", team: "Team Alpha", open: 0, merged: 5, timeToMerge: 2.1 },
      { author: "Taylor Roberts", team: "Team Alpha", open: 1, merged: 6, timeToMerge: 1.7 },
      { author: "Morgan Lee", team: "Team Alpha", open: 1, merged: 7, timeToMerge: 1.9 },
      { author: "Riley Chen", team: "Team Beta", open: 0, merged: 6, timeToMerge: 2.0 },
      { author: "Casey Kim", team: "Team Beta", open: 1, merged: 3, timeToMerge: 2.3 },
      { author: "Avery Patel", team: "Team Beta", open: 1, merged: 4, timeToMerge: 2.4 }
    ],
    codeReviews: [
      { reviewer: "Alex Johnson", team: "Team Alpha", count: 12, responseTime: 6.2 },
      { reviewer: "Jordan Smith", team: "Team Alpha", count: 8, responseTime: 4.5 },
      { reviewer: "Taylor Roberts", team: "Team Alpha", count: 10, responseTime: 5.1 },
      { reviewer: "Morgan Lee", team: "Team Alpha", count: 14, responseTime: 3.9 },
      { reviewer: "Riley Chen", team: "Team Beta", count: 10, responseTime: 2.8 },
      { reviewer: "Casey Kim", team: "Team Beta", count: 7, responseTime: 5.5 },
      { reviewer: "Avery Patel", team: "Team Beta", count: 9, responseTime: 4.2 }
    ]
  },
  teams: [
    { 
      id: "team-alpha", 
      name: "Team Alpha", 
      storyPoints: { completed: 85, total: 100 }, 
      commits: 120, 
      pullRequests: 28, 
      reviews: 44,
      efficiency: 0.85,
      velocityTrend: 0.10,
      planningAccuracy: 0.85,
      consistency: 0.92
    },
    { 
      id: "team-beta", 
      name: "Team Beta", 
      storyPoints: { completed: 72, total: 90 }, 
      commits: 95, 
      pullRequests: 22, 
      reviews: 26,
      efficiency: 0.80,
      velocityTrend: 0.07,
      planningAccuracy: 0.80,
      consistency: 0.87
    }
  ],
  members: [
    { 
      name: "Alex Johnson", 
      team: "Team Alpha", 
      storyPoints: 24, 
      commits: 32, 
      pullRequests: 8, 
      reviews: 12, 
      responseTime: 6.2,
      efficiency: 0.75,
      consistency: 0.82
    },
    { 
      name: "Jordan Smith", 
      team: "Team Alpha", 
      storyPoints: 18, 
      commits: 25, 
      pullRequests: 5, 
      reviews: 8, 
      responseTime: 4.5,
      efficiency: 0.72,
      consistency: 0.78
    },
    { 
      name: "Riley Chen", 
      team: "Team Beta", 
      storyPoints: 15, 
      commits: 28, 
      pullRequests: 6, 
      reviews: 10, 
      responseTime: 2.8,
      efficiency: 0.54,
      consistency: 0.91
    }
  ]
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get export parameters
    const { 
      type = 'csv', 
      dataSource = 'all', 
      dateRange = 'month',
      teamId,
      startDate,
      endDate
    } = req.query;
    
    // Normalize and validate parameters
    try {
      const params = normalizeExportParams(
        type as string,
        dataSource as string,
        dateRange as string,
        teamId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );
      
      // Filter data based on parameters
      let exportData: any;
      
      // Filter by data source
      if (params.dataSource === 'all') {
        exportData = mockExportData;
      } else {
        exportData = { [params.dataSource]: mockExportData[params.dataSource as keyof typeof mockExportData] };
      }
      
      // Filter by team if specified
      if (params.teamId) {
        Object.keys(exportData).forEach(source => {
          if (Array.isArray(exportData[source])) {
            // Direct array of teams
            exportData[source] = exportData[source].filter((item: any) => 
              item.id === params.teamId || item.team === params.teamId
            );
          } else if (exportData[source] && typeof exportData[source] === 'object') {
            // Object with arrays of data
            Object.keys(exportData[source]).forEach(key => {
              if (Array.isArray(exportData[source][key])) {
                exportData[source][key] = exportData[source][key].filter((item: any) => 
                  item.id === params.teamId || item.team === params.teamId
                );
              }
            });
          }
        });
      }
      
      // In a real app, you would format data for the requested export type
      // and return the appropriate response (file download, URL, etc.)
      
      // For this example, we'll just return the filtered data with export parameters
      return res.status(200).json({
        exportParams: params,
        data: exportData
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error('Export API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
