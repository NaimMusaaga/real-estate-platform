import { useEffect, useState } from 'react';
import { Input } from '../../common/Input';
import * as referenceDataApi from '../../../services/api/referenceData.api';
import type { City, Governorate } from '../../../types/listing.types';
import type { ListingDraft } from './types';

interface StepProps {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
}

const SELECT_CLASS =
  'rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

export function StepLocation({ draft, update }: StepProps) {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    referenceDataApi.getGovernorates().then(setGovernorates);
  }, []);

  useEffect(() => {
    if (!draft.governorateId) {
      setCities([]);
      return;
    }
    referenceDataApi.getCities(draft.governorateId).then(setCities);
  }, [draft.governorateId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="governorateId" className="text-sm font-medium text-stone-700">
            المحافظة
          </label>
          <select
            id="governorateId"
            className={SELECT_CLASS}
            value={draft.governorateId ?? ''}
            onChange={(e) => update({ governorateId: e.target.value ? Number(e.target.value) : null, cityId: null })}
          >
            <option value="">اختر المحافظة</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameAr}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cityId" className="text-sm font-medium text-stone-700">
            المدينة
          </label>
          <select
            id="cityId"
            className={SELECT_CLASS}
            value={draft.cityId ?? ''}
            onChange={(e) => update({ cityId: e.target.value ? Number(e.target.value) : null })}
            disabled={!draft.governorateId}
          >
            <option value="">اختر المدينة</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input label="الحي" value={draft.neighborhood} onChange={(e) => update({ neighborhood: e.target.value })} required />
      <Input
        label="تفاصيل العنوان (اختياري)"
        value={draft.addressDetail}
        onChange={(e) => update({ addressDetail: e.target.value })}
      />
    </div>
  );
}
