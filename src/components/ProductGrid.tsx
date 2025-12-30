import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro Max",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 2453,
  },
  {
    id: 2,
    name: "Smart Watch Ultra Series 9",
    price: 449.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 1832,
  },
  {
    id: 3,
    name: "Designer Leather Backpack",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 956,
  },
  {
    id: 4,
    name: "Premium Running Shoes Air Max",
    price: 179.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 3241,
  },
  {
    id: 5,
    name: "Minimalist Ceramic Vase Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 428,
  },
  {
    id: 6,
    name: "Professional Camera Lens 50mm",
    price: 599.00,
    originalPrice: 749.00,
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 1567,
  },
  {
    id: 7,
    name: "Ergonomic Office Chair Pro",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 892,
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    price: 129.99,
    originalPrice: 169.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    rating: 4.4,
    reviews: 2103,
  },
];

export function ProductGrid() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
