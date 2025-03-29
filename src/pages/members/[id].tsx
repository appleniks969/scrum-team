import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

// Sample data
const membersData = {
  "user-1": {
    id: "user-1",
    name: "Alex Johnson",
    teamName: "Team Alpha",
    role: "Senior Developer",
    joinDate: "2021-03-15",
    email: "alex.johnson@example.com",
    metrics: {
      storyPoints: 24,
      commits: 32,
      pullRequests: 8,
      reviews: 12,
      responseTime: 6.2
    },
    sprintPerformance: [
      { sprint: "Sprint 1", storyPoints: 5, commits: 7, prs: 2, reviews: 3 },
      { sprint: "Sprint 2", storyPoints: 6, commits: 8, prs: 2, reviews: 3 },
      { sprint: "Sprint 3", storyPoints: 6, commits: 9, prs: 2, reviews: 3 },
      { sprint: "Sprint 4", storyPoints: 7, commits: 8, prs: 2, reviews: 3 }
    ],
    recentActivity: [
      { date: "2023-03-15", commits: 3, prSubmitted: 1, prReviewed: 2 },
      { date: "2023-03-14", commits: 4, prSubmitted: 0, prReviewed: 1 },
      { date: "2023-03-13", commits: 2, prSubmitted: 1, prReviewed: 0 },
      { date: "2023-03-12", commits: 5, prSubmitted: 0, prReviewed: 2 },
      { date: "2023-03-11", commits: 3, prSubmitted: 0, prReviewed: 1 },
      { date: "2023-03-10", commits: 4, prSubmitted: 1, prReviewed: 0 },
      { date: "2023-03-09", commits: 2, prSubmitted: 0, prReviewed: 1 }
    ],
    topProjects: [
      { name: "Frontend App", storyPoints: 10, commits: 15 },
      { name: "API Service", storyPoints: 8, commits: 12 },
      { name: "Data Pipeline", storyPoints: 6, commits: 5 }
    ],
    reviewQuality: {
      thoroughness: 0.85,
      timeliness: 0.92,
      helpfulness: 0.88
    }
  },
  // Add similar data for other members
};

// Create mock data for any member ID not in the actual data
const createMockMemberData = (id: string) => {
  const name = `Team Member (${id})`;

  return {
    id,
    name,
    teamName: "Team Unknown",
    role: "Developer",
    joinDate: "2022-01-01",
    email: `${id}@example.com`,
    metrics: {
      storyPoints: Math.floor(Math.random() * 15) + 10,
      commits: Math.floor(Math.random() * 20) + 15,
      pullRequests: Math.floor(Math.random() * 5) + 3,
      reviews: Math.floor(Math.random() * 8) + 5,
      responseTime: Math.random() * 5 + 2
    },
    sprintPerformance: [
      { sprint: "Sprint 1", storyPoints: Math.floor(Math.random() * 5) + 3, commits: Math.floor(Math.random() * 5) + 3, prs: Math.floor(Math.random() * 2) + 1, reviews: Math.floor(Math.random() * 3) + 1 },
      { sprint: "Sprint 2", storyPoints: Math.floor(Math.random() * 5) + 3, commits: Math.floor(Math.random() * 5) + 3, prs: Math.floor(Math.random() * 2) + 1, reviews: Math.floor(Math.random() * 3) + 1 },
      { sprint: "Sprint 3", storyPoints: Math.floor(Math.random() * 5) + 3, commits: Math.floor(Math.random() * 5) + 3, prs: Math.floor(Math.random() * 2) + 1, reviews: Math.floor(Math.random() * 3) + 1 },
      { sprint: "Sprint 4", storyPoints: Math.floor(Math.random() * 5) + 3, commits: Math.floor(Math.random() * 5) + 3, prs: Math.floor(Math.random() * 2) + 1, reviews: Math.floor(Math.random() * 3) + 1 }
    ],
    recentActivity: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      commits: Math.floor(Math.random() * 5) + 1,
      prSubmitted: Math.random() > 0.7 ? 1 : 0,
      prReviewed: Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0
    })),
    topProjects: [
      { name: "Project A", storyPoints: Math.floor(Math.random() * 8) + 5, commits: Math.floor(Math.random() * 10) + 5 },
      { name: "Project B", storyPoints: Math.floor(Math.random() * 6) + 3, commits: Math.floor(Math.random() * 8) + 3 },
      { name: "Project C", storyPoints: Math.floor(Math.random() * 4) + 2, commits: Math.floor(Math.random() * 6) + 2 }
    ],
    reviewQuality: {
      thoroughness: Math.random() * 0.3 + 0.7,
      timeliness: Math.random() * 0.3 + 0.7,
      helpfulness: Math.random() * 0.3 + 0.7
    }
  };
};

