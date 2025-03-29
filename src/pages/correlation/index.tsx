import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ScatterChart from '../../components/charts/ScatterChart';
import HeatMap from '../../components/charts/HeatMap';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import TeamSelector from '../../components/dashboard/TeamSelector';
import InsightCard from '../../components/dashboard/InsightCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useIntegratedTeamMetrics, useCorrelationInsights } from '../../hooks/useIntegratedMetrics';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function CorrelationDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Get integrated team metrics for the selected team
  const { 
    metrics, 
    loading: metricsLoading, 
    error: metricsError 
  } = useIntegratedTeamMetrics(
    selectedTeamId,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Get insights
  const { 
    insights, 
    loading: insightsLoading, 
    error: insightsError 
  } = useCorrelationInsights({
    teamId: selectedTeamId || undefined,
    limit: 4
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

  // Prepare story point to commit correlation data
  const prepareCorrData = () => {
    // In a real app, this would come from the API
    // For now, create mock data
    return [
      { name: 'Team Alpha', storyPoints: 85, commits: 120, ratio: 1.41 },
      { name: 'Team Beta', storyPoints: 72, commits: 95, ratio: 1.32 },
      { name: 'Team Gamma', storyPoints: 65, commits: 110, ratio: 1.69 },
      { name: 'Team Delta', storyPoints: 45, commits: 65, ratio: 1.44 },
      { name: 'Team Epsilon', storyPoints: 92, commits: 140, ratio: 1.52 }
    ];
  };

  // Prepare planning vs execution data
  const preparePlanningVsExecution = () => {
    // Mock data for planning vs execution over time
    return [
      { sprint: 'Sprint 22', planned: 120, completed: 92, ratio: 76.7, commitCount: 145 },
      { sprint: 'Sprint 23', planned: 108, completed: 90, ratio: 83.3, commitCount: 132 },
      { sprint: 'Sprint 24', planned: 135, completed: 112, ratio: 83.0, commitCount: 168 },
      { sprint: 'Sprint 25', planned: 140, completed: 121, ratio: 86.4, commitCount: 176 },
      { sprint: 'Sprint 26', planned: 125, completed: 114, ratio: 91.2, commitCount: 152 },
      { sprint: 'Sprint 27', planned: 148, completed: 132, ratio: 89.2, commitCount: 184 }
    ];
  };

  // Prepare heatmap data for team efficiency
  const prepareTeamEfficiencyHeatmap = () => {
    // Mock data for team efficiency heatmap
    // X: Story point completion rate
    // Y: Commit to PR ratio
    // Value: Overall efficiency
    return [
      { name: 'Team Alpha', x: 92, y: 4.2, value: 88 },
      { name: 'Team Beta', x: 85, y: 3.8, value: 79 },
      { name: 'Team Gamma', x: 72, y: 5.1, value: 65 },
      { name: 'Team Delta', x: 78, y: 4.7, value: 72 },
      { name: 'Team Epsilon', x: 94, y: 3.5, value: 91 }
    ];
  };

  // Prepare velocity and quality correlation
  const prepareVelocityQualityData = () => {
    // Mock data for velocity vs quality
    return [
      { team: 'Team Alpha', velocity: 18, prMergeTime: 12, bugRate: 6 },
      { team: 'Team Beta', velocity: 15, prMergeTime: 8, bugRate: 4 },
      { team: 'Team Gamma', velocity: 22, prMergeTime: 18, bugRate: 9 },
      { team: 'Team Delta', velocity: 12, prMergeTime: 6, bugRate: 2 },
      { team: 'Team Epsilon', velocity: 20, prMergeTime: 14, bugRate: 7 }
    ];
  };

  // Prepare data for charts
  const correlationData = prepareCorrData();
  const planningVsExecution = preparePlanningVsExecution();
  const teamEfficiencyHeatmap = prepareTeamEfficiencyHeatmap();
  const velocityQualityData = prepareVelocityQualityData();

  // Render loading or error states
  if ((metricsLoading && !metrics) || (insightsLoading && !insights)) {
    return (
      <Layout title="Correlation Analysis">
        <LoadingState height={500} message="Loading correlation data..." />
      </Layout>
    );
  }

  if (metricsError || insightsError) {
    return (
      <Layout title="Correlation Analysis">
        <ErrorAlert 
          message="Failed to load correlation data" 
          details="There was an error fetching the data. Please try again later."
        />
      </Layout>
    );
  }

  return (
    <Layout title="Correlation Analysis">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-bold">Correlation Analysis Dashboard</h1>
        
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
      
      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Story Points to Commits Correlation */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Story Points to Commits Correlation</h3>
          
          <ScatterChart 
            data={correlationData.map(item => ({
              name: item.name,
              x: item.storyPoints,
              y: item.commits
            }))} 
            xAxisKey="x" 
            yAxisKey="y" 
            name="Teams" 
            color="#8B5CF6" 
            xAxisLabel="Story Points Completed"
            yAxisLabel="Commit Count"
            height={300}
          />
          
          <div className="mt-3 px-4 py-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="font-medium mb-1">Correlation Analysis</p>
            <p>
              Teams with more story points tend to have more commits, with an average ratio of 
              {' '}{(correlationData.reduce((sum, item) => sum + item.ratio, 0) / correlationData.length).toFixed(2)}{' '}
              commits per story point. This indicates a strong correlation between planning (story points) 
              and execution (commits).
            </p>
          </div>
        </div>
      </div>
      
      {/* Planning vs Execution Over Time */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Planning vs Execution Over Time</h3>
          
          <LineChart 
            data={planningVsExecution} 
            xAxisKey="sprint" 
            lines={[
              { key: 'planned', name: 'Planned Story Points', color: '#6B7280' },
              { key: 'completed', name: 'Completed Story Points', color: '#3B82F6' },
              { key: 'ratio', name: 'Completion Rate (%)', color: '#10B981' },
              { key: 'commitCount', name: 'Commit Count', color: '#8B5CF6' }
            ]}
            height={300}
          />
          
          <div className="mt-3 px-4 py-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="font-medium mb-1">Trend Analysis</p>
            <p>
              There is a positive trend in completion rate over the last 6 sprints, 
              increasing from {planningVsExecution[0].ratio}% to {planningVsExecution[planningVsExecution.length - 1].ratio}%. 
              This suggests improving alignment between planning and execution capabilities.
            </p>
          </div>
        </div>
      </div>
      
      {/* Two-column layout for bottom charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Team Efficiency Heatmap */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Team Efficiency Matrix</h3>
          
          <HeatMap 
            data={teamEfficiencyHeatmap}
            xAxisLabel="Story Point Completion Rate (%)"
            yAxisLabel="Commit to PR Ratio"
            title=""
            height={300}
            colorRange={['#e6f7ff', '#0050b3']}
          />
          
          <div className="mt-3 px-4 py-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="font-medium mb-1">Efficiency Analysis</p>
            <p>
              Teams with higher story point completion rates and moderate commit-to-PR ratios (3.5-4.5) 
              tend to have the highest overall efficiency. This suggests an optimal balance between 
              development activity and integration frequency.
            </p>
          </div>
        </div>
        
        {/* Velocity and Quality Correlation */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Velocity vs Quality</h3>
          
          <BarChart 
            data={velocityQualityData} 
            xAxisKey="team" 
            bars={[
              { key: 'velocity', name: 'Velocity (SP/Week)', color: '#3B82F6' },
              { key: 'prMergeTime', name: 'PR Merge Time (Hrs)', color: '#F97316' },
              { key: 'bugRate', name: 'Bug Rate (%)', color: '#EF4444' }
            ]}
            height={300}
          />
          
          <div className="mt-3 px-4 py-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="font-medium mb-1">Quality Analysis</p>
            <p>
              Teams with very high velocity tend to have longer PR merge times and higher bug rates, 
              suggesting a potential trade-off between speed and quality. Team Delta demonstrates 
              a good balance with moderate velocity and high quality metrics.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
