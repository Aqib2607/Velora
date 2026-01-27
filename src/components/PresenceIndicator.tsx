import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const mockViewers = [
    { id: 1, name: "Alice", image: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Bob", image: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Charlie", image: "https://i.pravatar.cc/150?u=3" },
];

export function PresenceIndicator() {
    return (
        <div className="flex items-center -space-x-2 overflow-hidden">
            <TooltipProvider>
                {mockViewers.map((viewer) => (
                    <Tooltip key={viewer.id}>
                        <TooltipTrigger asChild>
                            <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background cursor-pointer">
                                <AvatarImage src={viewer.image} />
                                <AvatarFallback>{viewer.name[0]}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{viewer.name} is viewing</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-background bg-muted text-xs font-medium text-muted-foreground z-10">
                +5
            </div>
        </div>
    );
}
