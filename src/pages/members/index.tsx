import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import BarChart from '../../components/charts/BarChart';
import ProgressBar from '../../components/charts/ProgressBar';
import DateRangePicker from '../../components/dashboard/DateRangePicker';
import TeamSelector from '../../components/dashboard/TeamSelector';
import LoadingState from '../../components/ui/LoadingState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useTeams, useTeamStats } from '../../hooks/useJiraData';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function MembersDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get teams data
  const { 
    teams, 
    loading: teamsLoading, 
    error: teamsError 
  } = useTeams();
  
  // Get team stats (which include member stats)
  const { 
    stats: teamStats, 
    loading: statsLoading, 
    error: statsError 
  } = useTeamStats(
    selectedTeamId,
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

  // Prepare data for member metrics
  const prepareMemberMetrics = () => {
    if (!teamStats || !teamStats.memberStats) return [];
    
    return teamStats.memberStats.map(member => {
      return {
        id: member.accountId,
        name: member.displayName,
        totalPoints: member.totalStoryPoints,
        completedPoints: member.completedStoryPoints,
        completionRate: member.completionPercentage,
        teamId: teamStats.teamId,
        teamName: teamStats.teamName,
        // Mock data for metrics not in the API yet
        commitCount: Math.floor(Math.random() * 80) + 10,
        prCount: Math.floor(Math.random() * 15) + 2,
        reviewCount: Math.floor(Math.random() * 20) + 5,
        avgTimeToMerge: Math.floor(Math.random() * 24) + 2
      };
    });
  };

  // Filter members based on search term
  const filterMembers = (members: any[]) => {
    if (!searchTerm) return members;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return members.filter(member => 
      member.name.toLowerCase().includes(lowercaseSearch)
    );
  };

  // Sort members by completion rate (highest first)
  const sortMembers = (members: any[]) => {
    return [...members].sort((a, b) => b.completionRate - a.completionRate);
  };

  // Process member data
  const memberMetrics = prepareMemberMetrics();
  const filteredMembers = sortMembers(filterMembers(memberMetrics));

  // Prepare member comparison data for chart
  const prepareMemberComparisonData = () => {
    return filteredMembers.slice(0, 5).map(member => ({
      name: member.name,
      storyPoints: member.completedPoints,
      commits: member.commitCount,
      prs: member.prCount,
      reviews: member.reviewCount
    }));
  };

  const memberComparisonData = prepareMemberComparisonData();

  // Calculate aggregate stats
  const calculateAggregateStats = () => {
    if (!memberMetrics || memberMetrics.length === 0) return {
      totalMembers: 0,
      averageCompletionRate: 0,
      totalStoryPoints: 0,
      totalCommits: 0,
      totalPRs: 0
    };
    
    return {
      totalMembers: memberMetrics.length,
      averageCompletionRate: memberMetrics.reduce((sum, member) => sum + member.completionRate, 0) / memberMetrics.length,
      totalStoryPoints: memberMetrics.reduce((sum, member) => sum + member.completedPoints, 0),
      totalCommits: memberMetrics.reduce((sum, member) => sum + member.commitCount, 0),
      totalPRs: memberMetrics.reduce((sum, member) => sum + member.prCount, 0)
    };
  };
  
  const aggregateStats = calculateAggregateStats();

  // Render loading or error states
  if (teamsLoading && !teams) {
    return (
      <Layout title="Members">
        <LoadingState height={500} message="Loading teams data..." />
      </Layout>
    );
  }

  if (teamsError) {
    return (
      <Layout title="Members">
        <ErrorAlert 
          message="Failed to load teams data" 
          details="There was an error fetching the data. Please try again later."
        />
      </Layout>
    );
  }

  return (
    <Layout title="Members">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Members Dashboard</h1>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <TeamSelector
            selectedTeamId={selectedTeamId || undefined}
            onTeamSelect={setSelectedTeamId}
          />
          
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search members..."
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
      
      {/* Team selection prompt */}
      {!selectedTeamId && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please select a team to view member metrics.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state for stats */}
      {selectedTeamId && statsLoading && !teamStats && (
        <LoadingState height={400} message={`Loading metrics for ${teams.find(t => t.id === selectedTeamId)?.name || 'team'}...`} />
      )}
      
      {/* Error state for stats */}
      {selectedTeamId && statsError && (
        <ErrorAlert 
          message="Failed to load member metrics" 
          details="There was an error fetching the data. Please try again later."
        />
      )}
      
      {/* Member data display */}
      {selectedTeamId && teamStats && !statsLoading && (
        <>
          {/* Members summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Members</div>
              <div className="text-2xl font-bold mt-1">{aggregateStats.totalMembers}</div>
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
          </div>
          
          {/* Member Comparison Chart */}
          {memberComparisonData.length > 0 && (
            <div className="mb-6">
              <BarChart 
                data={memberComparisonData} 
                xAxisKey="name" 
                bars={[
                  { key: 'storyPoints', name: 'Story Points', color: '#3B82F6' },
                  { key: 'commits', name: 'Commits', color: '#8B5CF6' },
                  { key: 'prs', name: 'Pull Requests', color: '#F97316' },
                  { key: 'reviews', name: 'Reviews', color: '#10B981' }
                ]}
                title="Top Contributors"
                height={300}
              />
            </div>
          )}
          
          {/* Members List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed metrics for each member in {teamStats.teamName} during the selected time period.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Story Points (Completed/Total)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pull Requests
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Time to Merge
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.teamName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.completedPoints} / {member.totalPoints}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-32">
                          <ProgressBar
                            value={member.completionRate}
                            max={100}
                            showValue={true}
                            valueFormatter={(value) => `${value.toFixed(1)}%`}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.commitCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.prCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.reviewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.avgTimeToMerge} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/members/${member.id}`} className="text-blue-600 hover:text-blue-900">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredMembers.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No members found matching your search criteria.
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
