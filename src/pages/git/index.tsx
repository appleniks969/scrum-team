import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/dashboard/MetricCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import ScatterChart from '../../components/charts/ScatterChart';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import TeamSelector from '../../components/dashboard/TeamSelector';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useTeamGitMetrics, usePullRequests } from '../../hooks/useGitData';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function GitMetricsDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Get team Git metrics if a team is selected
  const { 
    metrics: teamGitMetrics, 
    loading: teamMetricsLoading, 
    error: teamMetricsError 
  } = useTeamGitMetrics(
    selectedTeamId,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Get pull requests
  const { 
    pullRequests, 
    loading: prLoading, 
    error: prError 
  } = usePullRequests({
    teamId: selectedTeamId || undefined,
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
    pageSize: 100
  });

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

  // Prepare daily commit activity data for chart
  const prepareDailyCommitActivity = () => {
    if (!teamGitMetrics) return [];
    
    // In a real app, we would process the data from the API
    // For now, use mock data that simulates daily commit data
    return [
      { date: '2023-03-01', commits: 15, prs: 3, reviews: 7 },
      { date: '2023-03-02', commits: 12, prs: 2, reviews: 5 },
      { date: '2023-03-03', commits: 8, prs: 1, reviews: 3 },
      { date: '2023-03-04', commits: 4, prs: 0, reviews: 2 },
      { date: '2023-03-05', commits: 2, prs: 0, reviews: 1 },
      { date: '2023-03-06', commits: 18, prs: 4, reviews: 9 },
      { date: '2023-03-07', commits: 22, prs: 5, reviews: 11 },
      { date: '2023-03-08', commits: 19, prs: 3, reviews: 8 },
      { date: '2023-03-09', commits: 14, prs: 2, reviews: 6 },
      { date: '2023-03-10', commits: 11, prs: 2, reviews: 5 },
      { date: '2023-03-11', commits: 6, prs: 1, reviews: 3 },
      { date: '2023-03-12', commits: 3, prs: 0, reviews: 1 },
      { date: '2023-03-13', commits: 21, prs: 4, reviews: 10 },
      { date: '2023-03-14', commits: 24, prs: 5, reviews: 12 }
    ];
  };

  // Prepare pull request status data for chart
  const preparePrStatusData = () => {
    if (!pullRequests) return [];
    
    // Count PRs by status
    const openCount = pullRequests.filter(pr => pr.status === 'open').length;
    const closedCount = pullRequests.filter(pr => pr.status === 'closed' && pr.status !== 'merged').length;
    const mergedCount = pullRequests.filter(pr => pr.status === 'merged').length;
    
    return [
      { status: 'Open', count: openCount, color: '#3B82F6' },
      { status: 'Closed', count: closedCount, color: '#6B7280' },
      { status: 'Merged', count: mergedCount, color: '#8B5CF6' }
    ];
  };

  // Prepare PR review performance data
  const preparePrReviewPerformance = () => {
    if (!teamGitMetrics) return [];
    
    // In a real app, this would come from the API
    // For now, use mock data
    const memberIds = Object.keys(teamGitMetrics.memberMetrics || {}).slice(0, 5);
    
    return memberIds.map(memberId => {
      // Use the member metrics from the API, or generate mock data
      const metrics = teamGitMetrics.memberMetrics[memberId];
      
      return {
        name: `Member ${memberId.substring(0, 5)}`,
        reviewCount: metrics.codeReviewCount || Math.floor(Math.random() * 20) + 5,
        avgResponseTime: metrics.avgReviewResponseTime || Math.floor(Math.random() * 24) + 1,
        approvalRate: Math.floor(Math.random() * 40) + 60 // 60-100%
      };
    });
  };

  // Prepare repository activity data
  const prepareRepositoryActivity = () => {
    if (!teamGitMetrics) return [];
    
    // In a real app, this would be calculated from the API data
    // For now, mock data for repositories
    return (teamGitMetrics.repositories || ['repo1', 'repo2', 'repo3', 'repo4']).map(repo => ({
      name: repo,
      commits: Math.floor(Math.random() * 80) + 20,
      prs: Math.floor(Math.random() * 15) + 5,
      contributors: Math.floor(Math.random() * 5) + 2
    }));
  };

  // Prepare time to merge data
  const prepareTimeToMergeData = () => {
    if (!pullRequests) return [];
    
    // In a real app, we would process actual PR data
    // For now, create mock data for PR sizes and merge times
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      size: Math.floor(Math.random() * 500) + 50, // PR size in lines
      mergeTime: Math.floor(Math.random() * 72) + 1, // Hours to merge
      author: `Author ${i % 5}` // Mock author names
    }));
  };

  // Prepare data for charts
  const dailyCommitActivity = prepareDailyCommitActivity();
  const prStatusData = preparePrStatusData();
  const prReviewPerformance = preparePrReviewPerformance();
  const repositoryActivity = prepareRepositoryActivity();
  const timeToMergeData = prepareTimeToMergeData();

  // Render loading or error states
  if (teamMetricsLoading && !teamGitMetrics) {
    return (
      <Layout title="Git Metrics">
        <LoadingState height={500} message="Loading Git metrics..." />
      </Layout>
    );
  }

  if (teamMetricsError) {
    return (
      <Layout title="Git Metrics">
        <ErrorAlert 
          message="Failed to load Git metrics" 
          details="There was an error fetching the data. Please try again later."
        />
      </Layout>
    );
  }

  return (
    <Layout title="Git Metrics">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-bold">Git Metrics Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <TeamSelector
            selectedTeamId={selectedTeamId || undefined}
            onTeamSelect={setSelectedTeamId}
          />
        </div>
      </div>
      
      <DateRangePicker
        onChange={setDateRange}
        className="mb-6"
      />
      
      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Commits" 
          value={teamGitMetrics?.metrics.commitCount || 0} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          } 
          color="blue"
          loading={teamMetricsLoading}
        />
        
        <MetricCard 
          title="Pull Requests" 
          value={teamGitMetrics?.metrics.prCount || 0} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          } 
          color="purple"
          loading={teamMetricsLoading}
        />
        
        <MetricCard 
          title="Merged PRs" 
          value={teamGitMetrics?.metrics.prMergedCount || 0} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M21 3l-7 7" />
              <path d="M9 3H3v6" />
              <path d="M3 3l7 7" />
              <path d="M15 21h6v-6" />
              <path d="M21 21l-7-7" />
              <path d="M9 21H3v-6" />
              <path d="M3 21l7-7" />
            </svg>
          } 
          color="green"
          loading={teamMetricsLoading}
        />
        
        <MetricCard 
          title="Avg. Time to Merge" 
          value={`${teamGitMetrics?.metrics.avgPrTimeToMerge?.toFixed(1) || 0} hrs`} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          } 
          color="indigo"
          loading={teamMetricsLoading}
        />
      </div>
      
      {/* Daily Commit Activity */}
      <div className="mb-6">
        <LineChart 
          data={dailyCommitActivity} 
          xAxisKey="date" 
          lines={[
            { key: 'commits', name: 'Commits', color: '#3B82F6' },
            { key: 'prs', name: 'Pull Requests', color: '#8B5CF6' },
            { key: 'reviews', name: 'Code Reviews', color: '#10B981' }
          ]}
          title="Daily Development Activity"
          height={300}
        />
      </div>
      
      {/* Two-column layout for middle charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* PR Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Pull Request Status</h3>
          
          {prLoading ? (
            <LoadingState height={200} type="skeleton" />
          ) : (
            <div>
              <div className="flex space-x-4 mb-4">
                {prStatusData.map((status) => (
                  <div key={status.status} className="flex-1 bg-gray-50 p-3 rounded text-center">
                    <div 
                      className="w-6 h-6 rounded-full mx-auto mb-2" 
                      style={{ backgroundColor: status.color }}
                    />
                    <div className="text-2xl font-bold">{status.count}</div>
                    <div className="text-sm text-gray-500">{status.status}</div>
                  </div>
                ))}
              </div>
              
              <div className="h-8 flex rounded overflow-hidden">
                {prStatusData.map((status) => {
                  const totalCount = prStatusData.reduce((sum, item) => sum + item.count, 0);
                  const percentage = totalCount > 0 ? (status.count / totalCount) * 100 : 0;
                  
                  return (
                    <div 
                      key={status.status}
                      className="h-full"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: status.color 
                      }}
                      title={`${status.status}: ${percentage.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Time to Merge by PR Size */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Time to Merge by PR Size</h3>
          
          <ScatterChart
            data={timeToMergeData.map(pr => ({
              name: `PR #${pr.id}`,
              x: pr.size,
              y: pr.mergeTime
            }))}
            xAxisKey="x"
            yAxisKey="y"
            name="Pull Requests"
            color="#8B5CF6"
            xAxisLabel="PR Size (Lines)"
            yAxisLabel="Time to Merge (Hours)"
            height={200}
          />
        </div>
      </div>
      
      {/* PR Review Performance */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">PR Review Performance</h3>
          
          <BarChart 
            data={prReviewPerformance} 
            xAxisKey="name" 
            bars={[
              { key: 'reviewCount', name: 'Reviews', color: '#3B82F6' },
              { key: 'avgResponseTime', name: 'Avg. Response Time (hrs)', color: '#6B7280' },
              { key: 'approvalRate', name: 'Approval Rate (%)', color: '#10B981' }
            ]}
            height={300}
          />
        </div>
      </div>
      
      {/* Repository Activity */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Repository Activity</h3>
          
          <BarChart 
            data={repositoryActivity} 
            xAxisKey="name" 
            bars={[
              { key: 'commits', name: 'Commits', color: '#3B82F6' },
              { key: 'prs', name: 'Pull Requests', color: '#8B5CF6' },
              { key: 'contributors', name: 'Contributors', color: '#10B981' }
            ]}
            height={300}
          />
        </div>
      </div>
    </Layout>
  );
}
