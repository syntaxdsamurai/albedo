"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    // Break the title into letters for individual hover effects
    const title = "ALBEDO".split("");

    return (
        <footer className="w-full bg-black text-white pt-24 pb-12 px-6 rounded-t-[3rem] mt-[-3rem] relative z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">

                {/* LETTER-INDEPENDENT HOVER TITLE */}
                <div className="flex select-none overflow-hidden">
                    {title.map((letter, i) => (
                        <span
                            key={i}
                            className="text-[15vw] md:text-9xl font-bold tracking-tighter text-white/20 hover:text-white transition-colors duration-500 cursor-default leading-none"
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                <div className="text-right mt-10 md:mt-0 relative z-50">
                    <p className="text-neutral-500 font-medium">
                        © 2026 Albedo Inc. New Delhi.
                    </p>

                    {/* ENGINEERED BY DHRUV (Interactive Popover) */}
                    <div className="mt-2 flex justify-end">
                        <div className="relative group inline-block">
                            <p className="text-neutral-600 text-sm cursor-pointer">
                                Engineered by <span className="text-white font-bold group-hover:text-blue-400 transition-colors">Dhruv</span>
                            </p>

                            {/* THE POPUP WINDOW */}
                            <div className="absolute bottom-full right-0 mb-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl text-left">
                                    <p className="text-xs text-neutral-300 mb-3 font-medium">
                                        Wanna know more about me or contact me?
                                    </p>
                                    <a
                                        href="https://dhruvsainiportfolio.vercel.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-black text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                                    >
                                        Visit Portfolio <ArrowUpRight className="w-3 h-3" />
                                    </a>

                                    {/* Little Arrow pointing down */}
                                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/10 border-r border-b border-white/20 backdrop-blur-xl rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}