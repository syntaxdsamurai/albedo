"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import ImmersiveMap from "@/components/ImmersiveMap";
import DashboardOverlay from "@/components/DashboardOverlay";
import MaterialShowcase from "@/components/MaterialShowcase";
import DetailedCalculator from "@/components/DetailedCalculator";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- LIFTED STATE ---
    // This state controls both the pins on the map and the numbers on the dashboard
    const [activeLayers, setActiveLayers] = useState<string[]>(["roof", "parking", "garden"]);

    const toggleLayer = (layer: string) => {
        setActiveLayers(prev =>
            prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
        );
    };

    // Scroll Animation Logic
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const mapScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
    const mapY = useTransform(scrollYProgress, [0, 0.15], ["0%", "5%"]);
    const mapRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "40px"]);
    const mapOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0.5]);

    return (
        <main ref={containerRef} className="relative bg-[#F4F4F5] min-h-[350vh]">

            {/* 1. MAP BACKGROUND (Controlled by State) */}
            <div className="fixed top-0 left-0 w-full h-screen z-0 flex items-start justify-center pt-2 overflow-hidden">
                <motion.div
                    style={{ scale: mapScale, y: mapY, borderRadius: mapRadius, opacity: mapOpacity }}
                    className="w-full md:w-[98%] h-[95%] relative shadow-2xl overflow-hidden bg-white"
                >
                    {/* Pass the state down to the map */}
                    <ImmersiveMap activeLayers={activeLayers} />
                </motion.div>
            </div>

            <div className="h-[90vh] w-full relative z-10 pointer-events-none" />

            <div className="relative z-20 w-full flex flex-col items-center">

                {/* 2. DASHBOARD (Controls the State) */}
                <div className="w-full max-w-7xl px-4 -mt-32 mb-24 pointer-events-auto">
                    <DashboardOverlay activeLayers={activeLayers} toggleLayer={toggleLayer} />
                </div>

                {/* 3. SCROLL CONTENT */}
                <div className="w-full bg-[#F4F4F5] rounded-t-[3.5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.05)] border-t border-white/50 overflow-hidden backdrop-blur-sm">
                    <MaterialShowcase />

                    <div className="w-full h-32 flex items-center justify-center overflow-hidden relative">
            <span className="text-9xl font-bold text-neutral-200 uppercase tracking-tighter select-none opacity-50">
              Estimate
            </span>
                    </div>

                    <DetailedCalculator />

                    {/* Footer Code (Same as before) */}
                    <footer className="w-full bg-neutral-950 text-white pt-24 pb-12 px-6 rounded-t-[3rem] mt-[-3rem] relative z-10">
                        {/* ... footer content ... */}
                    </footer>
                </div>
            </div>
        </main>
    );
}