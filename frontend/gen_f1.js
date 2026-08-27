const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';
const write = (file, content) => {
  const p = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
};

const files = {
  'features/students/types.ts': `export interface Student { _id: string; userId: { _id: string; name: string; email: string; avatar?: string; phone?: string }; schoolId: string; classId?: { _id: string; name: string; section: string }; roll: string; section: string; guardianName: string; guardianPhone: string; admissionDate: string; createdAt: string; }
export interface CreateStudentPayload { name: string; email: string; password: string; phone?: string; roll: string; section: string; classId?: string; guardianName: string; guardianPhone: string; admissionDate: string; }
export interface UpdateStudentPayload extends Partial<Omit<CreateStudentPayload, 'password'>> {}`,
  'features/students/api.ts': `import api from '@/lib/axios';
import { Student, CreateStudentPayload, UpdateStudentPayload } from './types';
export const studentsApi = {
  getAll: (params?: { classId?: string; search?: string }) => api.get<{ data: Student[] }>('/students', { params }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Student }>(\`/students/\${id}\`).then(r => r.data.data),
  create: (payload: CreateStudentPayload) => api.post<{ data: Student }>('/students', payload).then(r => r.data.data),
  update: (id: string, payload: UpdateStudentPayload) => api.put<{ data: Student }>(\`/students/\${id}\`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(\`/students/\${id}\`),
};`,
  'features/students/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from './api';
import { toast } from 'sonner';
export const useStudents = (params?: { classId?: string; search?: string }) => useQuery({ queryKey: ['students', params], queryFn: () => studentsApi.getAll(params) });
export const useStudent = (id: string) => useQuery({ queryKey: ['students', id], queryFn: () => studentsApi.getById(id), enabled: !!id });
export const useCreateStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: studentsApi.create, onSuccess: () => { toast.success('Student created!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create student') }); };
export const useUpdateStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => studentsApi.update(id, payload), onSuccess: () => { toast.success('Student updated!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update student') }); };
export const useDeleteStudent = () => { const qc = useQueryClient(); return useMutation({ mutationFn: studentsApi.delete, onSuccess: () => { toast.success('Student deleted!'); qc.invalidateQueries({ queryKey: ['students'] }); }, onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete student') }); };`,

  'features/teachers/types.ts': `export interface Teacher { _id: string; userId: { _id: string; name: string; email: string; avatar?: string; phone?: string }; schoolId: string; subjects: Array<{ _id: string; name: string }>; classIds: Array<{ _id: string; name: string; section: string }>; qualification: string; joiningDate: string; createdAt: string; }
export interface CreateTeacherPayload { name: string; email: string; password: string; phone?: string; qualification: string; joiningDate: string; }`,
  'features/teachers/api.ts': `import api from '@/lib/axios';
import { Teacher, CreateTeacherPayload } from './types';
export const teachersApi = {
  getAll: () => api.get<{ data: Teacher[] }>('/teachers').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Teacher }>(\`/teachers/\${id}\`).then(r => r.data.data),
  create: (payload: CreateTeacherPayload) => api.post<{ data: Teacher }>('/teachers', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateTeacherPayload>) => api.put<{ data: Teacher }>(\`/teachers/\${id}\`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(\`/teachers/\${id}\`),
};`,
  'features/teachers/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from './api';
import { toast } from 'sonner';
export const useTeachers = () => useQuery({ queryKey: ['teachers'], queryFn: () => teachersApi.getAll() });
export const useTeacher = (id: string) => useQuery({ queryKey: ['teachers', id], queryFn: () => teachersApi.getById(id), enabled: !!id });
export const useCreateTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: teachersApi.create, onSuccess: () => { toast.success('Teacher created!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };
export const useUpdateTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => teachersApi.update(id, payload), onSuccess: () => { toast.success('Teacher updated!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };
export const useDeleteTeacher = () => { const qc = useQueryClient(); return useMutation({ mutationFn: teachersApi.delete, onSuccess: () => { toast.success('Teacher deleted!'); qc.invalidateQueries({ queryKey: ['teachers'] }); } }); };`,

  'features/classes/types.ts': `export interface Class { _id: string; name: string; section: string; classTeacherId?: { _id: string; userId: { name: string } }; studentIds: string[]; subjectIds: Array<{ _id: string; name: string }>; academicYear: string; schoolId: string; }
export interface CreateClassPayload { name: string; section: string; academicYear: string; classTeacherId?: string; }`,
  'features/classes/api.ts': `import api from '@/lib/axios';
import { Class, CreateClassPayload } from './types';
export const classesApi = {
  getAll: () => api.get<{ data: Class[] }>('/classes').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Class }>(\`/classes/\${id}\`).then(r => r.data.data),
  create: (payload: CreateClassPayload) => api.post<{ data: Class }>('/classes', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<CreateClassPayload>) => api.put<{ data: Class }>(\`/classes/\${id}\`, payload).then(r => r.data.data),
  delete: (id: string) => api.delete(\`/classes/\${id}\`),
};`,
  'features/classes/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from './api';
export const useClasses = () => useQuery({ queryKey: ['classes'], queryFn: () => classesApi.getAll() });
export const useClass = (id: string) => useQuery({ queryKey: ['classes', id], queryFn: () => classesApi.getById(id), enabled: !!id });
export const useCreateClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: classesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };
export const useUpdateClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => classesApi.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };
export const useDeleteClass = () => { const qc = useQueryClient(); return useMutation({ mutationFn: classesApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) }); };`,

  'features/subjects/types.ts': `export interface Subject { _id: string; name: string; code: string; classId: { _id: string; name: string; section: string }; teacherId?: { _id: string; userId: { name: string } }; schoolId: string; }
export interface CreateSubjectPayload { name: string; code: string; classId: string; teacherId?: string; }`,
  'features/subjects/api.ts': `import api from '@/lib/axios';
import { Subject, CreateSubjectPayload } from './types';
export const subjectsApi = {
  getAll: () => api.get<{ data: Subject[] }>('/subjects').then(r => r.data.data),
  create: (payload: CreateSubjectPayload) => api.post<{ data: Subject }>('/subjects', payload).then(r => r.data.data),
  delete: (id: string) => api.delete(\`/subjects/\${id}\`),
};`,
  'features/subjects/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from './api';
export const useSubjects = () => useQuery({ queryKey: ['subjects'], queryFn: () => subjectsApi.getAll() });
export const useCreateSubject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: subjectsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) }); };
export const useDeleteSubject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: subjectsApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }) }); };`,

  'features/attendance/types.ts': `export type AttendanceStatus = 'present' | 'absent' | 'late';
