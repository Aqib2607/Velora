import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const allProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro Max",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 2453,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch Ultra Series 9",
    price: 449.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 1832,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Designer Leather Backpack",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 956,
    category: "Fashion",
  },
  {
    id: 4,
    name: "Premium Running Shoes Air Max",
    price: 179.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 3241,
    category: "Fashion",
  },
  {
    id: 5,
    name: "Minimalist Ceramic Vase Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 428,
    category: "Home",
  },
  {
    id: 6,
    name: "Professional Camera Lens 50mm",
    price: 599.00,
    originalPrice: 749.00,
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 1567,
    category: "Electronics",
  },
  {
    id: 7,
    name: "Ergonomic Office Chair Pro",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 892,
    category: "Home",
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    price: 129.99,
    originalPrice: 169.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    rating: 4.4,
    reviews: 2103,
    category: "Electronics",
  },
  {
    id: 9,
    name: "Vintage Leather Wallet",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 734,
    category: "Fashion",
  },
  {
    id: 10,
    name: "Smart Home Security Camera",
    price: 149.00,
    originalPrice: 199.00,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 1289,
    category: "Electronics",
  },
  {
    id: 11,
    name: "Organic Cotton T-Shirt",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    rating: 4.3,
    reviews: 567,
    category: "Fashion",
  },
  {
    id: 12,
    name: "Modern Desk Lamp",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 823,
    category: "Home",
  },
];

const categories = ["All", "Electronics", "Fashion", "Home"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating"];

import { InfiniteScroll } from "@/components/InfiniteScroll";
import { ProductFilters } from "@/components/ProductFilters";
import { AnimatePresence } from "framer-motion";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState(allProducts.slice(0, 8));
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter products based on category (mock logic)
  const filteredProducts = selectedCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate API delay
    setTimeout(() => {
      setDisplayedProducts((prev) => {
        const next = filteredProducts.slice(0, prev.length + 4);
        if (next.length >= filteredProducts.length) setHasMore(false);
        return next;
      });
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our curated collection of premium products
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => { setSelectedCategory(cat); setDisplayedProducts(allProducts.filter(p => cat === "All" || p.category === cat).slice(0, 8)); setHasMore(true); }}
                className={`rounded-full whitespace-nowrap ${selectedCategory === cat ? "gradient-bg" : "glass"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`glass rounded-full gap-2 ${showFilters ? 'bg-primary/10 border-primary' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="glass rounded-full gap-2">
              <span>Sort by</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Advanced Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 280, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                className="hidden lg:block flex-shrink-0 overflow-hidden"
              >
                <ProductFilters />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1">
            {/* Results Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mb-6"
            >
              Showing {displayedProducts.length} of {filteredProducts.length} products
            </motion.p>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll */}
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={hasMore && displayedProducts.length < filteredProducts.length}
              isLoading={isLoadingMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
