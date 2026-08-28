import type { PropertyType, TransactionType } from '../../../types/listing.types';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '../../../utils/listingLabels';
import type { ListingDraft } from './types';

interface StepProps {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
}

const PROPERTY_TYPES = Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][];
const TRANSACTION_TYPES = Object.entries(TRANSACTION_TYPE_LABELS) as [TransactionType, string][];

function OptionButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-4 text-center font-semibold transition-colors ${
        active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-600 hover:border-stone-300'
      }`}
    >
      {label}
    </button>
  );
}

export function StepPropertyType({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-bold text-stone-900">ما نوع العقار؟</h3>
        <div className="grid grid-cols-3 gap-3">
          {PROPERTY_TYPES.map(([value, label]) => (
            <OptionButton key={value} label={label} active={draft.propertyType === value} onClick={() => update({ propertyType: value })} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-bold text-stone-900">هل هو للبيع أم للإيجار؟</h3>
        <div className="grid grid-cols-2 gap-3">
          {TRANSACTION_TYPES.map(([value, label]) => (
            <OptionButton
              key={value}
              label={label}
              active={draft.transactionType === value}
              onClick={() => update({ transactionType: value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
