import api from '@/lib/axios';
export const attendanceApi = {
  mark: (payload: any) => api.post('/attendance', payload).then(r => r.data),
  getByClass: (classId: string, params?: { startDate?: string; endDate?: string }) => api.get('/attendance/class/' + classId, { params }).then(r => r.data.data),
  getMy: () => api.get('/attendance/my').then(r => r.data.data),
  getMonthlySummary: (classId: string, month: string) => api.get('/attendance/summary', { params: { classId, month } }).then(r => r.data.data),
};
