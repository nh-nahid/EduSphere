export type ExamType = 'first_term' | 'second_term' | 'final' | 'unit_test';
export interface Grade { _id: string; studentId: { _id: string; userId: { name: string }; roll: string }; subjectId: { _id: string; name: string }; examType: ExamType; marks: number; totalMarks: number; grade: string; remarks?: string; schoolId: string; createdAt: string; }
export interface RecordGradePayload { studentId: string; subjectId: string; examType: ExamType; marks: number; totalMarks: number; grade: string; remarks?: string; }
