import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionLink?: string;
    icon?: React.ElementType;
}

export function EmptyState({
    title = "No items found",
    description = "We couldn't find what you were looking for.",
    actionLabel = "Return Home",
    actionLink = "/",
    icon: Icon = SearchX,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-muted/50 p-6 rounded-full mb-6"
            >
                <Icon className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-xs mb-8">{description}</p>
            {actionLink && (
                <Button asChild>
                    <Link to={actionLink}>{actionLabel}</Link>
                </Button>
            )}
        </div>
    );
}
