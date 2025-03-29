// API route for testing GitHub API connection
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubApiClient } from '../../../infrastructure/git-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get GitHub credentials
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG || 'your-organization';
    
    if (!githubToken) {
      return res.status(401).json({ 
        success: false,
        error: 'GitHub token is not configured' 
      });
    }
    
    // Create GitHub client
    const githubClient = new GitHubApiClient(githubToken, githubOrg);
    
    // Test connection by fetching organization members
    const members = await githubClient.getOrganizationMembers();
    
    // Check if we got a response
    if (Array.isArray(members)) {
      return res.status(200).json({ 
        success: true,
        message: `Successfully connected to GitHub API for organization ${githubOrg}`,
        memberCount: members.length 
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Invalid response from GitHub API'
      });
    }
  } catch (error) {
    console.error('GitHub API connection test error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to connect to GitHub API',
      details: (error as Error).message
    });
  }
}
