import React, { useState, useEffect } from 'react';
import { X, Save, Key, Shield, Eye, EyeOff, AlertTriangle, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { geminiKey: string; serpApiKey: string }) => void;
  initialKeys: { geminiKey: string; serpApiKey: string };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialKeys }) => {
  const [keys, setKeys] = useState(initialKeys);
  const [showKeys, setShowKeys] = useState({ gemini: false });

  useEffect(() => {
    if (isOpen) setKeys(initialKeys);
  }, [isOpen, initialKeys]);

  if (!isOpen) return null;

  const handleChange = (key: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-200 dark:border-gold-antique/20 rounded-xl shadow-2xl shadow-gray-400/50 dark:shadow-black relative overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gold-antique/20 flex items-center justify-between bg-gray-50 dark:bg-surface-elevated/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="text-gold-antique dark:text-gold-champagne" size={24} />
            API Configuration
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-surface-elevated/50 border border-blue-100 dark:border-gold-antique/10 rounded-lg p-4 flex items-start gap-3">
             <AlertTriangle className="text-blue-500 dark:text-gold-champagne shrink-0 mt-0.5" size={16} />
             <p className="text-xs text-blue-700 dark:text-gray-300">
               Keys entered here are stored in your browser's LocalStorage for the demo. For production, please configure <code className="text-blue-800 dark:text-gold-champagne">process.env</code> variables.
             </p>
          </div>

          {/* Gemini Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gold-antique uppercase tracking-wider">Gemini API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input 
                type={showKeys.gemini ? "text" : "password"}
                value={keys.geminiKey}
                onChange={(e) => handleChange('geminiKey', e.target.value)}
                placeholder={process.env.API_KEY ? "Loaded from Environment" : "sk-..."}
                className="w-full bg-gray-50 dark:bg-surface-elevated border border-gray-200 dark:border-gold-antique/20 rounded-lg py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-gold-champagne focus:border-gold-champagne outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <button 
                type="button"
                onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-antique dark:text-gray-500 dark:hover:text-gold-champagne"
              >
                {showKeys.gemini ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {/* Data Source (Replaces SerpApi Key) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gold-antique uppercase tracking-wider">Data Source</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input 
                type="text"
                value="https://news.google.com/"
                readOnly
                className="w-full bg-gray-50 dark:bg-surface-elevated border border-gray-200 dark:border-gold-antique/20 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-500 dark:text-gray-300 focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gold-antique/20 bg-gray-50 dark:bg-surface-elevated/30 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(keys)}
            className="px-6 py-2 bg-gradient-to-r from-gold-champagne to-gold-antique hover:from-gold-bright hover:to-gold-champagne text-white dark:text-surface-dark font-bold text-sm rounded-lg shadow-lg shadow-black/20 flex items-center gap-2"
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};