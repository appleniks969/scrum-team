import React from 'react';
import Link from 'next/link';

interface MemberCardProps {
  id: string;
  name: string;
  teamName: string;
  metrics: {
    storyPoints: number;
    commits: number;
    pullRequests: number;
    reviews: number;
    responseTime: number;
  };
}

const MemberCard: React.FC<MemberCardProps> = ({
  id,
  name,
  teamName,
  metrics
}) => {
  // Get initial for avatar
  const initial = name.charAt(0).toUpperCase();
  
  // Format response time
  const formatResponseTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours.toFixed(1)} hrs`;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-semibold text-gray-700">{initial}</span>
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-500">{teamName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-gray-500">Story Points</div>
            <div className="text-lg font-semibold flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-blue-500 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {metrics.storyPoints}
            </div>
          </div>
          
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-gray-500">Commits</div>
            <div className="text-lg font-semibold flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-green-500 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
                />
              </svg>
              {metrics.commits}
            </div>
          </div>
          
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-gray-500">PRs Created</div>
            <div className="text-lg font-semibold flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-purple-500 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                />
              </svg>
              {metrics.pullRequests}
            </div>
          </div>
          
          <div className="bg-indigo-50 p-2 rounded">
            <div className="text-xs text-gray-500">PR Reviews</div>
            <div className="text-lg font-semibold flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-indigo-500 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              {metrics.reviews}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Review Response Time</span>
          <span className="font-medium flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            {formatResponseTime(metrics.responseTime)}
          </span>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 text-center border-t">
        <Link 
          href={`/members/${id}`} 
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MemberCard;
