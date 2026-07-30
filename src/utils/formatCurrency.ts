import { CurrencyMode } from '../types';

/**
 * Formats a monetary value into Indian Rupees (INR) using Indian grouping standard or shorthand.
 * @param value The amount in INR
 * @param mode 'full' for exact en-IN string (e.g., ₹24,50,000) or 'short' for Indian shorthand (e.g., ₹24.5L, ₹1.2Cr)
 */
export function formatCurrency(value: number, mode: CurrencyMode = 'full'): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0';
  }

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const sign = isNegative ? '-' : '';

  if (mode === 'short') {
    if (absValue >= 10000000) {
      // 1 Crore = 1,00,00,000
      const cr = absValue / 10000000;
      return `${sign}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)}Cr`;
    }
    if (absValue >= 100000) {
      // 1 Lakh = 1,00,000
      const lakh = absValue / 100000;
      return `${sign}₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
    }
    if (absValue >= 10000) {
      // Thousands above 10k shorthand e.g. ₹45k
      const k = absValue / 1000;
      return `${sign}₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
    }
    // Below 10,000 use standard formatted number
    return `${sign}₹${Math.round(absValue).toLocaleString('en-IN')}`;
  }

  // Full format using en-IN grouping
  const formatted = Math.round(absValue).toLocaleString('en-IN');
  return `${sign}₹${formatted}`;
}

/**
 * Formats a percentage change for KPI status
 */
export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
