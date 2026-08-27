export interface Notice { _id: string; title: string; content: string; targetRole: 'all' | 'teacher' | 'student' | 'admin'; createdBy: { name: string }; schoolId: string; publishedAt: string; }
export interface CreateNoticePayload { title: string; content: string; targetRole: string; }
