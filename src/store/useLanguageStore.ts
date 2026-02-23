import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';

export type LanguageCode = 'en' | 'bn' | 'es' | 'fr' | 'de' | 'ar';

interface LanguageState {
    language: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: (i18n.language as LanguageCode) || 'en',
            setLanguage: (language) => {
                // Determine if layout should be Right-To-Left (Arabic)
                const isRtl = language === 'ar';
                document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

                // Instruct i18next to swap language bundles immediately
                i18n.changeLanguage(language);

                set({ language });
            },
        }),
        {
            name: 'velora-language-storage',
            // Sync initial document dir on store load
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
                    i18n.changeLanguage(state.language);
                }
            }
        }
    )
);
