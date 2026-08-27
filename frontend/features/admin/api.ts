import api from '@/lib/axios';
export const adminApi = {
  getStats: () => api.get('/admin/stats').then(r => r.data.data),
  getMonthlyFees: () => api.get('/admin/monthly-fees').then(r => r.data.data),
  getTopPerformers: () => api.get('/admin/top-performers').then(r => r.data.data),
  getUsers: () => api.get('/admin/users').then(r => r.data.data),
  toggleUserStatus: (userId: string) => api.patch(`/admin/users/${userId}/toggle`).then(r => r.data),
};
