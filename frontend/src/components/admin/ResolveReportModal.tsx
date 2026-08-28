import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import type { Report } from '../../types/report.types';

export type ReportResolveAction = 'dismiss' | 'archive' | 'remove';

const ACTION_META: Record<ReportResolveAction, { title: string; confirmLabel: string; variant: 'primary' | 'danger'; message: string }> = {
  dismiss: {
    title: 'تجاهل البلاغ',
    confirmLabel: 'تجاهل',
    variant: 'primary',
    message: 'سيُغلق هذا البلاغ دون اتخاذ أي إجراء على الإعلان.',
  },
  archive: {
    title: 'أرشفة الإعلان',
    confirmLabel: 'أرشفة',
    variant: 'primary',
    message: 'سيتم إخفاء الإعلان من نتائج البحث العامة، ويُغلق البلاغ.',
  },
  remove: {
    title: 'حذف الإعلان',
    confirmLabel: 'حذف نهائي',
    variant: 'danger',
    message: 'سيتم حذف الإعلان نهائياً ولا يمكن التراجع عن هذا الإجراء.',
  },
};

interface ResolveReportModalProps {
  report: Report | null;
  action: ReportResolveAction | null;
  isLoading: boolean;
  error: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export function ResolveReportModal({ report, action, isLoading, error, onConfirm, onCancel }: ResolveReportModalProps) {
  const [note, setNote] = useState('');

  if (!report || !action) return null;
  const meta = ACTION_META[action];

  function handleClose() {
    setNote('');
    onCancel();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onConfirm(note.trim());
  }

  return (
    <Modal isOpen onClose={handleClose} title={meta.title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-stone-600">{meta.message}</p>
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="resolution-note" className="text-sm font-medium text-stone-700">
            ملاحظة (اختياري)
          </label>
          <textarea
            id="resolution-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
            className="rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button type="submit" variant={meta.variant} isLoading={isLoading}>
            {meta.confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
