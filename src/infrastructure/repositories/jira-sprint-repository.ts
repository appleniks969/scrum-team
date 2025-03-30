import { 
  Sprint, 
  SprintRepository,
  TeamRepository 
} from '../../domain/jira/entities';
import { JiraApiClient } from '../jira-client';

export class JiraSprintRepository implements SprintRepository {
  private jiraClient: JiraApiClient;
  private teamRepository: TeamRepository;
  
  constructor(
    jiraClient: JiraApiClient,
    teamRepository: TeamRepository
  ) {
    this.jiraClient = jiraClient;
    this.teamRepository = teamRepository;
  }
  
  async findByTeam(teamId: string): Promise<Sprint[]> {
    try {
      const team = await this.teamRepository.findById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      
      const sprints = await this.jiraClient.getAllBoardSprints(team.boardId);
      
      // Map JIRA sprints to domain entities
      return sprints.map(sprint => this.mapJiraSprintToSprint(sprint, team.boardId));
    } catch (error) {
      console.error(`Error in findByTeam sprints for team ${teamId}:`, error);
      throw error;
    }
  }
  
  async findActive(teamId: string): Promise<Sprint[]> {
    try {
      const team = await this.teamRepository.findById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      
      const sprints = await this.jiraClient.getAllBoardSprints(
        team.boardId, 
        'active,future'
      );
      
      // Map JIRA sprints to domain entities
      return sprints.map(sprint => this.mapJiraSprintToSprint(sprint, team.boardId));
    } catch (error) {
      console.error(`Error in findActive sprints for team ${teamId}:`, error);
      throw error;
    }
  }
  
  async findById(id: number): Promise<Sprint | null> {
    try {
      const sprint = await this.jiraClient.getSprintById(id);
      return this.mapJiraSprintToSprint(sprint, sprint.originBoardId);
    } catch (error) {
      // Check if it's a 404 error (sprint not found)
      if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 404) {
        return null;
      }
      console.error(`Error in findById sprint ${id}:`, error);
      throw error;
    }
  }
  
  private mapJiraSprintToSprint(sprint: any, boardId: number): Sprint {
    return {
      id: sprint.id,
      name: sprint.name,
      state: sprint.state,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      boardId: boardId
    };
  }
}