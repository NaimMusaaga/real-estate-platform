import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { SearchFilters } from '../components/listing/SearchFilters';
import { ListingCard } from '../components/listing/ListingCard';
import { Spinner } from '../components/common/Spinner';
import * as listingsApi from '../services/api/listings.api';
import * as referenceDataApi from '../services/api/referenceData.api';
import type { City, Governorate, ListingSearchParams, ListingSearchResponse } from '../types/listing.types';

const PAGE_SIZE = 12;

export default function PublicSearchPage() {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [citiesForFilter, setCitiesForFilter] = useState<City[]>([]);
  const [filters, setFilters] = useState<ListingSearchParams>({ page: 1, limit: PAGE_SIZE });
  const [results, setResults] = useState<ListingSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referenceDataApi.getGovernorates().then(setGovernorates);
  }, []);

  useEffect(() => {
    if (!filters.governorateId) {
      setCitiesForFilter([]);
      return;
    }
    referenceDataApi.getCities(filters.governorateId).then(setCitiesForFilter);
  }, [filters.governorateId]);

  useEffect(() => {
    setLoading(true);
    listingsApi.listListings(filters).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [filters]);

  const governorateNameById = new Map(governorates.map((g) => [g.id, g.nameAr]));

  function handleFiltersChange(next: ListingSearchParams) {
    setFilters({ ...next, page: 1, limit: PAGE_SIZE });
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const currentPage = filters.page ?? 1;
  const totalPages = results ? Math.max(1, Math.ceil(results.totalCount / PAGE_SIZE)) : 1;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <section className="bg-brand-700 px-4 pb-16 pt-12 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">ابحث عن عقارك القادم</h1>
          <p className="mt-2 text-brand-100">آلاف العقارات للبيع والإيجار في جميع المحافظات السورية</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="-mt-10 rounded-2xl border border-stone-200 bg-white p-5 shadow-lg shadow-stone-300/30">
          <SearchFilters governorates={governorates} cities={citiesForFilter} filters={filters} onChange={handleFiltersChange} />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" className="text-brand-600" />
            </div>
          ) : !results || results.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center text-stone-500">
              لا توجد نتائج مطابقة لبحثك. جرّب تعديل الفلاتر.
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm font-medium text-stone-500">{results.totalCount} نتيجة</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.items.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} governorateName={governorateNameById.get(listing.governorateId)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    السابق
                  </button>
                  <span className="text-sm text-stone-600">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
