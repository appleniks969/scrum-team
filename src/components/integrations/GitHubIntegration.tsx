import React, { useState, useEffect } from 'react';
import { GitHubApiClient } from '../../infrastructure/git-client';

interface GitHubIntegrationProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigSave: (config: GitHubConfig) => void;
}

export interface GitHubConfig {
  token: string;
  organization: string;
  isConfigured: boolean;
  repositories?: string[];
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({
  isEnabled,
  onToggle,
  onConfigSave
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<GitHubConfig>({
    token: '',
    organization: '',
    isConfigured: false
  });
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('github_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig) as GitHubConfig;
      setConfig(parsedConfig);
      
      if (parsedConfig.repositories) {
        setSelectedRepos(parsedConfig.repositories);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
    
    // Reset test status when inputs change
    setTestSuccess(false);
    setError(null);
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestSuccess(false);
    
    try {
      const client = new GitHubApiClient(config.token, config.organization);
      const repos = await client.getRepositories();
      
      if (repos.length > 0) {
        setRepositories(repos);
        setTestSuccess(true);
      } else {
        setError('No repositories found. Please check the organization name.');
      }
    } catch (err) {
      setError('Connection failed. Please check your token and organization name.');
      console.error('GitHub connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRepo = (repoName: string) => {
    setSelectedRepos(prev => {
      if (prev.includes(repoName)) {
        return prev.filter(name => name !== repoName);
      } else {
        return [...prev, repoName];
      }
    });
  };

  const handleSave = () => {
    // Create the final config
    const finalConfig: GitHubConfig = {
      ...config,
      isConfigured: true,
      repositories: selectedRepos
    };
    
    // Save to localStorage
    localStorage.setItem('github_config', JSON.stringify(finalConfig));
    
    // Notify parent component
    onConfigSave(finalConfig);
    
    // Close configuration panel
    setIsConfiguring(false);
  };

  const handleSelectAll = () => {
    if (repositories.length > 0) {
      setSelectedRepos(repositories.map(repo => repo.name));
    }
  };

  const handleDeselectAll = () => {
    setSelectedRepos([]);
  };
  
  // Toggle the configuration panel
  const toggleConfigPanel = () => {
    setIsConfiguring(!isConfiguring);
    setError(null);
    setTestSuccess(false);
  };

  return (
    <div className="py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isEnabled}
            onClick={() => onToggle(!isEnabled)}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">GitHub Integration</h3>
            <p className="text-sm text-gray-500">
              {config.isConfigured 
                ? `Connected to ${config.organization} (${selectedRepos.length} repositories)`
                : isEnabled ? 'Enabled but not configured' : 'Disabled'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleConfigPanel}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isConfiguring ? 'Cancel' : 'Configure'}
        </button>
      </div>

      {isConfiguring && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                GitHub Personal Access Token
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="token"
                  id="token"
                  value={config.token}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="ghp_..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Token requires 'repo' and 'read:org' scopes
              </p>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                GitHub Organization Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  value={config.organization}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your-organization"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={testConnection}
                disabled={loading || !config.token || !config.organization}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading || !config.token || !config.organization
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>

              {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}

              {testSuccess && (
                <div className="mt-2 p-2 bg-green-100 text-green-700 text-sm rounded">
                  Successfully connected to GitHub! Found {repositories.length} repositories.
                </div>
              )}
            </div>

            {testSuccess && repositories.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Select Repositories to Track</h4>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {repositories.map((repo) => (
                      <div key={repo.id} className="flex items-center">
                        <input
                          id={`repo-${repo.id}`}
                          type="checkbox"
                          checked={selectedRepos.includes(repo.name)}
                          onChange={() => handleToggleRepo(repo.name)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`repo-${repo.id}`} className="ml-2 text-sm text-gray-700">
                          {repo.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!testSuccess || selectedRepos.length === 0}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !testSuccess || selectedRepos.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubIntegration;