import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from './api';
import { LoginCredentials } from './types';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (response) => {
      const user = response.data;
      setUser(user);
      queryClient.setQueryData(['auth', 'user'], user);
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });
};
