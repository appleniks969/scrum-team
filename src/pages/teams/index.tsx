import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import BarChart from '../../components/charts/BarChart';
import ProgressBar from '../../components/charts/ProgressBar';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import ExpandableTable from '../../components/tables/ExpandableTable';
import DetailCard from '../../components/cards/DetailCard';
import { useTeams, useAllTeamsStats } from '../../hooks/useJiraData';
import { useIntegratedTeamMetrics } from '../../hooks/useIntegratedMetrics';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function TeamsDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get teams data
  const { 
    teams, 
    loading: teamsLoading, 
    error: teamsError 
  } = useTeams();
  
  // Get all teams stats
  const { 
    stats: allTeamsStats, 
    loading: statsLoading, 
    error: statsError 
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

  // Prepare data for team metrics
  const prepareTeamMetrics = () => {
    if (!allTeamsStats || !teams) return [];
    
    return teams.map(team => {
      // Find stats for this team
      const stats = allTeamsStats.find(stat => stat.teamId === team.id);
      
      return {
        id: team.id,
        name: team.name,
        totalPoints: stats?.totalStoryPoints || 0,
        completedPoints: stats?.completedStoryPoints || 0,
        completionRate: stats?.completionPercentage || 0,
        memberCount: stats?.memberStats.length || 0,
        // Mock data for metrics not in the API yet
        commitCount: Math.floor(Math.random() * 200) + 50,
        prCount: Math.floor(Math.random() * 40) + 10,
        avgTimeToMerge: Math.floor(Math.random() * 24) + 4,
        bugCount: Math.floor(Math.random() * 15)
      };
    });
  };

  // Filter teams based on search term
  const filterTeams = (teams: any[]) => {
    if (!searchTerm) return teams;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(lowercaseSearch)
    );
  };

  // Sort teams by completion rate (highest first)
  const sortTeams = (teams: any[]) => {
    return [...teams].sort((a, b) => b.completionRate - a.completionRate);
  };

  // Process team data
  const teamMetrics = prepareTeamMetrics();
  const filteredTeams = sortTeams(filterTeams(teamMetrics));

  // Prepare team comparison data for chart
  const prepareTeamComparisonData = () => {
    return filteredTeams.slice(0, 5).map(team => ({
      name: team.name,
      storyPoints: team.completedPoints,
      completionRate: team.completionRate,
      commits: team.commitCount,
      prs: team.prCount
    }));
  };

  const teamComparisonData = prepareTeamComparisonData();

  // Calculate aggregate stats
  const calculateAggregateStats = () => {
    if (!teamMetrics || teamMetrics.length === 0) return {
      totalTeams: 0,
      averageCompletionRate: 0,
      totalStoryPoints: 0,
      totalCommits: 0,
      totalPRs: 0
    };
    
    return {
      totalTeams: teamMetrics.length,
      averageCompletionRate: teamMetrics.reduce((sum, team) => sum + team.completionRate, 0) / teamMetrics.length,
      totalStoryPoints: teamMetrics.reduce((sum, team) => sum + team.completedPoints, 0),
      totalCommits: teamMetrics.reduce((sum, team) => sum + team.commitCount, 0),
      totalPRs: teamMetrics.reduce((sum, team) => sum + team.prCount, 0)
    };
  };
  
  const aggregateStats = calculateAggregateStats();

  // Render loading or error states
  if ((teamsLoading && !teams) || (statsLoading && !allTeamsStats)) {
    return (
      <Layout title="Teams">
        <LoadingState height={500} message="Loading teams data..." />
      </Layout>
    );
  }

  if (teamsError || statsError) {
    return (
      <Layout title="Teams">
        <ErrorAlert 
          message="Failed to load teams data" 
          details="There was an error fetching the data. Please try again later."
        />
      </Layout>
    );
  }

  return (
    <Layout title="Teams">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Teams Dashboard</h1>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-4 w-4 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <DateRangePicker
        onChange={setDateRange}
        className="mb-6"
      />
      
      {/* Teams summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Teams</div>
          <div className="text-2xl font-bold mt-1">{aggregateStats.totalTeams}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Avg. Completion Rate</div>
          <div className="text-2xl font-bold mt-1">{aggregateStats.averageCompletionRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Story Points</div>
          <div className="text-2xl font-bold mt-1">{aggregateStats.totalStoryPoints}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Commits</div>
          <div className="text-2xl font-bold mt-1">{aggregateStats.totalCommits}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Pull Requests</div>
          <div className="text-2xl font-bold mt-1">{aggregateStats.totalPRs}</div>
        </div>
      </div>
      
      {/* Team Comparison Chart */}
      <div className="mb-6">
        <BarChart 
          data={teamComparisonData} 
          xAxisKey="name" 
          bars={[
            { key: 'storyPoints', name: 'Story Points', color: '#3B82F6' },
            { key: 'completionRate', name: 'Completion Rate (%)', color: '#10B981' },
            { key: 'commits', name: 'Commits', color: '#8B5CF6' },
            { key: 'prs', name: 'Pull Requests', color: '#F97316' }
          ]}
          title="Top Teams Comparison"
          height={300}
        />
      </div>
      
      {/* Teams List */}
      <ExpandableTable
        data={filteredTeams}
        keyField="id"
        loading={teamsLoading || statsLoading}
        emptyMessage="No teams found matching your search criteria."
        columns={[
          { key: 'name', header: 'Team Name' },
          { key: 'memberCount', header: 'Members' },
          {
            key: 'storyPoints',
            header: 'Story Points',
            render: (_, row) => `${row.completedPoints} / ${row.totalPoints}`
          },
          {
            key: 'completionRate',
            header: 'Completion Rate',
            render: (value) => (
              <div className="w-32">
                <ProgressBar
                  value={value}
                  max={100}
                  showValue={true}
                  valueFormatter={(val) => `${val.toFixed(1)}%`}
                  size="sm"
                />
              </div>
            )
          },
          { key: 'commitCount', header: 'Commits' },
          { key: 'prCount', header: 'Pull Requests' },
          { key: 'avgTimeToMerge', header: 'Avg. Time to Merge', render: (value) => `${value} hrs` },
          { key: 'bugCount', header: 'Bugs' },
          {
            key: 'actions',
            header: '',
            render: (_, row) => (
              <Link href={`/teams/${row.id}`} className="text-blue-600 hover:text-blue-900">
                View Details
              </Link>
            )
          }
        ]}
        renderExpandedRow={(row) => (
          <DetailCard
            title={`${row.name} Details`}
            sections={[
              {
                title: 'Performance Metrics',
                items: [
                  { label: 'Story Points Planned', value: row.totalPoints },
                  { label: 'Story Points Completed', value: row.completedPoints },
                  { label: 'Completion Rate', value: `${row.completionRate.toFixed(1)}%` },
                  { label: 'Commits', value: row.commitCount },
                  { label: 'Pull Requests', value: row.prCount },
                  { label: 'Average Time to Merge', value: `${row.avgTimeToMerge} hours` },
                  { label: 'Bugs Found', value: row.bugCount },
                ]
              },
              {
                title: 'Team Information',
                items: [
                  { label: 'Members', value: row.memberCount },
                  { label: 'Team Lead', value: 'Not Available' },
                  { label: 'Department', value: 'Engineering' },
                  { label: 'Active Since', value: 'January 2023' },
                ]
              }
            ]}
            actions={
              <>
                <Link href={`/teams/${row.id}`} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
                  View Dashboard
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Export Data
                </button>
              </>
            }
          />
        )}
      />
    </Layout>
  );
}
