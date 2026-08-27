import api from '@/lib/axios';
export const feesApi = {
  getAll: () => api.get('/fees').then(r => r.data.data),
  getStudentFees: (studentId: string) => api.get(`/fees/student/${studentId}`).then(r => r.data.data),
  create: (payload: any) => api.post('/fees', payload).then(r => r.data.data),
  initiatePayment: (feeId: string) => api.post('/payment/initiate', { feeId }).then(r => r.data),
  downloadInvoice: (paymentId: string) => api.get(`/payment/invoice/${paymentId}`, { responseType: 'blob' }),
};
