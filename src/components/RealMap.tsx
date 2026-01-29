"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Navigation, Plus, Minus, X, MapPin } from "lucide-react";

// --- 1. CONFIGURATION ---
const HUBS = [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167, type: "RING", tempDrop: "4.5°C" },
    { name: "Nehru Place", lat: 28.5494, lng: 77.2537, type: "GRID", tempDrop: "3.8°C" },
    { name: "DLF CyberHub", lat: 28.4950, lng: 77.0895, type: "LINEAR", tempDrop: "5.2°C" },
    { name: "Noida Sec-18", lat: 28.5708, lng: 77.3271, type: "GRID", tempDrop: "4.1°C" },
    { name: "Rohini Sec-10", lat: 28.7166, lng: 77.1126, type: "GRID", tempDrop: "3.5°C" },
    { name: "Dwarka Sec-21", lat: 28.5887, lng: 77.0426, type: "GRID", tempDrop: "4.8°C" }
];

// --- 2. SMART GENERATION LOGIC ---
const generateSmartData = (): any => {
    const features: any[] = [];
    const types = ["roof", "garden", "parking"];

    HUBS.forEach((hub, hubIdx) => {
        let coords: [number, number][] = [];

        if (hub.type === "RING") {
            for (let i = 0; i < 18; i++) {
                const angle = (i / 18) * Math.PI * 2;
                if (i % 3 === 0) continue;
                coords.push([
                    hub.lng + Math.cos(angle) * 0.0018,
                    hub.lat + Math.sin(angle) * 0.0018
                ]);
            }
            for (let i = 0; i < 36; i++) {
                const angle = (i / 36) * Math.PI * 2;
                if (i % 3 === 0) continue;
                coords.push([
                    hub.lng + Math.cos(angle) * 0.0035,
                    hub.lat + Math.sin(angle) * 0.0035
                ]);
            }
        }
        else if (hub.type === "GRID") {
            const spacing = 0.0015;
            for (let r = -rows/2; r < rows/2; r++) {
                for (let c = -cols/2; c < cols/2; c++) {
                    if (Math.abs(r) < 1 && Math.abs(c) < 1) continue;
                    const jitterX = (Math.random() - 0.5) * 0.0004;
                    const jitterY = (Math.random() - 0.5) * 0.0004;
                    coords.push([
                        hub.lng + (c * spacing) + jitterX,
                        hub.lat + (r * spacing) + jitterY
                    ]);
                }
            }
        }
        else {
            for (let i = -10; i < 10; i++) {
                coords.push([
                    hub.lng + (i * 0.0015),
                    hub.lat + (i * 0.0012) + (Math.random() * 0.0005)
                ]);
                coords.push([
                    hub.lng + (i * 0.0015) + 0.001,
                    hub.lat + (i * 0.0012) - 0.0005
                ]);
            }
        }

        coords.forEach((pt, i) => {
            const type = types[i % 3];
            const size = 0.0001;

            const poly = [
                [pt[0] - size, pt[1] - size],
                [pt[0] + size, pt[1] - size],
                [pt[0] + size, pt[1] + size],
                [pt[0] - size, pt[1] + size],
                [pt[0] - size, pt[1] - size]
            ];

            features.push({
                "type": "Feature",
                "properties": {
                    "id": `${hubIdx}-${i}`,
                    "type": type,
                    "hub": hub.name,
                    "height": type === 'roof' ? 30 : type === 'garden' ? 12 : 3,
                    "base": type === 'roof' ? 29 : 0,
                    "emoji": type === 'roof' ? '⚡' : type === 'garden' ? '🌳' : '🚗',
                    "color": type === 'roof' ? '#f97316' : type === 'garden' ? '#10b981' : '#3b82f6',
                    "temp": `-${(Math.random() * 3 + 2).toFixed(1)}°`
                },
                "geometry": { "type": "Polygon", "coordinates": [poly] }
            });
        });
    });

    return { "type": "FeatureCollection" as const, "features": features };
};

const rows = 6;
const cols = 6;

const generateSummaryData = (): any => ({
    "type": "FeatureCollection" as const,
    "features": HUBS.map(hub => ({
        "type": "Feature",
        "properties": {
            "name": hub.name,
            "label": `Avg Temp ${hub.tempDrop}`
        },
        "geometry": { "type": "Point", "coordinates": [hub.lng, hub.lat] }
    }))
});

const DETAILED_GEOJSON = generateSmartData();
const SUMMARY_GEOJSON = generateSummaryData();
const ZOOM_THRESHOLD = 13.5;

interface RealMapProps { activeLayers: string[]; targetLocation?: [number, number] | null; }

