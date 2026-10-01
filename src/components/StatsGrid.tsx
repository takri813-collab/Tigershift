import React from 'react';
import { Sun, Briefcase, Clock, HardDriveDownload } from 'lucide-react';

interface StatsGridProps {
  totalWorkDays: number;
  totalOffDays: number;
  totalOtHours: number;
  estimatedOtEarnings: number;
  isOfflineReady?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalWorkDays,
  totalOffDays,
  totalOtHours,
  estimatedOtEarnings,
  isOfflineReady = true,
}) => {
  return (
    <div className="w-full mt-3 grid grid-cols-2 gap-2.5">
      {/* 1. กะทำงานทั้งหมด */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            กะทำงานทั้งหมด
          </span>
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Sun className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalWorkDays}
            </span>
            <span className="text-xs text-slate-500 font-normal">วัน</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (totalWorkDays / 31) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. วันหยุดสะสม */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            วันหยุดสะสม
          </span>
          <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalOffDays}
            </span>
            <span className="text-xs text-slate-500 font-normal">วัน</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#8C6D68] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (totalOffDays / 31) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. ชั่วโมง OT รวม */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            ชั่วโมง OT รวม
          </span>
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 tabular-nums">
              {totalOtHours}
            </span>
            <span className="text-xs text-slate-500 font-normal">ชม.</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 truncate">
            คาดการณ์ ~฿{estimatedOtEarnings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 4. บันทึกข้อมูลในเครื่อง */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            บันทึกข้อมูลในเครื่อง
          </span>
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HardDriveDownload className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-sm md:text-base font-bold text-slate-900 leading-tight">
            {isOfflineReady ? 'พร้อมใช้งาน' : 'กำลังซิงค์...'}
          </div>

          <p className="text-[11px] text-sky-600 font-medium mt-1 truncate">
            ออฟไลน์ 100% ปลอดภัย
          </p>
        </div>
      </div>
    </div>
  );
};
