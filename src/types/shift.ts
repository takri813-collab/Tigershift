export type ShiftGroup = 'A' | 'B' | 'C' | 'D';

export type ShiftType = 'DAY' | 'NIGHT' | 'OFF';

export interface ShiftInfo {
  type: ShiftType;
  label: string;
  subLabel: string;
  badgeText: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  hoursText: string;
}

export interface OvertimeRecord {
  id: string;
  dateStr: string; // YYYY-MM-DD
  hours: number;
  rate: number; // 1.5, 2.0, 3.0
  typeName: string;
  rateDescription: string;
  estimatedPay: number;
  note?: string;
  isCoveringColleague?: boolean;
}

export interface LeaveRecord {
  id: string;
  dateStr: string;
  leaveType: 'VACATION' | 'BUSINESS' | 'SICK' | 'COMPENSATORY';
  typeNameThai: string;
  hours: number;
  reason: string;
}

export interface PlantConfig {
  name: string;
  line: string;
  currentRunningShift: string;
  baseHourlyRate: number; // Default ~100-150 THB
  nightAllowance: number; // e.g. 150 THB/shift
  mealAllowance: number;  // e.g. 60 THB/day
  diligenceBonus: number; // e.g. 1,000 THB/month
}
