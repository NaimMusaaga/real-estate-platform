import { Link } from 'react-router-dom';
import type { Listing } from '../../types/listing.types';
import { formatSyp, formatUsd } from '../../utils/formatPrice';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '../../utils/listingLabels';

interface ListingCardProps {
  listing: Listing;
  governorateName?: string;
}

export function ListingCard({ listing, governorateName }: ListingCardProps) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Photos are intentionally not shown on the card — they open on the detail page. */}
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50 text-brand-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" aria-hidden="true">
          <path
            d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {PROPERTY_TYPE_LABELS[listing.propertyType]}
          </span>
          <span className="rounded-full bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-600">
            {TRANSACTION_TYPE_LABELS[listing.transactionType]}
          </span>
        </div>

        <h3 className="line-clamp-1 font-bold text-stone-900 group-hover:text-brand-700">{listing.title}</h3>
        <p className="text-sm text-stone-500">
          {listing.neighborhood}
          {governorateName ? `، ${governorateName}` : ''}
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {listing.priceUsd != null && (
              <p className="text-lg font-extrabold text-brand-700">{formatUsd(listing.priceUsd)}</p>
            )}
            {listing.priceSyp != null && <p className="text-xs text-stone-500">{formatSyp(listing.priceSyp)}</p>}
          </div>
          <span className="text-sm font-medium text-stone-500">{listing.areaSqm} م²</span>
        </div>
      </div>
    </Link>
  );
}
