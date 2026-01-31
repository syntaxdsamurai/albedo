"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Navigation, Plus, Minus, X } from "lucide-react";
import { useTheme } from "next-themes";

// --- 1. CONFIGURATION ---
const INITIAL_VIEW = { lng: 77.2167, lat: 28.6315, zoom: 11 };
const ZOOM_THRESHOLD = 14.5;

const HUBS = [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
    { name: "Nehru Place", lat: 28.5494, lng: 77.2537 },
    { name: "DLF CyberHub", lat: 28.4950, lng: 77.0895 },
    { name: "Noida Sec-18", lat: 28.5708, lng: 77.3271 },
    { name: "Rohini Sec-10", lat: 28.7166, lng: 77.1126 },
    { name: "Dwarka Sec-21", lat: 28.5887, lng: 77.0426 }
];

// --- 2. COLONY GENERATOR (Static Data) ---
const generateCityData = () => {
    const features: any[] = [];
    const BUILDING_COUNT = 80;
    const SPREAD_RADIUS = 0.0035;

    HUBS.forEach((hub, hubIdx) => {
        const placedBuildings: {x: number, y: number, w: number, h: number}[] = [];
        let attempts = 0;
        let count = 0;

        while (count < BUILDING_COUNT && attempts < 1000) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.sqrt(Math.random()) * SPREAD_RADIUS;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;

            if (Math.abs(dx) < 0.0004 || Math.abs(dy) < 0.0004) continue;

            const width = 0.00015 + (Math.random() * 0.00020);
            const heightFactor = 0.5 + Math.random();
            const depth = width * heightFactor;

            const hasOverlap = placedBuildings.some(b => {
                const minDist = 0.0002;
                return (Math.abs(dx - b.x) < (width + b.w)/2 + minDist && Math.abs(dy - b.y) < (depth + b.h)/2 + minDist);
            });
            if (hasOverlap) continue;
            placedBuildings.push({ x: dx, y: dy, w: width, h: depth });
            count++;

            const lng = hub.lng + dx;
            const lat = hub.lat + dy;

            const rand = Math.random();
            let type = "standard";
            let color = "#cbd5e1";
            let bHeight = 15 + Math.random() * 40;
            let label = "Commercial Block";
            let tempDrop = "0°C";
            let isSpecial = false;

            if (rand > 0.93) {
                type = "garden"; color = "#10b981"; label = "Bio-Facade System"; tempDrop = "3.1°C"; isSpecial = true;
            } else if (rand > 0.88) {
                type = "parking"; color = "#3b82f6"; bHeight = 4; label = "Solar Parking Grid"; tempDrop = "5.5°C"; isSpecial = true;
            } else if (rand > 0.80) {
                type = "roof"; color = "#f97316"; label = "Cool Roof Retrofit"; tempDrop = "4.2°C"; isSpecial = true;
            }

            const halfW = width / 2;
            const halfD = depth / 2;
            const poly = [[lng - halfW, lat - halfD], [lng + halfW, lat - halfD], [lng + halfW, lat + halfD], [lng - halfW, lat + halfD], [lng - halfW, lat - halfD]];

            features.push({
                type: "Feature",
                properties: { id: `${hubIdx}-${count}`, type, color, height: bHeight, label, tempDrop, hub: hub.name, isSpecial },
                geometry: { type: "Polygon", coordinates: [poly] }
            });
        }
    });
    return { type: "FeatureCollection", features };
};

const CITY_DATA = generateCityData();

interface RealMapProps {
    activeLayers: string[];
    targetLocation?: [number, number] | null;
}

