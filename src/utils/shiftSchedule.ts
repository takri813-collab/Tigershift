import { ShiftGroup, ShiftType, OvertimeRecord, LeaveRecord, PlantConfig } from '../types/shift';

// Exact 28-day continental shift rotation cycles matching the user's specification:
// Starting at October 2 (index 0) to October 29 (index 27)

export const CYCLE_A: ShiftType[] = [
  'DAY', 'DAY', 'DAY',       // 2, 3, 4
  'OFF', 'OFF',              // 5, 6
  'NIGHT', 'NIGHT',          // 7, 8
  'OFF', 'OFF', 'OFF',       // 9, 10, 11
  'DAY', 'DAY',              // 12, 13
  'OFF', 'OFF',              // 14, 15
  'NIGHT', 'NIGHT', 'NIGHT', // 16, 17, 18
  'OFF', 'OFF',              // 19, 20
  'DAY', 'DAY',              // 21, 22
  'OFF', 'OFF', 'OFF',       // 23, 24, 25
  'NIGHT', 'NIGHT',          // 26, 27
  'OFF', 'OFF',              // 28, 29
];

export const CYCLE_B: ShiftType[] = [
  'NIGHT', 'NIGHT', 'NIGHT', // 2, 3, 4
  'OFF', 'OFF',              // 5, 6
  'DAY', 'DAY',              // 7, 8
  'OFF', 'OFF', 'OFF',       // 9, 10, 11
  'NIGHT', 'NIGHT',          // 12, 13
  'OFF', 'OFF',              // 14, 15
  'DAY', 'DAY', 'DAY',       // 16, 17, 18
  'OFF', 'OFF',              // 19, 20
  'NIGHT', 'NIGHT',          // 21, 22
  'OFF', 'OFF', 'OFF',       // 23, 24, 25
  'DAY', 'DAY',              // 26, 27
  'OFF', 'OFF',              // 28, 29
];

export const CYCLE_C: ShiftType[] = [
  'OFF', 'OFF', 'OFF',       // 2, 3, 4
  'NIGHT', 'NIGHT',          // 5, 6
  'OFF', 'OFF',              // 7, 8
  'DAY', 'DAY', 'DAY',       // 9, 10, 11
  'OFF', 'OFF',              // 12, 13
  'NIGHT', 'NIGHT',          // 14, 15
  'OFF', 'OFF', 'OFF',       // 16, 17, 18
  'DAY', 'DAY',              // 19, 20
  'OFF', 'OFF',              // 21, 22
  'NIGHT', 'NIGHT', 'NIGHT', // 23, 24, 25
  'OFF', 'OFF',              // 26, 27
  'DAY', 'DAY',              // 28, 29
];

export const CYCLE_D: ShiftType[] = [
  'OFF', 'OFF', 'OFF',       // 2, 3, 4
  'DAY', 'DAY',              // 5, 6
  'OFF', 'OFF',              // 7, 8
  'NIGHT', 'NIGHT', 'NIGHT', // 9, 10, 11
  'OFF', 'OFF',              // 12, 13
  'DAY', 'DAY',              // 14, 15
  'OFF', 'OFF', 'OFF',       // 16, 17, 18
  'NIGHT', 'NIGHT',          // 19, 20
  'OFF', 'OFF',              // 21, 22
  'DAY', 'DAY', 'DAY',       // 23, 24, 25
  'OFF', 'OFF',              // 26, 27
  'NIGHT', 'NIGHT',          // 28, 29
];

export const SHIFT_CYCLES: Record<ShiftGroup, ShiftType[]> = {
  A: CYCLE_A,
  B: CYCLE_B,
  C: CYCLE_C,
  D: CYCLE_D,
};

// Anchor date: October 2, 2026 corresponds to index 0 of the 28-day cycle
const ANCHOR_DATE = new Date(2026, 9, 2);

export const SHIFT_METADATA: Record<ShiftGroup, { name: string; role: string }> = {
  A: { name: 'กะ A', role: '' },
  B: { name: 'กะ B', role: '' },
  C: { name: 'กะ C', role: '' },
  D: { name: 'กะ D', role: '' },
};

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export const ENG_MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export const THAI_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export function getShiftForDate(date: Date, group: ShiftGroup): ShiftType {
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d0 = new Date(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate());
  const diffTime = d1.getTime() - d0.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  const cycleIndex = (((diffDays % 28) + 28) % 28);
  return SHIFT_CYCLES[group][cycleIndex];
}

export function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatThaiDate(date: Date): string {
  const d = date.getDate();
  const m = THAI_MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export const INITIAL_PLANT_CONFIG: PlantConfig = {
  name: 'ศูนย์ผลิต EEC นิคมฯ ระยอง',
  line: 'กำลังเดินไลน์ 4: กะกลางวัน (07:00 - 19:00 น.)',
  currentRunningShift: 'กะกลางวัน (07:00 - 19:00 น.)',
  baseHourlyRate: 100, // 8h or 12h base
  nightAllowance: 150,
  mealAllowance: 60,
  diligenceBonus: 1000,
};

export const INITIAL_OT_RECORDS: OvertimeRecord[] = [
  {
    id: 'ot-10',
    dateStr: '2026-10-10',
    hours: 8,
    rate: 1.5,
    typeName: 'OT ปิดซ่อมบำรุงเครื่องจักร',
    rateDescription: '1.5x (ตาม พ.ร.บ. คุ้มครองแรงงาน)',
    estimatedPay: 1200,
    note: 'บำรุงรักษาเชิงป้องกันไลน์ประกอบ',
  },
  {
    id: 'ot-14',
    dateStr: '2026-10-14',
    hours: 12,
    rate: 1.5,
    typeName: 'เข้ากะพิเศษแทนเพื่อนร่วมงาน (อัตรา 1.5 เท่า)',
    rateDescription: '1.5x - 3.0x (ตามข้อกำหนด OT)',
    estimatedPay: 1800,
    note: 'สลับเข้ากะแทนเพื่อนร่วมงานในวันหยุดประจำสัปดาห์',
    isCoveringColleague: true,
  },
  {
    id: 'ot-24',
    dateStr: '2026-10-24',
    hours: 4,
    rate: 1.5,
    typeName: 'OT ต่อกะเคลียร์ยอดผลิตตามเป้า',
    rateDescription: '1.5x (กะพิเศษล่วงเวลา)',
    estimatedPay: 740,
    note: 'เคลียร์ชิ้นงานก่อนส่งมอบรอบปลายเดือน',
  },
  {
    id: 'ot-28',
    dateStr: '2026-10-28',
    hours: 4,
    rate: 1.5,
    typeName: 'OT เตรียมไลน์และตรวจเช็คคุณภาพ QA',
    rateDescription: '1.5x (ล่วงเวลาก่อนเริ่มรอบ)',
    estimatedPay: 740,
    note: 'ทดสอบไลน์ผลิตล็อตใหม่',
  },
];

export const INITIAL_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'leave-1',
    dateStr: '2026-10-05',
    leaveType: 'COMPENSATORY',
    typeNameThai: 'พักผ่อนสะสมประจำสัปดาห์',
    hours: 12,
    reason: 'วันหยุดตามตารางกะ',
  },
];

export const STORAGE_KEYS = {
  SHIFT_GROUP: 'tigershift_group_v3',
  OT_RECORDS: 'tigershift_ot_records_v3',
  LEAVE_RECORDS: 'tigershift_leave_records_v3',
  PLANT_CONFIG: 'tigershift_plant_config_v3',
};
