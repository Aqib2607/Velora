import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

export default function VerifyEmail() {
    const { id, hash } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                // Construct the query string with signature and expires
                const query = searchParams.toString();
                const url = `/email/verify/${id}/${hash}?${query}`;

                await api.get(url);
                setStatus("success");
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Invalid or expired verification link.");
            }
        };

        if (id && hash) {
            verify();
        } else {
            setStatus("error");
            setMessage("Invalid verification link.");
        }
    }, [id, hash, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <Card className="w-full max-w-md glass-card text-center p-6">
                <CardContent className="space-y-6 pt-6">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <h2 className="text-xl font-semibold">Verifying your email...</h2>
                            <p className="text-muted-foreground">Please wait while we verify your account.</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold">Email Verified!</h2>
                            <p className="text-muted-foreground">Thank you for verifying your email address. You can now access all features.</p>
                            <Button onClick={() => navigate("/dashboard")} className="w-full">
                                Go to Dashboard
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold">Verification Failed</h2>
                            <p className="text-muted-foreground">{message}</p>
                            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                                Return to Dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
