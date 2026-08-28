import { Input } from '../../common/Input';
import {
  COMMERCIAL_SUBTYPE_LABELS,
  FINISHING_CONDITION_LABELS,
  FURNISHING_STATUS_LABELS,
  PAYMENT_TERMS_LABELS,
} from '../../../utils/listingLabels';
import type { ListingDraft } from './types';

interface StepProps {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
}

const SELECT_CLASS =
  'rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

function LabeledSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-stone-700">{label}</label>
      <select className={SELECT_CLASS} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {(Object.entries(options) as [T, string][]).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

export function StepDetails({ draft, update }: StepProps) {
  function updateResidential(patch: Partial<ListingDraft['residential']>) {
    update({ residential: { ...draft.residential, ...patch } });
  }
  function updateCommercial(patch: Partial<ListingDraft['commercial']>) {
    update({ commercial: { ...draft.commercial, ...patch } });
  }
  function updateLand(patch: Partial<ListingDraft['land']>) {
    update({ land: { ...draft.land, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="المساحة (م²)"
        type="number"
        min={1}
        value={draft.areaSqm}
        onChange={(e) => update({ areaSqm: e.target.value })}
        required
      />

      {draft.propertyType === 'residential' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="عدد الغرف"
              type="number"
              min={0}
              value={draft.residential.bedrooms}
              onChange={(e) => updateResidential({ bedrooms: e.target.value })}
              required
            />
            <Input
              label="عدد الحمامات"
              type="number"
              min={0}
              value={draft.residential.bathrooms}
              onChange={(e) => updateResidential({ bathrooms: e.target.value })}
              required
            />
            <Input
              label="الطابق (اختياري)"
              type="number"
              value={draft.residential.floorNumber}
              onChange={(e) => updateResidential({ floorNumber: e.target.value })}
            />
            <Input
              label="عدد الطوابق (اختياري)"
              type="number"
              value={draft.residential.totalFloors}
              onChange={(e) => updateResidential({ totalFloors: e.target.value })}
            />
            <Input
              label="سنة البناء (اختياري)"
              type="number"
              value={draft.residential.buildingYear}
              onChange={(e) => updateResidential({ buildingYear: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <LabeledSelect
              label="حالة الفرش"
              value={draft.residential.furnishingStatus}
              options={FURNISHING_STATUS_LABELS}
              onChange={(v) => updateResidential({ furnishingStatus: v })}
            />
            <LabeledSelect
              label="حالة الإكساء"
              value={draft.residential.finishingCondition}
              options={FINISHING_CONDITION_LABELS}
              onChange={(v) => updateResidential({ finishingCondition: v })}
            />
            <LabeledSelect
              label="طريقة الدفع"
              value={draft.residential.paymentTerms}
              options={PAYMENT_TERMS_LABELS}
              onChange={(v) => updateResidential({ paymentTerms: v })}
            />
          </div>
        </>
      )}

      {draft.propertyType === 'commercial' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledSelect
              label="نوع العقار التجاري"
              value={draft.commercial.commercialSubtype}
              options={COMMERCIAL_SUBTYPE_LABELS}
              onChange={(v) => updateCommercial({ commercialSubtype: v })}
            />
            <Input
              label="الطابق (اختياري)"
              type="number"
              value={draft.commercial.floorNumber}
              onChange={(e) => updateCommercial({ floorNumber: e.target.value })}
            />
          </div>
          <Input
            label="ملاحظات الواجهة (اختياري)"
            value={draft.commercial.frontageNotes}
            onChange={(e) => updateCommercial({ frontageNotes: e.target.value })}
          />
          <LabeledSelect
            label="طريقة الدفع"
            value={draft.commercial.paymentTerms}
            options={PAYMENT_TERMS_LABELS}
            onChange={(v) => updateCommercial({ paymentTerms: v })}
          />
        </>
      )}

      {draft.propertyType === 'land' && (
        <>
          <Input
            label="ملاحظات التصنيف (اختياري)"
            value={draft.land.zoningNotes}
            onChange={(e) => updateLand({ zoningNotes: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              checked={draft.land.utilitiesConnected}
              onChange={(e) => updateLand({ utilitiesConnected: e.target.checked })}
              className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-600"
            />
            الخدمات (ماء/كهرباء) متوفرة
          </label>
          <LabeledSelect
            label="طريقة الدفع"
            value={draft.land.paymentTerms}
            options={PAYMENT_TERMS_LABELS}
            onChange={(v) => updateLand({ paymentTerms: v })}
          />
        </>
      )}
    </div>
  );
}
