"use client"

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

interface EffectsProps {
    mapInstance: any; // Using 'any' to bypass strict MapLibre/Mapbox type conflicts
}

export function Effects({ mapInstance }: EffectsProps) {
    const requestRef = useRef<number>(0);
    const { currentView } = useStore();

    // "Orbit Mode": Slowly rotate the camera if the user hasn't interacted recently
    useEffect(() => {
        if (!mapInstance) return;

        let rotation = currentView.bearing;
        let isRotating = true;

        const animate = () => {
            // Only rotate if we are zoomed in enough (simulating inspection) and pitched (3D view)
            if (isRotating && mapInstance.getPitch() > 30 && mapInstance.getZoom() > 13) {
                rotation = (rotation + 0.03) % 360; // 0.03 speed = Cinematic slow orbit
                mapInstance.rotateTo(rotation, { duration: 0 });
                requestRef.current = requestAnimationFrame(animate);
            } else {
                // If conditions aren't met, keep checking but don't rotate
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        // Start the animation loop
        requestRef.current = requestAnimationFrame(animate);

        // Stop rotation when user interacts to prevent fighting the user
        const stopRotation = () => { isRotating = false; };
        const startRotation = () => { isRotating = true; };

        // Listeners
        mapInstance.on('mousedown', stopRotation);
        mapInstance.on('touchstart', stopRotation);
        mapInstance.on('dragstart', stopRotation);

        // Optional: Restart rotation after idle (advanced, skipping for now to keep simple)

        return () => {
            cancelAnimationFrame(requestRef.current);
            mapInstance.off('mousedown', stopRotation);
            mapInstance.off('touchstart', stopRotation);
            mapInstance.off('dragstart', stopRotation);
        };
    }, [mapInstance, currentView]);

    return null; // Logic only, no UI
}