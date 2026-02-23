import { useQuery } from '@tanstack/react-query';
import { mockDealsDatabase, DealItem } from '@/lib/mockDealsData';
import { useDealsFilterStore } from '@/store/useDealsFilterStore';

export interface DealsResponse {
    data: DealItem[];
    total: number;
}

type FilterParams = {
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
    minDiscount: number | null;
    brands: string[];
    primeOnly: boolean;
};

const fetchDeals = async (filters: FilterParams, page: number = 1, limit: number = 20): Promise<DealsResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredDeals = [...mockDealsDatabase];

    // Apply Category Filter
    if (filters.category !== 'All') {
        filteredDeals = filteredDeals.filter(d => d.category === filters.category);
    }

    // Apply Prime Filter
    if (filters.primeOnly) {
        filteredDeals = filteredDeals.filter(d => d.isPrimeExclusive);
    }

    // Apply Discount Filter
    if (filters.minDiscount !== null) {
        filteredDeals = filteredDeals.filter(d => d.discountPercentage >= (filters.minDiscount as number));
    }

    // Apply Price Filters
    if (filters.minPrice !== null) {
        filteredDeals = filteredDeals.filter(d => d.discountPrice >= (filters.minPrice as number));
    }
    if (filters.maxPrice !== null) {
        filteredDeals = filteredDeals.filter(d => d.discountPrice <= (filters.maxPrice as number));
    }

    // Apply Brand Filters
    if (filters.brands.length > 0) {
        filteredDeals = filteredDeals.filter(d => filters.brands.includes(d.brand));
    }

    // Pagination
    const start = (page - 1) * limit;
    const paginatedDeals = filteredDeals.slice(start, start + limit);

    return {
        data: paginatedDeals,
        total: filteredDeals.length,
    };
};

export const useDealsQuery = (page: number = 1, limit: number = 20) => {
    // We subscribe to the store state here so the query invalidates nicely
    // In a real app we might pass these as explicit arguments to the hook
    const { category, minPrice, maxPrice, minDiscount, brands, primeOnly } = useDealsFilterStore();

    const filters = { category, minPrice, maxPrice, minDiscount, brands, primeOnly };

    return useQuery({
        queryKey: ['deals', filters, page, limit],
        queryFn: () => fetchDeals(filters, page, limit),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
};
