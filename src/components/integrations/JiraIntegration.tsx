import React, { useState, useEffect } from 'react';

interface JiraIntegrationProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigSave: (config: JiraConfig) => void;
}

export interface JiraConfig {
  username: string;
  apiToken: string;
  instanceUrl: string;
  project: string;
  isConfigured: boolean;
  boards?: string[];
}

const JiraIntegration: React.FC<JiraIntegrationProps> = ({
  isEnabled,
  onToggle,
  onConfigSave
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<JiraConfig>({
    username: '',
    apiToken: '',
    instanceUrl: '',
    project: '',
    isConfigured: false
  });
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('jira_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig) as JiraConfig;
      setConfig(parsedConfig);
      
      if (parsedConfig.boards) {
        setSelectedBoards(parsedConfig.boards);
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
      // Here we would normally use a Jira client
      // For now, we'll just simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate some boards
      const mockBoards = [
        { id: '1', name: 'Sprint Board' },
        { id: '2', name: 'Kanban Board' },
        { id: '3', name: 'Backlog' },
        { id: '4', name: 'Planning Board' },
      ];
      
      setBoards(mockBoards);
      setTestSuccess(true);
    } catch (err) {
      setError('Connection failed. Please check your credentials and instance URL.');
      console.error('Jira connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBoard = (boardName: string) => {
    setSelectedBoards(prev => {
      if (prev.includes(boardName)) {
        return prev.filter(name => name !== boardName);
      } else {
        return [...prev, boardName];
      }
    });
  };

  const handleSave = () => {
    // Create the final config
    const finalConfig: JiraConfig = {
      ...config,
      isConfigured: true,
      boards: selectedBoards
    };
    
    // Save to localStorage
    localStorage.setItem('jira_config', JSON.stringify(finalConfig));
    
    // Notify parent component
    onConfigSave(finalConfig);
    
    // Close configuration panel
    setIsConfiguring(false);
  };

  const handleSelectAll = () => {
    if (boards.length > 0) {
      setSelectedBoards(boards.map(board => board.name));
    }
  };

  const handleDeselectAll = () => {
    setSelectedBoards([]);
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
            <h3 className="text-sm font-medium text-gray-900">Jira Integration</h3>
            <p className="text-sm text-gray-500">
              {config.isConfigured 
                ? `Connected to ${config.project} (${selectedBoards.length} boards)`
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
              <label htmlFor="instanceUrl" className="block text-sm font-medium text-gray-700">
                Jira Instance URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="instanceUrl"
                  id="instanceUrl"
                  value={config.instanceUrl}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://your-company.atlassian.net"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="username"
                  id="username"
                  value={config.username}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your-email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">
                API Token
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="apiToken"
                  id="apiToken"
                  value={config.apiToken}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Generate a token at Atlassian Account Settings &gt; Security &gt; API tokens
              </p>
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                Project Key
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="project"
                  id="project"
                  value={config.project}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="PRJ"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={testConnection}
                disabled={loading || !config.username || !config.apiToken || !config.instanceUrl || !config.project}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading || !config.username || !config.apiToken || !config.instanceUrl || !config.project
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
                  Successfully connected to Jira! Found {boards.length} boards.
                </div>
              )}
            </div>

            {testSuccess && boards.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Select Boards to Track</h4>
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
                    {boards.map((board) => (
                      <div key={board.id} className="flex items-center">
                        <input
                          id={`board-${board.id}`}
                          type="checkbox"
                          checked={selectedBoards.includes(board.name)}
                          onChange={() => handleToggleBoard(board.name)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`board-${board.id}`} className="ml-2 text-sm text-gray-700">
                          {board.name}
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
                disabled={!testSuccess}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !testSuccess
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

export default JiraIntegration;