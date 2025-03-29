// Domain Entities for Integrated Metrics Context
import { CompletionStats, MemberCompletionStats } from '../jira/entities';
import { TeamGitMetrics, GitMetrics } from '../git/entities';

export interface IntegratedTeamMetrics {
  teamId: string;
  teamName: string;
  jiraMetrics: CompletionStats;
  gitMetrics: TeamGitMetrics;
  correlations: CorrelationInsights;
}

export interface IntegratedMemberMetrics {
  accountId: string;
  displayName: string;
  teamId: string;
  jiraMetrics: MemberCompletionStats;
  gitMetrics: GitMetrics;
  correlations: MemberCorrelationInsights;
}

export interface CorrelationInsights {
  storyPointToCommitRatio: number;
  planningAccuracy: number;
  velocity: number;
  consistency: number;
}

export interface MemberCorrelationInsights {
  storyPointToCommitRatio: number;
  reviewQuality: number;
  contribution: number;
}

// Value Objects
export class EfficiencyRatio {
  private readonly value: number;

  constructor(storyPoints: number, commits: number) {
    if (commits === 0) {
      this.value = 0;
    } else {
      this.value = storyPoints / commits;
    }
  }

  getValue(): number {
    return this.value;
  }

  getFormattedValue(): string {
    return this.value.toFixed(2);
  }

  getClass(): string {
    if (this.value >= 0.8) return "high";
    if (this.value >= 0.4) return "medium";
    return "low";
  }
}

export class VelocityMeasurement {
  private readonly value: number;
  private readonly trend: number;

  constructor(currentPoints: number, previousPoints: number) {
    this.value = currentPoints;
    
    if (previousPoints === 0) {
      this.trend = 0;
    } else {
      this.trend = ((currentPoints - previousPoints) / previousPoints) * 100;
    }
  }

  getValue(): number {
    return this.value;
  }

  getTrend(): number {
    return this.trend;
  }

  getTrendFormatted(): string {
    const sign = this.trend >= 0 ? "+" : "";
    return `${sign}${this.trend.toFixed(1)}%`;
  }

  getTrendClass(): string {
    if (this.trend >= 5) return "positive";
    if (this.trend <= -5) return "negative";
    return "neutral";
  }
}

export class ConsistencyScore {
  private readonly value: number;

  constructor(values: number[]) {
    if (values.length <= 1) {
      this.value = 100;
      return;
    }
    
    // Calculate the standard deviation as a measure of consistency
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    // Convert to a 0-100 score where lower deviation means higher consistency
    const coefficientOfVariation = stdDev / mean;
    this.value = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));
  }

  getValue(): number {
    return this.value;
  }

  getFormattedValue(): string {
    return `${this.value.toFixed(1)}%`;
  }

  getClass(): string {
    if (this.value >= 80) return "high";
    if (this.value >= 60) return "medium";
    return "low";
  }
}

// Repository Interfaces
export interface IntegratedMetricsRepository {
  getTeamMetrics(teamId: string, startDate?: string, endDate?: string): Promise<IntegratedTeamMetrics>;
  getAllTeamMetrics(startDate?: string, endDate?: string): Promise<IntegratedTeamMetrics[]>;
  getMemberMetrics(accountId: string, startDate?: string, endDate?: string): Promise<IntegratedMemberMetrics>;
  getTeamMemberMetrics(teamId: string, startDate?: string, endDate?: string): Promise<IntegratedMemberMetrics[]>;
}
