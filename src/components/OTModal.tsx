import React, { useState, useEffect } from 'react';
import { X, Clock, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { OvertimeRecord, PlantConfig } from '../types/shift';
import { formatDateToYMD, formatThaiDate, parseYMD } from '../utils/shiftSchedule';

interface OTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: OvertimeRecord) => void;
  selectedDate: Date;
  existingRecord?: OvertimeRecord;
  plantConfig: PlantConfig;
}

export const OTModal: React.FC<OTModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  existingRecord,
  plantConfig,
}) => {
  const [dateStr, setDateStr] = useState(formatDateToYMD(selectedDate));
  const [hours, setHours] = useState<number>(existingRecord ? existingRecord.hours : 8);
  const [rate, setRate] = useState<number>(existingRecord ? existingRecord.rate : 1.5);
  const [typeName, setTypeName] = useState<string>(
    existingRecord
      ? existingRecord.typeName
      : 'เข้ากะพิเศษแทนเพื่อนร่วมงาน (อัตรา 1.5 เท่า)'
  );
  const [rateDesc, setRateDesc] = useState<string>(
    existingRecord
      ? existingRecord.rateDescription
      : '1.5x - 3.0x (ตามข้อกำหนด OT)'
  );
  const [note, setNote] = useState<string>(existingRecord?.note || '');

  useEffect(() => {
    if (existingRecord) {
      setDateStr(existingRecord.dateStr);
      setHours(existingRecord.hours);
      setRate(existingRecord.rate);
      setTypeName(existingRecord.typeName);
      setRateDesc(existingRecord.rateDescription);
      setNote(existingRecord.note || '');
    } else {
      setDateStr(formatDateToYMD(selectedDate));
      setHours(12);
      setRate(1.5);
      setTypeName('เข้ากะพิเศษแทนเพื่อนร่วมงาน (อัตรา 1.5 เท่า)');
      setRateDesc('1.5x - 3.0x (ตามข้อกำหนด OT)');
      setNote('');
    }
  }, [existingRecord, selectedDate, isOpen]);

  if (!isOpen) return null;

  // Calculate estimated earnings
  // Base hourly rate * hours * rate
  const estimatedPay = Math.round(hours * plantConfig.baseHourlyRate * rate);

  const presets = [
    {
      label: 'กะพิเศษแทนเพื่อน (1.5x)',
      hours: 12,
      rate: 1.5,
      name: 'เข้ากะพิเศษแทนเพื่อนร่วมงาน (อัตรา 1.5 เท่า)',
      desc: '1.5x - 3.0x (ตามข้อกำหนด OT)',
    },
    {
      label: 'OT ต่อกะ 4 ชม. (1.5x)',
      hours: 4,
      rate: 1.5,
      name: 'OT ต่อกะเคลียร์ยอดผลิตตามเป้า',
      desc: '1.5x (กะพิเศษล่วงเวลา)',
    },
    {
      label: 'OT ปิดซ่อมเครื่อง 8 ชม. (1.5x)',
      hours: 8,
      rate: 1.5,
      name: 'OT ปิดซ่อมบำรุงเครื่องจักร',
      desc: '1.5x (ตาม พ.ร.บ. คุ้มครองแรงงาน)',
    },
    {
      label: 'OT นักขัตฤกษ์ 8 ชม. (3.0x)',
      hours: 8,
      rate: 3.0,
      name: 'OT ปฏิบัติงานวันหยุดนักขัตฤกษ์',
      desc: '3.0x (อัตราวันหยุดตามกฎหมาย)',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setHours(p.hours);
    setRate(p.rate);
    setTypeName(p.name);
    setRateDesc(p.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: OvertimeRecord = {
      id: existingRecord ? existingRecord.id : `ot-${Date.now()}`,
      dateStr,
      hours: Number(hours),
      rate: Number(rate),
      typeName,
      rateDescription: rateDesc,
      estimatedPay,
      note,
      isCoveringColleague: typeName.includes('แทนเพื่อน'),
    };
    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {existingRecord ? 'แก้ไขบันทึก OT / สลับกะ' : 'บันทึก OT / สลับกะทำงาน'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              วันที่ {formatThaiDate(parseYMD(dateStr))}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              เลือกแบบรวดเร็ว (Presets)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-left p-2 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-rose-50/60 hover:border-rose-300 transition-colors text-xs font-medium text-slate-700"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              วันที่ทำ OT
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Hours Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">
                จำนวนชั่วโมง OT
              </label>
              <span className="text-xs font-bold text-rose-600">
                {hours} ชั่วโมง
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              {[2, 4, 6, 8, 12].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    hours === h
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  +{h}h
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* OT Type & Multiplier */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              ประเภทงานเสริม
            </label>
            <input
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="เช่น เข้ากะพิเศษแทนเพื่อนร่วมงาน (อัตรา 1.5 เท่า)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Multiplier / Rate */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                อัตราเรท OT
              </label>
              <select
                value={rate}
                onChange={(e) => {
                  const r = parseFloat(e.target.value);
                  setRate(r);
                  if (r === 1.5) setRateDesc('1.5x - 3.0x (ตามข้อกำหนด OT)');
                  if (r === 2.0) setRateDesc('2.0x (ทำงานวันหยุดปกติ)');
                  if (r === 3.0) setRateDesc('3.0x (OT วันหยุดนักขัตฤกษ์)');
                  if (r === 1.0) setRateDesc('1.0x (สลับกะชดเชย)');
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
              >
                <option value={1.5}>1.5 เท่า (OT ปกติ / ต่อกะ)</option>
                <option value={2.0}>2.0 เท่า (ทำงานในวันหยุด)</option>
                <option value={3.0}>3.0 เท่า (OT วันหยุดนักขัตฯ)</option>
                <option value={1.0}>1.0 เท่า (สลับกะชดเชย)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                คำอธิบายฐานคิด
              </label>
              <input
                type="text"
                value={rateDesc}
                onChange={(e) => setRateDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-rose-600 font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              บันทึกช่วยจำ (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น รหัสเพื่อนร่วมงาน, ไลน์ที่ 4, งานเร่งด่วน"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Estimated Earnings Box */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">
                  ประมาณการรายได้ OT สุทธิ
                </span>
                <span className="text-[11px] text-emerald-600">
                  {hours} ชม. × ฿{plantConfig.baseHourlyRate}/ชม. × {rate}x
                </span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-700">
              ~฿{estimatedPay.toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
