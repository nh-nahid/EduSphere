import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-950 to-teal-700 p-4">
      <LoginForm />
    </div>
  );
}