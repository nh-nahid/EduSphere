import api from '@/lib/axios';
import { Notice, CreateNoticePayload } from './types';
export const noticesApi = {
  getAll: () => api.get<{ data: Notice[] }>('/notices').then(r => r.data.data),
  create: (payload: CreateNoticePayload) => api.post<{ data: Notice }>('/notices', payload).then(r => r.data.data),
  delete: (id: string) => api.delete(`/notices/${id}`),
};
