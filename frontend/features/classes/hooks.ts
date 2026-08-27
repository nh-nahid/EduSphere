import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from './api';
export const useClasses = () => useQuery({ queryKey: ['classes'], queryFn: () => classesApi.getAll() });
export const useClass = (id: string) => useQuery({ queryKey: ['classes', id], queryFn: () => classesApi.getById(id), enabled: !!id });
export const useCreateClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: classesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };
export const useUpdateClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => classesApi.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };
export const useDeleteClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: classesApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };
