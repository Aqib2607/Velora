import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
    total_orders: number;
    active_orders: number;
    wishlist_items: number;
}

import { SalesChart } from "@/components/SalesChart";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { SortableWishlist } from "@/components/SortableWishlist";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { ThemeColorToggle } from "@/components/ThemeColorToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";

export default function UserDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Keyboard Shortcuts
    useHotkeys('ctrl+k', (e) => { e.preventDefault(); navigate('/search'); });
    useHotkeys('ctrl+h', (e) => { e.preventDefault(); navigate('/'); });
    useHotkeys('ctrl+p', (e) => { e.preventDefault(); navigate('/dashboard'); });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock data for immediate visual if backend is empty
                setStats({ total_orders: 12, active_orders: 2, wishlist_items: 5 });
                // const response = await api.get("/dashboard/stats");
                // setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t('Dashboard')}</h1>
                    <p className="text-muted-foreground">Overview of your account activity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground mr-4 hidden md:block">
                        <PresenceIndicator />
                    </div>
                    <ThemeColorToggle />
                    <LanguageToggle />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <motion.div variants={item}>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('Orders')}</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.total_orders}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Lifetime purchases</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.active_orders}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">In progress & shipping</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('Wishlist')}</CardTitle>
                            <Heart className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.wishlist_items}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Saved items</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={item} className="grid gap-6 md:grid-cols-7">
                <div className="col-span-4 space-y-6">
                    <SalesChart />

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Sortable Wishlist (Drag & Drop)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SortableWishlist />
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-card col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityTimeline />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

