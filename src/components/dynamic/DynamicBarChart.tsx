import dynamic from 'next/dynamic';
import React from 'react';

// Define a loading component
const ChartLoading = () => (
  <div className="bg-white p-4 rounded-lg shadow animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded-md"></div>
  </div>
);

// Dynamically import the BarChart component
const DynamicBarChart = dynamic(
  () => import('../charts/BarChart'),
  {
    loading: () => <ChartLoading />,
    ssr: false // Disable server-side rendering for heavy chart components
  }
);

export default DynamicBarChart;
