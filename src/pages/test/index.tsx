import React from 'react';
import Head from 'next/head';

export default function TestPage() {
  return (
    <div>
      <Head>
        <title>Test Page</title>
      </Head>
      
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">CSS Test Page</h1>
        <p className="text-lg mb-4">This page tests that Tailwind CSS is loading correctly.</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-4 rounded shadow">Box 1</div>
          <div className="bg-green-500 text-white p-4 rounded shadow">Box 2</div>
          <div className="bg-purple-500 text-white p-4 rounded shadow">Box 3</div>
        </div>
        
        <div className="border border-gray-300 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Icon Test</h2>
          <div className="flex items-center space-x-4">
            <svg 
              className="h-6 w-6 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span>Standard Icon</span>
          </div>
        </div>
      </main>
    </div>
  );
}
