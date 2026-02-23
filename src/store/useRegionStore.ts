import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CountryCode = 'US' | 'EU' | 'BD';
export type CurrencyCode = 'USD' | 'EUR' | 'BDT';

export interface RegionConfig {
    currency: CurrencyCode;
    locale: string;
    taxRate: number;
    shippingRegion: string;
}

const REGION_MAP: Record<CountryCode, RegionConfig> = {
    US: { currency: 'USD', locale: 'en-US', taxRate: 0.08, shippingRegion: 'North America' },
    EU: { currency: 'EUR', locale: 'en-GB', taxRate: 0.20, shippingRegion: 'Europe' },
    BD: { currency: 'BDT', locale: 'bn-BD', taxRate: 0.15, shippingRegion: 'South Asia' }
};

interface RegionState {
    country: CountryCode;
    currency: CurrencyCode;
    locale: string;
    taxRate: number;
    shippingRegion: string;

    setCountry: (country: CountryCode) => void;
    setCurrency: (currency: CurrencyCode) => void;
}

export const useRegionStore = create<RegionState>()(
    persist(
        (set) => ({
            country: 'US',
            currency: 'USD',
            locale: 'en-US',
            taxRate: 0.08,
            shippingRegion: 'North America',

            setCountry: (country) => {
                const config = REGION_MAP[country];
                set({
                    country,
                    currency: config.currency,
                    locale: config.locale,
                    taxRate: config.taxRate,
                    shippingRegion: config.shippingRegion
                });
            },

            setCurrency: (currency) => set({ currency })
        }),
        {
            name: 'velora-global-region',
        }
    )
);
