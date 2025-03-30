import type { NextApiRequest, NextApiResponse } from 'next';
import { JiraFactory } from '../../../infrastructure/factories/jira-factory';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const jiraClient = JiraFactory.createJiraApiClient();
    
    // Test basic connectivity by getting JIRA boards
    console.log('Testing JIRA API connection...');
    const boards = await jiraClient.getBoards();
    
    // Get the first board for further testing
    if (boards.values && boards.values.length > 0) {
      const firstBoard = boards.values[0];
      
      // Get sprints for this board
      const sprints = await jiraClient.getBoardSprints(firstBoard.id);
      
      // Get issues for this board
      const issues = await jiraClient.getBoardIssues(firstBoard.id);
      
      return res.status(200).json({
        success: true,
        message: `Successfully connected to JIRA API at ${process.env.JIRA_BASE_URL}`,
        stats: {
          boards: boards.values.length,
          firstBoardName: firstBoard.name,
          sprints: sprints.values ? sprints.values.length : 0,
          issues: issues.issues ? issues.issues.length : 0
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `Successfully connected to JIRA API at ${process.env.JIRA_BASE_URL}`,
        warning: 'No boards found',
        stats: {
          boards: 0
        }
      });
    }
  } catch (error) {
    console.error('JIRA API connection test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to JIRA API',
      details: (error as Error).message
    });
  }
}