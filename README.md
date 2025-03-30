# ScrumTeam Metrics Dashboard

A comprehensive dashboard for visualizing story point completion and Git development metrics across your organization.

## Project Overview

The ScrumTeam Metrics Dashboard provides an integrated view of productivity metrics from JIRA and Git repositories, allowing teams to track performance, identify trends, and optimize workflows.

### Key Features

- **JIRA Story Point Analytics**: Track story point completion across teams and sprints
- **Git Development Metrics**: Monitor commits, PRs, and code reviews
- **Team & Member Dashboards**: Analyze performance at team and individual levels
- **Correlation Analysis**: Understand the relationship between planning and execution
- **Interactive Visualizations**: Explore data through dynamic charts and filters

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- Yarn or NPM
- JIRA and GitHub/GitLab access tokens

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/scrumteam-metrics-dashboard.git
   cd scrumteam-metrics-dashboard
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env.local` file with your API credentials:
   ```
   JIRA_BASE_URL=https://your-instance.atlassian.net
   JIRA_USERNAME=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   GITHUB_TOKEN=your-github-token
   GITHUB_ORG=your-organization-name
   USE_MOCK_DATA=false
   ```

4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Setup

#### JIRA API Setup

To enable JIRA API integration, you need to:

1. **Create a JIRA API Token**:
   - Log in to your Atlassian account
   - Go to Account Settings → Security → Create and manage API tokens
   - Create a new API token and copy it

2. **Identify your Story Points Field**:
   - Different JIRA instances use different custom field IDs for story points
   - By default, the dashboard looks for `customfield_10016`
   - To find your story points field ID:
     - Open a JIRA issue with story points in your browser
     - Open the browser developer tools and go to the Network tab
     - Find an API request to the issue (e.g., `/rest/api/3/issue/{issueKey}`)  
     - Look in the response for a field like `customfield_XXXXX` that contains your story points value

3. **Configure Environment Variables**:
   - Add the following to your `.env.local` file:
     ```
     JIRA_BASE_URL=https://your-instance.atlassian.net
     JIRA_USERNAME=your-email@example.com
     JIRA_API_TOKEN=your-api-token
     JIRA_STORY_POINTS_FIELD=customfield_10016
     ```
   - Set `USE_MOCK_DATA=false` to use the actual JIRA API

4. **Test the Connection**:
   - Start the development server
   - Navigate to `/api/test/jira-connection` endpoint in your browser
   - You should see a success message if the connection is working

5. **Troubleshooting**:
   - If you encounter rate limiting issues, consider increasing the cache TTL in the API endpoints
   - Ensure your JIRA API token has the necessary permissions
   - Check that the story points field ID is correct for your JIRA instance

#### GitHub API Setup

To enable GitHub API integration, you need to:

1. **Create a GitHub Personal Access Token**:
   - Go to your GitHub account → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with the following scopes:
     - `repo` (Full control of private repositories)
     - `read:org` (Read organization information)
     - `read:user` (Read user information)
     - `user:email` (Access user email addresses)
   - Copy the generated token

2. **Configure Environment Variables**:
   - Add the following to your `.env.local` file:
     ```
     GITHUB_TOKEN=your-github-personal-access-token
     GITHUB_ORG=your-organization-name
     ```
   - Set `USE_MOCK_DATA=false` to use the actual GitHub API

3. **Test the Connection**:
   - Start the development server
   - Navigate to `/api/git/test-connection` endpoint in your browser
   - You should see a success message if the connection is working

4. **Troubleshooting**:
   - If you encounter rate limiting issues, consider increasing the cache TTL in the API endpoints
   - Check GitHub API status at https://www.githubstatus.com/ if you experience connection issues

## Architecture

This project follows Domain-Driven Design principles with a clean architecture approach:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and services
- **Infrastructure Layer**: External API integrations
- **Presentation Layer**: Next.js pages and React components

## Project Structure

```
/src
  /domain            # Domain models, services, and interfaces
    /jira            # JIRA domain context
    /git             # Git domain context
    /metrics         # Integrated metrics domain
  /application       # Application services and DTOs
  /infrastructure    # External API clients and implementations
  /pages             # Next.js pages and API routes
  /components        # React components
    /layout          # Layout components
    /dashboard       # Dashboard-specific components
    /charts          # Data visualization components
  /hooks             # Custom React hooks
  /utils             # Utility functions
  /styles            # Global styles and Tailwind config
```

## Documentation

For detailed documentation, see the `/docs` directory:

- [Project Overview](./docs/project_overview.md)
- [Architecture](./docs/architecture.md)
- [Technical Specification](./docs/technical_specification.md)
- [Task List](./docs/task_list.md)

## Mockups

View dashboard mockups in the `/mockups` directory:

- [Dashboard Wireframe](./mockups/dashboard_wireframe.svg)
- [Team Members Wireframe](./mockups/team_members_wireframe.svg)
- [Mockup Specifications](./mockups/mockup_specifications.md)

## Development Workflow

1. Pick a task from the [Task List](./docs/task_list.md)
2. Create a feature branch (`feature/task-name`)
3. Implement the feature following DDD principles
4. Write tests for your implementation
5. Submit a PR for review

## License

This project is licensed under the MIT License - see the LICENSE file for details.
