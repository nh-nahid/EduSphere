import api from '@/lib/axios';
export const smsApi = {
  getLogs: (params?: { event?: string; status?: string }) => api.get('/sms', { params }).then(r => r.data.data),
  sendManual: (payload: { phone: string; message: string }) => api.post('/sms/send', payload).then(r => r.data),
};
