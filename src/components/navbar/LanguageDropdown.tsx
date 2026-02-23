import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore, LanguageCode } from "@/store/useLanguageStore";

const languageConfigs: Record<LanguageCode, { label: string; nativeName: string; flag: string }> = {
    en: { label: "English", nativeName: "English", flag: "us" },
    bn: { label: "Bengali", nativeName: "বাংলা", flag: "bd" },
    es: { label: "Spanish", nativeName: "Español", flag: "es" },
    fr: { label: "French", nativeName: "Français", flag: "fr" },
    de: { label: "German", nativeName: "Deutsch", flag: "de" },
    ar: { label: "Arabic", nativeName: "العربية", flag: "sa" },
};

const LanguageDropdown = () => {
    const { language, setLanguage } = useLanguageStore();
    const currentLanguageConfig = languageConfigs[language] || languageConfigs.en;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-white/10 border border-transparent p-2 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer text-white focus-visible:outline-none">
                    <img
                        src={`https://flagcdn.com/w20/${currentLanguageConfig.flag}.png`}
                        width="20"
                        height="15"
                        alt={`${currentLanguageConfig.label} flag`}
                        className="rounded-sm object-cover"
                    />
                    <span className="text-sm font-bold ml-1 uppercase">{language}</span>
                    <ChevronDown className="h-3 w-3 text-gray-400 mt-1" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {Object.entries(languageConfigs).map(([key, config]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => setLanguage(key as LanguageCode)}
                        className="cursor-pointer"
                    >
                        <span className="w-8 text-xs text-muted-foreground uppercase">{key}</span>
                        <span>{config.nativeName}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageDropdown;
