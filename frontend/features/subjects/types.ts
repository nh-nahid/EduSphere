export interface Subject { _id: string; name: string; code: string; classId: { _id: string; name: string; section: string }; teacherId?: { _id: string; userId: { name: string } }; schoolId: string; }
export interface CreateSubjectPayload { name: string; code: string; classId: string; teacherId?: string; }
