import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import * as reportsApi from '../../services/api/reports.api';
import { REPORT_REASON_LABELS } from '../../utils/reportLabels';
import { getErrorMessage } from '../../utils/errors';
import type { ReportReason } from '../../types/report.types';

const SELECT_CLASS =
  'rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

const REASONS: ReportReason[] = [
  'fraudulent',
  'duplicate',
  'sold_still_listed',
  'inappropriate',
  'wrong_info',
  'harassment',
  'other',
];

interface ReportListingModalProps {
  isOpen: boolean;
  listingId: string;
  onClose: () => void;
}

export function ReportListingModal({ isOpen, listingId, onClose }: ReportListingModalProps) {
  const [reason, setReason] = useState<ReportReason>('fraudulent');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function handleClose() {
    setReason('fraudulent');
    setDescription('');
    setError('');
    setDone(false);
    onClose();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await reportsApi.createReport({ reportedListingId: listingId, reason, description: description || undefined });
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err, 'تعذّر إرسال البلاغ'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="الإبلاغ عن هذا الإعلان">
      {done ? (
        <div className="flex flex-col gap-4">
          <Alert variant="success">تم إرسال بلاغك بنجاح. سيراجعه فريقنا قريباً.</Alert>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              إغلاق
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="report-reason" className="text-sm font-medium text-stone-700">
              سبب الإبلاغ
            </label>
            <select
              id="report-reason"
              className={SELECT_CLASS}
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {REPORT_REASON_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="report-description" className="text-sm font-medium text-stone-700">
              تفاصيل إضافية (اختياري)
            </label>
            <textarea
              id="report-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit" variant="danger" isLoading={submitting}>
              إرسال البلاغ
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
