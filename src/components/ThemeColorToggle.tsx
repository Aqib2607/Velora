import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
    { name: "Default", class: "" },
    { name: "Rose", class: "theme-rose" },
    { name: "Green", class: "theme-green" },
    { name: "Orange", class: "theme-orange" },
];

export function ThemeColorToggle() {
    const [currentTheme, setCurrentTheme] = useState("");

    useEffect(() => {
        document.body.classList.remove("theme-rose", "theme-green", "theme-orange");
        if (currentTheme) {
            document.body.classList.add(currentTheme);
        }
    }, [currentTheme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="glass h-10 w-10 rounded-full">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Change color theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((t) => (
                    <DropdownMenuItem key={t.name} onClick={() => setCurrentTheme(t.class)}>
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
