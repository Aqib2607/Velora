import { useEffect, useState } from "react";
import { Laptop, Phone, Globe, Trash2, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

interface Session {
    id: number;
    name: string;
    last_used_at: string;
    created_at: string;
    is_current: boolean;
}

export default function ActiveSessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchSessions = async () => {
        try {
            const response = await api.get("/user/sessions");
            setSessions(response.data.data);
        } catch (error) {
            console.error("Failed to fetch sessions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const revokeSession = async (id: number) => {
        try {
            await api.delete(`/user/sessions/${id}`);
            setSessions(sessions.filter((s) => s.id !== id));
            toast({ title: "Session revoked", description: "The session has been logged out." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not revoke session." });
        }
    };

    const revokeOtherSessions = async () => {
        try {
            await api.delete("/user/sessions");
            setSessions(sessions.filter((s) => s.is_current));
            toast({ title: "Sessions revoked", description: "All other sessions have been logged out." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not revoke sessions." });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                    Manage and log out your active sessions on other browsers and devices.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
                </p>

                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-background p-2 rounded-full">
                                    {/* Simplified device detection logic since backend doesn't fully parse UA yet */}
                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">
                                            {session.name}
                                            {session.is_current && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">This device</span>}
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Last active {session.last_used_at ? formatDistanceToNow(new Date(session.last_used_at), { addSuffix: true }) : 'Just now'}
                                    </p>
                                </div>
                            </div>

                            {!session.is_current && (
                                <Button variant="ghost" size="sm" onClick={() => revokeSession(session.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <Button variant="outline" onClick={revokeOtherSessions} className="w-full sm:w-auto">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out Other Browser Sessions
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
