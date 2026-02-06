import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ChevronDown, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "../hooks/use-debounce"; // Using relative path to be safer if alias fails
import api from "@/lib/axios";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { ProductFilters } from "@/components/ProductFilters";
import { AnimatePresence } from "framer-motion";
import { Product, Category } from "@/types";

const categories = ["All", "Electronics", "Fashion", "Home"];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Keep for Quick Filter (Chips) behavior logic if needed, or sync with sidebar
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedPrice = useDebounce(priceRange, 500); // Debounce price to avoid too many calls

  // Fetch Categories
  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data.data);
    }).catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const fetchProducts = useCallback(async (reset = false) => {
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params: Record<string, string | number> = { page: currentPage };

      // Search
      if (debouncedSearch) {
        params['filter[search]'] = debouncedSearch;
      }

      // Categories
      // Check if "All" is selected in chips -> ignore.
      // If chips has a specific category, use it.
      // If Sidebar has categories, use them.
      // Priority: Sidebar (more specific) > Chips. Or sync them?
      // Let's treat valid Chip selection as one of the filterCategories.

      let catsToSend = [...filterCategories];
      if (selectedCategory !== "All") {
        // Find ID of selectedCategory name? The chips are currently Names.
        // We need to map Name -> ID.
        const catObj = categories.find(c => c.name === selectedCategory);
        if (catObj && !catsToSend.includes(String(catObj.id))) {
          catsToSend = [String(catObj.id)]; // Quick filter overrides/sets single
        }
      }

      if (catsToSend.length > 0) {
        params['filter[category_id]'] = catsToSend.join(',');
      }

      // Price
      params['filter[min_price]'] = debouncedPrice[0];
      params['filter[max_price]'] = debouncedPrice[1];

      // Rating
      if (rating) {
        params['filter[rating]'] = rating;
      }

      const res = await api.get("/products", { params });

      const newProducts = res.data.data.data;
      const meta = res.data.data.meta;

      if (reset) {
        setProducts(newProducts);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }

      setHasMore(currentPage < meta.last_page);
      setTotalProducts(meta.total);

    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch, page, filterCategories, debouncedPrice, rating, categories]);

  // Initial fetch and category change
  useEffect(() => {
    fetchProducts(true);
  }, [selectedCategory, debouncedSearch, filterCategories, debouncedPrice, rating, fetchProducts]); // Added dependencies

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchProducts();
    }
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
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-products"
              name="search"
              placeholder="Search products..."
              className="pl-10 rounded-full bg-background/50 border-input/50 focus:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories & Actions */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Categories (Quick Filter Chips) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setFilterCategories([]); // Clear specific filters
                }}
                className={`rounded-full whitespace-nowrap ${selectedCategory === "All" ? "gradient-bg" : "glass"}`}
              >
                All
              </Button>
              {categories.slice(0, 5).map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    // Optionally update filterCategories to sync sidebar
                    // setFilterCategories([String(cat.id)]);
                  }}
                  className={`rounded-full whitespace-nowrap ${selectedCategory === cat.name ? "gradient-bg" : "glass"
                    }`}
                >
                  {cat.name}
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
            </div>
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
                <ProductFilters
                  minPrice={0}
                  maxPrice={2000}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  categories={categories}
                  selectedCategories={filterCategories}
                  setSelectedCategories={setFilterCategories}
                  rating={rating}
                  setRating={setRating}
                />
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
              Showing {products.length} of {totalProducts} products
            </motion.p>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    {...product}
                    image={product.image_urls?.[0] || ""}
                    price={Number(product.price)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll */}
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
