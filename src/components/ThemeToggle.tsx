import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9 opacity-0" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-transparent 
                hover:border-white/20 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c232] group overflow-hidden shadow-sm"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 -rotate-90'}`}>
                <div className="flex h-full w-full items-center justify-center">
                    <Moon className="h-[18px] w-[18px] text-white group-hover:text-[#f1c232] transition-colors drop-shadow-sm" />
                </div>
            </div>

            <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${theme === 'light' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 rotate-90'}`}>
                <div className="flex h-full w-full items-center justify-center">
                    <Sun className="h-5 w-5 text-white group-hover:text-[#f1c232] transition-colors drop-shadow-sm" />
                </div>
            </div>

            {/* Subtle glow effect behind icons */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full blur-[2px] transition-opacity duration-300 pointer-events-none"></div>
        </button>
    );
};

export default ThemeToggle;
