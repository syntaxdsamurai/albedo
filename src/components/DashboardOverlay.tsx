"use client";

import { Leaf, Sun, Car, Layers, Thermometer, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DashboardOverlayProps {
    activeLayers: string[];
    toggleLayer: (layer: string) => void;
}

const IMPACT_VALUES: Record<string, number> = {
    roof: 2.1,
    garden: 1.2,
    parking: 1.5
};

export default function DashboardOverlay({ activeLayers, toggleLayer }: DashboardOverlayProps) {
    const [totalDrop, setTotalDrop] = useState(0);

    useEffect(() => {
        const drop = activeLayers.reduce((acc, layer) => acc + (IMPACT_VALUES[layer] || 0), 0);
        setTotalDrop(drop);
    }, [activeLayers]);

    const filters = [
        { id: "roof", label: "Cool Roofs", icon: Sun, color: "text-orange-500", bg: "bg-orange-500", val: "2.1°" },
        { id: "garden", label: "Bio Walls", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500", val: "1.2°" },
        { id: "parking", label: "Solar Parking", icon: Car, color: "text-blue-500", bg: "bg-blue-500", val: "1.5°" },
    ];

    return (
        <div className="w-full flex justify-center">
            {/* THEME FIX:
               - Light: bg-white/80, border-neutral-200
               - Dark: bg-neutral-900/80, border-neutral-800
               - Backdrop blur handles the glass look
            */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 transition-colors duration-300">

                {/* SECTION 1: TOGGLES */}
                <div className="flex items-center gap-1">
                    <div className="px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 flex items-center gap-2 transition-colors duration-300">
                        <Layers className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 hidden lg:block">
                            Layers
                        </span>
                    </div>

                    {filters.map((filter) => {
                        const isActive = activeLayers.includes(filter.id);
                        const Icon = filter.icon;

                        return (
                            <button
                                key={filter.id}
                                onClick={() => toggleLayer(filter.id)}
                                className={`
                                    relative px-3 md:px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 group
                                    ${isActive
                                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-neutral-700 dark:hover:text-neutral-300"}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-dot"
                                        className={`w-1.5 h-1.5 rounded-full ${filter.bg} absolute top-2 right-2`}
                                    />
                                )}

                                <Icon className={`w-4 h-4 ${isActive ? filter.color : "opacity-50"}`} />
                                <span className="text-sm font-bold hidden sm:block">{filter.label}</span>

                                {isActive && (
                                    <span className="text-[10px] font-mono opacity-50 ml-1">-{filter.val}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="hidden md:block w-px h-8 bg-neutral-200 dark:bg-neutral-800 mx-2 transition-colors duration-300" />

                {/* SECTION 2: LIVE CALCULATOR */}
                <div className="flex items-center gap-3 px-4 py-1.5 bg-neutral-50/50 dark:bg-black/20 rounded-xl border border-neutral-100 dark:border-white/5 min-w-[140px] justify-between transition-colors duration-300">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Net Cooling</span>
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <Thermometer className="w-3 h-3" />
                            <span className="text-xs font-medium">Potential</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <ArrowDown className="w-4 h-4 text-emerald-500 animate-bounce" style={{ animationDuration: '2s' }} />
                        <motion.span
                            key={totalDrop}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-black text-neutral-900 dark:text-white font-mono tracking-tighter"
                        >
                            {totalDrop.toFixed(1)}°
                        </motion.span>
                    </div>
                </div>

            </div>
        </div>
    );
}