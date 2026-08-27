import api from '@/lib/axios';
import { School, CreateSchoolPayload } from './types';
export const schoolsApi = {
  getAll: () => api.get<{ data: School[] }>('/schools').then(r => r.data.data),
  create: (payload: CreateSchoolPayload) => api.post<{ data: School }>('/schools', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateSchoolPayload>) => api.put<{ data: School }>(`/schools/${id}`, payload).then(r => r.data.data),
  toggleStatus: (id: string) => api.patch(`/schools/${id}/toggle`).then(r => r.data),
};
