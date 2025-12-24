import React, { useState, useRef, useEffect } from 'react';
import { KeywordOpportunity } from '../types';
import { X, ExternalLink, FileText, Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

interface Props {
  keyword: KeywordOpportunity | null;
  onClose: () => void;
}

export const KeywordDetailPanel: React.FC<Props> = ({ keyword, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [brief, setBrief] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'serp' | 'brief'>('overview');
  const briefEndRef = useRef<HTMLDivElement>(null);

  if (!keyword) return null;

  const handleGenerateBrief = async () => {
    setGenerating(true);
    setBrief(""); // Clear previous
    setActiveTab('brief');

    try {
      const gemini = new GeminiService();
      const stream = await gemini.generateContentBriefStream(keyword.keyword, keyword.intent);
      
      for await (const chunk of stream) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
           setBrief(prev => prev + c.text);
           briefEndRef.current?.scrollIntoView({ behavior: 'smooth' });
         }
      }
    } catch (e) {
      console.error(e);
      setBrief("**Error generating brief.** Please check your configuration.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-gold-antique/20 shadow-2xl shadow-gray-400/50 dark:shadow-black transform transition-all duration-300 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gold-antique/20 flex items-start justify-between bg-white/50 dark:bg-surface-elevated/50 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{keyword.keyword}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Vol: {keyword.volume}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>KD: {keyword.difficulty}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-surface-elevated rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gold-antique/20 bg-white dark:bg-surface-dark">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
        <TabButton active={activeTab === 'serp'} onClick={() => setActiveTab('serp')} label="SERP Analysis" />
        <TabButton active={activeTab === 'brief'} onClick={() => setActiveTab('brief')} label="AI Brief" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white dark:bg-surface-dark transition-colors">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-surface-elevated p-4 rounded-xl border border-gray-200 dark:border-gold-antique/10 transition-colors">
               <h3 className="text-sm uppercase tracking-wider text-gold-antique font-bold mb-3">AI Opportunity Analysis</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="text-4xl font-bold text-gold-champagne">{keyword.opportunityScore}</div>
                 <div className="text-sm text-gray-500 dark:text-gray-400">
                   Out of 100 based on Volume, KD, and AI Saturation.
                 </div>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{keyword.aiAnalysis?.reasoning}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Cost Per Click" value={`IDR ${keyword.cpc.toLocaleString()}`} />
              <MetricCard label="Trend" value={keyword.trend.toUpperCase()} />
              <MetricCard label="AI Answer Quality" value={keyword.aiAnalysis?.aiAnswerQuality || 'N/A'} />
              <MetricCard label="Intent" value={keyword.intent} />
            </div>

            <div className="bg-primary/10 p-4 rounded-xl border border-gold-champagne/20">
               <h3 className="text-sm font-bold text-gold-antique dark:text-gold-champagne mb-2 flex items-center gap-2">
                 <Sparkles size={16}/> Suggested Title
               </h3>
               <p className="text-gray-800 dark:text-gray-200 font-medium">{keyword.aiAnalysis?.suggestedTitle || 'N/A'}</p>
            </div>
          </div>
        )}

        {activeTab === 'serp' && (
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Top 10 (Indonesia)</h3>
             {keyword.serpResults.length === 0 ? (
               <p className="text-gray-500 text-sm">No SERP data available.</p>
             ) : (
               keyword.serpResults.map((res) => (
                 <div key={res.position} className="p-4 rounded-lg border border-gray-200 dark:border-gold-antique/10 bg-gray-50 dark:bg-surface-elevated/50 hover:bg-white dark:hover:bg-surface-elevated transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">#{res.position}</span>
                      {res.domainAuthority && <span className="text-[10px] text-gray-500">DA: {res.domainAuthority}</span>}
                    </div>
                    <a href={res.link} target="_blank" rel="noreferrer" className="text-gold-antique dark:text-gold-champagne font-medium hover:text-gold-bright hover:underline line-clamp-1 block mb-1">
                      {res.title}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{res.snippet}</p>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'brief' && (
          <div className="h-full flex flex-col">
             {!brief && !generating ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wand2 className="w-12 h-12 text-gold-champagne mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Generate a complete content brief using Gemini 2.5.</p>
                  <button 
                    onClick={handleGenerateBrief}
                    className="bg-gold-champagne hover:bg-gold-bright text-white dark:text-surface-dark px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-gold-champagne/20 flex items-center gap-2 transform hover:scale-105"
                  >
                    Generate Brief
                  </button>
               </div>
             ) : (
               <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-gold-antique dark:prose-a:text-gold-champagne prose-strong:text-gray-900 dark:prose-strong:text-white">
                 {generating && !brief && (
                    <div className="space-y-4 animate-pulse mt-4">
                        <div className="h-6 bg-gray-200 dark:bg-surface-elevated rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-surface-elevated rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-surface-elevated rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-surface-elevated rounded w-2/3"></div>
                        <div className="h-6 bg-gray-200 dark:bg-surface-elevated rounded w-1/4 mt-6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-surface-elevated rounded w-full"></div>
                    </div>
                 )}
                 {brief.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                 ))}
                 <div ref={briefEndRef} />
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${active ? 'border-gold-champagne text-gray-900 dark:text-white bg-white dark:bg-surface-elevated' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-elevated/50'}`}
  >
    {label}
  </button>
);

const MetricCard = ({ label, value }: { label: string, value: string }) => (
  <div className="p-3 bg-gray-50 dark:bg-surface-elevated rounded-lg border border-gray-200 dark:border-gold-antique/10 transition-colors">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="font-semibold text-gray-900 dark:text-gray-200">{value}</div>
  </div>
);