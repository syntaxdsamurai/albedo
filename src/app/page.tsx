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
    const [isMobile, setIsMobile] = useState(true); // Default to true to prevent hydration mismatch flicker

    // --- DETECT MOBILE ---
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

    // DESKTOP ANIMATIONS ONLY
    const mapScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
    const mapY = useTransform(scrollYProgress, [0, 0.15], ["0%", "5%"]);
    const mapRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "40px"]);
    const mapOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0.5]);

    // DASHBOARD ANIMATIONS
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
            {/* FIX: 'fixed inset-0' locks all 4 corners. 'z-0' keeps it behind. */}
            <div className="fixed inset-0 w-full h-full z-0 flex items-start justify-center pt-0 md:pt-2 overflow-hidden pointer-events-none touch-none">

                {isMobile ? (
                    // --- MOBILE VERSION (Static, No Motion) ---
                    // This is a plain div. It cannot flicker because it has no animation logic attached.
                    <div className="w-full h-full relative shadow-none overflow-hidden bg-white dark:bg-neutral-900 pointer-events-auto transition-colors duration-500">
                        <RealMap activeLayers={activeLayers} />
                    </div>
                ) : (
                    // --- DESKTOP VERSION (Animated) ---
                    <motion.div
                        style={{ scale: mapScale, y: mapY, borderRadius: mapRadius, opacity: mapOpacity }}
                        className="w-[98%] h-[95%] relative shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 pointer-events-auto transition-colors duration-500"
                    >
                        <RealMap activeLayers={activeLayers} />
                    </motion.div>
                )}
            </div>

            {/* SPACER */}
            {/* Use 100svh (Small Viewport Height) to respect mobile address bars properly */}
            <div className="h-[100svh] w-full relative z-10 pointer-events-none" />

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