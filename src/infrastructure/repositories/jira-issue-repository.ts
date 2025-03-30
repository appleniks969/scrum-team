import { 
  Issue, 
  IssueRepository,
  TeamRepository 
} from '../../domain/jira/entities';
import { JiraApiClient } from '../jira-client';

export class JiraIssueRepository implements IssueRepository {
  private jiraClient: JiraApiClient;
  private teamRepository: TeamRepository;
  
  constructor(
    jiraClient: JiraApiClient,
    teamRepository: TeamRepository
  ) {
    this.jiraClient = jiraClient;
    this.teamRepository = teamRepository;
  }
  
  async findBySprint(sprintId: number): Promise<Issue[]> {
    try {
      const response = await this.jiraClient.getSprintIssues(sprintId);
      const issues = response.issues || [];
      
      // Map JIRA issues to domain entities
      return issues.map(issue => this.mapJiraIssueToIssue(issue, sprintId));
    } catch (error) {
      console.error(`Error in findBySprint issues for sprint ${sprintId}:`, error);
      throw error;
    }
  }
  
  async findByTeam(teamId: string, startDate?: string, endDate?: string): Promise<Issue[]> {
    try {
      const team = await this.teamRepository.findById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      
      const response = await this.jiraClient.getIssuesByTeamAndTimeframe(
        team.boardId, 
        startDate, 
        endDate
      );
      
      const issues = response.issues || [];
      
      // Map JIRA issues to domain entities
      return issues.map(issue => this.mapJiraIssueToIssue(issue));
    } catch (error) {
      console.error(`Error in findByTeam issues for team ${teamId}:`, error);
      throw error;
    }
  }
  
  async findByAssignee(accountId: string, startDate?: string, endDate?: string): Promise<Issue[]> {
    try {
      const response = await this.jiraClient.getIssuesByAssignee(
        accountId, 
        startDate, 
        endDate
      );
      
      const issues = response.issues || [];
      
      // Map JIRA issues to domain entities
      return issues.map(issue => this.mapJiraIssueToIssue(issue));
    } catch (error) {
      console.error(`Error in findByAssignee issues for user ${accountId}:`, error);
      throw error;
    }
  }
  
  private mapJiraIssueToIssue(jiraIssue: any, sprintId?: number): Issue {
    const fields = jiraIssue.fields;
    const storyPointsField = this.jiraClient.getStoryPointsField();
    
    return {
      id: jiraIssue.id,
      key: jiraIssue.key,
      summary: fields.summary,
      storyPoints: fields[storyPointsField] || 0,
      status: fields.status.name,
      assignee: fields.assignee?.accountId,
      teamId: '', // This would need to be derived from the board/project
      sprintId: sprintId || this.extractSprintIdFromIssue(jiraIssue),
      resolvedDate: this.extractResolvedDate(fields)
    };
  }
  
  private extractSprintIdFromIssue(jiraIssue: any): number | undefined {
    // This depends on how sprint information is stored in your JIRA instance
    // It could be in a custom field or in the sprint field
    const fields = jiraIssue.fields;
    
    // Example: sprint might be in a custom field like "sprint" or "customfield_10000"
    const sprintField = fields.sprint || fields.customfield_10000;
    
    if (sprintField && typeof sprintField === 'object') {
      return sprintField.id;
    }
    
    // Or it might be in an array
    const sprintArray = fields.customfield_10001; // Adjust field name as needed
    if (Array.isArray(sprintArray) && sprintArray.length > 0) {
      // Take the most recent sprint
      return sprintArray[sprintArray.length - 1].id;
    }
    
    return undefined;
  }
  
  private extractResolvedDate(fields: any): string | undefined {
    // Check if the issue has a resolution date
    if (fields.resolutiondate) {
      return fields.resolutiondate;
    }
    
    // Alternatively, check if the status category is "Done"
    if (fields.status?.statusCategory?.key === 'done') {
      // If no specific resolution date, use the last updated date
      return fields.updated;
    }
    
    return undefined;
  }
}