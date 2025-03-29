import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/dashboard/MetricCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

// Mock data
const storyPointsData = {
  totalStoryPointsCompleted: 295,
  totalStoryPointsPlanned: 359,
  completionRate: 0.82,
  velocityTrend: [
    { sprint: "Sprint 1", velocity: 65 },
    { sprint: "Sprint 2", velocity: 72 },
    { sprint: "Sprint 3", velocity: 68 },
    { sprint: "Sprint 4", velocity: 90 }
  ],
  teams: [
    {
      id: "team-alpha",
      name: "Team Alpha",
      sprints: [
        {
          id: 1001,
          name: "Sprint 1",
          startDate: "2023-01-01",
          endDate: "2023-01-14",
          storyPoints: {
            total: 25,
            completed: 18,
            completionRate: 0.72
          }
        },
        {
          id: 1002,
          name: "Sprint 2",
          startDate: "2023-01-15",
          endDate: "2023-01-28",
          storyPoints: {
            total: 30,
            completed: 22,
            completionRate: 0.73
          }
        },
        {
          id: 1003,
          name: "Sprint 3",
          startDate: "2023-01-29",
          endDate: "2023-02-11",
          storyPoints: {
            total: 28,
            completed: 20,
            completionRate: 0.71
          }
        },
        {
          id: 1004,
          name: "Sprint 4",
          startDate: "2023-02-12",
          endDate: "2023-02-25",
          storyPoints: {
            total: 32,
            completed: 25,
            completionRate: 0.78
          }
        }
      ],
      issueStatusBreakdown: [
        { status: "To Do", count: 5, percentage: 14.3 },
        { status: "In Progress", count: 8, percentage: 22.9 },
        { status: "Code Review", count: 4, percentage: 11.4 },
        { status: "Done", count: 18, percentage: 51.4 }
      ],
      memberPerformance: [
        { name: "Alex Johnson", assigned: 10, completed: 5, percentage: 50 },
        { name: "Jordan Smith", assigned: 16, completed: 8, percentage: 50 },
        { name: "Taylor Roberts", assigned: 5, completed: 0, percentage: 0 },
        { name: "Morgan Lee", assigned: 3, completed: 3, percentage: 100 }
      ]
    },
    {
      id: "team-beta",
      name: "Team Beta",
      sprints: [
        {
          id: 2001,
          name: "Sprint 1",
          startDate: "2023-01-01",
          endDate: "2023-01-14",
          storyPoints: {
            total: 22,
            completed: 16,
            completionRate: 0.73
          }
        },
        {
          id: 2002,
          name: "Sprint 2",
          startDate: "2023-01-15",
          endDate: "2023-01-28",
          storyPoints: {
            total: 24,
            completed: 19,
            completionRate: 0.79
          }
        },
        {
          id: 2003,
          name: "Sprint 3",
          startDate: "2023-01-29",
          endDate: "2023-02-11",
          storyPoints: {
            total: 20,
            completed: 17,
            completionRate: 0.85
          }
        },
        {
          id: 2004,
          name: "Sprint 4",
          startDate: "2023-02-12",
          endDate: "2023-02-25",
          storyPoints: {
            total: 24,
            completed: 20,
            completionRate: 0.83
          }
        }
      ],
      issueStatusBreakdown: [
        { status: "To Do", count: 4, percentage: 13.3 },
        { status: "In Progress", count: 6, percentage: 20.0 },
        { status: "Code Review", count: 5, percentage: 16.7 },
        { status: "Done", count: 15, percentage: 50.0 }
      ],
      memberPerformance: [
        { name: "Riley Chen", assigned: 8, completed: 6, percentage: 75 },
        { name: "Casey Kim", assigned: 7, completed: 4, percentage: 57.1 },
        { name: "Avery Patel", assigned: 9, completed: 5, percentage: 55.6 }
      ]
    }
  ]
};

// Get team names for filter dropdown
const teamNames = storyPointsData.teams.map(team => team.name);

interface JiraMetricsPageProps {
  storyPoints: typeof storyPointsData;
}

