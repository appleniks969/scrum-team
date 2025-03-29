// Data Transfer Objects for JIRA Context

export interface TeamDto {
  id: string;
  name: string;
  boardId: number;
}

export interface TeamMemberDto {
  accountId: string;
  displayName: string;
  emailAddress: string;
  teamId: string;
}

export interface SprintDto {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  boardId: number;
}

export interface IssueDto {
  id: string;
  key: string;
  summary: string;
  storyPoints?: number;
  status: string;
  assignee?: {
    accountId: string;
    displayName: string;
  };
  teamId: string;
  sprintId?: number;
  resolvedDate?: string;
}

export interface CompletionStatsDto {
  teamId: string;
  teamName: string;
  sprintId: number;
  sprintName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  memberStats: MemberCompletionStatsDto[];
  date: string; // For caching and versioning
}

export interface MemberCompletionStatsDto {
  accountId: string;
  displayName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
}

// Request DTOs
export interface GetTeamStatsRequestDto {
  teamId: string;
  sprintId?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetMemberStatsRequestDto {
  accountId: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
}
