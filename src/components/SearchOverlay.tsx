"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

interface SearchOverlayProps {
    onSelectLocation: (lat: number, lng: number) => void;
}

export default function SearchOverlay({ onSelectLocation }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // --- REAL GEOCODING API (OpenStreetMap Nominatim) ---
    const fetchLocations = async (text: string) => {
        if (text.length < 3) return;

        setIsLoading(true);
        try {
            // Limited to 5 results for cleaner UI
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`);
            const data = await res.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        // Debounce: Wait 500ms after typing stops before calling API
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (val.length > 2) {
            debounceRef.current = setTimeout(() => fetchLocations(val), 500);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (place: any) => {
        setQuery(place.display_name.split(",")[0]); // Keep only the main name
        setSuggestions([]);
        setIsFocused(false);
        onSelectLocation(parseFloat(place.lat), parseFloat(place.lon));
    };

    return (
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 w-[300px] md:w-[400px]">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 text-neutral-400" />
                    )}
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-neutral-900 dark:text-white"
                    placeholder="Search in Delhi NCR"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => setIsFocused(true)}
                    // Delay blur to allow click to register
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
            </div>

            {/* LIVE SUGGESTIONS */}
            {isFocused && suggestions.length > 0 && (
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden max-h-[300px] overflow-y-auto">
                    {suggestions.map((place, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(place)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-start gap-3 group border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                        >
                            <div className="mt-0.5 p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400 group-hover:bg-white dark:group-hover:bg-black group-hover:text-black dark:group-hover:text-white transition-colors shrink-0">
                                <MapPin className="w-3 h-3" />
                            </div>
                            <div>
                                <span className="font-bold text-neutral-900 dark:text-neutral-200 block truncate w-full">
                                    {place.display_name.split(",")[0]}
                                </span>
                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                    {place.display_name.split(",").slice(1).join(",")}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}