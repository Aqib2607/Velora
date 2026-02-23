import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const ecosystemItems = [
    "Velora Music",
    "Velora Ads",
    "Velora Web Services",
    "Velora Prime",
    "Velora Publishing",
    "Velora Business",
    "Velora Global",
    "Velora Cloud",
    "Velora Studios",
    "Velora Reviews",
    "Velora Devices",
    "Velora Subscriptions"
];

const EcosystemGrid = () => {
    return (
        <div className="bg-surface/50 w-full border-t border-border">
            {/* Mobile Accordion View */}
            <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ecosystem" className="border-b-0">
                        <AccordionTrigger className="px-4 py-6 hover:no-underline font-semibold text-sm">
                            Explore Velora Ecosystem
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-6">
                            <div className="grid grid-cols-2 gap-4">
                                {ecosystemItems.map((item) => {
                                    const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                                    return (
                                        <Link to={path} key={item} className="flex flex-col group gap-1 cursor-pointer">
                                            <span className="text-xs font-semibold text-foreground group-hover:underline group-hover:text-primary transition-all">
                                                {item}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground leading-snug break-words">
                                                Premium services.
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:block py-10 container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
                    {ecosystemItems.map((item) => {
                        const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                        return (
                            <Link to={path} key={item} className="flex flex-col group cursor-pointer gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
                                <span className="text-xs font-semibold text-foreground group-hover:underline group-hover:text-primary transition-all">
                                    {item}
                                </span>
                                <span className="text-[11px] text-muted-foreground leading-snug">
                                    Discover, listen, and enjoy premium services with {item}.
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EcosystemGrid;