export default function RealMap({ activeLayers, targetLocation }: RealMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

    useEffect(() => {
        // --- SAFEGUARD: Prevent double-loading ---
        if (map.current || !mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
            center: [77.2167, 28.6315],
            zoom: 11,
            pitch: 0,
            bearing: 0,
        });

        const m = map.current;

        m.on("load", () => {
            if (!map.current) return; // Check if map was destroyed during load

            m.addSource('detailed-data', { type: 'geojson', data: DETAILED_GEOJSON });
            m.addSource('summary-data', { type: 'geojson', data: SUMMARY_GEOJSON });

            // 1. 3D BLOCKS (Detailed)
            m.addLayer({
                'id': 'detailed-blocks',
                'source': 'detailed-data',
                'type': 'fill-extrusion',
                'minzoom': ZOOM_THRESHOLD,
                'paint': {
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base'],
                    'fill-extrusion-opacity': 0.85
                }
            });

            // 2. FLOATING EMOJIS (Detailed)
            m.addLayer({
                'id': 'detailed-emojis',
                'source': 'detailed-data',
                'type': 'symbol',
                'minzoom': ZOOM_THRESHOLD,
                'layout': {
                    'text-field': ['get', 'emoji'],
                    'text-size': ['interpolate', ['linear'], ['zoom'], 14, 12, 18, 26],
                    'text-offset': [0, -1],
                    'text-allow-overlap': false,
                }
            });

            // 3. REGIONAL PINS (Zoomed Out) - NO TEXT, JUST PINS
            m.addLayer({
                'id': 'summary-pins',
                'source': 'summary-data',
                'type': 'circle',
                'maxzoom': ZOOM_THRESHOLD,
                'paint': {
                    // Big Green Pin Style
                    'circle-radius': 10,
                    'circle-color': '#10b981', // Emerald Green
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff', // White border
                    'circle-opacity': 1
                }
            });

            // EVENTS
            m.on('zoomend', () => {
                const zoom = m.getZoom();
                setIsZoomedIn(zoom > ZOOM_THRESHOLD);
                m.easeTo({ pitch: zoom > ZOOM_THRESHOLD ? 55 : 0 });
            });

            m.on('click', 'detailed-blocks', (e) => {
                if (!e.features?.[0]) return;
                const f = e.features[0];
                setSelectedItem({ ...f.properties, lat: e.lngLat.lat, lng: e.lngLat.lng });
                m.flyTo({ center: e.lngLat, zoom: 17.5, pitch: 60 });
            });

            m.on('click', 'summary-pins', (e) => {
                if (!e.features?.[0]) return;
                m.flyTo({ center: e.lngLat, zoom: 15.5 });
            });

            ['detailed-blocks', 'summary-pins'].forEach(l => {
                m.on('mouseenter', l, () => m.getCanvas().style.cursor = 'pointer');
                m.on('mouseleave', l, () => m.getCanvas().style.cursor = '');
            });
        });

        // --- THE CRITICAL FIX ---
        // This cleanup function destroys the map when you navigate away or reload.
        // Without this, the browser freezes because multiple maps fight for control.
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };

    }, []);

    // FILTERS
    useEffect(() => {
        if (!map.current || !map.current.getLayer('detailed-blocks')) return;
        const m = map.current;
        const filter: any = ['any', ...activeLayers.map(layer => ['==', 'type', layer])];

        m.setFilter('detailed-blocks', filter);
        m.setFilter('detailed-emojis', filter);
    }, [activeLayers]);

    // SEARCH
    useEffect(() => {
        if (map.current && targetLocation) {
            map.current.flyTo({ center: [targetLocation[1], targetLocation[0]], zoom: 16 });
        }
    }, [targetLocation]);

    const handleZoom = (d: 'in' | 'out') => map.current?.[d === 'in' ? 'zoomIn' : 'zoomOut']();
    const handleReset = () => map.current?.flyTo({ center: [77.2167, 28.6315], zoom: 11, pitch: 0 });

    return (
        <div className="w-full h-full relative group bg-neutral-100 border border-neutral-300 rounded-[3rem] overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />

            {/* CONTROLS */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
                <button onClick={handleReset} className="bg-white p-3 rounded-xl shadow-xl border border-neutral-200 text-neutral-600 hover:text-black transition">
                    <Navigation className="w-5 h-5" />
                </button>
                <div className="bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col">
                    <button onClick={() => handleZoom("in")} className="p-3 hover:bg-neutral-50 border-b border-neutral-100 text-neutral-600"><Plus className="w-5 h-5" /></button>
                    <button onClick={() => handleZoom("out")} className="p-3 hover:bg-neutral-50 text-neutral-600"><Minus className="w-5 h-5" /></button>
                </div>
            </div>

            {/* DETAIL POPUP */}
            {selectedItem && isZoomedIn && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] z-20 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-neutral-200 min-w-[220px] text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 pointer-events-auto relative">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{selectedItem.hub}</div>

                        <div className="text-5xl mb-3 drop-shadow-sm animate-bounce">{selectedItem.emoji}</div>

                        <div className="text-xl font-bold text-neutral-900 capitalize leading-tight mb-1">
                            {selectedItem.type === 'roof' ? 'Solar Roof' : selectedItem.type === 'garden' ? 'Bio Garden' : 'Solar Parking'}
                        </div>

                        <div className="inline-flex items-center gap-1.5 bg-neutral-100 px-3 py-1 rounded-full mt-2">
                            <span className="text-xs font-bold text-neutral-500 uppercase">Impact</span>
                            <span className="text-sm font-black text-neutral-800">{selectedItem.temp}C</span>
                        </div>

                        <button onClick={() => setSelectedItem(null)} className="absolute -top-3 -right-3 bg-neutral-900 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition border-2 border-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="w-4 h-4 bg-white/95 border-r border-b border-neutral-200 absolute left-1/2 -translate-x-1/2 -bottom-2 rotate-45"></div>
                </div>
            )}

            {/* ZOOM INDICATOR */}
            {!isZoomedIn && (
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur border border-neutral-200 text-neutral-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-10">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Regional Impact View
                </div>
            )}
        </div>
    );
}