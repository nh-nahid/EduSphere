import api from '@/lib/axios';
import { Grade, RecordGradePayload } from './types';
export const gradesApi = {
  getAll: (params?: any) => api.get<{ data: Grade[] }>('/grades', { params }).then(r => r.data.data),
  getStudentGrades: (studentId: string) => api.get<{ data: Grade[] }>(`/grades/student/${studentId}`).then(r => r.data.data),
  record: (payload: RecordGradePayload) => api.post<{ data: Grade }>('/grades', payload).then(r => r.data.data),
};
