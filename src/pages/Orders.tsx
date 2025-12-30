import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "ORD-2024-001",
    date: "Dec 28, 2024",
    status: "delivered",
    total: 299.99,
    items: [
      { name: "Wireless Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop", qty: 1 },
      { name: "Smart Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop", qty: 1 }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "Dec 25, 2024",
    status: "shipping",
    total: 149.50,
    items: [
      { name: "Running Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", qty: 1 }
    ]
  },
  {
    id: "ORD-2024-003",
    date: "Dec 20, 2024",
    status: "processing",
    total: 89.99,
    items: [
      { name: "Backpack", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop", qty: 2 }
    ]
  }
];

const statusConfig = {
  processing: { icon: Clock, color: "bg-yellow-500", label: "Processing" },
  shipping: { icon: Truck, color: "bg-blue-500", label: "Shipping" },
  delivered: { icon: CheckCircle, color: "bg-green-500", label: "Delivered" }
};

const Orders = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your orders</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-10" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="glass-card w-full justify-start gap-2 p-2">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-semibold">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                          </div>
                          <Badge className={`${status.color} text-white gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="p-4 flex items-center gap-4">
                          <div className="flex -space-x-3">
                            {order.items.map((item, i) => (
                              <img
                                key={i}
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-background"
                              />
                            ))}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {order.items.map(i => i.name).join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.reduce((acc, i) => acc + i.qty, 0)} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>

            <TabsContent value="processing">
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders currently processing</p>
              </div>
            </TabsContent>

            <TabsContent value="shipping">
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders currently shipping</p>
              </div>
            </TabsContent>

            <TabsContent value="delivered">
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No delivered orders</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;
