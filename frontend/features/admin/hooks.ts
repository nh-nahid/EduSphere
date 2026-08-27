import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from './api';
export const useDashboardStats = () => useQuery({ queryKey: ['admin', 'stats'], queryFn: () => adminApi.getStats() });
export const useMonthlyFees = () => useQuery({ queryKey: ['admin', 'monthly-fees'], queryFn: () => adminApi.getMonthlyFees() });
export const useTopPerformers = () => useQuery({ queryKey: ['admin', 'top-performers'], queryFn: () => adminApi.getTopPerformers() });
export const useUsers = () => useQuery({ queryKey: ['admin', 'users'], queryFn: () => adminApi.getUsers() });
export const useToggleUserStatus = () => { const qc = useQueryClient(); return useMutation({ mutationFn: adminApi.toggleUserStatus, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) }); };
