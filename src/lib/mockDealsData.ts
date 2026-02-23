export interface DealItem {
    id: string;
    title: string;
    image: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    rating: number;
    reviewsCount: number;
    isPrimeExclusive: boolean;
    isLightningDeal: boolean;
    stockTotal: number;
    stockRemaining: number;
    category: string;
    brand: string;
    endTimeISO: string;
}

export const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Gaming'];
export const BRANDS = ['TechVision', 'StyleCore', 'HomePlus', 'Glow', 'GamePro'];

const generateMockDeals = (count: number): DealItem[] => {
    return Array.from({ length: count }).map((_, i) => {
        const originalPrice = Math.floor(Math.random() * 500) + 20;
        const discountPercentage = Math.floor(Math.random() * 60) + 10;
        const discountPrice = Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));

        // Random stock simulation
        const stockTotal = Math.floor(Math.random() * 500) + 50;
        const stockRemaining = Math.floor(Math.random() * stockTotal);

        // End time (between 1 and 24 hours from now)
        const hoursRemaining = Math.floor(Math.random() * 24) + 1;
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + hoursRemaining);

        return {
            id: `deal-${i + 1}-${Date.now()}`,
            title: `Premium Velora Product Model ${i + 100} - High Quality Guarantee`,
            image: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&q=80&w=400`,
            originalPrice,
            discountPrice,
            discountPercentage,
            rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
            reviewsCount: Math.floor(Math.random() * 2000) + 10,
            isPrimeExclusive: Math.random() > 0.7,
            isLightningDeal: Math.random() > 0.6,
            stockTotal,
            stockRemaining,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
            endTimeISO: endTime.toISOString(),
        };
    });
};

export const mockDealsDatabase = generateMockDeals(200);
