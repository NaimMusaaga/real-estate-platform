import { Input } from '../../common/Input';
import type { ListingDraft } from './types';

interface StepProps {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
}

export function StepPricing({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="عنوان الإعلان" value={draft.title} onChange={(e) => update({ title: e.target.value })} required />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-stone-700">
          الوصف
        </label>
        <textarea
          id="description"
          rows={5}
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          className="rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="السعر بالدولار (اختياري)"
          type="number"
          min={0}
          value={draft.priceUsd}
          onChange={(e) => update({ priceUsd: e.target.value })}
          hint="أدخل سعراً واحداً على الأقل"
        />
        <Input
          label="السعر بالليرة السورية (اختياري)"
          type="number"
          min={0}
          value={draft.priceSyp}
          onChange={(e) => update({ priceSyp: e.target.value })}
        />
      </div>
    </div>
  );
}
