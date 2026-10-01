import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckCircle, Clock } from 'lucide-react';
import { LeaveRecord } from '../types/shift';
import { formatThaiDate, parseYMD } from '../utils/shiftSchedule';

interface LeavePlannerViewProps {
  leaveRecords: LeaveRecord[];
  onAddLeave: (record: LeaveRecord) => void;
  onDeleteLeave: (id: string) => void;
}

export const LeavePlannerView: React.FC<LeavePlannerViewProps> = ({
  leaveRecords,
  onAddLeave,
  onDeleteLeave,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2024-10-15');
  const [leaveType, setLeaveType] = useState<LeaveRecord['leaveType']>('VACATION');
  const [hours, setHours] = useState(12);
  const [reason, setReason] = useState('');

  const quota = {
    vacationTotal: 10,
    vacationUsed: 3,
    businessTotal: 6,
    businessUsed: 1,
    sickTotal: 30,
    sickUsed: 2,
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const typeMap: Record<LeaveRecord['leaveType'], string> = {
      VACATION: 'ลาพักร้อนประจำปี',
      BUSINESS: 'ลากิจจำเป็น',
      SICK: 'ลาป่วยตามแพทย์สั่ง',
      COMPENSATORY: 'หยุดพักผ่อนชดเชย',
    };

    const newRecord: LeaveRecord = {
      id: `leave-${Date.now()}`,
      dateStr: leaveDate,
      leaveType,
      typeNameThai: typeMap[leaveType],
      hours,
      reason: reason || 'ธุระส่วนตัว',
    };

    onAddLeave(newRecord);
    setShowAddForm(false);
    setReason('');
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              บันทึกวันลาและวันหยุด
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              จัดการสิทธิ์วันลาพักร้อน ลากิจ ลาป่วย
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-2 rounded-full shadow-xs flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ขอลา</span>
        </button>
      </div>

      {/* Quota Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs text-center">
          <span className="text-[11px] text-slate-500 block">ลาพักร้อน</span>
          <span className="text-lg font-bold text-indigo-600">
            {quota.vacationTotal - quota.vacationUsed}
          </span>
          <span className="text-[10px] text-slate-400 block">
            เหลือจาก {quota.vacationTotal} วัน
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs text-center">
          <span className="text-[11px] text-slate-500 block">ลากิจ</span>
          <span className="text-lg font-bold text-emerald-600">
            {quota.businessTotal - quota.businessUsed}
          </span>
          <span className="text-[10px] text-slate-400 block">
            เหลือจาก {quota.businessTotal} วัน
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs text-center">
          <span className="text-[11px] text-slate-500 block">ลาป่วย</span>
          <span className="text-lg font-bold text-rose-600">
            {quota.sickTotal - quota.sickUsed}
          </span>
          <span className="text-[10px] text-slate-400 block">
            เหลือจาก {quota.sickTotal} วัน
          </span>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-4 shadow-sm border border-indigo-100 space-y-3 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-bold text-slate-800">
            ลงบันทึกการลาใหม่
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">ประเภทการลา</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="VACATION">ลาพักร้อน</option>
                <option value="BUSINESS">ลากิจ</option>
                <option value="SICK">ลาป่วย</option>
                <option value="COMPENSATORY">หยุดชดเชย</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">วันที่ลา</label>
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1">
              เหตุผลการลา
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ระบุเหตุผล เช่น ติดธุระครอบครัว, พักฟื้น"
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            >
              บันทึกวันลา
            </button>
          </div>
        </form>
      )}

      {/* Leave List */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">ประวัติการลาล่าสุด</h3>

        {leaveRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            ยังไม่มีประวัติการบันทึกวันลา
          </p>
        ) : (
          <div className="space-y-2">
            {leaveRecords.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {item.typeNameThai}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {item.hours} ชม.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatThaiDate(parseYMD(item.dateStr))} • {item.reason}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLeave(item.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
