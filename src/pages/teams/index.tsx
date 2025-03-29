import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import TeamCard from '../../components/dashboard/TeamCard';
import BarChart from '../../components/charts/BarChart';

// Sample data - in a real application this would come from your API
const teamsData = [
  { 
    id: "team-alpha", 
    name: "Team Alpha", 
    storyPoints: { completed: 85, total: 100 }, 
    commits: 120, 
    pullRequests: 28, 
    efficiency: 0.85 
  },
  { 
    id: "team-beta", 
    name: "Team Beta", 
    storyPoints: { completed: 72, total: 90 }, 
    commits: 95, 
    pullRequests: 22, 
    efficiency: 0.80 
  },
  { 
    id: "team-gamma", 
    name: "Team Gamma", 
    storyPoints: { completed: 65, total: 70 }, 
    commits: 110, 
    pullRequests: 15, 
    efficiency: 0.93 
  },
  { 
    id: "team-delta", 
    name: "Team Delta", 
    storyPoints: { completed: 45, total: 60 }, 
    commits: 65, 
    pullRequests: 12, 
    efficiency: 0.75 
  },
  { 
    id: "team-epsilon", 
    name: "Team Epsilon", 
    storyPoints: { completed: 92, total: 110 }, 
    commits: 140, 
    pullRequests: 35, 
    efficiency: 0.84 
  },
  { 
    id: "team-zeta", 
    name: "Team Zeta", 
    storyPoints: { completed: 57, total: 80 }, 
    commits: 75, 
    pullRequests: 20, 
    efficiency: 0.71 
  },
  { 
    id: "team-eta", 
    name: "Team Eta", 
    storyPoints: { completed: 68, total: 75 }, 
    commits: 88, 
    pullRequests: 18, 
    efficiency: 0.91 
  },
  { 
    id: "team-theta", 
    name: "Team Theta", 
    storyPoints: { completed: 79, total: 95 }, 
    commits: 105, 
    pullRequests: 25, 
    efficiency: 0.83 
  }
];

// Format data for bar chart
const chartData = teamsData.map(team => ({
  name: team.name,
  storyPoints: team.storyPoints.completed,
  commits: team.commits,
  pullRequests: team.pullRequests
}));

interface TeamsPageProps {
  teams: typeof teamsData;
  chartData: typeof chartData;
}

const TeamsPage: React.FC<TeamsPageProps> = ({ teams, chartData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort teams based on selected criteria
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'name') {
      valueA = a.name;
      valueB = b.name;
    } else if (sortBy === 'storyPoints') {
      valueA = a.storyPoints.completed;
      valueB = b.storyPoints.completed;
    } else if (sortBy === 'commits') {
      valueA = a.commits;
      valueB = b.commits;
    } else if (sortBy === 'pullRequests') {
      valueA = a.pullRequests;
      valueB = b.pullRequests;
    } else if (sortBy === 'efficiency') {
      valueA = a.efficiency;
      valueB = b.efficiency;
    } else {
      valueA = a.name;
      valueB = b.name;
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Toggle sort order when clicking on the same sort criteria
  const handleSortChange = (criteria: string) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  return (
    <Layout title="Teams | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Teams</h1>
        <p className="text-gray-600">
          Overview of all scrum teams and their performance metrics.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Teams
            </label>
            <input
              type="text"
              id="search"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Search by team name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Team Name</option>
              <option value="storyPoints">Story Points</option>
              <option value="commits">Commits</option>
              <option value="pullRequests">Pull Requests</option>
              <option value="efficiency">Efficiency</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <select
              id="sortOrder"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Metrics Chart */}
      <div className="mb-6">
        <BarChart 
          data={chartData} 
          xAxisKey="name" 
          bars={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'pullRequests', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Team Metrics Comparison"
          height={300}
          layout="vertical"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedTeams.map((team) => (
          <TeamCard
            key={team.id}
            id={team.id}
            name={team.name}
            storyPoints={team.storyPoints}
            commits={team.commits}
            pullRequests={team.pullRequests}
            efficiency={team.efficiency}
          />
        ))}
      </div>

      {sortedTeams.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No teams match your search criteria.</p>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real application, you would fetch this data from your API
  // For now, we'll use the mock data defined above

  return {
    props: {
      teams: teamsData,
      chartData
    }
  };
};

export default TeamsPage;
