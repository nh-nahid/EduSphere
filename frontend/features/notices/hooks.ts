import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from './api';
export const useNotices = () => useQuery({ queryKey: ['notices'], queryFn: () => noticesApi.getAll() });
export const useCreateNotice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: noticesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }) }); };
export const useDeleteNotice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: noticesApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }) }); };
