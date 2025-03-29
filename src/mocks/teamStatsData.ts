// Mock team statistics data
import { CompletionStats, MemberCompletionStats } from '../hooks/useJiraData';
import { mockTeams } from './teamData';

// Generate mock data for each team
export const generateMockTeamStats = (teamId: string): CompletionStats => {
  const team = mockTeams.find(t => t.id === teamId);
  
  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  // Generate some reasonable mock member stats
  const memberStats: MemberCompletionStats[] = [
    {
      accountId: `${teamId}-member-1`,
      displayName: 'Alex Johnson',
      totalStoryPoints: 35,
      completedStoryPoints: 28,
      completionPercentage: 80
    },
    {
      accountId: `${teamId}-member-2`,
      displayName: 'Sam Li',
      totalStoryPoints: 42,
      completedStoryPoints: 38,
      completionPercentage: 90
    },
    {
      accountId: `${teamId}-member-3`,
      displayName: 'Morgan Taylor',
      totalStoryPoints: 28,
      completedStoryPoints: 21,
      completionPercentage: 75
    },
    {
      accountId: `${teamId}-member-4`,
      displayName: 'Jordan Casey',
      totalStoryPoints: 30,
      completedStoryPoints: 24,
      completionPercentage: 80
    }
  ];
  
  // Calculate team totals based on member stats
  const totalStoryPoints = memberStats.reduce((sum, member) => sum + member.totalStoryPoints, 0);
  const completedStoryPoints = memberStats.reduce((sum, member) => sum + member.completedStoryPoints, 0);
  const completionPercentage = Math.round((completedStoryPoints / totalStoryPoints) * 100);
  
  return {
    teamId: team.id,
    teamName: team.name,
    sprintId: 123, // Mock sprint ID
    sprintName: 'Sprint 42',
    totalStoryPoints,
    completedStoryPoints,
    completionPercentage,
    memberStats,
    date: new Date().toISOString()
  };
};

// Pre-compute stats for each mock team for quick lookup
export const mockTeamStats = mockTeams.reduce<Record<string, CompletionStats>>((acc, team) => {
  acc[team.id] = generateMockTeamStats(team.id);
  return acc;
}, {});
