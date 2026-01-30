"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

// --- CONFIGURATION DATA ---
const HUBS = [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167, type: "RING", tempDrop: "4.5°C" },
    { name: "Nehru Place", lat: 28.5494, lng: 77.2537, type: "GRID", tempDrop: "3.8°C" },
    { name: "DLF CyberHub", lat: 28.4950, lng: 77.0895, type: "LINEAR", tempDrop: "5.2°C" },
    { name: "Noida Sec-18", lat: 28.5708, lng: 77.3271, type: "GRID", tempDrop: "4.1°C" },
    { name: "Rohini Sec-10", lat: 28.7166, lng: 77.1126, type: "GRID", tempDrop: "3.5°C" },
    { name: "Dwarka Sec-21", lat: 28.5887, lng: 77.0426, type: "GRID", tempDrop: "4.8°C" }
];

// --- DATA GENERATION LOGIC ---
const generateDetailedData = () => {
    const features: any[] = [];
    const types = ["roof", "garden", "parking"];

    HUBS.forEach((hub, hubIdx) => {
        let coords: [number, number][] = [];
        if (hub.type === "RING") {
            for (let i = 0; i < 18; i++) {
                const angle = (i / 18) * Math.PI * 2;
                if (i % 3 === 0) continue;
                coords.push([hub.lng + Math.cos(angle) * 0.0018, hub.lat + Math.sin(angle) * 0.0018]);
            }
        } else if (hub.type === "GRID") {
            const spacing = 0.0015;
            for (let r = -3; r < 3; r++) {
                for (let c = -3; c < 3; c++) {
                    if (Math.abs(r) < 1 && Math.abs(c) < 1) continue;
                    coords.push([hub.lng + (c * spacing), hub.lat + (r * spacing)]);
                }
            }
        } else {
            for (let i = -5; i < 5; i++) {
                coords.push([hub.lng + (i * 0.0015), hub.lat + (i * 0.0012)]);
                coords.push([hub.lng + (i * 0.0015) + 0.001, hub.lat + (i * 0.0012) - 0.0005]);
            }
        }

        coords.forEach((pt, i) => {
            const type = types[i % 3];
            const size = 0.0001;
            const poly = [
                [pt[0] - size, pt[1] - size], [pt[0] + size, pt[1] - size],
                [pt[0] + size, pt[1] + size], [pt[0] - size, pt[1] + size],
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

const DETAILED_GEOJSON = generateDetailedData();
const ZOOM_THRESHOLD = 13.5;

// --- THE HOOK ---
export function useMapController(
    mapContainerRef: React.RefObject<HTMLDivElement | null>, // <--- FIXED TYPE
    activeLayers: string[],
    onItemSelected: (item: any) => void,
    onZoomChange: (isZoomedIn: boolean) => void
) {
    const { resolvedTheme } = useTheme();
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);

    // 1. INITIALIZATION & THEME SWITCHING
    useEffect(() => {
        // Cleanup existing instance
        if (map.current) {
            markersRef.current.forEach(m => m.remove());
            map.current.remove();
            map.current = null;
        }

        if (!mapContainerRef.current) return;

        const isDark = resolvedTheme === 'dark';
        const styleUrl = isDark
            ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

        const m = new maplibregl.Map({
            container: mapContainerRef.current,
            style: styleUrl,
            center: [77.2167, 28.6315],
            zoom: 11,
            pitch: 0,
            bearing: 0,
            attributionControl: false
        });

        map.current = m;

        m.on("load", () => {
            if (!map.current) return;
            m.addSource('detailed-data', { type: 'geojson', data: DETAILED_GEOJSON });

            // Layers
            m.addLayer({
                'id': 'detailed-blocks',
                'source': 'detailed-data',
                'type': 'fill-extrusion',
                'minzoom': ZOOM_THRESHOLD,
                'paint': {
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base'],
                    'fill-extrusion-opacity': isDark ? 0.9 : 0.85
                }
            });

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
                },
                'paint': {
                    'text-halo-color': isDark ? '#000000' : '#ffffff',
                    'text-halo-width': 2
                }
            });

            // Markers
            markersRef.current = [];
            HUBS.forEach((hub) => {
                const el = document.createElement('div');
                el.className = 'hub-marker';
                const pinBg = isDark ? '#171717' : '#ffffff';
                const pinBorder = isDark ? '#404040' : '#ffffff';
                const shadow = isDark ? '0 0 20px rgba(255,255,255,0.1)' : '0 4px 12px rgba(0,0,0,0.3)';

                el.innerHTML = `
                    <div style="width: 48px; height: 48px; background: ${pinBg}; border-radius: 50%; box-shadow: ${shadow}; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid ${pinBorder}; transition: transform 0.2s;">
                        <img src="/Logo.png" style="width: 100%; height: 100%; object-fit: contain;" alt="Pin" />
                    </div>`;

                el.onmouseenter = () => { el.style.transform = 'scale(1.2)'; };
                el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
                el.onclick = (e) => {
                    e.stopPropagation();
                    m.flyTo({ center: [hub.lng, hub.lat], zoom: 16, pitch: 50 });
                };

                markersRef.current.push(new maplibregl.Marker({ element: el }).setLngLat([hub.lng, hub.lat]).addTo(m));
            });

            // Zoom Logic
            const handleZoom = () => {
                const isClose = m.getZoom() > ZOOM_THRESHOLD;
                onZoomChange(isClose);
                markersRef.current.forEach(mk => mk.getElement().style.display = isClose ? 'none' : 'block');
                m.easeTo({ pitch: isClose ? 55 : 0 });
            };
            m.on('zoom', handleZoom);
            m.on('zoomend', handleZoom);
            handleZoom();

            // Interactions
            m.on('click', 'detailed-blocks', (e) => {
                if (!e.features?.[0]) return;
                const f = e.features[0];
                onItemSelected({ ...f.properties, lat: e.lngLat.lat, lng: e.lngLat.lng });
                m.flyTo({ center: e.lngLat, zoom: 17.5, pitch: 60 });
            });

            m.on('mouseenter', 'detailed-blocks', () => m.getCanvas().style.cursor = 'pointer');
            m.on('mouseleave', 'detailed-blocks', () => m.getCanvas().style.cursor = '');
        });

        return () => {
            markersRef.current.forEach(m => m.remove());
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [resolvedTheme]);

    // 2. LAYER FILTERING
    useEffect(() => {
        if (!map.current || !map.current.getLayer('detailed-blocks')) return;
        const filter: any = ['any', ...activeLayers.map(layer => ['==', 'type', layer])];
        map.current.setFilter('detailed-blocks', filter);
        map.current.setFilter('detailed-emojis', filter);
    }, [activeLayers]);

    // 3. EXPOSED CONTROLS
    const zoomIn = () => map.current?.zoomIn();
    const zoomOut = () => map.current?.zoomOut();
    const reset = () => map.current?.flyTo({ center: [77.2167, 28.6315], zoom: 11, pitch: 0 });

    return { zoomIn, zoomOut, reset };
}