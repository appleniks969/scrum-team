import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                  <svg 
                    className="h-8 w-8 text-blue-600" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M13 6l-5 5 5 5z" />
                    <path d="M13 6l5 5-5 5z" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">ScrumTeam</span>
              </Link>
            </div>
            
            <div className="hidden md:block ml-6">
              <div className="flex items-center space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/teams" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Teams
                </Link>
                <Link href="/members" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Members
                </Link>
                <Link href="/jira" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  JIRA
                </Link>
                <Link href="/git" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Git
                </Link>
                <Link href="/correlation" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Correlation
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Search */}
            <div className="hidden sm:flex items-center mr-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-4 w-4 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="relative mr-4">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <a href="#" className="px-4 py-3 flex hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg 
                              className="h-4 w-4 text-blue-600" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">Team Alpha completed Sprint 24</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </a>
                      <a href="#" className="px-4 py-3 flex hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <svg 
                              className="h-4 w-4 text-green-600" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">Pull request #42 merged</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </a>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all notifications</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                  JS
                </div>
              </button>
              
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Your Profile
                    </Link>
                    <Link href="/settings/preferences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Settings
                    </Link>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
