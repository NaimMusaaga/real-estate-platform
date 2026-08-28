import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import type { AdminUserSummary } from '../../types/admin.types';

interface SuspendUserModalProps {
  user: AdminUserSummary | null;
  isLoading: boolean;
  error: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function SuspendUserModal({ user, isLoading, error, onConfirm, onCancel }: SuspendUserModalProps) {
  const [reason, setReason] = useState('');

  if (!user) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  }

  function handleCancel() {
    setReason('');
    onCancel();
  }

  return (
    <Modal isOpen onClose={handleCancel} title={`إيقاف ${user.displayName}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-stone-600">
          سيُمنع هذا المستخدم من تسجيل الدخول فوراً. الرجاء توضيح السبب — سيُحفظ في سجل التدقيق الإداري.
        </p>
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="suspend-reason" className="text-sm font-medium text-stone-700">
            سبب الإيقاف
          </label>
          <textarea
            id="suspend-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            autoFocus
            className="rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            إلغاء
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading} disabled={!reason.trim()}>
            تأكيد الإيقاف
          </Button>
        </div>
      </form>
    </Modal>
  );
}
