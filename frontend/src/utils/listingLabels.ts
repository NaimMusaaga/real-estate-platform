import type {
  CommercialSubtype,
  FinishingCondition,
  FurnishingStatus,
  PaymentTerms,
  PropertyType,
  TransactionType,
} from '../types/listing.types';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  residential: 'سكني',
  commercial: 'تجاري',
  land: 'أرض',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  sale: 'للبيع',
  rent: 'للإيجار',
};

export const FURNISHING_STATUS_LABELS: Record<FurnishingStatus, string> = {
  furnished: 'مفروش',
  unfurnished: 'غير مفروش',
  semi_furnished: 'مفروش جزئياً',
};

export const FINISHING_CONDITION_LABELS: Record<FinishingCondition, string> = {
  unfinished: 'على العظم',
  semi_finished: 'إكساء جزئي',
  fully_finished: 'إكساء كامل',
};

export const PAYMENT_TERMS_LABELS: Record<PaymentTerms, string> = {
  cash: 'كاش',
  installments: 'تقسيط',
  both: 'كاش أو تقسيط',
};

export const COMMERCIAL_SUBTYPE_LABELS: Record<CommercialSubtype, string> = {
  shop: 'محل',
  office: 'مكتب',
  warehouse: 'مستودع',
  other: 'أخرى',
};
