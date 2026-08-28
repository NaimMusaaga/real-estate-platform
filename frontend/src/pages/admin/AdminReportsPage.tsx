import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Spinner } from '../../components/common/Spinner';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { ResolveReportModal } from '../../components/admin/ResolveReportModal';
import type { ReportResolveAction } from '../../components/admin/ResolveReportModal';
import * as reportsApi from '../../services/api/reports.api';
import type { Report } from '../../types/report.types';
import { REPORT_REASON_LABELS } from '../../utils/reportLabels';
import { formatDateTime } from '../../utils/formatDate';
import { getErrorMessage } from '../../utils/errors';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [pending, setPending] = useState<{ report: Report; action: ReportResolveAction } | null>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    reportsApi
      .listReports('pending')
      .then(setReports)
      .catch((err) => setListError(getErrorMessage(err, 'تعذّر تحميل البلاغات')))
      .finally(() => setLoading(false));
  }

  async function handleConfirm(note: string) {
    if (!pending) return;
    setActionError('');
    setActionLoading(true);
    try {
      if (pending.action === 'dismiss') {
        await reportsApi.dismissReport(pending.report.id, note || undefined);
      } else {
        await reportsApi.actionReport(pending.report.id, pending.action, note || undefined);
      }
      setPending(null);
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'تعذّر تنفيذ الإجراء'));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-stone-900">البلاغات</h1>
        <AdminTabs />

        {listError && (
          <div className="mb-6">
            <Alert variant="error">{listError}</Alert>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center text-stone-500">
            لا يوجد بلاغات قيد المراجعة حالياً.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      {REPORT_REASON_LABELS[report.reason]}
                    </span>
                    {report.listing ? (
                      <Link
                        to={`/listings/${report.listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 font-bold text-stone-900 hover:text-brand-700"
                      >
                        {report.listing.title}
                      </Link>
                    ) : (
                      <span className="ms-2 text-stone-500">(الإعلان محذوف)</span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400">{formatDateTime(report.createdAt)}</span>
                </div>

                <p className="text-sm text-stone-500">
                  بلّغ عنه: {report.reporter.displayName} ({report.reporter.email})
                </p>

                {report.description && <p className="rounded-xl bg-stone-50 p-3 text-sm text-stone-700">{report.description}</p>}

                <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                  <Button variant="outline" size="sm" onClick={() => setPending({ report, action: 'dismiss' })}>
                    تجاهل
                  </Button>
                  {report.listing && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setPending({ report, action: 'archive' })}>
                        أرشفة الإعلان
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setPending({ report, action: 'remove' })}>
                        حذف الإعلان
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ResolveReportModal
        report={pending?.report ?? null}
        action={pending?.action ?? null}
        isLoading={actionLoading}
        error={actionError}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
