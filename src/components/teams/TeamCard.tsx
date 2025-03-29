import React from 'react';
import Link from 'next/link';
import ProgressBar from '../charts/ProgressBar';

interface TeamCardProps {
  id: string;
  name: string;
  storyPoints: number;
  completionPercentage: number;
  membersCount: number;
  sprintName?: string;
  className?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  name,
  storyPoints,
  completionPercentage,
  membersCount,
  sprintName,
  className = ''
}) => {
  // Determine color based on completion percentage
  const getCardColor = () => {
    if (completionPercentage >= 90) return 'border-green-500';
    if (completionPercentage >= 75) return 'border-blue-500';
    if (completionPercentage >= 50) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow border-t-4 ${getCardColor()} p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {sprintName && (
            <p className="text-sm text-gray-500">
              Current sprint: {sprintName}
            </p>
          )}
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {membersCount} members
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <ProgressBar
            value={completionPercentage}
            max={100}
            title="Sprint Completion"
            size="md"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Story Points:</span>
          <span className="font-medium">{storyPoints}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <Link href={`/teams/${id}`}>
          <a className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
            View Details
            <svg 
              className="ml-1 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
