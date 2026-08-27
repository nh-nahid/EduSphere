const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';

const files = {
  'components/layout/Sidebar.tsx': `import React from 'react';
import { LayoutDashboard, GraduationCap, UsersRound, School, BookOpen, ClipboardCheck, BarChart3, FileText, Bell, CreditCard, MessageSquare, Settings, Building2, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1e1b4b] text-[#c7d2fe] flex flex-col">
      <div className="p-4 text-xl font-bold text-white border-b border-[#312e81]">SchoolMS</div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-[#312e81] rounded text-white bg-[#4338ca]"><LayoutDashboard size={20}/> Dashboard</Link>
        <Link href="/students" className="flex items-center gap-2 p-2 hover:bg-[#312e81] rounded"><GraduationCap size={20}/> Students</Link>
      </nav>
      <div className="p-4 border-t border-[#312e81] flex items-center gap-2">
        <User size={24} className="text-white"/>
        <div>
          <div className="text-white text-sm">User</div>
          <div className="text-xs">Admin</div>
        </div>
      </div>
    </div>
  );
}`,
  'components/layout/Header.tsx': `import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="font-semibold text-lg">Dashboard</div>
      <div className="flex items-center gap-4">
        <Search size={20} className="text-gray-500" />
        <Bell size={20} className="text-gray-500" />
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </header>
  );
}`,
  'app/(dashboard)/layout.tsx': `import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}`,
  'app/page.tsx': `'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) router.push('/dashboard');
      else router.push('/login');
    }
  }, [user, loading, router]);

  return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
}`,
  'app/(auth)/login/page.tsx': `import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-indigo-700 p-4">
      <LoginForm />
    </div>
  );
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', fullPath);
}
