"use client"

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/store/useStore';
import { Effects } from './Effects';

export function MapCanvas() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
    const { currentView, selectedMaterialRoof } = useStore();

    useEffect(() => {
        if (mapInstance || !mapContainer.current) return;

        // 1. BASE MAP: Carto Dark Matter (Fastest loading map available)
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [currentView.longitude, currentView.latitude],
            zoom: currentView.zoom,
            pitch: currentView.pitch,
            bearing: currentView.bearing,
        });

        map.on('load', () => {
            // 2. DATA: Hardcoded Critical Zones in Delhi (Instant Load)
            const delhiZones = {
                type: 'FeatureCollection',
                features: [
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2177, 28.6304] }, properties: { temp: 45, name: "Connaught Place" } }, // CP
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2820, 28.5272] }, properties: { temp: 48, name: "Okhla Ind. Area" } }, // Okhla
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.0575, 28.5524] }, properties: { temp: 41, name: "Dwarka Sec 21" } }, // Dwarka
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.1926, 28.5450] }, properties: { temp: 40, name: "IIT Delhi" } }, // IIT
                    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2410, 28.5921] }, properties: { temp: 43, name: "Defence Colony" } }, // Def Col
                ]
            };

            map.addSource('thermal-zones', {
                type: 'geojson',
                data: delhiZones as any
            });

            // 3. LAYER: Glowing Heat Circles (The "Sensors")
            map.addLayer({
                id: 'thermal-glow',
                type: 'circle',
                source: 'thermal-zones',
                paint: {
                    'circle-radius': 40, // Large glow
                    'circle-color': '#ef4444', // Red default
                    'circle-blur': 0.8, // Soft edges
                    'circle-opacity': 0.6
                }
            });

            map.addLayer({
                id: 'thermal-core',
                type: 'circle',
                source: 'thermal-zones',
                paint: {
                    'circle-radius': 12, // Solid core
                    'circle-color': '#ef4444',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });

            // 4. LABELS: Show Zone Names
            map.addLayer({
                id: 'thermal-labels',
                type: 'symbol',
                source: 'thermal-zones',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 1.5,
                    'text-justify': 'auto',
                    'text-size': 14
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });

            setMapInstance(map);
        });

        return () => map.remove();
    }, []);

    // "Cooling" Effect Logic (Color Shift)
    useEffect(() => {
        if (!mapInstance || !mapInstance.getLayer('thermal-glow')) return;

        const isCool = selectedMaterialRoof.albedo > 0.5;
        const color = isCool ? '#10b981' : '#ef4444'; // Green if Cool, Red if Hot

        mapInstance.setPaintProperty('thermal-glow', 'circle-color', color);
        mapInstance.setPaintProperty('thermal-core', 'circle-color', color);

    }, [selectedMaterialRoof, mapInstance]);

    // Cinematic Swoop
    useEffect(() => {
        if (!mapInstance) return;
        mapInstance.flyTo({
            center: [currentView.longitude, currentView.latitude],
            zoom: currentView.zoom,
            pitch: currentView.pitch,
            bearing: currentView.bearing,
            essential: true,
            speed: 1.5,
        });
    }, [currentView, mapInstance]);

    return (
        <div className="absolute inset-0 w-full h-full">
            <div ref={mapContainer} className="w-full h-full" />
            {mapInstance && <Effects mapInstance={mapInstance} />}
        </div>
    );
}