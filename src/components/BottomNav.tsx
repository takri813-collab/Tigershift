import React from 'react';
import { CalendarDays, Calculator, CalendarCheck, TrendingUp } from 'lucide-react';

export type NavTab = 'schedule' | 'ot_calc' | 'leave' | 'yearly';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    {
      id: 'schedule' as NavTab,
      label: 'ตารางกะ',
      icon: CalendarDays,
    },
    {
      id: 'ot_calc' as NavTab,
      label: 'คำนวณ OT',
      icon: Calculator,
    },
    {
      id: 'leave' as NavTab,
      label: 'บันทึกวันลา',
      icon: CalendarCheck,
    },
    {
      id: 'yearly' as NavTab,
      label: 'สรุปรายปี',
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className="flex flex-col items-center justify-center h-full py-1 text-center transition-colors focus:outline-none"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'text-rose-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span
                className={`text-[11px] font-medium leading-tight mt-0.5 tracking-tight ${
                  isActive ? 'text-rose-600 font-semibold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
