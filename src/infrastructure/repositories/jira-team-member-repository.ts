import { 
  TeamMember,
  TeamMemberRepository,
  TeamRepository 
} from '../../domain/jira/entities';
import { JiraApiClient } from '../jira-client';

export class JiraTeamMemberRepository implements TeamMemberRepository {
  private jiraClient: JiraApiClient;
  private teamRepository: TeamRepository;
  
  constructor(
    jiraClient: JiraApiClient,
    teamRepository: TeamRepository
  ) {
    this.jiraClient = jiraClient;
    this.teamRepository = teamRepository;
  }
  
  async findByTeam(teamId: string): Promise<TeamMember[]> {
    try {
      const team = await this.teamRepository.findById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      
      // Get issues for the team
      const response = await this.jiraClient.getBoardIssues(team.boardId);
      const issues = response.issues || [];
      
      // Extract unique assignees
      const uniqueMembers = new Map<string, TeamMember>();
      
      for (const issue of issues) {
        const assignee = issue.fields.assignee;
        if (assignee && !uniqueMembers.has(assignee.accountId)) {
          uniqueMembers.set(assignee.accountId, {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
            emailAddress: assignee.emailAddress || '',
            teamId
          });
        }
      }
      
      return Array.from(uniqueMembers.values());
    } catch (error) {
      console.error(`Error in findByTeam members for team ${teamId}:`, error);
      throw error;
    }
  }
  
  async findById(accountId: string): Promise<TeamMember | null> {
    try {
      const user = await this.jiraClient.getUserById(accountId);
      
      if (!user) {
        return null;
      }
      
      // In a real implementation, we would need to determine which team(s) 
      // this user belongs to. For simplicity, we'll just return the user
      // without a team ID.
      return {
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress || '',
        teamId: '' // This would need to be determined
      };
    } catch (error) {
      // Check if it's a 404 error (user not found)
      if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 404) {
        return null;
      }
      console.error(`Error in findById member ${accountId}:`, error);
      throw error;
    }
  }
}