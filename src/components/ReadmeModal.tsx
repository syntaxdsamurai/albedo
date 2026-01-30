"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, TrendingUp, Landmark } from "lucide-react";

interface ReadmeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// CHANGED: "export function" instead of "export default function"
export function ReadmeModal({ isOpen, onClose }: ReadmeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-bold text-xl">
                                    A.
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Project Documentation</h2>
                                    <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">Concept Whitepaper</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition">
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto p-6 md:p-10 space-y-12 text-neutral-800 dark:text-neutral-200">

                            {/* DISCLAIMER */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 p-6 rounded-2xl flex gap-4 items-start">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                                <div>
                                    <h3 className="text-amber-800 dark:text-amber-400 font-bold text-lg mb-1">Prototype Disclaimer</h3>
                                    <p className="text-amber-700 dark:text-amber-300/80 text-sm leading-relaxed">
                                        This is a conceptual prototype designed for demonstration purposes. The data, partnerships (Asian Paints, UltraTech, etc.), and pricing models shown are illustrative simulations of a potential real-world implementation. This does not represent a live commercial product.
                                    </p>
                                </div>
                            </div>

                            {/* 1. Problem Statement */}
                            <section>
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-red-500">01.</span> The Problem
                                </h3>
                                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    Urban Heat Islands (UHI) are turning Indian cities into ovens. Concrete and asphalt absorb 95% of solar radiation, raising city temperatures by 4-6°C compared to rural areas. This increases AC energy load, creates deadly heatwaves, and reduces overall livability.
                                </p>
                            </section>

                            {/* 2. The Solution */}
                            <section>
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-emerald-500">02.</span> The Albedo Solution
                                </h3>
                                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                                    A decentralized platform to retrofit city infrastructure with high-albedo (reflective) materials. We target the three largest surface areas in any city:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <div className="font-bold mb-1">Rooftops</div>
                                        <div className="text-sm text-neutral-500">Reflective White Coatings</div>
                                    </div>
                                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <div className="font-bold mb-1">Facades</div>
                                        <div className="text-sm text-neutral-500">Vertical Bio-Gardens</div>
                                    </div>
                                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <div className="font-bold mb-1">Ground</div>
                                        <div className="text-sm text-neutral-500">Permeable Pavers</div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. How It Works */}
                            <section>
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-blue-500">03.</span> How It Works
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 shrink-0">1</div>
                                        <div>
                                            <div className="font-bold">Scan & Identify</div>
                                            <p className="text-sm text-neutral-500">Satellite data identifies "Hot Zones" with low albedo.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 shrink-0">2</div>
                                        <div>
                                            <div className="font-bold">Simulate Impact</div>
                                            <p className="text-sm text-neutral-500">Our engine calculates potential temp drop and energy savings.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 shrink-0">3</div>
                                        <div>
                                            <div className="font-bold">Deploy Partners</div>
                                            <p className="text-sm text-neutral-500">Connect with pre-vetted vendors (Asian Paints, etc.) for execution.</p>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            {/* 4. Business & Govt */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" /> Business Model
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400">
                                        <li><strong className="text-neutral-900 dark:text-white">Commission Fee:</strong> 5-10% on every retrofit contract executed through the platform.</li>
                                        <li><strong className="text-neutral-900 dark:text-white">Carbon Credits:</strong> Aggregating energy savings to sell verified carbon credits to corporates.</li>
                                        <li><strong className="text-neutral-900 dark:text-white">Data Licensing:</strong> Selling heat-map data to real estate developers.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Landmark className="w-5 h-5" /> Govt. Role
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400">
                                        <li><strong className="text-neutral-900 dark:text-white">Subsidy Provider:</strong> Offering 20% subsidy on green materials (Cool Roof Policy).</li>
                                        <li><strong className="text-neutral-900 dark:text-white">Mandate Enforcer:</strong> Making cool roofs mandatory for plots &gt; 500 sq. yards.</li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-center">
                            <p className="text-xs text-neutral-400">
                                Built for the <span className="font-bold text-neutral-600 dark:text-neutral-300">India AI Impact Summit 2026</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}