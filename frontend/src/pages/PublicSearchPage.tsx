import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchFilters } from '../components/listing/SearchFilters';
import { ListingCard } from '../components/listing/ListingCard';
import { Spinner } from '../components/common/Spinner';
import * as listingsApi from '../services/api/listings.api';
import * as referenceDataApi from '../services/api/referenceData.api';
import * as statsApi from '../services/api/stats.api';
import type { City, Governorate, ListingSearchParams, ListingSearchResponse, PropertyType } from '../types/listing.types';
import type { PublicStats } from '../types/stats.types';

const PAGE_SIZE = 12;

const CATEGORIES: { type: PropertyType; label: string; description: string; icon: JSX.Element }[] = [
  {
    type: 'residential',
    label: 'سكني',
    description: 'شقق، فلل، وبيوت للبيع والإيجار',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path
          d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    type: 'commercial',
    label: 'تجاري',
    description: 'محلات، مكاتب، ومستودعات',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path
          d="M4 21V9l8-5 8 5v12M4 21h16M9 21v-6h6v6M9 12h.01M15 12h.01M9 9h.01M15 9h.01"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    type: 'land',
    label: 'أرض',
    description: 'قطع أراضٍ سكنية واستثمارية',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path
          d="M3 20h18M4 20l3-11 4 4 3-6 3 9 3-4v8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const HIGHLIGHTS = [
  {
    title: 'محادثة مباشرة مع المالك',
    description: 'تواصل فوري ولحظي مع صاحب العقار بدون وسطاء، مع إشعارات القراءة وحالة الاتصال.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path
          d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.95L3 20l1.05-4.15A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'إعلانات موثوقة وواضحة',
    description: 'تفاصيل دقيقة لكل عقار حسب نوعه، مع نظام إبلاغ يحافظ على جودة الإعلانات المعروضة.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path
          d="M12 3 4 6.5v5c0 4.6 3.2 8.4 8 9.5 4.8-1.1 8-4.9 8-9.5v-5L12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'عرض بالليرة والدولار معاً',
    description: 'كل سعر معروض بالعملتين حسب ما يحدده صاحب الإعلان، لتقارن بوضوح تام.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v10M9.5 9.5c0-1 1-1.8 2.5-1.8s2.5.7 2.5 1.6c0 2.2-5 1-5 3.2 0 .9 1 1.6 2.5 1.6s2.5-.8 2.5-1.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function PublicSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [citiesForFilter, setCitiesForFilter] = useState<City[]>([]);
  const [filters, setFilters] = useState<ListingSearchParams>(() => {
    const propertyType = searchParams.get('propertyType') as PropertyType | null;
    return { page: 1, limit: PAGE_SIZE, propertyType: propertyType ?? undefined };
  });
  const [results, setResults] = useState<ListingSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    referenceDataApi.getGovernorates().then(setGovernorates);
    statsApi.getPublicStats().then(setStats).catch(() => setStats(null));
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
    setSearchParams(next.propertyType ? { propertyType: next.propertyType } : {});
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  }

  const currentPage = filters.page ?? 1;
  const totalPages = results ? Math.max(1, Math.ceil(results.totalCount / PAGE_SIZE)) : 1;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800 px-4 pb-24 pt-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-accent-400/40 bg-accent-400/10 px-4 py-1 text-xs font-semibold tracking-wide text-accent-400">
            منصة العقارات السورية الأولى للتواصل المباشر
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
            ابحث عن عقارك القادم <span className="text-accent-400">بثقة وسهولة</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-200 sm:text-lg">
            آلاف العقارات للبيع والإيجار في جميع المحافظات السورية — تواصل مباشرة مع المالك، بدون وسطاء.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.type}
                onClick={() => handleFiltersChange({ ...filters, propertyType: cat.type })}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-accent-400/60 hover:bg-accent-400/20 hover:text-accent-400"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => handleFiltersChange({ page: 1, limit: PAGE_SIZE })}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-accent-400/60 hover:bg-accent-400/20 hover:text-accent-400"
            >
              كل العقارات
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* Search bar, overlapping the hero */}
        <div className="-mt-14 rounded-2xl border border-stone-200 bg-white p-5 shadow-xl shadow-brand-950/10">
          <SearchFilters governorates={governorates} cities={citiesForFilter} filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* Stats banner */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-brand-800">{stats ? stats.activeListingsCount : '—'}</p>
            <p className="mt-1 text-sm font-medium text-stone-500">عقار نشط معروض حالياً</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-brand-800">{stats ? stats.activeUsersCount : '—'}</p>
            <p className="mt-1 text-sm font-medium text-stone-500">مستخدم على المنصة</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-brand-800">٥</p>
            <p className="mt-1 text-sm font-medium text-stone-500">محافظات مغطاة</p>
          </div>
        </div>

        {/* Featured categories */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-stone-900">تصفح حسب نوع العقار</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                to={`/?propertyType=${cat.type}`}
                onClick={() => handleFiltersChange({ ...filters, propertyType: cat.type })}
                className="group flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-accent-400/15 group-hover:text-accent-600">
                  {cat.icon}
                </span>
                <h3 className="text-lg font-bold text-stone-900">{cat.label}</h3>
                <p className="text-sm text-stone-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Why choose us */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold text-stone-900">لماذا منصتنا؟</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/15 text-accent-600">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-bold text-stone-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Results */}
        <section id="results" className="mt-14 scroll-mt-20">
          <h2 className="text-xl font-extrabold text-stone-900">أحدث العقارات</h2>
          <div className="mt-5">
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
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      governorateName={governorateNameById.get(listing.governorateId)}
                    />
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
