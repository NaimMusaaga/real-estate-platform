export function formatSyp(amount: number): string {
  return `${new Intl.NumberFormat('ar-SY').format(amount)} ل.س`;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
