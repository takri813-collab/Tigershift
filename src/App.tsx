/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ShiftSelector } from './components/ShiftSelector';
import { CalendarView } from './components/CalendarView';
import { ActionBar } from './components/ActionBar';
import { SelectedDayCard } from './components/SelectedDayCard';
import { StatsGrid } from './components/StatsGrid';
import { PlantBanner } from './components/PlantBanner';
import { BottomNav, NavTab } from './components/BottomNav';
import { OTModal } from './components/OTModal';
import { OTCalculatorView } from './components/OTCalculatorView';
import { LeavePlannerView } from './components/LeavePlannerView';
import { AnnualSummaryView } from './components/AnnualSummaryView';
import { PlantSettingsModal } from './components/PlantSettingsModal';

import {
  ShiftGroup,
  OvertimeRecord,
  LeaveRecord,
  PlantConfig,
} from './types/shift';
import {
  INITIAL_OT_RECORDS,
  INITIAL_LEAVE_RECORDS,
  INITIAL_PLANT_CONFIG,
  STORAGE_KEYS,
  getShiftForDate,
  formatDateToYMD,
} from './utils/shiftSchedule';

export default function App() {
  // Active shift group (A, B, C, D)
  const [selectedGroup, setSelectedGroup] = useState<ShiftGroup>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIFT_GROUP);
    return (saved as ShiftGroup) || 'A';
  });

  // Calendar navigated month (default to October 2026)
  const [currentDate, setCurrentDate] = useState<Date>(
    () => new Date(2026, 9, 14)
  );

  // Selected date on the calendar (default 14 Oct 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 9, 14)
  );

  // Overtime entries
  const [otRecords, setOtRecords] = useState<OvertimeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OT_RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_OT_RECORDS;
    } catch {
      return INITIAL_OT_RECORDS;
    }
  });

  // Leave entries
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVE_RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_RECORDS;
    } catch {
      return INITIAL_LEAVE_RECORDS;
    }
  });

  // Plant and company configuration
  const [plantConfig, setPlantConfig] = useState<PlantConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANT_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_PLANT_CONFIG;
    } catch {
      return INITIAL_PLANT_CONFIG;
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('schedule');

  // Modals
  const [isOtModalOpen, setIsOtModalOpen] = useState(false);
  const [editingOtRecord, setEditingOtRecord] = useState<OvertimeRecord | undefined>(undefined);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFT_GROUP, selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OT_RECORDS, JSON.stringify(otRecords));
  }, [otRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVE_RECORDS, JSON.stringify(leaveRecords));
  }, [leaveRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANT_CONFIG, JSON.stringify(plantConfig));
  }, [plantConfig]);

  // Calendar month navigation
  const handleNavigateMonth = (delta: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      return next;
    });
  };

  const handleResetToday = () => {
    const today = new Date(2026, 9, 14); // Keep October 2026 base
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Selected date's shift and OT
  const selectedShift = useMemo(() => {
    return getShiftForDate(selectedDate, selectedGroup);
  }, [selectedDate, selectedGroup]);

  const selectedDateStr = useMemo(() => {
    return formatDateToYMD(selectedDate);
  }, [selectedDate]);

  const selectedOtRecord = useMemo(() => {
    return otRecords.find((r) => r.dateStr === selectedDateStr);
  }, [otRecords, selectedDateStr]);

  // Compute stats for current displayed month
  const { totalWorkDays, totalOffDays, totalOtHours, estimatedOtEarnings } =
    useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let work = 0;
      let off = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const shift = getShiftForDate(d, selectedGroup);
        if (shift === 'DAY' || shift === 'NIGHT') {
          work++;
        } else {
          off++;
        }
      }

      // Filter OT records in this month
      const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthOtRecords = otRecords.filter((r) =>
        r.dateStr.startsWith(currentMonthPrefix)
      );

      const otHours = monthOtRecords.reduce((sum, r) => sum + r.hours, 0);
      const otEarnings = monthOtRecords.reduce(
        (sum, r) => sum + r.estimatedPay,
        0
      );

      return {
        totalWorkDays: work,
        totalOffDays: off,
        totalOtHours: otHours,
        estimatedOtEarnings: otEarnings,
      };
    }, [currentDate, selectedGroup, otRecords]);

  // OT handlers
  const handleOpenAddOt = () => {
    setEditingOtRecord(selectedOtRecord);
    setIsOtModalOpen(true);
  };

  const handleSaveOt = (record: OvertimeRecord) => {
    setOtRecords((prev) => {
      const filtered = prev.filter((r) => r.dateStr !== record.dateStr);
      return [...filtered, record];
    });
  };

  const handleDeleteOt = (id: string) => {
    setOtRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Leave handlers
  const handleAddLeave = (record: LeaveRecord) => {
    setLeaveRecords((prev) => [record, ...prev]);
  };

  const handleDeleteLeave = (id: string) => {
    setLeaveRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Reset demo data
  const handleResetData = () => {
    setSelectedGroup('A');
    setCurrentDate(new Date(2026, 9, 14));
    setSelectedDate(new Date(2026, 9, 14));
    setOtRecords(INITIAL_OT_RECORDS);
    setLeaveRecords(INITIAL_LEAVE_RECORDS);
    setPlantConfig(INITIAL_PLANT_CONFIG);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 pb-20 font-['Prompt',sans-serif]">
      {/* Mobile/Desktop responsive container */}
      <div className="w-full max-w-md mx-auto px-3 pt-2">
        {/* Top Header */}
        <Header onLogoClick={() => setIsPlantModalOpen(true)} />

        {/* Tab 1: ตารางกะ (Main Schedule Screen as in screenshot) */}
        {activeTab === 'schedule' && (
          <main className="space-y-1">
            {/* Shift Group Selector */}
            <ShiftSelector
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
            />

            {/* Interactive Calendar Matrix */}
            <CalendarView
              currentDate={currentDate}
              onNavigateMonth={handleNavigateMonth}
              onResetToday={handleResetToday}
              selectedGroup={selectedGroup}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              otRecords={otRecords}
            />

            {/* Red Action Bar (บันทึก OT / สลับกะวันนี้) */}
            <ActionBar onAddOvertime={handleOpenAddOt} />

            {/* Selected Date Card (14 ตุลาคม 2024) */}
            <SelectedDayCard
              selectedDate={selectedDate}
              shiftType={selectedShift}
              otRecord={selectedOtRecord}
              onEditOt={handleOpenAddOt}
              onDeleteOt={handleDeleteOt}
              onAddOt={handleOpenAddOt}
            />

            {/* 4 Metric Cards Grid */}
            <StatsGrid
              totalWorkDays={totalWorkDays}
              totalOffDays={totalOffDays}
              totalOtHours={totalOtHours}
              estimatedOtEarnings={estimatedOtEarnings}
            />

            {/* Industrial Plant / Facility Banner */}
            <PlantBanner
              config={plantConfig}
              onOpenSettings={() => setIsPlantModalOpen(true)}
            />
          </main>
        )}

        {/* Tab 2: คำนวณ OT */}
        {activeTab === 'ot_calc' && (
          <OTCalculatorView
            otRecords={otRecords}
            plantConfig={plantConfig}
            onUpdatePlantConfig={setPlantConfig}
          />
        )}

        {/* Tab 3: บันทึกวันลา */}
        {activeTab === 'leave' && (
          <LeavePlannerView
            leaveRecords={leaveRecords}
            onAddLeave={handleAddLeave}
            onDeleteLeave={handleDeleteLeave}
          />
        )}

        {/* Tab 4: สรุปรายปี */}
        {activeTab === 'yearly' && (
          <AnnualSummaryView
            selectedGroup={selectedGroup}
            otRecords={otRecords}
            plantConfig={plantConfig}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Overtime Form Modal */}
      <OTModal
        isOpen={isOtModalOpen}
        onClose={() => setIsOtModalOpen(false)}
        onSave={handleSaveOt}
        selectedDate={selectedDate}
        existingRecord={editingOtRecord}
        plantConfig={plantConfig}
      />

      {/* Plant Settings Modal */}
      <PlantSettingsModal
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
        config={plantConfig}
        onSave={setPlantConfig}
      />
    </div>
  );
}
