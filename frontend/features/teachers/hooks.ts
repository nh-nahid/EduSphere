import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from './api';
import { toast } from 'sonner';
export const useTeachers = () => useQuery({ queryKey: ['teachers'], queryFn: () => teachersApi.getAll() });
export const useTeacher = (id: string) => useQuery({ queryKey: ['teachers', id], queryFn: () => teachersApi.getById(id), enabled: !!id });
export const useCreateTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: teachersApi.create, onSuccess: () => { toast.success('Teacher created!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };
export const useUpdateTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => teachersApi.update(id, payload), onSuccess: () => { toast.success('Teacher updated!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };
export const useDeleteTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: teachersApi.delete, onSuccess: () => { toast.success('Teacher deleted!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };
