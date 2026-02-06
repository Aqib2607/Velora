import { motion } from "framer-motion";
import { Search, X, Clock, TrendingUp, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/ProductCard";

const trendingSearches = [
  "Wireless headphones",
  "Smart watch",
  "iPhone 15",
  "Gaming laptop",
  "Sneakers"
];

const recentSearches = [
  "Bluetooth speaker",
  "Running shoes",
  "Backpack"
];

const searchResults = [
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, rating: 4.8, reviews: 128, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: 2, name: "Smart Watch Pro", price: 199.99, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: 3, name: "Bluetooth Earbuds", price: 89.99, rating: 4.4, reviews: 156, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop" },
  { id: 4, name: "Portable Speaker", price: 79.99, rating: 4.5, reviews: 72, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop" }
];

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              placeholder="Search for products..."
              className="pl-12 pr-12 h-14 text-lg rounded-full border-2 focus:border-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {!hasSearched ? (
            /* Initial State - Show suggestions */
            <div className="space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-lg">Recent Searches</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-lg">Trending Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <Badge
                      key={search}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors py-2 px-4"
                      onClick={() => handleSearch(search)}
                    >
                      <span className="text-primary mr-2">#{index + 1}</span>
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Results for "{searchQuery}"
                  </h2>
                  <p className="text-muted-foreground">{searchResults.length} products found</p>
                </div>
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="glass-card">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div>
                          <h4 className="font-medium mb-4">Price Range</h4>
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={500}
                            step={10}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-4">Categories</h4>
                          <div className="space-y-3">
                            {["Electronics", "Audio", "Wearables", "Accessories"].map((cat) => (
                              <div key={cat} className="flex items-center space-x-2">
                                <Checkbox id={cat} />
                                <Label htmlFor={cat}>{cat}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-4">Rating</h4>
                          <div className="space-y-3">
                            {[4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center space-x-2">
                                <Checkbox id={`rating-${rating}`} />
                                <Label htmlFor={`rating-${rating}`}>{rating}+ Stars</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full">Apply Filters</Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;
