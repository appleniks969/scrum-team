// Data Transfer Objects for Integrated Metrics Context

import { CompletionStatsDto, MemberCompletionStatsDto } from './jira-dtos';
import { GitMetricsDto, TeamGitMetricsDto } from './git-dtos';

export interface IntegratedTeamMetricsDto {
  teamId: string;
  teamName: string;
  jiraMetrics: CompletionStatsDto;
  gitMetrics: TeamGitMetricsDto;
  correlations: {
    storyPointToCommitRatio: number;
    planningAccuracy: number;
    velocity: number;
    consistency: number;
  };
  date: string; // For caching and versioning
}

export interface IntegratedMemberMetricsDto {
  accountId: string;
  displayName: string;
  teamId: string;
  teamName: string;
  jiraMetrics: MemberCompletionStatsDto;
  gitMetrics: GitMetricsDto;
  correlations: {
    storyPointToCommitRatio: number;
    reviewQuality: number;
    contribution: number;
    velocityIndex: number;
  };
  date: string;
}

export interface CorrelationInsightDto {
  id: string;
  type: 'team' | 'member' | 'organization';
  targetId: string; // team ID or member ID
  targetName: string;
  insightText: string;
  metricName: string;
  metricValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  severity: 'info' | 'warning' | 'critical' | 'positive';
  date: string;
}

export interface OverviewMetricsDto {
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  totalCommits: number;
  totalPRs: number;
  totalReviews: number;
  avgPrTimeToMerge: number;
  activeTeams: number;
  activeMembers: number;
  teamMetricsSummary: TeamMetricsSummaryDto[];
  date: string;
}

export interface TeamMetricsSummaryDto {
  teamId: string;
  teamName: string;
  storyPoints: number;
  commits: number;
  prs: number;
  completionPercentage: number;
}

// Request DTOs
export interface GetIntegratedMetricsRequestDto {
  teamId?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetCorrelationInsightsRequestDto {
  teamId?: string;
  memberId?: string;
  insightType?: 'team' | 'member' | 'organization';
  severity?: 'info' | 'warning' | 'critical' | 'positive';
  limit?: number;
}
