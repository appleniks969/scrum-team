# ScrumTeam Metrics Dashboard Setup Guide

This guide provides detailed instructions for setting up the ScrumTeam Metrics Dashboard for development and production environments.

## Development Environment Setup

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd ScrumTeam
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # JIRA API Configuration
   JIRA_BASE_URL=https://your-instance.atlassian.net
   JIRA_USERNAME=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   
   # GitHub API Configuration
   GITHUB_TOKEN=your-github-token
   GITHUB_ORG=your-organization
   
   # Optional: Analytics (if configured)
   NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Tools

- **Code Formatting**:
  ```bash
  npm run format
  # or
  yarn format
  ```

- **Linting**:
  ```bash
  npm run lint
  # or
  yarn lint
  ```

- **Fix Linting Issues**:
  ```bash
  npm run lint:fix
  # or
  yarn lint:fix
  ```

- **Running Tests**:
  ```bash
  npm test
  # or
  yarn test
  ```

## API Configurations

### JIRA API

1. **Create a JIRA API Token**:
   - Log in to your Atlassian account
   - Go to Account Settings > Security > Create and manage API tokens
   - Create a new API token and copy it to your `.env.local` file

2. **Configure JIRA Project Mappings**:
   - Open `src/infrastructure/jira-client.ts`
   - Update the `projectMapping` variable with your JIRA project keys

### GitHub API

1. **Create a GitHub Personal Access Token**:
   - Log in to your GitHub account
   - Go to Settings > Developer settings > Personal access tokens
   - Generate a new token with the following scopes:
     - `repo`
     - `read:user`
     - `read:org`
   - Copy the token to your `.env.local` file

2. **Configure GitHub Repository Mappings**:
   - Open `src/infrastructure/git-client.ts`
   - Update the `teamMappings` variable with your repository to team mappings

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import your project in Vercel**:
   - Log in to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure environment variables**:
   - Add all the environment variables from your `.env.local` file

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Docker Deployment

1. **Create a Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Build the application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/next.config.js ./
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["npm", "start"]
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t scrumteam-dashboard .
   ```

3. **Run the Docker container**:
   ```bash
   docker run -p 3000:3000 -e JIRA_BASE_URL=https://your-instance.atlassian.net -e JIRA_USERNAME=your-email@example.com -e JIRA_API_TOKEN=your-api-token -e GITHUB_TOKEN=your-github-token -e GITHUB_ORG=your-organization scrumteam-dashboard
   ```

### AWS Amplify Deployment

1. **Log in to AWS Management Console**

2. **Navigate to AWS Amplify**

3. **Create a new app**:
   - Choose "Host web app"
   - Select your Git provider and repository

4. **Configure build settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Configure environment variables**:
   - Add all the environment variables from your `.env.local` file

6. **Save and deploy**

## Monitoring and Maintenance

### Setting Up Monitoring

1. **Error Tracking with Sentry** (Not yet implemented):
   - Create a Sentry account
   - Add Sentry configuration in `_app.tsx`
   - Add the Sentry DSN to environment variables

2. **Analytics with Vercel Analytics** (If using Vercel):
   - Enable Vercel Analytics in the Vercel dashboard
   - Add analytics ID to environment variables

### Backup Procedures

1. **Database Backups** (If adding a database in the future):
   - Configure regular automated backups
   - Test restoration procedures

2. **Configuration Backups**:
   - Use environment variables for configurations
   - Store sensitive data in a secure vault

### Updating Dependencies

1. **Regular dependency updates**:
   ```bash
   npm outdated
   npm update
   # Check for major version updates
   npx npm-check-updates
   ```

2. **Security updates**:
   ```bash
   npm audit
   npm audit fix
   ```

## Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Check API credentials in environment variables
   - Verify network connectivity to JIRA and GitHub
   - Check API rate limits

2. **Build Errors**:
   - Clear `.next` directory: `rm -rf .next`
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npx tsc --noEmit`

3. **Performance Issues**:
   - Check for memory leaks in React components
   - Optimize data fetching with proper caching
   - Use React.memo for expensive components

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JIRA REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)

---

For more information, refer to the [Handover Guide](./handover_guide.md) and [Project Documentation](./project_overview.md).
