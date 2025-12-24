import { KeywordOpportunity, KeywordIntent, SerpResult } from "../types";
import { GeminiService } from "./geminiService";
import { MOCK_DELAY_MS } from "../constants";

// UTILS for Scoring
function calculateOpportunityScore(
  volume: number,
  kd: number,
  saturation: number,
  intent: KeywordIntent
): number {
  // Opportunity Score Formula (0-100)
  // Higher volume (sweet spot 100-10k) is good, very high is bad (too competitive).
  // Lower KD is better.
  // Lower Saturation is better (means AI can't answer it well, so users click).
  
  let volScore = 0;
  if (volume < 50) volScore = 20;
  else if (volume < 1000) volScore = 90; // Sweet spot long tail
  else if (volume < 10000) volScore = 70;
  else volScore = 40; // Too hard usually

  const kdScore = 100 - kd; // Inverse KD
  const saturationScore = 100 - saturation; // Inverse Saturation (we want low saturation)
  
  const intentWeight = intent === KeywordIntent.COMMERCIAL ? 1.2 : 1.0;

  const rawScore = (
    (0.25 * kdScore) +
    (0.30 * saturationScore) +
    (0.25 * volScore) + 
    (0.20 * 50) // Baseline for SERP auth absence (mocked constant)
  ) * intentWeight;

  return Math.min(Math.round(rawScore), 100);
}

// MOCK DATA GENERATORS (Fallback)
const MOCK_SERP: SerpResult[] = [
  { position: 1, title: "Panduan Lengkap 2025", link: "https://example.com/guide", snippet: "Ini adalah panduan lengkap terbaru untuk topik ini...", domainAuthority: 45 },
  { position: 2, title: "Top 10 Rekomendasi", link: "https://review.id/top-10", snippet: "Daftar rekomendasi terbaik yang telah kami uji coba...", domainAuthority: 30 },
  { position: 3, title: "Diskusi Forum - Kaskus", link: "https://kaskus.co.id/thread", snippet: "Diskusi para ahli mengenai topik ini di tahun 2025...", domainAuthority: 80 },
];

export interface AggregatorConfig {
  geminiKey?: string;
  serpApiKey?: string;
}

export class AggregatorService {
  private geminiService: GeminiService;
  private serpApiKey?: string;

  constructor(config?: AggregatorConfig) {
    this.geminiService = new GeminiService(config?.geminiKey);
    this.serpApiKey = config?.serpApiKey;
  }

  // Simulates the "Worker" process
  async processKeyword(keyword: string): Promise<KeywordOpportunity> {
    
    // 1. Fetch External Data 
    // We try to get real SERP data via Gemini Grounding
    let serpResults: SerpResult[] = [];
    try {
      serpResults = await this.geminiService.searchSerp(keyword);
    } catch (e) {
      console.log("Using mock serp due to error");
    }

    if (serpResults.length === 0) {
      // Fallback if API key invalid or no results
      await new Promise(resolve => setTimeout(resolve, 500)); // Small mock delay
      serpResults = MOCK_SERP;
    }

    const mockVolume = Math.floor(Math.random() * 5000) + 50;
    const mockKD = Math.floor(Math.random() * 80);
    const mockCPC = Math.floor(Math.random() * 15000);
    
    // 2. AI Enrichment
    const analysis = await this.geminiService.analyzeKeyword(keyword);

    // 3. Compute Score
    const score = calculateOpportunityScore(mockVolume, mockKD, analysis.saturationScore, analysis.intent);

    // 4. Return Hydrated Object
    return {
      id: crypto.randomUUID(),
      keyword: keyword,
      volume: mockVolume,
      difficulty: mockKD,
      cpc: mockCPC,
      trend: Math.random() > 0.5 ? 'rising' : 'stable',
      intent: analysis.intent,
      opportunityScore: score,
      serpResults: serpResults,
      aiAnalysis: analysis,
      status: 'complete',
      createdAt: new Date().toISOString()
    };
  }
}