export interface AttendanceRecord { studentId: string; status: AttendanceStatus; }
export interface Attendance { _id: string; classId: string; date: string; records: Array<{ studentId: { _id: string; userId: { name: string }; roll: string }; status: AttendanceStatus }>; takenBy: string; schoolId: string; }
export interface MarkAttendancePayload { classId: string; date: string; records: AttendanceRecord[]; }`,
  'features/attendance/api.ts': `import api from '@/lib/axios';
export const attendanceApi = {
  mark: (payload: any) => api.post('/attendance', payload).then(r => r.data),
  getByClass: (classId: string, params?: { startDate?: string; endDate?: string }) => api.get('/attendance/class/' + classId, { params }).then(r => r.data.data),
  getMy: () => api.get('/attendance/my').then(r => r.data.data),
  getMonthlySummary: (classId: string, month: string) => api.get('/attendance/summary', { params: { classId, month } }).then(r => r.data.data),
};`,
  'features/attendance/hooks.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from './api';
export const useMarkAttendance = () => { const qc = useQueryClient(); return useMutation({ mutationFn: attendanceApi.mark, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) }); };
export const useClassAttendance = (classId: string, params?: any) => useQuery({ queryKey: ['attendance', 'class', classId, params], queryFn: () => attendanceApi.getByClass(classId, params), enabled: !!classId });
export const useMyAttendance = () => useQuery({ queryKey: ['attendance', 'my'], queryFn: () => attendanceApi.getMy() });
export const useAttendanceSummary = (classId: string, month: string) => useQuery({ queryKey: ['attendance', 'summary', classId, month], queryFn: () => attendanceApi.getMonthlySummary(classId, month), enabled: !!classId && !!month });`
};

Object.entries(files).forEach(([f, c]) => write(f, c));
console.log('Done script 1');
