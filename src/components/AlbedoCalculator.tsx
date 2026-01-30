"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Zap, Box, X, ArrowRightLeft, Leaf, LayoutDashboard } from "lucide-react";
import { useAlbedoCalculator, CALCULATOR_DATA } from "./useAlbedoCalculator";

// --- THE MAIN COMPONENT ---
export default function AlbedoCalculator() {
    const { areas, unit, selections, results, setUnit, updateArea, selectMaterial, generatePDF } = useAlbedoCalculator();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <section className="w-full min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 text-[#1a1a1a] dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <div className="max-w-[1400px] mx-auto px-4 py-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black/10 dark:border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 dark:text-white">Estimate.</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">Calculate your urban cooling potential. Select materials, define areas, and get an instant industrial-grade quote.</p>
                    </div>
                    <div className="flex gap-2 bg-white dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm mt-6 md:mt-0">
                        {(['ft', 'm'] as const).map((u) => (
                            <button key={u} onClick={() => setUnit(u)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${unit === u ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-400 hover:text-black dark:hover:text-white'}`}>
                                {u === 'ft' ? 'Sq.Ft' : 'Sq.M'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Inputs & Selections */}
                    <div className="xl:col-span-8 flex flex-col gap-12">

                        {/* Area Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(areas).map(([key, val]) => (
                                <div key={key} className="group relative bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-black/30 dark:hover:border-white/30 transition-colors">
                                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">{key} Area</label>
                                    <div className="flex items-baseline gap-2">
                                        <input
                                            type="number"
                                            value={val}
                                            onChange={(e) => updateArea(key as any, Number(e.target.value))}
                                            className="w-full text-4xl font-bold bg-transparent outline-none border-none p-0 focus:ring-0 placeholder-neutral-200 dark:text-white"
                                        />
                                        <span className="text-sm font-medium text-neutral-400">{unit === 'ft' ? 'ft²' : 'm²'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Material Sections */}
                        <div className="space-y-12">
                            {(Object.keys(CALCULATOR_DATA) as Array<keyof typeof CALCULATOR_DATA>).map((key) => {
                                const section = CALCULATOR_DATA[key];
                                const currentSelection = selections[key];
                                const Icon = section.icon;

                                return (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl bg-${section.theme}-100 dark:bg-${section.theme}-900/30 text-${section.theme}-600 dark:text-${section.theme}-400`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-bold capitalize dark:text-white">{section.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => setActiveModal(key)}
                                                className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:underline decoration-1 underline-offset-4 dark:text-neutral-400 dark:hover:text-white"
                                            >
                                                <Box className="w-4 h-4" /> Visualize 3D
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {section.options.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => selectMaterial(key, opt)}
                                                    className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 relative overflow-hidden ${
                                                        currentSelection.id === opt.id
                                                            ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800'
                                                            : 'border-transparent bg-white dark:bg-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-700'
                                                    }`}
                                                >
                                                    <div className="relative z-10">
                                                        <div className="font-bold text-lg mb-1 dark:text-white">{opt.name}</div>
                                                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{opt.partner}</div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-mono text-sm dark:text-neutral-300">₹{opt.price}/sq</div>
                                                            <div className={`text-xs font-bold px-2 py-1 rounded border ${currentSelection.id === opt.id ? 'bg-white border-neutral-200 text-black dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400'}`}>
                                                                {opt.temp}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Sticky Invoice */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-8">
                            <div className="bg-[#111] dark:bg-neutral-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10 dark:border-neutral-800">
                                {/* Background Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8 opacity-50">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Estimate Summary</span>
                                    </div>

                                    {/* Line Items */}
                                    <div className="space-y-6 mb-12">
                                        <InvoiceRow label="Rooftop" sub={selections.roof.name} cost={results.costRoof} />
                                        <InvoiceRow label="Garden" sub={selections.garden.name} cost={results.costGarden} />
                                        <InvoiceRow label="Parking" sub={selections.parking.name} cost={results.costParking} />
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-3 py-6 border-t border-white/10">
                                        <div className="flex justify-between text-sm text-neutral-400">
                                            <span>Subtotal</span>
                                            <span>₹{results.subTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-emerald-400">
                                            <span>Eco-Subsidies</span>
                                            <span>-₹{results.totalSubsidy.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-baseline mb-8">
                                        <span className="text-lg font-medium">Net Total</span>
                                        <span className="text-4xl font-bold font-mono tracking-tight">₹{results.netTotal.toLocaleString()}</span>
                                    </div>

                                    {/* ROI Card */}
                                    {results.recoveryYears > 0 && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Leaf className="w-4 h-4" /></div>
                                                <div>
                                                    <div className="text-xs text-neutral-400 uppercase font-bold">ROI Period</div>
                                                    <div className="text-sm font-bold">Break-even in</div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold font-mono">{results.recoveryYears.toFixed(1)} <span className="text-sm font-sans text-neutral-400">Years</span></div>
                                        </div>
                                    )}

                                    <button
                                        onClick={generatePDF}
                                        className="w-full bg-white text-black py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Download Official Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PORTAL FOR MODAL --- */}
            {mounted && createPortal(
                <AnimatePresence>
                    {activeModal && (
                        <VisualizerModal
                            type={activeModal}
                            close={() => setActiveModal(null)}
                            data={CALCULATOR_DATA[activeModal as keyof typeof CALCULATOR_DATA]}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}

// --- HELPER COMPONENT: Invoice Row ---
function InvoiceRow({ label, sub, cost }: { label: string, sub: string, cost: number }) {
    if (cost === 0) return null;
    return (
        <div className="flex justify-between items-start group">
            <div>
                <div className="font-bold text-base">{label}</div>
                <div className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">{sub}</div>
            </div>
            <div className="font-mono text-neutral-300">₹{cost.toLocaleString()}</div>
        </div>
    );
}

// --- COMPONENT: 3D Visualizer Modal (Dark Mode Ready) ---
function VisualizerModal({ type, close, data }: any) {
    const [activeViewId, setActiveViewId] = useState(data.options[1].id);
    const activeOption = data.options.find((o: any) => o.id === activeViewId) || data.options[0];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={close}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                // Added dark:bg-neutral-900
                className="w-full max-w-6xl h-[90dvh] md:h-[85vh] bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={close} className="absolute top-4 right-4 z-50 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition dark:text-white"><X className="w-5 h-5" /></button>

                {/* Left: 3D Canvas */}
                <div className="w-full md:w-3/5 h-[45%] md:h-full bg-[#F0F0F0] dark:bg-black relative flex items-center justify-center overflow-hidden md:border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                        <span className="bg-white dark:bg-neutral-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-neutral-200 dark:border-neutral-700 shadow-sm dark:text-white">3D Mode</span>
                        <span className="text-xs font-bold uppercase text-neutral-400">{data.title}</span>
                    </div>

                    <div className="perspective-container transform scale-75 md:scale-100">
                        <div className="scene-3d transition-all duration-700" style={{ transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
                            {type === 'parking' && <ParkingViz mode={activeViewId} />}
                            {type === 'garden' && <GardenViz mode={activeViewId} />}
                            {type === 'roof' && <RoofViz mode={activeViewId} />}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white dark:bg-neutral-800 p-1.5 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 w-max max-w-[90%] overflow-x-auto">
                        {data.options.map((opt: any) => (
                            <button
                                key={opt.id}
                                onClick={() => setActiveViewId(opt.id)}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold whitespace-nowrap transition-all ${activeViewId === opt.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
                    <div className="flex-grow">
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Specifications</div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">{activeOption.name}</h2>
                        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">{activeOption.desc}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase">Impact</div>
                                <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeOption.temp}</div>
                            </div>
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                                <div className="text-xs font-bold text-neutral-400 uppercase">Est. Cost</div>
                                <div className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">₹{activeOption.price}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 mt-auto">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-neutral-400">
                            <ArrowRightLeft className="w-4 h-4" /> Material Comparison
                        </div>
                        <div className="space-y-3">
                            {data.options.map((opt: any) => (
                                <div key={opt.id} className={`flex justify-between text-sm ${activeViewId === opt.id ? 'font-bold text-black dark:text-white' : 'text-neutral-400'}`}>
                                    <span>{opt.name}</span>
                                    <span>{opt.temp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- 3D RENDERERS (Unchanged, they just need to sit in the canvas) ---
function ParkingViz({ mode }: { mode: string }) {
    return (
        <div className={`w-48 h-48 md:w-64 md:h-64 relative transition-colors duration-500 rounded-3xl border-4 ${mode === 'none' ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-200 border-neutral-300'}`}>
            {(mode === 'pavers' || mode === 'canopy') && (
                <div className="absolute inset-2 bg-blue-100/50 border-2 border-blue-400/30 rounded-2xl" style={{ transform: 'translateZ(20px)' }} />
            )}
            {mode === 'canopy' && (
                <div className="absolute inset-0 bg-black/80 border-2 border-yellow-400/50 rounded-2xl flex items-center justify-center shadow-2xl" style={{ transform: 'translateZ(80px)' }}>
                    <Zap className="w-12 h-12 text-yellow-400" />
                </div>
            )}
        </div>
    );
}

function GardenViz({ mode }: { mode: string }) {
    return (
        <div className="w-48 h-48 md:w-64 md:h-64 relative bg-neutral-200 border-4 border-neutral-300 rounded-3xl">
            {mode === 'pots' && (
                <div className="absolute inset-0 flex flex-wrap gap-4 p-6 justify-center items-center" style={{ transform: 'translateZ(10px)' }}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 md:w-12 md:h-12 bg-emerald-500 rounded-full shadow-lg" />
                    ))}
                </div>
            )}
            {mode === 'hydro' && (
                <div className="absolute inset-0 bg-emerald-600/90 border-4 border-emerald-400 rounded-3xl flex items-center justify-center shadow-xl" style={{ transform: 'translateZ(40px)' }} />
            )}
        </div>
    );
}

function RoofViz({ mode }: { mode: string }) {
    return (
        <div className="w-48 h-48 md:w-64 md:h-64 relative bg-neutral-400 border-4 border-neutral-500 rounded-3xl">
            {(mode === 'paint' || mode === 'tiles') && (
                <div className={`absolute inset-0 rounded-3xl shadow-lg border-2 ${mode === 'paint' ? 'bg-white border-white' : 'bg-orange-50 border-orange-200'}`} style={{ transform: 'translateZ(20px)' }} />
            )}
        </div>
    );
}