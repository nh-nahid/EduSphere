import api from '@/lib/axios';
import { Assignment, Submission, CreateAssignmentPayload } from './types';
export const assignmentsApi = {
  getAll: (params?: any) => api.get<{ data: Assignment[] }>('/assignments', { params }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Assignment }>(`/assignments/${id}`).then(r => r.data.data),
  create: (payload: CreateAssignmentPayload) => api.post<{ data: Assignment }>('/assignments', payload).then(r => r.data.data),
  submit: (id: string, payload: { fileUrl: string }) => api.post<{ data: Submission }>(`/assignments/${id}/submit`, payload).then(r => r.data.data),
  getSubmissions: (id: string) => api.get<{ data: Submission[] }>(`/assignments/${id}/submissions`).then(r => r.data.data),
  gradeSubmission: (subId: string, payload: { marks: number; feedback?: string }) => api.put<{ data: Submission }>(`/submissions/${subId}/grade`, payload).then(r => r.data.data),
};
