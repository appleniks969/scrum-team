import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/dashboard/MetricCard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

// Mock data
const commitActivityData = {
  total: 530,
  byTeam: [
    { team: "Team Alpha", count: 120 },
    { team: "Team Beta", count: 95 },
    { team: "Team Gamma", count: 110 },
    { team: "Team Delta", count: 65 },
    { team: "Team Epsilon", count: 140 }
  ],
  byDay: [
    { date: "2023-03-01", count: 25 },
    { date: "2023-03-02", count: 18 },
    { date: "2023-03-03", count: 22 },
    { date: "2023-03-04", count: 15 },
    { date: "2023-03-05", count: 12 },
    { date: "2023-03-06", count: 28 },
    { date: "2023-03-07", count: 32 }
  ],
  byWeek: [
    { week: "Week 1", count: 120 },
    { week: "Week 2", count: 135 },
    { week: "Week 3", count: 115 },
    { week: "Week 4", count: 160 }
  ]
};

const pullRequestsData = {
  total: 112,
  open: 14,
  merged: 98,
  byTeam: [
    { team: "Team Alpha", open: 3, merged: 25 },
    { team: "Team Beta", open: 2, merged: 20 },
    { team: "Team Gamma", open: 4, merged: 11 },
    { team: "Team Delta", open: 2, merged: 10 },
    { team: "Team Epsilon", open: 3, merged: 32 }
  ],
  ageDistribution: [
    { range: "< 1 day", count: 3 },
    { range: "1-2 days", count: 5 },
    { range: "3-7 days", count: 4 },
    { range: "> 7 days", count: 2 }
  ],
  timeToMerge: {
    average: 2.4, // in days
    byTeam: [
      { team: "Team Alpha", average: 1.8 },
      { team: "Team Beta", average: 2.2 },
      { team: "Team Gamma", average: 3.1 },
      { team: "Team Delta", average: 2.6 },
      { team: "Team Epsilon", average: 2.3 }
    ]
  }
};

const codeReviewsData = {
  total: 183,
  byTeam: [
    { team: "Team Alpha", count: 42 },
    { team: "Team Beta", count: 34 },
    { team: "Team Gamma", count: 38 },
    { team: "Team Delta", count: 24 },
    { team: "Team Epsilon", count: 45 }
  ],
  responseTime: {
    average: 5.2, // in hours
    byTeam: [
      { team: "Team Alpha", average: 4.9 },
      { team: "Team Beta", average: 4.2 },
      { team: "Team Gamma", average: 5.6 },
      { team: "Team Delta", average: 7.4 },
      { team: "Team Epsilon", average: 3.9 }
    ]
  },
  reviewQuality: {
    approved: 72,
    changesRequested: 89,
    commented: 22
  }
};

const repositoriesData = {
  total: 24,
  byTeam: [
    { team: "Team Alpha", count: 5 },
    { team: "Team Beta", count: 4 },
    { team: "Team Gamma", count: 6 },
    { team: "Team Delta", count: 3 },
    { team: "Team Epsilon", count: 6 }
  ],
  mostActive: [
    { name: "frontend-app", commits: 85, team: "Team Alpha" },
    { name: "api-service", commits: 72, team: "Team Beta" },
    { name: "data-pipeline", commits: 68, team: "Team Gamma" },
    { name: "mobile-app", commits: 56, team: "Team Delta" },
    { name: "analytics-platform", commits: 95, team: "Team Epsilon" }
  ]
};

interface GitMetricsPageProps {
  commitActivity: typeof commitActivityData;
  pullRequests: typeof pullRequestsData;
  codeReviews: typeof codeReviewsData;
  repositories: typeof repositoriesData;
}

const GitMetricsPage: React.FC<GitMetricsPageProps> = ({
  commitActivity,
  pullRequests,
  codeReviews,
  repositories
}) => {
  const [selectedTeam, setSelectedTeam] = useState('all');

  // Format data for charts
  const formatTeamData = (data: any) => {
    if (selectedTeam === 'all') {
      return data.byTeam;
    }
    return data.byTeam.filter((team: any) => team.team === selectedTeam);
  };

  // Create combined PR data
  const prDataByTeam = pullRequests.byTeam.map(team => ({
    name: team.team,
    open: team.open,
    merged: team.merged
  }));

  // Create combined time to merge data
  const timeToMergeData = pullRequests.timeToMerge.byTeam.map(team => ({
    name: team.team,
    average: team.average
  }));

  // Create combined response time data
  const responseTimeData = codeReviews.responseTime.byTeam.map(team => ({
    name: team.team,
    average: team.average
  }));

  // Create review quality data for pie chart
  const reviewQualityData = [
    { name: 'Approved', value: codeReviews.reviewQuality.approved },
    { name: 'Changes Requested', value: codeReviews.reviewQuality.changesRequested },
    { name: 'Commented', value: codeReviews.reviewQuality.commented }
  ];

  return (
    <Layout title="Git Metrics | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Git Metrics</h1>
        <p className="text-gray-600">
          Analysis of development activity from Git repositories.
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
              {commitActivity.byTeam.map((team) => (
                <option key={team.team} value={team.team}>{team.team}</option>
              ))}
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
          <div>
            <label htmlFor="repository" className="block text-sm font-medium text-gray-700 mb-1">
              Repository
            </label>
            <select
              id="repository"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              defaultValue="all"
            >
              <option value="all">All Repositories</option>
              {repositories.mostActive.map((repo) => (
                <option key={repo.name} value={repo.name}>{repo.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Commits" 
          value={commitActivity.total} 
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
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          } 
          color="green"
        />
        
        <MetricCard 
          title="Pull Requests" 
          value={pullRequests.total} 
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
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          } 
          color="purple"
        />
        
        <MetricCard 
          title="Open PRs" 
          value={pullRequests.open} 
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
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          } 
          color="yellow"
        />
        
        <MetricCard 
          title="Code Reviews" 
          value={codeReviews.total} 
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
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          } 
          color="indigo"
        />
      </div>

      {/* Commit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <LineChart 
            data={commitActivity.byDay} 
            xAxisKey="date" 
            lines={[
              { key: 'count', name: 'Commits', color: '#10b981' }
            ]}
            title="Daily Commit Activity"
            height={300}
          />
        </div>
        <div>
          <BarChart 
            data={formatTeamData(commitActivity)} 
            xAxisKey="team" 
            bars={[
              { key: 'count', name: 'Commits', color: '#10b981' }
            ]}
            title="Commits by Team"
            height={300}
          />
        </div>
      </div>

      {/* Pull Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <BarChart 
            data={selectedTeam === 'all' ? prDataByTeam : prDataByTeam.filter(pr => pr.name === selectedTeam)} 
            xAxisKey="name" 
            bars={[
              { key: 'open', name: 'Open', color: '#fbbf24' },
              { key: 'merged', name: 'Merged', color: '#8b5cf6' }
            ]}
            title="Pull Requests by Team"
            height={300}
          />
        </div>
        <div>
          <BarChart 
            data={pullRequests.ageDistribution} 
            xAxisKey="range" 
            bars={[
              { key: 'count', name: 'PRs', color: '#ec4899' }
            ]}
            title="PR Age Distribution"
            height={300}
          />
        </div>
      </div>

      {/* PR Time to Merge & Code Review Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <BarChart 
            data={selectedTeam === 'all' ? timeToMergeData : timeToMergeData.filter(tm => tm.name === selectedTeam)} 
            xAxisKey="name" 
            bars={[
              { key: 'average', name: 'Days to Merge', color: '#8b5cf6' }
            ]}
            title="Average Time to Merge by Team"
            height={300}
          />
        </div>
        <div>
          <BarChart 
            data={selectedTeam === 'all' ? responseTimeData : responseTimeData.filter(rt => rt.name === selectedTeam)} 
            xAxisKey="name" 
            bars={[
              { key: 'average', name: 'Response Hours', color: '#3b82f6' }
            ]}
            title="Code Review Response Time by Team"
            height={300}
          />
        </div>
      </div>

      {/* Most Active Repositories */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Most Active Repositories</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repository</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repositories.mostActive
                  .filter(repo => selectedTeam === 'all' || repo.team === selectedTeam)
                  .map((repo, index) => (
                    <tr key={repo.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{repo.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repo.team}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repo.commits}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{ width: `${(repo.commits / 100) * 100}%` }}
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

      {/* Code Review Quality */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Code Review Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{codeReviews.reviewQuality.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{codeReviews.reviewQuality.changesRequested}</div>
            <div className="text-sm text-gray-600">Changes Requested</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{codeReviews.reviewQuality.commented}</div>
            <div className="text-sm text-gray-600">Commented</div>
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
      commitActivity: commitActivityData,
      pullRequests: pullRequestsData,
      codeReviews: codeReviewsData,
      repositories: repositoriesData
    }
  };
};

export default GitMetricsPage;
