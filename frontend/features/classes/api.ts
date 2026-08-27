import api from '@/lib/axios';
import { Class, CreateClassPayload } from './types';
export const classesApi = {
  getAll: () => api.get<{ data: Class[] }>('/classes').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Class }>(`/classes/${id}`).then(r => r.data.data),
  create: (payload: CreateClassPayload) => api.post<{ data: Class }>('/classes', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateClassPayload>) => api.put<{ data: Class }>(`/classes/${id}`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(`/classes/${id}`),
};
