// Data Models matching the requested logic

export enum KeywordIntent {
  INFORMATIONAL = 'Informational',
  TRANSACTIONAL = 'Transactional',
  COMMERCIAL = 'Commercial Investigation',
  NAVIGATIONAL = 'Navigational',
  UNKNOWN = 'Unknown'
}

export interface SerpResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  domainAuthority?: number; // Mocked metric
}

export interface AiAnalysis {
  saturationScore: number; // 0-100, how well AI answers it
  aiAnswerQuality: 'Low' | 'Medium' | 'High';
  intent: KeywordIntent;
  reasoning: string;
  suggestedTitle?: string;
}

export interface KeywordOpportunity {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number; // KD 0-100
  opportunityScore: number; // Calculated 0-100
  cpc: number;
  trend: 'stable' | 'rising' | 'falling';
  intent: KeywordIntent;
  serpResults: SerpResult[];
  aiAnalysis?: AiAnalysis;
  status: 'pending' | 'analyzing' | 'complete';
  createdAt: string;
}

export type ProjectHealth = 'On Track' | 'At Risk' | 'Delayed';
export type ProjectStatus = 'Active' | 'Planning' | 'Completed' | 'On Hold';

export interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: ProjectStatus;
  deadline: string;
  owner: string;
  health: ProjectHealth;
  locale: string;
}

export interface Project {
  id: string;
  name: string;
  locale: string; // e.g., 'ID'
  keywords: KeywordOpportunity[];
}

// Configuration for External APIs
export interface ApiKeys {
  gemini: string;
  serpApi: string;
  googleAds?: string; // Optional for demo
}