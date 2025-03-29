import React, { useState, useEffect } from 'react';

interface GitLabIntegrationProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigSave: (config: GitLabConfig) => void;
}

export interface GitLabConfig {
  token: string;
  instanceUrl: string;
  group: string;
  isConfigured: boolean;
  projects?: string[];
}

const GitLabIntegration: React.FC<GitLabIntegrationProps> = ({
  isEnabled,
  onToggle,
  onConfigSave
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<GitLabConfig>({
    token: '',
    instanceUrl: 'https://gitlab.com',
    group: '',
    isConfigured: false
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('gitlab_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig) as GitLabConfig;
      setConfig(parsedConfig);
      
      if (parsedConfig.projects) {
        setSelectedProjects(parsedConfig.projects);
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
      // Here we would normally use a GitLab client
      // For now, we'll just simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate some projects
      const mockProjects = [
        { id: 1, name: 'project-1', path_with_namespace: `${config.group}/project-1` },
        { id: 2, name: 'project-2', path_with_namespace: `${config.group}/project-2` },
        { id: 3, name: 'project-3', path_with_namespace: `${config.group}/project-3` },
        { id: 4, name: 'project-4', path_with_namespace: `${config.group}/project-4` },
      ];
      
      setProjects(mockProjects);
      setTestSuccess(true);
    } catch (err) {
      setError('Connection failed. Please check your token and group name.');
      console.error('GitLab connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProject = (projectName: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectName)) {
        return prev.filter(name => name !== projectName);
      } else {
        return [...prev, projectName];
      }
    });
  };

  const handleSave = () => {
    // Create the final config
    const finalConfig: GitLabConfig = {
      ...config,
      isConfigured: true,
      projects: selectedProjects
    };
    
    // Save to localStorage
    localStorage.setItem('gitlab_config', JSON.stringify(finalConfig));
    
    // Notify parent component
    onConfigSave(finalConfig);
    
    // Close configuration panel
    setIsConfiguring(false);
  };

  const handleSelectAll = () => {
    if (projects.length > 0) {
      setSelectedProjects(projects.map(project => project.name));
    }
  };

  const handleDeselectAll = () => {
    setSelectedProjects([]);
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
            <h3 className="text-sm font-medium text-gray-900">GitLab Integration</h3>
            <p className="text-sm text-gray-500">
              {config.isConfigured 
                ? `Connected to ${config.group} (${selectedProjects.length} projects)`
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
                GitLab Access Token
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="token"
                  id="token"
                  value={config.token}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="glpat-..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Token requires 'read_api' scope
              </p>
            </div>

            <div>
              <label htmlFor="instanceUrl" className="block text-sm font-medium text-gray-700">
                GitLab Instance URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="instanceUrl"
                  id="instanceUrl"
                  value={config.instanceUrl}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://gitlab.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                GitLab Group
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="group"
                  id="group"
                  value={config.group}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your-group"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={testConnection}
                disabled={loading || !config.token || !config.group}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading || !config.token || !config.group
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
                  Successfully connected to GitLab! Found {projects.length} projects.
                </div>
              )}
            </div>

            {testSuccess && projects.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Select Projects to Track</h4>
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
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center">
                        <input
                          id={`project-${project.id}`}
                          type="checkbox"
                          checked={selectedProjects.includes(project.name)}
                          onChange={() => handleToggleProject(project.name)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`project-${project.id}`} className="ml-2 text-sm text-gray-700">
                          {project.path_with_namespace}
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
                disabled={!testSuccess || selectedProjects.length === 0}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !testSuccess || selectedProjects.length === 0
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

export default GitLabIntegration;