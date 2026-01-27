import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Shield, Key, AlertTriangle, ArrowRight, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import TwoFactorSetup from "@/components/TwoFactorSetup";
import ActiveSessions from "@/components/ActiveSessions";

// Schema for Password Update
const passwordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),
    new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
        },
    });

    const onUpdatePassword = async (data: PasswordFormValues) => {
        setIsLoading(true);
        try {
            await api.put("/user/password", {
                current_password: data.current_password,
                new_password: data.new_password,
                new_password_confirmation: data.new_password_confirmation
            });
            form.reset();
            toast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.response?.data?.message || "Could not update password.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await api.delete("/user", { data: { password: deletePassword } });

            // Clear local storage and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast({
                title: "Account deleted",
                description: "We're sorry to see you go.",
            });

            window.location.href = "/register";

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Deletion failed",
                description: error.response?.data?.message || "Could not delete account. Check your password.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account security and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="glass-card w-full justify-start gap-2 p-2 overflow-x-auto">
                    <TabsTrigger value="general" className="gap-2">
                        <User className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="danger" className="gap-2 text-red-500 data-[state=active]:text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        Danger Zone
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium">Personal Details</p>
                                    <p className="text-sm text-muted-foreground">Name, Email, Bio, Avatar</p>
                                </div>
                                <Button variant="outline" asChild>
                                    <a href="/profile">Go to Profile <ArrowRight className="ml-2 h-4 w-4" /></a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Ensure your account is secure by using a strong password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onUpdatePassword)} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Current Password</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="current_password"
                                            type="password"
                                            {...form.register("current_password")}
                                            className="pl-10"
                                        />
                                    </div>
                                    {form.formState.errors.current_password && <p className="text-xs text-destructive">{form.formState.errors.current_password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new_password">New Password</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="new_password"
                                            type="password"
                                            {...form.register("new_password")}
                                            className="pl-10"
                                        />
                                    </div>
                                    {form.formState.errors.new_password && <p className="text-xs text-destructive">{form.formState.errors.new_password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="new_password_confirmation"
                                            type="password"
                                            {...form.register("new_password_confirmation")}
                                            className="pl-10"
                                        />
                                    </div>
                                    {form.formState.errors.new_password_confirmation && <p className="text-xs text-destructive">{form.formState.errors.new_password_confirmation.message}</p>}
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>


                    <div className="mt-6 space-y-6">
                        <TwoFactorSetup />
                        <ActiveSessions />
                    </div>
                </TabsContent>

                <TabsContent value="danger">
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="text-red-500">Delete Account</CardTitle>
                            <CardDescription>Permanently remove your account and all of its content. This action cannot be undone.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Delete Account</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-4">
                                        <Label>Enter your password to confirm:</Label>
                                        <Input
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onDeleteAccount();
                                            }}
                                            disabled={!deletePassword || isLoading}
                                        >
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Account"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
