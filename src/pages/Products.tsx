import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, ChevronDown, Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "../hooks/use-debounce";
import api from "@/lib/axios";
import { ProductFilters } from "@/components/ProductFilters";
import { AnimatePresence } from "framer-motion";
import { Product, Category } from "@/types";

const categories = ["All", "Electronics", "Fashion", "Home"];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Keep for Quick Filter (Chips) behavior logic if needed, or sync with sidebar
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;
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

  const fetchProducts = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pageNum,
        per_page: productsPerPage
      };

      // Search
      if (debouncedSearch) {
        params['filter[search]'] = debouncedSearch;
      }

      // Categories
      let catsToSend = [...filterCategories];
      if (selectedCategory !== "All") {
        const catObj = categories.find(c => c.name === selectedCategory);
        if (catObj && !catsToSend.includes(String(catObj.id))) {
          catsToSend = [String(catObj.id)];
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

      setProducts(newProducts);
      setCurrentPage(meta.current_page);
      setTotalPages(meta.last_page);
      setTotalProducts(meta.total);

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch, filterCategories, debouncedPrice, rating, categories, productsPerPage]);

  // Initial fetch and reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch, filterCategories, debouncedPrice, rating]);

  // Fetch when page changes (but not on initial mount or filter changes)
  useEffect(() => {
    if (currentPage !== 1) {
      fetchProducts(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
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
              Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
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

            {/* Pagination Controls */}
            {!isLoading && products.length > 0 && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum as number)}
                        disabled={isLoading}
                        className={`min-w-[40px] ${currentPage === pageNum ? 'gradient-bg' : ''}`}
                      >
                        {pageNum}
                      </Button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

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
