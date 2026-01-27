import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

const formSchema = z.object({
    code: z.string().min(6, "Code must be at least 6 characters"),
});

export default function LoginTwoFactor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const userId = location.state?.userId;
    const [isLoading, setIsLoading] = useState(false);

    // If no user ID, user probably shouldn't be here
    if (!userId) {
        // For UX, maybe redirect to login, but let's render a message first or effect redirect
        // In a real app we'd redirect inside useEffect.
        // return <Navigate to="/login" replace />; 
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { code: "" },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login/2fa", {
                user_id: userId,
                code: data.code,
            });

            const { user, token } = response.data.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            toast({ title: "Welcome back!", description: "Login successful." });
            navigate("/dashboard");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid code.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <Card className="w-full max-w-md glass-card p-6">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
                    <CardDescription className="text-center">
                        Please enter the authentication code from your authenticator app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                {...form.register("code")}
                                placeholder="Enter 6-digit code or recovery code"
                                className="text-center text-lg tracking-widest"
                            />
                            {form.formState.errors.code && <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>}
                        </div>
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify"}
                        </Button>
                        <div className="text-center">
                            <Button variant="link" onClick={() => navigate("/login")} className="text-xs text-muted-foreground">
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
