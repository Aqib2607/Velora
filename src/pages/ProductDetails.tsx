import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

const product = {
  id: 1,
  name: "Premium Wireless Headphones Pro Max",
  price: 299.99,
  originalPrice: 399.99,
  rating: 4.8,
  reviews: 2453,
  description: "Experience audio like never before with our Premium Wireless Headphones Pro Max. Featuring advanced noise cancellation, 40-hour battery life, and premium materials for ultimate comfort.",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
  ],
  colors: [
    { name: "Midnight Black", hex: "#1a1a2e" },
    { name: "Pearl White", hex: "#f5f5f5" },
    { name: "Ocean Blue", hex: "#3b82f6" },
    { name: "Rose Gold", hex: "#f4a4a4" },
  ],
  sizes: ["S", "M", "L", "XL"],
};

export default function ProductDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden glass-card cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary glow"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div>
              <h3 className="font-semibold mb-3">
                Color: <span className="text-muted-foreground font-normal">{product.colors[selectedColor].name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(index)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === index
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === index && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground drop-shadow" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(index)}
                    className={`w-14 h-12 rounded-xl font-semibold transition-all ${
                      selectedSize === index
                        ? "gradient-bg text-primary-foreground glow"
                        : "glass hover:bg-secondary"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="inline-flex items-center gap-4 glass-card p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions (Desktop) */}
            <div className="hidden md:flex gap-4">
              <Button
                size="lg"
                className="flex-1 h-14 gradient-bg text-primary-foreground font-semibold text-lg rounded-xl glow"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-xl glass border-2"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "2 Year Warranty" },
                { icon: RotateCcw, text: "30-Day Returns" },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="text-center p-4 rounded-xl glass"
                >
                  <feature.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="text-xs font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-16 left-0 right-0 md:hidden p-4 glass border-t border-border z-40"
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-14 w-14 rounded-xl"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className="flex-1 h-14 gradient-bg text-primary-foreground font-semibold text-lg rounded-xl"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
