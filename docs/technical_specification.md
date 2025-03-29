# ScrumTeam Metrics Dashboard Technical Specification

## Technology Stack

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript 5+
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **State Management**: React Context API + React Query for data fetching
- **Data Visualization**: Recharts + D3.js
- **Component Library**: Custom components with Tailwind
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Authentication**: NextAuth.js

### Backend
- **Framework**: Next.js API Routes
- **Language**: TypeScript 5+
- **API Integration**: Axios
- **Authentication**: JWT-based auth with OAuth
- **Caching**: SWR for frontend, Redis for backend
- **Logging**: Winston
- **Error Handling**: Custom error handling middleware
- **Validation**: Zod

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Hosting**: Vercel or AWS Amplify
- **Monitoring**: Sentry for error tracking, Vercel Analytics
- **Testing**: Jest for unit tests, Cypress for E2E tests

## API Integrations

### JIRA v2 REST API
- Authentication: OAuth 2.0 or API Token
- Endpoints:
  - `/rest/api/2/search`: For issue retrieval with JQL
  - `/rest/agile/1.0/board`: For board and sprint information
  - `/rest/api/2/user/assignable/search`: For team member data

### GitHub API
- Authentication: OAuth or Personal Access Token
- Endpoints:
  - `/repos/:org/:repo/commits`: For commit history
  - `/repos/:org/:repo/pulls`: For pull request data
  - `/repos/:org/:repo/pulls/:pull_number/reviews`: For code review data

## Data Models

### JIRA Domain
```typescript
interface Team {
  id: string;
  name: string;
  boardId: number;
}

interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress: string;
  teamId: string;
}

interface Sprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  boardId: number;
}

interface Issue {
  id: string;
  key: string;
  summary: string;
  storyPoints?: number;
  status: string;
  assignee?: string;
  teamId: string;
  sprintId?: number;
  resolvedDate?: string;
}

interface CompletionStats {
  teamId: string;
  teamName: string;
  sprintId: number;
  sprintName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  memberStats: MemberCompletionStats[];
}

interface MemberCompletionStats {
  accountId: string;
  displayName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
}
```

### Git Domain
```typescript
interface GitCommit {
  sha: string;
  message: string;
  author: string;
  authorEmail: string;
  date: string;
  repository: string;
  teamId?: string;
}

interface PullRequest {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'closed' | 'merged';
  reviewers: string[];
  repository: string;
  teamId?: string;
}

interface CodeReview {
  id: number;
  pullRequestId: number;
  reviewer: string;
  submittedAt: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  repository: string;
}

interface GitMetrics {
  commitCount: number;
  prCount: number;
  prMergedCount: number;
  avgPrTimeToMerge: number;
  codeReviewCount: number;
  avgReviewResponseTime: number;
}

interface TeamGitMetrics {
  teamId: string;
  teamName: string;
  metrics: GitMetrics;
  memberMetrics: Record<string, GitMetrics>;
}
```

### Integrated Domain
```typescript
interface IntegratedTeamMetrics {
  teamId: string;
  teamName: string;
  jiraMetrics: CompletionStats;
  gitMetrics: TeamGitMetrics;
  correlations: {
    storyPointToCommitRatio: number;
    planningAccuracy: number;
    velocity: number;
    consistency: number;
  };
}

interface IntegratedMemberMetrics {
  accountId: string;
  displayName: string;
  teamId: string;
  jiraMetrics: MemberCompletionStats;
  gitMetrics: GitMetrics;
  correlations: {
    storyPointToCommitRatio: number;
    reviewQuality: number;
    contribution: number;
  };
}
```

## API Endpoints

### JIRA Metrics API
- `GET /api/jira/teams`: List all teams
- `GET /api/jira/teams/:teamId/members`: List team members
- `GET /api/jira/teams/:teamId/sprints`: List team sprints
- `GET /api/jira/teams/:teamId/sprints/:sprintId/issues`: List sprint issues
- `GET /api/jira/teams/:teamId/stats`: Get team completion stats
- `GET /api/jira/members/:memberId/stats`: Get member completion stats

### Git Metrics API
- `GET /api/git/repositories`: List all repositories
- `GET /api/git/teams/:teamId/metrics`: Get team Git metrics
- `GET /api/git/members/:memberId/metrics`: Get member Git metrics
- `GET /api/git/pull-requests`: List pull requests with filters
- `GET /api/git/code-reviews`: List code reviews with filters

### Integrated Metrics API
- `GET /api/metrics/teams`: Get integrated team metrics
- `GET /api/metrics/members`: Get integrated member metrics
- `GET /api/metrics/correlations`: Get correlation metrics
- `GET /api/metrics/overview`: Get high-level overview metrics

## Frontend Routes

- `/` - Overview dashboard
- `/teams` - Teams dashboard
- `/teams/:teamId` - Team details
- `/members` - Members dashboard
- `/members/:memberId` - Member details
- `/jira` - JIRA metrics dashboard
- `/git` - Git metrics dashboard
- `/correlations` - Correlation analysis dashboard
- `/settings` - Dashboard settings and configuration

## Component Structure

```
/components
  /layout
    Header.tsx
    Sidebar.tsx
    PageContainer.tsx
    Footer.tsx
  /dashboard
    MetricCard.tsx
    ChartContainer.tsx
    DateRangePicker.tsx
    TeamSelector.tsx
    DataSourceToggle.tsx
  /charts
    LineChart.tsx
    BarChart.tsx
    ScatterChart.tsx
    ProgressBar.tsx
    HeatMap.tsx
  /tables
    DataTable.tsx
    SortableHeader.tsx
    Pagination.tsx
    FilterInput.tsx
  /cards
    TeamCard.tsx
    MemberCard.tsx
    StatsCard.tsx
    PullRequestCard.tsx
  /modals
    FilterModal.tsx
    DetailModal.tsx
    ExportModal.tsx
  /forms
    SearchForm.tsx
    FilterForm.tsx
    SettingsForm.tsx
```

## Security Considerations

1. **Authentication**:
   - Integration with organizational SSO
   - Role-based access control
   - JWT-based API authentication

2. **API Security**:
   - Rate limiting
   - Input validation
   - CORS configuration
   - Secure handling of API keys

3. **Data Protection**:
   - Encryption of sensitive data
   - Secure storage of credentials
   - Minimization of data exposure

## Performance Optimization

1. **Frontend**:
   - Component memoization
   - Virtualized lists for large data sets
   - Optimized chart rendering
   - Code splitting and lazy loading

2. **API**:
   - Response caching
   - Pagination for large data sets
   - Data aggregation and preprocessing
   - Efficient data transformations

3. **Data Fetching**:
   - Incremental Static Regeneration for semi-static data
   - SWR for client-side data freshness
   - Background data prefetching
   - Optimistic UI updates

## Error Handling

1. **Frontend**:
   - Graceful error boundaries
   - Retry mechanisms for API failures
   - Fallback UI for error states
   - User-friendly error messages

2. **API**:
   - Consistent error response format
   - Error logging and monitoring
   - Recovery mechanisms for external API failures
   - Circuit breakers for unstable external services

## Testing Strategy

1. **Unit Testing**:
   - Domain services
   - API services
   - React components
   - Utility functions

2. **Integration Testing**:
   - API endpoints
   - External service integrations
   - Component compositions
   - State management

3. **E2E Testing**:
   - User flows
   - Dashboard interactions
   - Data filtering and visualization
   - Cross-browser compatibility

4. **Performance Testing**:
   - Load testing for API endpoints
   - Rendering performance for complex charts
   - Memory usage optimization
   - Network efficiency
