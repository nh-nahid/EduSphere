export interface Class { _id: string; name: string; section: string; classTeacherId?: { _id: string; userId: { name: string } }; studentIds: string[]; subjectIds: Array<{ _id: string; name: string }>; academicYear: string; schoolId: string; }
export interface CreateClassPayload { name: string; section: string; academicYear: string; classTeacherId?: string; }
