import { CurrencyCode } from '@/store/useRegionStore';

// Static conversion rates relative to USD (Base: USD)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
    USD: 1,
    EUR: 0.92,
    BDT: 110.50,
};

/**
 * Executes a raw mathematical conversion from a USD base price to a formatted target currency float.
 */
export const convertAmount = (amountInUSD: number, targetCurrency: CurrencyCode): number => {
    const rate = EXCHANGE_RATES[targetCurrency] || 1;
    return amountInUSD * rate;
};

/**
 * Returns a human-readable, locale-aware currency string (e.g., "$1,200.00" vs "1.200,00 €" vs "৳১,২০০.০০").
 */
export const formatCurrency = (amountInTargetCurrency: number, currency: CurrencyCode, locale: string): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amountInTargetCurrency);
};

/**
 * Comprehensive utility blending both operations: mathematically converts from USD and formats string in one step.
 */
export const convertAndFormat = (amountInUSD: number, targetCurrency: CurrencyCode, locale: string): string => {
    const converted = convertAmount(amountInUSD, targetCurrency);
    return formatCurrency(converted, targetCurrency, locale);
};
