import api from '@/lib/axios';
import { Student, CreateStudentPayload, UpdateStudentPayload } from './types';
export const studentsApi = {
  getAll: (params?: { classId?: string; search?: string }) => api.get<{ data: Student[] }>('/students', { params }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Student }>(`/students/${id}`).then(r => r.data.data),
  create: (payload: CreateStudentPayload) => api.post<{ data: Student }>('/students', payload).then(r => r.data.data),
  update: (id: string, payload: UpdateStudentPayload) => api.put<{ data: Student }>(`/students/${id}`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(`/students/${id}`),
};
