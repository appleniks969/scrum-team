// JIRA API Client Implementation
import axios, { AxiosInstance } from 'axios';
import { 
  Team, 
  TeamMember, 
  Sprint, 
  Issue, 
  TeamRepository, 
  SprintRepository, 
  IssueRepository 
} from '../domain/jira/entities';

export class JiraApiClient {
  private baseUrl: string;
  private client: AxiosInstance;

  constructor(baseUrl: string, username: string, apiToken: string) {
    this.baseUrl = baseUrl;
    
    // Create authenticated Axios instance
    this.client = axios.create({
      baseURL: baseUrl,
      auth: {
        username,
        password: apiToken
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Fetch all boards (representing teams)
  async getBoards(): Promise<any[]> {
    try {
      const response = await this.client.get('/rest/agile/1.0/board');
      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching boards:', error);
      return [];
    }
  }

  // Fetch sprints for a board
  async getSprints(boardId: number): Promise<any[]> {
    try {
      const response = await this.client.get(`/rest/agile/1.0/board/${boardId}/sprint`, {
        params: {
          state: 'active,closed'
        }
      });
      return response.data.values || [];
    } catch (error) {
      console.error(`Error fetching sprints for board ${boardId}:`, error);
      return [];
    }
  }

  // Fetch issues for a sprint
  async getIssuesForSprint(sprintId: number): Promise<any[]> {
    try {
      const jql = `sprint=${sprintId}`;
      const response = await this.client.get('/rest/api/2/search', {
        params: {
          jql,
          fields: 'summary,status,assignee,customfield_10006,resolutiondate',
          maxResults: 1000
        }
      });
      return response.data.issues || [];
    } catch (error) {
      console.error(`Error fetching issues for sprint ${sprintId}:`, error);
      return [];
    }
  }

  // Fetch issues for a team within a date range
  async getIssuesForTeam(
    projectKey: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<any[]> {
    try {
      let jql = `project=${projectKey}`;
      
      if (startDate && endDate) {
        jql += ` AND updated >= '${startDate}' AND updated <= '${endDate}'`;
      }
      
      const response = await this.client.get('/rest/api/2/search', {
        params: {
          jql,
          fields: 'summary,status,assignee,customfield_10006,resolutiondate',
          maxResults: 1000
        }
      });
      return response.data.issues || [];
    } catch (error) {
      console.error(`Error fetching issues for project ${projectKey}:`, error);
      return [];
    }
  }

  // Fetch team members
  async getTeamMembers(projectKey: string): Promise<any[]> {
    try {
      const response = await this.client.get('/rest/api/2/user/assignable/search', {
        params: {
          project: projectKey
        }
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching team members for project ${projectKey}:`, error);
      return [];
    }
  }
}

// Repository implementations
export class JiraTeamRepository implements TeamRepository {
  private jiraClient: JiraApiClient;
  private teamMappings: Record<number, string>; // Maps board IDs to team IDs

  constructor(jiraClient: JiraApiClient, teamMappings: Record<number, string> = {}) {
    this.jiraClient = jiraClient;
    this.teamMappings = teamMappings;
  }

  async findAll(): Promise<Team[]> {
    const boards = await this.jiraClient.getBoards();
    
    return boards.map(board => ({
      id: this.teamMappings[board.id] || board.id.toString(),
      name: board.name,
      boardId: board.id
    }));
  }

  async findById(id: string): Promise<Team | null> {
    const teams = await this.findAll();
    return teams.find(team => team.id === id) || null;
  }

  async findByBoardId(boardId: number): Promise<Team | null> {
    const teams = await this.findAll();
    return teams.find(team => team.boardId === boardId) || null;
  }
}

export class JiraSprintRepository implements SprintRepository {
  private jiraClient: JiraApiClient;
  private teamRepository: JiraTeamRepository;

  constructor(jiraClient: JiraApiClient, teamRepository: JiraTeamRepository) {
    this.jiraClient = jiraClient;
    this.teamRepository = teamRepository;
  }

  async findByTeam(teamId: string): Promise<Sprint[]> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      return [];
    }

    const sprints = await this.jiraClient.getSprints(team.boardId);
    
    return sprints.map(sprint => ({
      id: sprint.id,
      name: sprint.name,
      state: sprint.state,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      boardId: team.boardId
    }));
  }

  async findActive(teamId: string): Promise<Sprint[]> {
    const sprints = await this.findByTeam(teamId);
    return sprints.filter(sprint => sprint.state === 'active');
  }

  async findById(id: number): Promise<Sprint | null> {
    // This is inefficient in a real implementation
    // We would use a direct API call to get the sprint
    const teams = await this.teamRepository.findAll();
    
    for (const team of teams) {
      const sprints = await this.findByTeam(team.id);
      const sprint = sprints.find(s => s.id === id);
      if (sprint) {
        return sprint;
      }
    }
    
    return null;
  }
}

export class JiraIssueRepository implements IssueRepository {
  private jiraClient: JiraApiClient;
  private teamRepository: JiraTeamRepository;
  private projectMapping: Record<string, string>; // Maps team IDs to project keys

  constructor(
    jiraClient: JiraApiClient, 
    teamRepository: JiraTeamRepository,
    projectMapping: Record<string, string> = {}
  ) {
    this.jiraClient = jiraClient;
    this.teamRepository = teamRepository;
    this.projectMapping = projectMapping;
  }

  async findBySprint(sprintId: number): Promise<Issue[]> {
    const issues = await this.jiraClient.getIssuesForSprint(sprintId);
    
    return issues.map(issue => this.mapJiraIssueToEntity(issue));
  }

  async findByTeam(teamId: string, startDate?: string, endDate?: string): Promise<Issue[]> {
    const projectKey = this.projectMapping[teamId];
    if (!projectKey) {
      throw new Error(`No project key mapping found for team ${teamId}`);
    }
    
    const issues = await this.jiraClient.getIssuesForTeam(projectKey, startDate, endDate);
    
    return issues.map(issue => this.mapJiraIssueToEntity(issue, teamId));
  }

  async findByAssignee(accountId: string, startDate?: string, endDate?: string): Promise<Issue[]> {
    // In a real implementation, we would make a specific API call
    // For now, we'll aggregate issues from all teams and filter by assignee
    const teams = await this.teamRepository.findAll();
    const allIssues: Issue[] = [];
    
    for (const team of teams) {
      const issues = await this.findByTeam(team.id, startDate, endDate);
      allIssues.push(...issues);
    }
    
    return allIssues.filter(issue => issue.assignee === accountId);
  }

  private mapJiraIssueToEntity(jiraIssue: any, teamId?: string): Issue {
    return {
      id: jiraIssue.id,
      key: jiraIssue.key,
      summary: jiraIssue.fields.summary,
      storyPoints: jiraIssue.fields.customfield_10006, // Adjust field ID as needed
      status: jiraIssue.fields.status.name,
      assignee: jiraIssue.fields.assignee?.accountId,
      teamId: teamId || 'unknown', // In a real implementation, we would determine this
      sprintId: jiraIssue.fields.sprint?.id,
      resolvedDate: jiraIssue.fields.resolutiondate
    };
  }
}
