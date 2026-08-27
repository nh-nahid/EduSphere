export type FeeType = 'tuition' | 'exam' | 'transport' | 'other';
export interface Fee { _id: string; title: string; classId: { _id: string; name: string; section: string }; amount: number; dueDate: string; academicYear: string; type: FeeType; schoolId: string; }
export interface StudentFee extends Fee { paymentStatus: 'paid' | 'pending' | 'failed' | null; paymentId?: string; paidAt?: string; invoiceUrl?: string; }
export interface CreateFeePayload { title: string; classId: string; amount: number; dueDate: string; academicYear: string; type: FeeType; }
