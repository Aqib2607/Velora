import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, TrendingUp, ShoppingBag, Store, Loader2, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

// Schema for Shop Registration
const shopSchema = z.object({
    name: z.string().min(3, "Shop name must be at least 3 characters"),
    description: z.string().optional(),
});

const VendorOverview = () => {
    const [shop, setShop] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(shopSchema),
    });

    const fetchShopAndStats = async () => {
        try {
            const shopRes = await api.get("/shop/me");
            setShop(shopRes.data.data);

            const statsRes = await api.get("/vendor/dashboard");
            setStats(statsRes.data.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setShop(null);
            } else {
                console.error("Failed to fetch vendor data", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShopAndStats();
    }, []);

    const onRegisterShop = async (data: any) => {
        try {
            await api.post("/shop/register", data);
            toast({ title: "Success", description: "Shop created successfully!" });
            fetchShopAndStats();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to create shop"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-2xl">Create Your Shop</CardTitle>
                            <CardDescription>
                                You need to set up your shop profile before you can start selling.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onRegisterShop)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Shop Name</label>
                                    <input
                                        {...form.register("name")}
                                        className="w-full h-10 px-3 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Acme Electronics"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-destructive">{String(form.formState.errors.name.message)}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description (Optional)</label>
                                    <textarea
                                        {...form.register("description")}
                                        className="w-full h-24 p-3 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                                        placeholder="Tell us about your shop..."
                                    />
                                </div>

                                <Button type="submit" className="w-full gradient-bg" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Create Shop"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const statCards = [
        { title: "Total Sales", value: stats?.stats?.total_sales || "$0", icon: DollarSign, change: "+0%" },
        { title: "Orders", value: stats?.stats?.orders_count || "0", icon: ShoppingBag, change: "+0%" },
        { title: "Products", value: stats?.stats?.products_count || "0", icon: Package, change: "+0" },
        { title: "Revenue", value: stats?.stats?.revenue || "$0", icon: TrendingUp, change: "+0%" }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Store className="h-4 w-4" /> {shop.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/vendor/products">
                        <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="glass-card">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <Badge variant="secondary" className="mt-2 text-green-600">{stat.change}</Badge>
                                </div>
                                <stat.icon className="h-8 w-8 text-primary opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Link to="/vendor/orders">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                            stats.recent_orders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{order.id}</p>
                                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{order.amount}</p>
                                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No recent orders</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default VendorOverview;
