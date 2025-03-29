// Application service for Integrated Metrics context
import { JiraApplicationService } from '../jira/jira-service';
import { GitApplicationService } from '../git/git-service';
import { 
  IntegratedTeamMetricsDto, 
  IntegratedMemberMetricsDto,
  CorrelationInsightDto,
  OverviewMetricsDto,
  TeamMetricsSummaryDto,
  GetIntegratedMetricsRequestDto,
  GetCorrelationInsightsRequestDto
} from '../dtos/metrics-dtos';

export class IntegratedMetricsService {
  private jiraService: JiraApplicationService;
  private gitService: GitApplicationService;

  constructor(
    jiraService: JiraApplicationService,
    gitService: GitApplicationService
  ) {
    this.jiraService = jiraService;
    this.gitService = gitService;
  }

  async getIntegratedTeamMetrics(
    request: GetIntegratedMetricsRequestDto
  ): Promise<IntegratedTeamMetricsDto> {
    try {
      if (!request.teamId) {
        throw new Error('Team ID is required for integrated team metrics');
      }
      
      // Get JIRA metrics
      const jiraMetrics = await this.jiraService.getTeamCompletionStats({
        teamId: request.teamId,
        startDate: request.startDate,
        endDate: request.endDate
      });
      
      // Get Git metrics
      const gitMetrics = await this.gitService.getGitMetrics({
        teamId: request.teamId,
        startDate: request.startDate,
        endDate: request.endDate
      }) as any; // Type cast for simplicity
      
      // Calculate correlations
      const storyPointToCommitRatio = jiraMetrics.totalStoryPoints > 0
        ? gitMetrics.metrics.commitCount / jiraMetrics.totalStoryPoints
        : 0;
      
      const planningAccuracy = jiraMetrics.totalStoryPoints > 0
        ? (jiraMetrics.completedStoryPoints / jiraMetrics.totalStoryPoints) * 100
        : 0;
      
      // Simple velocity calculation (completed story points)
      const velocity = jiraMetrics.completedStoryPoints;
      
      // Consistency score (simplified implementation)
      // In a real app, this would analyze multiple sprints for consistency
      const consistency = planningAccuracy > 80 ? 0.8 : planningAccuracy > 60 ? 0.6 : 0.4;
      
      return {
        teamId: request.teamId,
        teamName: jiraMetrics.teamName,
        jiraMetrics,
        gitMetrics,
        correlations: {
          storyPointToCommitRatio,
          planningAccuracy,
          velocity,
          consistency
        },
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating integrated metrics for team ${request.teamId}:`, error);
      throw new Error('Failed to generate integrated team metrics. Please try again later.');
    }
  }

  async getIntegratedMemberMetrics(
    request: GetIntegratedMetricsRequestDto
  ): Promise<IntegratedMemberMetricsDto> {
    try {
      if (!request.memberId) {
        throw new Error('Member ID is required for integrated member metrics');
      }
      
      // Get JIRA metrics
      const jiraMetrics = await this.jiraService.getMemberCompletionStats({
        accountId: request.memberId,
        startDate: request.startDate,
        endDate: request.endDate
      });
      
      // Get Git metrics
      const gitMetrics = await this.gitService.getGitMetrics({
        memberId: request.memberId,
        startDate: request.startDate,
        endDate: request.endDate
      }) as any; // Type cast for simplicity
      
      // Calculate correlations
      const storyPointToCommitRatio = jiraMetrics.totalStoryPoints > 0
        ? gitMetrics.commitCount / jiraMetrics.totalStoryPoints
        : 0;
      
      // Review quality (simplified implementation)
      // In a real app, this would analyze code review comments, etc.
      const reviewQuality = 0.75;
      
      // Contribution score (simplified implementation)
      // In a real app, this would be calculated from various metrics
      const contribution = gitMetrics.commitCount > 20 ? 0.9 : 
                          gitMetrics.commitCount > 10 ? 0.7 : 0.5;
      
      // Velocity index (simplified implementation)
      const velocityIndex = jiraMetrics.completedStoryPoints > 15 ? 0.9 :
                           jiraMetrics.completedStoryPoints > 8 ? 0.7 : 0.5;
      
      return {
        accountId: request.memberId,
        displayName: jiraMetrics.displayName,
        teamId: request.teamId || 'unknown',
        teamName: 'Unknown Team', // In a real app, we would fetch the team name
        jiraMetrics,
        gitMetrics,
        correlations: {
          storyPointToCommitRatio,
          reviewQuality,
          contribution,
          velocityIndex
        },
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating integrated metrics for member ${request.memberId}:`, error);
      throw new Error('Failed to generate integrated member metrics. Please try again later.');
    }
  }

