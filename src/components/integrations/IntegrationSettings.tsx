import React, { useState, useEffect } from 'react';
import { 
  GitHubIntegration, 
  GitLabIntegration, 
  JiraIntegration,
  GitHubConfig,
  GitLabConfig,
  JiraConfig
} from './index';

interface IntegrationSettingsProps {
  onIntegrationsChange?: (integrations: IntegrationsState) => void;
}

export interface IntegrationsState {
  github: {
    enabled: boolean;
    config: GitHubConfig | null;
  };
  gitlab: {
    enabled: boolean;
    config: GitLabConfig | null;
  };
  jira: {
    enabled: boolean;
    config: JiraConfig | null;
  };
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ 
  onIntegrationsChange 
}) => {
  // Initialize state
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    github: {
      enabled: false,
      config: null
    },
    gitlab: {
      enabled: false,
      config: null
    },
    jira: {
      enabled: false,
      config: null
    }
  });

  // Load saved state from localStorage on mount
  useEffect(() => {
    // Load GitHub config
    const githubConfig = localStorage.getItem('github_config');
    if (githubConfig) {
      const parsedConfig = JSON.parse(githubConfig) as GitHubConfig;
      setIntegrations(prev => ({
        ...prev,
        github: {
          enabled: true,
          config: parsedConfig
        }
      }));
    }

    // Load GitLab config
    const gitlabConfig = localStorage.getItem('gitlab_config');
    if (gitlabConfig) {
      const parsedConfig = JSON.parse(gitlabConfig) as GitLabConfig;
      setIntegrations(prev => ({
        ...prev,
        gitlab: {
          enabled: true,
          config: parsedConfig
        }
      }));
    }

    // Load Jira config
    const jiraConfig = localStorage.getItem('jira_config');
    if (jiraConfig) {
      const parsedConfig = JSON.parse(jiraConfig) as JiraConfig;
      setIntegrations(prev => ({
        ...prev,
        jira: {
          enabled: true,
          config: parsedConfig
        }
      }));
    }
  }, []);

  // Notify parent component when integrations change
  useEffect(() => {
    if (onIntegrationsChange) {
      onIntegrationsChange(integrations);
    }
  }, [integrations, onIntegrationsChange]);

  // Handle GitHub toggle
  const handleGitHubToggle = (enabled: boolean) => {
    setIntegrations(prev => ({
      ...prev,
      github: {
        ...prev.github,
        enabled
      }
    }));
  };

  // Handle GitHub config save
  const handleGitHubConfigSave = (config: GitHubConfig) => {
    setIntegrations(prev => ({
      ...prev,
      github: {
        enabled: true,
        config
      }
    }));
  };

  // Handle GitLab toggle
  const handleGitLabToggle = (enabled: boolean) => {
    setIntegrations(prev => ({
      ...prev,
      gitlab: {
        ...prev.gitlab,
        enabled
      }
    }));
  };

  // Handle GitLab config save
  const handleGitLabConfigSave = (config: GitLabConfig) => {
    setIntegrations(prev => ({
      ...prev,
      gitlab: {
        enabled: true,
        config
      }
    }));
  };

  // Handle Jira toggle
  const handleJiraToggle = (enabled: boolean) => {
    setIntegrations(prev => ({
      ...prev,
      jira: {
        ...prev.jira,
        enabled
      }
    }));
  };

  // Handle Jira config save
  const handleJiraConfigSave = (config: JiraConfig) => {
    setIntegrations(prev => ({
      ...prev,
      jira: {
        enabled: true,
        config
      }
    }));
  };

  return (
    <div className="space-y-2">
      <JiraIntegration 
        isEnabled={integrations.jira.enabled}
        onToggle={handleJiraToggle}
        onConfigSave={handleJiraConfigSave}
      />
      
      <GitHubIntegration 
        isEnabled={integrations.github.enabled}
        onToggle={handleGitHubToggle}
        onConfigSave={handleGitHubConfigSave}
      />
      
      <GitLabIntegration 
        isEnabled={integrations.gitlab.enabled}
        onToggle={handleGitLabToggle}
        onConfigSave={handleGitLabConfigSave}
      />
      
      <div className="mt-8">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Custom Integration
        </button>
      </div>
    </div>
  );
};

export default IntegrationSettings;