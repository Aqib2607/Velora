import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingBag, Loader2, Calendar, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

export default function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/vendor/orders");
            setOrders(res.data.data.data); // Paginated response: data.data
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (itemId: string, newStatus: string) => {
        try {
            await api.patch(`/vendor/orders/items/${itemId}/status`, { status: newStatus });
            toast({ title: "Success", description: "Order status updated" });
            fetchOrders(); // Refresh locally
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update status"
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "secondary";
            case "processing": return "default"; // blue/primary
            case "shipped": return "outline";
            case "delivered": return "secondary"; // green-ish usually but using secondary for now
            case "cancelled": return "destructive";
            default: return "outline";
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">Track and manage customer orders</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Calendar className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search orders..." className="pl-9" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order Item ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShoppingBag className="h-8 w-8 opacity-50" />
                                            <p>No orders found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">#{item.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {/* We could add image here if available in item.product.images */}
                                                <span>{item.product?.name}</span>
                                                <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm">{item.order?.user?.name || "Guest"}</span>
                                                <span className="text-xs text-muted-foreground">{item.order?.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>${item.total}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Select
                                                defaultValue={item.status}
                                                onValueChange={(val) => handleStatusUpdate(item.id, val)}
                                            >
                                                <SelectTrigger className="w-[130px] h-8 text-xs ml-auto">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </motion.div>
    );
}
