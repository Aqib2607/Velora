import { Loader2 } from 'lucide-react';

/**
 * A uniform full-screen fallback component displayed while React.lazy is downloading route chunks.
 */
const SuspenseFallback = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse font-medium">Loading Velora...</p>
        </div>
    );
};

export default SuspenseFallback;
