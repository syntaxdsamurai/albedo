// src/store/useStore.ts
import { create } from 'zustand';
import { Material, MATERIALS, DEFAULT_ROOF, DEFAULT_GROUND } from '@/lib/materials';

interface AppState {
    // UI State
    isDarkMode: boolean;
    activeTab: 'map' | 'blueprint';

    // Selection State
    selectedMaterialRoof: Material;
    selectedMaterialGround: Material;

    // Simulation State
    targetArea: number; // in sq ft (Default dummy value)
    currentTemp: number; // in Celsius

    // Actions
    setRoofMaterial: (materialId: string) => void;
    setGroundMaterial: (materialId: string) => void;
    toggleTheme: () => void;
    setTargetArea: (area: number) => void;
}

export const useStore = create<AppState>((set) => ({
    // Defaults
    isDarkMode: true, // We start in "Orbital Night" mode
    activeTab: 'map',

    selectedMaterialRoof: DEFAULT_ROOF,
    selectedMaterialGround: DEFAULT_GROUND,

    targetArea: 1200, // Default roof size for demo
    currentTemp: 42.5, // Default Delhi summer temp

    // Actions
    setRoofMaterial: (id) => set((state) => ({
        selectedMaterialRoof: MATERIALS.find((m) => m.id === id) || state.selectedMaterialRoof
    })),

    setGroundMaterial: (id) => set((state) => ({
        selectedMaterialGround: MATERIALS.find((m) => m.id === id) || state.selectedMaterialGround
    })),

    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setTargetArea: (area) => set({ targetArea: area }),
}));