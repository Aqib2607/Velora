import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Store,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Schema matching backend requirements
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    password_confirmation: z.string(),
    role: z.enum(["customer", "shop_owner"]), // Frontend maps 'vendor' UI to 'shop_owner'
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "customer",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            // Map UI vendor tab to backend shop_owner role
            const payload = {
                ...data,
                role: activeTab === "vendor" ? "shop_owner" : "customer",
            };

            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
            const response = await axios.post(`${apiUrl}/auth/register`, payload);

            const { token, user } = response.data.data;

            // Store token and user data (Auto-login)
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast({
                title: "Registration successful!",
                description: `Welcome to Velora, ${user.name}!`,
            });

            // Redirect to homepage
            navigate("/");

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                // Handle validation errors from Laravel
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    // Basic mapping of backend error fields to form fields if needed
                    // For now, toast the first error
                    toast({
                        variant: "destructive",
                        title: "Validation Error",
                        description: errors[key][0],
                    });
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Registration failed",
                    description: "Something went wrong. Please try again.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration (Consistent with Login) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden"
            >
                <div className="absolute inset-0">
                    {/* Abstract Shapes */}
                    <div className="absolute top-20 left-20 w-24 h-24 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm" />
                    <div className="absolute bottom-40 right-20 w-16 h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
                    <h2 className="text-4xl font-bold mb-6">Join Velora</h2>
                    <p className="text-primary-foreground/80 text-lg mb-8 max-w-md">
                        Create an account to start your premium shopping experience.
                    </p>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
            >
                <div className="w-full max-w-md">
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">N</span>
                        </div>
                        <span className="font-bold text-2xl">Velora</span>
                    </Link>

                    <div className="glass-card p-8">
                        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                        <p className="text-muted-foreground mb-6">
                            Sign up to start your journey
                        </p>

                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => setActiveTab(v as "customer" | "vendor")}
                            className="mb-6"
                        >
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="customer" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Customer
                                </TabsTrigger>
                                <TabsTrigger value="vendor" className="gap-2">
                                    <Store className="h-4 w-4" />
                                    Vendor
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("name")}
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.name && (
                                    <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("email")}
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {form.formState.errors.password && (
                                    <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("password_confirmation")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.password_confirmation && (
                                    <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.password_confirmation.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="w-full h-12 gradient-bg text-primary-foreground font-semibold rounded-xl glow"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary font-semibold hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
