import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradesApi } from './api';
export const useGrades = (params?: any) => useQuery({ queryKey: ['grades', params], queryFn: () => gradesApi.getAll(params) });
export const useStudentGrades = (studentId: string) => useQuery({ queryKey: ['grades', 'student', studentId], queryFn: () => gradesApi.getStudentGrades(studentId), enabled: !!studentId });
export const useRecordGrade = () => { const qc = useQueryClient(); return useMutation({ mutationFn: gradesApi.record, onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }) }); };
