"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

// --- COMPONENTS ---
import RealMap from "@/components/RealMap";
import DashboardOverlay from "@/components/DashboardOverlay";
import MaterialShowcase from "@/components/MaterialShowcase";
import AlbedoCalculator from "@/components/AlbedoCalculator";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeLayers, setActiveLayers] = useState<string[]>(["roof", "parking", "garden"]);
    const [isMobile, setIsMobile] = useState(false);

    // --- DETECT MOBILE ---
    // We disable heavy animations on mobile to prevent flickering
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleLayer = (layer: string) => {
        setActiveLayers(prev =>
            prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
        );
    };

    // --- SCROLL ANIMATION LOGIC ---
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // 1. Map Animations (DESKTOP ONLY)
    // On mobile, we force these values to remain static
    const mapScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
    const mapY = useTransform(scrollYProgress, [0, 0.15], ["0%", "5%"]);
    const mapRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "40px"]);
    const mapOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0.5]);

    // 2. Dashboard Animations
    const dashboardOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
    const dashboardY = useTransform(scrollYProgress, [0, 0.15], [0, 50]);

    const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("auto");

    useEffect(() => {
        const unsubscribe = dashboardOpacity.on("change", (latest) => {
            setPointerEvents(latest < 0.1 ? "none" : "auto");
        });
        return () => unsubscribe();
    }, [dashboardOpacity]);

    return (
        <main ref={containerRef} className="relative bg-[#F4F4F5] dark:bg-black min-h-[350vh] transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            <ThemeToggle />

            {/* 1. MAP BACKGROUND */}
            <div className="fixed top-0 left-0 w-full h-[100dvh] z-0 flex items-start justify-center pt-0 md:pt-2 overflow-hidden pointer-events-none touch-none">
                <motion.div
                    // MOBILE FIX: If mobile, use static values. If desktop, use animated values.
                    style={{
                        scale: isMobile ? 1 : mapScale,
                        y: isMobile ? "0%" : mapY,
                        borderRadius: isMobile ? "0px" : mapRadius,
                        opacity: isMobile ? 1 : mapOpacity
                    }}
                    className="w-full h-full md:w-[98%] md:h-[95%] relative shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 pointer-events-auto transition-colors duration-500"
                >
                    <RealMap activeLayers={activeLayers} />
                </motion.div>
            </div>

            {/* SPACER */}
            {/* On mobile, we give the map a full screen height before content starts */}
            <div className="h-[100dvh] w-full relative z-10 pointer-events-none" />

            {/* 2. MAIN CONTENT STACK */}
            <div className="relative z-20 w-full flex flex-col items-center">

                {/* DASHBOARD OMNIBAR */}
                <motion.div
                    style={{ opacity: dashboardOpacity, y: dashboardY, pointerEvents }}
                    className="fixed bottom-8 md:bottom-12 left-0 w-full z-50 px-4 flex justify-center"
                >
                    <div className="w-full max-w-4xl">
                        <DashboardOverlay activeLayers={activeLayers} toggleLayer={toggleLayer} />
                    </div>
                </motion.div>

                {/* SCROLLABLE CONTENT */}
                <div className="w-full bg-[#F4F4F5] dark:bg-black rounded-t-[2rem] md:rounded-t-[3.5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.05)] border-t border-white/50 dark:border-white/10 overflow-hidden backdrop-blur-sm transition-colors duration-500 mt-[-5vh]">

                    <MaterialShowcase />

                    <div className="w-full h-32 md:h-48 flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-[#F4F4F5] to-[#FDFBF7] dark:from-black dark:to-neutral-950 transition-colors duration-500">
                        <span className="text-[15vw] md:text-[12vw] font-black text-neutral-200/50 dark:text-neutral-800/50 uppercase tracking-tighter select-none leading-none">
                            Estimate
                        </span>
                    </div>

                    <AlbedoCalculator />
                    <Footer />

                </div>
            </div>
        </main>
    );
}