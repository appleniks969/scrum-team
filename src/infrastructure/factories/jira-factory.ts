import { JiraApiClient } from '../jira-client';
import { JiraTeamRepository } from '../repositories/jira-team-repository';
import { JiraSprintRepository } from '../repositories/jira-sprint-repository';
import { JiraIssueRepository } from '../repositories/jira-issue-repository';
import { JiraTeamMemberRepository } from '../repositories/jira-team-member-repository';
import { StoryPointsAnalyticsService } from '../../domain/jira/services';

export class JiraFactory {
  static createJiraApiClient(): JiraApiClient {
    const baseUrl = process.env.JIRA_BASE_URL;
    const username = process.env.JIRA_USERNAME;
    const apiToken = process.env.JIRA_API_TOKEN;
    const storyPointsField = process.env.JIRA_STORY_POINTS_FIELD || 'customfield_10016';
    
    if (!baseUrl || !username || !apiToken) {
      throw new Error('JIRA credentials not configured');
    }
    
    return new JiraApiClient(baseUrl, username, apiToken, storyPointsField);
  }
  
  static createRepositories() {
    const jiraClient = this.createJiraApiClient();
    const teamRepository = new JiraTeamRepository(jiraClient);
    const sprintRepository = new JiraSprintRepository(jiraClient, teamRepository);
    const issueRepository = new JiraIssueRepository(jiraClient, teamRepository);
    const teamMemberRepository = new JiraTeamMemberRepository(jiraClient, teamRepository);
    
    return {
      teamRepository,
      sprintRepository,
      issueRepository,
      teamMemberRepository
    };
  }
  
  static createStoryPointsAnalyticsService(): StoryPointsAnalyticsService {
    const { teamRepository, sprintRepository, issueRepository } = this.createRepositories();
    
    return new StoryPointsAnalyticsService(
      teamRepository,
      sprintRepository,
      issueRepository
    );
  }
}