import type { NextApiRequest, NextApiResponse } from 'next';

// Sample data - in a real application this would come from your API
const mockMembersData = [
  { id: "user-1", name: "Alex Johnson", teamName: "Team Alpha", metrics: { storyPoints: 24, commits: 32, pullRequests: 8, reviews: 12, responseTime: 6.2 } },
  { id: "user-2", name: "Jordan Smith", teamName: "Team Alpha", metrics: { storyPoints: 18, commits: 25, pullRequests: 5, reviews: 8, responseTime: 4.5 } },
  { id: "user-3", name: "Taylor Roberts", teamName: "Team Alpha", metrics: { storyPoints: 22, commits: 30, pullRequests: 7, reviews: 10, responseTime: 5.1 } },
  { id: "user-4", name: "Morgan Lee", teamName: "Team Alpha", metrics: { storyPoints: 21, commits: 33, pullRequests: 8, reviews: 14, responseTime: 3.9 } },
  { id: "user-5", name: "Riley Chen", teamName: "Team Beta", metrics: { storyPoints: 15, commits: 28, pullRequests: 6, reviews: 10, responseTime: 2.8 } },
  { id: "user-6", name: "Casey Kim", teamName: "Team Beta", metrics: { storyPoints: 19, commits: 22, pullRequests: 4, reviews: 7, responseTime: 5.5 } },
  { id: "user-7", name: "Avery Patel", teamName: "Team Beta", metrics: { storyPoints: 16, commits: 24, pullRequests: 5, reviews: 9, responseTime: 4.2 } },
  { id: "user-8", name: "Quinn Wilson", teamName: "Team Gamma", metrics: { storyPoints: 22, commits: 35, pullRequests: 4, reviews: 15, responseTime: 5.0 } },
  { id: "user-9", name: "Harper Davis", teamName: "Team Gamma", metrics: { storyPoints: 20, commits: 27, pullRequests: 6, reviews: 12, responseTime: 3.5 } },
  { id: "user-10", name: "Skyler Martinez", teamName: "Team Delta", metrics: { storyPoints: 12, commits: 18, pullRequests: 3, reviews: 6, responseTime: 8.1 } },
  { id: "user-11", name: "Drew Thompson", teamName: "Team Delta", metrics: { storyPoints: 14, commits: 22, pullRequests: 4, reviews: 8, responseTime: 6.7 } },
  { id: "user-12", name: "Jamie Rodriguez", teamName: "Team Epsilon", metrics: { storyPoints: 25, commits: 40, pullRequests: 9, reviews: 18, responseTime: 2.3 } }
];

// Additional mock data for member details
const mockMemberDetailsData = {
  "user-1": {
    id: "user-1",
    name: "Alex Johnson",
    teamName: "Team Alpha",
    role: "Senior Developer",
    joinDate: "2021-03-15",
    email: "alex.johnson@example.com",
    metrics: {
      storyPoints: 24,
      commits: 32,
      pullRequests: 8,
      reviews: 12,
      responseTime: 6.2
    },
    sprintPerformance: [
      { sprint: "Sprint 1", storyPoints: 5, commits: 7, prs: 2, reviews: 3 },
      { sprint: "Sprint 2", storyPoints: 6, commits: 8, prs: 2, reviews: 3 },
      { sprint: "Sprint 3", storyPoints: 6, commits: 9, prs: 2, reviews: 3 },
      { sprint: "Sprint 4", storyPoints: 7, commits: 8, prs: 2, reviews: 3 }
    ],
    recentActivity: [
      { date: "2023-03-15", commits: 3, prSubmitted: 1, prReviewed: 2 },
      { date: "2023-03-14", commits: 4, prSubmitted: 0, prReviewed: 1 },
      { date: "2023-03-13", commits: 2, prSubmitted: 1, prReviewed: 0 },
      { date: "2023-03-12", commits: 5, prSubmitted: 0, prReviewed: 2 },
      { date: "2023-03-11", commits: 3, prSubmitted: 0, prReviewed: 1 },
      { date: "2023-03-10", commits: 4, prSubmitted: 1, prReviewed: 0 },
      { date: "2023-03-09", commits: 2, prSubmitted: 0, prReviewed: 1 }
    ],
    topProjects: [
      { name: "Frontend App", storyPoints: 10, commits: 15 },
      { name: "API Service", storyPoints: 8, commits: 12 },
      { name: "Data Pipeline", storyPoints: 6, commits: 5 }
    ],
    reviewQuality: {
      thoroughness: 0.85,
      timeliness: 0.92,
      helpfulness: 0.88
    }
  },
  // Additional member details would be added here...
};

type MembersResponseData = typeof mockMembersData;
type MemberDetailResponseData = typeof mockMemberDetailsData["user-1"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MembersResponseData | MemberDetailResponseData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { id, teamId, startDate, endDate } = req.query;
    
    // If an ID is provided, return details for that specific member
    if (id) {
      const memberId = id as string;
      const memberDetails = mockMemberDetailsData[memberId];
      
      if (!memberDetails) {
        return res.status(404).json({ error: `Member with ID ${memberId} not found` });
      }
      
      // In a real implementation, we would filter data based on date range
      // For now, we'll just return the mock data
      return res.status(200).json(memberDetails);
    }
    
    // Otherwise, return the list of all members, filtered if needed
    let members = [...mockMembersData];
    
    // Filter by team if requested
    if (teamId) {
      members = members.filter(member => member.teamName === teamId);
    }
    
    // In a real implementation, we would filter by date range and apply additional filters
    // For now, we'll just return the filtered data
    
    res.status(200).json(members);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
