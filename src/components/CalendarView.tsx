import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TableProperties,
  X,
} from 'lucide-react';
import { ShiftGroup, ShiftType, OvertimeRecord } from '../types/shift';
import {
  THAI_MONTHS,
  ENG_MONTHS,
  THAI_DAYS,
  getShiftForDate,
  formatDateToYMD,
} from '../utils/shiftSchedule';

interface CalendarViewProps {
  currentDate: Date;
  onNavigateMonth: (delta: number) => void;
  onResetToday: () => void;
  selectedGroup: ShiftGroup;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  otRecords: OvertimeRecord[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onNavigateMonth,
  onResetToday,
  selectedGroup,
  selectedDate,
  onSelectDate,
  otRecords,
}) => {
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const thaiMonthName = THAI_MONTHS[month];
  const engMonthName = ENG_MONTHS[month];

  // Map OT records by dateStr for fast lookup
  const otByDate = React.useMemo(() => {
    const map = new Map<string, OvertimeRecord>();
    for (const record of otRecords) {
      map.set(record.dateStr, record);
    }
    return map;
  }, [otRecords]);

  // Generate calendar grid (including leading & trailing days)
  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    // Days from previous month
    const daysFromPrevMonth = startDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
      dayNumber: number;
      shift: ShiftType;
      dateStr: string;
      ot?: OvertimeRecord;
    }[] = [];

    // Previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const dStr = formatDateToYMD(d);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: prevMonthLastDay - i,
        shift: getShiftForDate(d, selectedGroup),
        dateStr: dStr,
        ot: otByDate.get(dStr),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dStr = formatDateToYMD(d);
      days.push({
        date: d,
        isCurrentMonth: true,
        dayNumber: i,
        shift: getShiftForDate(d, selectedGroup),
        dateStr: dStr,
        ot: otByDate.get(dStr),
      });
    }

    // Trailing days from next month to complete the row (total modulo 7 == 0)
    const totalDays = days.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      const dStr = formatDateToYMD(d);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: i,
        shift: getShiftForDate(d, selectedGroup),
        dateStr: dStr,
        ot: otByDate.get(dStr),
      });
    }

    return days;
  }, [year, month, selectedGroup, otByDate]);

  const selectedDateStr = formatDateToYMD(selectedDate);

  // Month days for 4-shift comparison matrix
  const allMonthDates = React.useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: {
      day: number;
      date: Date;
      dateStr: string;
      weekday: string;
      shiftA: ShiftType;
      shiftB: ShiftType;
      shiftC: ShiftType;
      shiftD: ShiftType;
    }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      list.push({
        day: d,
        date,
        dateStr: formatDateToYMD(date),
        weekday: THAI_DAYS[date.getDay()],
        shiftA: getShiftForDate(date, 'A'),
        shiftB: getShiftForDate(date, 'B'),
        shiftC: getShiftForDate(date, 'C'),
        shiftD: getShiftForDate(date, 'D'),
      });
    }
    return list;
  }, [year, month]);

  const renderBadge = (shift: ShiftType) => {
    if (shift === 'DAY') {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8C1D2F] text-white">
          Day
        </span>
      );
    }
    if (shift === 'NIGHT') {
      return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0F6F54] text-white">
          Night
        </span>
      );
    }
    return (
      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
        Off
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 mt-3">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              {thaiMonthName} {year}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              {engMonthName} {year} • ปฏิทินปฏิบัติงาน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigateMonth(-1)}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onResetToday}
            type="button"
            className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
          >
            วันนี้
          </button>

          <button
            onClick={() => onNavigateMonth(1)}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="เดือนถัดไป"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowMatrixModal(true)}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
            title="ดูตารางเทียบ 4 กะ (A B C D)"
          >
            <TableProperties className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shift Legend Pills */}
      <div className="grid grid-cols-3 gap-1.5 my-3">
        {/* Day Shift */}
        <div className="bg-rose-50/90 border border-rose-100/80 rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span className="text-[11px] font-semibold text-rose-800">
              กะเช้า (Day)
            </span>
          </div>
          <span className="text-[10px] text-rose-500 truncate w-full">
            07:00-19:00
          </span>
        </div>

        {/* Night Shift */}
        <div className="bg-emerald-50/90 border border-emerald-100/80 rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] font-semibold text-emerald-800">
              กะดึก (Night)
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 truncate w-full">
            19:00-07:00
          </span>
        </div>

        {/* Off Day */}
        <div className="bg-slate-100/80 border border-slate-200/60 rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-[11px] font-semibold text-slate-700">
              วันหยุด (Off)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 truncate w-full">
            พักผ่อน / ชดเชย
          </span>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 text-center pb-2 pt-1 border-b border-slate-100">
        {THAI_DAYS.map((dayName, idx) => {
          const isSun = idx === 0;
          const isSat = idx === 6;
          return (
            <div
              key={dayName}
              className={`text-xs font-semibold ${
                isSun ? 'text-rose-600' : isSat ? 'text-sky-600' : 'text-slate-600'
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 gap-1 pt-2">
        {calendarDays.map((item, index) => {
          const isSelected = item.dateStr === selectedDateStr;
          const hasOt = !!item.ot;

          // Badges styling
          let shiftBadge = null;
          if (item.isCurrentMonth) {
            if (item.shift === 'DAY') {
              shiftBadge = (
                <span className="w-full py-0.5 px-1 rounded-md bg-[#8C1D2F] text-white text-[10px] font-medium leading-none text-center shadow-xs">
                  เช้า
                </span>
              );
            } else if (item.shift === 'NIGHT') {
              shiftBadge = (
                <span className="w-full py-0.5 px-1 rounded-md bg-[#0F6F54] text-white text-[10px] font-medium leading-none text-center shadow-xs">
                  ดึก
                </span>
              );
            } else {
              shiftBadge = (
                <span className="w-full py-0.5 px-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-normal leading-none text-center">
                  OFF
                </span>
              );
            }
          }

          return (
            <button
              key={`${item.dateStr}-${index}`}
              onClick={() => onSelectDate(item.date)}
              type="button"
              className={`flex flex-col items-center justify-between p-1 min-h-[58px] rounded-xl transition-all relative ${
                item.isCurrentMonth
                  ? isSelected
                    ? 'ring-2 ring-rose-500 bg-rose-50/50 shadow-xs'
                    : 'hover:bg-slate-50'
                  : 'opacity-35 pointer-events-none'
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-center gap-0.5">
                <span
                  className={`text-xs font-medium ${
                    isSelected
                      ? 'text-rose-600 font-bold'
                      : item.isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {item.dayNumber}
                </span>
                {hasOt && item.isCurrentMonth && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                )}
              </div>

              {/* Shift Pill */}
              <div className="w-full flex items-center justify-center my-0.5">
                {shiftBadge}
              </div>

              {/* OT Badge */}
              <div className="w-full min-h-[14px] flex items-center justify-center">
                {hasOt && item.isCurrentMonth ? (
                  <span
                    className={`w-full text-[9px] px-0.5 py-0.2 rounded font-medium text-center truncate ${
                      item.ot!.hours >= 12
                        ? 'bg-rose-100 text-rose-700 font-semibold'
                        : item.ot!.hours >= 8
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    +{item.ot!.hours}h ...
                  </span>
                ) : (
                  <span className="text-[9px] text-transparent select-none">-</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4-Shift Comparison Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <TableProperties className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                    ตารางหมุนเวียนเปรียบเทียบ 4 กะ
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {thaiMonthName} {year} (ระบบ 4 กะ 2 ผลัด)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-white shadow-xs">
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 px-1 text-center">วันที่</th>
                    <th className="py-2 px-1 text-center">วัน</th>
                    <th className="py-2 px-1 text-center text-rose-700">กะ A</th>
                    <th className="py-2 px-1 text-center text-indigo-700">กะ B</th>
                    <th className="py-2 px-1 text-center text-emerald-700">กะ C</th>
                    <th className="py-2 px-1 text-center text-amber-700">กะ D</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allMonthDates.map((row) => {
                    const isSelected = row.dateStr === selectedDateStr;
                    return (
                      <tr
                        key={row.day}
                        onClick={() => {
                          onSelectDate(row.date);
                          setShowMatrixModal(false);
                        }}
                        className={`hover:bg-rose-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-rose-50 font-bold' : ''
                        }`}
                      >
                        <td className="py-1.5 px-1 text-center font-bold text-slate-800">
                          {row.day}
                        </td>
                        <td className="py-1.5 px-1 text-center text-slate-500 text-[11px]">
                          {row.weekday}
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          {renderBadge(row.shiftA)}
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          {renderBadge(row.shiftB)}
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          {renderBadge(row.shiftC)}
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          {renderBadge(row.shiftD)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
