import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTeams } from '../../hooks/useJiraData';
import { mutate } from 'swr';
import fetcher from '../../utils/swrFetcher';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { teams, loading: teamsLoading } = useTeams();
  
  // Define prefetch function to load data for common navigation paths
  const prefetchData = async (path: string) => {
    try {
      // Prefetch based on the path
      if (path === '/') {
        // Prefetch overview metrics
        const currentDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = currentDate.toISOString().split('T')[0];
        
        const url = `/api/metrics/integrated?type=overview&startDate=${startDateStr}&endDate=${endDateStr}`;
        
        // Prefetch and prime the SWR cache
        await mutate(url, fetcher(url), false);
      } else if (path === '/teams') {
        // Prefetch teams
        await mutate('/api/jira/teams', fetcher('/api/jira/teams'), false);
      }
    } catch (error) {
      // Silently handle prefetch errors
      console.warn(`Error prefetching data for ${path}:`, error);
    }
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      )
    },
    {
      name: 'Teams',
      href: '/teams',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      )
    },
    {
      name: 'Members',
      href: '/members',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )
    },
    {
      name: 'JIRA Metrics',
      href: '/jira',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      )
    },
    {
      name: 'Git Metrics',
      href: '/git',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    },
    {
      name: 'Correlation',
      href: '/correlation',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isOpen ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md w-64 fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:static md:h-screen z-20`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Sidebar header - only visible on mobile */}
          <div className="p-4 border-b border-gray-200 md:hidden">
            <div className="flex items-center">
              <svg 
                className="h-8 w-8 text-blue-600" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13 6l-5 5 5 5z" />
                <path d="M13 6l5 5-5 5z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">ScrumTeam</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href || 
                              (item.href !== '/' && router.pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  onMouseEnter={() => prefetchData(item.href)}
                >
                  <div
                    className={`mr-3 ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
                      }`}
                    >
                      {item.icon}
                    </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Team Quick Access */}
          <div className="mt-8 px-4">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Your Teams
            </h3>
            <div className="mt-2 space-y-1">
              {teamsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
                  ))}
                </div>
              ) : teams && teams.length > 0 ? (
                teams.map(team => (
                  <Link 
                    key={team.id} 
                    href={`/teams/${team.id}`}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => {
                      // Navigate to the team page and send the team ID
                      router.push({
                        pathname: '/teams/[id]',
                        query: { id: team.id },
                      });
                    }}
                  >
                    <span className="truncate">{team.name}</span>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-2 px-2">
                  No teams available
                </div>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg 
                    className="h-4 w-4 text-green-600" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">System Status</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
