import api from '@/lib/axios';
import { LoginCredentials, AuthResponse, User } from './types';

export const login = async (credentials: LoginCredentials): Promise<any> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me');
  return response.data;
};
