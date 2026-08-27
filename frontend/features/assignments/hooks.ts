import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from './api';
export const useAssignments = (params?: any) => useQuery({ queryKey: ['assignments', params], queryFn: () => assignmentsApi.getAll(params) });
export const useAssignment = (id: string) => useQuery({ queryKey: ['assignments', id], queryFn: () => assignmentsApi.getById(id), enabled: !!id });
export const useCreateAssignment = () => { const qc = useQueryClient(); return useMutation({ mutationFn: assignmentsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }) }); };
export const useSubmitAssignment = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => assignmentsApi.submit(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }) }); };
export const useSubmissions = (id: string) => useQuery({ queryKey: ['submissions', id], queryFn: () => assignmentsApi.getSubmissions(id), enabled: !!id });
export const useGradeSubmission = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => assignmentsApi.gradeSubmission(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['submissions'] }) }); };
