
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products: propProducts, isLoading: propIsLoading = false }: ProductGridProps) {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (!propProducts) {
      // Fetch featured products if not provided
      const fetchFeatured = async () => {
        try {
          const res = await api.get('/products/featured');
          setFetchedProducts(res.data.data);
        } catch (error) {
          console.error("Failed to fetch featured products", error);
        } finally {
          setInternalLoading(false);
        }
      };
      fetchFeatured();
    } else {
      setInternalLoading(false);
    }
  }, [propProducts]);

  const displayProducts = propProducts || fetchedProducts;
  const isLoading = propProducts ? propIsLoading : internalLoading;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products from top vendors worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : (
            displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  {...product}
                  image={product.image_urls?.[0] || ""}
                  price={Number(product.price)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
