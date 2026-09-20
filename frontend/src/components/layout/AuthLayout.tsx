import type { ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 via-stone-50 to-stone-100 px-4 py-12">
      <div className="mb-8">
        <BrandLogo size="lg" />
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
