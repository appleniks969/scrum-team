import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import IntegrationSettings, { IntegrationsState } from '../../components/integrations/IntegrationSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardRefreshRate, setDashboardRefreshRate] = useState('30');
  const [defaultTimeRange, setDefaultTimeRange] = useState('30');
  const [dataIntegrations, setDataIntegrations] = useState<IntegrationsState>({
    jira: { enabled: false, config: null },
    github: { enabled: false, config: null },
    gitlab: { enabled: false, config: null }
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save settings to the backend
    alert('Settings saved successfully!');
  };

  return (
    <Layout title="Settings">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </button>
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'integrations' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('integrations')}
              >
                Integrations
              </button>
              <Link 
                href="/settings/profile" 
                className={`block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50`}
              >
                Profile Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'general' && 'General Settings'}
                {activeTab === 'appearance' && 'Appearance Settings'}
                {activeTab === 'notifications' && 'Notification Settings'}
                {activeTab === 'integrations' && 'Integration Settings'}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSaveSettings}>
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="dashboard-refresh" className="block text-sm font-medium text-gray-700">
                        Dashboard Refresh Rate
                      </label>
                      <select
                        id="dashboard-refresh"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={dashboardRefreshRate}
                        onChange={(e) => setDashboardRefreshRate(e.target.value)}
                      >
                        <option value="0">Manual refresh only</option>
                        <option value="30">Every 30 seconds</option>
                        <option value="60">Every minute</option>
                        <option value="300">Every 5 minutes</option>
                        <option value="600">Every 10 minutes</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        How often should the dashboard automatically refresh data.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="default-timerange" className="block text-sm font-medium text-gray-700">
                        Default Time Range
                      </label>
                      <select
                        id="default-timerange"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={defaultTimeRange}
                        onChange={(e) => setDefaultTimeRange(e.target.value)}
                      >
                        <option value="7">Last 7 days</option>
                        <option value="14">Last 14 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Default time range for metrics when opening dashboards.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          darkMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={darkMode}
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            darkMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Dark Mode</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enable dark mode for a more comfortable viewing experience in low-light environments.
                    </p>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Chart Color Theme
                      </label>
                      <div className="mt-2 grid grid-cols-4 gap-3">
                        <div className="flex items-center">
                          <input
                            id="color-theme-default"
                            name="color-theme"
                            type="radio"
                            defaultChecked
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="color-theme-default" className="ml-3 block text-sm text-gray-700">
                            Default
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="color-theme-blues"
                            name="color-theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="color-theme-blues" className="ml-3 block text-sm text-gray-700">
                            Blues
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="color-theme-greens"
                            name="color-theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="color-theme-greens" className="ml-3 block text-sm text-gray-700">
                            Greens
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="color-theme-brights"
                            name="color-theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="color-theme-brights" className="ml-3 block text-sm text-gray-700">
                            Vibrant
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={emailNotifications}
                        onClick={() => setEmailNotifications(!emailNotifications)}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            emailNotifications ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for report updates and system alerts.
                    </p>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Notification Types
                      </label>
                      <div className="mt-2 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="alerts"
                              name="alerts"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="alerts" className="font-medium text-gray-700">System Alerts</label>
                            <p className="text-gray-500">Notifications about system updates and maintenance.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="reports"
                              name="reports"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="reports" className="font-medium text-gray-700">Weekly Reports</label>
                            <p className="text-gray-500">Weekly summary of team performance metrics.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="thresholds"
                              name="thresholds"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="thresholds" className="font-medium text-gray-700">Threshold Alerts</label>
                            <p className="text-gray-500">Notifications when metrics cross defined thresholds.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Integration Settings */}
                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <IntegrationSettings 
                      onIntegrationsChange={setDataIntegrations}
                    />
                  </div>
                )}
                
                {/* Save button */}
                <div className="mt-8 border-t border-gray-200 pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}