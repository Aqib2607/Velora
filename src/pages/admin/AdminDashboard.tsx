import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, TrendingUp, ShoppingBag, Users, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

interface Activity {
    title: string;
    description: string;
    time: string;
}

interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    total_products: number;
    recent_activity: Activity[];
}

// Placeholder stats until backend is fully hooked up
const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        total_revenue: 0,
        total_orders: 0,
        total_users: 0,
        total_products: 0,
        recent_activity: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                // Backend returns: total_users, total_orders, total_products, active_shops, total_revenue, recent_activity
                // We map total_revenue (which is a number) to stats.total_sales (formatted string)
                // But let's adapt the state to match backend more closely or transform it.
                // Let's store raw values in state and format in render.

                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const statCards = [
        { title: "Total Revenue", value: formatCurrency(stats.total_revenue || 0), icon: DollarSign, change: "+12%" },
        { title: "Total Orders", value: stats.total_orders || 0, icon: ShoppingBag, change: "+5%" },
        { title: "Total Users", value: stats.total_users || 0, icon: Users, change: "+8%" },
        { title: "Total Products", value: stats.total_products || 0, icon: Package, change: "+2%" }
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
                                    <p className="text-2xl font-bold mt-1">
                                        {isLoading ? "..." : stat.value}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 text-green-600">{stat.change}</Badge>
                                </div>
                                <stat.icon className="h-8 w-8 text-primary opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-muted-foreground">Loading activity...</p>
                            ) : stats.recent_activity && stats.recent_activity.length > 0 ? (
                                stats.recent_activity.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{activity.title}</p>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No recent activity.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
