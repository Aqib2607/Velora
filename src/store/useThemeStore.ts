import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

// Helper to apply the class immediately to the DOM
const rootApplyThemeClass = (theme: Theme) => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',

            setTheme: (theme) => {
                rootApplyThemeClass(theme);
                set({ theme });
            },

            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                rootApplyThemeClass(newTheme);
                return { theme: newTheme };
            }),
        }),
        {
            name: 'velora-theme-storage',
            // Trigger the DOM update on initial page load if there is a cached theme
            onRehydrateStorage: () => (state) => {
                if (state) {
                    rootApplyThemeClass(state.theme);
                }
            },
        }
    )
);
