import { Material, DEFAULT_ROOF, DEFAULT_GROUND } from './materials';

interface SimulationResult {
    newTemp: number; // Celsius
    tempDrop: number; // Celsius
    energySavings: number; // kWh per year
    moneySaved: number; // INR per year
    roiYears: number; // Years to break even
    totalCost: number; // INR
    co2Abated: number; // kg per year
}

// Constants for Delhi Context
const BASE_TEMP = 42.5; // Average Summer Peak LST
const SOLAR_IRRADIANCE = 5.5; // kWh/m2/day (Delhi Average)
const ENERGY_COST = 8.5; // INR per kWh (Commercial Rate)
const COOLING_EFFICIENCY = 3.5; // COP of average AC unit

export function calculateImpact(
    roofMaterial: Material,
    groundMaterial: Material,
    areaSqFt: number
): SimulationResult {

    // 1. Calculate Albedo Change
    const baseAlbedo = DEFAULT_ROOF.albedo + DEFAULT_GROUND.albedo;
    const newAlbedo = roofMaterial.albedo + groundMaterial.albedo;
    const albedoDelta = newAlbedo - baseAlbedo;

    // 2. Physics Proxy: Stefan-Boltzmann simplified for rapid UI
    // Higher albedo = Lower absorption = Lower surface temp
    // We assume a linear drop for the sake of the demo (approx 10C drop for max albedo shift)
    const tempDrop = albedoDelta * 12.5;
    const newTemp = BASE_TEMP - tempDrop;

    // 3. Energy Calculation (Cooling Load Reduction)
    // Q = U * A * dT (Simplified) -> We use direct Correlation
    // 1 Degree drop ~ 5% energy saving in cooling
    const energySavings = (areaSqFt * 0.5) * tempDrop; // Proxy formula

    // 4. Financials
    const moneySaved = Math.round(energySavings * ENERGY_COST);
    const totalCost = Math.round(
        (roofMaterial.costPerSqFt * areaSqFt) +
        (groundMaterial.costPerSqFt * (areaSqFt * 0.4)) // Assuming ground is 40% of roof area for demo
    );

    // 5. ROI
    const roiYears = moneySaved > 0 ? parseFloat((totalCost / moneySaved).toFixed(1)) : 0;

    // 6. Carbon
    const co2Abated = Math.round((roofMaterial.co2Offset * areaSqFt) + (groundMaterial.co2Offset * areaSqFt * 0.4));

    return {
        newTemp: parseFloat(newTemp.toFixed(1)),
        tempDrop: parseFloat(tempDrop.toFixed(1)),
        energySavings: Math.round(energySavings),
        moneySaved,
        roiYears,
        totalCost,
        co2Abated
    };
}