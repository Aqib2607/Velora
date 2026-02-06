import { motion } from "framer-motion";
import { Zap, Clock, Percent, Gift, Flame, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";

const flashDeals = [
  { id: 1, name: "Wireless Earbuds Pro", originalPrice: 199.99, price: 99.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", rating: 4.7, soldPercent: 78 },
  { id: 2, name: "Smart Fitness Band", originalPrice: 89.99, price: 44.99, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", rating: 4.5, soldPercent: 85 },
  { id: 3, name: "Portable Charger 20000mAh", originalPrice: 59.99, price: 29.99, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", rating: 4.6, soldPercent: 92 },
  { id: 4, name: "Mechanical Keyboard RGB", originalPrice: 149.99, price: 89.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop", rating: 4.8, soldPercent: 65 }
];

const coupons = [
  { code: "SAVE20", discount: "20% OFF", minOrder: 100, expires: "Dec 31" },
  { code: "NEWYEAR", discount: "$15 OFF", minOrder: 75, expires: "Jan 5" },
  { code: "FREESHIP", discount: "Free Shipping", minOrder: 50, expires: "Jan 15" }
];

const Deals = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-primary to-primary/80">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop')] opacity-20 bg-cover bg-center" />
            <div className="relative p-8 md:p-12 text-center text-primary-foreground">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-white/20 text-white mb-4 text-sm py-1">
                  <Flame className="h-4 w-4 mr-1" />
                  Limited Time Offers
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Mega Sale Event</h1>
                <p className="text-xl opacity-90 mb-6">Up to 50% off on selected items</p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">02</div>
                    <div className="text-sm opacity-75">Days</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">14</div>
                    <div className="text-sm opacity-75">Hours</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">33</div>
                    <div className="text-sm opacity-75">Mins</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Coupons Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                Available Coupons
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-dashed border-2 border-primary/30 overflow-hidden">
                    <CardContent className="p-0 flex">
                      <div className="bg-primary/10 p-4 flex flex-col items-center justify-center min-w-[100px]">
                        <Percent className="h-6 w-6 text-primary mb-1" />
                        <span className="font-bold text-primary">{coupon.discount}</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{coupon.code}</code>
                          <Button variant="ghost" size="sm">Copy</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Min. order ${coupon.minOrder}</p>
                        <p className="text-xs text-muted-foreground">Expires {coupon.expires}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Flash Deals */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Flash Deals
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Ends in 05:34:21
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {flashDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img
                          src={deal.image}
                          alt={deal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{deal.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">${deal.price}</span>
                          <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={deal.soldPercent} className="h-2" />
                          <p className="text-xs text-muted-foreground">{deal.soldPercent}% sold</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Category Deals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Gift className="h-6 w-6 text-primary" />
                Deals by Category
              </h2>
              <Link to="/categories">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Electronics", discount: "Up to 40% off", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=200&fit=crop" },
                { name: "Fashion", discount: "Up to 60% off", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop" },
                { name: "Home & Living", discount: "Up to 50% off", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop" }
              ].map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={`/products?category=${cat.name.toLowerCase()}`}>
                    <Card className="glass-card overflow-hidden group cursor-pointer">
                      <CardContent className="p-0 relative h-40">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-bold text-lg">{cat.name}</h3>
                          <p className="text-sm opacity-90">{cat.discount}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Deals;
