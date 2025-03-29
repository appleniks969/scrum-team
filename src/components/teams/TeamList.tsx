import React, { useState } from 'react';
import TeamCard from './TeamCard';
import { useAllTeamsStats } from '../../hooks/useJiraData';
import LoadingState from '../ui/LoadingState';
import ErrorAlert from '../ui/ErrorAlert';

interface Team {
  id: string;
  name: string;
  storyPoints: number;
  completionPercentage: number;
  membersCount: number;
  sprintName?: string;
}

interface TeamListProps {
  startDate?: string;
  endDate?: string;
  className?: string;
}

const TeamList: React.FC<TeamListProps> = ({ 
  startDate, 
  endDate, 
  className = '' 
}) => {
  const { stats, loading, error } = useAllTeamsStats(startDate, endDate);
  const [sortBy, setSortBy] = useState<'name' | 'storyPoints' | 'completion'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  // Handle sort change
  const handleSortChange = (field: 'name' | 'storyPoints' | 'completion') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Transform stats data to team data
  const teamsData: Team[] = stats.map(stat => ({
    id: stat.teamId,
    name: stat.teamName,
    storyPoints: stat.completedStoryPoints,
    completionPercentage: stat.completionPercentage,
    membersCount: stat.memberStats.length,
    sprintName: stat.sprintName !== 'All Sprints' ? stat.sprintName : undefined
  }));

  // Filter teams
  const filteredTeams = teamsData.filter(team => 
    team.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort teams
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'storyPoints') {
      return sortOrder === 'asc'
        ? a.storyPoints - b.storyPoints
        : b.storyPoints - a.storyPoints;
    } else { // completion
      return sortOrder === 'asc'
        ? a.completionPercentage - b.completionPercentage
        : b.completionPercentage - a.completionPercentage;
    }
  });

  if (loading) {
    return <LoadingState height={400} type="skeleton" message="Loading teams..." />;
  }

  if (error) {
    return (
      <ErrorAlert 
        message="Failed to load teams data" 
        details={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search teams..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSortChange('name')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                sortBy === 'name'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('storyPoints')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                sortBy === 'storyPoints'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Story Points {sortBy === 'storyPoints' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('completion')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                sortBy === 'completion'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completion {sortBy === 'completion' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeams.length > 0 ? (
          sortedTeams.map(team => (
            <TeamCard
              key={team.id}
              id={team.id}
              name={team.name}
              storyPoints={team.storyPoints}
              completionPercentage={team.completionPercentage}
              membersCount={team.membersCount}
              sprintName={team.sprintName}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center p-8 text-gray-500">
            {filter ? 'No teams match your search' : 'No teams found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
