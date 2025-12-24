import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, ViewState } from './components/Sidebar';
import { KeywordTable } from './components/KeywordTable';
import { KeywordDetailPanel } from './components/KeywordDetailPanel';
import { SettingsModal } from './components/SettingsModal';
import { ProjectOverview } from './components/ProjectOverview';
import { KeywordOpportunity } from './types';
import { AggregatorService } from './services/aggregatorService';
import { MOCK_PROJECT_DETAILS } from './constants';
import { Plus, Search, Loader2, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [seedInput, setSeedInput] = useState('');
  const [keywords, setKeywords] = useState<KeywordOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordOpportunity | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check local storage or preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Settings State
  const [apiKeys, setApiKeys] = useState({ geminiKey: '', serpApiKey: '' });

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('LONGTAIL_AI_SETTINGS');
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSaveSettings = (keys: { geminiKey: string; serpApiKey: string }) => {
    setApiKeys(keys);
    localStorage.setItem('LONGTAIL_AI_SETTINGS', JSON.stringify(keys));
    setIsSettingsOpen(false);
  };
  
  // Re-instantiate service when keys change
  const aggregator = useMemo(() => new AggregatorService({
    geminiKey: apiKeys.geminiKey,
    serpApiKey: apiKeys.serpApiKey
  }), [apiKeys]);

  const handleSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim()) return;

    setLoading(true);
    setKeywords([]); // Clear previous results to show skeleton
    
    // Simulate finding long-tails from the seed
    const variations = [
      seedInput,
      `best ${seedInput} for beginners`,
      `${seedInput} price indonesia`,
      `how to use ${seedInput}`
    ];

    try {
      const results = await Promise.all(variations.map(k => aggregator.processKeyword(k)));
      setKeywords(prev => [...results, ...prev]);
      setSeedInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
      
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 dark:border-gold-antique/20 bg-white/95 dark:bg-surface-dark/95 backdrop-blur flex items-center justify-between px-8 z-10 transition-colors duration-300">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize transition-colors">
            {currentView} / <span className="text-gold-antique">{MOCK_PROJECT_DETAILS.name.split(':')[0]}</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-surface-elevated dark:hover:text-white transition-all"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* View Content */}
        {currentView === 'projects' ? (
          <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark/50 transition-colors">
             <ProjectOverview project={MOCK_PROJECT_DETAILS} />
          </div>
        ) : (
          /* Dashboard View */
          <>
            <div className="p-8 pb-4">
              <form onSubmit={handleSeed} className="relative max-w-2xl mx-auto mb-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-champagne transition-colors" size={20}/>
                  <input 
                    type="text" 
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    placeholder="Enter seed keyword (e.g. 'sepatu lari')" 
                    className="w-full bg-white dark:bg-surface-elevated border border-gray-200 dark:border-gold-antique/20 text-gray-900 dark:text-white rounded-xl py-4 pl-12 pr-32 focus:outline-none focus:ring-1 focus:ring-gold-champagne focus:border-gold-champagne shadow-lg shadow-gray-200/50 dark:shadow-black/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                  <button 
                    type="submit" 
                    disabled={loading || !seedInput}
                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-gold-champagne to-gold-antique hover:from-gold-bright hover:to-gold-champagne disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 dark:disabled:text-gray-500 text-surface-dark px-6 rounded-lg font-bold transition-all flex items-center gap-2 shadow-md"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>}
                    Analyze
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter a broad topic. We'll find long-tail opportunities & analyze them with Gemini 2.5.
                </p>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <KeywordTable 
                keywords={keywords} 
                onSelect={setSelectedKeyword}
                selectedId={selectedKeyword?.id}
                loading={loading}
              />
            </div>
            
            <KeywordDetailPanel 
              keyword={selectedKeyword} 
              onClose={() => setSelectedKeyword(null)}
            />
          </>
        )}
        
        {/* Settings Modal - Global */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          initialKeys={apiKeys}
        />
        
      </main>
    </div>
  );
};

export default App;