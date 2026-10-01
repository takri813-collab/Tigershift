import React from 'react';
import { PlusCircle, Plus } from 'lucide-react';

interface ActionBarProps {
  onAddOvertime: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onAddOvertime }) => {
  return (
    <div className="w-full mt-3 bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white rounded-3xl p-3.5 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <PlusCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm md:text-base leading-snug">
            บันทึก OT / สลับกะวันนี้
          </h3>
          <p className="text-[11px] text-white/80 leading-tight">
            อัตราเรทชดเชย 1.5x / 3.0x ตาม พ.ร....
          </p>
        </div>
      </div>

      <button
        onClick={onAddOvertime}
        type="button"
        className="bg-white text-rose-700 hover:bg-rose-50 active:scale-95 font-semibold text-xs md:text-sm px-3.5 py-2 rounded-full shadow-sm flex items-center gap-1 transition-all shrink-0"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>เพิ่มยอด</span>
      </button>
    </div>
  );
};
