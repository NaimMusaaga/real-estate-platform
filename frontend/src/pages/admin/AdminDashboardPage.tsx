import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { Spinner } from '../../components/common/Spinner';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { StatCard } from '../../components/admin/StatCard';
import * as adminApi from '../../services/api/admin.api';
import type { AdminStats, AuditLogEntry } from '../../types/admin.types';
import { AUDIT_ACTION_LABELS } from '../../utils/userLabels';
import { formatDateTime } from '../../utils/formatDate';
import { getErrorMessage } from '../../utils/errors';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.listAuditLogs()])
      .then(([statsData, logsData]) => {
        setStats(statsData);
        setAuditLogs(logsData);
      })
      .catch((err) => setError(getErrorMessage(err, 'تعذّر تحميل بيانات لوحة التحكم')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-stone-900">لوحة تحكم الإدارة</h1>
        <AdminTabs />

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : stats ? (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="mb-3 text-lg font-bold text-stone-900">المستخدمون</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard label="الإجمالي" value={stats.users.total} />
                <StatCard label="نشطون" value={stats.users.active} accent="accent" />
                <StatCard label="موقوفون" value={stats.users.suspended} accent="red" />
                <StatCard label="مشرفون" value={stats.users.admins} accent="stone" />
                <StatCard label="بحاجة لمراجعة" value={stats.users.flaggedForReview} accent="red" />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-stone-900">العقارات</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <StatCard label="الإجمالي" value={stats.listings.total} />
                <StatCard label="نشطة" value={stats.listings.active} accent="accent" />
                <StatCard label="مباعة / مؤجرة" value={stats.listings.soldOrRented} accent="stone" />
                <StatCard label="مؤرشفة" value={stats.listings.archived} accent="red" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  سكني: {stats.listings.byPropertyType.residential}
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  تجاري: {stats.listings.byPropertyType.commercial}
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  أرض: {stats.listings.byPropertyType.land}
                </span>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-stone-900">التواصل</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <StatCard label="المحادثات" value={stats.conversations.total} />
                <StatCard label="الرسائل" value={stats.messages.total} />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-stone-900">آخر الإجراءات الإدارية</h2>
              <Card>
                {auditLogs.length === 0 ? (
                  <p className="p-6 text-center text-stone-500">لا يوجد إجراءات إدارية مسجّلة بعد.</p>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {auditLogs.map((log) => (
                      <li key={log.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">
                            {AUDIT_ACTION_LABELS[log.actionType]}
                            {log.targetDisplayName && (
                              <span className="font-normal text-stone-500"> — {log.targetDisplayName}</span>
                            )}
                          </p>
                          <p className="text-sm text-stone-500">
                            بواسطة {log.admin.displayName}
                            {log.reason && <span> · {log.reason}</span>}
                          </p>
                        </div>
                        <span className="text-xs text-stone-400">{formatDateTime(log.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
