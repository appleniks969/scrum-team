import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import { useTeam, useTeamStats } from '../../../hooks/useJiraData';
import DateRangePicker from '../../../components/dashboard/DateRangePicker';
import MetricCard from '../../../components/dashboard/MetricCard';
import { 
  DynamicLineChart as LineChart, 
  DynamicBarChart as BarChart
} from '../../../components/dynamic';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function TeamDashboard() {
  const router = useRouter();
  const { id } = router.query;
  const teamId = typeof id === 'string' ? id : null;
  
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  
  // Get team data
  const { team, loading: teamLoading } = useTeam(teamId);
  
  // Get team stats
  const { stats, loading: statsLoading } = useTeamStats(
    teamId,
    undefined,
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
  
  // Prepare weekly velocity data
  const prepareVelocityData = () => {
    // This would be real data in a production app
    return [
      { week: 'Week 1', storyPoints: 25, completedPoints: 22 },
      { week: 'Week 2', storyPoints: 30, completedPoints: 27 },
      { week: 'Week 3', storyPoints: 28, completedPoints: 24 },
      { week: 'Week 4', storyPoints: 32, completedPoints: 30 }
    ];
  };
  
  // Prepare member contribution data
  const prepareMemberData = () => {
    if (!stats) return [];
    
    return stats.memberStats.map(member => ({
      name: member.displayName,
      storyPoints: member.totalStoryPoints,
      completedPoints: member.completedStoryPoints,
      completionPercentage: member.completionPercentage
    }));
  };
  
  const velocityData = prepareVelocityData();
  const memberData = prepareMemberData();
  
  const loading = teamLoading || statsLoading;
  
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
    <Layout title={team ? `${team.name} Dashboard` : 'Team Dashboard'}>
      {/* Header with team name */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {teamLoading ? (
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          ) : team ? (
            team.name
          ) : (
            'Team Not Found'
          )}
        </h1>
        {!teamLoading && !team && (
          <div className="text-red-500 mt-2">
            The requested team could not be found. Please check the team ID and try again.
          </div>
        )}
      </div>
      
      <DateRangePicker
        onChange={setDateRange}
        className="mb-6"
      />
      
      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i}>{renderSkeletonMetricCard()}</div>
            ))}
          </>
        ) : (
          <>
            <MetricCard 
              title="Total Story Points" 
              value={stats?.totalStoryPoints || 0} 
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
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <path d="M13 2v7h7" />
                </svg>
              } 
              color="blue"
              loading={loading}
            />
            
            <MetricCard 
              title="Completed Story Points" 
              value={stats?.completedStoryPoints || 0} 
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
              color="green"
              loading={loading}
            />
            
            <MetricCard 
              title="Completion Percentage" 
              value={stats?.completionPercentage || 0}
              suffix="%"
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
                  <path d="M16 8v8m-8-5v5m4-9v9" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              } 
              color="indigo"
              loading={loading}
            />
            
            <MetricCard 
              title="Team Members" 
              value={stats?.memberStats?.length || 0} 
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
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              } 
              color="purple"
              loading={loading}
            />
          </>
        )}
      </div>
      
      {/* Velocity Trend */}
      <div className="mb-6">
        <LineChart 
          data={velocityData} 
          xAxisKey="week" 
          lines={[
            { key: 'storyPoints', name: 'Planned Points', color: '#3b82f6' },
            { key: 'completedPoints', name: 'Completed Points', color: '#10b981' }
          ]}
          title="Weekly Velocity Trend"
          height={300}
        />
      </div>
      
      {/* Member Contributions */}
      <div className="mb-6">
        <BarChart 
          data={memberData} 
          xAxisKey="name" 
          bars={[
            { key: 'storyPoints', name: 'Total Points', color: '#3b82f6' },
            { key: 'completedPoints', name: 'Completed Points', color: '#10b981' }
          ]}
          title="Member Contributions"
          height={300}
        />
      </div>
    </Layout>
  );
}
