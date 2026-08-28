import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { OwnerListingCard } from '../components/listing/OwnerListingCard';
import { PhotoManagerModal } from '../components/listing/PhotoManagerModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import * as listingsApi from '../services/api/listings.api';
import * as referenceDataApi from '../services/api/referenceData.api';
import type { Listing, ListingPhoto } from '../types/listing.types';

export default function MyListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [governorateNames, setGovernorateNames] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Listing | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [photoManagerListingId, setPhotoManagerListingId] = useState<string | null>(null);

  useEffect(() => {
    load();
    referenceDataApi.getGovernorates().then((govs) => {
      setGovernorateNames(new Map(govs.map((g) => [g.id, g.nameAr])));
    });
  }, []);

  function load() {
    setLoading(true);
    listingsApi.listMyListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }

  async function handleToggleStatus(listing: Listing) {
    setActionLoadingId(listing.id);
    try {
      const newStatus = listing.status === 'active' ? 'sold_rented' : 'active';
      await listingsApi.updateListing(listing.id, { status: newStatus });
      load();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleteLoading(true);
    try {
      await listingsApi.deleteListing(pendingDelete.id);
      setPendingDelete(null);
      load();
    } finally {
      setDeleteLoading(false);
    }
  }

  function handlePhotosChange(listingId: string, photos: ListingPhoto[]) {
    setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, photos } : l)));
  }

  const photoManagerListing = listings.find((l) => l.id === photoManagerListingId) ?? null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-stone-900">إعلاناتي</h1>
          <Button onClick={() => navigate('/create-listing')}>إضافة عقار جديد</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center text-stone-500">
            لا يوجد لديك إعلانات بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <OwnerListingCard
                key={listing.id}
                listing={listing}
                governorateName={governorateNames.get(listing.governorateId)}
                onToggleStatus={handleToggleStatus}
                onDelete={setPendingDelete}
                onManagePhotos={(l) => setPhotoManagerListingId(l.id)}
                actionLoading={actionLoadingId === listing.id}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="حذف الإعلان"
        message={`هل أنت متأكد من حذف "${pendingDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        isLoading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <PhotoManagerModal
        listing={photoManagerListing}
        onClose={() => setPhotoManagerListingId(null)}
        onPhotosChange={handlePhotosChange}
      />
    </div>
  );
}
