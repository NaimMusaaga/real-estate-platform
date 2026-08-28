import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import * as authApi from '../services/api/auth.api';
import type { UserStats } from '../types/auth.types';

const QUICK_LINKS = [
  { to: '/create-listing', label: 'إضافة عقار جديد', description: 'أضف إعلاناً جديداً لعقارك' },
  { to: '/my-listings', label: 'إعلاناتي', description: 'إدارة العقارات التي أضفتها' },
  { to: '/conversations', label: 'المحادثات', description: 'تابع محادثاتك مع المهتمين' },
  { to: '/profile', label: 'الملف الشخصي', description: 'تحديث بياناتك وكلمة المرور' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    authApi.getMyStats().then(setStats);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-stone-900">مرحباً، {user?.displayName}</h1>
        <p className="mt-1 text-stone-500">{user?.email}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-stone-500">إعلاناتي النشطة</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-700">{stats?.activeListingsCount ?? '—'}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-stone-500">محادثاتي</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-700">{stats?.conversationsCount ?? '—'}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-stone-500">رسائل غير مقروءة</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-700">{stats?.unreadMessagesCount ?? '—'}</p>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md"
            >
              <p className="font-bold text-stone-900">{link.label}</p>
              <p className="mt-1 text-sm text-stone-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
