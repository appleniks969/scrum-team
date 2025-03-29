import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { GitHubApiClient } from '../../infrastructure/git-client';
import { GitHubIntegration, GitHubConfig } from '../../components/integrations';

export default function GitHubIntegrationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  // Load configuration from localStorage on mount
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('github_config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig) as GitHubConfig;
          setConfig(parsedConfig);
          setIsEnabled(true);
          return parsedConfig;
        } catch (err) {
          console.error('Error parsing GitHub config:', err);
          setError('Failed to load GitHub configuration');
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
      return null;
    };

    const fetchData = async (config: GitHubConfig) => {
      try {
        const client = new GitHubApiClient(config.token, config.organization);
        const repos = await client.getRepositories();
        setRepositories(repos);
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError('Failed to fetch repositories from GitHub');
        setConnectionStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    const loadedConfig = loadConfig();
    if (loadedConfig && loadedConfig.isConfigured) {
      fetchData(loadedConfig);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
  };

  const handleConfigSave = (newConfig: GitHubConfig) => {
    setConfig(newConfig);
    setIsEnabled(true);
    setConnectionStatus('connected');
    
    // Reload the page to fetch repositories with the new config
    window.location.reload();
  };

  return (
    <Layout title="GitHub Integration">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">GitHub Integration</h1>
          <p className="text-gray-500 mt-1">
            Connect ScrumTeam to your GitHub organization to track repositories, pull requests, and code reviews.
          </p>
        </div>

        <div className="mb-6">
          <GitHubIntegration 
            isEnabled={isEnabled}
            onToggle={handleToggle}
            onConfigSave={handleConfigSave}
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-500">Loading GitHub data...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {connectionStatus === 'connected' && config?.isConfigured && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Connected Repositories</h2>
                {repositories.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Repository
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visibility
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Updated
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {repositories
                          .filter(repo => config.repositories?.includes(repo.name))
                          .map((repo) => (
                            <tr key={repo.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                      {repo.name}
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  repo.private ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {repo.private ? 'Private' : 'Public'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">No repositories found</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            No repositories were found in the organization. Please check your configuration or select repositories to track.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {connectionStatus === 'disconnected' && (
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Not Connected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your GitHub integration to start tracking repositories.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}