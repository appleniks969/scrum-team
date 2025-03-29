// Domain Services for JIRA Context
import {
  Team,
  TeamMember,
  Sprint,
  Issue,
  CompletionStats,
  MemberCompletionStats,
  StoryPointValue,
  CompletionPercentage,
  TeamRepository,
  SprintRepository,
  IssueRepository
} from './entities';

export class StoryPointsAnalyticsService {
  private teamRepository: TeamRepository;
  private sprintRepository: SprintRepository;
  private issueRepository: IssueRepository;

  constructor(
    teamRepository: TeamRepository, 
    sprintRepository: SprintRepository, 
    issueRepository: IssueRepository
  ) {
    this.teamRepository = teamRepository;
    this.sprintRepository = sprintRepository;
    this.issueRepository = issueRepository;
  }

  async getTeamCompletionStats(
    teamId: string,
    sprintId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<CompletionStats> {
    // Get team info
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }

    let issues: Issue[] = [];
    let sprintName = 'All Sprints';
    
    // Get issues based on sprint or date range
    if (sprintId) {
      const sprint = await this.sprintRepository.findById(sprintId);
      if (!sprint) {
        throw new Error(`Sprint with ID ${sprintId} not found`);
      }
      
      sprintName = sprint.name;
      issues = await this.issueRepository.findBySprint(sprintId);
    } else {
      issues = await this.issueRepository.findByTeam(teamId, startDate, endDate);
    }

    // Calculate total story points
    const totalPoints = issues
      .map(issue => issue.storyPoints || 0)
      .reduce((sum, points) => sum + points, 0);
    
    // Calculate completed story points
    const completedPoints = issues
      .filter(issue => issue.status === 'Done' || issue.resolvedDate)
      .map(issue => issue.storyPoints || 0)
      .reduce((sum, points) => sum + points, 0);
    
    // Calculate completion percentage
    const completionPercentage = new CompletionPercentage(completedPoints, totalPoints).getValue();
    
    // Group issues by assignee for member stats
    const assigneeIssuesMap = new Map<string, Issue[]>();
    
    issues.forEach(issue => {
      if (issue.assignee) {
        if (!assigneeIssuesMap.has(issue.assignee)) {
          assigneeIssuesMap.set(issue.assignee, []);
        }
        assigneeIssuesMap.get(issue.assignee)!.push(issue);
      }
    });
    
    // Calculate member stats
    const memberStatsPromises = Array.from(assigneeIssuesMap.entries()).map(
      async ([assigneeId, assigneeIssues]) => {
        // In a real implementation, we would get member info from a repository
        // For now, we'll just use the assignee ID as the display name
        const displayName = assigneeId;
        
        const totalStoryPoints = assigneeIssues
          .map(issue => issue.storyPoints || 0)
          .reduce((sum, points) => sum + points, 0);
        
        const completedStoryPoints = assigneeIssues
          .filter(issue => issue.status === 'Done' || issue.resolvedDate)
          .map(issue => issue.storyPoints || 0)
          .reduce((sum, points) => sum + points, 0);
        
        return {
          accountId: assigneeId,
          displayName,
          totalStoryPoints,
          completedStoryPoints
        };
      }
    );
    
    const memberStats = await Promise.all(memberStatsPromises);
    
    return {
      teamId,
      teamName: team.name,
      sprintId: sprintId || 0,
      sprintName,
      totalStoryPoints: totalPoints,
      completedStoryPoints: completedPoints,
      completionPercentage,
      memberStats
    };
  }

  async getAllTeamsCompletionStats(
    startDate?: string,
    endDate?: string
  ): Promise<CompletionStats[]> {
    const teams = await this.teamRepository.findAll();
    
    const statsPromises = teams.map(team => 
      this.getTeamCompletionStats(team.id, undefined, startDate, endDate)
    );
    
    return Promise.all(statsPromises);
  }

  async getMemberCompletionStats(
    accountId: string,
    startDate?: string,
    endDate?: string
  ): Promise<MemberCompletionStats> {
    // Get issues assigned to the member
    const issues = await this.issueRepository.findByAssignee(accountId, startDate, endDate);
    
    // Calculate total story points
    const totalStoryPoints = issues
      .map(issue => issue.storyPoints || 0)
      .reduce((sum, points) => sum + points, 0);
    
    // Calculate completed story points
    const completedStoryPoints = issues
      .filter(issue => issue.status === 'Done' || issue.resolvedDate)
      .map(issue => issue.storyPoints || 0)
      .reduce((sum, points) => sum + points, 0);
    
    // In a real implementation, we would get member info from a repository
    // For now, we'll just use the account ID as the display name
    const displayName = accountId;
    
    return {
      accountId,
      displayName,
      totalStoryPoints,
      completedStoryPoints
    };
  }
}
