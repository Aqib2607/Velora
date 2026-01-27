import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
    id: string;
    name: string;
    price: number;
}

export function SortableItem({ id, name, price }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card className="glass-card">
                <CardContent className="p-4 flex items-center gap-4">
                    <button {...attributes} {...listeners} className="cursor-grab hover:text-primary">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <div className="flex-1">
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-sm text-muted-foreground">${price}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
