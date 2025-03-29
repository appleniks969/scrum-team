import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import ScatterChart from '../../components/charts/ScatterChart';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

// Mock data
const storyPointToCommitRatio = {
  teams: [
    { name: "Team Alpha", storyPoints: 85, commitCount: 120, ratio: 0.71, efficiency: 0.85 },
    { name: "Team Beta", storyPoints: 72, commitCount: 95, ratio: 0.76, efficiency: 0.80 },
    { name: "Team Gamma", storyPoints: 65, commitCount: 110, ratio: 0.59, efficiency: 0.93 },
    { name: "Team Delta", storyPoints: 45, commitCount: 65, ratio: 0.69, efficiency: 0.75 },
    { name: "Team Epsilon", storyPoints: 92, commitCount: 140, ratio: 0.66, efficiency: 0.84 }
  ],
  members: [
    { name: "Alex Johnson", team: "Team Alpha", storyPoints: 24, commitCount: 32, ratio: 0.75 },
    { name: "Jordan Smith", team: "Team Alpha", storyPoints: 18, commitCount: 25, ratio: 0.72 },
    { name: "Taylor Roberts", team: "Team Alpha", storyPoints: 22, commitCount: 30, ratio: 0.73 },
    { name: "Morgan Lee", team: "Team Alpha", storyPoints: 21, commitCount: 33, ratio: 0.64 },
    { name: "Riley Chen", team: "Team Beta", storyPoints: 15, commitCount: 28, ratio: 0.54 },
    { name: "Casey Kim", team: "Team Beta", storyPoints: 19, commitCount: 22, ratio: 0.86 },
    { name: "Avery Patel", team: "Team Beta", storyPoints: 16, commitCount: 24, ratio: 0.67 },
    { name: "Quinn Wilson", team: "Team Gamma", storyPoints: 22, commitCount: 35, ratio: 0.63 },
    { name: "Harper Davis", team: "Team Gamma", storyPoints: 20, commitCount: 27, ratio: 0.74 },
    { name: "Skyler Martinez", team: "Team Delta", storyPoints: 12, commitCount: 18, ratio: 0.67 },
    { name: "Drew Thompson", team: "Team Delta", storyPoints: 14, commitCount: 22, ratio: 0.64 },
    { name: "Jamie Rodriguez", team: "Team Epsilon", storyPoints: 25, commitCount: 40, ratio: 0.63 }
  ]
};

const planningAccuracy = {
  teams: [
    { name: "Team Alpha", plannedPoints: 100, completedPoints: 85, accuracy: 0.85 },
    { name: "Team Beta", plannedPoints: 90, completedPoints: 72, accuracy: 0.80 },
    { name: "Team Gamma", plannedPoints: 70, completedPoints: 65, accuracy: 0.93 },
    { name: "Team Delta", plannedPoints: 60, completedPoints: 45, accuracy: 0.75 },
    { name: "Team Epsilon", plannedPoints: 110, completedPoints: 92, accuracy: 0.84 }
  ],
  trend: [
    { sprint: "Sprint 1", plannedPoints: 65, completedPoints: 52, accuracy: 0.80 },
    { sprint: "Sprint 2", plannedPoints: 72, completedPoints: 63, accuracy: 0.88 },
    { sprint: "Sprint 3", plannedPoints: 68, completedPoints: 54, accuracy: 0.79 },
    { sprint: "Sprint 4", plannedPoints: 90, completedPoints: 72, accuracy: 0.80 }
  ]
};

const velocity = {
  teams: [
    { name: "Team Alpha", sprint1: 18, sprint2: 22, sprint3: 20, sprint4: 25, trend: 0.10 },
    { name: "Team Beta", sprint1: 16, sprint2: 19, sprint3: 17, sprint4: 20, trend: 0.07 },
    { name: "Team Gamma", sprint1: 14, sprint2: 16, sprint3: 15, sprint4: 20, trend: 0.14 },
    { name: "Team Delta", sprint1: 10, sprint2: 11, sprint3: 13, sprint4: 11, trend: 0.04 },
    { name: "Team Epsilon", sprint1: 21, sprint2: 23, sprint3: 20, sprint4: 28, trend: 0.11 }
  ],
  overall: [
    { sprint: "Sprint 1", velocity: 79 },
    { sprint: "Sprint 2", velocity: 91 },
    { sprint: "Sprint 3", velocity: 85 },
    { sprint: "Sprint 4", velocity: 104 }
  ]
};

