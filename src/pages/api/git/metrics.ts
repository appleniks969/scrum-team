import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for Git metrics
const mockGitMetricsData = {
  commitActivity: {
    total: 530,
    byTeam: [
      { team: "Team Alpha", count: 120 },
      { team: "Team Beta", count: 95 },
      { team: "Team Gamma", count: 110 },
      { team: "Team Delta", count: 65 },
      { team: "Team Epsilon", count: 140 }
    ],
    byDay: [
      { date: "2023-03-01", count: 25 },
      { date: "2023-03-02", count: 18 },
      { date: "2023-03-03", count: 22 },
      { date: "2023-03-04", count: 15 },
      { date: "2023-03-05", count: 12 },
      { date: "2023-03-06", count: 28 },
      { date: "2023-03-07", count: 32 }
    ],
    byWeek: [
      { week: "Week 1", count: 120 },
      { week: "Week 2", count: 135 },
      { week: "Week 3", count: 115 },
      { week: "Week 4", count: 160 }
    ],
    byAuthor: [
      { author: "Alex Johnson", count: 32, team: "Team Alpha" },
      { author: "Jordan Smith", count: 25, team: "Team Alpha" },
      { author: "Taylor Roberts", count: 30, team: "Team Alpha" },
      { author: "Morgan Lee", count: 33, team: "Team Alpha" },
      { author: "Riley Chen", count: 28, team: "Team Beta" },
      { author: "Casey Kim", count: 22, team: "Team Beta" },
      { author: "Avery Patel", count: 24, team: "Team Beta" },
      { author: "Quinn Wilson", count: 35, team: "Team Gamma" },
      { author: "Harper Davis", count: 27, team: "Team Gamma" },
      { author: "Skyler Martinez", count: 18, team: "Team Delta" },
      { author: "Drew Thompson", count: 22, team: "Team Delta" },
      { author: "Jamie Rodriguez", count: 40, team: "Team Epsilon" }
    ]
  },
  pullRequests: {
    total: 112,
    open: 14,
    merged: 98,
    byTeam: [
      { team: "Team Alpha", open: 3, merged: 25 },
      { team: "Team Beta", open: 2, merged: 20 },
      { team: "Team Gamma", open: 4, merged: 11 },
      { team: "Team Delta", open: 2, merged: 10 },
      { team: "Team Epsilon", open: 3, merged: 32 }
    ],
    byAuthor: [
      { author: "Alex Johnson", open: 1, merged: 7, team: "Team Alpha" },
      { author: "Jordan Smith", open: 0, merged: 5, team: "Team Alpha" },
      { author: "Taylor Roberts", open: 1, merged: 6, team: "Team Alpha" },
      { author: "Morgan Lee", open: 1, merged: 7, team: "Team Alpha" },
      { author: "Riley Chen", open: 0, merged: 6, team: "Team Beta" },
      { author: "Casey Kim", open: 1, merged: 3, team: "Team Beta" },
      { author: "Avery Patel", open: 1, merged: 4, team: "Team Beta" },
      { author: "Quinn Wilson", open: 2, merged: 2, team: "Team Gamma" },
      { author: "Harper Davis", open: 2, merged: 4, team: "Team Gamma" },
      { author: "Skyler Martinez", open: 1, merged: 2, team: "Team Delta" },
      { author: "Drew Thompson", open: 1, merged: 3, team: "Team Delta" },
      { author: "Jamie Rodriguez", open: 3, merged: 6, team: "Team Epsilon" }
    ],
    ageDistribution: [
      { range: "< 1 day", count: 3 },
      { range: "1-2 days", count: 5 },
      { range: "3-7 days", count: 4 },
      { range: "> 7 days", count: 2 }
    ],
    timeToMerge: {
      average: 2.4, // in days
      byTeam: [
        { team: "Team Alpha", average: 1.8 },
        { team: "Team Beta", average: 2.2 },
        { team: "Team Gamma", average: 3.1 },
        { team: "Team Delta", average: 2.6 },
        { team: "Team Epsilon", average: 2.3 }
      ],
      byAuthor: [
        { author: "Alex Johnson", average: 1.5, team: "Team Alpha" },
        { author: "Jordan Smith", average: 2.1, team: "Team Alpha" },
        { author: "Taylor Roberts", average: 1.7, team: "Team Alpha" },
        { author: "Morgan Lee", average: 1.9, team: "Team Alpha" },
        { author: "Riley Chen", average: 2.0, team: "Team Beta" },
        { author: "Casey Kim", average: 2.3, team: "Team Beta" },
        { author: "Avery Patel", average: 2.4, team: "Team Beta" },
        { author: "Quinn Wilson", average: 3.2, team: "Team Gamma" },
        { author: "Harper Davis", average: 3.0, team: "Team Gamma" },
        { author: "Skyler Martinez", average: 2.5, team: "Team Delta" },
        { author: "Drew Thompson", average: 2.7, team: "Team Delta" },
        { author: "Jamie Rodriguez", average: 2.2, team: "Team Epsilon" }
      ]
    }
  },
  codeReviews: {
    total: 183,
    byTeam: [
      { team: "Team Alpha", count: 42 },
      { team: "Team Beta", count: 34 },
      { team: "Team Gamma", count: 38 },
      { team: "Team Delta", count: 24 },
      { team: "Team Epsilon", count: 45 }
    ],
    byReviewer: [
      { reviewer: "Alex Johnson", count: 12, team: "Team Alpha" },
      { reviewer: "Jordan Smith", count: 8, team: "Team Alpha" },
      { reviewer: "Taylor Roberts", count: 10, team: "Team Alpha" },
      { reviewer: "Morgan Lee", count: 14, team: "Team Alpha" },
      { reviewer: "Riley Chen", count: 10, team: "Team Beta" },
      { reviewer: "Casey Kim", count: 7, team: "Team Beta" },
      { reviewer: "Avery Patel", count: 9, team: "Team Beta" },
      { reviewer: "Quinn Wilson", count: 15, team: "Team Gamma" },
      { reviewer: "Harper Davis", count: 12, team: "Team Gamma" },
      { reviewer: "Skyler Martinez", count: 6, team: "Team Delta" },
      { reviewer: "Drew Thompson", count: 8, team: "Team Delta" },
      { reviewer: "Jamie Rodriguez", count: 18, team: "Team Epsilon" }
    ],
    responseTime: {
      average: 5.2, // in hours
      byTeam: [
        { team: "Team Alpha", average: 4.9 },
        { team: "Team Beta", average: 4.2 },
        { team: "Team Gamma", average: 5.6 },
        { team: "Team Delta", average: 7.4 },
        { team: "Team Epsilon", average: 3.9 }
      ],
      byReviewer: [
        { reviewer: "Alex Johnson", average: 6.2, team: "Team Alpha" },
        { reviewer: "Jordan Smith", average: 4.5, team: "Team Alpha" },
        { reviewer: "Taylor Roberts", average: 5.1, team: "Team Alpha" },
        { reviewer: "Morgan Lee", average: 3.9, team: "Team Alpha" },
        { reviewer: "Riley Chen", average: 2.8, team: "Team Beta" },
        { reviewer: "Casey Kim", average: 5.5, team: "Team Beta" },
        { reviewer: "Avery Patel", average: 4.2, team: "Team Beta" },
        { reviewer: "Quinn Wilson", average: 5.0, team: "Team Gamma" },
        { reviewer: "Harper Davis", average: 3.5, team: "Team Gamma" },
        { reviewer: "Skyler Martinez", average: 8.1, team: "Team Delta" },
        { reviewer: "Drew Thompson", average: 6.7, team: "Team Delta" },
        { reviewer: "Jamie Rodriguez", average: 2.3, team: "Team Epsilon" }
      ]
    },
    reviewQuality: {
      approved: 72,
      changesRequested: 89,
      commented: 22
    }
  },
  repositories: {
    total: 24,
    byTeam: [
      { team: "Team Alpha", count: 5 },
      { team: "Team Beta", count: 4 },
      { team: "Team Gamma", count: 6 },
      { team: "Team Delta", count: 3 },
      { team: "Team Epsilon", count: 6 }
    ],
    mostActive: [
      { name: "frontend-app", commits: 85, team: "Team Alpha" },
      { name: "api-service", commits: 72, team: "Team Beta" },
      { name: "data-pipeline", commits: 68, team: "Team Gamma" },
      { name: "mobile-app", commits: 56, team: "Team Delta" },
      { name: "analytics-platform", commits: 95, team: "Team Epsilon" }
    ]
  }
};

