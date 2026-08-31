import type { Listing } from '../../types/listing.types';
import { formatSyp, formatUsd } from '../../utils/formatPrice';

interface WhatsAppShareButtonProps {
  listing: Listing;
}

export function WhatsAppShareButton({ listing }: WhatsAppShareButtonProps) {
  const price =
    listing.priceUsd != null ? formatUsd(listing.priceUsd) : listing.priceSyp != null ? formatSyp(listing.priceSyp) : '';
  const message = `${listing.title}${price ? ` - ${price}` : ''}\n${window.location.href}`;
  const href = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#1DA851]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#25D366]" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.33c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.83 2.41a8.15 8.15 0 0 1 2.41 5.82c0 4.54-3.69 8.18-8.24 8.18Zm4.52-6.15c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02s-.44.06-.67.31c-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
      مشاركة عبر واتساب
    </a>
  );
}
