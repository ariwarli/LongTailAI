import React from 'react';
import { LayoutDashboard, Database, Settings, LogOut, Search } from 'lucide-react';

export type ViewState = 'dashboard' | 'projects';

interface SidebarProps {
  onOpenSettings: () => void;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings, currentView, onViewChange }) => {
  return (
    <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gold-antique/20 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gold-antique/20 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gold-champagne to-gold-antique rounded-lg flex items-center justify-center shadow-lg shadow-gold-champagne/10">
           <Search className="text-white dark:text-surface-dark w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">LongTail<span className="text-gold-champagne">AI</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-400 dark:text-gold-antique/70 uppercase tracking-wider mb-2 px-3">Workspace</div>
        
        <div onClick={() => onViewChange('dashboard')}>
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
          />
        </div>
        
        <div onClick={() => onViewChange('projects')}>
          <NavItem 
            icon={<Database size={20}/>} 
            label="Projects" 
            active={currentView === 'projects'} 
          />
        </div>

        <div onClick={onOpenSettings}>
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gold-antique/20">
        <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gold-bright dark:text-gray-400 dark:hover:text-gold-bright cursor-pointer transition-colors group">
          <LogOut size={18} className="group-hover:text-gold-bright" />
          <span className="text-sm font-medium">Sign Out</span>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-gold-champagne/10 text-gold-champagne border border-gold-champagne/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:bg-surface-elevated dark:hover:text-gray-100 dark:hover:border-gold-antique/10 border border-transparent'}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);