const JiraMetricsPage: React.FC<JiraMetricsPageProps> = ({ storyPoints }) => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedSprint, setSelectedSprint] = useState('latest');
  
  // Filter teams based on selection
  const filteredTeams = selectedTeam === 'all' 
    ? storyPoints.teams 
    : storyPoints.teams.filter(team => team.name === selectedTeam);
  
  // Format team sprint data for chart
  const sprintPerformanceData = filteredTeams.flatMap(team => 
    team.sprints.map(sprint => ({
      team: team.name,
      sprint: sprint.name,
      planned: sprint.storyPoints.total,
      completed: sprint.storyPoints.completed,
      completionRate: sprint.storyPoints.completionRate
    }))
  );
  
  // Group by sprint for multi-team comparison
  const sprintComparisonData = selectedTeam === 'all' 
    ? storyPoints.teams.map(team => {
        // Get latest sprint for each team
        const latestSprint = team.sprints[team.sprints.length - 1];
        return {
          name: team.name,
          planned: latestSprint.storyPoints.total,
          completed: latestSprint.storyPoints.completed,
          completionRate: latestSprint.storyPoints.completionRate * 100 // Convert to percentage
        };
      })
    : filteredTeams.flatMap(team => 
        team.sprints.map(sprint => ({
          name: sprint.name,
          planned: sprint.storyPoints.total,
          completed: sprint.storyPoints.completed,
          completionRate: sprint.storyPoints.completionRate * 100 // Convert to percentage
        }))
      );
  
  // Get issue status data
  const issueStatusData = filteredTeams.flatMap(team => team.issueStatusBreakdown);
  const combinedStatusData = issueStatusData.reduce((acc, status) => {
    const existingStatus = acc.find(s => s.status === status.status);
    if (existingStatus) {
      existingStatus.count += status.count;
    } else {
      acc.push({ ...status });
    }
    return acc;
  }, [] as typeof issueStatusData);
  
  // Calculate total count for percentage recalculation
  const totalIssues = combinedStatusData.reduce((sum, status) => sum + status.count, 0);
  combinedStatusData.forEach(status => {
    status.percentage = (status.count / totalIssues) * 100;
  });
  
  // Member performance data
  const memberPerformanceData = filteredTeams.flatMap(team => team.memberPerformance);

  return (
    <Layout title="JIRA Metrics | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">JIRA Story Points Metrics</h1>
        <p className="text-gray-600">
          Analysis of story point completion and sprint performance across teams.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Team
            </label>
            <select
              id="team"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="all">All Teams</option>
              {teamNames.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sprint" className="block text-sm font-medium text-gray-700 mb-1">
              Sprint
            </label>
            <select
              id="sprint"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
            >
              <option value="latest">Latest Sprint</option>
              <option value="all">All Sprints</option>
              <option value="sprint1">Sprint 1</option>
              <option value="sprint2">Sprint 2</option>
              <option value="sprint3">Sprint 3</option>
              <option value="sprint4">Sprint 4</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              defaultValue="month"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 365 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Planned Story Points" 
          value={storyPoints.totalStoryPointsPlanned} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          } 
          color="blue"
        />
        
        <MetricCard 
          title="Completed Story Points" 
          value={storyPoints.totalStoryPointsCompleted} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          color="green"
        />
        
        <MetricCard 
          title="Completion Rate" 
          value={`${(storyPoints.completionRate * 100).toFixed(1)}%`} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } 
          color="purple"
        />
        
        <MetricCard 
          title="Teams" 
          value={storyPoints.teams.length} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color="indigo"
        />
      </div>

      {/* Velocity Trend */}
      <div className="mb-6">
        <LineChart 
          data={storyPoints.velocityTrend} 
          xAxisKey="sprint" 
          lines={[
            { key: 'velocity', name: 'Velocity', color: '#3b82f6' }
          ]}
          title="Velocity Trend Across Sprints"
          height={300}
        />
      </div>

      {/* Team Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <BarChart 
            data={sprintComparisonData} 
            xAxisKey="name" 
            bars={[
              { key: 'planned', name: 'Planned', color: '#3b82f6' },
              { key: 'completed', name: 'Completed', color: '#10b981' }
            ]}
            title={selectedTeam === 'all' ? "Team Comparison (Latest Sprint)" : "Sprint Performance"}
            height={300}
          />
        </div>
        <div>
          <BarChart 
            data={sprintComparisonData} 
            xAxisKey="name" 
            bars={[
              { key: 'completionRate', name: 'Completion Rate (%)', color: '#8b5cf6' }
            ]}
            title={selectedTeam === 'all' ? "Completion Rate by Team" : "Completion Rate by Sprint"}
            height={300}
          />
        </div>
      </div>

      {/* Issue Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Issue Status Breakdown</h3>
          <div className="relative pt-1">
            <div className="flex h-6 overflow-hidden text-xs bg-gray-200 rounded">
              {combinedStatusData.map((status, index) => (
                <div
                  key={status.status}
                  className={`flex flex-col justify-center text-center text-white ${
                    status.status === 'Done' 
                      ? 'bg-green-500' 
                      : status.status === 'In Progress' 
                        ? 'bg-blue-500' 
                        : status.status === 'Code Review' 
                          ? 'bg-purple-500' 
                          : 'bg-gray-500'
                  }`}
                  style={{ width: `${status.percentage}%` }}
                >
                  {status.percentage > 10 && `${status.status} (${status.percentage.toFixed(1)}%)`}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {combinedStatusData.map((status) => (
              <div key={status.status} className="flex items-center text-sm">
                <div className={`w-3 h-3 mr-2 rounded-full ${
                  status.status === 'Done' 
                    ? 'bg-green-500' 
                    : status.status === 'In Progress' 
                      ? 'bg-blue-500' 
                      : status.status === 'Code Review' 
                        ? 'bg-purple-500' 
                        : 'bg-gray-500'
                }`}></div>
                <span>{status.status}: {status.count} issues ({status.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Issue Type Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">65%</div>
              <div className="text-sm text-gray-600">Tasks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">20%</div>
              <div className="text-sm text-gray-600">User Stories</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">10%</div>
              <div className="text-sm text-gray-600">Bugs</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">5%</div>
              <div className="text-sm text-gray-600">Epics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Performance */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Member Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberPerformanceData.map((member, index) => (
                  <tr key={member.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.assigned} pts</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.completed} pts</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.percentage}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className={`h-2.5 rounded-full ${
                            member.percentage >= 80 
                              ? 'bg-green-500' 
                              : member.percentage >= 50 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${member.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real application, you would fetch this data from your API
  // For now, we'll use the mock data defined above

  return {
    props: {
      storyPoints: storyPointsData
    }
  };
};

export default JiraMetricsPage;
