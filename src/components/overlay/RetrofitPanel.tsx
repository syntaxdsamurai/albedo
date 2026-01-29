"use client"

import { useStore } from "@/store/useStore";
import { calculateImpact } from "@/lib/calculator";
import { MATERIALS } from "@/lib/materials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Leaf, Banknote, ArrowDown } from "lucide-react";

export function RetrofitPanel() {
    const store = useStore();

    // Calculate Live Impact
    const impact = calculateImpact(
        store.selectedMaterialRoof,
        store.selectedMaterialGround,
        store.targetArea
    );

    return (
        <div className="absolute bottom-6 right-6 z-40 w-[400px] max-h-[80vh] flex flex-col gap-4">

            {/* 1. CALCULATOR SECTION */}
            <Card className="glass-panel border-l-4 border-l-emerald-500 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ROI Calculator</p>
                            <h2 className="text-3xl font-bold flex items-center gap-2 mt-1">
                                {impact.newTemp}°C
                                <span className="text-sm font-normal text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center">
                  <ArrowDown className="w-3 h-3 mr-1" /> {impact.tempDrop}°C
                </span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Break Even</p>
                            <p className="text-xl font-bold">{impact.roiYears} Yrs</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Banknote className="w-3 h-3" /> Money Saved
                            </div>
                            <p className="font-semibold text-emerald-500">₹ {impact.moneySaved.toLocaleString()}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Leaf className="w-3 h-3" /> CO2 Removed
                            </div>
                            <p className="font-semibold">{impact.co2Abated.toLocaleString()} kg/yr</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. FILTERS SECTION (Map Controls) */}
            <Card className="glass-panel">
                <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Map Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Filter 1: Roofs */}
                    <div>
                        <label className="text-xs font-semibold mb-3 block">Filter 1: Roof Material</label>
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max space-x-3 pb-3">
                                {MATERIALS.filter(m => m.category === 'roof').map((material) => (
                                    <button
                                        key={material.id}
                                        onClick={() => store.setRoofMaterial(material.id)}
                                        className={cn(
                                            "flex flex-col items-start p-3 w-[140px] rounded-xl border transition-all text-left",
                                            store.selectedMaterialRoof.id === material.id
                                                ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                                                : "border-border hover:border-emerald-500/50 hover:bg-accent"
                                        )}
                                    >
                                        <div className="w-full h-8 rounded-md mb-2" style={{ backgroundColor: material.color }}></div>
                                        <span className="text-sm font-medium truncate w-full">{material.name}</span>
                                    </button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* Filter 2: Ground */}
                    <div>
                        <label className="text-xs font-semibold mb-3 block">Filter 2: Paved Areas</label>
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max space-x-3 pb-3">
                                {MATERIALS.filter(m => m.category === 'ground').map((material) => (
                                    <button
                                        key={material.id}
                                        onClick={() => store.setGroundMaterial(material.id)}
                                        className={cn(
                                            "flex flex-col items-start p-3 w-[140px] rounded-xl border transition-all text-left",
                                            store.selectedMaterialGround.id === material.id
                                                ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                                                : "border-border hover:border-emerald-500/50 hover:bg-accent"
                                        )}
                                    >
                                        <div className="w-full h-8 rounded-md mb-2" style={{ backgroundColor: material.color }}></div>
                                        <span className="text-sm font-medium truncate w-full">{material.name}</span>
                                    </button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}