interface MemberDetailPageProps {
  member: {
    id: string;
    name: string;
    teamName: string;
    role: string;
    joinDate: string;
    email: string;
    metrics: {
      storyPoints: number;
      commits: number;
      pullRequests: number;
      reviews: number;
      responseTime: number;
    };
    sprintPerformance: {
      sprint: string;
      storyPoints: number;
      commits: number;
      prs: number;
      reviews: number;
    }[];
    recentActivity: {
      date: string;
      commits: number;
      prSubmitted: number;
      prReviewed: number;
    }[];
    topProjects: {
      name: string;
      storyPoints: number;
      commits: number;
    }[];
    reviewQuality: {
      thoroughness: number;
      timeliness: number;
      helpfulness: number;
    };
  };
}

const MemberDetailPage: React.FC<MemberDetailPageProps> = ({ member }) => {
  const router = useRouter();
  
  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading member details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Format dates for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Prepare data for review quality chart
  const reviewQualityData = [
    { name: 'Thoroughness', value: member.reviewQuality.thoroughness * 100 },
    { name: 'Timeliness', value: member.reviewQuality.timeliness * 100 },
    { name: 'Helpfulness', value: member.reviewQuality.helpfulness * 100 }
  ];

  return (
    <Layout title={`${member.name} | Development Metrics Dashboard`}>
      {/* Member Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-blue-800">{member.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <p className="text-gray-600 mt-1">{member.role} • {member.teamName}</p>
              <p className="text-gray-500 text-sm mt-1">Member since {formatDate(member.joinDate)}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Story Points</p>
              <p className="text-xl font-semibold">{member.metrics.storyPoints}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Commits</p>
              <p className="text-xl font-semibold">{member.metrics.commits}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pull Requests</p>
              <p className="text-xl font-semibold">{member.metrics.pullRequests}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Code Reviews</p>
              <p className="text-xl font-semibold">{member.metrics.reviews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sprint Performance */}
        <div>
          <LineChart 
            data={member.sprintPerformance} 
            xAxisKey="sprint" 
            lines={[
              { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
              { key: 'commits', name: 'Commits', color: '#10b981' }
            ]}
            title="Sprint Performance"
            height={250}
          />
        </div>

        {/* Recent Activity */}
        <div>
          <LineChart 
            data={member.recentActivity} 
            xAxisKey="date" 
            lines={[
              { key: 'commits', name: 'Commits', color: '#10b981' },
              { key: 'prSubmitted', name: 'PRs Submitted', color: '#8b5cf6' },
              { key: 'prReviewed', name: 'PRs Reviewed', color: '#f97316' }
            ]}
            title="Recent Activity (Last 7 Days)"
            height={250}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Top Projects</h2>
          </div>
          <div className="p-4">
            <BarChart 
              data={member.topProjects} 
              xAxisKey="name" 
              bars={[
                { key: 'storyPoints', name: 'Story Points', color: '#3b82f6' },
                { key: 'commits', name: 'Commits', color: '#10b981' }
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Review Quality */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Code Review Quality</h2>
          </div>
          <div className="p-4">
            <BarChart 
              data={reviewQualityData} 
              xAxisKey="name" 
              bars={[
                { key: 'value', name: 'Score', color: '#f97316' }
              ]}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Detailed Activity Table */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Activity Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRs Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRs Reviewed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {member.recentActivity.map((activity, index) => (
                <tr key={activity.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatDate(activity.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.commits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.prSubmitted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.prReviewed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.commits + activity.prSubmitted + activity.prReviewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  // In a real application, you would fetch this data from your API
  // For now, we'll use the mock data defined above
  let member = membersData[id];
  
  // If member doesn't exist in our data, create mock data
  if (!member) {
    member = createMockMemberData(id);
  }
  
  return {
    props: {
      member
    }
  };
};

export default MemberDetailPage;
