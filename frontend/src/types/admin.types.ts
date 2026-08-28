import type { UserRole } from './auth.types';

export interface AdminUserSummary {
  id: string;
  email: string;
  displayName: string;
  phone: string | null;
  role: UserRole;
  status: 'active' | 'suspended';
  listingFlagStatus: 'normal' | 'flagged_for_review';
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    suspended: number;
    admins: number;
    flaggedForReview: number;
  };
  listings: {
    total: number;
    active: number;
    soldOrRented: number;
    archived: number;
    byPropertyType: {
      residential: number;
      commercial: number;
      land: number;
    };
  };
  conversations: { total: number };
  messages: { total: number };
}

export type AuditActionType =
  | 'archive_listing'
  | 'remove_listing'
  | 'suspend_user'
  | 'reinstate_user'
  | 'resolve_report'
  | 'update_reference_data'
  | 'update_exchange_rate'
  | 'view_reported_conversation';

export interface AuditLogEntry {
  id: string;
  actionType: AuditActionType;
  targetTable: string | null;
  targetId: string | null;
  targetDisplayName: string | null;
  reason: string | null;
  createdAt: string;
  admin: {
    displayName: string;
    email: string;
  };
}
