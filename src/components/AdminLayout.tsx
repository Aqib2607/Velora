import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu, Shield, Users, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/axios";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
    { icon: Package, label: "All Products", href: "/admin/products" },
    { icon: ShoppingBag, label: "All Orders", href: "/admin/orders" },
    { icon: Users, label: "Users & Vendors", href: "/admin/users" },
    { icon: Layers, label: "Categories", href: "/admin/categories" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Get user from local storage (or context)
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">Admin Portal</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.name}</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-4 pb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Sidebar Trigger */}
                    <div className="lg:hidden mb-4">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Menu className="h-4 w-4" />
                                    Admin Menu
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-80 shrink-0">
                        <div className="rounded-xl overflow-hidden border border-border shadow-sm sticky top-24 bg-card h-[calc(100vh-8rem)]">
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
