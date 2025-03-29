// Mock Git metrics data
import { GitMetrics, TeamGitMetrics } from '../hooks/useGitData';
import { mockTeams } from './teamData';

// Generate mock Git metrics for a member
export const generateMemberGitMetrics = (accountId: string): GitMetrics => {
  return {
    accountId,
    commitCount: Math.floor(Math.random() * 50) + 20,
    linesAdded: Math.floor(Math.random() * 2000) + 500,
    linesRemoved: Math.floor(Math.random() * 1000) + 200,
    prCount: Math.floor(Math.random() * 8) + 2,
    prMergedCount: Math.floor(Math.random() * 7) + 1,
    reviewCount: Math.floor(Math.random() * 10) + 5,
    commentCount: Math.floor(Math.random() * 30) + 10,
    avgTimeToMerge: Math.floor(Math.random() * 24) + 4,
    date: new Date().toISOString()
  };
};

// Generate mock Git metrics for a team
export const generateTeamGitMetrics = (teamId: string): TeamGitMetrics => {
  // Use consistent member IDs based on team ID
  const memberIds = [
    `${teamId}-member-1`,
    `${teamId}-member-2`,
    `${teamId}-member-3`,
    `${teamId}-member-4`
  ];
  
  // Generate member metrics
  const memberMetrics = memberIds.reduce<Record<string, GitMetrics>>((acc, memberId) => {
    acc[memberId] = generateMemberGitMetrics(memberId);
    return acc;
  }, {});
  
  // Calculate team totals
  const commitCount = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.commitCount, 0);
  const linesAdded = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.linesAdded, 0);
  const linesRemoved = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.linesRemoved, 0);
  const prCount = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.prCount, 0);
  const prMergedCount = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.prMergedCount, 0);
  const reviewCount = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.reviewCount, 0);
  const commentCount = Object.values(memberMetrics).reduce((sum, metrics) => sum + metrics.commentCount, 0);
  
  return {
    teamId,
    metrics: {
      commitCount,
      linesAdded,
      linesRemoved,
      prCount,
      prMergedCount,
      reviewCount,
      commentCount,
      avgTimeToMerge: Math.floor(Math.random() * 24) + 4,
      date: new Date().toISOString()
    },
    memberMetrics
  };
};

// Generate mock Git metrics for all teams
export const mockTeamGitMetrics = mockTeams.reduce<Record<string, TeamGitMetrics>>((acc, team) => {
  acc[team.id] = generateTeamGitMetrics(team.id);
  return acc;
}, {});
