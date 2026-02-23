import { Globe, DollarSign, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRegionStore, CountryCode, CurrencyCode } from "@/store/useRegionStore";
import { useLanguageStore, LanguageCode } from "@/store/useLanguageStore";

type RegionConfig = {
    [key in CountryCode]: { label: string; flag: string };
};

const regionConfigs: RegionConfig = {
    US: { label: "United States", flag: "us" },
    EU: { label: "European Union", flag: "eu" },
    BD: { label: "Bangladesh", flag: "bd" },
};

const currencyConfigs: Record<CurrencyCode, { label: string; symbol: string }> = {
    USD: { label: "U.S. Dollar", symbol: "$" },
    EUR: { label: "Euro", symbol: "€" },
    BDT: { label: "Bangladeshi Taka", symbol: "৳" },
};

const languageConfigs: Record<LanguageCode, { label: string; nativeName: string }> = {
    en: { label: "English", nativeName: "English" },
    bn: { label: "Bengali", nativeName: "বাংলা" },
    es: { label: "Spanish", nativeName: "Español" },
    fr: { label: "French", nativeName: "Français" },
    de: { label: "German", nativeName: "Deutsch" },
    ar: { label: "Arabic", nativeName: "العربية" },
};

const RegionSelector = () => {
    const { country, setCountry, currency, setCurrency } = useRegionStore();
    const { language, setLanguage } = useLanguageStore();

    const currentRegionConfig = regionConfigs[country];
    const currentCurrencyConfig = currencyConfigs[currency];
    const currentLanguageConfig = languageConfigs[language] || languageConfigs.en;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-8 border-t border-border mt-4">
            <div className="flex items-center gap-2 md:mr-8 mb-4 md:mb-0">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-primary-foreground">V</span>
                </div>
                <span className="text-xl font-bold text-gradient">Velora</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shadow-sm">
                            <Globe size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{currentLanguageConfig.nativeName}</span>
                            <ChevronDown size={14} className="text-muted-foreground ml-1" />
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shadow-sm">
                            <span className="text-muted-foreground font-semibold">{currentCurrencyConfig.symbol}</span>
                            <span className="text-sm font-medium">{currency} - {currentCurrencyConfig.label}</span>
                            <ChevronDown size={14} className="text-muted-foreground ml-1" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {Object.entries(currencyConfigs).map(([key, config]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => setCurrency(key as CurrencyCode)}
                                className="cursor-pointer"
                            >
                                <span className="font-semibold w-6">{config.symbol}</span>
                                <span>{key} - {config.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shadow-sm">
                            <img
                                src={`https://flagcdn.com/w20/${currentRegionConfig.flag}.png`}
                                width="20"
                                height="15"
                                alt={`${currentRegionConfig.label} flag`}
                                className="rounded-sm object-cover"
                            />
                            <span className="text-sm font-medium">{currentRegionConfig.label}</span>
                            <ChevronDown size={14} className="text-muted-foreground ml-1" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {Object.entries(regionConfigs).map(([key, config]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => setCountry(key as CountryCode)}
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <img
                                    src={`https://flagcdn.com/w20/${config.flag}.png`}
                                    width="20"
                                    height="15"
                                    alt={`${config.label} flag`}
                                    className="rounded-sm object-cover"
                                />
                                <span>{config.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default RegionSelector;
