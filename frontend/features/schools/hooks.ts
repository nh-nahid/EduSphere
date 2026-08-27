import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolsApi } from './api';
export const useSchools = () => useQuery({ queryKey: ['schools'], queryFn: () => schoolsApi.getAll() });
export const useCreateSchool = () => { const qc = useQueryClient(); return useMutation({ mutationFn: schoolsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };
export const useUpdateSchool = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => schoolsApi.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };
export const useToggleSchoolStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: schoolsApi.toggleStatus, onSuccess: () => qc.invalidateQueries({ queryKey: ['schools'] }) }); };
