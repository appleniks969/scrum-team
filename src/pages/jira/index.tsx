import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/dashboard/MetricCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import ProgressBar from '../../components/charts/ProgressBar';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import TeamSelector from '../../components/dashboard/TeamSelector';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useTeamStats, useAllTeamsStats } from '../../hooks/useJiraData';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function JiraMetricsDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Get team-specific stats if a team is selected
  const { 
    stats: teamStats, 
    loading: teamStatsLoading, 
    error: teamStatsError 
  } = useTeamStats(
    selectedTeamId,
    undefined,
    dateRange?.startDate,
    dateRange?.endDate
  );
  
  // Get all teams stats
  const { 
    stats: allTeamsStats, 
    loading: allTeamsLoading, 
    error: allTeamsError 
  } = useAllTeamsStats(
    dateRange?.startDate,
    dateRange?.endDate
  );

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

  // Prepare sprint performance data for chart
  const prepareSprintPerformanceData = () => {
    if (!allTeamsStats) return [];
    
    // In a real app, we would process the data from the API
    // For now, use mock data that simulates sprint data
    return [
      { sprint: 'Sprint 22', planned: 120, completed: 92, completion: 76.7 },
      { sprint: 'Sprint 23', planned: 108, completed: 90, completion: 83.3 },
      { sprint: 'Sprint 24', planned: 135, completed: 112, completion: 83.0 },
      { sprint: 'Sprint 25', planned: 140, completed: 121, completion: 86.4 },
      { sprint: 'Sprint 26', planned: 125, completed: 114, completion: 91.2 },
      { sprint: 'Sprint 27', planned: 148, completed: 132, completion: 89.2 }
    ];
  };

  // Prepare team completion data for chart
  const prepareTeamCompletionData = () => {
    if (!allTeamsStats) return [];
    
    return allTeamsStats.map(teamStat => ({
      name: teamStat.teamName,
      planned: teamStat.totalStoryPoints,
      completed: teamStat.completedStoryPoints,
      completion: teamStat.completionPercentage
    }));
  };

  // Prepare story point status breakdown data
  const prepareStatusBreakdownData = () => {
    if (!teamStats) return [];
    
    // In a real app, this would come from the API
    // For now, use mock data
    return [
      { status: 'Done', points: teamStats.completedStoryPoints, color: '#10B981' },
      { status: 'In Progress', points: Math.floor(teamStats.totalStoryPoints * 0.15), color: '#3B82F6' },
      { status: 'To Do', points: teamStats.totalStoryPoints - teamStats.completedStoryPoints - Math.floor(teamStats.totalStoryPoints * 0.15), color: '#6B7280' }
    ];
  };

  // Prepare estimation accuracy data
  const prepareEstimationAccuracyData = () => {
    if (!allTeamsStats) return [];
    
    // In a real app, this would be calculated from historical sprint data
    // For now, use mock data
    return [
      { name: 'Team Alpha', accuracy: 92, overEstimation: 3, underEstimation: 5 },
      { name: 'Team Beta', accuracy: 85, overEstimation: 10, underEstimation: 5 },
      { name: 'Team Gamma', accuracy: 76, overEstimation: 6, underEstimation: 18 },
      { name: 'Team Delta', accuracy: 81, overEstimation: 12, underEstimation: 7 },
      { name: 'Team Epsilon', accuracy: 89, overEstimation: 8, underEstimation: 3 }
    ];
  };

  // Prepare data for charts
  const sprintPerformanceData = prepareSprintPerformanceData();
  const teamCompletionData = prepareTeamCompletionData();
  const statusBreakdownData = prepareStatusBreakdownData();
  const estimationAccuracyData = prepareEstimationAccuracyData();

  // Calculate aggregate stats from all teams
  const calculateAggregateStats = () => {
    if (!allTeamsStats || allTeamsStats.length === 0) return {
      totalPlanned: 0,
      totalCompleted: 0,
      averageCompletion: 0
    };
    
    const totalPlanned = allTeamsStats.reduce((sum, team) => sum + team.totalStoryPoints, 0);
    const totalCompleted = allTeamsStats.reduce((sum, team) => sum + team.completedStoryPoints, 0);
    const averageCompletion = totalPlanned > 0 ? (totalCompleted / totalPlanned) * 100 : 0;
    
    return {
      totalPlanned,
      totalCompleted,
      averageCompletion
    };
  };
  
  const aggregateStats = calculateAggregateStats();

  // Render loading or error states
  if (allTeamsLoading && !allTeamsStats) {
    return (
      <Layout title="JIRA Metrics">
        <LoadingState height={500} message="Loading JIRA metrics..." />
      </Layout>
    );
  }

  if (allTeamsError) {
    return (
      <Layout title="JIRA Metrics">
        <ErrorAlert 
          message="Failed to load JIRA metrics" 
          details="There was an error fetching the data. Please try again later."
        />
      </Layout>
    );
  }

  return (
    <Layout title="JIRA Metrics">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-bold">JIRA Metrics Dashboard</h1>
        
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Total Story Points Planned" 
          value={aggregateStats.totalPlanned} 
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          } 
          color="blue"
          loading={allTeamsLoading}
        />
        
        <MetricCard 
          title="Total Story Points Completed" 
          value={aggregateStats.totalCompleted} 
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          } 
          color="green"
          loading={allTeamsLoading}
        />
        
        <MetricCard 
          title="Average Completion Rate" 
          value={`${aggregateStats.averageCompletion.toFixed(1)}%`} 
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
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
          } 
          color="purple"
          loading={allTeamsLoading}
        />
      </div>
      
      {/* Sprint Performance Over Time */}
      <div className="mb-6">
        <LineChart 
          data={sprintPerformanceData} 
          xAxisKey="sprint" 
          lines={[
            { key: 'planned', name: 'Planned Points', color: '#6B7280' },
            { key: 'completed', name: 'Completed Points', color: '#10B981' },
            { key: 'completion', name: 'Completion %', color: '#3B82F6' }
          ]}
          title="Sprint Performance Over Time"
          height={300}
        />
      </div>
      
      {/* Team Completion Comparison */}
      <div className="mb-6">
        <BarChart 
          data={teamCompletionData} 
          xAxisKey="name" 
          bars={[
            { key: 'planned', name: 'Planned Points', color: '#6B7280' },
            { key: 'completed', name: 'Completed Points', color: '#10B981' }
          ]}
          title="Team Story Point Completion"
          height={300}
        />
      </div>
      
      {/* Two-column layout for bottom charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Story Point Status Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Story Point Status Breakdown</h3>
          
          {selectedTeamId ? (
            teamStatsLoading ? (
              <LoadingState height={200} type="skeleton" />
            ) : (
              <>
                {statusBreakdownData.map((status) => (
                  <div key={status.status} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{status.status}</span>
                      </div>
                      <span className="text-sm text-gray-600">{status.points} points</span>
                    </div>
                    <ProgressBar 
                      value={status.points} 
                      max={teamStats?.totalStoryPoints || 1} 
                      showValue={false}
                      size="md"
                      colorScheme={
                        status.status === 'Done' ? 'green' : 
                        status.status === 'In Progress' ? 'blue' : 'indigo'
                      }
                    />
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-sm font-medium text-gray-700">
                      {teamStats?.totalStoryPoints} points
                    </span>
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded text-gray-500">
              Select a team to view status breakdown
            </div>
          )}
        </div>
        
        {/* Estimation Accuracy */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Estimation Accuracy</h3>
          
          <div className="space-y-4">
            {estimationAccuracyData.map((team) => (
              <div key={team.name} className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{team.name}</span>
                  <span className="text-sm text-gray-600">{team.accuracy}% accurate</span>
                </div>
                <div className="flex space-x-1 h-5">
                  <div 
                    className="bg-red-400 rounded-l" 
                    style={{ width: `${team.underEstimation}%` }}
                    title={`${team.underEstimation}% under-estimated`}
                  />
                  <div 
                    className="bg-green-400" 
                    style={{ width: `${team.accuracy}%` }}
                    title={`${team.accuracy}% accurate`}
                  />
                  <div 
                    className="bg-yellow-400 rounded-r" 
                    style={{ width: `${team.overEstimation}%` }}
                    title={`${team.overEstimation}% over-estimated`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Under</span>
                  <span>Accurate</span>
                  <span>Over</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Understanding Estimation Accuracy</p>
              <p>
                Green shows accurate estimates (±10% of actual), 
                yellow represents over-estimation, and 
                red shows under-estimation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
