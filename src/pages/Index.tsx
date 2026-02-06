import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { DailyDeals } from "@/components/DailyDeals";

import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "100% protected payments",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Bar */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <DailyDeals />

      <ProductGrid />



      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Get exclusive offers, new arrivals, and insider updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  id="newsletter-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 h-12 px-6 rounded-full bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary-foreground text-primary font-semibold"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div >
  );
};

export default Index;
