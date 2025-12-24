import { GoogleGenAI, Type } from "@google/genai";
import { KeywordIntent, AiAnalysis, SerpResult } from "../types";

// This service handles the AI Enrichment Engine logic

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey?: string) {
    // If apiKey is provided (from settings), use it.
    // Otherwise fall back to process.env.API_KEY.
    // This allows local override while respecting the environment variable default.
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });
  }

  /**
   * Fetches real SERP data using Google Search Grounding.
   */
  async searchSerp(keyword: string): Promise<SerpResult[]> {
    const prompt = `Find the top search results for "${keyword}" in Indonesia. Return a list of the top results with their titles and URLs.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const results: SerpResult[] = [];
      
      chunks.forEach((chunk, index) => {
        if (chunk.web) {
           results.push({
             position: index + 1,
             title: chunk.web.title || "Untitled",
             link: chunk.web.uri || "#",
             snippet: "Source from Google Search Grounding", 
             // Domain authority not available from grounding
           });
        }
      });
      
      // Filter out duplicates if any based on link
      const uniqueResults = results.filter((v,i,a)=>a.findIndex(v2=>(v2.link===v.link))===i);
      
      return uniqueResults.slice(0, 10);
    } catch (e) {
      console.warn("SERP Search failed or API key missing, falling back to mock.", e);
      return [];
    }
  }

  /**
   * Analyzes a keyword for intent and AI saturation/answerability.
   * Uses Gemini 1.5 Pro Flash as requested.
   */
  async analyzeKeyword(keyword: string): Promise<AiAnalysis> {
    const prompt = `
      Analyze the keyword: "${keyword}" for the Indonesian market (2025 context).
      
      1. Classify Intent (Informational, Transactional, Commercial Investigation, Navigational).
      2. Estimate "AI Saturation": How well can an LLM answer this directly without needing a click? (0-100, where 100 is perfectly answerable by AI, 0 means user MUST click a website).
      3. Provide a brief reasoning.
      4. Suggest a clickable SEO title.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING, enum: [
                'Informational', 'Transactional', 'Commercial Investigation', 'Navigational'
              ]},
              saturationScore: { type: Type.INTEGER, description: "0 to 100" },
              aiAnswerQuality: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              reasoning: { type: Type.STRING },
              suggestedTitle: { type: Type.STRING }
            },
            required: ["intent", "saturationScore", "reasoning", "suggestedTitle"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      
      const json = JSON.parse(text);
      
      return {
        intent: json.intent as KeywordIntent,
        saturationScore: json.saturationScore,
        aiAnswerQuality: json.aiAnswerQuality || (json.saturationScore > 70 ? 'High' : 'Medium'),
        reasoning: json.reasoning,
        suggestedTitle: json.suggestedTitle
      };

    } catch (error) {
      console.error("Gemini Analysis Failed:", error);
      // Fallback for demo if quota exceeded or error
      return {
        intent: KeywordIntent.UNKNOWN,
        saturationScore: 50,
        aiAnswerQuality: 'Medium',
        reasoning: "Analysis failed, using fallback.",
        suggestedTitle: `Guide for ${keyword}`
      };
    }
  }

  /**
   * Generates a Content Brief streaming response.
   */
  async generateContentBriefStream(keyword: string, intent: string) {
    const prompt = `
      Create a comprehensive SEO Content Brief for the keyword: "${keyword}".
      Target Audience: Indonesia.
      Intent: ${intent}.
      
      Use Google Search to find the latest trends and top ranking content for this keyword to inform the brief.
      
      Format Requirements:
      - Markdown format.
      - H1 Title.
      - Meta Description (max 155 chars).
      - 5 Section Outline with H2s and bullet points.
      - Estimated Word Count.
      - Suggest 3 internal link anchor texts.
    `;

    const chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are an expert SEO Strategist for the Indonesian market.",
        tools: [{ googleSearch: {} }]
      }
    });

    return await chat.sendMessageStream({ message: prompt });
  }
}