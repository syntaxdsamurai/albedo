import { useState, useMemo } from "react";
import { Sun, Trees, CarFront } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Configuration Data ---
export const CALCULATOR_DATA = {
    roof: {
        id: "roof",
        title: "Rooftop Strategy",
        icon: Sun,
        theme: "orange",
        options: [
            { id: "none", name: "Bare Concrete", price: 0, partner: "-", temp: "0°C", desc: "Standard Grey Slab. High heat absorption." },
            { id: "paint", name: "Reflective Paint", price: 65, partner: "Asian Paints", temp: "-5°C", desc: "High-Albedo Coating. Re-coat every 5 years." },
            { id: "tiles", name: "Cool Tiles", price: 120, partner: "Johnson Endura", temp: "-7°C", desc: "Ceramic Thermal Layer. Permanent solution." },
        ]
    },
    garden: {
        id: "garden",
        title: "Greenery Integration",
        icon: Trees,
        theme: "emerald",
        options: [
            { id: "none", name: "No Vegetation", price: 0, partner: "-", temp: "0°C", desc: "Standard Wall/Floor. No active cooling." },
            { id: "pots", name: "Potted Shrubs", price: 250, partner: "NurseryLive", temp: "-3°C", desc: "Portable Containers. Flexible placement." },
            { id: "hydro", name: "Bio-Wall", price: 800, partner: "Living Walls", temp: "-6°C", desc: "Active Vertical System. Aesthetics + Cooling." },
        ]
    },
    parking: {
        id: "parking",
        title: "Ground & Parking",
        icon: CarFront,
        theme: "blue",
        options: [
            { id: "none", name: "Asphalt Surface", price: 0, partner: "-", temp: "+4°C", desc: "Impermeable Heat Island. Causes runoff." },
            { id: "pavers", name: "Grass Pavers", price: 180, partner: "UltraTech", temp: "-8°C", desc: "Permeable Grid. Recharges groundwater." },
            { id: "canopy", name: "Solar Canopy", price: 1500, partner: "Tata Power", temp: "-10°C", desc: "Energy Generation. Maximum ROI." },
        ]
    }
};

export function useAlbedoCalculator() {
    // State
    const [areas, setAreas] = useState({ roof: 1000, garden: 200, parking: 400 });
    const [unit, setUnit] = useState<"ft" | "m">("ft");

    // Selections
    const [selections, setSelections] = useState({
        roof: CALCULATOR_DATA.roof.options[1],
        garden: CALCULATOR_DATA.garden.options[0],
        parking: CALCULATOR_DATA.parking.options[0],
    });

    // Helpers
    const getSqFt = (val: number) => unit === "ft" ? val : val * 10.764;
    const updateArea = (key: keyof typeof areas, val: number) => setAreas(prev => ({ ...prev, [key]: val }));
    const selectMaterial = (category: keyof typeof selections, option: any) => setSelections(prev => ({ ...prev, [category]: option }));

    // Derived Calculations
    const results = useMemo(() => {
        const roofAreaSqFt = getSqFt(areas.roof);
        const gardenAreaSqFt = getSqFt(areas.garden);
        const parkingAreaSqFt = getSqFt(areas.parking);

        const costRoof = selections.roof.id !== 'none' ? roofAreaSqFt * selections.roof.price : 0;
        const costGarden = selections.garden.id !== 'none' ? gardenAreaSqFt * selections.garden.price : 0;
        const costParking = selections.parking.id !== 'none' ? parkingAreaSqFt * selections.parking.price : 0;

        const subTotal = costRoof + costGarden + costParking;

        // Subsidies Logic
        let solarSubsidy = 0;
        if (selections.parking.id === 'canopy') {
            solarSubsidy = parkingAreaSqFt > 300 ? 78000 : (parkingAreaSqFt / 100) * 30000;
        }
        const greenSubsidy = (selections.roof.id !== 'none' ? costRoof * 0.1 : 0) + (selections.garden.id !== 'none' ? costGarden * 0.1 : 0);
        const totalSubsidy = solarSubsidy + greenSubsidy;
        const netTotal = Math.max(0, subTotal - totalSubsidy);

        // ROI Logic
        const yearlySavings =
            (selections.roof.id !== 'none' ? roofAreaSqFt * 12 : 0) +
            (selections.garden.id !== 'none' ? gardenAreaSqFt * 8 : 0) +
            (selections.parking.id === 'canopy' ? parkingAreaSqFt * 90 : selections.parking.id === 'pavers' ? parkingAreaSqFt * 5 : 0);

        const recoveryYears = yearlySavings > 0 ? netTotal / yearlySavings : 0;

        return {
            costRoof, costGarden, costParking, subTotal,
            totalSubsidy, netTotal, recoveryYears,
            yearlySavings
        };
    }, [areas, unit, selections]);

    // PDF Export
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22); doc.text("Albedo Estimate", 20, 20);
        doc.setFontSize(10); doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        const u = unit === "ft" ? "Sq.Ft" : "Sq.M";
        const tableData = [
            ["Section", "Area", "Material", "Partner", "Cost"],
            ["Rooftop", `${areas.roof} ${u}`, selections.roof.name, selections.roof.partner, `INR ${results.costRoof.toLocaleString()}`],
            ["Garden", `${areas.garden} ${u}`, selections.garden.name, selections.garden.partner, `INR ${results.costGarden.toLocaleString()}`],
            ["Parking", `${areas.parking} ${u}`, selections.parking.name, selections.parking.partner, `INR ${results.costParking.toLocaleString()}`],
        ];
        autoTable(doc, { startY: 40, head: [tableData[0]], body: tableData.slice(1) });
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Net Total: INR ${results.netTotal.toLocaleString()}`, 140, finalY + 10);
        doc.text(`Est. ROI: ${results.recoveryYears.toFixed(1)} Years`, 20, finalY + 10);
        doc.save("Albedo_Quote.pdf");
    };

    return {
        areas, unit, selections, results,
        setUnit, updateArea, selectMaterial, generatePDF
    };
}