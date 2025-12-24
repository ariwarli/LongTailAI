import React from 'react';
import { ProjectDetails, ProjectHealth } from '../types';
import { Calendar, User, Target, Activity, Flag, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  project: ProjectDetails;
}

export const ProjectOverview: React.FC<Props> = ({ project }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Card */}
      <div className="bg-white dark:bg-surface-elevated border border-gray-200 dark:border-gold-antique/20 rounded-xl p-8 relative overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50 transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-champagne/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{project.name}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <HealthIndicator health={project.health} />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Project Health</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <InfoCard 
          icon={<User size={20} />}
          label="Project Owner"
          value={project.owner}
        />
        <InfoCard 
          icon={<Calendar size={20} />}
          label="Deadline"
          value={new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        />
        <InfoCard 
          icon={<Flag size={20} />}
          label="Target Market"
          value={`Indonesia (${project.locale})`}
        />
      </div>

      {/* Goal Section */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gold-antique/20 rounded-xl p-6 flex items-start gap-4 shadow-lg shadow-gray-100/50 dark:shadow-none transition-colors">
        <div className="p-3 bg-gold-champagne/10 rounded-lg text-gold-champagne">
          <Target size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Primary Goal</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.goal}</p>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white dark:bg-surface-elevated border border-gray-200 dark:border-gold-antique/10 rounded-xl p-5 flex items-center gap-4 hover:border-gold-champagne/30 transition-colors shadow-sm dark:shadow-none">
    <div className="text-gold-antique bg-gray-50 dark:bg-surface-dark p-3 rounded-lg border border-gray-100 dark:border-gold-antique/10">
      {icon}
    </div>
    <div>
      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-gray-900 dark:text-white font-medium">{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
      {status}
    </span>
  );
};

const HealthIndicator = ({ health }: { health: ProjectHealth }) => {
  let colorClass = "";
  let icon = <Activity size={18} />;

  switch (health) {
    case 'On Track':
      colorClass = "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      break;
    case 'At Risk':
      colorClass = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      icon = <Clock size={18} />;
      break;
    case 'Delayed':
      colorClass = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      icon = <AlertTriangle size={18} />;
      break;
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${colorClass} backdrop-blur-md`}>
      {icon}
      <span className="font-bold">{health}</span>
    </div>
  );
};