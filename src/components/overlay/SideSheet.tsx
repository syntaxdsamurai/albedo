"use client"

import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SideSheet() {
    return (
        <div className="h-full flex flex-col">
            <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-bold tracking-tight">Project Albedo</SheetTitle>
                <SheetDescription>
                    The Urban Thermal Twin Engine. Decoding heat islands with geospatial intelligence.
                </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-full pr-4">
                <div className="space-y-8 pb-10">
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            🌍 The Problem
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Delhi is entering a "Heat Death Loop." Concrete structures absorb solar radiation during the day and release it at night, keeping ambient temperatures 4-5°C higher than rural surroundings. This forces ACs to run harder, consuming more energy and releasing more waste heat.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            🛰️ The Technology
                        </h3>
                        <div className="p-4 rounded-lg border bg-muted/30 text-sm space-y-2">
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-mono text-xs text-muted-foreground">SATELLITE</span>
                                <span>Landsat 8 (TIRS Band 10)</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-mono text-xs text-muted-foreground">PROCESSING</span>
                                <span>Google Earth Engine + Python</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-mono text-xs text-muted-foreground">VISUALIZATION</span>
                                <span>Mapbox GL JS + Deck.gl Hexagons</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            💡 The Business Case
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            We identify the top 1% of "Super-Emitter" buildings. By targeting retrofits (cool paints, green roofs) specifically at these hotspots, we can achieve maximum cooling with minimum investment.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded border text-center">
                                <div className="text-2xl font-bold text-emerald-500">20%</div>
                                <div className="text-xs text-muted-foreground">Roof Coverage Needed</div>
                            </div>
                            <div className="p-3 rounded border text-center">
                                <div className="text-2xl font-bold text-blue-500">2.5°C</div>
                                <div className="text-xs text-muted-foreground">Potential City Cooling</div>
                            </div>
                        </div>
                    </section>
                </div>
            </ScrollArea>
        </div>
    )
}