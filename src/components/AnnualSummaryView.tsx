import React from 'react';
import { TrendingUp, BarChart3, Download, RefreshCw, Award } from 'lucide-react';
import { ShiftGroup, OvertimeRecord, PlantConfig } from '../types/shift';
import { THAI_MONTHS, SHIFT_METADATA } from '../utils/shiftSchedule';

interface AnnualSummaryViewProps {
  selectedGroup: ShiftGroup;
  otRecords: OvertimeRecord[];
  plantConfig: PlantConfig;
  onResetData: () => void;
}

export const AnnualSummaryView: React.FC<AnnualSummaryViewProps> = ({
  selectedGroup,
  otRecords,
  plantConfig,
  onResetData,
}) => {
  const currentYear = 2026;
  const meta = SHIFT_METADATA[selectedGroup];

  const totalOtHours = otRecords.reduce((sum, r) => sum + r.hours, 0);
  const totalOtIncome = otRecords.reduce((sum, r) => sum + r.estimatedPay, 0);

  // 12 months simulated summary for a 4-shift 2-rotation team
  const monthlyData = THAI_MONTHS.map((monthName, idx) => {
    // Days in month 2024
    const daysInMonth = new Date(currentYear, idx + 1, 0).getDate();
    // 4-shift cycle: approx 15-16 work shifts, 14-15 off shifts
    const workShifts = idx % 2 === 0 ? 16 : 15;
    const offDays = daysInMonth - workShifts;
    const dayShifts = Math.round(workShifts / 2);
    const nightShifts = workShifts - dayShifts;

    const monthOtHours = otRecords
      .filter((r) => {
        const m = parseInt(r.dateStr.split('-')[1], 10) - 1;
        return m === idx;
      })
      .reduce((s, r) => s + r.hours, 0);

    return {
      month: monthName,
      workShifts,
      offDays,
      dayShifts,
      nightShifts,
      otHours: monthOtHours,
    };
  });

  const totalWorkInYear = monthlyData.reduce((s, m) => s + m.workShifts, 0);
  const totalOffInYear = monthlyData.reduce((s, m) => s + m.offDays, 0);
  const totalNightInYear = monthlyData.reduce((s, m) => s + m.nightShifts, 0);

  const handleExportText = () => {
    const text = `=== สรุปเวลาทำงาน ${meta.name} (${meta.role}) ประจำปี ${currentYear} ===
โรงงาน: ${plantConfig.name}
กะทำงานทั้งหมด: ${totalWorkInYear} วัน
วันหยุดสะสม: ${totalOffInYear} วัน
กะดึกสะสม: ${totalNightInYear} ผลัด
ชั่วโมง OT รวม: ${totalOtHours} ชั่วโมง
รายได้ OT โดยประมาณ: ฿${totalOtIncome.toLocaleString()} บาท
สร้างโดยแอป TigerShift`;

    navigator.clipboard.writeText(text);
    alert('คัดลอกสรุปสถิติประจำปีเรียบร้อยแล้ว!');
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              สถิติและสรุปผลรายปี {currentYear}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {meta.name} • {meta.role} (ระบบหมุนเวียน 4 กะ 2 ผลัด)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportText}
          className="text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>แชร์</span>
        </button>
      </div>

      {/* 4 Annual KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">
            รวมกะทำงานทั้งปี
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-rose-600 tabular-nums">
              {totalWorkInYear}
            </span>
            <span className="text-xs text-slate-400">วัน</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            เฉลี่ย 15.2 วัน/เดือน
          </p>
        </div>

        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">
            รวมวันหยุดพักผ่อน
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600 tabular-nums">
              {totalOffInYear}
            </span>
            <span className="text-xs text-slate-400">วัน</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            รวมวันหยุดสะสมประจำกะ
          </p>
        </div>

        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">
            ชั่วโมง OT สะสม
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600 tabular-nums">
              {totalOtHours}
            </span>
            <span className="text-xs text-slate-400">ชม.</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-1">
            รายได้ ~฿{totalOtIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">
            กะดึกตลอดทั้งปี
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800 tabular-nums">
              {totalNightInYear}
            </span>
            <span className="text-xs text-slate-400">ผลัด</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            รับค่ากะดึก ~฿{(totalNightInYear * plantConfig.nightAllowance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 12-Month Table */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-rose-500" />
            <span>ตารางแจกแจงรายเดือน ({currentYear})</span>
          </h3>
          <span className="text-xs text-slate-400">หน่วย: วัน</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="py-2">เดือน</th>
                <th className="py-2 text-center text-rose-600">กะเช้า</th>
                <th className="py-2 text-center text-emerald-600">กะดึก</th>
                <th className="py-2 text-center text-slate-600">วันหยุด</th>
                <th className="py-2 text-right text-emerald-700">OT (ชม.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monthlyData.map((row, i) => (
                <tr
                  key={row.month}
                  className={`hover:bg-slate-50 ${
                    i === 9 ? 'bg-rose-50/50 font-bold' : ''
                  }`}
                >
                  <td className="py-2 text-slate-800">
                    {row.month}
                    {i === 9 && (
                      <span className="ml-1 text-[10px] text-rose-600 font-semibold">
                        (ปัจจุบัน)
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-center tabular-nums font-medium text-slate-700">
                    {row.dayShifts}
                  </td>
                  <td className="py-2 text-center tabular-nums font-medium text-slate-700">
                    {row.nightShifts}
                  </td>
                  <td className="py-2 text-center tabular-nums font-medium text-slate-500">
                    {row.offDays}
                  </td>
                  <td className="py-2 text-right tabular-nums font-bold text-emerald-600">
                    {row.otHours > 0 ? `+${row.otHours}h` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset & Clean Storage Option */}
      <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between border border-slate-200/60">
        <div className="text-xs text-slate-500">
          <p className="font-semibold text-slate-700">รีเซ็ตข้อมูลตัวอย่างเริ่มต้น</p>
          <p className="text-[11px] text-slate-400">
            กู้คืนข้อมูลเหมือนในรูปภาพหน้าจอ
          </p>
        </div>
        <button
          type="button"
          onClick={onResetData}
          className="text-xs text-rose-600 font-semibold hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>รีเซ็ต</span>
        </button>
      </div>
    </div>
  );
};
