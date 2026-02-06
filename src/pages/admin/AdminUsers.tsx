import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

export default function AdminUsers() {
    interface User {
        id: number;
        name: string;
        email: string;
        role: string;
        status?: string;
        created_at?: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Since we don't have a dedicated /admin/users endpoint yet, this is hypothetical
    // In a real implementation, we would add UserController@index to backend
    // For now, I'll simulate or try to hit an endpoint if available

    // I will use a specialized endpoint if we create one, but for now let's mock or use what we can.
    // Actually, I should create the backend endpoint for this.
    // Let's assume we will build it. 

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.data.data); // Pagination wrapper usually has data.data
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch users." });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter((u) => u.id !== id));
                toast({ title: "User deleted", description: "User has been removed successfully." });
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to delete user." });
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>


            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-9" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'shop_owner' ? 'secondary' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            {user.status || 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user.id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </motion.div>
    );
}
