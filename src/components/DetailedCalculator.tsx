"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calculator, Sun, Trees, CarFront, Download, X, Zap, Box, ArrowRightLeft } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Data Configuration ---
const DATA = {
    roof: {
        title: "Rooftop Strategy",
        icon: <Sun className="w-6 h-6 text-orange-500"/>,
        options: [
            { id: "none", name: "Bare Concrete", price: 0, partner: "-", temp: "0°C", desc: "Standard Grey Slab. High heat absorption." },
            { id: "paint", name: "Reflective Paint", price: 65, partner: "Asian Paints", temp: "-5°C", desc: "High-Albedo Coating. Re-coat every 5 years." },
            { id: "tiles", name: "Cool Tiles", price: 120, partner: "Johnson Endura", temp: "-7°C", desc: "Ceramic Thermal Layer. Permanent solution." },
        ]
    },
    garden: {
        title: "Greenery Integration",
        icon: <Trees className="w-6 h-6 text-emerald-500"/>,
        options: [
            { id: "none", name: "No Vegetation", price: 0, partner: "-", temp: "0°C", desc: "Standard Wall/Floor. No active cooling." },
            { id: "pots", name: "Potted Shrubs", price: 250, partner: "NurseryLive", temp: "-3°C", desc: "Portable Containers. Flexible placement." },
            { id: "hydro", name: "Bio-Wall", price: 800, partner: "Living Walls", temp: "-6°C", desc: "Active Vertical System. Aesthetics + Cooling." },
        ]
    },
    parking: {
        title: "Ground & Parking",
        icon: <CarFront className="w-6 h-6 text-blue-500"/>,
        options: [
            { id: "none", name: "Asphalt Surface", price: 0, partner: "-", temp: "+4°C", desc: "Impermeable Heat Island. Causes runoff." },
            { id: "pavers", name: "Grass Pavers", price: 180, partner: "UltraTech", temp: "-8°C", desc: "Permeable Grid. Recharges groundwater." },
            { id: "canopy", name: "Solar Canopy", price: 1500, partner: "Tata Power", temp: "-10°C", desc: "Energy Generation. Maximum ROI." },
        ]
    }
};

// Static color maps to avoid Tailwind purging issues
const THEMES = {
    roof: {
        bg: "bg-orange-50", border: "border-orange-200", borderActive: "border-orange-500",
        text: "text-orange-600", ring: "ring-orange-500", dot: "bg-orange-500",
        btnActive: "bg-orange-100 text-orange-900 ring-2 ring-orange-500" // Fixed visibility
    },
    garden: {
        bg: "bg-emerald-50", border: "border-emerald-200", borderActive: "border-emerald-500",
        text: "text-emerald-600", ring: "ring-emerald-500", dot: "bg-emerald-500",
        btnActive: "bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500" // Fixed visibility
    },
    parking: {
        bg: "bg-blue-50", border: "border-blue-200", borderActive: "border-blue-500",
        text: "text-blue-600", ring: "ring-blue-500", dot: "bg-blue-500",
        btnActive: "bg-blue-100 text-blue-900 ring-2 ring-blue-500" // Fixed visibility
    },
};

