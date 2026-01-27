import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const resetPasswordSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),
        password_confirmation: z.string(),
        token: z.string().min(1, "Token is missing"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: searchParams.get("email") || "",
            token: searchParams.get("token") || "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", data);

            toast({
                title: "Password reset successful",
                description: "You can now login with your new password.",
            });

            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            if (error.response?.status === 422) {
                // Validation error
                const errors = error.response.data.errors;
                if (errors) {
                    toast({
                        variant: "destructive",
                        title: "Validation Error",
                        description: Object.values(errors).flat()[0] as string,
                    });
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Reset failed",
                    description: error.response?.data?.message || "Invalid or expired token.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 bg-background/95 backdrop-blur shadow-xl rounded-2xl border border-white/20">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Login
                    </Link>

                    <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                    <p className="text-muted-foreground mb-8">
                        Create a new, secure password for your account.
                    </p>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Hidden field for token */}
                        <input type="hidden" {...form.register("token")} />

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("email")}
                                    type="email"
                                    placeholder="Confirm Email"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    readOnly={!!searchParams.get("email")}
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive ml-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive ml-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    {...form.register("password_confirmation")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                            {form.formState.errors.password_confirmation && (
                                <p className="text-xs text-destructive ml-1">
                                    {form.formState.errors.password_confirmation.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full h-12 gradient-bg text-primary-foreground font-semibold rounded-xl glow"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Reset Password"
                            )}
                            {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
