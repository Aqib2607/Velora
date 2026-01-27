import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
}

export function InfiniteScroll({ onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "100px",
    });

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [inView, hasMore, isLoading, onLoadMore]);

    if (!hasMore) return null;

    return (
        <div ref={ref} className="w-full flex justify-center p-4">
            {isLoading && (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            )}
        </div>
    );
}
