import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    Plus, Search, Filter, MoreHorizontal, Edit, Trash2,
    ChevronLeft, ChevronRight, Loader2, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    stock_quantity: number;
    status: string;
    category: { name: string };
    image_urls: string[];
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: searchParams.get("page") || 1,
                "filter[search]": searchParams.get("search") || "",
                "filter[status]": searchParams.get("status") || "", // Default to all (empty string)
                sort: searchParams.get("sort") || "-created_at",
            };

            const response = await api.get("/admin/products", { params });
            setProducts(response.data.data.data);
            setMeta(response.data.data.meta); // Meta is probably in nested, or alongside data? 
            // If it's a paginated resource response it's:
            // { data: [...], meta: {...}, links: {...} } inside the 'data' key of ApiResponse
            // So response.data.data.meta is correct for meta.
            // response.data.data.data is correct for products.
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch products." });
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, toast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) params.set("search", term);
        else params.delete("search");
        params.set("page", "1");
        setSearchParams(params);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== "all") params.set("status", status);
        else params.delete("status");
        params.set("page", "1");
        setSearchParams(params);
    };

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sort);
        setSearchParams(params);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        setSearchParams(params);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/products/${deleteId}`);
            setProducts(products.filter(p => p.id !== deleteId));
            toast({ title: "Deleted", description: "Product moved to trash." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
        } finally {
            setDeleteId(null);
        }
    };

    // Restore logic (requires Trash view support in backend/frontend)
    const handleRestore = async (id: number) => {
        try {
            await api.post(`/products/${id}/restore`);
            fetchProducts();
            toast({ title: "Restored", description: "Product restored successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to restore product." });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog.</p>
                </div>
                <Button onClick={() => navigate("/admin/products/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8"
                        defaultValue={searchParams.get("search") || ""}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Select
                    value={searchParams.get("status") || "all"}
                    onValueChange={handleStatusFilter}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={searchParams.get("sort") || "-created_at"}
                    onValueChange={handleSort}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created_at">Newest First</SelectItem>
                        <SelectItem value="created_at">Oldest First</SelectItem>
                        <SelectItem value="price">Price: Low to High</SelectItem>
                        <SelectItem value="-price">Price: High to Low</SelectItem>
                        <SelectItem value="-stock_quantity">Stock: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                                            {product.image_urls?.[0] ? (
                                                <img src={product.image_urls[0]} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(product.status)}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(product.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(meta.current_page - 1)}
                        disabled={meta.current_page === 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        disabled={meta.current_page === meta.last_page || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the product and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
