import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import MemberCard from '../../components/dashboard/MemberCard';

// Sample data - in a real application this would come from your API
const membersData = [
  { id: "user-1", name: "Alex Johnson", teamName: "Team Alpha", metrics: { storyPoints: 24, commits: 32, pullRequests: 8, reviews: 12, responseTime: 6.2 } },
  { id: "user-2", name: "Jordan Smith", teamName: "Team Alpha", metrics: { storyPoints: 18, commits: 25, pullRequests: 5, reviews: 8, responseTime: 4.5 } },
  { id: "user-3", name: "Taylor Roberts", teamName: "Team Alpha", metrics: { storyPoints: 22, commits: 30, pullRequests: 7, reviews: 10, responseTime: 5.1 } },
  { id: "user-4", name: "Morgan Lee", teamName: "Team Alpha", metrics: { storyPoints: 21, commits: 33, pullRequests: 8, reviews: 14, responseTime: 3.9 } },
  { id: "user-5", name: "Riley Chen", teamName: "Team Beta", metrics: { storyPoints: 15, commits: 28, pullRequests: 6, reviews: 10, responseTime: 2.8 } },
  { id: "user-6", name: "Casey Kim", teamName: "Team Beta", metrics: { storyPoints: 19, commits: 22, pullRequests: 4, reviews: 7, responseTime: 5.5 } },
  { id: "user-7", name: "Avery Patel", teamName: "Team Beta", metrics: { storyPoints: 16, commits: 24, pullRequests: 5, reviews: 9, responseTime: 4.2 } },
  { id: "user-8", name: "Quinn Wilson", teamName: "Team Gamma", metrics: { storyPoints: 22, commits: 35, pullRequests: 4, reviews: 15, responseTime: 5.0 } },
  { id: "user-9", name: "Harper Davis", teamName: "Team Gamma", metrics: { storyPoints: 20, commits: 27, pullRequests: 6, reviews: 12, responseTime: 3.5 } },
  { id: "user-10", name: "Skyler Martinez", teamName: "Team Delta", metrics: { storyPoints: 12, commits: 18, pullRequests: 3, reviews: 6, responseTime: 8.1 } },
  { id: "user-11", name: "Drew Thompson", teamName: "Team Delta", metrics: { storyPoints: 14, commits: 22, pullRequests: 4, reviews: 8, responseTime: 6.7 } },
  { id: "user-12", name: "Jamie Rodriguez", teamName: "Team Epsilon", metrics: { storyPoints: 25, commits: 40, pullRequests: 9, reviews: 18, responseTime: 2.3 } }
];

// Get unique team names for filtering
const teamNames = [...new Set(membersData.map(member => member.teamName))];

interface MembersPageProps {
  members: typeof membersData;
  teams: string[];
}

const MembersPage: React.FC<MembersPageProps> = ({ members, teams }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter members based on search query and selected team
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || member.teamName === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // Sort members based on selected criteria
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'name') {
      valueA = a.name;
      valueB = b.name;
    } else if (sortBy === 'team') {
      valueA = a.teamName;
      valueB = b.teamName;
    } else if (sortBy === 'storyPoints') {
      valueA = a.metrics.storyPoints;
      valueB = b.metrics.storyPoints;
    } else if (sortBy === 'commits') {
      valueA = a.metrics.commits;
      valueB = b.metrics.commits;
    } else if (sortBy === 'pullRequests') {
      valueA = a.metrics.pullRequests;
      valueB = b.metrics.pullRequests;
    } else if (sortBy === 'reviews') {
      valueA = a.metrics.reviews;
      valueB = b.metrics.reviews;
    } else if (sortBy === 'responseTime') {
      valueA = a.metrics.responseTime;
      valueB = b.metrics.responseTime;
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
    <Layout title="Team Members | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Team Members</h1>
        <p className="text-gray-600">
          Individual contributor metrics across all teams.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Members
            </label>
            <input
              type="text"
              id="search"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="team">Team</option>
              <option value="storyPoints">Story Points</option>
              <option value="commits">Commits</option>
              <option value="pullRequests">Pull Requests</option>
              <option value="reviews">Reviews</option>
              <option value="responseTime">Response Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedMembers.map((member) => (
          <MemberCard 
            key={member.id}
            id={member.id}
            name={member.name}
            teamName={member.teamName}
            metrics={member.metrics}
          />
        ))}
      </div>

      {sortedMembers.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No members match your search criteria.</p>
        </div>
      )}

      {/* Performance Rankings */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Performance Rankings</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('name')}
                >
                  Name
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('team')}
                >
                  Team
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('storyPoints')}
                >
                  Story Points
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('commits')}
                >
                  Commits
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('pullRequests')}
                >
                  PRs
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('reviews')}
                >
                  Reviews
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('responseTime')}
                >
                  Resp. Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedMembers.map((member, index) => (
                <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.teamName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metrics.storyPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metrics.commits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metrics.pullRequests}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metrics.reviews}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metrics.responseTime} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      members: membersData,
      teams: teamNames
    }
  };
};

export default MembersPage;
