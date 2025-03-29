// Mock data for integrated metrics
import { CorrelationInsight, IntegratedTeamMetrics, OverviewMetrics } from '../hooks/useIntegratedMetrics';
import { mockTeams } from './teamData';
import { mockTeamStats } from './teamStatsData';
import { GitMetrics, TeamGitMetrics } from '../hooks/useGitData';

// Generate mock git metrics for a member
const generateMockMemberGitMetrics = (accountId: string): GitMetrics => {
  return {
    accountId,
    commitCount: Math.floor(Math.random() * 50) + 20,
    linesAdded: Math.floor(Math.random() * 2000) + 500,
    linesRemoved: Math.floor(Math.random() * 1000) + 200,
    pullRequestsCreated: Math.floor(Math.random() * 8) + 2,
    pullRequestsReviewed: Math.floor(Math.random() * 10) + 5,
    reviewComments: Math.floor(Math.random() * 30) + 10,
    avgTimeToMerge: Math.floor(Math.random() * 24) + 4,
    date: new Date().toISOString()
  };
};

// Generate mock git metrics for a team
const generateMockTeamGitMetrics = (teamId: string): TeamGitMetrics => {
  return {
    teamId,
    commitCount: Math.floor(Math.random() * 200) + 100,
    linesAdded: Math.floor(Math.random() * 8000) + 2000,
    linesRemoved: Math.floor(Math.random() * 4000) + 1000,
    pullRequestsCreated: Math.floor(Math.random() * 30) + 10,
    pullRequestsReviewed: Math.floor(Math.random() * 40) + 15,
    reviewComments: Math.floor(Math.random() * 100) + 50,
    avgTimeToMerge: Math.floor(Math.random() * 24) + 4,
    date: new Date().toISOString()
  };
};

// Generate mock integrated team metrics
export const generateMockIntegratedTeamMetrics = (teamId: string): IntegratedTeamMetrics => {
  const team = mockTeams.find(t => t.id === teamId);
  const teamStats = mockTeamStats[teamId];
  
  if (!team || !teamStats) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  const gitMetrics = generateMockTeamGitMetrics(teamId);
  
  return {
    teamId: team.id,
    teamName: team.name,
    jiraMetrics: teamStats,
    gitMetrics,
    correlations: {
      storyPointToCommitRatio: parseFloat((gitMetrics.commitCount / teamStats.totalStoryPoints).toFixed(2)),
      planningAccuracy: parseFloat((Math.random() * 30 + 70).toFixed(2)),
      velocity: parseFloat((Math.random() * 10 + 20).toFixed(2)),
      consistency: parseFloat((Math.random() * 20 + 75).toFixed(2))
    },
    date: new Date().toISOString()
  };
};

// Generate mock integrated member metrics
export const generateMockMemberIntegratedMetrics = (teamId: string, memberId: string) => {
  const team = mockTeams.find(t => t.id === teamId);
  const teamStats = mockTeamStats[teamId];
  
  if (!team || !teamStats) {
    throw new Error(`Team with ID ${teamId} not found`);
  }
  
  const memberStats = teamStats.memberStats.find(m => m.accountId === memberId);
  
  if (!memberStats) {
    throw new Error(`Member with ID ${memberId} not found`);
  }
  
  const gitMetrics = generateMockMemberGitMetrics(memberId);
  
  return {
    accountId: memberId,
    displayName: memberStats.displayName,
    teamId: team.id,
    teamName: team.name,
    jiraMetrics: memberStats,
    gitMetrics,
    correlations: {
      storyPointToCommitRatio: parseFloat((gitMetrics.commitCount / memberStats.totalStoryPoints).toFixed(2)),
      reviewQuality: parseFloat((Math.random() * 30 + 70).toFixed(2)),
      contribution: parseFloat((Math.random() * 10 + 20).toFixed(2)),
      velocityIndex: parseFloat((Math.random() * 20 + 75).toFixed(2))
    },
    date: new Date().toISOString()
  };
};

