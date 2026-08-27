import api from '@/lib/axios';
import { Subject, CreateSubjectPayload } from './types';
export const subjectsApi = {
  getAll: () => api.get<{ data: Subject[] }>('/subjects').then(r => r.data.data),
  create: (payload: CreateSubjectPayload) => api.post<{ data: Subject }>('/subjects', payload).then(r => r.data.data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
};
