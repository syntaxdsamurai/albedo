"use client"

import { MapboxOverlay } from '@deck.gl/mapbox';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import { useStore } from '@/store/useStore';
import { useTheme } from 'next-themes';
import { useEffect, useMemo } from 'react';
import * as h3 from 'h3-js';

function generateDelhiHexagons() {
    const centerLat = 28.6304;
    const centerLng = 77.2177;
    // FIX: Increased resolution from 9 to 10 (Smaller hexes = More detail)
    const disk = h3.gridDisk(h3.latLngToCell(centerLat, centerLng, 10), 25);

    return disk.map((hexId) => {
        const dist = h3.gridDistance(hexId, disk[0]);
        // Logic: Center is hot, edges are cool
        const temp = 48 - (dist * 0.8) + (Math.random() * 1.5);
        return { hex: hexId, temp };
    });
}

const DELHI_DATA = generateDelhiHexagons();

interface DeckOverlayProps {
    mapInstance: any;
}

export function DeckOverlay({ mapInstance }: DeckOverlayProps) {
    const { selectedMaterialRoof } = useStore();

    // Cooling logic: If white roof selected, drop temp visually
    const coolingFactor = selectedMaterialRoof.albedo > 0.5 ? 5 : 0;

    const overlay = useMemo(() => {
        return new MapboxOverlay({
            interleaved: true,
            layers: [
                new H3HexagonLayer({
                    id: 'heat-layer',
                    data: DELHI_DATA,
                    pickable: true,
                    wireframe: false,
                    filled: true,
                    extruded: true, // Keep 3D but subtle

                    // FIX: Smaller radius for finer detail
                    elevationScale: 2, // Was 20 (Way too high). Now 2 (Subtle).
                    coverage: 0.9, // Slight gap between hexes for "Tech" look

                    getHexagon: (d: any) => d.hex,

                    getFillColor: (d: any) => {
                        const visualTemp = d.temp - coolingFactor;
                        // Thermal Gradient: Yellow -> Orange -> Red (No Greens/Blues to keep it serious)
                        if (visualTemp < 38) return [253, 186, 116, 100]; // Orange-300 (Low Opacity)
                        if (visualTemp < 42) return [251, 146, 60, 140]; // Orange-400
                        if (visualTemp < 45) return [234, 88, 12, 180]; // Orange-600
                        return [220, 38, 38, 200]; // Red-600
                    },

                    getElevation: (d: any) => (d.temp - 30) * 1.5,

                    autoHighlight: true,
                    highlightColor: [255, 255, 255, 80],

                    updateTriggers: {
                        getFillColor: [coolingFactor],
                    }
                })
            ]
        });
    }, [coolingFactor]);

    useEffect(() => {
        if (!mapInstance) return;
        mapInstance.addControl(overlay);
        return () => {
            mapInstance.removeControl(overlay);
        };
    }, [mapInstance, overlay]);

    return null;
}