import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from './api';
import { toast } from 'sonner';
export const useStudents = (params?: { classId?: string; search?: string }) => useQuery({ queryKey: ['students', params], queryFn: () => studentsApi.getAll(params) });
export const useStudent = (id: string) => useQuery({ queryKey: ['students', id], queryFn: () => studentsApi.getById(id), enabled: !!id });
export const useCreateStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: studentsApi.create, onSuccess: () => { toast.success('Student created!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create student') }); };
export const useUpdateStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => studentsApi.update(id, payload), onSuccess: () => { toast.success('Student updated!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update student') }); };
export const useDeleteStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: studentsApi.delete, onSuccess: () => { toast.success('Student deleted!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete student') }); };
