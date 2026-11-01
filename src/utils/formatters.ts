/**
 * Utility functions for Persian digits and localized number formatting.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts any standard Latin digits in a string or number to Persian digits.
 */
export function toPersianDigits(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

/**
 * Formats a number with comma thousand separators and converts to Persian digits.
 */
export function formatPersianNumber(num: number, decimals = 0): string {
  if (isNaN(num)) return '۰';
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  const result = parts.length > 1 && decimals > 0 ? `${integerPart}٫${parts[1]}` : integerPart;
  return toPersianDigits(result);
}

/**
 * Formats a currency amount in USD with Persian digits and suffix.
 */
export function formatPersianCurrency(amount: number, suffix = 'دلار'): string {
  return `${formatPersianNumber(amount)} ${suffix}`;
}

/**
 * Formats a percentage with Persian digits, optionally with +/- sign.
 */
export function formatPersianPercent(value: number, includeSign = false): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = toPersianDigits(absValue.toFixed(1).replace('.', '٫'));
  
  if (includeSign) {
    if (isNegative) {
      return `−${formatted}٪`;
    }
    return `+${formatted}٪`;
  }
  return `${formatted}٪`;
}
