import type { Listing } from '../../types/listing.types';
import {
  COMMERCIAL_SUBTYPE_LABELS,
  FINISHING_CONDITION_LABELS,
  FURNISHING_STATUS_LABELS,
  PAYMENT_TERMS_LABELS,
} from '../../utils/listingLabels';

interface DetailItem {
  label: string;
  value: string;
}

function buildDetailItems(listing: Listing): DetailItem[] {
  if (listing.propertyType === 'residential' && listing.residentialDetails) {
    const d = listing.residentialDetails;
    return [
      { label: 'عدد الغرف', value: String(d.bedrooms) },
      { label: 'عدد الحمامات', value: String(d.bathrooms) },
      ...(d.floorNumber != null ? [{ label: 'الطابق', value: String(d.floorNumber) }] : []),
      ...(d.totalFloors != null ? [{ label: 'عدد الطوابق', value: String(d.totalFloors) }] : []),
      { label: 'حالة الفرش', value: FURNISHING_STATUS_LABELS[d.furnishingStatus] },
      { label: 'حالة الإكساء', value: FINISHING_CONDITION_LABELS[d.finishingCondition] },
      ...(d.buildingYear != null ? [{ label: 'سنة البناء', value: String(d.buildingYear) }] : []),
      { label: 'طريقة الدفع', value: PAYMENT_TERMS_LABELS[d.paymentTerms] },
    ];
  }

  if (listing.propertyType === 'commercial' && listing.commercialDetails) {
    const d = listing.commercialDetails;
    return [
      { label: 'نوع العقار التجاري', value: COMMERCIAL_SUBTYPE_LABELS[d.commercialSubtype] },
      ...(d.floorNumber != null ? [{ label: 'الطابق', value: String(d.floorNumber) }] : []),
      ...(d.frontageNotes ? [{ label: 'الواجهة', value: d.frontageNotes }] : []),
      { label: 'طريقة الدفع', value: PAYMENT_TERMS_LABELS[d.paymentTerms] },
    ];
  }

  if (listing.propertyType === 'land' && listing.landDetails) {
    const d = listing.landDetails;
    return [
      { label: 'الخدمات', value: d.utilitiesConnected ? 'متوفرة (ماء/كهرباء)' : 'غير متوفرة' },
      ...(d.zoningNotes ? [{ label: 'التصنيف', value: d.zoningNotes }] : []),
      { label: 'طريقة الدفع', value: PAYMENT_TERMS_LABELS[d.paymentTerms] },
    ];
  }

  return [];
}

export function PropertyDetailsGrid({ listing }: { listing: Listing }) {
  const items = buildDetailItems(listing);
  if (items.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-stone-50 p-3">
          <dt className="text-xs font-medium text-stone-500">{item.label}</dt>
          <dd className="mt-0.5 font-semibold text-stone-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
