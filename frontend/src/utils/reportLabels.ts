import type { ReportReason, ReportStatus } from '../types/report.types';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  fraudulent: 'إعلان احتيالي',
  duplicate: 'إعلان مكرر',
  sold_still_listed: 'العقار مباع/مؤجر ولا يزال معروضاً',
  inappropriate: 'محتوى غير لائق',
  wrong_info: 'معلومات غير صحيحة',
  harassment: 'مضايقة',
  other: 'سبب آخر',
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'قيد المراجعة',
  resolved_actioned: 'تم اتخاذ إجراء',
  resolved_dismissed: 'تم التجاهل',
};
