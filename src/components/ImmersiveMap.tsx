"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Search, ArrowRight } from "lucide-react";

// Dynamic Import (No SSR)
const RealMap = dynamic(() => import("./RealMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin" />
        </div>
    ),
});

export default function ImmersiveMap({ activeLayers }: { activeLayers: string[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);

    // --- SEARCH HANDLER ---
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Use OpenStreetMap Nominatim API (Free Geocoding)
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setTargetCoords([lat, lon]); // Update map target
            } else {
                alert("Location not found");
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full h-full rounded-[3rem] overflow-hidden relative shadow-inner border border-neutral-300 group">

            {/* 1. THE MAP */}
            {/* We pass targetCoords to let the map know where to fly */}
            <RealMap activeLayers={activeLayers} targetLocation={targetCoords} />

            {/* 2. SEARCH BAR OVERLAY */}
            <div className="absolute top-6 left-6 z-[500] w-full max-w-sm">
                <form
                    onSubmit={handleSearch}
                    className="bg-white/90 backdrop-blur-md pl-4 pr-2 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2 focus-within:ring-2 ring-blue-500/50 transition-all"
                >
                    <Search className="w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Delhi locations..."
                        className="bg-transparent border-none outline-none text-sm text-neutral-900 placeholder-neutral-500 w-full font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-neutral-900 text-white p-2 rounded-full hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            </div>

            {/* 3. LIVE FEED BADGE */}
            <div className="absolute top-6 right-6 z-[500] hidden md:flex bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-600">LIVE FEED</span>
            </div>

        </div>
    );
}