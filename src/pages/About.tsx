import { motion } from "framer-motion";
import { Users, Award, Globe, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { label: "Happy Customers", value: "2M+" },
    { label: "Products", value: "50K+" },
    { label: "Vendors", value: "5K+" },
    { label: "Countries", value: "120+" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Velora</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing e-commerce with cutting-edge technology and unparalleled customer experience.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                We believe shopping should be effortless, enjoyable, and accessible to everyone. Our platform connects millions of customers with trusted vendors worldwide.
              </p>
              <Link to="/products"><Button className="gap-2">Explore Products <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop" alt="Team" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
