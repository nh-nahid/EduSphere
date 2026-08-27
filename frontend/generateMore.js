const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';

const moreFiles = {
  'features/auth/components/LoginForm.tsx': `'use client'
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
    <Card className="w-[400px] shadow-lg border-0">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <School size={32} className="text-indigo-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">SchoolMS</CardTitle>
        <p className="text-sm text-gray-500">Welcome back! Please login to your account.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot your password?</a>
      </CardFooter>
    </Card>
  );
};`,
  'app/(dashboard)/dashboard/page.tsx': `export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Students</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">1,234</div>
        </div>
      </div>
    </div>
  );
}`
};

for (const [relativePath, content] of Object.entries(moreFiles)) {
  const fullPath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log("Done");
