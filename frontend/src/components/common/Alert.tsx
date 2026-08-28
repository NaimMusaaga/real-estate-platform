import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-brand-50 text-brand-800 border-brand-200',
  info: 'bg-stone-100 text-stone-700 border-stone-200',
};

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