  async getCorrelationInsights(
    request: GetCorrelationInsightsRequestDto
  ): Promise<CorrelationInsightDto[]> {
    try {
      const insights: CorrelationInsightDto[] = [];
      const now = new Date().toISOString();
      
      // Generate team-specific insights
      if (request.teamId) {
        // Get integrated team metrics
        const teamMetrics = await this.getIntegratedTeamMetrics({
          teamId: request.teamId
        });
        
        // Generate insights based on metrics
        // Example: Story point completion rate
        if (teamMetrics.jiraMetrics.completionPercentage < 70) {
          insights.push({
            id: `team-completion-${request.teamId}`,
            type: 'team',
            targetId: request.teamId,
            targetName: teamMetrics.teamName,
            insightText: `Team is completing only ${teamMetrics.jiraMetrics.completionPercentage.toFixed(1)}% of planned story points. Consider revisiting sprint planning process.`,
            metricName: 'Completion Rate',
            metricValue: teamMetrics.jiraMetrics.completionPercentage,
            trend: 'down',
            trendPercentage: 5, // Simplified - in a real app, we would compare with previous time periods
            severity: 'warning',
            date: now
          });
        }
        
        // Example: Commit to story point ratio
        if (teamMetrics.correlations.storyPointToCommitRatio > 5) {
          insights.push({
            id: `team-commit-ratio-${request.teamId}`,
            type: 'team',
            targetId: request.teamId,
            targetName: teamMetrics.teamName,
            insightText: `High commit to story point ratio (${teamMetrics.correlations.storyPointToCommitRatio.toFixed(1)}). Consider reviewing story point estimation process.`,
            metricName: 'Commit-to-SP Ratio',
            metricValue: teamMetrics.correlations.storyPointToCommitRatio,
            trend: 'up',
            trendPercentage: 8, // Simplified
            severity: 'info',
            date: now
          });
        }
      }
      
      // Generate member-specific insights
      if (request.memberId) {
        // Get integrated member metrics
        const memberMetrics = await this.getIntegratedMemberMetrics({
          memberId: request.memberId
        });
        
        // Example: Low story point completion
        if (memberMetrics.jiraMetrics.completionPercentage < 60) {
          insights.push({
            id: `member-completion-${request.memberId}`,
            type: 'member',
            targetId: request.memberId,
            targetName: memberMetrics.displayName,
            insightText: `Completing only ${memberMetrics.jiraMetrics.completionPercentage.toFixed(1)}% of assigned story points. May need support or more realistic task assignments.`,
            metricName: 'Completion Rate',
            metricValue: memberMetrics.jiraMetrics.completionPercentage,
            trend: 'down',
            trendPercentage: 10, // Simplified
            severity: 'warning',
            date: now
          });
        }
        
        // Example: High contribution
        if (memberMetrics.correlations.contribution > 0.8) {
          insights.push({
            id: `member-contribution-${request.memberId}`,
            type: 'member',
            targetId: request.memberId,
            targetName: memberMetrics.displayName,
            insightText: `High contribution level with ${memberMetrics.gitMetrics.commitCount} commits and ${memberMetrics.gitMetrics.prCount} PRs. Consider recognizing this team member's efforts.`,
            metricName: 'Contribution Level',
            metricValue: memberMetrics.correlations.contribution * 100,
            trend: 'up',
            trendPercentage: 5, // Simplified
            severity: 'positive',
            date: now
          });
        }
      }
      
      // Filter insights based on severity if requested
      if (request.severity) {
        return insights.filter(insight => insight.severity === request.severity);
      }
      
      // Apply limit if provided
      if (request.limit && request.limit > 0) {
        return insights.slice(0, request.limit);
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating correlation insights:', error);
      throw new Error('Failed to generate insights. Please try again later.');
    }
  }

  async getOverviewMetrics(startDate?: string, endDate?: string): Promise<OverviewMetricsDto> {
    try {
      // Get all teams completion stats
      const teamsStats = await this.jiraService.getAllTeamsCompletionStats(
        startDate,
        endDate
      );
      
      // Calculate aggregated metrics
      const totalStoryPoints = teamsStats.reduce(
        (total, stats) => total + stats.totalStoryPoints, 
        0
      );
      
      const completedStoryPoints = teamsStats.reduce(
        (total, stats) => total + stats.completedStoryPoints, 
        0
      );
      
      const completionPercentage = totalStoryPoints > 0
        ? (completedStoryPoints / totalStoryPoints) * 100
        : 0;
      
      // Get unique active members count
      const activeMembers = new Set<string>();
      teamsStats.forEach(team => {
        team.memberStats.forEach(member => {
          activeMembers.add(member.accountId);
        });
      });
      
      // Simplified Git metrics (in a real app, we would aggregate from all teams)
      const totalCommits = 250; // Placeholder
      const totalPRs = 75; // Placeholder
      const totalReviews = 120; // Placeholder
      const avgPrTimeToMerge = 24.5; // Placeholder (hours)
      
      // Create team metrics summary
      const teamMetricsSummary: TeamMetricsSummaryDto[] = teamsStats.map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        storyPoints: team.completedStoryPoints,
        commits: 50, // Placeholder
        prs: 15, // Placeholder
        completionPercentage: team.completionPercentage
      }));
      
      return {
        totalStoryPoints,
        completedStoryPoints,
        completionPercentage,
        totalCommits,
        totalPRs,
        totalReviews,
        avgPrTimeToMerge,
        activeTeams: teamsStats.length,
        activeMembers: activeMembers.size,
        teamMetricsSummary,
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating overview metrics:', error);
      throw new Error('Failed to generate overview metrics. Please try again later.');
    }
  }
}
