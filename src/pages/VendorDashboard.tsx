import { motion } from "framer-motion";
import { Package, DollarSign, TrendingUp, ShoppingBag, Plus, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const VendorDashboard = () => {
  const stats = [
    { title: "Total Sales", value: "$12,450", icon: DollarSign, change: "+12%" },
    { title: "Orders", value: "156", icon: ShoppingBag, change: "+8%" },
    { title: "Products", value: "48", icon: Package, change: "+3" },
    { title: "Revenue", value: "$8,320", icon: TrendingUp, change: "+15%" }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", product: "Wireless Headphones", amount: "$299", status: "completed" },
    { id: "ORD-002", customer: "Jane Smith", product: "Smart Watch", amount: "$199", status: "processing" },
    { id: "ORD-003", customer: "Mike Johnson", product: "Bluetooth Speaker", amount: "$79", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Seller!</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Settings className="h-4 w-4 mr-2" />Settings</Button>
              <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
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
            <TabsList><TabsTrigger value="orders">Recent Orders</TabsTrigger><TabsTrigger value="products">Products</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
            <TabsContent value="orders">
              <Card className="glass-card">
                <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div><p className="font-medium">{order.id}</p><p className="text-sm text-muted-foreground">{order.customer}</p></div>
                        <div className="text-right"><p className="font-medium">{order.amount}</p><Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge></div>
                      </div>
                    ))}
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
