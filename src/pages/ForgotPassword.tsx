import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", data);
            setIsSent(true);
            toast({
                title: "Reset link sent",
                description: "Check your email for the password reset link.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Request failed",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 bg-background/95 backdrop-blur shadow-xl rounded-2xl border border-white/20">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>

                    <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                    <p className="text-muted-foreground mb-8">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {isSent ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                            <p className="text-muted-foreground mb-6">
                                We've sent a password reset link to <br />
                                <span className="font-medium text-foreground">{form.getValues("email")}</span>
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsSent(false)}
                            >
                                Try shorter email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        {...form.register("email")}
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive ml-1">
                                        {form.formState.errors.email.message}
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
                                    "Send Reset Link"
                                )}
                                {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
