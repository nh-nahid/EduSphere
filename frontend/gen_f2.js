const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';
const write = (file, content) => {
  const p = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
};

const files = {
  'features/grades/types.ts': `export type ExamType = 'first_term' | 'second_term' | 'final' | 'unit_test';
export interface Grade { _id: string; studentId: { _id: string; userId: { name: string }; roll: string }; subjectId: { _id: string; name: string }; examType: ExamType; marks: number; totalMarks: number; grade: string; remarks?: string; schoolId: string; createdAt: string; }
export interface RecordGradePayload { studentId: string; subjectId: string; examType: ExamType; marks: number; totalMarks: number; grade: string; remarks?: string; }`,
  'features/grades/api.ts': `import api from '@/lib/axios';
import { Grade, RecordGradePayload } from './types';
export const gradesApi = {
  getAll: (params?: any) => api.get<{ data: Grade[] }>('/grades', { params }).then(r => r.data.data),
  getStudentGrades: (studentId: string) => api.get<{ data: Grade[] }>(\`/grades/student/\${studentId}\`).then(r => r.data.data),
  record: (payload: RecordGradePayload) => api.post<{ data: Grade }>('/grades', payload).then(r => r.data.data),
};`,
  'features/grades/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradesApi } from './api';
export const useGrades = (params?: any) => useQuery({ queryKey: ['grades', params], queryFn: () => gradesApi.getAll(params) });
export const useStudentGrades = (studentId: string) => useQuery({ queryKey: ['grades', 'student', studentId], queryFn: () => gradesApi.getStudentGrades(studentId), enabled: !!studentId });
export const useRecordGrade = () => { const qc = useQueryClient(); return useMutation({ mutationFn: gradesApi.record, onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }) }); };`,

  'features/assignments/types.ts': `export interface Assignment { _id: string; title: string; description: string; subjectId: { _id: string; name: string }; classId: { _id: string; name: string; section: string }; teacherId: { _id: string; userId: { name: string } }; dueDate: string; fileUrl?: string; schoolId: string; createdAt: string; }
export interface Submission { _id: string; assignmentId: string; studentId: { _id: string; userId: { name: string }; roll: string }; fileUrl: string; submittedAt: string; marks?: number; feedback?: string; }
export interface CreateAssignmentPayload { title: string; description: string; subjectId: string; classId: string; dueDate: string; }`,
  'features/assignments/api.ts': `import api from '@/lib/axios';
import { Assignment, Submission, CreateAssignmentPayload } from './types';
export const assignmentsApi = {
  getAll: (params?: any) => api.get<{ data: Assignment[] }>('/assignments', { params }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Assignment }>(\`/assignments/\${id}\`).then(r => r.data.data),
  create: (payload: CreateAssignmentPayload) => api.post<{ data: Assignment }>('/assignments', payload).then(r => r.data.data),
  submit: (id: string, payload: { fileUrl: string }) => api.post<{ data: Submission }>(\`/assignments/\${id}/submit\`, payload).then(r => r.data.data),
  getSubmissions: (id: string) => api.get<{ data: Submission[] }>(\`/assignments/\${id}/submissions\`).then(r => r.data.data),
  gradeSubmission: (subId: string, payload: { marks: number; feedback?: string }) => api.put<{ data: Submission }>(\`/submissions/\${subId}/grade\`, payload).then(r => r.data.data),
};`,
  'features/assignments/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from './api';
export const useAssignments = (params?: any) => useQuery({ queryKey: ['assignments', params], queryFn: () => assignmentsApi.getAll(params) });
export const useAssignment = (id: string) => useQuery({ queryKey: ['assignments', id], queryFn: () => assignmentsApi.getById(id), enabled: !!id });
export const useCreateAssignment = () => { const qc = useQueryClient(); return useMutation({ mutationFn: assignmentsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }) }); };
export const useSubmitAssignment = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => assignmentsApi.submit(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }) }); };
export const useSubmissions = (id: string) => useQuery({ queryKey: ['submissions', id], queryFn: () => assignmentsApi.getSubmissions(id), enabled: !!id });
export const useGradeSubmission = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => assignmentsApi.gradeSubmission(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['submissions'] }) }); };`,

  'features/notices/types.ts': `export interface Notice { _id: string; title: string; content: string; targetRole: 'all' | 'teacher' | 'student' | 'admin'; createdBy: { name: string }; schoolId: string; publishedAt: string; }
export interface CreateNoticePayload { title: string; content: string; targetRole: string; }`,
  'features/notices/api.ts': `import api from '@/lib/axios';
import { Notice, CreateNoticePayload } from './types';
export const noticesApi = {
  getAll: () => api.get<{ data: Notice[] }>('/notices').then(r => r.data.data),
  create: (payload: CreateNoticePayload) => api.post<{ data: Notice }>('/notices', payload).then(r => r.data.data),
  delete: (id: string) => api.delete(\`/notices/\${id}\`),
};`,
  'features/notices/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from './api';
export const useNotices = () => useQuery({ queryKey: ['notices'], queryFn: () => noticesApi.getAll() });
export const useCreateNotice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: noticesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }) }); };
export const useDeleteNotice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: noticesApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }) }); };`,

  'features/fees/types.ts': `export type FeeType = 'tuition' | 'exam' | 'transport' | 'other';
