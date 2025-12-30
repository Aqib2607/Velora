import { motion } from "framer-motion";
import { Grid3X3, Smartphone, Laptop, Watch, Headphones, Camera, Gamepad, Home, Shirt, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Electronics", icon: Laptop, color: "from-blue-500 to-cyan-500", count: 1250 },
  { id: 2, name: "Smartphones", icon: Smartphone, color: "from-purple-500 to-pink-500", count: 890 },
  { id: 3, name: "Watches", icon: Watch, color: "from-amber-500 to-orange-500", count: 456 },
  { id: 4, name: "Audio", icon: Headphones, color: "from-green-500 to-emerald-500", count: 678 },
  { id: 5, name: "Cameras", icon: Camera, color: "from-red-500 to-rose-500", count: 234 },
  { id: 6, name: "Gaming", icon: Gamepad, color: "from-indigo-500 to-violet-500", count: 567 },
  { id: 7, name: "Home & Living", icon: Home, color: "from-teal-500 to-cyan-500", count: 890 },
  { id: 8, name: "Fashion", icon: Shirt, color: "from-pink-500 to-rose-500", count: 1456 },
  { id: 9, name: "Beauty", icon: Sparkles, color: "from-fuchsia-500 to-purple-500", count: 678 }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Shop by Category</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our extensive collection of products across multiple categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/products?category=${category.name.toLowerCase()}`}>
                    <Card className="glass-card group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.count.toLocaleString()} products
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Featured Categories Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid md:grid-cols-2 gap-6"
          >
            <div className="relative rounded-2xl overflow-hidden h-64 group">
              <img
                src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=400&fit=crop"
                alt="Tech Deals"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium mb-1">Up to 40% Off</p>
                <h3 className="text-2xl font-bold">Tech Essentials</h3>
                <Link to="/products?category=electronics" className="inline-block mt-3 text-sm underline">
                  Shop Now →
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 group">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"
                alt="Fashion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium mb-1">New Arrivals</p>
                <h3 className="text-2xl font-bold">Fashion Forward</h3>
                <Link to="/products?category=fashion" className="inline-block mt-3 text-sm underline">
                  Shop Now →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
