import { create } from 'zustand';
import { Material, MATERIALS, DEFAULT_ROOF, DEFAULT_GROUND } from '@/lib/materials';

export interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}

export const HOTSPOTS: Record<string, ViewState> = {
    'delhi-overview': { latitude: 28.6139, longitude: 77.2090, zoom: 11, pitch: 0, bearing: 0 },
    'connaught-place': { latitude: 28.6304, longitude: 77.2177, zoom: 15, pitch: 60, bearing: -20 },
    'okhla-industrial': { latitude: 28.5272, longitude: 77.2820, zoom: 14.5, pitch: 55, bearing: 45 },
    'dwarka-sector-21': { latitude: 28.5524, longitude: 77.0575, zoom: 15, pitch: 50, bearing: 10 },
    'iit-delhi': { latitude: 28.5450, longitude: 77.1926, zoom: 16, pitch: 65, bearing: -15 },
};

interface AppState {
    // UI State
    isDarkMode: boolean;
    activeTab: 'map' | 'blueprint';

    // Camera State (New!)
    currentView: ViewState;

    // Selection State
    selectedMaterialRoof: Material;
    selectedMaterialGround: Material;

    // Simulation State
    targetArea: number;
    currentTemp: number;

    // Actions
    setRoofMaterial: (materialId: string) => void;
    setGroundMaterial: (materialId: string) => void;
    toggleTheme: () => void;
    setTargetArea: (area: number) => void;
    setTab: (tab: 'map' | 'blueprint') => void;
    flyTo: (location: keyof typeof HOTSPOTS) => void; // New Action
}

export const useStore = create<AppState>((set) => ({
    // Defaults
    isDarkMode: true,
    activeTab: 'map',
    currentView: HOTSPOTS['delhi-overview'], // Start Zoomed Out

    selectedMaterialRoof: DEFAULT_ROOF,
    selectedMaterialGround: DEFAULT_GROUND,

    targetArea: 1200,
    currentTemp: 42.5,

    setRoofMaterial: (id) => set((state) => ({
        selectedMaterialRoof: MATERIALS.find((m) => m.id === id) || state.selectedMaterialRoof
    })),

    setGroundMaterial: (id) => set((state) => ({
        selectedMaterialGround: MATERIALS.find((m) => m.id === id) || state.selectedMaterialGround
    })),

    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setTargetArea: (area) => set({ targetArea: area }),
    setTab: (tab) => set({ activeTab: tab }),

    // The "Swoop" Action
    flyTo: (locationKey) => set({ currentView: HOTSPOTS[locationKey] }),
}));