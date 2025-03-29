import React from 'react';

const Footer: React.FC = () => {
  // Use a static date to avoid hydration errors
  // In a real application, you might want to use build-time env variables
  const lastUpdated = "3/29/2025";
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ScrumTeam Metrics Dashboard. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Version 1.0.0 | Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
