'use client'
import React, { useState } from 'react';
import { useLogin } from '../hooks';
import { School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Card className="w-[400px] shadow-lg border border-teal-100">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto bg-teal-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <School size={32} className="text-teal-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-teal-950">SchoolMS</CardTitle>
        <p className="text-sm text-teal-600/70">Welcome back! Please login to your account.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <a href="/forgot-password" className="text-sm text-teal-600 hover:underline">Forgot your password?</a>
      </CardFooter>
    </Card>
  );
};