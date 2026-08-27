export type SmsEvent = 'absence' | 'fee_due' | 'fee_paid' | 'grade' | 'notice' | 'admission';
export interface SmsLog { _id: string; recipient: string; message: string; event: SmsEvent; status: 'sent' | 'failed'; studentId?: { _id: string; userId: { name: string } }; schoolId: string; sentAt: string; }
