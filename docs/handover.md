# ScrumTeam Metrics Dashboard - Project Handover Document

## Project Overview

The ScrumTeam Metrics Dashboard is a comprehensive analytics platform that provides visibility into team performance across scrum teams by integrating data from JIRA and Git repositories. The dashboard visualizes productivity metrics, story point completion, and development activities to help teams track performance, identify trends, and optimize workflows.

## Architecture

The project follows a **Domain-Driven Design (DDD)** architecture with a clean separation of concerns:

- **Domain Layer**: Core business logic, entities, and domain services
- **Application Layer**: Application services and DTOs for orchestrating domain operations
- **Infrastructure Layer**: External API integrations with JIRA and GitHub
- **Presentation Layer**: Next.js pages and React components

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks and Context API
- **Data Fetching**: SWR for client-side data fetching with caching
- **Data Visualization**: Recharts
- **Code Quality**: ESLint, Prettier
- **External APIs**: JIRA REST API, GitHub API (via Octokit)

## Project Structure

```
/src
  /domain            # Domain entities, services, and interfaces
    /jira            # JIRA domain context
    /git             # Git domain context
    /metrics         # Integrated metrics domain
  /application       # Application services and DTOs
    /jira            # JIRA application services
    /git             # Git application services
    /metrics         # Integrated metrics services
    /dtos            # Data Transfer Objects
  /infrastructure    # External API clients and implementations
    /jira-client.ts  # JIRA API client
    /git-client.ts   # GitHub API client
  /pages             # Next.js pages and API routes
    /api             # Backend API routes
      /git           # Git API endpoints
      /jira          # JIRA API endpoints
      /metrics       # Integrated metrics endpoints
    /jira            # JIRA metrics pages
    /git             # Git metrics pages
    /correlation     # Correlation analysis pages
    /teams           # Team management pages
    /members         # Member management pages
    /settings        # Settings pages
  /components        # React components
    /layout          # Layout components
    /dashboard       # Dashboard components
    /charts          # Data visualization components
    /tables          # Table components
    /forms           # Form components
    /ui              # UI utility components
  /hooks             # Custom React hooks
  /styles            # Global styles
  /utils             # Utility functions
  /mocks             # Mock data for development
```

## Key Features Implemented

1. **Dashboard Pages**:
   - Overview Dashboard
   - JIRA Metrics Dashboard
   - Git Metrics Dashboard
   - Correlation Dashboard
   - Teams Dashboard
   - Members Dashboard
   - Settings Pages

2. **Data Visualization**:
   - Story point completion charts
   - Commit activity visualizations
   - Team comparisons
   - Correlation analysis
   - Performance metrics

3. **Interactive UI Components**:
   - Date range selection
   - Team filtering
   - Data source toggling
   - Expandable data tables
   - Form validation

4. **API Integration**:
   - JIRA data fetching and transformation
   - GitHub metrics retrieval (via Octokit)
   - Integrated metrics calculation

5. **GitHub API Integration**:
   - Repository listing and filtering
   - Commit history retrieval
   - Pull request tracking and analytics
   - Code review metrics
   - Developer activity metrics

## Setup and Installation

1. **Prerequisites**:
   - Node.js 18.0 or higher
   - Yarn or NPM
   - JIRA and GitHub access tokens

2. **Installation**:
   ```bash
   git clone https://github.com/your-org/scrumteam-metrics-dashboard.git
   cd scrumteam-metrics-dashboard
   npm install
   ```

