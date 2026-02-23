import { create } from 'zustand';

interface DealsFilterState {
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
    minDiscount: number | null;
    brands: string[];
    primeOnly: boolean;

    setCategory: (category: string) => void;
    setPriceRange: (min: number | null, max: number | null) => void;
    setMinDiscount: (minDiscount: number | null) => void;
    toggleBrand: (brand: string) => void;
    setPrimeOnly: (primeOnly: boolean) => void;
    resetFilters: () => void;
}

export const useDealsFilterStore = create<DealsFilterState>((set) => ({
    category: 'All',
    minPrice: null,
    maxPrice: null,
    minDiscount: null,
    brands: [],
    primeOnly: false,

    setCategory: (category) => set({ category }),
    setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
    setMinDiscount: (minDiscount) => set({ minDiscount }),
    toggleBrand: (brand) => set((state) => ({
        brands: state.brands.includes(brand)
            ? state.brands.filter(b => b !== brand)
            : [...state.brands, brand]
    })),
    setPrimeOnly: (primeOnly) => set({ primeOnly }),
    resetFilters: () => set({
        category: 'All',
        minPrice: null,
        maxPrice: null,
        minDiscount: null,
        brands: [],
        primeOnly: false,
    })
}));
