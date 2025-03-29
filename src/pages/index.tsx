import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout/Layout';
import MetricCard from '../components/dashboard/MetricCard';
import LineChart from '../components/charts/LineChart';
import ScatterChart from '../components/charts/ScatterChart';
import BarChart from '../components/charts/BarChart';

// Sample data - in a real app this would come from API
const weeklyData = [
  { week: 'Week 1', storyPoints: 45, commits: 62, prs: 15 },
  { week: 'Week 2', storyPoints: 52, commits: 78, prs: 18 },
  { week: 'Week 3', storyPoints: 48, commits: 70, prs: 16 },
  { week: 'Week 4', storyPoints: 60, commits: 85, prs: 22 }
];

const correlationData = [
  { name: 'Team Alpha', storyPoints: 85, commitCount: 120, ratio: 0.71 },
  { name: 'Team Beta', storyPoints: 72, commitCount: 95, ratio: 0.76 },
  { name: 'Team Gamma', storyPoints: 65, commitCount: 110, ratio: 0.59 },
  { name: 'Team Delta', storyPoints: 45, commitCount: 65, ratio: 0.69 },
  { name: 'Team Epsilon', storyPoints: 92, commitCount: 140, ratio: 0.66 }
];

const teamData = [
  { name: 'Team Alpha', storyPoints: 85, commits: 120, prs: 28 },
  { name: 'Team Beta', storyPoints: 72, commits: 95, prs: 22 },
  { name: 'Team Gamma', storyPoints: 65, commits: 110, prs: 15 },
  { name: 'Team Delta', storyPoints: 45, commits: 65, prs: 12 },
  { name: 'Team Epsilon', storyPoints: 92, commits: 140, prs: 35 }
];

interface DashboardProps {
  // This would typically contain data fetched from the server
  totalStoryPoints: number;
  totalCommits: number;
  totalPRs: number;
  activeTeams: number;
}

export default function Dashboard({ 
  totalStoryPoints, 
  totalCommits, 
  totalPRs, 
  activeTeams 
}: DashboardProps) {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Overview Dashboard</h1>
      
      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Story Points Completed" 
          value={totalStoryPoints} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          color="blue"
          trend={3.5}
        />
        
        <MetricCard 
          title="Total Commits" 
          value={totalCommits} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          } 
          color="green"
          trend={5.2}
        />
        
        <MetricCard 
          title="Pull Requests Merged" 
          value={totalPRs} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          } 
          color="purple"
          trend={-2.1}
        />
        
        <MetricCard 
          title="Active Teams" 
          value={activeTeams} 
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color="indigo"
        />
      </div>
      
      {/* Weekly activity trends */}
      <div className="mb-6">
        <LineChart 
          data={weeklyData} 
          xAxisKey="week" 
          lines={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'prs', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Weekly Activity Trends"
          height={300}
        />
      </div>
      
      {/* Correlation chart */}
      <div className="mb-6">
        <ScatterChart 
          data={correlationData} 
          xAxisKey="storyPoints" 
          yAxisKey="commitCount" 
          name="Teams" 
          color="#8884d8" 
          title="Story Points to Code Correlation"
          xAxisLabel="Story Points"
          yAxisLabel="Commits"
          height={300}
        />
        <div className="text-xs text-gray-500 mt-2 text-center">
          Chart shows correlation between story points completed and commit activity per team
        </div>
      </div>
      
      {/* Team comparison */}
      <div className="mb-6">
        <BarChart 
          data={teamData} 
          xAxisKey="name" 
          bars={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'prs', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Team Comparison"
          height={300}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real app, we would fetch this data from our API
  
  // Calculate total story points
  const totalStoryPoints = teamData.reduce((sum, team) => sum + team.storyPoints, 0);
  
  // Calculate total commits
  const totalCommits = teamData.reduce((sum, team) => sum + team.commits, 0);
  
  // Calculate total PRs
  const totalPRs = teamData.reduce((sum, team) => sum + team.prs, 0);
  
  // Count active teams
  const activeTeams = teamData.length;
  
  return {
    props: {
      totalStoryPoints,
      totalCommits,
      totalPRs,
      activeTeams
    }
  };
};
