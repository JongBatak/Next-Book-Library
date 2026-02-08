'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    
    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/user');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirecting to your dashboard...</div>
    </div>
  );
}
