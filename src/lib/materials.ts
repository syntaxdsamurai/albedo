export type MaterialCategory = 'roof' | 'ground';

export interface Material {
    id: string;
    name: string;
    category: MaterialCategory;
    albedo: number; // 0 to 1 (Reflectivity)
    costPerSqFt: number; // In INR
    co2Offset: number; // kg per year per sqft
    color: string; // UI Hex color
    description: string;
}

export const MATERIALS: Material[] = [
    // --- ROOF OPTIONS ---
    {
        id: 'roof-concrete',
        name: 'Standard Concrete',
        category: 'roof',
        albedo: 0.15, // Absorbs heat
        costPerSqFt: 0,
        co2Offset: 0,
        color: '#94a3b8', // Slate-400
        description: 'Existing dark concrete surface. High heat retention.'
    },
    {
        id: 'roof-cool-paint',
        name: 'Cool Roof Paint',
        category: 'roof',
        albedo: 0.80, // Reflects 80% sunlight
        costPerSqFt: 25,
        co2Offset: 12,
        color: '#f8fafc', // Slate-50
        description: 'High-SRI reflective white coating. Immediate temp drop.'
    },
    {
        id: 'roof-green',
        name: 'Vegetative Roof',
        category: 'roof',
        albedo: 0.60,
        costPerSqFt: 150,
        co2Offset: 25,
        color: '#4ade80', // Green-400
        description: 'Soil and plants. Provides insulation and oxygen.'
    },
    {
        id: 'roof-solar',
        name: 'Solar Tiled',
        category: 'roof',
        albedo: 0.30,
        costPerSqFt: 450,
        co2Offset: 45, // Massive offset due to energy generation
        color: '#3b82f6', // Blue-500
        description: 'Photovoltaic integration. Generates revenue.'
    },

    // --- GROUND OPTIONS ---
    {
        id: 'ground-asphalt',
        name: 'Dark Asphalt',
        category: 'ground',
        albedo: 0.05, // Basically a black hole for heat
        costPerSqFt: 0,
        co2Offset: 0,
        color: '#1e293b', // Slate-800
        description: 'Standard road tar. Major Urban Heat Island contributor.'
    },
    {
        id: 'ground-pavers',
        name: 'Permeable Pavers',
        category: 'ground',
        albedo: 0.45,
        costPerSqFt: 85,
        co2Offset: 5,
        color: '#fdba74', // Orange-300
        description: 'Allows groundwater recharge and reduces surface heat.'
    }
];

export const DEFAULT_ROOF = MATERIALS[0];
export const DEFAULT_GROUND = MATERIALS[4];