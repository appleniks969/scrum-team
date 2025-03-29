// Application service for JIRA context
import { 
  TeamRepository, 
  SprintRepository, 
  IssueRepository,
  StoryPointsAnalyticsService
} from '../../domain/jira/services';
import { 
  TeamDto, 
  TeamMemberDto, 
  SprintDto, 
  IssueDto, 
  CompletionStatsDto,
  MemberCompletionStatsDto,
  GetTeamStatsRequestDto,
  GetMemberStatsRequestDto
} from '../dtos/jira-dtos';

export class JiraApplicationService {
  private teamRepository: TeamRepository;
  private sprintRepository: SprintRepository;
  private issueRepository: IssueRepository;
  private analyticsService: StoryPointsAnalyticsService;

  constructor(
    teamRepository: TeamRepository,
    sprintRepository: SprintRepository,
    issueRepository: IssueRepository
  ) {
    this.teamRepository = teamRepository;
    this.sprintRepository = sprintRepository;
    this.issueRepository = issueRepository;
    this.analyticsService = new StoryPointsAnalyticsService(
      teamRepository,
      sprintRepository,
      issueRepository
    );
  }

  async getAllTeams(): Promise<TeamDto[]> {
    try {
      const teams = await this.teamRepository.findAll();
      return teams.map(team => ({
        id: team.id,
        name: team.name,
        boardId: team.boardId
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams. Please try again later.');
    }
  }

  async getTeamById(id: string): Promise<TeamDto | null> {
    try {
      const team = await this.teamRepository.findById(id);
      if (!team) {
        return null;
      }
      
      return {
        id: team.id,
        name: team.name,
        boardId: team.boardId
      };
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw new Error('Failed to fetch team details. Please try again later.');
    }
  }

  async getSprintsByTeam(teamId: string): Promise<SprintDto[]> {
    try {
      const sprints = await this.sprintRepository.findByTeam(teamId);
      return sprints.map(sprint => ({
        id: sprint.id,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        boardId: sprint.boardId
      }));
    } catch (error) {
      console.error(`Error fetching sprints for team ${teamId}:`, error);
      throw new Error('Failed to fetch sprint data. Please try again later.');
    }
  }

  async getActiveSprintsByTeam(teamId: string): Promise<SprintDto[]> {
    try {
      const sprints = await this.sprintRepository.findActive(teamId);
      return sprints.map(sprint => ({
        id: sprint.id,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        boardId: sprint.boardId
      }));
    } catch (error) {
      console.error(`Error fetching active sprints for team ${teamId}:`, error);
      throw new Error('Failed to fetch active sprint data. Please try again later.');
    }
  }

  async getIssuesBySprint(sprintId: number): Promise<IssueDto[]> {
    try {
      const issues = await this.issueRepository.findBySprint(sprintId);
      return issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        summary: issue.summary,
        storyPoints: issue.storyPoints,
        status: issue.status,
        assignee: issue.assignee ? {
          accountId: issue.assignee,
          displayName: issue.assignee // In a real app, we'd fetch the actual display name
        } : undefined,
        teamId: issue.teamId,
        sprintId: issue.sprintId,
        resolvedDate: issue.resolvedDate
      }));
    } catch (error) {
      console.error(`Error fetching issues for sprint ${sprintId}:`, error);
      throw new Error('Failed to fetch issue data. Please try again later.');
    }
  }

  async getTeamCompletionStats(request: GetTeamStatsRequestDto): Promise<CompletionStatsDto> {
    try {
      const stats = await this.analyticsService.getTeamCompletionStats(
        request.teamId,
        request.sprintId,
        request.startDate,
        request.endDate
      );
      
      const memberStatsWithPercentage = stats.memberStats.map(member => ({
        ...member,
        completionPercentage: member.totalStoryPoints > 0 
          ? (member.completedStoryPoints / member.totalStoryPoints) * 100 
          : 0
      }));
      
      return {
        ...stats,
        memberStats: memberStatsWithPercentage,
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching completion stats for team ${request.teamId}:`, error);
      throw new Error('Failed to fetch team performance data. Please try again later.');
    }
  }

  async getAllTeamsCompletionStats(
    startDate?: string,
    endDate?: string
  ): Promise<CompletionStatsDto[]> {
    try {
      const allStats = await this.analyticsService.getAllTeamsCompletionStats(
        startDate,
        endDate
      );
      
      return allStats.map(stats => {
        const memberStatsWithPercentage = stats.memberStats.map(member => ({
          ...member,
          completionPercentage: member.totalStoryPoints > 0 
            ? (member.completedStoryPoints / member.totalStoryPoints) * 100 
            : 0
        }));
        
        return {
          ...stats,
          memberStats: memberStatsWithPercentage,
          date: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching all teams completion stats:', error);
      throw new Error('Failed to fetch team performance data. Please try again later.');
    }
  }

  async getMemberCompletionStats(
    request: GetMemberStatsRequestDto
  ): Promise<MemberCompletionStatsDto> {
    try {
      const stats = await this.analyticsService.getMemberCompletionStats(
        request.accountId,
        request.startDate,
        request.endDate
      );
      
      return {
        ...stats,
        completionPercentage: stats.totalStoryPoints > 0 
          ? (stats.completedStoryPoints / stats.totalStoryPoints) * 100 
          : 0
      };
    } catch (error) {
      console.error(`Error fetching completion stats for member ${request.accountId}:`, error);
      throw new Error('Failed to fetch member performance data. Please try again later.');
    }
  }
}
