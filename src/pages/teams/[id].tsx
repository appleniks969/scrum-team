import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import ProgressBar from '../../components/charts/ProgressBar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useTeam, useTeamStats } from '../../hooks/useJiraData';
import { useTeamGitMetrics } from '../../hooks/useGitData';
import { useIntegratedTeamMetrics, useCorrelationInsights } from '../../hooks/useIntegratedMetrics';
import InsightCard from '../../components/dashboard/InsightCard';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function TeamDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  
  // Set default date range on first load
  useEffect(() => {
    if (!dateRange) {
      // Default to last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      
      setDateRange({
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      });
    }
  }, [dateRange]);
  
  // Fetch team data
  const { team, loading: teamLoading, error: teamError } = useTeam(id as string || null);
  
  // Fetch JIRA stats
  const { stats: jiraStats, loading: jiraLoading, error: jiraError } = useTeamStats(
    id as string || null,
    undefined,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Fetch Git metrics
  const { metrics: gitMetrics, loading: gitLoading, error: gitError } = useTeamGitMetrics(
    id as string || null,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Fetch integrated metrics
  const { metrics: integratedMetrics, loading: integratedLoading, error: integratedError } = useIntegratedTeamMetrics(
    id as string || null,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Fetch insights
  const { insights, loading: insightsLoading } = useCorrelationInsights({
    teamId: id as string || undefined,
    limit: 2
  });

  // Prepare weekly data for sprint burndown chart
  const prepareSprintBurndownData = () => {
    if (!jiraStats) return [];

    // This is simplified - in a real app, we would use real sprint data
    // For now, we'll return mock data
    return [
      { week: 'Week 1', remaining: 120, ideal: 120 },
      { week: 'Week 2', remaining: 95, ideal: 90 },
      { week: 'Week 3', remaining: 68, ideal: 60 },
      { week: 'Week 4', remaining: 32, ideal: 30 },
      { week: 'Week 5', remaining: 15, ideal: 0 }
    ];
  };

  // Prepare member contribution data
  const prepareMemberContributionData = () => {
    if (!jiraStats) return [];

    return jiraStats.memberStats.map(member => ({
      name: member.displayName,
      storyPoints: member.completedStoryPoints,
      completion: member.completionPercentage
    }));
  };

  // Combined loading state
  const isLoading = teamLoading || jiraLoading || gitLoading || integratedLoading;
  
  // Combined error state
  const error = teamError || jiraError || gitError || integratedError;

  if (isLoading) {
    return (
      <Layout title="Team Details">
        <LoadingState height={600} type="skeleton" message="Loading team data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Team Details">
        <ErrorAlert 
          message="Failed to load team data" 
          details={error.message}
          onRetry={() => router.reload()}
        />
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout title="Team Not Found">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Team not found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The team you are looking for does not exist or has been removed.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => router.push('/teams')}
                >
                  Go to Teams List
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const sprintBurndownData = prepareSprintBurndownData();
  const memberContributionData = prepareMemberContributionData();

  return (
    <Layout title={`${team.name} - Team Details`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-gray-600">Board ID: {team.boardId}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => router.push('/teams')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Teams List
          </button>
        </div>
      </div>
      
      <DateRangePicker
        onChange={setDateRange}
        className="mb-6"
      />
      
      {/* Overview metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Story Points</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900">
              {jiraStats?.completedStoryPoints || 0} / {jiraStats?.totalStoryPoints || 0}
            </p>
            <p className={`text-sm ${jiraStats?.completionPercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {jiraStats?.completionPercentage.toFixed(1)}%
            </p>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={jiraStats?.completedStoryPoints || 0}
              max={jiraStats?.totalStoryPoints || 1}
              colorScheme="blue"
              size="sm"
              showValue={false}
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Commits</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900">
              {gitMetrics?.metrics?.commitCount || 0}
            </p>
            <p className="text-sm text-gray-600">
              {jiraStats?.completedStoryPoints 
                ? ((gitMetrics?.metrics?.commitCount || 0) / jiraStats.completedStoryPoints).toFixed(2) 
                : '0'} per SP
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pull Requests</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900">
              {gitMetrics?.metrics?.prCount || 0}
            </p>
            <p className="text-sm text-gray-600">
              {gitMetrics?.metrics?.prMergedCount || 0} merged
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-gray-900">
              {jiraStats?.memberStats.length || 0}
            </p>
            <p className="text-sm text-gray-600">
              Active contributors
            </p>
          </div>
        </div>
      </div>
      
      {/* Sprint burndown chart */}
      <div className="mb-6">
        <LineChart 
          data={sprintBurndownData} 
          xAxisKey="week" 
          lines={[
            { key: 'remaining', name: 'Remaining Points', color: '#3b82f6' },
            { key: 'ideal', name: 'Ideal Burndown', color: '#6b7280' }
          ]}
          title="Sprint Burndown Chart"
          height={300}
        />
      </div>
      
      {/* Insights and member contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <h2 className="text-lg font-medium">Team Insights</h2>
          
          {insights && insights.length > 0 ? (
            insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm">No insights available for this team.</p>
            </div>
          )}
          
          {integratedMetrics && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Correlation Metrics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Story Point to Commit Ratio:</span>
                    <span className="font-medium">{integratedMetrics.correlations.storyPointToCommitRatio.toFixed(2)}</span>
                  </div>
                  <ProgressBar
                    value={integratedMetrics.correlations.storyPointToCommitRatio}
                    max={10}
                    colorScheme="blue"
                    size="sm"
                    showValue={false}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Planning Accuracy:</span>
                    <span className="font-medium">{integratedMetrics.correlations.planningAccuracy.toFixed(1)}%</span>
                  </div>
                  <ProgressBar
                    value={integratedMetrics.correlations.planningAccuracy}
                    max={100}
                    colorScheme="green"
                    size="sm"
                    showValue={false}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consistency Score:</span>
                    <span className="font-medium">{(integratedMetrics.correlations.consistency * 100).toFixed(1)}%</span>
                  </div>
                  <ProgressBar
                    value={integratedMetrics.correlations.consistency * 100}
                    max={100}
                    colorScheme="purple"
                    size="sm"
                    showValue={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Member Contributions</h2>
          
          <BarChart 
            data={memberContributionData} 
            xAxisKey="name" 
            bars={[
              { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' }
            ]}
            title="Story Points by Team Member"
            height={300}
          />
          
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Team Member Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Story Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion %
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRs
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jiraStats?.memberStats.map((member) => {
                    const gitMetricsForMember = gitMetrics?.memberMetrics?.[member.accountId];
                    
                    return (
                      <tr key={member.accountId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.displayName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.completedStoryPoints} / {member.totalStoryPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">
                              {member.completionPercentage.toFixed(1)}%
                            </span>
                            <div className="w-16">
                              <ProgressBar
                                value={member.completionPercentage}
                                max={100}
                                size="sm"
                                showValue={false}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {gitMetricsForMember?.commitCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {gitMetricsForMember?.prCount || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
