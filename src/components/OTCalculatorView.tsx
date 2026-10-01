import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Coins,
  TrendingUp,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { OvertimeRecord, PlantConfig } from '../types/shift';
import { THAI_MONTHS } from '../utils/shiftSchedule';

interface OTCalculatorViewProps {
  otRecords: OvertimeRecord[];
  plantConfig: PlantConfig;
  onUpdatePlantConfig: (config: PlantConfig) => void;
}

interface MonthlyOtEntry {
  days12: number; // Number of 12-hour OT days
  days8: number;  // Number of 8-hour OT days
  extraHours: number; // Additional OT hours (e.g. 2h, 4h partial shifts)
}

const STORAGE_KEYS = {
  SALARY: 'tigershift_ot_salary',
  MONTHLY_DATA: 'tigershift_monthly_ot_matrix_v1',
};

export const OTCalculatorView: React.FC<OTCalculatorViewProps> = ({
  otRecords,
  plantConfig,
}) => {
  // 1. Base Salary with LocalStorage persistence
  const [baseSalary, setBaseSalary] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALARY);
    return saved ? Number(saved) : 24000;
  });
  const [isSalarySaved, setIsSalarySaved] = useState<boolean>(false);

  // 2. Selected Month for Calculation (default to October = index 9)
  const [selectedMonth, setSelectedMonth] = useState<number>(9);

  // 3. Monthly OT data map (month index 0-11 -> { days12, days8, extraHours })
  const [monthlyOtData, setMonthlyOtData] = useState<Record<number, MonthlyOtEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MONTHLY_DATA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default seed with October 2024 data matching the screenshot (1 day 12h, 1 day 8h, 2 days 4h = 8h extra)
    return {
      9: { days12: 1, days8: 1, extraHours: 8 }, // Oct: 12 + 8 + 8 = 28 hrs
    };
  });

  // Save salary to localStorage
  const handleSaveSalary = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem(STORAGE_KEYS.SALARY, String(baseSalary));
    setIsSalarySaved(true);
    setTimeout(() => setIsSalarySaved(false), 2500);
  };

  // Save monthly OT matrix whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MONTHLY_DATA, JSON.stringify(monthlyOtData));
  }, [monthlyOtData]);

  // Current month's entry
  const currentMonthEntry: MonthlyOtEntry = monthlyOtData[selectedMonth] || {
    days12: 0,
    days8: 0,
    extraHours: 0,
  };

  const updateCurrentMonthEntry = (patch: Partial<MonthlyOtEntry>) => {
    setMonthlyOtData((prev) => ({
      ...prev,
      [selectedMonth]: {
        ...(prev[selectedMonth] || { days12: 0, days8: 0, extraHours: 0 }),
        ...patch,
      },
    }));
  };

  // Calculations:
  // Formula given by user: (เงินเดือน / 176) * 2 * ชั่วโมงทำงานทั้งหมด
  const hoursFrom12 = (currentMonthEntry.days12 || 0) * 12;
  const hoursFrom8 = (currentMonthEntry.days8 || 0) * 8;
  const hoursFromExtra = currentMonthEntry.extraHours || 0;

  const totalOtDays = (currentMonthEntry.days12 || 0) + (currentMonthEntry.days8 || 0);
  const totalOtHours = hoursFrom12 + hoursFrom8 + hoursFromExtra;

  // Hourly base = baseSalary / 176
  const baseHourlyRate = baseSalary > 0 ? baseSalary / 176 : 0;
  // Overtime rate per hour (2x multiplier) = (baseSalary / 176) * 2
  const otHourlyRate = baseHourlyRate * 2;

  // Total OT Earnings = (baseSalary / 176) * 2 * totalOtHours
  const totalOtEarnings = Math.round(otHourlyRate * totalOtHours);

  // Estimated gross monthly pay
  const estimatedGrossPay = baseSalary + totalOtEarnings;

  // Auto-sync from logged OT records on the calendar for this month
  const handleSyncFromCalendar = () => {
    const monthPrefix = `2026-${String(selectedMonth + 1).padStart(2, '0')}`;
    const filteredRecords = otRecords.filter((r) => r.dateStr.startsWith(monthPrefix));

    let days12Count = 0;
    let days8Count = 0;
    let extraHoursSum = 0;

    for (const r of filteredRecords) {
      if (r.hours === 12) {
        days12Count += 1;
      } else if (r.hours === 8) {
        days8Count += 1;
      } else {
        extraHoursSum += r.hours;
      }
    }

    updateCurrentMonthEntry({
      days12: days12Count,
      days8: days8Count,
      extraHours: extraHoursSum,
    });
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              คำนวณค่าล่วงเวลา (OT)
            </h2>
            <p className="text-xs text-rose-600 font-semibold mt-0.5">
              สูตรคำนวณ: (เงินเดือน / 176) × 2 × ชั่วโมงทำงาน
            </p>
          </div>
        </div>
      </div>

      {/* 2. Salary Input & Save Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>ระบุเงินเดือนประจำ (บันทึกได้)</span>
          </h3>

          {isSalarySaved && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              บันทึกเรียบร้อย
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBaseSalary(val);
                localStorage.setItem(STORAGE_KEYS.SALARY, String(val));
              }}
              placeholder="ระบุเงินเดือน เช่น 24000"
              className="w-full pl-3 pr-14 py-2.5 text-sm font-bold border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">
              บาท
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSalary()}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-medium text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>บันทึก</span>
          </button>
        </div>

        {/* Breakdown of (เงินเดือน / 176) and 2x rate */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-500 block text-[11px]">
              ฐานค่าจ้าง (เงินเดือน / 176):
            </span>
            <span className="font-bold text-slate-800 text-sm tabular-nums">
              ฿{baseHourlyRate.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-slate-400">/ชม.</span>
            </span>
          </div>

          <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl">
            <span className="text-rose-700 block text-[11px] font-medium">
              อัตรา OT (เงินเดือน / 176 × 2):
            </span>
            <span className="font-bold text-rose-700 text-sm tabular-nums">
              ฿{otHourlyRate.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-rose-500">/ชม.</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Monthly OT Entry & Shift Hours Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-4">
        {/* Month Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-slate-800">
              เลือกเดือนที่ต้องการคำนวณ
            </span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            {THAI_MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m} 2026
              </option>
            ))}
          </select>
        </div>

        {/* 2 Main Input Slots: 12 Hours & 8 Hours */}
        <div className="space-y-3 pt-1">
          {/* ช่องที่ 1: กะ 12 ชั่วโมง */}
          <div className="p-3.5 bg-gradient-to-r from-rose-50/50 to-orange-50/40 border border-rose-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900">
                    กะ 12 ชั่วโมง (ช่องที่ 1)
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    เข้ากะเต็มวัน / กะพิเศษแทนเพื่อน (วันละ 12 ชม.)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-rose-600 tabular-nums">
                  {hoursFrom12} ชม.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-600 font-medium">
                จำนวนวันที่ทำ:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentMonthEntry({
                      days12: Math.max(0, (currentMonthEntry.days12 || 0) - 1),
                    })
                  }
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={currentMonthEntry.days12 || 0}
                  onChange={(e) =>
                    updateCurrentMonthEntry({
                      days12: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-16 text-center py-1 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentMonthEntry({
                      days12: (currentMonthEntry.days12 || 0) + 1,
                    })
                  }
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  +
                </button>
                <span className="text-xs text-slate-500">วัน</span>
              </div>
            </div>
          </div>

          {/* ช่องที่ 2: กะ 8 ชั่วโมง */}
          <div className="p-3.5 bg-gradient-to-r from-sky-50/50 to-indigo-50/40 border border-sky-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900">
                    กะ 8 ชั่วโมง (ช่องที่ 2)
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    OT งานซ่อมบำรุง / กะพิเศษวันหยุดปกติ (วันละ 8 ชม.)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-sky-600 tabular-nums">
                  {hoursFrom8} ชม.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-600 font-medium">
                จำนวนวันที่ทำ:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentMonthEntry({
                      days8: Math.max(0, (currentMonthEntry.days8 || 0) - 1),
                    })
                  }
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={currentMonthEntry.days8 || 0}
                  onChange={(e) =>
                    updateCurrentMonthEntry({
                      days8: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-16 text-center py-1 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentMonthEntry({
                      days8: (currentMonthEntry.days8 || 0) + 1,
                    })
                  }
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  +
                </button>
                <span className="text-xs text-slate-500">วัน</span>
              </div>
            </div>
          </div>

          {/* ช่องเสริม: ชั่วโมง OT อื่นๆ เพิ่มเติม (เช่น OT ต่อกะ 4 ชม.) */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">
                ชั่วโมง OT อื่นๆ เพิ่มเติม (ถ้ามี)
              </span>
              <span className="text-[10px] text-slate-400">
                เช่น OT ต่อกะ 2 ชม. หรือ 4 ชม.
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={currentMonthEntry.extraHours || 0}
                onChange={(e) =>
                  updateCurrentMonthEntry({
                    extraHours: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-16 text-center py-1 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              />
              <span className="text-slate-500">ชม.</span>
            </div>
          </div>
        </div>

        {/* Sync & Reset Tools */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleSyncFromCalendar}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ดึงข้อมูลจากปฏิทินเดือนนี้</span>
          </button>

          <button
            type="button"
            onClick={() =>
              updateCurrentMonthEntry({ days12: 0, days8: 0, extraHours: 0 })
            }
            className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ล้างค่าเดือนนี้</span>
          </button>
        </div>
      </div>

      {/* 4. Total Hours & Calculation Formula Box */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>รวบรวมชั่วโมง OT เดือน {THAI_MONTHS[selectedMonth]}</span>
        </h3>

        {/* Grid summary of hours */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">รวมวันที่ทำ</span>
            <span className="text-lg font-extrabold text-slate-800 tabular-nums">
              {totalOtDays}
            </span>
            <span className="text-[10px] text-slate-400 block">วัน</span>
          </div>

          <div className="p-2.5 bg-rose-50/70 rounded-2xl border border-rose-100">
            <span className="text-[10px] text-rose-700 block font-medium">
              รวมชั่วโมง OT
            </span>
            <span className="text-lg font-extrabold text-rose-600 tabular-nums">
              {totalOtHours}
            </span>
            <span className="text-[10px] text-rose-400 block">ชั่วโมง</span>
          </div>

          <div className="p-2.5 bg-emerald-50/70 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-700 block font-medium">
              ยอดเงิน OT ทั้งหมด
            </span>
            <span className="text-lg font-extrabold text-emerald-600 tabular-nums">
              ฿{totalOtEarnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500 block">บาท</span>
          </div>
        </div>

        {/* Detailed Mathematical Formula Breakdown */}
        <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-1.5 text-xs">
          <span className="text-slate-400 text-[11px] block font-medium">
            แจกแจงตามสูตร: (เงินเดือน / 176) × 2 × ชั่วโมงทำงานทั้งหมด
          </span>
          <div className="font-mono text-emerald-300 text-[13px] bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            = (฿{baseSalary.toLocaleString()} / 176) × 2 × {totalOtHours} ชม.
            <div className="text-white text-sm font-bold mt-1">
              = ฿{otHourlyRate.toFixed(2)}/ชม. × {totalOtHours} ชม. = ฿{totalOtEarnings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Summary Total Monthly Compensation Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div>
            <span className="text-xs text-slate-300 block">
              สรุปรายได้รวมประจำเดือน {THAI_MONTHS[selectedMonth]}
            </span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              ฿{estimatedGrossPay.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="text-xs space-y-1.5 text-slate-300">
          <div className="flex justify-between">
            <span>ฐานเงินเดือนประจำ:</span>
            <span className="font-semibold text-white">
              ฿{baseSalary.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              ค่าล่วงเวลา OT ({totalOtHours} ชม. จาก {totalOtDays} วัน):
            </span>
            <span className="font-bold text-emerald-400">
              +฿{totalOtEarnings.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>กะ 12 ชม.: {currentMonthEntry.days12 || 0} วัน ({hoursFrom12} ชม.)</span>
            <span>กะ 8 ชม.: {currentMonthEntry.days8 || 0} วัน ({hoursFrom8} ชม.)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
