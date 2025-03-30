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
    
    console.log('Testing JIRA authentication...');
    console.log('Base URL:', jiraBaseUrl);
    console.log('Username:', jiraUsername);
    console.log('Token (masked):', jiraApiToken ? '*'.repeat(jiraApiToken.length) : 'undefined');
    
    // Test a simple endpoint that requires authentication
    // We'll try multiple auth methods to see which works
    
    // Method 1: Using axios auth property
    try {
      console.log('Trying method 1: axios auth property');
      const response1 = await axios.get(`${jiraBaseUrl}/rest/api/2/myself`, {
        auth: {
          username: jiraUsername,
          password: jiraApiToken
        },
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return res.status(200).json({
        success: true,
        method: 'axios auth property',
        user: response1.data
      });
    } catch (error1) {
      console.error('Method 1 failed:', error1);
      
      // Method 2: Using Basic Auth header
      try {
        console.log('Trying method 2: Basic Auth header');
        const auth = Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64');
        const response2 = await axios.get(`${jiraBaseUrl}/rest/api/2/myself`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
        
        return res.status(200).json({
          success: true,
          method: 'Basic Auth header',
          user: response2.data
        });
      } catch (error2) {
        console.error('Method 2 failed:', error2);
        
        // Method 3: Using API token directly
        try {
          console.log('Trying method 3: Personal Access Token');
          const response3 = await axios.get(`${jiraBaseUrl}/rest/api/2/myself`, {
            headers: {
              'Authorization': `Bearer ${jiraApiToken}`,
              'Accept': 'application/json'
            }
          });
          
          return res.status(200).json({
            success: true,
            method: 'Bearer token',
            user: response3.data
          });
        } catch (error3) {
          console.error('Method 3 failed:', error3);
          
          // All methods failed
          return res.status(500).json({
            success: false,
            error: 'All authentication methods failed',
            details: {
              method1: (error1 as any).response?.status,
              method2: (error2 as any).response?.status,
              method3: (error3 as any).response?.status
            }
          });
        }
      }
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