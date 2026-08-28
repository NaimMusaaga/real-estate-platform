import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 via-stone-50 to-stone-100 px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-brand-800">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path
            d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-extrabold tracking-tight">منصة العقارات</span>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-lg shadow-stone-200/50">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
