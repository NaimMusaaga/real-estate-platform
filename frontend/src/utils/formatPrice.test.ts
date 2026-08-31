import { describe, expect, it } from 'vitest';
import { formatSyp, formatUsd } from './formatPrice';

describe('formatUsd', () => {
  it('formats a whole-dollar amount with no decimals', () => {
    expect(formatUsd(250)).toBe('$250');
  });

  it('adds thousands separators', () => {
    expect(formatUsd(80000)).toBe('$80,000');
  });

  it('handles zero', () => {
    expect(formatUsd(0)).toBe('$0');
  });
});

describe('formatSyp', () => {
  it('appends the ل.س suffix', () => {
    expect(formatSyp(15000000)).toContain('ل.س');
  });

  it('renders the amount using Arabic-Indic digit grouping', () => {
    // ar-SY formats 15,000,000 as "١٥٬٠٠٠٬٠٠٠" — confirmed against the real
    // Intl output rather than assumed, since digit/separator choice is locale data.
    expect(formatSyp(15000000)).toBe('١٥٬٠٠٠٬٠٠٠ ل.س');
  });
});