const consistency = {
  teams: [
    { name: "Team Alpha", consistency: 0.92, variability: 0.08 },
    { name: "Team Beta", consistency: 0.87, variability: 0.13 },
    { name: "Team Gamma", consistency: 0.89, variability: 0.11 },
    { name: "Team Delta", consistency: 0.81, variability: 0.19 },
    { name: "Team Epsilon", consistency: 0.85, variability: 0.15 }
  ]
};

const insights = [
  {
    id: "insight-1",
    type: "observation",
    category: "planning",
    title: "High Correlation Between Story Points and Commits",
    description: "Teams with higher story point completion generally have more commit activity, suggesting good alignment between planning and execution.",
    relevance: "high",
    teams: ["Team Alpha", "Team Epsilon"]
  },
  {
    id: "insight-2",
    type: "anomaly",
    category: "execution",
    title: "Low Story Point to Commit Ratio for Team Gamma",
    description: "Team Gamma has the lowest story point to commit ratio (0.59), indicating they might be making many small commits or struggling with larger stories.",
    relevance: "medium",
    teams: ["Team Gamma"]
  },
  {
    id: "insight-3",
    type: "trend",
    category: "velocity",
    title: "Increasing Velocity Across Teams",
    description: "Overall team velocity has increased by 32% from Sprint 1 to Sprint 4, with Team Gamma showing the strongest growth at 43%.",
    relevance: "high",
    teams: ["Team Gamma"]
  },
  {
    id: "insight-4",
    type: "recommendation",
    category: "consistency",
    title: "Consistency Improvement Opportunity for Team Delta",
    description: "Team Delta has the lowest consistency score (0.81). Consider reviewing their estimation and planning process to improve predictability.",
    relevance: "medium",
    teams: ["Team Delta"]
  },
  {
    id: "insight-5",
    type: "observation",
    category: "individual",
    title: "High Performer Identified",
    description: "Jamie Rodriguez (Team Epsilon) consistently delivers high story points with efficient commit ratios, demonstrating strong productivity.",
    relevance: "medium",
    teams: ["Team Epsilon"]
  }
];

interface CorrelationPageProps {
  storyPointToCommitRatio: typeof storyPointToCommitRatio;
  planningAccuracy: typeof planningAccuracy;
  velocity: typeof velocity;
  consistency: typeof consistency;
  insights: typeof insights;
}

