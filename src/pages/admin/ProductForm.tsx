import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import {
    ChevronLeft, Loader2, Save, Trash2, Plus, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

// Schema matching backend rules
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be non-negative"),
    stock_quantity: z.coerce.number().int().min(0, "Stock must be non-negative"),
    category_id: z.coerce.number().min(1, "Category is required"),
    status: z.enum(["draft", "published", "archived"]),
    is_featured: z.boolean().default(false),
    // Simple image handling: array of URL strings for now
    images: z.array(z.string().url("Must be a valid URL")).optional(),
    // Metadata: Array of key-value pairs
    metadata: z.array(z.object({
        key: z.string().min(1),
        value: z.string().min(1)
    })).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
    id: number;
    name: string;
}

export default function ProductForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // For images management (simplified to URLs)
    const [imageInput, setImageInput] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock_quantity: 0,
            status: "draft",
            is_featured: false,
            images: [],
            metadata: []
        },
    });

    const { fields: metaFields, append: appendMeta, remove: removeMeta } = useFieldArray({
        control: form.control,
        name: "metadata",
    });

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                // Assuming we have a category list endpoint or use generic
                const res = await api.get("/categories"); // Adjust if needed
                setCategories(res.data.data);
            } catch (err) {
                // Fallback or error
            }
        };
        fetchCategories();

        if (isEdit) {
            const fetchProduct = async () => {
                setIsLoading(true);
                try {
                    const res = await api.get(`/products/${id}`);
                    // The backend likely returns { success: true, message: "...", data: { ... } }
                    // So we access res.data.data
                    const p = res.data.data;

                    // Transform metadata object to array key-value for form
                    const metaArray = p.metadata ? Object.entries(p.metadata).map(([key, value]) => ({ key, value: String(value) })) : [];

                    form.reset({
                        name: p.name,
                        description: p.description || "",
                        price: p.price,
                        stock_quantity: p.stock ?? p.stock_quantity,
                        category_id: p.category?.id || p.category_id,
                        status: p.status,
                        is_featured: p.is_featured,
                        images: p.images || [],
                        metadata: metaArray
                    });
                } catch (error) {
                    toast({ variant: "destructive", title: "Error", description: "Failed to load product." });
                    navigate("/admin/products");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [isEdit, id, form, navigate, toast]);

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            // Transform metadata array back to object
            const metaObject = data.metadata?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || null;

            const payload = { ...data, metadata: metaObject };

            if (isEdit) {
                await api.put(`/products/${id}`, payload);
                toast({ title: "Updated", description: "Product updated successfully." });
            } else {
                await api.post("/products", payload);
                toast({ title: "Created", description: "Product created successfully." });
            }
            navigate("/admin/products");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || "Failed to save product."
            });
            // Handle validation errors manually if needed
        } finally {
            setIsLoading(false);
        }
    };

    const addImage = () => {
        if (!imageInput) return;
        const current = form.getValues("images") || [];
        form.setValue("images", [...current, imageInput]);
        setImageInput("");
    };

    const removeImage = (index: number) => {
        const current = form.getValues("images") || [];
        form.setValue("images", current.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Create Product"}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input placeholder="Product Name" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea placeholder="Product Description" className="min-h-[100px]" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="price" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="stock_quantity" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <FormField control={form.control} name="category_id" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                    ))}
                                                    {categories.length === 0 && <SelectItem value="1">Default Category (Test)</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="is_featured" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Finished Product</FormLabel>
                                                <FormDescription>Mark this product as featured.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <FormLabel>Images</FormLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Image URL https://..."
                                            value={imageInput}
                                            onChange={(e) => setImageInput(e.target.value)}
                                        />
                                        <Button type="button" variant="secondary" onClick={addImage}>Add</Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {form.watch("images")?.map((url, i) => (
                                            <div key={i} className="relative group aspect-square rounded overflow-hidden border">
                                                <img src={url} alt="" className="object-cover w-full h-full" />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Metadata</FormLabel>
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendMeta({ key: "", value: "" })}>
                                            <Plus className="h-3 w-3 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {metaFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2">
                                                <Input
                                                    {...form.register(`metadata.${index}.key`)}
                                                    placeholder="Key"
                                                    className="flex-1"
                                                />
                                                <Input
                                                    {...form.register(`metadata.${index}.value`)}
                                                    placeholder="Value"
                                                    className="flex-1"
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMeta(index)}>
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <FormDescription>Custom properties like stats (e.g., Calories, Weight).</FormDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
