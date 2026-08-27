export interface School { _id: string; name: string; slug: string; address: string; phone: string; email: string; logo?: string; plan: 'basic' | 'pro'; isActive: boolean; createdAt: string; }
export interface CreateSchoolPayload { name: string; address: string; phone: string; email: string; plan: string; }
