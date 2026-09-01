import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import { StepLocation } from '../components/listing/wizard/StepLocation';
import { StepDetails } from '../components/listing/wizard/StepDetails';
import { StepPricing } from '../components/listing/wizard/StepPricing';
import { buildPayload, INITIAL_DRAFT } from '../components/listing/wizard/types';
import type { ListingDraft } from '../components/listing/wizard/types';
import * as listingsApi from '../services/api/listings.api';
import type { Listing } from '../types/listing.types';
import { PROPERTY_TYPE_LABELS } from '../utils/listingLabels';
import { getErrorMessage } from '../utils/errors';

function listingToDraft(listing: Listing): ListingDraft {
  return {
    propertyType: listing.propertyType,
    transactionType: listing.transactionType,
    governorateId: listing.governorateId,
    cityId: listing.cityId,
    neighborhood: listing.neighborhood,
    addressDetail: listing.addressDetail ?? '',
    areaSqm: String(listing.areaSqm),
    title: listing.title,
    description: listing.description,
    priceSyp: listing.priceSyp != null ? String(listing.priceSyp) : '',
    priceUsd: listing.priceUsd != null ? String(listing.priceUsd) : '',
    residential: listing.residentialDetails
      ? {
          bedrooms: String(listing.residentialDetails.bedrooms),
          bathrooms: String(listing.residentialDetails.bathrooms),
          floorNumber: listing.residentialDetails.floorNumber != null ? String(listing.residentialDetails.floorNumber) : '',
          totalFloors: listing.residentialDetails.totalFloors != null ? String(listing.residentialDetails.totalFloors) : '',
          furnishingStatus: listing.residentialDetails.furnishingStatus,
          buildingYear: listing.residentialDetails.buildingYear != null ? String(listing.residentialDetails.buildingYear) : '',
          finishingCondition: listing.residentialDetails.finishingCondition,
          paymentTerms: listing.residentialDetails.paymentTerms,
        }
      : INITIAL_DRAFT.residential,
    commercial: listing.commercialDetails
      ? {
          commercialSubtype: listing.commercialDetails.commercialSubtype,
          floorNumber: listing.commercialDetails.floorNumber != null ? String(listing.commercialDetails.floorNumber) : '',
          frontageNotes: listing.commercialDetails.frontageNotes ?? '',
          paymentTerms: listing.commercialDetails.paymentTerms,
        }
      : INITIAL_DRAFT.commercial,
    land: listing.landDetails
      ? {
          zoningNotes: listing.landDetails.zoningNotes ?? '',
          utilitiesConnected: listing.landDetails.utilitiesConnected,
          paymentTerms: listing.landDetails.paymentTerms,
        }
      : INITIAL_DRAFT.land,
  };
}

function isDraftValid(draft: ListingDraft): boolean {
  if (!draft.governorateId || !draft.cityId || !draft.neighborhood.trim()) return false;
  if (!draft.areaSqm || Number(draft.areaSqm) <= 0) return false;
  if (draft.propertyType === 'residential' && (draft.residential.bedrooms === '' || draft.residential.bathrooms === '')) return false;
  if (!draft.title.trim() || !draft.description.trim()) return false;
  if (!draft.priceSyp && !draft.priceUsd) return false;
  return true;
}

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    listingsApi
      .getListing(id)
      .then((listing) => {
        setOwnerId(listing.ownerId);
        setDraft(listingToDraft(listing));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const canEdit = !!user && (user.role === 'admin' || user.id === ownerId);

  function update(patch: Partial<ListingDraft>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleSubmit() {
    if (!id || !draft) return;
    setError('');
    setSaving(true);
    try {
      const { propertyType: _propertyType, ...payload } = buildPayload(draft);
      await listingsApi.updateListing(id, payload);
      navigate('/my-listings');
    } catch (err) {
      setError(getErrorMessage(err, 'تعذّر حفظ التعديلات'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  if (notFound || !draft || !canEdit) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-stone-500">
          {notFound || !draft ? 'تعذّر تحميل الإعلان. قد يكون محذوفاً.' : 'لا تملك صلاحية تعديل هذا الإعلان.'}
        </div>
      </div>
    );
  }

  const canSave = isDraftValid(draft);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">تعديل الإعلان</h1>
            <p className="mt-1 text-sm text-stone-500">
              نوع العقار:{' '}
              <span className="font-semibold text-stone-700">
                {draft.propertyType ? PROPERTY_TYPE_LABELS[draft.propertyType] : ''}
              </span>{' '}
              (لا يمكن تغييره بعد النشر)
            </p>
          </div>
          <Link to="/my-listings" className="text-sm font-semibold text-brand-700 hover:underline">
            إلغاء
          </Link>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold text-stone-900">الموقع</h2>
            <StepLocation draft={draft} update={update} />
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold text-stone-900">التفاصيل</h2>
            <StepDetails draft={draft} update={update} />
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold text-stone-900">السعر والوصف</h2>
            <StepPricing draft={draft} update={update} />
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/my-listings')}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} isLoading={saving} disabled={!canSave}>
              حفظ التعديلات
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
