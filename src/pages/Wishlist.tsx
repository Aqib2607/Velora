import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const wishlistItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    inStock: true
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    price: 159.99,
    originalPrice: 189.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    inStock: false
  },
  {
    id: 4,
    name: "Running Shoes Elite",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    inStock: true
  }
];

const Wishlist = () => {
  const handleAddToCart = (name: string) => {
    toast.success(`${name} added to cart!`);
  };

  const handleRemove = (name: string) => {
    toast.success(`${name} removed from wishlist`);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground">{wishlistItems.length} items saved</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Wishlist
            </Button>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                          </div>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemove(item.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {item.originalPrice > item.price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full gap-2"
                          disabled={!item.inStock}
                          onClick={() => handleAddToCart(item.name)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save items you love by clicking the heart icon</p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;
