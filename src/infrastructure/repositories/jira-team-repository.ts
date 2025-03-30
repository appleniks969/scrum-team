import { 
  Team, 
  TeamRepository 
} from '../../domain/jira/entities';
import { JiraApiClient } from '../jira-client';

export class JiraTeamRepository implements TeamRepository {
  private jiraClient: JiraApiClient;
  
  constructor(jiraClient: JiraApiClient) {
    this.jiraClient = jiraClient;
  }
  
  async findAll(): Promise<Team[]> {
    try {
      const boards = await this.jiraClient.getAllBoards();
      
      // Map JIRA boards to domain entities
      return boards.map(board => this.mapBoardToTeam(board));
    } catch (error) {
      console.error('Error in findAll teams:', error);
      throw error;
    }
  }
  
  async findById(id: string): Promise<Team | null> {
    try {
      // Convert string ID to number for JIRA API
      const boardId = parseInt(id, 10);
      if (isNaN(boardId)) {
        return null;
      }
      
      const board = await this.jiraClient.getBoardById(boardId);
      return this.mapBoardToTeam(board);
    } catch (error) {
      // Check if it's a 404 error (board not found)
      if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 404) {
        return null;
      }
      console.error(`Error in findById team ${id}:`, error);
      throw error;
    }
  }
  
  async findByBoardId(boardId: number): Promise<Team | null> {
    return this.findById(boardId.toString());
  }
  
  private mapBoardToTeam(board: any): Team {
    return {
      id: board.id.toString(),
      name: board.name,
      boardId: board.id
    };
  }
}