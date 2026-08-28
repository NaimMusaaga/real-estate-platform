import { Link } from 'react-router-dom';
import type { Listing, ListingStatus } from '../../types/listing.types';
import { formatSyp, formatUsd } from '../../utils/formatPrice';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '../../utils/listingLabels';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const STATUS_STYLES: Record<ListingStatus, string> = {
  active: 'bg-green-100 text-green-700',
  sold_rented: 'bg-stone-200 text-stone-600',
  archived: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'نشط',
  sold_rented: 'مباع / مؤجر',
  archived: 'مؤرشف',
};

interface OwnerListingCardProps {
  listing: Listing;
  governorateName?: string;
  onToggleStatus: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
  onManagePhotos: (listing: Listing) => void;
  actionLoading: boolean;
}

export function OwnerListingCard({
  listing,
  governorateName,
  onToggleStatus,
  onDelete,
  onManagePhotos,
  actionLoading,
}: OwnerListingCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      {listing.photos.length > 0 && (
        <div className="-mx-4 -mt-4 h-32 overflow-hidden rounded-t-2xl bg-stone-100">
          <img src={resolveMediaUrl(listing.photos[0].url)} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div>
        <div className="mb-1 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {PROPERTY_TYPE_LABELS[listing.propertyType]}
          </span>
          <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-xs font-semibold text-accent-600">
            {TRANSACTION_TYPE_LABELS[listing.transactionType]}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[listing.status]}`}>
            {STATUS_LABELS[listing.status]}
          </span>
        </div>
        <Link to={`/listings/${listing.id}`} className="font-bold text-stone-900 hover:text-brand-700">
          {listing.title}
        </Link>
        <p className="text-sm text-stone-500">
          {listing.neighborhood}
          {governorateName ? `، ${governorateName}` : ''}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          {listing.priceUsd != null && <span className="font-bold text-brand-700">{formatUsd(listing.priceUsd)}</span>}
          {listing.priceSyp != null && <span className="ms-2 text-stone-500">{formatSyp(listing.priceSyp)}</span>}
        </div>
        <span className="text-stone-500">{listing.areaSqm} م²</span>
      </div>

      <div className="flex gap-2 border-t border-stone-100 pt-3">
        {listing.status === 'active' && (
          <Button variant="outline" size="sm" onClick={() => onToggleStatus(listing)} isLoading={actionLoading}>
            وضع كمباع / مؤجر
          </Button>
        )}
        {listing.status === 'sold_rented' && (
          <Button variant="outline" size="sm" onClick={() => onToggleStatus(listing)} isLoading={actionLoading}>
            إعادة التنشيط
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onManagePhotos(listing)}>
          الصور {listing.photos.length > 0 && `(${listing.photos.length})`}
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(listing)}>
          حذف
        </Button>
      </div>
    </Card>
  );
}
