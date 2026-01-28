import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component exists, if not I'll use standard textarea or check ui
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";

// Shop Settings Schema
const shopSettingsSchema = z.object({
    name: z.string().min(3, "Shop name must be at least 3 characters"),
    description: z.string().optional(),
});

export default function VendorSettings() {
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(shopSettingsSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await api.get("/shop/me");
                const shop = res.data.data;
                form.reset({
                    name: shop.name || "",
                    description: shop.description || "",
                });
            } catch (error) {
                console.error("Failed to fetch shop settings", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load shop settings"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchShop();
    }, [form.reset, toast]);

    const onSubmit = async (data: any) => {
        try {
            await api.put("/shop/me", data);
            toast({ title: "Success", description: "Shop settings updated successfully" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update settings"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Store Settings</h1>
                <p className="text-muted-foreground">Manage your shop profile and configuration</p>
            </div>

            <div className="grid gap-6">
                <Card className="glass-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Store className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>Update your store name and publicly visible description.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shop Name</label>
                                <Input {...form.register("name")} placeholder="My Awesome Shop" />
                                {form.formState.errors.name && (
                                    <p className="text-xs text-destructive">{String(form.formState.errors.name.message)}</p>
                                )}
                                <p className="text-xs text-muted-foreground">This is the name displayed to customers.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    {...form.register("description")}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                    placeholder="Tell customers about your shop..."
                                />
                                <p className="text-xs text-muted-foreground">A brief description of what you sell.</p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-[120px]">
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
