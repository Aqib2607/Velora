import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, TrendingUp, ShoppingBag, Users, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

// Placeholder stats until backend is fully hooked up
const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_sales: "$124,500.00",
        total_orders: 1450,
        total_users: 85,
        total_products: 320,
    });

    // In a real scenario, we would fetch from /admin/stats endpoint
    // useEffect(() => {
    //    api.get('/admin/stats').then(...)
    // }, []);

    const statCards = [
        { title: "Total Revenue", value: stats.total_sales, icon: DollarSign, change: "+12%" },
        { title: "Total Orders", value: stats.total_orders, icon: ShoppingBag, change: "+5%" },
        { title: "Total Users", value: stats.total_users, icon: Users, change: "+8%" },
        { title: "Total Products", value: stats.total_products, icon: Package, change: "+2%" }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of the entire marketplace
                    </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Actions or Charts could go here */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium">New Vendor Registered</p>
                                    <p className="text-sm text-muted-foreground">TechWorld Inc.</p>
                                </div>
                                <span className="text-xs text-muted-foreground">2 mins ago</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium">Order #12345 Placed</p>
                                    <p className="text-sm text-muted-foreground">$120.00 • 3 items</p>
                                </div>
                                <span className="text-xs text-muted-foreground">15 mins ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