// Generate mock overview metrics
export const generateMockOverviewMetrics = (): OverviewMetrics => {
  const teamMetricsSummary = mockTeams.map(team => {
    const stats = mockTeamStats[team.id];
    return {
      teamId: team.id,
      teamName: team.name,
      storyPoints: stats.totalStoryPoints,
      commits: Math.floor(Math.random() * 200) + 100,
      prs: Math.floor(Math.random() * 30) + 10,
      completionPercentage: stats.completionPercentage
    };
  });
  
  // Calculate totals
  const totalStoryPoints = teamMetricsSummary.reduce((sum, team) => sum + team.storyPoints, 0);
  const completedStoryPoints = teamMetricsSummary.reduce((sum, team) => sum + Math.floor(team.storyPoints * team.completionPercentage / 100), 0);
  const totalCommits = teamMetricsSummary.reduce((sum, team) => sum + team.commits, 0);
  const totalPRs = teamMetricsSummary.reduce((sum, team) => sum + team.prs, 0);
  
  return {
    totalStoryPoints,
    completedStoryPoints,
    completionPercentage: Math.round((completedStoryPoints / totalStoryPoints) * 100),
    totalCommits,
    totalPRs,
    totalReviews: Math.floor(totalPRs * 1.5),
    avgPrTimeToMerge: Math.floor(Math.random() * 24) + 12,
    activeTeams: teamMetricsSummary.length,
    activeMembers: teamMetricsSummary.length * 4, // Assuming 4 members per team
    teamMetricsSummary,
    date: new Date().toISOString()
  };
};

// Generate mock correlation insights
export const generateMockInsights = (teamId?: string): CorrelationInsight[] => {
  const insightTypes = ['team', 'member', 'organization'];
  const severityTypes = ['info', 'warning', 'critical', 'positive'];
  const metricNames = ['Velocity', 'Planning Accuracy', 'Review Quality', 'Contribution Rate'];
  const trendTypes = ['up', 'down', 'stable'];
  
  // Generate random insights
  return Array(6).fill(null).map((_, index) => {
    const team = teamId ? 
      mockTeams.find(t => t.id === teamId) : 
      mockTeams[Math.floor(Math.random() * mockTeams.length)];
    
    const type = teamId ? 'team' : insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const severity = severityTypes[Math.floor(Math.random() * severityTypes.length)];
    const metricName = metricNames[Math.floor(Math.random() * metricNames.length)];
    const trend = trendTypes[Math.floor(Math.random() * trendTypes.length)];
    const metricValue = Math.floor(Math.random() * 50) + 50;
    const trendPercentage = Math.floor(Math.random() * 20) + 1;
    
    let insightText = '';
    switch(metricName) {
      case 'Velocity':
        insightText = `${team.name} has ${trend === 'up' ? 'increased' : trend === 'down' ? 'decreased' : 'maintained'} their velocity by ${trendPercentage}% compared to last sprint.`;
        break;
      case 'Planning Accuracy':
        insightText = `${team.name}'s sprint planning accuracy is ${metricValue}%, which is ${metricValue > 80 ? 'above' : 'below'} the organization average.`;
        break;
      case 'Review Quality':
        insightText = `Pull request reviews by ${team.name} have ${trend === 'up' ? 'more' : trend === 'down' ? 'fewer' : 'a consistent number of'} comments than the organization average.`;
        break;
      case 'Contribution Rate':
        insightText = `Code contribution by ${team.name} has ${trend === 'up' ? 'increased' : trend === 'down' ? 'decreased' : 'remained stable'} compared to previous sprints.`;
        break;
    }
    
    return {
      id: `insight-${index}-${team.id}`,
      type,
      targetId: team.id,
      targetName: team.name,
      insightText,
      metricName,
      metricValue,
      trend,
      trendPercentage,
      severity: severity as any,
      date: new Date().toISOString()
    };
  });
};

// Pre-compute integrated metrics for each mock team for quick lookup
export const mockIntegratedTeamMetrics = mockTeams.reduce<Record<string, IntegratedTeamMetrics>>((acc, team) => {
  acc[team.id] = generateMockIntegratedTeamMetrics(team.id);
  return acc;
}, {});

// Generate mock overview metrics
export const mockOverviewMetrics = generateMockOverviewMetrics();
