// Domain Entities for JIRA Context

export interface Team {
  id: string;
  name: string;
  boardId: number;
}

export interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress: string;
  teamId: string;
}

export interface Sprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  boardId: number;
}

export interface Issue {
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

export interface CompletionStats {
  teamId: string;
  teamName: string;
  sprintId: number;
  sprintName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionPercentage: number;
  memberStats: MemberCompletionStats[];
}

export interface MemberCompletionStats {
  accountId: string;
  displayName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
}

// Value Objects
export class StoryPointValue {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error("Story points cannot be negative");
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}

export class CompletionPercentage {
  private readonly value: number;

  constructor(completed: number, total: number) {
    if (total === 0) {
      this.value = 0;
    } else {
      this.value = (completed / total) * 100;
    }
  }

  getValue(): number {
    return this.value;
  }

  getFormattedValue(): string {
    return `${this.value.toFixed(1)}%`;
  }
}

// Repository Interfaces
export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findByBoardId(boardId: number): Promise<Team | null>;
}

export interface TeamMemberRepository {
  findByTeam(teamId: string): Promise<TeamMember[]>;
  findById(accountId: string): Promise<TeamMember | null>;
}

export interface SprintRepository {
  findByTeam(teamId: string): Promise<Sprint[]>;
  findActive(teamId: string): Promise<Sprint[]>;
  findById(id: number): Promise<Sprint | null>;
}

export interface IssueRepository {
  findBySprint(sprintId: number): Promise<Issue[]>;
  findByTeam(teamId: string, startDate?: string, endDate?: string): Promise<Issue[]>;
  findByAssignee(accountId: string, startDate?: string, endDate?: string): Promise<Issue[]>;
}
