"use client"

import { Search, Sun, Moon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useStore } from "@/store/useStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideSheet } from "./SideSheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OmniBar() {
    const { setTheme, theme } = useTheme();
    const { setTab, flyTo } = useStore();

    return (
        <div className="absolute top-6 left-0 right-0 z-50 flex justify-center items-start px-4 pointer-events-none">
            {/* The Floating Capsule */}
            <div className="glass-panel pointer-events-auto flex items-center gap-2 p-2 rounded-full w-full max-w-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">

                {/* Search Icon */}
                <div className="pl-3 text-muted-foreground">
                    <Search className="w-5 h-5" />
                </div>

                {/* The Dropdown Search */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-start w-full text-lg font-normal text-muted-foreground hover:bg-transparent hover:text-foreground">
                            Select Target Zone...
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[300px] glass-panel bg-background/95 backdrop-blur-xl border-border/50">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => flyTo('connaught-place')}>
                            <span className="mr-2">📍</span> Connaught Place (Commercial)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => flyTo('okhla-industrial')}>
                            <span className="mr-2">🏭</span> Okhla Industrial (High Heat)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => flyTo('dwarka-sector-21')}>
                            <span className="mr-2">🏘️</span> Dwarka Sector 21 (Residential)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => flyTo('iit-delhi')}>
                            <span className="mr-2">🎓</span> IIT Delhi (Institutional)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Divider */}
                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Blueprint Toggle */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary" onClick={() => setTab('blueprint')}>
                            <FileText className="w-5 h-5 text-primary" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <SideSheet />
                    </SheetContent>
                </Sheet>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-secondary"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </div>
    );
}