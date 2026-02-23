import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (threshold = 10): ScrollDirection => {
    const [scrollDir, setScrollDir] = useState<ScrollDirection>(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') return;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;

            if (Math.abs(scrollY - lastScrollY.current) < threshold) {
                ticking.current = false;
                return;
            }

            // If we're at the very top (scrolling past Y=0 often bouncing on Mac), always report 'up'
            if (scrollY <= 0) {
                setScrollDir('up');
            }
            // Scrolling Down
            else if (scrollY > lastScrollY.current) {
                setScrollDir('down');
            }
            // Scrolling Up
            else if (scrollY < lastScrollY.current) {
                setScrollDir('up');
            }

            lastScrollY.current = scrollY > 0 ? scrollY : 0;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDirection);
                ticking.current = true;
            }
        };

        // Use passive event listener for better scrolling performance
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initialize with a manual call
        lastScrollY.current = window.scrollY;

        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return scrollDir;
};