export default function RealMap({ activeLayers, targetLocation }: RealMapProps) {
    const { resolvedTheme } = useTheme();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Detect mobile
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 1. INITIALIZE MAP
    useEffect(() => {
        if (!mounted) return;

        if (map.current) {
            markersRef.current.forEach(m => m.remove());
            map.current.remove();
            map.current = null;
        }

        if (!mapContainer.current) return;

        const isDark = resolvedTheme === 'dark';
        const styleUrl = isDark
            ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

        const m = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: [INITIAL_VIEW.lng, INITIAL_VIEW.lat],
            zoom: INITIAL_VIEW.zoom,
            pitch: 0,
            attributionControl: false,
            // MOBILE OPTIMIZATIONS
            trackResize: true,
            cooperativeGestures: false,
            // Prevent flickering on mobile
            fadeDuration: isMobile ? 0 : 300,
            refreshExpiredTiles: false,
        });

        map.current = m;

        m.on("load", () => {
            m.addSource('albedo-city', { type: 'geojson', data: CITY_DATA as any });

            m.addLayer({
                'id': '3d-buildings',
                'source': 'albedo-city',
                'type': 'fill-extrusion',
                'paint': {
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': isDark ? 0.6 : 0.8,
                    'fill-extrusion-vertical-gradient': true
                }
            });

            const filter: any = ['any', ['==', 'type', 'standard'], ['in', 'type', ...activeLayers]];
            m.setFilter('3d-buildings', filter);

            markersRef.current = [];
            HUBS.forEach((hub) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'hub-marker-wrapper';
                wrapper.style.cssText = `
                    cursor: pointer;
                    width: 48px;
                    height: 48px;
                    transition: opacity 0.4s ease;
                    z-index: 10;
                `;

                const inner = document.createElement('div');
                const bg = isDark ? '#171717' : '#ffffff';
                const border = isDark ? '2px solid #ffffff' : '1px solid #e5e5e5';

                inner.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background-color: ${bg};
                    border-radius: 50%;
                    border: ${border};
                    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const img = document.createElement('img');
                img.src = "/app-logo.png";
                img.style.cssText = `
                    width: 60%;
                    height: 60%;
                    object-fit: contain;
                `;

                inner.appendChild(img);
                wrapper.appendChild(inner);

                wrapper.onclick = () => {
                    m.flyTo({
                        center: [hub.lng, hub.lat],
                        zoom: 16.5,
                        pitch: isMobile ? 45 : 60,
                        bearing: -20,
                        duration: isMobile ? 1000 : 1500
                    });
                };

                const marker = new maplibregl.Marker({ element: wrapper })
                    .setLngLat([hub.lng, hub.lat])
                    .addTo(m);

                markersRef.current.push(marker);
            });

            const updateVisibility = () => {
                const currentZoom = m.getZoom();
                const isMicroView = currentZoom >= ZOOM_THRESHOLD;

                markersRef.current.forEach(marker => {
                    const el = marker.getElement();
                    el.style.opacity = isMicroView ? '0' : '1';
                    el.style.pointerEvents = isMicroView ? 'none' : 'auto';
                });
            };

            m.on('zoom', updateVisibility);
            updateVisibility();

            m.on('click', '3d-buildings', (e) => {
                if (!e.features?.[0]) return;
                const props = e.features[0].properties;
                if (!props.isSpecial) return;

                setSelectedFeature({
                    ...props,
                    lat: e.lngLat.lat,
                    lng: e.lngLat.lng
                });

                m.easeTo({ center: e.lngLat, offset: [0, 100], duration: 800 });
            });

            m.on('mousemove', '3d-buildings', (e) => {
                if (e.features && e.features.length > 0) {
                    m.getCanvas().style.cursor = 'pointer';
                }
            });
            m.on('mouseleave', '3d-buildings', () => {
                m.getCanvas().style.cursor = '';
            });
        });

        return () => {
            markersRef.current.forEach(m => m.remove());
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [resolvedTheme, mounted, isMobile]);

    // 2. LIVE FILTERING
    useEffect(() => {
        if (!map.current || !map.current.getLayer('3d-buildings')) return;
        const filter: any = ['any', ['==', 'type', 'standard'], ['in', 'type', ...activeLayers]];
        map.current.setFilter('3d-buildings', filter);
    }, [activeLayers]);

    // 3. TARGET LOCATION
    useEffect(() => {
        if (!map.current || !targetLocation) return;

        map.current.flyTo({
            center: [targetLocation[1], targetLocation[0]],
            zoom: 16,
            pitch: isMobile ? 45 : 50,
            duration: 2000
        });
    }, [targetLocation, isMobile]);

    const handleZoomIn = () => map.current?.zoomIn();
    const handleZoomOut = () => map.current?.zoomOut();
    const handleReset = () => {
        map.current?.flyTo({ center: [INITIAL_VIEW.lng, INITIAL_VIEW.lat], zoom: INITIAL_VIEW.zoom, pitch: 0 });
        setSelectedFeature(null);
    };

    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                <div className="text-neutral-400">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] overflow-hidden border border-neutral-300 dark:border-neutral-800 transition-colors duration-500">
            <div
                ref={mapContainer}
                className="w-full h-full"
                style={{
                    touchAction: "none",
                    // Prevent flickering on mobile webkit
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                }}
            />

            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
                <button onClick={handleReset} className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition"><Navigation className="w-5 h-5" /></button>
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col">
                    <button onClick={handleZoomIn} className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"><Plus className="w-5 h-5" /></button>
                    <button onClick={handleZoomOut} className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"><Minus className="w-5 h-5" /></button>
                </div>
            </div>

            {selectedFeature && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[140%] z-30 pointer-events-none animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-neutral-200 dark:border-white/10 min-w-[260px] text-center pointer-events-auto relative">
                        <button onClick={() => setSelectedFeature(null)} className="absolute top-2 right-2 p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"><X className="w-3 h-3 text-neutral-400" /></button>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{selectedFeature.hub}</div>
                        <div className="text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-2">{selectedFeature.label}</div>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <div className="text-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Temp Drop</div>
                                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedFeature.tempDrop}</div>
                            </div>
                            <div className="text-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <div className="text-[10px] text-neutral-500 uppercase font-bold">Type</div>
                                <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300 capitalize">{selectedFeature.type}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-4 h-4 bg-white/90 dark:bg-black/80 border-r border-b border-neutral-200 dark:border-white/10 backdrop-blur-xl absolute left-1/2 -translate-x-1/2 -bottom-2 rotate-45"></div>
                </div>
            )}
        </div>
    );
}