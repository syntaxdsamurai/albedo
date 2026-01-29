"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, Truck, HardHat, X, ChevronRight } from "lucide-react";

const MATERIALS = [
    {
        id: "roof",
        category: "01 / Rooftop",
        title: "High-Albedo Shield",
        partner: "Asian Paints",
        product: "SmartCare Damp Proof Ultra",
        desc: "A fiber-reinforced elastomeric liquid waterproofing membrane that reflects 92% of solar heat.",
        stats: ["10°C Surface Drop", "10 Yr Warranty", "Waterproof"],
        color: "bg-orange-500",
        timeline: [
            { day: "Day 1", title: "Thermal Audit", desc: "Drone scan to identify heat leaks.", icon: <CheckCircle2 className="w-4 h-4"/> },
            { day: "Day 2", title: "Pressure Wash", desc: "Cleaning surface for adhesion.", icon: <HardHat className="w-4 h-4"/> },
            { day: "Day 3", title: "Primer Coat", desc: "Applying SmartCare binding layer.", icon: <Truck className="w-4 h-4"/> },
            { day: "Day 5", title: "Reflective Coat", desc: "Double layer of Ultra White.", icon: <ArrowUpRight className="w-4 h-4"/> },
        ]
    },
    {
        id: "garden",
        category: "02 / Facade",
        title: "Bio-Active Wall",
        partner: "Living Walls India",
        product: "Hydroponic Vertical Module",
        desc: "Soilless system using nutrient-rich water to sustain native air-purifying plants on vertical surfaces.",
        stats: ["30% AQI Improvement", "Self-Watering", "Thermal Buffer"],
        color: "bg-emerald-500",
        timeline: [
            { day: "Day 1", title: "Structural Analysis", desc: "Load bearing test of walls.", icon: <CheckCircle2 className="w-4 h-4"/> },
            { day: "Day 3", title: "Frame Mount", desc: "Aluminum grid installation.", icon: <HardHat className="w-4 h-4"/> },
            { day: "Day 4", title: "Irrigation Line", desc: "Drip system connection.", icon: <Truck className="w-4 h-4"/> },
            { day: "Day 7", title: "Planting", desc: "Inserting 400+ saplings.", icon: <ArrowUpRight className="w-4 h-4"/> },
        ]
    },
    {
        id: "parking",
        category: "03 / Ground",
        title: "Permeable Grid",
        partner: "UltraTech Concrete",
        product: "Pervious Concrete System",
        desc: "Structural concrete with high porosity that allows water to pass through, recharging groundwater.",
        stats: ["Zero Runoff", "Anti-Skid", "Ground Recharge"],
        color: "bg-blue-600",
        timeline: [
            { day: "Day 1", title: "Excavation", desc: "Removing asphalt layer.", icon: <CheckCircle2 className="w-4 h-4"/> },
            { day: "Day 2", title: "Aggregate Base", desc: "Laying stone foundation.", icon: <HardHat className="w-4 h-4"/> },
            { day: "Day 4", title: "Pouring", desc: "UltraTech Pervious mix.", icon: <Truck className="w-4 h-4"/> },
            { day: "Day 5", title: "Curing", desc: "Plastic sheet covering.", icon: <ArrowUpRight className="w-4 h-4"/> },
        ]
    }
];

export default function MaterialShowcase() {
    const [selected, setSelected] = useState<typeof MATERIALS[0] | null>(null);

    return (
        <section className="py-32 px-4 bg-[#F4F4F5]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-neutral-300 pb-8">
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 leading-[0.9]">
                        The <br/> Hardware.
                    </h2>
                    <p className="text-neutral-500 max-w-sm text-right mt-8 md:mt-0 font-medium">
                        We don't rely on generic solutions. We deploy industrial-grade materials from India's top infrastructure partners.
                    </p>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-l border-neutral-300">
                    {MATERIALS.map((item) => (
                        <div
                            key={item.id}
                            className="group relative border-r border-b border-neutral-300 bg-[#F4F4F5] hover:bg-white transition-colors duration-500 min-h-[500px] flex flex-col justify-between p-8 cursor-pointer"
                            onClick={() => setSelected(item)}
                        >
                            {/* Top Section */}
                            <div>
                                <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">{item.category}</span>
                                <div className="mt-8 mb-4">
                                    <h3 className="text-4xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                                    <div className="inline-block px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-600">
                                        Partner: {item.partner}
                                    </div>
                                </div>
                                <p className="text-neutral-500 text-lg leading-relaxed border-l-2 border-neutral-200 pl-4 my-8 group-hover:border-black transition-colors">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Bottom Section */}
                            <div>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {item.stats.map((stat, i) => (
                                        <span key={i} className="text-xs font-bold border border-neutral-200 px-2 py-1 rounded text-neutral-500">
                            {stat}
                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-4 flex items-center justify-between border-t border-neutral-200 group-hover:border-black transition-colors">
                                    <span className="font-bold text-sm uppercase tracking-wider">View Deployment Plan</span>
                                    <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform`}>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- IMPLEMENTATION PLAN MODAL --- */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full md:w-[90%] max-w-5xl bg-white md:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* Modal Header */}
                            <div className="p-8 md:p-10 border-b border-neutral-100 flex justify-between items-start bg-neutral-50">
                                <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4 ${selected.color}`}>
                        {selected.partner} Process
                    </span>
                                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">{selected.title} Protocol</h2>
                                    <p className="text-neutral-500 mt-2">Standard Operating Procedure for {selected.product}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-3 hover:bg-neutral-200 rounded-full transition">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* The Timeline Visualization */}
                            <div className="p-8 md:p-12 overflow-x-auto">
                                <div className="flex flex-col md:flex-row gap-8 relative">
                                    {/* Connecting Line (Desktop) */}
                                    <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-neutral-100 z-0" />

                                    {selected.timeline.map((step, i) => (
                                        <div key={i} className="relative z-10 flex-1 min-w-[200px] group">
                                            {/* Step Indicator */}
                                            <div className="flex items-center gap-4 md:block mb-4">
                                                <div className={`w-12 h-12 rounded-full border-2 border-neutral-100 bg-white flex items-center justify-center text-neutral-400 group-hover:border-black group-hover:text-black transition-colors shadow-sm`}>
                                                    {step.icon}
                                                </div>
                                                <span className="md:mt-4 block font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-black transition-colors">
                                    {step.day}
                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="pl-16 md:pl-0 border-l-2 border-neutral-100 md:border-none">
                                                <h4 className="text-lg font-bold text-neutral-900 mb-1">{step.title}</h4>
                                                <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Info */}
                                <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-neutral-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase text-neutral-400">Total Turnaround</div>
                                            <div className="font-bold text-neutral-900">~7 Days per 1000 sq.ft</div>
                                        </div>
                                    </div>
                                    <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                        Request Site Audit <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}