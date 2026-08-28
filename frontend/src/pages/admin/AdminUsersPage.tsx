import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Spinner } from '../../components/common/Spinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { SuspendUserModal } from '../../components/admin/SuspendUserModal';
import * as adminApi from '../../services/api/admin.api';
import type { AdminUserSummary } from '../../types/admin.types';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../../utils/userLabels';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../utils/errors';

const STATUS_BADGE_CLASSES: Record<AdminUserSummary['status'], string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
};

const ROLE_BADGE_CLASSES: Record<AdminUserSummary['role'], string> = {
  user: 'bg-stone-100 text-stone-600',
  admin: 'bg-brand-50 text-brand-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');

  const [suspendTarget, setSuspendTarget] = useState<AdminUserSummary | null>(null);
  const [reinstateTarget, setReinstateTarget] = useState<AdminUserSummary | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    adminApi
      .listUsers()
      .then(setUsers)
      .catch((err) => setListError(getErrorMessage(err, 'تعذّر تحميل قائمة المستخدمين')))
      .finally(() => setLoading(false));
  }

  async function handleSuspendConfirm(reason: string) {
    if (!suspendTarget) return;
    setActionError('');
    setActionLoading(true);
    try {
      await adminApi.suspendUser(suspendTarget.id, reason);
      setSuspendTarget(null);
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'تعذّر إيقاف المستخدم'));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReinstateConfirm() {
    if (!reinstateTarget) return;
    setActionError('');
    setActionLoading(true);
    try {
      await adminApi.reinstateUser(reinstateTarget.id);
      setReinstateTarget(null);
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'تعذّر إعادة تفعيل المستخدم'));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-stone-900">إدارة المستخدمين</h1>
        <AdminTabs />

        {(listError || actionError) && (
          <div className="mb-6">
            <Alert variant="error">{listError || actionError}</Alert>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-start text-xs font-semibold uppercase tracking-wide text-stone-500">
                  <th className="px-4 py-3 text-start">المستخدم</th>
                  <th className="px-4 py-3 text-start">الصلاحية</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="px-4 py-3 text-start">موثّق؟</th>
                  <th className="px-4 py-3 text-start">تاريخ الانضمام</th>
                  <th className="px-4 py-3 text-start">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-stone-900">{user.displayName}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE_CLASSES[user.role]}`}>
                        {USER_ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE_CLASSES[user.status]}`}>
                        {USER_STATUS_LABELS[user.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{user.emailVerified ? 'نعم' : 'لا'}</td>
                    <td className="px-4 py-3 text-stone-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      {user.role === 'admin' ? (
                        <span className="text-xs text-stone-400">—</span>
                      ) : user.status === 'active' ? (
                        <Button variant="danger" size="sm" onClick={() => setSuspendTarget(user)}>
                          إيقاف
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setReinstateTarget(user)}>
                          إعادة تفعيل
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>

      <SuspendUserModal
        user={suspendTarget}
        isLoading={actionLoading}
        error={actionError}
        onConfirm={handleSuspendConfirm}
        onCancel={() => setSuspendTarget(null)}
      />

      <ConfirmDialog
        isOpen={reinstateTarget !== null}
        title="إعادة تفعيل المستخدم"
        message={`هل تريد إعادة تفعيل حساب "${reinstateTarget?.displayName}"؟ سيتمكن من تسجيل الدخول مجدداً.`}
        confirmLabel="إعادة تفعيل"
        confirmVariant="primary"
        isLoading={actionLoading}
        onConfirm={handleReinstateConfirm}
        onCancel={() => setReinstateTarget(null)}
      />
    </div>
  );
}
