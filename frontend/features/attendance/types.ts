export type AttendanceStatus = 'present' | 'absent' | 'late';
export interface AttendanceRecord { studentId: string; status: AttendanceStatus; }
export interface Attendance { _id: string; classId: string; date: string; records: Array<{ studentId: { _id: string; userId: { name: string }; roll: string }; status: AttendanceStatus }>; takenBy: string; schoolId: string; }
export interface MarkAttendancePayload { classId: string; date: string; records: AttendanceRecord[]; }
