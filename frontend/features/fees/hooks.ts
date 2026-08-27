import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feesApi } from './api';
export const useFees = () => useQuery({ queryKey: ['fees'], queryFn: () => feesApi.getAll() });
export const useStudentFees = (studentId: string) => useQuery({ queryKey: ['fees', 'student', studentId], queryFn: () => feesApi.getStudentFees(studentId), enabled: !!studentId });
export const useCreateFee = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['fees'] }) }); };
export const useInitiatePayment = () => useMutation({ mutationFn: feesApi.initiatePayment });
