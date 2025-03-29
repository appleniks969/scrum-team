# ScrumTeam Metrics Dashboard Handover Guide

## Project Overview

The ScrumTeam Metrics Dashboard is a comprehensive web application for visualizing and analyzing team performance metrics from JIRA and Git repositories. The application follows Domain-Driven Design (DDD) principles with a clean architecture approach, allowing for a maintainable and scalable codebase.

## Architecture

The project follows a layered architecture:

1. **Domain Layer** - Core business logic and entities
   - Location: `src/domain/`
   - Contents: Domain entities, value objects, repository interfaces, domain services

2. **Application Layer** - Use cases and application services
   - Location: `src/application/`
   - Contents: Application services, DTOs, error handling

3. **Infrastructure Layer** - External API integrations and implementations
   - Location: `src/infrastructure/`
   - Contents: API clients, repository implementations, data transformation layers

4. **Presentation Layer** - UI components and pages
   - Location: `src/pages/` and `src/components/`
   - Contents: Next.js pages, React components, hooks, styles

## Tech Stack

- **Frontend**: Next.js 13+, React 18+, TypeScript 4.9+
- **Styling**: Tailwind CSS 3+
- **Data Visualization**: Recharts
- **Data Fetching**: Custom hooks with Axios
- **Code Quality**: ESLint, Prettier
- **API Integration**: JIRA REST API, GitHub API

## Project Structure

```
/src
  /application     # Application services and DTOs
    /dtos          # Data Transfer Objects for API layers
    /jira          # JIRA application services
    /git           # Git application services
    /metrics       # Integrated metrics services
  
  /components      # React components
    /cards         # Card components (DetailCard, etc.)
    /charts        # Data visualization components
    /dashboard     # Dashboard-specific components
    /layout        # Layout components (Header, Sidebar, Footer)
    /tables        # Table components
    /ui            # UI components (ErrorAlert, LoadingState, etc.)
  
  /domain          # Domain models and services
    /jira          # JIRA domain context
    /git           # Git domain context
    /metrics       # Integrated metrics domain
  
  /hooks           # Custom React hooks for data fetching
  
  /infrastructure  # External API clients
    jira-client.ts
    git-client.ts
  
  /pages           # Next.js pages
    /api           # API routes
    /correlation   # Correlation dashboard
    /git           # Git metrics dashboard
    /jira          # JIRA metrics dashboard
    /members       # Members dashboard
    /settings      # Settings pages
    /teams         # Teams dashboard
    index.tsx      # Main dashboard
  
  /styles          # Global styles
  
  /utils           # Utility functions
```

## Data Flow

1. **Data Sources**: 
   - JIRA API: Story point data, sprint information, team structure
   - GitHub API: Commit data, PR information, code review metrics

2. **Data Processing**:
   - Domain Entities: Define data models and business rules
   - Repository Interfaces: Define data access patterns
   - Domain Services: Implement core business logic
   - Application Services: Implement use cases and DTOs
   - Infrastructure Implementations: Connect to external APIs

3. **API Endpoints**:
   - JIRA Endpoints: `/api/jira/*`
   - Git Endpoints: `/api/git/*`
   - Integrated Metrics: `/api/metrics/*`

4. **React Hooks**:
   - JIRA Hooks: `useTeams()`, `useTeamStats()`, etc.
   - Git Hooks: `useTeamGitMetrics()`, `usePullRequests()`, etc.
   - Integrated Hooks: `useIntegratedTeamMetrics()`, `useCorrelationInsights()`, etc.

5. **Components**:
   - Dashboard displays for different metric types
   - Visualizations based on processed data
   - Interactive filters and selections

## Key Components

### Dashboard Components

- **MetricCard**: Displays individual metrics with trends
- **DateRangePicker**: Allows filtering data by date range
- **TeamSelector**: Dropdown for selecting teams
- **DataSourceToggle**: Toggle for switching between data sources
- **InsightCard**: Displays insights and recommendations

### Visualization Components

- **LineChart**: Visualizes trends over time
- **BarChart**: Compares metrics across categories
- **ScatterChart**: Shows correlations between metrics
- **HeatMap**: Displays data intensity across two dimensions
- **ProgressBar**: Shows completion or progress metrics

### Layout Components

- **Header**: Contains navigation and user profile
- **Sidebar**: Provides access to different dashboards
- **Footer**: Contains links and information
- **Layout**: Wraps all pages with consistent layout

### Table Components

- **ExpandableTable**: Table with expandable rows for details
- **DetailCard**: Shows detailed information in expanded rows

## Dashboard Pages

- **Overview Dashboard**: High-level metrics and trends
- **Teams Dashboard**: Team-specific metrics and comparisons
- **Members Dashboard**: Individual member performance
- **JIRA Metrics Dashboard**: Story point completion metrics
- **Git Metrics Dashboard**: Commit and PR activity
- **Correlation Dashboard**: Relationships between metrics
- **Settings Pages**: User and dashboard preferences

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd ScrumTeam
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create a `.env.local` file based on `.env.local.example`
   - Add your JIRA and GitHub API credentials

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

1. **Code Formatting**:
   - Format code: `npm run format`
   - Lint code: `npm run lint`
   - Fix linting issues: `npm run lint:fix`

2. **Creating New Features**:
   - Follow the DDD approach
   - Start with domain entities and services
   - Implement application services and DTOs
   - Create API endpoints
   - Build React components and hooks
   - Update pages

3. **Testing**:
   - Run tests: `npm test`
   - Watch tests: `npm run test:watch`

## Deployment

The application can be deployed to various hosting platforms:

1. **Vercel** (Recommended for Next.js):
   - Connect GitHub repository
   - Configure environment variables
   - Deploy with automatic build and preview

2. **AWS Amplify**:
   - Connect repository
   - Configure build settings
   - Set environment variables

3. **Docker**:
   - Build Docker image
   - Deploy to container orchestration platform

## Outstanding Tasks

Please refer to the [Task List](./task_list.md) for a detailed breakdown of completed and pending tasks.

Key priorities for the next phase:

1. Add input validation for forms
2. Implement row actions for tables
3. Optimize component re-renders
4. Configure CI/CD pipeline with GitHub Actions
5. Set up authentication and authorization
6. Configure error tracking with Sentry
7. Implement data export functionality
8. Prepare for production deployment

## Support and Maintenance

For any issues or questions:

1. Refer to the documentation in the `/docs` directory
2. Check comments in the codebase
3. Maintain the task list when adding features or fixing bugs
4. Follow the established architectural patterns for new features

---

This handover guide is designed to provide a comprehensive overview of the ScrumTeam Metrics Dashboard. For more detailed information on specific components or features, please refer to the documentation in the corresponding code files and documents in the `/docs` directory.
