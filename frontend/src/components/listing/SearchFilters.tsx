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

const SEGMENT_CLASS =
  'flex flex-1 items-center gap-3 px-5 py-3.5 md:border-e md:border-stone-200 md:last-of-type:border-e-0';
const SELECT_CLASS =
  'w-full appearance-none bg-transparent text-sm font-bold text-stone-900 focus:outline-none [&>option]:font-normal';
const LABEL_CLASS = 'block text-[11px] font-semibold text-stone-400';

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true">
      <path
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true">
      <path
        d="M4 21V6l7-3 7 3v15M4 21h16M9 21v-5h4v5M9 10h.01M13 10h.01M9 14h.01M13 14h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true">
      <path
        d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true">
      <path
        d="m20.5 12.5-8 8a1.4 1.4 0 0 1-2 0l-7-7a1.4 1.4 0 0 1 0-2l8-8H18a2.5 2.5 0 0 1 2.5 2.5v6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SearchIcon({ className = 'h-5 w-5 shrink-0 text-brand-400' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onChange({ ...filters, q: keyword || undefined });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col divide-y divide-stone-100 rounded-2xl bg-white md:flex-row md:items-stretch md:divide-y-0"
    >
      <div className={SEGMENT_CLASS}>
        <PinIcon />
        <div className="flex-1">
          <label htmlFor="governorate" className={LABEL_CLASS}>
            المحافظة
          </label>
          <select id="governorate" className={SELECT_CLASS} value={filters.governorateId ?? ''} onChange={handleGovernorateChange}>
            <option value="">كل المحافظات</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={SEGMENT_CLASS}>
        <BuildingIcon />
        <div className="flex-1">
          <label htmlFor="city" className={LABEL_CLASS}>
            المدينة
          </label>
          <select
            id="city"
            className={`${SELECT_CLASS} disabled:text-stone-300`}
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
      </div>

      <div className={SEGMENT_CLASS}>
        <HomeIcon />
        <div className="flex-1">
          <label htmlFor="propertyType" className={LABEL_CLASS}>
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
      </div>

      <div className={SEGMENT_CLASS}>
        <TagIcon />
        <div className="flex-1">
          <label htmlFor="transactionType" className={LABEL_CLASS}>
            نوع الإعلان
          </label>
          <select id="transactionType" className={SELECT_CLASS} value={filters.transactionType ?? ''} onChange={handleTransactionTypeChange}>
            <option value="">الكل</option>
            {TRANSACTION_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`${SEGMENT_CLASS} md:border-e-0`}>
        <SearchIcon />
        <div className="flex-1">
          <label htmlFor="keyword" className={LABEL_CLASS}>
            كلمة مفتاحية
          </label>
          <input
            id="keyword"
            type="search"
            placeholder="عن ماذا تبحث؟"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-2.5 md:flex md:items-center">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:w-auto md:rounded-xl"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-white" />
          بحث
        </button>
      </div>
    </form>
  );
}
