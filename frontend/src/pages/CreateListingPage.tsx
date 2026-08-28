import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ListingWizard } from '../components/listing/ListingWizard';
import * as listingsApi from '../services/api/listings.api';
import type { CreateListingPayload } from '../types/listing.types';

export default function CreateListingPage() {
  const navigate = useNavigate();

  async function handleSubmit(payload: CreateListingPayload) {
    await listingsApi.createListing(payload);
    navigate('/my-listings');
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-extrabold text-stone-900">إضافة عقار جديد</h1>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <ListingWizard onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
