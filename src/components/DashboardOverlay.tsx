"use client";

import { motion } from "framer-motion";
import { ThermometerSun, TreePine, Warehouse, Home, ArrowUpRight } from "lucide-react";

// Define the Props type
interface DashboardProps {
    activeLayers: string[];
    toggleLayer: (layer: string) => void;
}

export default function DashboardOverlay({ activeLayers, toggleLayer }: DashboardProps) {

    // Calculate stats based on active layers (Mock Logic for prototype)
    const stats = {
        roof: { temp: 1.2, area: 500 },
        parking: { temp: 0.8, area: 450 },
        garden: { temp: 1.5, area: 300 },
    };

    const totalTemp = activeLayers.reduce((acc, layer) => acc + (stats[layer as keyof typeof stats]?.temp || 0), 0);
    const totalArea = activeLayers.reduce((acc, layer) => acc + (stats[layer as keyof typeof stats]?.area || 0), 0);

    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
        >
            <div className="flex flex-col xl:flex-row gap-12 xl:items-center justify-between">

                {/* LEFT: Metrics */}
                <div className="flex gap-16">
                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-2 text-xs font-bold uppercase tracking-widest">
                            <ThermometerSun className="w-4 h-4 text-orange-500" /> Cooling
                        </div>
                        <div className="text-6xl md:text-7xl font-bold text-neutral-900 tabular-nums tracking-tighter flex items-baseline gap-2">
                            -{totalTemp.toFixed(1)}<span className="text-3xl text-neutral-400 font-medium">°C</span>
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-neutral-200" />

                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-2 text-xs font-bold uppercase tracking-widest">
                            <ArrowUpRight className="w-4 h-4 text-blue-500" /> Coverage
                        </div>
                        <div className="text-6xl md:text-7xl font-bold text-neutral-900 tabular-nums tracking-tighter flex items-baseline gap-2">
                            {(totalArea / 1000).toFixed(1)}k<span className="text-3xl text-neutral-400 font-medium">m²</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Toggles (Remote Controls for Map) */}
                <div className="bg-white/50 border border-white/60 p-2 rounded-3xl flex flex-wrap gap-2 shadow-inner">
                    <FilterButton
                        isActive={activeLayers.includes("roof")}
                        onClick={() => toggleLayer("roof")}
                        icon={<Home className="w-5 h-5" />}
                        label="Cool Roofs"
                        activeColor="bg-neutral-900 text-white shadow-lg"
                    />
                    <FilterButton
                        isActive={activeLayers.includes("parking")}
                        onClick={() => toggleLayer("parking")}
                        icon={<Warehouse className="w-5 h-5" />}
                        label="Parking"
                        activeColor="bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    />
                    <FilterButton
                        isActive={activeLayers.includes("garden")}
                        onClick={() => toggleLayer("garden")}
                        icon={<TreePine className="w-5 h-5" />}
                        label="Greenery"
                        activeColor="bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    />
                </div>

            </div>
        </motion.div>
    );
}

function FilterButton({ isActive, onClick, icon, label, activeColor }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold text-sm
                ${isActive ? activeColor : "bg-transparent text-neutral-500 hover:bg-white hover:text-neutral-900"}
            `}
        >
            {icon} {label}
        </button>
    )
}