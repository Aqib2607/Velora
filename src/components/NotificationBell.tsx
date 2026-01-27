import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import echo from "@/lib/echo";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        // other data
    };
    created_at: string;
    read_at: string | null;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            setNotifications(response.data.data);
            setUnreadCount(response.data.data.filter((n: Notification) => !n.read_at).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Get user ID from local storage or context (Assuming stored in 'user' key)
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Listen to private channel
            echo.private(`App.Models.User.${user.id}`)
                .notification((notification: any) => {
                    // Add to list
                    const newNote: Notification = {
                        id: notification.id,
                        data: { title: notification.title, message: notification.message },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };

                    setNotifications(prev => [newNote, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                    });
                });
        }

        return () => {
            if (userStr) {
                const user = JSON.parse(userStr);
                echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            await api.post(`/notifications/read/${id || 'all'}`);
            if (id) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-1" onClick={() => markAsRead()}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                        !notification.read_at && "bg-muted/20"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium">{notification.data.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{notification.data.message}</p>
                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.read_at && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
