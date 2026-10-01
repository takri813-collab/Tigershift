import React from 'react';
import { Calendar, Edit3, Trash2, Plus } from 'lucide-react';
import { ShiftType, OvertimeRecord } from '../types/shift';
import { formatThaiDate } from '../utils/shiftSchedule';

interface SelectedDayCardProps {
  selectedDate: Date;
  shiftType: ShiftType;
  otRecord?: OvertimeRecord;
  onEditOt: () => void;
  onDeleteOt: (id: string) => void;
  onAddOt: () => void;
}

export const SelectedDayCard: React.FC<SelectedDayCardProps> = ({
  selectedDate,
  shiftType,
  otRecord,
  onEditOt,
  onDeleteOt,
  onAddOt,
}) => {
  const formattedDate = formatThaiDate(selectedDate);

  // Shift status text
  let statusText = 'สถานะ: พักผ่อนสะสมประจำสัปดาห์';
  let badgeText = 'วันหยุด (Off)';
  let badgeBg = 'bg-slate-100 text-slate-700';

  if (shiftType === 'DAY') {
    statusText = 'สถานะ: ปฏิบัติงานกะกลางวันสายการผลิตหลัก';
    badgeText = 'กะเช้า (Day)';
    badgeBg = 'bg-rose-100 text-rose-800';
  } else if (shiftType === 'NIGHT') {
    statusText = 'สถานะ: ปฏิบัติงานกะดึกเดินเครื่องต่อเนื่อง';
    badgeText = 'กะดึก (Night)';
    badgeBg = 'bg-emerald-100 text-emerald-800';
  }

  return (
    <div className="w-full mt-3 bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
      {/* Top Details Section */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100/60">
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                {formattedDate}
              </h3>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeBg}`}
              >
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              {statusText}
            </p>
          </div>
        </div>

        {/* Right side OT numbers if exists */}
        {otRecord ? (
          <div className="text-right shrink-0">
            <div className="text-rose-600 font-bold text-sm md:text-base leading-tight">
              +{otRecord.hours}h OT
            </div>
            <div className="text-emerald-600 text-xs md:text-sm font-semibold mt-0.5">
              รับสุทธิ ~฿{otRecord.estimatedPay.toLocaleString()}
            </div>
          </div>
        ) : (
          <button
            onClick={onAddOt}
            type="button"
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium px-2.5 py-1.5 rounded-full transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ใส่ OT</span>
          </button>
        )}
      </div>

      {/* Two columns breakdown */}
      {otRecord ? (
        <div className="pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">
                ประเภทงานเสริม (Extra Work)
              </span>
              <p className="text-xs md:text-[13px] font-semibold text-slate-800 mt-1 leading-snug">
                {otRecord.typeName}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-normal">
                ฐานคำนวณเบี้ย OT
              </span>
              <p className="text-xs md:text-[13px] font-semibold text-rose-600 mt-1 leading-snug">
                {otRecord.rateDescription || `${otRecord.rate}x (ตามข้อกำหนด OT)`}
              </p>
            </div>
          </div>

          {otRecord.note && (
            <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
              <span>บันทึกช่วยจำ: {otRecord.note}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onEditOt}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="แก้ไขรายการนี้"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteOt(otRecord.id)}
                  className="text-rose-400 hover:text-rose-600 p-1"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>ยังไม่มีการลงเวลา OT หรือสลับกะในวันนี้</span>
          <button
            onClick={onAddOt}
            className="text-rose-600 font-semibold hover:underline"
          >
            + บันทึกเวลางานเสริม
          </button>
        </div>
      )}
    </div>
  );
};
