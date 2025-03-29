import React from 'react';
import Link from 'next/link';

interface TeamCardProps {
  id: string;
  name: string;
  storyPoints: {
    completed: number;
    total: number;
  };
  commits: number;
  pullRequests: number;
  efficiency: number;
}

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  name,
  storyPoints,
  commits,
  pullRequests,
  efficiency
}) => {
  const getEfficiencyColor = () => {
    if (efficiency >= 0.8) return 'bg-green-500';
    if (efficiency >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      
      <div className="p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Story Points</p>
          <div className="mt-1 flex items-center">
            <span className="text-xl font-medium mr-2">
              {storyPoints.completed}/{storyPoints.total}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${(storyPoints.completed / storyPoints.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Commits</p>
          <p className="text-xl font-medium">{commits}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Pull Requests</p>
          <p className="text-xl font-medium">{pullRequests}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Efficiency</p>
          <div className="mt-1 flex items-center">
            <span className="text-xl font-medium mr-2">
              {(efficiency * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getEfficiencyColor()}`}
                style={{ width: `${efficiency * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 text-center">
        <Link 
          href={`/teams/${id}`} 
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
