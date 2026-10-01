import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { PlantConfig } from '../types/shift';

interface PlantSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlantConfig;
  onSave: (config: PlantConfig) => void;
}

export const PlantSettingsModal: React.FC<PlantSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [name, setName] = useState(config.name);
  const [line, setLine] = useState(config.line);
  const [baseHourlyRate, setBaseHourlyRate] = useState(config.baseHourlyRate);
  const [nightAllowance, setNightAllowance] = useState(config.nightAllowance);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      name,
      line,
      baseHourlyRate: Number(baseHourlyRate),
      nightAllowance: Number(nightAllowance),
    });
    onClose();
  };

  const presetPlants = [
    { name: 'ศูนย์ผลิต EEC นิคมฯ ระยอง', line: 'กำลังเดินไลน์ 4: กะกลางวัน (07:00 - 19:00 น.)' },
    { name: 'นิคมอุตสาหกรรมมาบตาพุด', line: 'กำลังเดินไลน์ 2: โรงแยกก๊าซและปิโตรเคมี' },
    { name: 'นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี', line: 'กำลังเดินไลน์ 1: สายการผลิตยานยนต์ EV' },
    { name: 'นิคมอุตสาหกรรมแหลมฉบัง', line: 'กำลังเดินไลน์ 3: คลังสินค้าและบรรจุภัณฑ์' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">
              ตั้งค่าโรงงานและสายการผลิต
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              เลือกโรงงานยอดนิยม
            </label>
            <div className="space-y-1.5">
              {presetPlants.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setName(p.name);
                    setLine(p.line);
                  }}
                  className="w-full text-left p-2 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs font-medium text-slate-700 transition-colors"
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.line}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              ชื่อสถานที่ปฏิบัติงาน / โรงงาน
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              สถานะสายการผลิต
            </label>
            <input
              type="text"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                ค่าจ้างพื้นฐาน (บาท/ชม.)
              </label>
              <input
                type="number"
                value={baseHourlyRate}
                onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                เบี้ยเลี้ยงกะดึก (บาท/กะ)
              </label>
              <input
                type="number"
                value={nightAllowance}
                onChange={(e) => setNightAllowance(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-600"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-medium text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-rose-700"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
