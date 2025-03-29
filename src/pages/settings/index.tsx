import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';

interface SettingsPageProps {
  jiraSettings: {
    baseUrl: string;
    username: string;
    apiTokenMasked: string;
    isConnected: boolean;
  };
  gitSettings: {
    provider: 'github' | 'gitlab' | 'bitbucket';
    organization: string;
    apiTokenMasked: string;
    isConnected: boolean;
  };
  dashboardSettings: {
    defaultDateRange: 'week' | 'month' | 'quarter' | 'year';
    refreshInterval: number;
    defaultTeam: string;
    theme: 'light' | 'dark' | 'system';
    showVelocityTrend: boolean;
    enableEmailReports: boolean;
    emailReportFrequency: 'daily' | 'weekly' | 'monthly';
    emailRecipients: string[];
  };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  jiraSettings, 
  gitSettings, 
  dashboardSettings 
}) => {
  // State for form values
  const [jiraBaseUrl, setJiraBaseUrl] = useState(jiraSettings.baseUrl);
  const [jiraUsername, setJiraUsername] = useState(jiraSettings.username);
  const [jiraApiToken, setJiraApiToken] = useState('');
  
  const [gitProvider, setGitProvider] = useState(gitSettings.provider);
  const [gitOrganization, setGitOrganization] = useState(gitSettings.organization);
  const [gitApiToken, setGitApiToken] = useState('');
  
  const [defaultDateRange, setDefaultDateRange] = useState(dashboardSettings.defaultDateRange);
  const [refreshInterval, setRefreshInterval] = useState(dashboardSettings.refreshInterval);
  const [defaultTeam, setDefaultTeam] = useState(dashboardSettings.defaultTeam);
  const [theme, setTheme] = useState(dashboardSettings.theme);
  const [showVelocityTrend, setShowVelocityTrend] = useState(dashboardSettings.showVelocityTrend);
  const [enableEmailReports, setEnableEmailReports] = useState(dashboardSettings.enableEmailReports);
  const [emailReportFrequency, setEmailReportFrequency] = useState(dashboardSettings.emailReportFrequency);
  const [emailRecipients, setEmailRecipients] = useState(dashboardSettings.emailRecipients.join(', '));
  
  // Form submission handlers
  const handleJiraFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update JIRA settings
    console.log('JIRA settings submitted:', { jiraBaseUrl, jiraUsername, jiraApiToken });
    alert('JIRA settings saved successfully!');
  };
  
  const handleGitFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update Git settings
    console.log('Git settings submitted:', { gitProvider, gitOrganization, gitApiToken });
    alert('Git settings saved successfully!');
  };
  
  const handleDashboardFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update dashboard settings
    const formattedEmailRecipients = emailRecipients.split(',').map(email => email.trim());
    console.log('Dashboard settings submitted:', { 
      defaultDateRange, 
      refreshInterval, 
      defaultTeam,
      theme,
      showVelocityTrend,
      enableEmailReports,
      emailReportFrequency,
      emailRecipients: formattedEmailRecipients
    });
    alert('Dashboard settings saved successfully!');
  };
  
  const handleTestJiraConnection = () => {
    // In a real app, this would test the JIRA connection using the provided credentials
    alert('JIRA connection test successful!');
  };
  
  const handleTestGitConnection = () => {
    // In a real app, this would test the Git connection using the provided credentials
    alert('Git connection test successful!');
  };

  return (
    <Layout title="Settings | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Settings</h1>
        <p className="text-gray-600">
          Configure your JIRA and Git connections, and customize dashboard preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JIRA Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">JIRA Connection</h2>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${jiraSettings.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{jiraSettings.isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
          
          <form onSubmit={handleJiraFormSubmit}>
            <div className="mb-4">
              <label htmlFor="jiraBaseUrl" className="block text-sm font-medium text-gray-700 mb-1">
                JIRA Base URL
              </label>
              <input
                type="url"
                id="jiraBaseUrl"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={jiraBaseUrl}
                onChange={(e) => setJiraBaseUrl(e.target.value)}
                placeholder="https://your-instance.atlassian.net"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="jiraUsername" className="block text-sm font-medium text-gray-700 mb-1">
                JIRA Username/Email
              </label>
              <input
                type="email"
                id="jiraUsername"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={jiraUsername}
                onChange={(e) => setJiraUsername(e.target.value)}
                placeholder="your-email@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="jiraApiToken" className="block text-sm font-medium text-gray-700 mb-1">
                JIRA API Token
              </label>
              <input
                type="password"
                id="jiraApiToken"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={jiraApiToken}
                onChange={(e) => setJiraApiToken(e.target.value)}
                placeholder={jiraSettings.apiTokenMasked}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank to keep the existing token unchanged.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save JIRA Settings
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={handleTestJiraConnection}
              >
                Test Connection
              </button>
            </div>
          </form>
        </div>

        {/* Git Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Git Provider Connection</h2>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${gitSettings.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{gitSettings.isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
          
          <form onSubmit={handleGitFormSubmit}>
            <div className="mb-4">
              <label htmlFor="gitProvider" className="block text-sm font-medium text-gray-700 mb-1">
                Git Provider
              </label>
              <select
                id="gitProvider"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={gitProvider}
                onChange={(e) => setGitProvider(e.target.value as 'github' | 'gitlab' | 'bitbucket')}
                required
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="gitOrganization" className="block text-sm font-medium text-gray-700 mb-1">
                Organization/Account Name
              </label>
              <input
                type="text"
                id="gitOrganization"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={gitOrganization}
                onChange={(e) => setGitOrganization(e.target.value)}
                placeholder="your-organization"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="gitApiToken" className="block text-sm font-medium text-gray-700 mb-1">
                API Token/Personal Access Token
              </label>
              <input
                type="password"
                id="gitApiToken"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={gitApiToken}
                onChange={(e) => setGitApiToken(e.target.value)}
                placeholder={gitSettings.apiTokenMasked}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank to keep the existing token unchanged.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Git Settings
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={handleTestGitConnection}
              >
                Test Connection
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dashboard Preferences */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Dashboard Preferences</h2>
        
        <form onSubmit={handleDashboardFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="defaultDateRange" className="block text-sm font-medium text-gray-700 mb-1">
                Default Date Range
              </label>
              <select
                id="defaultDateRange"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={defaultDateRange}
                onChange={(e) => setDefaultDateRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="year">Last 365 Days</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Dashboard Refresh Interval (minutes)
              </label>
              <input
                type="number"
                id="refreshInterval"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                min="0"
                step="5"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set to 0 to disable auto-refresh.
              </p>
            </div>
            
            <div>
              <label htmlFor="defaultTeam" className="block text-sm font-medium text-gray-700 mb-1">
                Default Team
              </label>
              <input
                type="text"
                id="defaultTeam"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={defaultTeam}
                onChange={(e) => setDefaultTeam(e.target.value)}
                placeholder="Team name or 'all'"
              />
            </div>
            
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">Use System Theme</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showVelocityTrend"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={showVelocityTrend}
                onChange={(e) => setShowVelocityTrend(e.target.checked)}
              />
              <label htmlFor="showVelocityTrend" className="ml-2 block text-sm text-gray-700">
                Show Velocity Trend in Overview
              </label>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-3">Email Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableEmailReports"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={enableEmailReports}
                onChange={(e) => setEnableEmailReports(e.target.checked)}
              />
              <label htmlFor="enableEmailReports" className="ml-2 block text-sm text-gray-700">
                Enable Automated Email Reports
              </label>
            </div>
            
            {enableEmailReports && (
              <>
                <div>
                  <label htmlFor="emailReportFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Report Frequency
                  </label>
                  <select
                    id="emailReportFrequency"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={emailReportFrequency}
                    onChange={(e) => setEmailReportFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="emailRecipients" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Recipients (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="emailRecipients"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Dashboard Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Data Export */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Data Export</h2>
        <p className="text-gray-600 mb-4">
          Export dashboard data in various formats for offline analysis or reporting.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">JIRA Story Points</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export story point completion metrics per team and sprint.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Git Metrics</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export commit activity, PRs, and code reviews data.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Team Performance</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export combined team metrics and performance analysis.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Member Metrics</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export individual team member performance data.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Sprint Reports</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export detailed sprint performance reports.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Full Dashboard</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export all dashboard data in a single comprehensive report.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                CSV
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                Excel
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real application, you would fetch this data from your API
  // For now, we'll use mock data
  const mockJiraSettings = {
    baseUrl: 'https://mycompany.atlassian.net',
    username: 'admin@example.com',
    apiTokenMasked: '••••••••••••••••',
    isConnected: true
  };
  
  const mockGitSettings = {
    provider: 'github' as const,
    organization: 'mycompany-org',
    apiTokenMasked: '••••••••••••••••',
    isConnected: true
  };
  
  const mockDashboardSettings = {
    defaultDateRange: 'month' as const,
    refreshInterval: 15,
    defaultTeam: 'all',
    theme: 'light' as const,
    showVelocityTrend: true,
    enableEmailReports: false,
    emailReportFrequency: 'weekly' as const,
    emailRecipients: ['admin@example.com']
  };

  return {
    props: {
      jiraSettings: mockJiraSettings,
      gitSettings: mockGitSettings,
      dashboardSettings: mockDashboardSettings
    }
  };
};

export default SettingsPage;
