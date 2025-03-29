import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('month');

  const activeLinkClass = "px-4 py-2 font-medium text-sm border-b-2 border-blue-500 text-blue-600";
  const inactiveLinkClass = "px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700";

  const isActiveLink = (path: string) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Development Metrics Dashboard
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center border rounded-md p-2 bg-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gray-500 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <select 
                className="text-sm border-none focus:ring-0 outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>
        
        <div className="flex border-b mt-4 overflow-x-auto">
          <Link 
            href="/" 
            className={isActiveLink('/') ? activeLinkClass : inactiveLinkClass}
          >
            Overview
          </Link>
          <Link 
            href="/teams" 
            className={isActiveLink('/teams') ? activeLinkClass : inactiveLinkClass}
          >
            Teams
          </Link>
          <Link 
            href="/members" 
            className={isActiveLink('/members') ? activeLinkClass : inactiveLinkClass}
          >
            Team Members
          </Link>
          <Link 
            href="/jira" 
            className={isActiveLink('/jira') ? activeLinkClass : inactiveLinkClass}
          >
            JIRA Metrics
          </Link>
          <Link 
            href="/git" 
            className={isActiveLink('/git') ? activeLinkClass : inactiveLinkClass}
          >
            Git Metrics
          </Link>
          <Link 
            href="/correlation" 
            className={isActiveLink('/correlation') ? activeLinkClass : inactiveLinkClass}
          >
            Correlation Analysis
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