3. **Configuration**:
   Create a `.env.local` file with API credentials:
   ```
   JIRA_BASE_URL=https://your-instance.atlassian.net
   JIRA_USERNAME=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   GITHUB_TOKEN=your-github-token
   GITHUB_ORG=your-organization
   USE_MOCK_DATA=false
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

5. **Code Quality**:
   ```bash
   npm run lint
   npm run format
   ```

## GitHub API Implementation Details

The GitHub API integration uses the Octokit library to interact with the GitHub REST API. The implementation follows these key components:

1. **GitHubApiClient** (in `src/infrastructure/git-client.ts`):
   - Core client for interacting with GitHub API
   - Methods for fetching repositories, commits, pull requests, and organization members
   - Handles authentication and error management

2. **Repository Implementations**:
   - `GitHubRepositoryRepository`: Manages repository data
   - `GitHubCommitRepository`: Handles commit data
   - `GitHubPullRequestRepository`: Manages pull request and review data

3. **API Endpoints**:
   - `/api/git/repositories`: Lists repositories with filtering
   - `/api/git/metrics`: Provides Git metrics for teams, members, and repositories
   - `/api/git/pull-requests`: Lists pull requests with filtering
   - `/api/git/pull-requests/[id]/reviews`: Retrieves reviews for a specific PR
   - `/api/git/test-connection`: Tests GitHub API connection

4. **Caching Strategy**:
   - Server-side caching with a 5-minute TTL
   - Client-side caching with SWR for optimizing user experience

To test the GitHub API connection:
1. Configure your GitHub token in `.env.local`
2. Set `USE_MOCK_DATA=false`
3. Navigate to `/api/git/test-connection` in your browser

## Outstanding Tasks

The project is largely functional, but several tasks remain to be completed for a full production deployment:

1. **Authentication and Authorization**: Implement login system and role-based access control
2. **Testing**: Set up unit and integration tests
3. **CI/CD Pipeline**: Configure GitHub Actions for automated testing and deployment
4. **Error Tracking**: Integrate Sentry for error monitoring
5. **Performance Optimization**: Optimize component re-renders and implement additional caching

For a detailed list of remaining tasks, refer to [Task List](./task_list.md).

## Known Issues and Limitations

1. **Mock Data**: Some charts use mock data when `USE_MOCK_DATA=true` in environment variables
2. **API Rate Limiting**: High usage may encounter rate limits from JIRA and GitHub APIs
3. **Browser Support**: Optimized for modern browsers; IE11 not supported
4. **Repository Mapping**: Team/repository mapping is currently implemented with static mappings; could be enhanced with a more dynamic system

## Extension Points

The application is designed to be extensible in several ways:

1. **Additional Data Sources**: New data sources can be added by:
   - Creating domain entities in `/src/domain/[source]`
   - Implementing API clients in `/src/infrastructure`
   - Adding application services in `/src/application/[source]`

2. **New Visualizations**: Additional charts can be added to the dashboard by:
   - Creating components in `/src/components/charts`
   - Updating page components to include the new visualizations

3. **Additional Metrics**: New metrics can be calculated by:
   - Extending domain services in `/src/domain/[context]/services.ts`
   - Adding DTO properties in `/src/application/dtos`
   - Updating UI components to display the new metrics

4. **GitHub API Extensions**: The GitHub integration can be extended by:
   - Adding new methods to `GitHubApiClient` in `src/infrastructure/git-client.ts`
   - Creating new repository implementations for specific data needs
   - Implementing additional API endpoints in `src/pages/api/git`

## Contact Information

For questions or issues related to this project, contact:

- **Product Owner**: Jane Smith (jane.smith@example.com)
- **Technical Lead**: John Doe (john.doe@example.com)

## Recent Updates (March 2025)

1. **GitHub API Integration**:
   - Completed implementation of GitHub API integration using Octokit
   - Added API endpoints for repositories, pull requests, and reviews
   - Implemented caching strategies for improved performance
   - Added test connection endpoint for debugging

2. **Documentation Updates**:
   - Added GitHub API setup instructions to README
   - Updated task list with completed items
   - Enhanced handover documentation with GitHub API details

3. **Next Steps**:
   - Test GitHub API integration with actual credentials
   - Implement authentication and authorization
   - Configure error tracking
   - Set up CI/CD pipeline

## Handover Notes

This handover document provides an overview of the project's current state, architecture, and next steps. The development team has completed the core functionality, including the domain model, application services, API integration, and frontend components.

The next development team should focus on implementing the outstanding tasks mentioned above, starting with authentication and error tracking to prepare for a production release.

All code follows the established architecture patterns and coding standards. ESLint and Prettier configurations are in place to maintain code quality.

Refer to the documentation in the `/docs` directory for more detailed information about specific aspects of the project.
