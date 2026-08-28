import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { City, Governorate, ListingSearchParams, PropertyType, TransactionType } from '../../types/listing.types';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '../../utils/listingLabels';

interface SearchFiltersProps {
  governorates: Governorate[];
  cities: City[];
  filters: ListingSearchParams;
  onChange: (filters: ListingSearchParams) => void;
}

const PROPERTY_TYPES = Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][];
const TRANSACTION_TYPES = Object.entries(TRANSACTION_TYPE_LABELS) as [TransactionType, string][];

const SELECT_CLASS =
  'rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

export function SearchFilters({ governorates, cities, filters, onChange }: SearchFiltersProps) {
  const [keyword, setKeyword] = useState(filters.q ?? '');

  function handleGovernorateChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onChange({ ...filters, governorateId: value ? Number(value) : undefined, cityId: undefined });
  }

  function handleCityChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onChange({ ...filters, cityId: value ? Number(value) : undefined });
  }

  function handlePropertyTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as PropertyType | '';
    onChange({ ...filters, propertyType: value || undefined });
  }

  function handleTransactionTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as TransactionType | '';
    onChange({ ...filters, transactionType: value || undefined });
  }

  function handleKeywordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onChange({ ...filters, q: keyword || undefined });
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="governorate" className="text-sm font-medium text-stone-700">
          المحافظة
        </label>
        <select
          id="governorate"
          className={SELECT_CLASS}
          value={filters.governorateId ?? ''}
          onChange={handleGovernorateChange}
        >
          <option value="">كل المحافظات</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nameAr}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="city" className="text-sm font-medium text-stone-700">
          المدينة
        </label>
        <select
          id="city"
          className={SELECT_CLASS}
          value={filters.cityId ?? ''}
          onChange={handleCityChange}
          disabled={!filters.governorateId}
        >
          <option value="">كل المدن</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="propertyType" className="text-sm font-medium text-stone-700">
          نوع العقار
        </label>
        <select id="propertyType" className={SELECT_CLASS} value={filters.propertyType ?? ''} onChange={handlePropertyTypeChange}>
          <option value="">كل الأنواع</option>
          {PROPERTY_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="transactionType" className="text-sm font-medium text-stone-700">
          نوع الإعلان
        </label>
        <select
          id="transactionType"
          className={SELECT_CLASS}
          value={filters.transactionType ?? ''}
          onChange={handleTransactionTypeChange}
        >
          <option value="">الكل</option>
          {TRANSACTION_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleKeywordSubmit} className="flex flex-col gap-1.5">
        <label htmlFor="keyword" className="text-sm font-medium text-stone-700">
          بحث
        </label>
        <div className="flex gap-2">
          <input
            id="keyword"
            type="search"
            placeholder="عن ماذا تبحث؟"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={`${SELECT_CLASS} flex-1`}
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            بحث
          </button>
        </div>
      </form>
    </div>
  );
}
