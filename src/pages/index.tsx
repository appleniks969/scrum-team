import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import MetricCard from '../components/dashboard/MetricCard';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import TeamSelector from '../components/dashboard/TeamSelector';
import DataSourceToggle, { DataSource } from '../components/dashboard/DataSourceToggle';
import InsightCard from '../components/dashboard/InsightCard';
import { useOverviewMetrics, useCorrelationInsights } from '../hooks/useIntegratedMetrics';
import { 
  DynamicLineChart as LineChart, 
  DynamicScatterChart as ScatterChart,
  DynamicBarChart as BarChart,
  DynamicHeatMap as HeatMap
} from '../components/dynamic';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function Dashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('integrated');
  const router = useRouter();

  // Get metrics data
  const { metrics, loading: metricsLoading, error: metricsError } = useOverviewMetrics(
    dateRange?.startDate,
    dateRange?.endDate
  );

  // Get insights
  const { insights, loading: insightsLoading } = useCorrelationInsights({
    teamId: selectedTeamId || undefined,
    limit: 3
  });

  // Handle team selection
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    
    // Navigate to the selected team's page
    router.push({
      pathname: `/teams/${teamId}`,
    });
  };

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

  // Prepare weekly data for charts
  const prepareWeeklyData = () => {
    if (!metrics) return [];

    // This is simplified - in a real app, we would properly process the raw data
    // For now, we'll return mock data that would resemble the processed data
    return [
      { week: 'Week 1', storyPoints: 45, commits: 62, prs: 15 },
      { week: 'Week 2', storyPoints: 52, commits: 78, prs: 18 },
      { week: 'Week 3', storyPoints: 48, commits: 70, prs: 16 },
      { week: 'Week 4', storyPoints: 60, commits: 85, prs: 22 }
    ];
  };

  // Prepare correlation data for scatter chart
  const prepareCorrelationData = () => {
    if (!metrics) return [];

    // In a real app, this would process the metrics data
    // For now, we'll return mock data
    return metrics.teamMetricsSummary.map(team => ({
      name: team.teamName,
      storyPoints: team.storyPoints,
      commitCount: team.commits,
      ratio: team.storyPoints > 0 ? (team.commits / team.storyPoints).toFixed(2) : 0
    }));
  };

  // Prepare team comparison data for bar chart
  const prepareTeamData = () => {
    if (!metrics) return [];

    return metrics.teamMetricsSummary.map(team => ({
      name: team.teamName,
      storyPoints: team.storyPoints,
      commits: team.commits,
      prs: team.prs,
      completionPercentage: team.completionPercentage
    }));
  };

  // Prepare heat map data
  const prepareHeatMapData = () => {
    if (!metrics) return [];

    // In a real app, this would process the metrics data
    // For now, we'll return mock data
    return [
      { name: 'Team Alpha', x: 85, y: 120, value: 94 },
      { name: 'Team Beta', x: 72, y: 95, value: 82 },
      { name: 'Team Gamma', x: 65, y: 110, value: 76 },
      { name: 'Team Delta', x: 45, y: 65, value: 58 },
      { name: 'Team Epsilon', x: 92, y: 140, value: 88 }
    ];
  };

  const weeklyData = prepareWeeklyData();
  const correlationData = prepareCorrelationData();
  const teamData = prepareTeamData();
  const heatMapData = prepareHeatMapData();

  // Show skeleton loaders while data is loading
  const renderSkeletonMetricCard = () => (
    <div className="animate-pulse bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
        <div className="ml-4 h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-9 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  return (
    <Layout>
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-bold">Overview Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <TeamSelector
            selectedTeamId={selectedTeamId || undefined}
            onTeamSelect={handleTeamSelect}
          />
          
          <DataSourceToggle
            value={dataSource}
            onChange={setDataSource}
          />
        </div>
      </div>
      
      <DateRangePicker
        onChange={setDateRange}
        className="mb-6"
      />
      
      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i}>{renderSkeletonMetricCard()}</div>
            ))}
          </>
        ) : (
          <>
            <MetricCard 
              title="Story Points Completed" 
              value={metrics?.completedStoryPoints || 0} 
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
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
              color="blue"
              trend={3.5}
              loading={metricsLoading}
            />
            
            <MetricCard 
              title="Total Commits" 
              value={metrics?.totalCommits || 0} 
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
              color="green"
              trend={5.2}
              loading={metricsLoading}
            />
            
            <MetricCard 
              title="Pull Requests Merged" 
              value={metrics?.totalPRs || 0} 
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
              trend={-2.1}
              loading={metricsLoading}
            />
            
            <MetricCard 
              title="Active Teams" 
              value={metrics?.activeTeams || 0} 
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
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              } 
              color="indigo"
              loading={metricsLoading}
            />
          </>
        )}
      </div>

      {/* Insights */}
      {!insightsLoading && insights && insights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Weekly activity trends */}
      <div className="mb-6">
        <LineChart 
          data={weeklyData} 
          xAxisKey="week" 
          lines={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'prs', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Weekly Activity Trends"
          height={300}
        />
      </div>
      
      {/* Correlation chart */}
      <div className="mb-6">
        <ScatterChart 
          data={correlationData} 
          xAxisKey="storyPoints" 
          yAxisKey="commitCount" 
          name="Teams" 
          color="#8884d8" 
          title="Story Points to Code Correlation"
          xAxisLabel="Story Points"
          yAxisLabel="Commits"
          height={300}
        />
        <div className="text-xs text-gray-500 mt-2 text-center">
          Chart shows correlation between story points completed and commit activity per team
        </div>
      </div>
      
      {/* Team comparison */}
      <div className="mb-6">
        <BarChart 
          data={teamData} 
          xAxisKey="name" 
          bars={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'prs', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Team Comparison"
          height={300}
        />
      </div>

      {/* Heat map */}
      <div className="mb-6">
        <HeatMap
          data={heatMapData}
          title="Team Activity Heatmap"
          xAxisLabel="Story Points"
          yAxisLabel="Commits"
          height={300}
          colorRange={['#e6f7ff', '#0050b3']}
        />
        <div className="text-xs text-gray-500 mt-2 text-center">
          Color intensity represents overall team performance score
        </div>
      </div>
    </Layout>
  );
}
