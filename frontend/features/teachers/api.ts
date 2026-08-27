import api from '@/lib/axios';
import { Teacher, CreateTeacherPayload } from './types';
export const teachersApi = {
  getAll: () => api.get<{ data: Teacher[] }>('/teachers').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Teacher }>(`/teachers/${id}`).then(r => r.data.data),
  create: (payload: CreateTeacherPayload) => api.post<{ data: Teacher }>('/teachers', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateTeacherPayload>) => api.put<{ data: Teacher }>(`/teachers/${id}`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
};