type GitMetricsResponse = typeof mockGitMetricsData;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitMetricsResponse | { error: string } | any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { teamId, authorId, metric, startDate, endDate } = req.query;
    
    // If specific metric is requested
    if (metric) {
      const metricName = metric as string;
      
      // Check if the metric exists
      if (!mockGitMetricsData[metricName as keyof typeof mockGitMetricsData]) {
        return res.status(404).json({ error: `Metric '${metricName}' not found` });
      }
      
      // Return the specific metric data
      const metricData = mockGitMetricsData[metricName as keyof typeof mockGitMetricsData];
      
      // Filter by team if requested
      if (teamId && typeof metricData === 'object' && 'byTeam' in metricData) {
        const teamData = metricData.byTeam.find((team: any) => team.team === teamId);
        
        if (!teamData) {
          return res.status(404).json({ error: `Team '${teamId}' not found for metric '${metricName}'` });
        }
        
        return res.status(200).json({ 
          [metricName]: {
            ...metricData,
            byTeam: [teamData]
          } 
        });
      }
      
      // Filter by author if requested
      if (authorId && typeof metricData === 'object' && 'byAuthor' in metricData) {
        const authorData = metricData.byAuthor.find(
          (author: any) => author.author === authorId || author.reviewer === authorId
        );
        
        if (!authorData) {
          return res.status(404).json({ 
            error: `Author/Reviewer '${authorId}' not found for metric '${metricName}'` 
          });
        }
        
        return res.status(200).json({ 
          [metricName]: {
            ...metricData,
            byAuthor: [authorData]
          } 
        });
      }
      
      // Return the full metric data
      return res.status(200).json({ [metricName]: metricData });
    }
    
    // Filter all data by team if requested
    if (teamId) {
      const filteredData = {
        commitActivity: {
          ...mockGitMetricsData.commitActivity,
          byTeam: mockGitMetricsData.commitActivity.byTeam.filter(team => team.team === teamId),
          byAuthor: mockGitMetricsData.commitActivity.byAuthor.filter(author => author.team === teamId)
        },
        pullRequests: {
          ...mockGitMetricsData.pullRequests,
          byTeam: mockGitMetricsData.pullRequests.byTeam.filter(team => team.team === teamId),
          byAuthor: mockGitMetricsData.pullRequests.byAuthor.filter(author => author.team === teamId),
          timeToMerge: {
            ...mockGitMetricsData.pullRequests.timeToMerge,
            byTeam: mockGitMetricsData.pullRequests.timeToMerge.byTeam.filter(team => team.team === teamId),
            byAuthor: mockGitMetricsData.pullRequests.timeToMerge.byAuthor.filter(author => author.team === teamId)
          }
        },
        codeReviews: {
          ...mockGitMetricsData.codeReviews,
          byTeam: mockGitMetricsData.codeReviews.byTeam.filter(team => team.team === teamId),
          byReviewer: mockGitMetricsData.codeReviews.byReviewer.filter(reviewer => reviewer.team === teamId),
          responseTime: {
            ...mockGitMetricsData.codeReviews.responseTime,
            byTeam: mockGitMetricsData.codeReviews.responseTime.byTeam.filter(team => team.team === teamId),
            byReviewer: mockGitMetricsData.codeReviews.responseTime.byReviewer.filter(reviewer => reviewer.team === teamId)
          }
        },
        repositories: {
          ...mockGitMetricsData.repositories,
          byTeam: mockGitMetricsData.repositories.byTeam.filter(team => team.team === teamId),
          mostActive: mockGitMetricsData.repositories.mostActive.filter(repo => repo.team === teamId)
        }
      };
      
      return res.status(200).json(filteredData);
    }
    
    // Filter all data by author if requested
    if (authorId) {
      const filteredData = {
        commitActivity: {
          ...mockGitMetricsData.commitActivity,
          byAuthor: mockGitMetricsData.commitActivity.byAuthor.filter(author => author.author === authorId)
        },
        pullRequests: {
          ...mockGitMetricsData.pullRequests,
          byAuthor: mockGitMetricsData.pullRequests.byAuthor.filter(author => author.author === authorId),
          timeToMerge: {
            ...mockGitMetricsData.pullRequests.timeToMerge,
            byAuthor: mockGitMetricsData.pullRequests.timeToMerge.byAuthor.filter(author => author.author === authorId)
          }
        },
        codeReviews: {
          ...mockGitMetricsData.codeReviews,
          byReviewer: mockGitMetricsData.codeReviews.byReviewer.filter(reviewer => reviewer.reviewer === authorId),
          responseTime: {
            ...mockGitMetricsData.codeReviews.responseTime,
            byReviewer: mockGitMetricsData.codeReviews.responseTime.byReviewer.filter(reviewer => reviewer.reviewer === authorId)
          }
        }
      };
      
      return res.status(200).json(filteredData);
    }
    
    // Return the full data if no specific filters
    res.status(200).json(mockGitMetricsData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
