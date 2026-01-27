import { CheckCircle2, ShoppingCart, User, Heart } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "order",
        content: "Placed Order #1234",
        date: "2 hours ago",
        icon: ShoppingCart,
        color: "text-blue-500",
    },
    {
        id: 2,
        type: "wishlist",
        content: "Added 'Wireless Headphones' to Wishlist",
        date: "5 hours ago",
        icon: Heart,
        color: "text-red-500",
    },
    {
        id: 3,
        type: "profile",
        content: "Updated profile information",
        date: "1 day ago",
        icon: User,
        color: "text-green-500",
    },
    {
        id: 4,
        type: "login",
        content: "Logged in from new device",
        date: "2 days ago",
        icon: CheckCircle2,
        color: "text-gray-500",
    },
];

export function ActivityTimeline() {
    return (
        <div className="space-y-8 p-4">
            {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                    <div key={activity.id} className="relative flex gap-4">
                        {/* Line connection */}
                        {index !== activities.length - 1 && (
                            <span className="absolute left-[11px] top-8 -bottom-8 w-px bg-muted" aria-hidden="true" />
                        )}

                        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-1 ring-muted ${activity.color}`}>
                            <Icon className="h-3 w-3" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leading-none">{activity.content}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
