import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import { GitHubConfig } from '../../components/integrations/GitHubIntegration';
import { GitLabConfig } from '../../components/integrations/GitLabIntegration';
import { JiraConfig } from '../../components/integrations/JiraIntegration';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState({
    github: { isConfigured: false, enabled: false, config: null as GitHubConfig | null },
    gitlab: { isConfigured: false, enabled: false, config: null as GitLabConfig | null },
    jira: { isConfigured: false, enabled: false, config: null as JiraConfig | null },
  });

  // Load integrations configuration
  useEffect(() => {
    // Load GitHub config
    const githubConfig = localStorage.getItem('github_config');
    if (githubConfig) {
      try {
        const parsedConfig = JSON.parse(githubConfig) as GitHubConfig;
        setIntegrations(prev => ({
          ...prev,
          github: {
            isConfigured: parsedConfig.isConfigured,
            enabled: true,
            config: parsedConfig
          }
        }));
      } catch (error) {
        console.error('Failed to parse GitHub config:', error);
      }
    }

    // Load GitLab config
    const gitlabConfig = localStorage.getItem('gitlab_config');
    if (gitlabConfig) {
      try {
        const parsedConfig = JSON.parse(gitlabConfig) as GitLabConfig;
        setIntegrations(prev => ({
          ...prev,
          gitlab: {
            isConfigured: parsedConfig.isConfigured,
            enabled: true,
            config: parsedConfig
          }
        }));
      } catch (error) {
        console.error('Failed to parse GitLab config:', error);
      }
    }

    // Load Jira config
    const jiraConfig = localStorage.getItem('jira_config');
    if (jiraConfig) {
      try {
        const parsedConfig = JSON.parse(jiraConfig) as JiraConfig;
        setIntegrations(prev => ({
          ...prev,
          jira: {
            isConfigured: parsedConfig.isConfigured,
            enabled: true,
            config: parsedConfig
          }
        }));
      } catch (error) {
        console.error('Failed to parse Jira config:', error);
      }
    }
  }, []);

  return (
    <Layout title="Integrations">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect ScrumTeam with external tools to track your team's performance.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* GitHub Integration Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-medium text-gray-900 truncate">GitHub</dt>
                      <dd>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            integrations.github.isConfigured
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {integrations.github.isConfigured ? 'Connected' : 'Not Configured'}
                          </span>
                          {integrations.github.isConfigured && (
                            <span className="ml-2 text-sm text-gray-500">
                              {integrations.github.config?.organization}
                            </span>
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Link href="/integrations/github" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Manage integration
                </Link>
              </div>
            </div>

            {/* Jira Integration Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-medium text-gray-900 truncate">Jira</dt>
                      <dd>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            integrations.jira.isConfigured
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {integrations.jira.isConfigured ? 'Connected' : 'Not Configured'}
                          </span>
                          {integrations.jira.isConfigured && (
                            <span className="ml-2 text-sm text-gray-500">
                              {integrations.jira.config?.project}
                            </span>
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Manage integration
                </div>
              </div>
            </div>

            {/* Add Integration Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">Add New Integration</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}