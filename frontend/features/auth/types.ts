export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student';
  phone?: string;
  avatar?: string;
  schoolId?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
