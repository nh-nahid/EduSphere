import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from './api';
export const useMarkAttendance = () => { const qc = useQueryClient(); return useMutation({ mutationFn: attendanceApi.mark, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) }); };
export const useClassAttendance = (classId: string, params?: any) => useQuery({ queryKey: ['attendance', 'class', classId, params], queryFn: () => attendanceApi.getByClass(classId, params), enabled: !!classId });
export const useMyAttendance = () => useQuery({ queryKey: ['attendance', 'my'], queryFn: () => attendanceApi.getMy() });
export const useAttendanceSummary = (classId: string, month: string) => useQuery({ queryKey: ['attendance', 'summary', classId, month], queryFn: () => attendanceApi.getMonthlySummary(classId, month), enabled: !!classId && !!month });
