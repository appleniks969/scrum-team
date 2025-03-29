import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import MemberCard from '../../components/dashboard/MemberCard';
import LineChart from '../../components/charts/LineChart';
import ScatterChart from '../../components/charts/ScatterChart';

// Sample data
const teamsData = {
  "team-alpha": {
    id: "team-alpha",
    name: "Team Alpha",
    storyPoints: { completed: 85, total: 100 },
    commits: 120,
    pullRequests: 28,
    efficiency: 0.85,
    sprintData: [
      { sprint: "Sprint 1", storyPoints: 18, commits: 25, prs: 6, efficiency: 0.81 },
      { sprint: "Sprint 2", storyPoints: 22, commits: 30, prs: 7, efficiency: 0.83 },
      { sprint: "Sprint 3", storyPoints: 20, commits: 32, prs: 8, efficiency: 0.87 },
      { sprint: "Sprint 4", storyPoints: 25, commits: 33, prs: 7, efficiency: 0.89 }
    ],
    members: [
      { id: "user-1", name: "Alex Johnson", teamName: "Team Alpha", metrics: { storyPoints: 24, commits: 32, pullRequests: 8, reviews: 12, responseTime: 6.2 } },
      { id: "user-2", name: "Jordan Smith", teamName: "Team Alpha", metrics: { storyPoints: 18, commits: 25, pullRequests: 5, reviews: 8, responseTime: 4.5 } },
      { id: "user-3", name: "Taylor Roberts", teamName: "Team Alpha", metrics: { storyPoints: 22, commits: 30, pullRequests: 7, reviews: 10, responseTime: 5.1 } },
      { id: "user-4", name: "Morgan Lee", teamName: "Team Alpha", metrics: { storyPoints: 21, commits: 33, pullRequests: 8, reviews: 14, responseTime: 3.9 } }
    ],
    commitToPointRatio: [
      { name: "Alex", storyPoints: 24, commitCount: 32, ratio: 0.75 },
      { name: "Jordan", storyPoints: 18, commitCount: 25, ratio: 0.72 },
      { name: "Taylor", storyPoints: 22, commitCount: 30, ratio: 0.73 },
      { name: "Morgan", storyPoints: 21, commitCount: 33, ratio: 0.64 }
    ]
  },
  // Add similar data structures for other teams...
};

// Create mock data for any team ID not in the actual data
const createMockTeamData = (id: string) => {
  const name = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    id,
    name,
    storyPoints: { completed: Math.floor(Math.random() * 50) + 50, total: Math.floor(Math.random() * 30) + 80 },
    commits: Math.floor(Math.random() * 80) + 60,
    pullRequests: Math.floor(Math.random() * 20) + 10,
    efficiency: Math.random() * 0.3 + 0.7,
    sprintData: [
      { sprint: "Sprint 1", storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, prs: Math.floor(Math.random() * 3) + 4, efficiency: Math.random() * 0.1 + 0.8 },
      { sprint: "Sprint 2", storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, prs: Math.floor(Math.random() * 3) + 4, efficiency: Math.random() * 0.1 + 0.8 },
      { sprint: "Sprint 3", storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, prs: Math.floor(Math.random() * 3) + 4, efficiency: Math.random() * 0.1 + 0.8 },
      { sprint: "Sprint 4", storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, prs: Math.floor(Math.random() * 3) + 4, efficiency: Math.random() * 0.1 + 0.8 }
    ],
    members: [
      { id: `${id}-user-1`, name: "Team Member 1", teamName: name, metrics: { storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, pullRequests: Math.floor(Math.random() * 3) + 4, reviews: Math.floor(Math.random() * 5) + 7, responseTime: Math.random() * 4 + 3 } },
      { id: `${id}-user-2`, name: "Team Member 2", teamName: name, metrics: { storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, pullRequests: Math.floor(Math.random() * 3) + 4, reviews: Math.floor(Math.random() * 5) + 7, responseTime: Math.random() * 4 + 3 } },
      { id: `${id}-user-3`, name: "Team Member 3", teamName: name, metrics: { storyPoints: Math.floor(Math.random() * 10) + 15, commits: Math.floor(Math.random() * 10) + 20, pullRequests: Math.floor(Math.random() * 3) + 4, reviews: Math.floor(Math.random() * 5) + 7, responseTime: Math.random() * 4 + 3 } }
    ],
    commitToPointRatio: [
      { name: "Member 1", storyPoints: Math.floor(Math.random() * 10) + 15, commitCount: Math.floor(Math.random() * 10) + 20, ratio: Math.random() * 0.2 + 0.6 },
      { name: "Member 2", storyPoints: Math.floor(Math.random() * 10) + 15, commitCount: Math.floor(Math.random() * 10) + 20, ratio: Math.random() * 0.2 + 0.6 },
      { name: "Member 3", storyPoints: Math.floor(Math.random() * 10) + 15, commitCount: Math.floor(Math.random() * 10) + 20, ratio: Math.random() * 0.2 + 0.6 }
    ]
  };
};

