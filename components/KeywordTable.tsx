import React from 'react';
import { KeywordOpportunity } from '../types';
import { ArrowUpRight, TrendingUp, Minus, AlertCircle, Bot, Layers } from 'lucide-react';

interface Props {
  keywords: KeywordOpportunity[];
  onSelect: (k: KeywordOpportunity) => void;
  selectedId?: string;
  loading?: boolean;
}

export const KeywordTable: React.FC<Props> = ({ keywords, onSelect, selectedId, loading }) => {
  if (loading && keywords.length === 0) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gold-antique/20 bg-white dark:bg-surface-dark shadow-2xl shadow-gray-200/50 dark:shadow-black/50 transition-colors">
         <div className="w-full text-left border-collapse">
            <div className="bg-gray-50 dark:bg-surface-elevated text-gold-antique text-xs uppercase tracking-wider p-4 flex justify-between border-b border-gray-200 dark:border-gold-antique/20">
              <div className="w-1/3">Keyword</div>
              <div className="w-1/6 text-right">Opp. Score</div>
              <div className="w-1/6 text-right">Volume</div>
              <div className="w-1/6 text-right">KD %</div>
              <div className="w-1/6 text-center">AI Saturation</div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b border-gray-100 dark:border-gold-antique/10 animate-pulse flex items-center">
                 <div className="flex-1">
                   <div className="h-4 bg-gray-200 dark:bg-surface-elevated rounded w-3/4 mb-2"></div>
                   <div className="h-3 bg-gray-100 dark:bg-surface-elevated rounded w-1/2"></div>
                 </div>
                 <div className="w-16 h-6 bg-gray-200 dark:bg-surface-elevated rounded mx-4"></div>
                 <div className="w-16 h-4 bg-gray-200 dark:bg-surface-elevated rounded mx-4"></div>
                 <div className="w-24 h-2 bg-gray-200 dark:bg-surface-elevated rounded mx-4"></div>
                 <div className="w-12 h-4 bg-gray-200 dark:bg-surface-elevated rounded mx-auto"></div>
              </div>
            ))}
         </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/50 dark:bg-surface-dark/50 rounded-xl border border-dashed border-gray-300 dark:border-gold-antique/20 transition-colors">
        <Layers className="w-12 h-12 mb-4 opacity-50 text-gold-antique" />
        <p>No keywords found. Start by adding a seed keyword.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gold-antique/20 bg-white dark:bg-surface-dark shadow-2xl shadow-gray-200/50 dark:shadow-black/50 transition-colors">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-surface-elevated text-gold-antique text-xs uppercase tracking-wider">
          <tr>
            <th className="p-4 font-semibold">Keyword</th>
            <th className="p-4 font-semibold text-right">Opp. Score</th>
            <th className="p-4 font-semibold text-right">Volume</th>
            <th className="p-4 font-semibold text-right">KD %</th>
            <th className="p-4 font-semibold text-center">AI Saturation</th>
            <th className="p-4 font-semibold text-center">Intent</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gold-antique/10 text-sm">
          {keywords.map((k) => (
            <tr 
              key={k.id} 
              onClick={() => onSelect(k)}
              className={`group hover:bg-gray-50 dark:hover:bg-surface-elevated cursor-pointer transition-colors ${selectedId === k.id ? 'bg-gold-champagne/10 border-l-2 border-l-gold-champagne' : 'border-l-2 border-l-transparent'}`}
            >
              <td className="p-4 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {k.keyword}
                {k.trend === 'rising' && <TrendingUp size={14} className="text-green-500 dark:text-green-400" />}
              </td>
              <td className="p-4 text-right">
                <ScoreBadge score={k.opportunityScore} />
              </td>
              <td className="p-4 text-right text-gray-600 dark:text-gray-300 font-mono">{k.volume.toLocaleString()}</td>
              <td className="p-4 text-right">
                <div className="inline-block w-16 bg-gray-200 dark:bg-surface-elevated rounded-full h-1.5 overflow-hidden">
                   <div className={`h-full ${getKdColor(k.difficulty)}`} style={{ width: `${k.difficulty}%` }}></div>
                </div>
                <span className="ml-2 text-xs text-gray-500">{k.difficulty}</span>
              </td>
              <td className="p-4 text-center">
                 <div className="flex items-center justify-center gap-1 text-xs">
                    <Bot size={14} className={k.aiAnalysis?.saturationScore && k.aiAnalysis.saturationScore > 70 ? 'text-accent' : 'text-green-500 dark:text-green-400'} />
                    <span className="text-gray-500 dark:text-gray-400">{k.aiAnalysis?.saturationScore ?? '-'}%</span>
                 </div>
              </td>
              <td className="p-4 text-center">
                <IntentBadge intent={k.intent} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  let color = 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-surface-elevated dark:text-gray-400 dark:border-gray-700';
  if (score >= 80) color = 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30';
  else if (score >= 60) color = 'bg-gold-champagne/10 text-gold-antique dark:text-gold-champagne border-gold-champagne/30';
  else if (score >= 40) color = 'bg-accent/10 text-accent border-accent/30';
  else color = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';

  return (
    <span className={`px-2 py-1 rounded-md font-bold text-xs border ${color}`}>
      {score}
    </span>
  );
};

const IntentBadge = ({ intent }: { intent: string }) => {
  const map: Record<string, string> = {
    'Informational': 'text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Commercial Investigation': 'text-purple-600 dark:text-purple-400 bg-purple-400/10 border-purple-400/20',
    'Transactional': 'text-green-600 dark:text-green-400 bg-green-400/10 border-green-400/20',
    'Navigational': 'text-orange-600 dark:text-orange-400 bg-orange-400/10 border-orange-400/20'
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold border ${map[intent] || 'text-gray-400 border-gray-700'}`}>{intent.split(' ')[0]}</span>;
};

const getKdColor = (kd: number) => {
  if (kd < 30) return 'bg-green-500';
  if (kd < 60) return 'bg-gold-champagne';
  return 'bg-red-500';
}