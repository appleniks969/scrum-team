import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  Team, 
  TeamMember, 
  Sprint, 
  Issue,
  CompletionStats 
} from '../domain/jira/entities';

export class JiraApiClient {
  private axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly storyPointsField: string;
  
  // Cache mechanism
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private readonly cacheExpiry: number = 5 * 60 * 1000; // 5 minutes

  constructor(
    baseUrl: string, 
    username: string, 
    apiToken: string,
    storyPointsField: string = 'customfield_10016'
  ) {
    this.baseUrl = baseUrl;
    this.storyPointsField = storyPointsField;
    
    // Create Axios instance with Basic Authentication
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add request/response interceptors
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      config => {
        console.debug(`JIRA API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => {
        console.error('JIRA API Request Error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => this.handleApiError(error)
    );
  }
  
  private handleApiError(error: any) {
    // Log error details
    console.error('JIRA API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: {
        // Log relevant request headers but mask Authorization header
        ...Object.fromEntries(
          Object.entries(error.config?.headers || {}).map(([key, value]) => 
            key.toLowerCase() === 'authorization' 
              ? [key, 'Basic ***********'] 
              : [key, value]
          )
        )
      }
    });
    
    // Specific handling for common errors
    if (error.response?.status === 403) {
      console.error('JIRA API 403 Forbidden: This is typically an authentication or permissions issue.');
      console.error('Please check your JIRA credentials and ensure the user has appropriate permissions.');
      console.error('JIRA response:', error.response?.data);
    }
    
    // Rate limiting detection
    if (error.response?.status === 429) {
      console.warn('JIRA API rate limit exceeded');
      // Could implement retry logic here
    }
    
    // Enhance error with better context
    const enhancedError = new Error(
      error.response?.data?.errorMessages?.join(', ') || 
      error.response?.data?.message || 
      error.message || 
      'Unknown JIRA API error'
    );
    
    // Add additional error properties
    Object.assign(enhancedError, {
      statusCode: error.response?.status,
      originalError: error,
      endpoint: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(enhancedError);
  }
  
  // Cache helper methods
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }
  
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.debug(`Cache hit for: ${key}`);
      return cached.data as T;
    }
    return null;
  }
  
  private setCacheData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  // Generic method for making API calls with caching
  private async apiCall<T>(
    endpoint: string, 
    config?: AxiosRequestConfig, 
    skipCache: boolean = false
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, config?.params);
    
    // Check cache first if not explicitly skipped
    if (!skipCache) {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    try {
      const response = await this.axiosInstance.get<T>(endpoint, config);
      
      // Cache successful responses
      this.setCacheData(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      // For some errors, we might want to return stale data if available
      if (axios.isAxiosError(error) && error.response?.status >= 500) {
        const cachedData = this.getCachedData<T>(cacheKey);
        if (cachedData) {
          console.warn(`Using stale cached data for ${endpoint} due to server error`);
          return cachedData;
        }
      }
      throw error;
    }
  }
  
  // API Methods for JIRA Resources
  
  // Boards (Teams)
  async getBoards(startAt: number = 0, maxResults: number = 50): Promise<any> {
    return this.apiCall<any>('/rest/agile/1.0/board', {
      params: { startAt, maxResults }
    });
  }
  
  async getBoardById(boardId: number): Promise<any> {
    return this.apiCall<any>(`/rest/agile/1.0/board/${boardId}`);
  }
  
  // Sprints
  async getBoardSprints(
    boardId: number, 
    state?: string,
    startAt: number = 0, 
    maxResults: number = 50
  ): Promise<any> {
    return this.apiCall<any>(`/rest/agile/1.0/board/${boardId}/sprint`, {
      params: { state, startAt, maxResults }
    });
  }
  
  async getSprintById(sprintId: number): Promise<any> {
    return this.apiCall<any>(`/rest/agile/1.0/sprint/${sprintId}`);
  }
  
  // Issues
  async getIssuesByJQL(
    jql: string,
    fields: string[] = ['summary', 'status', 'assignee'],
    startAt: number = 0,
    maxResults: number = 100
  ): Promise<any> {
    // Always include the story points field
    if (!fields.includes(this.storyPointsField)) {
      fields.push(this.storyPointsField);
    }
    
    return this.apiCall<any>('/rest/api/2/search', {
      params: { jql, fields: fields.join(','), startAt, maxResults }
    });
  }
  
  async getSprintIssues(sprintId: number): Promise<any> {
    const jql = `sprint=${sprintId}`;
    return this.getIssuesByJQL(jql);
  }
  
  async getBoardIssues(
    boardId: number, 
    startAt: number = 0, 
    maxResults: number = 100
  ): Promise<any> {
    return this.apiCall<any>(`/rest/agile/1.0/board/${boardId}/issue`, {
      params: {
        fields: `summary,status,assignee,${this.storyPointsField}`,
        startAt,
        maxResults
      }
    });
  }
  
  async getIssuesByTeamAndTimeframe(
    boardId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<any> {
    let jql = `board=${boardId}`;
    
    if (startDate) {
      jql += ` AND updated >= "${startDate}"`;
    }
    
    if (endDate) {
      jql += ` AND updated <= "${endDate}"`;
    }
    
    return this.getIssuesByJQL(jql);
  }
  
  // Users
  async getUsers(startAt: number = 0, maxResults: number = 50): Promise<any> {
    return this.apiCall<any>('/rest/api/2/users', {
      params: { startAt, maxResults }
    });
  }
  
  async getUserById(accountId: string): Promise<any> {
    return this.apiCall<any>(`/rest/api/2/user`, {
      params: { accountId }
    });
  }
  
  // Get issues assigned to a specific user
  async getIssuesByAssignee(
    accountId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<any> {
    let jql = `assignee = "${accountId}"`;
    
    if (startDate) {
      jql += ` AND updated >= "${startDate}"`;
    }
    
    if (endDate) {
      jql += ` AND updated <= "${endDate}"`;
    }
    
    return this.getIssuesByJQL(jql);
  }
  
  // Helper methods for pagination
  async getAllResults<T>(
    fetchMethod: (startAt: number, maxResults: number) => Promise<any>,
    resultKey: string,
    maxTotal: number = 1000
  ): Promise<T[]> {
    let allResults: T[] = [];
    let startAt = 0;
    const maxResults = 50;
    let total = maxTotal;
    
    do {
      const response = await fetchMethod(startAt, maxResults);
      
      // Update total if it's provided in the response
      if (response.total !== undefined) {
        total = response.total;
      }
      
      // Add results to the array
      const results = response[resultKey] || [];
      allResults = [...allResults, ...results];
      
      // Update startAt for next page
      startAt += maxResults;
      
      // Continue until we've fetched all results or hit the max
      if (startAt >= total || allResults.length >= maxTotal) {
        break;
      }
    } while (true);
    
    return allResults;
  }
  
  // Get all boards with pagination handling
  async getAllBoards(maxTotal: number = 100): Promise<any[]> {
    return this.getAllResults<any>(
      (startAt, maxResults) => this.getBoards(startAt, maxResults),
      'values',
      maxTotal
    );
  }
  
  // Get all sprints for a board with pagination handling
  async getAllBoardSprints(boardId: number, state?: string): Promise<any[]> {
    return this.getAllResults<any>(
      (startAt, maxResults) => this.getBoardSprints(boardId, state, startAt, maxResults),
      'values'
    );
  }
  
  // Clear cache for testing or when data might be stale
  clearCache(): void {
    this.cache.clear();
    console.debug('JIRA API cache cleared');
  }
  
  // Get the story points field being used
  getStoryPointsField(): string {
    return this.storyPointsField;
  }
}