interface TeamDetailPageProps {
  team: {
    id: string;
    name: string;
    storyPoints: { completed: number; total: number; };
    commits: number;
    pullRequests: number;
    efficiency: number;
    sprintData: {
      sprint: string;
      storyPoints: number;
      commits: number;
      prs: number;
      efficiency: number;
    }[];
    members: {
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
    }[];
    commitToPointRatio: {
      name: string;
      storyPoints: number;
      commitCount: number;
      ratio: number;
    }[];
  };
}

const TeamDetailPage: React.FC<TeamDetailPageProps> = ({ team }) => {
  const router = useRouter();
  
  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${team.name} | Development Metrics Dashboard`}>
      {/* Team Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-gray-600 mt-1">Team Performance Dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Story Points</p>
              <p className="text-xl font-semibold">{team.storyPoints.completed}/{team.storyPoints.total}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Commits</p>
              <p className="text-xl font-semibold">{team.commits}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pull Requests</p>
              <p className="text-xl font-semibold">{team.pullRequests}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Efficiency</p>
              <p className="text-xl font-semibold">{(team.efficiency * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Trends */}
      <div className="mb-6">
        <LineChart 
          data={team.sprintData} 
          xAxisKey="sprint" 
          lines={[
            { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
            { key: 'commits', name: 'Commits', color: '#10b981' },
            { key: 'prs', name: 'Pull Requests', color: '#8b5cf6' }
          ]}
          title="Sprint Performance Trends"
          height={300}
        />
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.members.map((member) => (
            <MemberCard 
              key={member.id}
              id={member.id}
              name={member.name}
              teamName={member.teamName}
              metrics={member.metrics}
            />
          ))}
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="mb-6">
        <ScatterChart 
          data={team.commitToPointRatio} 
          xAxisKey="storyPoints" 
          yAxisKey="commitCount" 
          name="Team Members" 
          color="#8884d8" 
          title="Story Points to Commit Correlation"
          xAxisLabel="Story Points"
          yAxisLabel="Commits"
          height={300}
        />
        <div className="text-xs text-gray-500 mt-2 text-center">
          Chart shows the relationship between story points completed and commit activity for each team member
        </div>
      </div>

      {/* Sprint Efficiency */}
      <div className="mb-6">
        <LineChart 
          data={team.sprintData} 
          xAxisKey="sprint" 
          lines={[
            { key: 'efficiency', name: 'Efficiency', color: '#f97316' }
          ]}
          title="Sprint Efficiency Trend"
          height={250}
        />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  // In a real application, you would fetch this data from your API
  // For now, we'll use the mock data defined above
  let team = teamsData[id];
  
  // If team doesn't exist in our data, create mock data
  if (!team) {
    team = createMockTeamData(id);
  }
  
  return {
    props: {
      team
    }
  };
};

export default TeamDetailPage;
