import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const jiraUsername = process.env.JIRA_USERNAME;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    
    if (!jiraBaseUrl || !jiraUsername || !jiraApiToken) {
      return res.status(400).json({
        success: false,
        error: 'JIRA credentials not configured',
        envVars: {
          baseUrlConfigured: !!jiraBaseUrl,
          usernameConfigured: !!jiraUsername,
          tokenConfigured: !!jiraApiToken
        }
      });
    }
    
    console.log('Testing JIRA Basic Authentication...');
    console.log('Base URL:', jiraBaseUrl);
    console.log('Username:', jiraUsername);
    console.log('Token (masked):', jiraApiToken ? '*'.repeat(jiraApiToken.length) : 'undefined');
    
    // Testing with Basic Auth
    try {
      // Create the Basic Auth header manually for clarity
      const auth = Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64');
      console.log('Using Basic Auth with username:token');
      
      const response = await axios.get(`${jiraBaseUrl}/rest/api/2/myself`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Successfully authenticated with JIRA using Basic Auth',
        user: response.data
      });
    } catch (error: any) {
      console.error('Authentication failed:', error.message);
      
      // Log detailed error information
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Status Text:', error.response.statusText);
        console.error('Headers:', error.response.headers);
        console.error('Data:', error.response.data);
      }
      
      return res.status(500).json({
        success: false,
        error: 'Authentication failed',
        details: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  } catch (error) {
    console.error('JIRA authentication test error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to test JIRA authentication',
      details: (error as Error).message
    });
  }
}