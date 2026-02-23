import { Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { label: "Today's Deals", href: "/deals" },
    { label: "Customer Service", href: "/help" },
    { label: "Registry", href: "/registry" },
    { label: "Gift Cards", href: "/gift-cards" },
    { label: "Sell", href: "/sell" },
];

const SecondaryNav = () => {
    return (
        <div className="bg-[#6a329f] dark:bg-[#5a2a8f] shadow-inner text-white flex items-center h-10 px-2 sm:px-4 space-x-2 sm:space-x-4 overflow-x-auto whitespace-nowrap text-sm font-medium scrollbar-none transition-colors">
            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex items-center gap-1 hover:text-[#f1c232] border-b-2 border-transparent hover:border-[#f1c232] px-2 py-1 transition-all duration-200 focus-visible:outline-none shrink-0">
                        <Menu className="h-5 w-5" />
                        <span className="font-bold">All</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white dark:bg-zinc-950">
                    <SheetHeader className="bg-[#6a329f] dark:bg-gradient-to-r dark:from-[#6a329f] dark:to-[#5a2a8f] p-4 text-white flex flex-row items-center gap-3 space-y-0 shadow-sm transition-colors">
                        <UserCircle className="h-8 w-8 text-[#f1c232]" />
                        <SheetTitle className="text-white text-xl m-0 tracking-tight">Hello, Sign in</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto py-4 text-foreground text-left whitespace-normal">
                        <div className="px-6 py-2 font-bold text-lg text-foreground">Trending</div>
                        <Link to="/best-sellers" className="block px-6 py-3 text-sm hover:bg-muted transition-colors">Best Sellers</Link>
                        <Link to="/new-releases" className="block px-6 py-3 text-sm hover:bg-muted transition-colors">New Releases</Link>
                        <Link to="/movers-shakers" className="block px-6 py-3 text-sm hover:bg-muted transition-colors">Movers & Shakers</Link>

                        <div className="border-t border-border my-2"></div>

                        <div className="px-6 py-2 font-bold text-lg text-foreground">Digital Content & Devices</div>
                        <Link to="/prime-video" className="block px-6 py-3 text-sm hover:bg-muted transition-colors">Velora Video</Link>
                        <Link to="/music" className="block px-6 py-3 text-sm hover:bg-muted transition-colors">Velora Music</Link>
                    </div>
                </SheetContent>
            </Sheet>

            {navLinks.map((link) => (
                <Link
                    key={link.label}
                    to={link.href}
                    className="hover:text-[#f1c232] border-b-2 border-transparent hover:border-[#f1c232] px-2 py-1 transition-all duration-200"
                >
                    {link.label}
                </Link>
            ))}

            <div className="flex-1"></div>

            <Link
                to="/seller/dashboard"
                className="hidden md:flex hover:text-[#f1c232] border-b-2 border-transparent hover:border-[#f1c232] px-2 py-1 transition-all duration-200 font-bold"
            >
                Shop deals in Electronics
            </Link>
        </div>
    );
};

export default SecondaryNav;