const CorrelationPage: React.FC<CorrelationPageProps> = ({
  storyPointToCommitRatio,
  planningAccuracy,
  velocity,
  consistency,
  insights
}) => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [insightFilter, setInsightFilter] = useState('all');
  
  // Filter teams and members based on selected team
  const filteredTeams = selectedTeam === 'all' 
    ? storyPointToCommitRatio.teams 
    : storyPointToCommitRatio.teams.filter(team => team.name === selectedTeam);
  
  const filteredMembers = selectedTeam === 'all'
    ? storyPointToCommitRatio.members
    : storyPointToCommitRatio.members.filter(member => member.team === selectedTeam);
  
  // Filter velocity chart data
  const velocityChartData = velocity.teams.map(team => {
    return {
      name: team.name,
      'Sprint 1': team.sprint1,
      'Sprint 2': team.sprint2,
      'Sprint 3': team.sprint3,
      'Sprint 4': team.sprint4
    };
  }).filter(team => selectedTeam === 'all' || team.name === selectedTeam);

  // Filter consistency data
  const filteredConsistency = selectedTeam === 'all'
    ? consistency.teams
    : consistency.teams.filter(team => team.name === selectedTeam);
  
  // Filter insights
  const filteredInsights = insights.filter(insight => {
    const matchesTeam = selectedTeam === 'all' || insight.teams.includes(selectedTeam);
    const matchesType = insightFilter === 'all' || insight.type === insightFilter;
    return matchesTeam && matchesType;
  });

  // Format accuracy data
  const accuracyChartData = planningAccuracy.teams
    .filter(team => selectedTeam === 'all' || team.name === selectedTeam)
    .map(team => ({
      name: team.name,
      planned: team.plannedPoints,
      completed: team.completedPoints,
      accuracy: team.accuracy * 100 // Convert to percentage
    }));

  return (
    <Layout title="Correlation Analysis | Development Metrics Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Correlation Analysis</h1>
        <p className="text-gray-600">
          Analysis of relationships between story points, development activity, and team performance metrics.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Team
            </label>
            <select
              id="team"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="all">All Teams</option>
              {storyPointToCommitRatio.teams.map((team) => (
                <option key={team.name} value={team.name}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="insightType" className="block text-sm font-medium text-gray-700 mb-1">
              Insight Type
            </label>
            <select
              id="insightType"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={insightFilter}
              onChange={(e) => setInsightFilter(e.target.value)}
            >
              <option value="all">All Insights</option>
              <option value="observation">Observations</option>
              <option value="anomaly">Anomalies</option>
              <option value="trend">Trends</option>
              <option value="recommendation">Recommendations</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              defaultValue="month"
            >
              <option value="sprint">Current Sprint</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 365 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Story Points to Commits Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <ScatterChart 
            data={filteredTeams} 
            xAxisKey="storyPoints" 
            yAxisKey="commitCount" 
            name="Teams" 
            color="#8884d8" 
            title="Team Story Points vs Commits"
            xAxisLabel="Story Points"
            yAxisLabel="Commits"
            height={300}
          />
        </div>
        <div>
          <ScatterChart 
            data={filteredMembers} 
            xAxisKey="storyPoints" 
            yAxisKey="commitCount" 
            name="Team Members" 
            color="#82ca9d" 
            title="Member Story Points vs Commits"
            xAxisLabel="Story Points"
            yAxisLabel="Commits"
            height={300}
          />
        </div>
      </div>

      {/* Planning Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <BarChart 
            data={accuracyChartData} 
            xAxisKey="name" 
            bars={[
              { key: 'planned', name: 'Planned', color: '#8884d8' },
              { key: 'completed', name: 'Completed', color: '#82ca9d' }
            ]}
            title="Planning vs Execution by Team"
            height={300}
          />
        </div>
        <div>
          <LineChart 
            data={planningAccuracy.trend} 
            xAxisKey="sprint" 
            lines={[
              { key: 'accuracy', name: 'Accuracy %', color: '#ff7300' }
            ]}
            title="Planning Accuracy Trend"
            height={300}
          />
        </div>
      </div>

      {/* Velocity & Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <BarChart 
            data={velocityChartData} 
            xAxisKey="name" 
            bars={[
              { key: 'Sprint 1', name: 'Sprint 1', color: '#8884d8' },
              { key: 'Sprint 2', name: 'Sprint 2', color: '#82ca9d' },
              { key: 'Sprint 3', name: 'Sprint 3', color: '#ffc658' },
              { key: 'Sprint 4', name: 'Sprint 4', color: '#ff8042' }
            ]}
            title="Team Velocity Across Sprints"
            height={300}
          />
        </div>
        <div>
          <BarChart 
            data={filteredConsistency} 
            xAxisKey="name" 
            bars={[
              { key: 'consistency', name: 'Consistency Score', color: '#0088fe' },
              { key: 'variability', name: 'Variability', color: '#ff8042' }
            ]}
            title="Team Consistency Scores"
            height={300}
          />
        </div>
      </div>

      {/* Analytics Insights */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.id} 
              className={`bg-white p-4 rounded-lg shadow border-l-4 ${
                insight.relevance === 'high' 
                  ? 'border-red-500' 
                  : insight.relevance === 'medium' 
                    ? 'border-yellow-500' 
                    : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{insight.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.type === 'observation' 
                    ? 'bg-blue-100 text-blue-800' 
                    : insight.type === 'anomaly' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : insight.type === 'trend' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                }`}>
                  {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{insight.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {insight.teams.map(team => (
                  <span key={team} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {team}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredInsights.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No insights match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Recommendations</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Consider reviewing estimation process for Team Delta to improve planning accuracy and consistency.</span>
          </li>
          <li className="flex items-start">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Explore Team Gamma's commit practices to understand the high number of commits relative to story points.</span>
          </li>
          <li className="flex items-start">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Share best practices from Team Alpha and Team Epsilon with other teams to improve planning-to-execution alignment.</span>
          </li>
          <li className="flex items-start">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Recognize high performers like Jamie Rodriguez and consider having them mentor other team members.</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real application, you would fetch this data from your API
  // For now, we'll use the mock data defined above

  return {
    props: {
      storyPointToCommitRatio,
      planningAccuracy,
      velocity,
      consistency,
      insights
    }
  };
};

export default CorrelationPage;
