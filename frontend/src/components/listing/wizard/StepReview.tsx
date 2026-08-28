import {
  COMMERCIAL_SUBTYPE_LABELS,
  FINISHING_CONDITION_LABELS,
  FURNISHING_STATUS_LABELS,
  PAYMENT_TERMS_LABELS,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
} from '../../../utils/listingLabels';
import { formatSyp, formatUsd } from '../../../utils/formatPrice';
import type { ListingDraft } from './types';

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="font-semibold text-stone-900">{value}</dd>
    </div>
  );
}

export function StepReview({ draft }: { draft: ListingDraft }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="rounded-xl bg-stone-50 p-4">
        <h3 className="mb-2 font-bold text-stone-900">{draft.title || '(بدون عنوان)'}</h3>
        <p className="text-stone-600">{draft.description || '(بدون وصف)'}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ReviewItem label="النوع" value={draft.propertyType ? PROPERTY_TYPE_LABELS[draft.propertyType] : '—'} />
        <ReviewItem label="نوع الإعلان" value={draft.transactionType ? TRANSACTION_TYPE_LABELS[draft.transactionType] : '—'} />
        <ReviewItem label="المساحة" value={draft.areaSqm ? `${draft.areaSqm} م²` : '—'} />
        <ReviewItem label="الحي" value={draft.neighborhood || '—'} />
        <ReviewItem label="السعر ($)" value={draft.priceUsd ? formatUsd(Number(draft.priceUsd)) : '—'} />
        <ReviewItem label="السعر (ل.س)" value={draft.priceSyp ? formatSyp(Number(draft.priceSyp)) : '—'} />

        {draft.propertyType === 'residential' && (
          <>
            <ReviewItem label="عدد الغرف" value={draft.residential.bedrooms || '—'} />
            <ReviewItem label="عدد الحمامات" value={draft.residential.bathrooms || '—'} />
            <ReviewItem label="حالة الفرش" value={FURNISHING_STATUS_LABELS[draft.residential.furnishingStatus]} />
            <ReviewItem label="حالة الإكساء" value={FINISHING_CONDITION_LABELS[draft.residential.finishingCondition]} />
            <ReviewItem label="طريقة الدفع" value={PAYMENT_TERMS_LABELS[draft.residential.paymentTerms]} />
          </>
        )}
        {draft.propertyType === 'commercial' && (
          <>
            <ReviewItem label="نوع العقار" value={COMMERCIAL_SUBTYPE_LABELS[draft.commercial.commercialSubtype]} />
            <ReviewItem label="طريقة الدفع" value={PAYMENT_TERMS_LABELS[draft.commercial.paymentTerms]} />
          </>
        )}
        {draft.propertyType === 'land' && (
          <>
            <ReviewItem label="الخدمات" value={draft.land.utilitiesConnected ? 'متوفرة' : 'غير متوفرة'} />
            <ReviewItem label="طريقة الدفع" value={PAYMENT_TERMS_LABELS[draft.land.paymentTerms]} />
          </>
        )}
      </dl>
    </div>
  );
}
