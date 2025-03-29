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
   ```

4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
