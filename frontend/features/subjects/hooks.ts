import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from './api';
export const useSubjects = () => useQuery({ queryKey: ['subjects'], queryFn: () => subjectsApi.getAll() });
export const useCreateSubject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: subjectsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) }); };
export const useDeleteSubject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: subjectsApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) }); };
