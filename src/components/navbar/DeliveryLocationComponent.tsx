import { MapPin } from "lucide-react";
import { useRegionStore, CountryCode } from "@/store/useRegionStore";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const regionNames: Record<CountryCode, string> = {
    US: "United States",
    EU: "European Union",
    BD: "Bangladesh",
};

const DeliveryLocationComponent = () => {
    const { country, setCountry } = useRegionStore();
    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-white/10 border border-transparent p-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer text-white focus-visible:outline-none">
                    <MapPin className="h-4 w-4 mt-2 hidden sm:block opacity-90" />
                    <div className="flex flex-col items-start leading-tight text-left">
                        <span className="text-[10px] sm:text-xs text-white/70 font-normal">Deliver to</span>
                        <span className="text-sm font-bold truncate max-w-[120px]">
                            {regionNames[country] || country}
                        </span>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose your location</DialogTitle>
                    <DialogDescription>
                        Delivery options and delivery speeds may vary for different locations.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 mt-4">
                    {(Object.entries(regionNames) as [CountryCode, string][]).map(([code, name]) => (
                        <button
                            key={code}
                            onClick={() => setCountry(code)}
                            className={`p-3 text-left rounded-md border transition-colors ${country === code
                                ? "border-primary bg-primary/10 font-medium"
                                : "border-border hover:bg-muted"
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryLocationComponent;
