import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const flashDeals = [
    { id: 1, name: "Wireless Earbuds Pro", originalPrice: 199.99, price: 99.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", rating: 4.7, soldPercent: 78 },
    { id: 2, name: "Smart Fitness Band", originalPrice: 89.99, price: 44.99, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", rating: 4.5, soldPercent: 85 },
    { id: 3, name: "Portable Charger 20000mAh", originalPrice: 59.99, price: 29.99, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", rating: 4.6, soldPercent: 92 },
    { id: 4, name: "Mechanical Keyboard RGB", originalPrice: 149.99, price: 89.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop", rating: 4.8, soldPercent: 65 }
];

export function DailyDeals() {
    return (
        <section className="py-20 px-4 bg-secondary/20">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                            Daily Deals
                        </h2>
                        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full border border-border/50">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-mono font-medium">Ends in 05:34:21</span>
                        </div>
                    </div>
                    <Link to="/deals">
                        <Button variant="outline" className="gap-2 group">
                            View All Deals
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {flashDeals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass-card overflow-hidden group h-full">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square">
                                        <img
                                            src={deal.image}
                                            alt={deal.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                                            {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                                        </Badge>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{deal.name}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg font-bold text-primary">${deal.price}</span>
                                            <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{deal.soldPercent}% sold</span>
                                                <span className="text-red-500 font-medium">Almost gone!</span>
                                            </div>
                                            <Progress value={deal.soldPercent} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
