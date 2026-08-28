export type ReportReason =
  | 'fraudulent'
  | 'duplicate'
  | 'sold_still_listed'
  | 'inappropriate'
  | 'wrong_info'
  | 'harassment'
  | 'other';

export type ReportStatus = 'pending' | 'resolved_actioned' | 'resolved_dismissed';

export interface Report {
  id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  reporter: {
    displayName: string;
    email: string;
  };
  listing: {
    id: string;
    title: string;
    status: string;
  } | null;
}

export interface CreateReportPayload {
  reportedListingId: string;
  reason: ReportReason;
  description?: string;
}
