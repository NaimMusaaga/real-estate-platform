import type { UserRole } from '../types/auth.types';
import type { AuditActionType } from '../types/admin.types';

export const USER_STATUS_LABELS: Record<'active' | 'suspended', string> = {
  active: 'نشط',
  suspended: 'موقوف',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: 'مستخدم',
  admin: 'مشرف',
};

export const AUDIT_ACTION_LABELS: Record<AuditActionType, string> = {
  archive_listing: 'أرشفة إعلان',
  remove_listing: 'حذف إعلان',
  suspend_user: 'إيقاف مستخدم',
  reinstate_user: 'إعادة تفعيل مستخدم',
  resolve_report: 'معالجة بلاغ',
  update_reference_data: 'تحديث بيانات مرجعية',
  update_exchange_rate: 'تحديث سعر الصرف',
  view_reported_conversation: 'مراجعة محادثة مبلّغ عنها',
};
