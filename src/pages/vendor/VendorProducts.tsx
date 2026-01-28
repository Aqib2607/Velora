import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Package, MoreVertical, Loader2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";

// Product Schema
const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
    stock_quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be a non-negative number"),
    category_id: z.string().min(1, "Category is required"),
    status: z.enum(["draft", "published", "archived"]),
    // Images validation is tricky with File objects in react-hook-form, so we'll handle it manually or use refine
});

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            category_id: "",
            status: "published",
        },
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/vendor/products");
            setProducts(res.data.data.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            // Flatten categories if they are nested, or just use top level for now
            // Assuming API returns tree: [{id, name, children: [...]}]
            // For a simple select, we might want to flatten or just show top level.
            // Let's flatten for better UX if needed, or just show list. 
            // If API returns top-level only, we might need to recurse.
            // Let's just use what's returned.
            setCategories(res.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description || "");
            formData.append("price", data.price);
            formData.append("stock_quantity", data.stock_quantity);
            formData.append("category_id", data.category_id);
            formData.append("status", data.status);

            selectedImages.forEach((image) => {
                formData.append("images[]", image);
            });

            if (editingProduct) {
                // PUT request with FormData is tricky in Laravel/PHP (method spoofing)
                formData.append("_method", "PUT");
                await api.post(`/products/${editingProduct.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast({ title: "Success", description: "Product updated successfully" });
            } else {
                await api.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast({ title: "Success", description: "Product created successfully" });
            }
            setIsDialogOpen(false);
            setEditingProduct(null);
            setSelectedImages([]);
            form.reset();
            fetchProducts();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to save product"
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast({ title: "Success", description: "Product deleted" });
            fetchProducts();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete product" });
        }
    };

    const openEditDialog = (product: any) => {
        setEditingProduct(product);
        form.reset({
            name: product.name,
            description: product.description || "",
            price: String(product.price),
            stock_quantity: String(product.stock_quantity),
            category_id: String(product.category_id),
            status: product.status,
        });
        setSelectedImages([]); // Reset new images
        setIsDialogOpen(true);
    };

    // Helper to render category options (handling potential nesting)
    const renderCategoryOptions = (cats: any[], depth = 0) => {
        return cats.map((cat) => (
            <>
                <option key={cat.id} value={cat.id}>
                    {"- ".repeat(depth) + cat.name}
                </option>
                {cat.children && renderCategoryOptions(cat.children, depth + 1)}
            </>
        ));
    };


    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button onClick={() => { setEditingProduct(null); form.reset(); setSelectedImages([]); setIsDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search products..." className="pl-9" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
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
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="h-8 w-8 opacity-50" />
                                            <p>No products found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product: any) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="h-10 w-10 rounded bg-muted overflow-hidden flex items-center justify-center">
                                                {product.images && product.images.length > 0 ? (
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 opacity-50" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock_quantity}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === "published" ? "default" : "secondary"}>
                                                {product.status}
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
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
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for your product. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input {...form.register("name")} placeholder="Product Name" />
                                {form.formState.errors.name && <p className="text-xs text-destructive">{String(form.formState.errors.name.message)}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    {...form.register("category_id")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Category</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                                {form.formState.errors.category_id && <p className="text-xs text-destructive">{String(form.formState.errors.category_id.message)}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <Input {...form.register("price")} placeholder="0.00" type="number" step="0.01" />
                                {form.formState.errors.price && <p className="text-xs text-destructive">{String(form.formState.errors.price.message)}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock</label>
                                <Input {...form.register("stock_quantity")} placeholder="0" type="number" />
                                {form.formState.errors.stock_quantity && <p className="text-xs text-destructive">{String(form.formState.errors.stock_quantity.message)}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                {...form.register("description")}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Product description..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Images</label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                            </div>
                            {selectedImages.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {selectedImages.map((img, i) => (
                                        <div key={i} className="relative h-12 w-12 rounded overflow-hidden border">
                                            <img src={URL.createObjectURL(img)} alt="preview" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                {...form.register("status")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingProduct ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
