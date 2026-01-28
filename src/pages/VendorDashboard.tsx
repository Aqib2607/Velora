import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, TrendingUp, ShoppingBag, Plus, BarChart3, Settings, Store, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

// Schema for Shop Registration
const shopSchema = z.object({
  name: z.string().min(3, "Shop name must be at least 3 characters"),
  description: z.string().optional(),
});

const VendorDashboard = () => {
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(shopSchema),
  });

  const fetchShopAndStats = async () => {
    try {
      // 1. Try to fetch shop
      const shopRes = await api.get("/shop/me");
      setShop(shopRes.data.data);

      // 2. Fetch stats
      const statsRes = await api.get("/vendor/dashboard");
      setStats(statsRes.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setShop(null); // No shop found
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
      fetchShopAndStats(); // Reload to show dashboard
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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // State: No Shop -> Show Registration Form
  if (!shop) {
    return (
      <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 max-w-2xl">
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

  // State: Shop Exists -> Show Dashboard
  const statCards = [
    { title: "Total Sales", value: stats?.stats?.total_sales || "$0", icon: DollarSign, change: "+0%" },
    { title: "Orders", value: stats?.stats?.orders_count || "0", icon: ShoppingBag, change: "+0%" },
    { title: "Products", value: stats?.stats?.products_count || "0", icon: Package, change: "+0" },
    { title: "Revenue", value: stats?.stats?.revenue || "$0", icon: TrendingUp, change: "+0%" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-primary font-medium flex items-center gap-2">
                <Store className="h-4 w-4" /> {shop.name}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none"><Settings className="h-4 w-4 mr-2" />Settings</Button>
              <Button className="flex-1 md:flex-none"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, i) => (
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

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList className="w-full flex h-auto overflow-x-auto justify-start p-1 mb-4">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <Card className="glass-card">
                <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                      stats.recent_orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div><p className="font-medium">{order.id}</p><p className="text-sm text-muted-foreground">{order.customer}</p></div>
                          <div className="text-right"><p className="font-medium">{order.amount}</p><Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No orders yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products"><Card className="glass-card p-12 text-center text-muted-foreground"><BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />Product management coming soon</Card></TabsContent>
            <TabsContent value="analytics"><Card className="glass-card p-12 text-center text-muted-foreground"><TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />Analytics dashboard coming soon</Card></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorDashboard;
