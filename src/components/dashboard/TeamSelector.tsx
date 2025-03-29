import React, { useState } from 'react';
import { useTeams } from '../../hooks/useJiraData';

interface TeamSelectorProps {
  onTeamSelect: (teamId: string) => void;
  selectedTeamId?: string;
  className?: string;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ 
  onTeamSelect, 
  selectedTeamId,
  className = ''
}) => {
  const { teams, loading, error } = useTeams();
  const [isOpen, setIsOpen] = useState(false);

  const handleTeamSelect = (teamId: string) => {
    onTeamSelect(teamId);
    setIsOpen(false);
  };

  // Find selected team name
  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  if (loading) {
    return (
      <div className={`inline-block ${className}`}>
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`inline-block text-red-500 ${className}`}>
        Failed to load teams
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center justify-between w-full sm:w-64 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedTeam ? selectedTeam.name : 'Select a team'}
        </span>
        <svg 
          className={`ml-2 h-5 w-5 text-gray-400 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full sm:w-64 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          <ul className="divide-y divide-gray-200">
            {teams.map((team) => (
              <li 
                key={team.id}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                  selectedTeamId === team.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleTeamSelect(team.id)}
              >
                <div className="flex items-center">
                  <span className="ml-3 block font-medium truncate">
                    {team.name}
                  </span>
                </div>

                {selectedTeamId === team.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg 
                      className="h-5 w-5 text-blue-600" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
