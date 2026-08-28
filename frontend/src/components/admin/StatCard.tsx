import type { ReactNode } from 'react';
import { Card } from '../common/Card';

interface StatCardProps {
  label: string;
  value: ReactNode;
  accent?: 'brand' | 'accent' | 'red' | 'stone';
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps['accent']>, string> = {
  brand: 'text-brand-700',
  accent: 'text-accent-600',
  red: 'text-red-600',
  stone: 'text-stone-900',
};

export function StatCard({ label, value, accent = 'brand' }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${ACCENT_CLASSES[accent]}`}>{value}</p>
    </Card>
  );
}
