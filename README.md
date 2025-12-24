# LongTail AI - Indonesia 🇮🇩

An AI-native SEO tool for discovering low-competition long-tail keywords in the Indonesian market using Gemini 2.5, real-time SERP data, and opportunity scoring.

## Features

- **Gemini 1.5 Pro/Flash Integration**: Automated intent classification and "AI Saturation" analysis.
- **Real-time Metrics**: Aggregates Volume, KD (Keyword Difficulty), and CPC.
- **Opportunity Scoring**: Weighted algorithm prioritizing high-volume/low-competition keywords that AI cannot answer perfectly.
- **Content Briefs**: One-click generation of SEO titles, meta descriptions, and outlines using streaming AI.
- **Mock Mode**: Runs without API keys for testing UI flows.

## Tech Stack

- **Framework**: React 18 / Next.js 15
- **Styling**: Tailwind CSS
- **AI**: Google GenAI SDK (`@google/genai`)
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env` file (optional for mock mode, required for real data):
   ```env
   # Required for AI Features
   API_KEY=your_gemini_api_key
   
   # Optional - for real SERP data (mocked by default in this demo)
   SERPAPI_KEY=your_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Usage Guide

1. **Seed Keyword**: Enter a broad topic (e.g., "Kopi Susu").
2. **Analysis**: The app generates variations and calculates the "Opportunity Score".
3. **Review**: Click a row to see the detail panel.
4. **Generate Brief**: In the detail panel, click "AI Brief" to stream a content outline using Gemini.

## AI Prompts Used

The following prompts are implemented in `services/geminiService.ts`:

**Intent & Saturation:**
> "Analyze the keyword: '${keyword}' for the Indonesian market (2025 context). Classify Intent... Estimate 'AI Saturation': How well can an LLM answer this directly..."

**Content Brief:**
> "Create a comprehensive SEO Content Brief for the keyword: '${keyword}'. Target Audience: Indonesia. Format Requirements: Markdown, H1, Meta, 5 Section Outline..."

## License

MIT
