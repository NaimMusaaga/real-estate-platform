import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Spinner';
import * as listingsApi from '../../services/api/listings.api';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { getErrorMessage } from '../../utils/errors';
import type { Listing, ListingPhoto } from '../../types/listing.types';

const MAX_PHOTOS = 8;

interface PhotoManagerModalProps {
  listing: Listing | null;
  onClose: () => void;
  onPhotosChange: (listingId: string, photos: ListingPhoto[]) => void;
}

export function PhotoManagerModal({ listing, onClose, onPhotosChange }: PhotoManagerModalProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!listing) return null;

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0 || !listing) return;
    setError('');
    setUploading(true);
    try {
      const photos = await listingsApi.uploadListingPhotos(listing.id, files);
      onPhotosChange(listing.id, photos);
    } catch (err) {
      setError(getErrorMessage(err, 'تعذّر رفع الصور'));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photoId: string) {
    if (!listing) return;
    setError('');
    setDeletingId(photoId);
    try {
      await listingsApi.deleteListingPhoto(listing.id, photoId);
      onPhotosChange(
        listing.id,
        listing.photos.filter((p) => p.id !== photoId),
      );
    } catch (err) {
      setError(getErrorMessage(err, 'تعذّر حذف الصورة'));
    } finally {
      setDeletingId(null);
    }
  }

  const canAddMore = listing.photos.length < MAX_PHOTOS;

  return (
    <Modal isOpen onClose={onClose} title={`صور: ${listing.title}`}>
      <div className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}

        {listing.photos.length === 0 ? (
          <p className="text-sm text-stone-500">لا يوجد صور بعد. الصور اختيارية لكنها تزيد فرص التواصل مع المهتمين.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {listing.photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                <img src={resolveMediaUrl(photo.url)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="absolute inset-0 flex items-center justify-center bg-stone-900/60 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
                >
                  {deletingId === photo.id ? <Spinner size="sm" /> : 'حذف'}
                </button>
              </div>
            ))}
          </div>
        )}

        {canAddMore ? (
          <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-stone-300 py-6 text-sm font-semibold text-stone-500 hover:border-brand-400 hover:text-brand-600">
            {uploading ? <Spinner size="sm" /> : `إضافة صور (${listing.photos.length}/${MAX_PHOTOS})`}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <p className="text-center text-xs text-stone-400">وصلت للحد الأقصى ({MAX_PHOTOS} صور)</p>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </Modal>
  );
}
