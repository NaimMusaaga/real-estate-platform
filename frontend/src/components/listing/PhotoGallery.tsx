import { useState } from 'react';
import type { ListingPhoto } from '../../types/listing.types';
import { resolveMediaUrl } from '../../utils/mediaUrl';

function PlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-20 w-20" aria-hidden="true">
      <path
        d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhotoGallery({ photos }: { photos: ListingPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-400 sm:h-80">
        <PlaceholderIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 overflow-hidden rounded-2xl bg-stone-100 sm:h-80">
        <img
          src={resolveMediaUrl(photos[activeIndex].url)}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                'h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                index === activeIndex ? 'border-brand-600' : 'border-transparent',
              ].join(' ')}
            >
              <img src={resolveMediaUrl(photo.url)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
