import React from 'react';
import { Users } from 'lucide-react';
import { ShiftGroup } from '../types/shift';
import { SHIFT_METADATA } from '../utils/shiftSchedule';

interface ShiftSelectorProps {
  selectedGroup: ShiftGroup;
  onSelectGroup: (group: ShiftGroup) => void;
}

export const ShiftSelector: React.FC<ShiftSelectorProps> = ({
  selectedGroup,
  onSelectGroup,
}) => {
  const groups: ShiftGroup[] = ['A', 'B', 'C', 'D'];

  return (
    <section className="w-full mt-2">
      {/* Label and Badge Row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800 text-[15px]">
            เลือกกรอบกะทำงาน
          </span>
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 tracking-tight">
          รอบหมุนเวียน 4 กะ 2 ผลัด
        </span>
      </div>

      {/* 4 Shift Cards - Show only shift names */}
      <div className="grid grid-cols-4 gap-2">
        {groups.map((group) => {
          const isSelected = selectedGroup === group;
          const meta = SHIFT_METADATA[group];

          return (
            <button
              key={group}
              onClick={() => onSelectGroup(group)}
              type="button"
              className={`flex items-center justify-center py-3 px-1 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-white border-rose-400 shadow-sm ring-2 ring-rose-200/60'
                  : 'bg-white/70 hover:bg-white border-slate-200/80 text-slate-600'
              }`}
            >
              <span
                className={`text-sm md:text-base font-bold ${
                  isSelected ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                {meta.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