export default function DetailedCalculator() {
    // State
    const [areas, setAreas] = useState({ roof: 1000, garden: 200, parking: 400 });
    const [unit, setUnit] = useState<"ft" | "m">("ft");
    const [activeModal, setActiveModal] = useState<"roof" | "garden" | "parking" | null>(null);

    // Selections
    const [roofChoice, setRoofChoice] = useState(DATA.roof.options[1]);
    const [gardenChoice, setGardenChoice] = useState(DATA.garden.options[0]);
    const [parkingChoice, setParkingChoice] = useState(DATA.parking.options[0]);

    // Calculations
    const getSqFt = (val: number) => unit === "ft" ? val : val * 10.764;
    const roofArea = getSqFt(areas.roof);
    const gardenArea = getSqFt(areas.garden);
    const parkingArea = getSqFt(areas.parking);

    const costRoof = roofChoice.id !== 'none' ? roofArea * roofChoice.price : 0;
    const costGarden = gardenChoice.id !== 'none' ? gardenArea * gardenChoice.price : 0;
    const costParking = parkingChoice.id !== 'none' ? parkingArea * parkingChoice.price : 0;
    const subTotal = costRoof + costGarden + costParking;

    // Subsidies
    let solarSubsidy = 0;
    if (parkingChoice.id === 'canopy') {
        solarSubsidy = parkingArea > 300 ? 78000 : (parkingArea / 100) * 30000;
    }
    const greenSubsidy = (roofChoice.id !== 'none' ? costRoof * 0.1 : 0) + (gardenChoice.id !== 'none' ? costGarden * 0.1 : 0);
    const totalSubsidy = solarSubsidy + greenSubsidy;
    const netTotal = Math.max(0, subTotal - totalSubsidy);

    // ROI Logic
    const yearlySavings =
        (roofChoice.id !== 'none' ? roofArea * 12 : 0) +
        (gardenChoice.id !== 'none' ? gardenArea * 8 : 0) +
        (parkingChoice.id === 'canopy' ? parkingArea * 90 : parkingChoice.id === 'pavers' ? parkingArea * 5 : 0);

    const recoveryYears = yearlySavings > 0 ? netTotal / yearlySavings : 0;

    // PDF Export
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22); doc.text("Albedo Estimate", 20, 20);
        doc.setFontSize(10); doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        const u = unit === "ft" ? "Sq.Ft" : "Sq.M";
        const tableData = [
            ["Section", "Area", "Material", "Partner", "Cost"],
            ["Rooftop", `${areas.roof} ${u}`, roofChoice.name, roofChoice.partner, `INR ${costRoof.toLocaleString()}`],
            ["Garden", `${areas.garden} ${u}`, gardenChoice.name, gardenChoice.partner, `INR ${costGarden.toLocaleString()}`],
            ["Parking", `${areas.parking} ${u}`, parkingChoice.name, parkingChoice.partner, `INR ${costParking.toLocaleString()}`],
        ];
        autoTable(doc, { startY: 40, head: [tableData[0]], body: tableData.slice(1) });
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Net Total: INR ${netTotal.toLocaleString()}`, 140, finalY + 10);
        doc.text(`Est. ROI: ${recoveryYears.toFixed(1)} Years`, 20, finalY + 10);
        doc.save("Albedo_Quote.pdf");
    };

    return (
        <section className="w-full py-12 px-4 bg-[#F8FAFC]">

            {/* --- POP-UP MODAL --- */}
            <AnimatePresence>
                {activeModal && (
                    <VisualizerModal
                        type={activeModal}
                        close={() => setActiveModal(null)}
                        data={DATA[activeModal]}
                        theme={THEMES[activeModal]}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-neutral-200 flex flex-col xl:flex-row min-h-[750px] overflow-hidden">

                {/* LEFT: Inputs */}
                <div className="flex-1 p-6 md:p-10 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold flex items-center gap-3"><Calculator className="w-8 h-8"/> Estimate</h2>
                        <div className="flex bg-neutral-100 rounded-lg p-1">
                            <button onClick={() => setUnit("ft")} className={`px-3 py-1.5 rounded text-xs font-bold ${unit === "ft" ? "bg-white shadow text-black" : "text-neutral-500"}`}>Ft²</button>
                            <button onClick={() => setUnit("m")} className={`px-3 py-1.5 rounded text-xs font-bold ${unit === "m" ? "bg-white shadow text-black" : "text-neutral-500"}`}>M²</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <AreaInput label="Rooftop" unit={unit} value={areas.roof} onChange={(v:number) => setAreas(p => ({...p, roof: v}))} />
                        <AreaInput label="Garden" unit={unit} value={areas.garden} onChange={(v:number) => setAreas(p => ({...p, garden: v}))} />
                        <AreaInput label="Parking" unit={unit} value={areas.parking} onChange={(v:number) => setAreas(p => ({...p, parking: v}))} />
                    </div>

                    <div className="space-y-6 flex-grow">
                        <Section type="roof" data={DATA.roof} selected={roofChoice} onSelect={setRoofChoice} theme={THEMES.roof} onViz={() => setActiveModal("roof")} />
                        <Section type="garden" data={DATA.garden} selected={gardenChoice} onSelect={setGardenChoice} theme={THEMES.garden} onViz={() => setActiveModal("garden")} />
                        <Section type="parking" data={DATA.parking} selected={parkingChoice} onSelect={setParkingChoice} theme={THEMES.parking} onViz={() => setActiveModal("parking")} />
                    </div>
                </div>

                {/* RIGHT: Invoice */}
                <div className="w-full xl:w-[420px] bg-[#111] text-white p-8 md:p-10 flex flex-col relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Quote Summary</h3>
                    <div className="space-y-5 flex-grow">
                        {roofChoice.id !== 'none' && <BillRow label="Rooftop" area={areas.roof} cost={costRoof} unit={unit} sub={roofChoice.name} />}
                        {gardenChoice.id !== 'none' && <BillRow label="Garden" area={areas.garden} cost={costGarden} unit={unit} sub={gardenChoice.name} />}
                        {parkingChoice.id !== 'none' && <BillRow label="Parking" area={areas.parking} cost={costParking} unit={unit} sub={parkingChoice.name} />}
                        {subTotal === 0 && <div className="text-neutral-600 text-center text-sm italic py-10">Configure materials to see cost...</div>}
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="flex justify-between text-neutral-400 mb-2 text-sm"><span>Subtotal</span><span>₹{subTotal.toLocaleString()}</span></div>
                        {totalSubsidy > 0 && <div className="flex justify-between text-emerald-400 text-sm mb-4"><span>Subsidies</span><span>-₹{totalSubsidy.toLocaleString()}</span></div>}
                        <div className="flex justify-between items-end mb-2"><span className="text-xl font-bold">Total</span><span className="text-3xl font-bold font-mono">₹{netTotal.toLocaleString()}</span></div>

                        {/* ROI RESTORED */}
                        {recoveryYears > 0 && (
                            <div className="bg-white/10 rounded-lg p-3 mb-6 flex justify-between items-center border border-white/5">
                                <span className="text-xs font-bold text-neutral-400 uppercase">Break-even</span>
                                <span className="text-sm font-bold text-white">{recoveryYears.toFixed(1)} Years</span>
                            </div>
                        )}

                        <button onClick={generatePDF} className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-neutral-200 transition flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Download Quote</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- VISUALIZER MODAL COMPONENT ---
function VisualizerModal({ type, close, data, theme }: any) {
    // Internal state to switch between materials INSIDE the modal
    const [activeViewId, setActiveViewId] = useState(data.options[1].id);
    const activeOption = data.options.find((o:any) => o.id === activeViewId) || data.options[0];

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
            >
                {/* CLOSE BUTTON FIXED */}
                <button onClick={close} className="absolute top-4 right-4 z-[60] p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition shadow-sm border border-neutral-200">
                    <X className="w-6 h-6 text-neutral-600"/>
                </button>

                {/* LEFT: 3D Canvas */}
                <div className="w-full md:w-3/5 bg-neutral-50 relative flex flex-col border-r border-neutral-200">

                    {/* Header Badge */}
                    <div className="absolute top-6 left-6 z-10">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-neutral-200 shadow-sm ${theme.text}`}>
                {data.icon} {data.title}
                </span>
                    </div>

                    {/* 3D SCENE AREA */}
                    <div className="flex-grow flex items-center justify-center perspective-container overflow-hidden">
                        <div className="relative w-72 h-72 md:w-96 md:h-96 transition-all duration-500" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
                            {type === 'parking' && <ParkingViz mode={activeViewId} />}
                            {type === 'garden' && <GardenViz mode={activeViewId} />}
                            {type === 'roof' && <RoofViz mode={activeViewId} />}
                        </div>
                    </div>

                    {/* Toggles Bar */}
                    <div className="w-full p-6 bg-white border-t border-neutral-200 z-20">
                        <div className="flex justify-center gap-2">
                            {data.options.map((opt: any) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setActiveViewId(opt.id)}
                                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeViewId === opt.id ? `${theme.btnActive} border-transparent` : "bg-neutral-50 text-neutral-500 border-transparent hover:bg-neutral-100"}`}
                                >
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details & Comparison */}
                <div className="w-full md:w-2/5 flex flex-col h-full bg-white">
                    <div className="p-8 flex-grow overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-2 text-neutral-900">{activeOption.name}</h2>
                        <p className="text-neutral-500 mb-6">{activeOption.desc}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className={`p-4 rounded-xl border ${theme.border} ${theme.bg}`}>
                                <div className="text-xs font-bold text-neutral-500 uppercase">Temp Impact</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{activeOption.temp}</div>
                            </div>
                            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                                <div className="text-xs font-bold text-neutral-500 uppercase">Base Cost</div>
                                <div className="text-2xl font-bold text-neutral-900">₹{activeOption.price}</div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ArrowRightLeft className="w-4 h-4" /> Comparison Table
                        </h3>
                        <div className="border rounded-xl overflow-hidden border-neutral-200">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                                <tr>
                                    <th className="p-3">Option</th>
                                    <th className="p-3">Temp</th>
                                    <th className="p-3">Cost</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                {data.options.map((opt: any) => (
                                    <tr key={opt.id} className={activeViewId === opt.id ? `${theme.bg}` : "bg-white"}>
                                        <td className="p-3 font-medium text-neutral-900">{opt.name}</td>
                                        <td className={`p-3 font-bold ${activeViewId === opt.id ? theme.text : "text-neutral-900"}`}>{opt.temp}</td>
                                        <td className="p-3 text-neutral-500 font-mono">₹{opt.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// --- 3D RENDERERS ---
function ParkingViz({ mode }: { mode: string }) {
    return (
        <>
            <div className={`absolute inset-0 border-4 flex items-center justify-center transition-colors duration-500 ${mode === 'none' ? 'bg-neutral-800 border-neutral-600' : 'bg-neutral-200 border-neutral-300'}`} style={{ borderRadius: '1rem' }}>
                <span className={`text-xs font-bold -rotate-90 ${mode==='none'?'text-neutral-600':'text-neutral-400'}`}>BASE</span>
            </div>
            {(mode === 'pavers' || mode === 'canopy') && (
                <div className="absolute inset-0 bg-blue-50 border-4 border-blue-400 flex items-center justify-center shadow-lg" style={{ transform: 'translateZ(20px)', borderRadius: '1rem' }}>
                    <div className="text-[10px] font-bold text-blue-500 -rotate-90 bg-white px-1 rounded">PERMEABLE</div>
                </div>
            )}
            {mode === 'canopy' && (
                <div className="absolute inset-0 bg-black/90 border-4 border-yellow-400 flex items-center justify-center shadow-2xl" style={{ transform: 'translateZ(120px)', borderRadius: '1rem' }}>
                    <Zap className="w-16 h-16 text-yellow-400 -rotate-45" />
                </div>
            )}
        </>
    )
}

function GardenViz({ mode }: { mode: string }) {
    return (
        <>
            <div className="absolute inset-0 bg-neutral-200 border-4 border-neutral-300 flex items-center justify-center" style={{ borderRadius: '1rem' }}></div>
            {mode === 'pots' && (
                <div className="absolute inset-0 flex flex-wrap gap-2 p-4 justify-center items-center" style={{ transform: 'translateZ(10px)' }}>
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 bg-emerald-500 rounded-full shadow-lg"></div>)}
                </div>
            )}
            {mode === 'hydro' && (
                <div className="absolute inset-0 bg-emerald-600 border-4 border-emerald-400 flex items-center justify-center shadow-xl" style={{ transform: 'translateZ(40px)', borderRadius: '1rem' }}>
                    <Trees className="w-24 h-24 text-emerald-200 -rotate-45" />
                </div>
            )}
        </>
    )
}

function RoofViz({ mode }: { mode: string }) {
    return (
        <>
            <div className="absolute inset-0 bg-neutral-400 border-4 border-neutral-500 flex items-center justify-center" style={{ borderRadius: '1rem' }}>
                <span className="text-[10px] font-bold text-neutral-600 -rotate-90">SLAB</span>
            </div>
            {(mode === 'paint' || mode === 'tiles') && (
                <div className={`absolute inset-0 flex items-center justify-center border-4 shadow-lg ${mode === 'paint' ? 'bg-white border-orange-200' : 'bg-orange-50 border-orange-500'}`} style={{ transform: mode==='paint'?'translateZ(10px)':'translateZ(30px)', borderRadius: '1rem' }}>
                    {mode === 'paint' && <span className="text-[10px] text-orange-400 font-bold -rotate-90">COATING</span>}
                    {mode === 'tiles' && <span className="text-[10px] text-orange-600 font-bold -rotate-90">TILES</span>}
                </div>
            )}
            {mode !== 'none' && (
                <div className="absolute -top-10 -right-10 w-12 h-12 bg-yellow-400 rounded-full blur-xl opacity-50" style={{ transform: 'translateZ(100px)' }}></div>
            )}
        </>
    )
}

// --- HELPER COMPONENTS ---
function Section({ type, data, selected, onSelect, theme, onViz }: any) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${theme.bg} ${theme.text}`}>{data.icon}</div>
                    <h3 className="font-bold text-neutral-900">{data.title}</h3>
                </div>
                <button onClick={onViz} className={`text-xs font-bold flex items-center gap-1 ${theme.text} ${theme.bg} px-3 py-1.5 rounded-full hover:brightness-95 transition`}>
                    <Box className="w-3 h-3"/> Visualize
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.options.map((opt:any) => (
                    <button key={opt.id} onClick={() => onSelect(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${selected.id === opt.id ? `${theme.bg} ${theme.borderActive}` : "bg-white border-neutral-100"}`}>
                        <div className="font-bold text-sm text-neutral-900">{opt.name}</div>
                        {opt.price > 0 && <div className="text-xs text-neutral-500 font-mono mt-1">₹{opt.price}</div>}
                    </button>
                ))}
            </div>
        </div>
    )
}

function AreaInput({ label, unit, value, onChange }: any) {
    return (
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 focus-within:ring-2 ring-blue-100">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
            <div className="flex items-baseline gap-1 mt-1">
                <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full bg-transparent text-xl font-bold font-mono outline-none text-neutral-900"/>
                <span className="text-xs font-bold text-neutral-500">{unit==='ft'?'ft²':'m²'}</span>
            </div>
        </div>
    )
}

function BillRow({ label, area, cost, unit, sub }: any) {
    return (
        <div className="flex justify-between items-start border-b border-white/10 pb-3">
            <div><div className="font-bold text-sm text-white">{label}</div><div className="text-[10px] text-neutral-400">{sub}</div><div className="text-[10px] text-blue-400">{area} {unit==='ft'?'ft²':'m²'}</div></div>
            <div className="font-mono font-medium text-neutral-200">₹{cost.toLocaleString()}</div>
        </div>
    )
}