import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { PropertyDetailsGrid } from '../components/listing/PropertyDetailsGrid';
import { ChatInquiryButton } from '../components/listing/ChatInquiryButton';
import { PhotoGallery } from '../components/listing/PhotoGallery';
import { ReportListingModal } from '../components/listing/ReportListingModal';
import { WhatsAppShareButton } from '../components/listing/WhatsAppShareButton';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import * as listingsApi from '../services/api/listings.api';
import * as referenceDataApi from '../services/api/referenceData.api';
import type { Listing } from '../types/listing.types';
import { formatSyp, formatUsd } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '../utils/listingLabels';

const STATUS_LABELS: Record<Listing['status'], string> = {
  active: 'متاح',
  sold_rented: 'مباع / مؤجر',
  archived: 'مؤرشف',
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [governorateName, setGovernorateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    listingsApi
      .getListing(id)
      .then(setListing)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!listing) return;
    referenceDataApi.getGovernorates().then((governorates) => {
      const gov = governorates.find((g) => g.id === listing.governorateId);
      if (gov) setGovernorateName(gov.nameAr);
    });
    referenceDataApi.getCities(listing.governorateId).then((cities) => {
      const city = cities.find((c) => c.id === listing.cityId);
      if (city) setCityName(city.nameAr);
    });
  }, [listing]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-stone-500">الإعلان غير موجود أو تم حذفه.</div>
      </div>
    );
  }

  const isOwnListing = user ? listing.ownerId === user.id : false;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <PhotoGallery photos={listing.photos} />

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {PROPERTY_TYPE_LABELS[listing.propertyType]}
                </span>
                <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600">
                  {TRANSACTION_TYPE_LABELS[listing.transactionType]}
                </span>
                {listing.status !== 'active' && (
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
                    {STATUS_LABELS[listing.status]}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">{listing.title}</h1>
              <p className="mt-1 text-stone-500">
                {listing.neighborhood}
                {cityName ? `، ${cityName}` : ''}
                {governorateName ? `، ${governorateName}` : ''}
              </p>
            </div>

            <Card className="p-5">
              <h2 className="mb-3 font-bold text-stone-900">تفاصيل العقار</h2>
              <PropertyDetailsGrid listing={listing} />
            </Card>

            <Card className="p-5">
              <h2 className="mb-2 font-bold text-stone-900">الوصف</h2>
              <p className="whitespace-pre-line leading-relaxed text-stone-700">{listing.description}</p>
              {listing.addressDetail && (
                <p className="mt-3 text-sm text-stone-500">تفاصيل العنوان: {listing.addressDetail}</p>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="sticky top-20 flex flex-col gap-4 p-5">
              <div>
                {listing.priceUsd != null && (
                  <p className="text-3xl font-extrabold text-brand-700">{formatUsd(listing.priceUsd)}</p>
                )}
                {listing.priceSyp != null && <p className="mt-1 text-stone-500">{formatSyp(listing.priceSyp)}</p>}
              </div>

              <dl className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 text-sm">
                <div>
                  <dt className="text-stone-500">المساحة</dt>
                  <dd className="font-semibold text-stone-900">{listing.areaSqm} م²</dd>
                </div>
                <div>
                  <dt className="text-stone-500">تاريخ النشر</dt>
                  <dd className="font-semibold text-stone-900">{formatDate(listing.createdAt)}</dd>
                </div>
              </dl>

              {!isOwnListing && listing.status === 'active' && <ChatInquiryButton listingId={listing.id} />}
              {isOwnListing && (
                <p className="rounded-xl bg-stone-50 p-3 text-center text-sm text-stone-500">هذا إعلانك الخاص</p>
              )}

              <WhatsAppShareButton listing={listing} />

              {!isOwnListing && user && (
                <Button variant="ghost" size="sm" onClick={() => setReportModalOpen(true)}>
                  الإبلاغ عن هذا الإعلان
                </Button>
              )}
            </Card>
          </div>
        </div>
      </main>

      <ReportListingModal isOpen={reportModalOpen} listingId={listing.id} onClose={() => setReportModalOpen(false)} />
    </div>
  );
}
