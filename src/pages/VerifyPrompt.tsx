import { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

export default function VerifyPrompt() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await api.post("/email/resend");
            toast({
                title: "Link Sent",
                description: "A new verification link has been sent to your email address.",
            });
        } catch (error: any) {
            // If already verified
            if (error.response?.status === 400) {
                toast({ title: "Already Verified", description: "Your email is already verified." });
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to send",
                    description: error.response?.data?.message || "Could not resend link. Try again later.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <Card className="w-full max-w-md glass-card text-center p-6">
                <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                        We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleResend}
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Resend Verification Link"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        If you didn't receive the email, check your spam folder or try resending.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
