"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const options = [
        { id: "light", icon: <Sun className="w-4 h-4" /> },
        { id: "system", icon: <Monitor className="w-4 h-4" /> },
        { id: "dark", icon: <Moon className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed top-6 right-6 z-[100]">
            <div className="flex items-center bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full p-1 shadow-lg transition-colors duration-500">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`relative p-2 rounded-full transition-colors duration-200 ${
                            theme === opt.id
                                ? "text-black dark:text-white"
                                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        }`}
                    >
                        {theme === opt.id && (
                            <motion.div
                                layoutId="theme-indicator"
                                className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-black/5 dark:border-white/10"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{opt.icon}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}