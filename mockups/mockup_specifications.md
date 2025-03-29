# ScrumTeam Metrics Dashboard Mockup Specifications

## Overview Dashboard

### Components
1. **Header Section**
   - Dashboard title: "Development Metrics Dashboard"
   - Date range selector (Week/Month/Quarter/Year/Custom)
   - Export Report button

2. **Navigation Tabs**
   - Overview (default)
   - Teams
   - Team Members
   - JIRA Metrics
   - Git Metrics
   - Correlation Analysis

3. **High-Level Metrics Cards**
   - Story Points Completed
   - Total Commits
   - Pull Requests Merged
   - Active Teams

4. **Weekly Activity Trends Chart**
   - Line chart showing:
     - Story Points (blue)
     - Commits (green)
     - Pull Requests (purple)
   - X-axis: Weeks
   - Y-axis: Count
   - Data source toggle (All/JIRA/Git)

5. **Story Points to Code Correlation**
   - Scatter plot showing relationship between:
     - X-axis: Story Points
     - Y-axis: Commit Count
   - Each point represents a team
   - Tooltip showing team name and ratio

### Layout
- Responsive grid layout with cards adjusting to screen size
- Metric cards in a 4-column grid on large screens, stacking on mobile
- Charts take full width with minimum height of 250px
- Date range selector and export button aligned to the right
- Navigation tabs horizontally scrollable on mobile

### Interactions
- Date range selector updates all charts and metrics
- Data source toggle filters which metrics are displayed
- Tab navigation changes the main dashboard view
- Export button generates a downloadable report in PDF/Excel format
- Hovering over data points shows detailed tooltips

## Teams Dashboard

### Components
1. **Team Performance Table**
   - Columns:
     - Team Name
     - Story Points (with progress bar)
     - Commits (with progress bar)
     - Pull Requests
     - SP/Commit Ratio
     - Actions
   - Sortable by any column
   - "View Details" action button

2. **Team Metrics Comparison Chart**
   - Horizontal bar chart
   - Y-axis: Team names
   - X-axis: Count
   - Multiple bars per team:
     - Story Points (blue)
     - Commits (green)
     - Pull Requests (purple)
   - Legend and tooltips

### Layout
- Table takes full width with horizontal scrolling on mobile
- Progress bars show visual representation of completion
- Chart positioned below table with adequate spacing
- Responsive design adjusting to screen width

### Interactions
- Clicking team name navigates to team detail view
- Sorting columns by clicking headers
- Filtering table via search input
- View Details button opens detailed team dashboard
- Hovering over bars in chart shows detailed metrics

## Team Members Dashboard

### Components
1. **Filtering Controls**
   - Team selector dropdown
   - Time period selector
   - Search input for filtering members

2. **Member Cards Grid**
   - Profile indicator (initial or avatar)
   - Name and team affiliation
   - 4 metric quadrants:
     - Story Points (blue)
     - Commits (green)
     - PRs Created (purple)
     - PR Reviews (indigo)
   - Review Response Time indicator at bottom

3. **Individual Performance Table**
   - Columns:
     - Name
     - Team
     - Story Points
     - Commits
     - PRs
     - PR Reviews
     - Response Time
   - Sortable by any column

### Layout
- Member cards in a responsive grid (3 columns on desktop, 1 on mobile)
- Cards display key metrics in 2x2 grid of mini-cards
- Table below cards with all members' data
- Filtering controls at top of page

### Interactions
- Team selector filters members by team
- Time period selector updates metrics for selected period
- Hovering over metrics shows additional details
- Clicking on a member card navigates to detailed member view
- Sorting table by clicking column headers

## Git Metrics Dashboard

### Components
1. **Git Metrics Overview Cards**
   - Total Commits
   - Pull Requests
   - Active Branches
   - Avg Review Time

2. **Git Activity by Team Chart**
   - Bar chart showing:
     - Commits (green)
     - PRs (purple)
   - X-axis: Team names
   - Y-axis: Count

3. **Pull Request Status Cards**
   - Open PRs (with count and average age)
   - In Review PRs (with count and average age)
   - Approved PRs (with count)
   - Merged PRs (with count)

### Layout
- Metric cards in 4-column grid on desktop, stacking on mobile
- Chart takes full width with adequate height
- PR status cards in 4-column grid on desktop, 2 columns on tablets, 1 on mobile

### Interactions
- Team selector filters Git metrics to specific team
- Hovering over chart bars shows detailed metrics
- Clicking on PR status cards shows filtered list of PRs in that status
- Export button for generating Git activity reports

## Correlation Analysis Dashboard

### Components
1. **Correlation Scatter Plot**
   - X-axis: Story Points
   - Y-axis: Commits
   - Each point represents a team
   - Legend and detailed tooltips

2. **Analysis Insights Panel**
   - Text analysis of correlation patterns
   - Key observations about team performance
   - Outlier analysis

3. **Story Points vs PR Ratio Table**
   - Columns:
     - Team
     - SP/PR Ratio
     - Efficiency (with progress bar)
   - Sortable by any column

4. **Velocity Consistency Chart**
   - Line chart showing story point completion over time
   - X-axis: Time periods
   - Y-axis: Story points
   - Trend line showing consistency

### Layout
- Scatter plot takes full width at top
- Analysis insights panel below scatter plot
- Two-column layout for table and consistency chart on desktop
- Stacked layout on mobile and tablets

### Interactions
- Hovering over data points shows team details
- Clicking on team in table highlights corresponding point in scatter plot
- Date range selector updates all charts and metrics
- Filtering controls for teams and time periods

## Color Scheme and Styling

### Primary Colors
- Blue (#3b82f6): Story point metrics
- Green (#10b981): Commit metrics
- Purple (#8b5cf6): PR metrics
- Indigo (#6366f1): Review metrics

### UI Elements
- White background for cards and containers
- Light gray background (#f3f4f6) for page background
- Dark text for readability
- Consistent spacing and padding
- Rounded corners on all containers and cards
- Subtle shadows for depth

### Typography
- Sans-serif font family
- Hierarchical sizing:
  - Large (24px): Main titles
  - Medium (18px): Section headers
  - Regular (16px): Body text
  - Small (14px): Labels and secondary text
  - Extra small (12px): Footnotes and hints

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
