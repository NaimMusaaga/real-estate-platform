import { Link } from 'react-router-dom';

interface BrandLogoProps {
  /** `light` swaps the navy wordmark for a white one, for dark backgrounds. */
  variant?: 'default' | 'light';
  size?: 'md' | 'lg';
}

const SIZES = {
  md: { mark: 'h-10', word: 'h-7' },
  lg: { mark: 'h-12', word: 'h-8' },
} as const;

export function BrandLogo({ variant = 'default', size = 'md' }: BrandLogoProps) {
  const s = SIZES[size];
  const wordmark = variant === 'light' ? '/logo-wordmark-light.png' : '/logo-wordmark.png';

  return (
    <Link to="/" aria-label="logai — الصفحة الرئيسية" className="flex items-center gap-2.5">
      <img src="/logo-mark.png" alt="" className={`${s.mark} w-auto`} />
      <img src={wordmark} alt="" className={`${s.word} w-auto`} />
    </Link>
  );
}
