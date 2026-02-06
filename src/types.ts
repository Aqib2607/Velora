export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number | string; // API might return string
    originalPrice?: number;
    colors?: { name: string; hex: string }[];
    sizes?: string[];
    image_urls: string[];
    rating: number;
    reviews: number;
    category?: string | { name: string }; // Handle both cases (name or object)
    description?: string;
    stock_quantity?: number;
    status?: string;
    is_featured?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'vendor' | 'customer' | 'shop_owner'; // Adjust roles based on your system
    avatar?: string;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number | null;
}