export interface Fee { _id: string; title: string; classId: { _id: string; name: string; section: string }; amount: number; dueDate: string; academicYear: string; type: FeeType; schoolId: string; }
export interface StudentFee extends Fee { paymentStatus: 'paid' | 'pending' | 'failed' | null; paymentId?: string; paidAt?: string; invoiceUrl?: string; }
export interface CreateFeePayload { title: string; classId: string; amount: number; dueDate: string; academicYear: string; type: FeeType; }`,
  'features/fees/api.ts': `import api from '@/lib/axios';
export const feesApi = {
  getAll: () => api.get('/fees').then(r => r.data.data),
  getStudentFees: (studentId: string) => api.get(\`/fees/student/\${studentId}\`).then(r => r.data.data),
  create: (payload: any) => api.post('/fees', payload).then(r => r.data.data),
  initiatePayment: (feeId: string) => api.post('/payment/initiate', { feeId }).then(r => r.data),
  downloadInvoice: (paymentId: string) => api.get(\`/payment/invoice/\${paymentId}\`, { responseType: 'blob' }),
};`,
  'features/fees/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feesApi } from './api';
export const useFees = () => useQuery({ queryKey: ['fees'], queryFn: () => feesApi.getAll() });
export const useStudentFees = (studentId: string) => useQuery({ queryKey: ['fees', 'student', studentId], queryFn: () => feesApi.getStudentFees(studentId), enabled: !!studentId });
export const useCreateFee = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['fees'] }) }); };
export const useInitiatePayment = () => useMutation({ mutationFn: feesApi.initiatePayment });`,

  'features/sms/types.ts': `export type SmsEvent = 'absence' | 'fee_due' | 'fee_paid' | 'grade' | 'notice' | 'admission';
export interface SmsLog { _id: string; recipient: string; message: string; event: SmsEvent; status: 'sent' | 'failed'; studentId?: { _id: string; userId: { name: string } }; schoolId: string; sentAt: string; }`,
  'features/sms/api.ts': `import api from '@/lib/axios';
export const smsApi = {
  getLogs: (params?: { event?: string; status?: string }) => api.get('/sms', { params }).then(r => r.data.data),
  sendManual: (payload: { phone: string; message: string }) => api.post('/sms/send', payload).then(r => r.data),
};`,
  'features/sms/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smsApi } from './api';
export const useSmsLogs = (params?: any) => useQuery({ queryKey: ['sms', params], queryFn: () => smsApi.getLogs(params) });
export const useSendManualSms = () => { const qc = useQueryClient(); return useMutation({ mutationFn: smsApi.sendManual, onSuccess: () => qc.invalidateQueries({ queryKey: ['sms'] }) }); };`,

  'features/admin/types.ts': `export interface DashboardStats { totalStudents: number; totalTeachers: number; totalClasses: number; totalRevenue: number; todayAttendanceRate: number; smsSentToday: number; }
export interface MonthlyFee { month: string; total: number; }
export interface TopPerformer { studentName: string; roll: string; avgScore: number; grade: string; }`,
  'features/admin/api.ts': `import api from '@/lib/axios';
export const adminApi = {
  getStats: () => api.get('/admin/stats').then(r => r.data.data),
  getMonthlyFees: () => api.get('/admin/monthly-fees').then(r => r.data.data),
  getTopPerformers: () => api.get('/admin/top-performers').then(r => r.data.data),
  getUsers: () => api.get('/admin/users').then(r => r.data.data),
  toggleUserStatus: (userId: string) => api.patch(\`/admin/users/\${userId}/toggle\`).then(r => r.data),
};`,
  'features/admin/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from './api';
export const useDashboardStats = () => useQuery({ queryKey: ['admin', 'stats'], queryFn: () => adminApi.getStats() });
export const useMonthlyFees = () => useQuery({ queryKey: ['admin', 'monthly-fees'], queryFn: () => adminApi.getMonthlyFees() });
export const useTopPerformers = () => useQuery({ queryKey: ['admin', 'top-performers'], queryFn: () => adminApi.getTopPerformers() });
export const useUsers = () => useQuery({ queryKey: ['admin', 'users'], queryFn: () => adminApi.getUsers() });
export const useToggleUserStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: adminApi.toggleUserStatus, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) }); };`,

  'features/schools/types.ts': `export interface School { _id: string; name: string; slug: string; address: string; phone: string; email: string; logo?: string; plan: 'basic' | 'pro'; isActive: boolean; createdAt: string; }
export interface CreateSchoolPayload { name: string; address: string; phone: string; email: string; plan: string; }`,
  'features/schools/api.ts': `import api from '@/lib/axios';
import { School, CreateSchoolPayload } from './types';
export const schoolsApi = {
  getAll: () => api.get<{ data: School[] }>('/schools').then(r => r.data.data),
  create: (payload: CreateSchoolPayload) => api.post<{ data: School }>('/schools', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateSchoolPayload>) => api.put<{ data: School }>(\`/schools/\${id}\`, payload).then(r => r.data.data),
  toggleStatus: (id: string) => api.patch(\`/schools/\${id}/toggle\`).then(r => r.data),
};`,
  'features/schools/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolsApi } from './api';
export const useSchools = () => useQuery({ queryKey: ['schools'], queryFn: () => schoolsApi.getAll() });
export const useCreateSchool = () => { const qc = useQueryClient(); return useMutation({ mutationFn: schoolsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };
export const useUpdateSchool = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => schoolsApi.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };
export const useToggleSchoolStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: schoolsApi.toggleStatus, onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };`
};

Object.entries(files).forEach(([f, c]) => write(f, c));
console.log('Done script 2');
