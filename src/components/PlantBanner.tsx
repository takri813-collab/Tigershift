import React from 'react';
import { Factory } from 'lucide-react';
import { PlantConfig } from '../types/shift';

interface PlantBannerProps {
  config: PlantConfig;
  onOpenSettings: () => void;
}

export const PlantBanner: React.FC<PlantBannerProps> = ({
  config,
  onOpenSettings,
}) => {
  return (
    <div
      onClick={onOpenSettings}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpenSettings();
      }}
      className="w-full mt-3 mb-6 bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-slate-200 transition-all active:scale-[0.99]"
    >
      <div className="w-11 h-11 rounded-2xl bg-indigo-50/80 text-rose-600 border border-indigo-100/50 flex items-center justify-center shrink-0">
        <Factory className="w-6 h-6 stroke-[1.8]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-800 text-sm md:text-[15px] truncate">
            {config.name}
          </h4>
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {config.line}
        </p>
      </div>
    </div>
  );
};
