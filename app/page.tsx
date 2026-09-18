"use client"

import { useState } from "react"
import { DroneVisualization } from "@/components/drone-visualization"
import { EstimatorForm, EstimateData } from "@/components/estimator-form"
import { CostBreakdown } from "@/components/cost-breakdown"
import { ScenarioCards } from "@/components/scenario-cards"
import { HoloStats } from "@/components/holo-stats"
import { HoloChart } from "@/components/holo-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function BastidorDashboard() {
  const [estimate, setEstimate] = useState<EstimateData>({
    projectType: "progress",
    siteAcreage: 10,
    months: 6,
    includeMapping: false,
    includeVolumetrics: false,
    includeAudit: false,
    includeThermal: false,
    travelDays: 0,
  })

  return (
    <div className="min-h-screen holo-grid relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      
      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center animate-pulse-glow">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6 text-primary"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    BASTIDOR
                  </h1>
                  <p className="text-xs text-primary font-mono uppercase tracking-widest">
                    Drone & Material Estimator
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <nav className="flex items-center gap-4">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Fleet
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Reports
                  </a>
                </nav>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                  New Mission
                </Button>
              </div>

              {/* Mobile menu */}
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Status bar */}
          <HoloStats />

          {/* Hero section with drone */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Drone visualization */}
            <div className="relative h-80 lg:h-auto min-h-[320px] rounded-2xl overflow-hidden glass-card border border-border/50">
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
                  </span>
                  <span className="text-xs font-mono text-primary">LIVE FEED</span>
                </div>
              </div>
              <DroneVisualization />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>UNIT: DJI-M30T</span>
                  <span>BATTERY: 78%</span>
                  <span className="hidden sm:inline">SIGNAL: STRONG</span>
                </div>
              </div>
            </div>

            {/* Quick scenarios */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Quick Estimate Scenarios
                </h2>
                <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                  BASTIDOR RATE CARD v2.4
                </span>
              </div>
              <ScenarioCards
                onSelect={(scenario) => {
                  if (scenario.id === "a") {
                    setEstimate({
                      ...estimate,
                      projectType: "progress",
                      months: 6,
                      includeMapping: false,
                      includeVolumetrics: false,
                      includeAudit: false,
                      includeThermal: false,
                      travelDays: 0,
                    })
                  } else if (scenario.id === "b") {
                    setEstimate({
                      ...estimate,
                      projectType: "mapping",
                      siteAcreage: 10,
                      months: 3,
                      includeMapping: true,
                      includeVolumetrics: true,
                      includeAudit: true,
                      includeThermal: false,
                      travelDays: 0,
                    })
                  } else if (scenario.id === "c") {
                    setEstimate({
                      ...estimate,
                      projectType: "inspection",
                      months: 1,
                      includeMapping: false,
                      includeVolumetrics: false,
                      includeAudit: false,
                      includeThermal: true,
                      travelDays: 2,
                    })
                  }
                }}
              />

              {/* Mini chart */}
              <div className="rounded-xl glass-card border border-border/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Monthly Expenditure
                  </h3>
                  <span className="text-xs font-mono text-primary">+12.4%</span>
                </div>
                <HoloChart />
              </div>
            </div>
          </div>

          {/* Estimator section */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 rounded-2xl glass-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Custom Estimate
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Configure your project parameters
                  </p>
                </div>
              </div>
              <EstimatorForm onEstimateChange={setEstimate} />
            </div>

            {/* Results */}
            <div className="lg:col-span-3 rounded-2xl glass-card border border-border/50 p-6">
              <Tabs defaultValue="breakdown" className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <TabsList className="bg-secondary/50 border border-border/50">
                    <TabsTrigger value="breakdown" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
                      Cost Breakdown
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
                      Deliverables
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/20">
                    Export PDF
                  </Button>
                </div>

                <TabsContent value="breakdown" className="flex-1 mt-0">
                  <CostBreakdown estimate={estimate} />
                </TabsContent>

                <TabsContent value="timeline" className="flex-1 mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono text-sm shrink-0">
                        W1
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                          Initial Site Assessment
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Drone deployment, baseline mapping
                        </p>
                      </div>
                      <span className="text-xs font-mono text-primary shrink-0">
                        Days 1-7
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border ml-6" />
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground font-mono text-sm shrink-0">
                        W2
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                          Progress Documentation
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Weekly aerial surveys, volumetric analysis
                        </p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        Days 8-14
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border ml-6" />
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground font-mono text-sm shrink-0">
                        W3
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                          Report Generation
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Final deliverables, client presentation
                        </p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        Days 15-21
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="deliverables" className="flex-1 mt-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "📍",
                        title: "2D Orthomosaic Maps",
                        desc: "High-resolution aerial imagery stitched into accurate, georeferenced maps",
                      },
                      {
                        icon: "📊",
                        title: "Volumetric Analysis",
                        desc: "Precise stockpile measurements with cut/fill calculations",
                      },
                      {
                        icon: "🔥",
                        title: "Thermal Imaging",
                        desc: "Building envelope analysis for energy efficiency and defects",
                      },
                      {
                        icon: "📹",
                        title: "Progress Videos",
                        desc: "Time-lapse and cinematic footage of construction progress",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="p-4 rounded-lg bg-secondary/20 border border-border/30"
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h4 className="text-sm font-medium text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Services grid */}
          <div className="rounded-2xl glass-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Service Rate Card
              </h2>
              <span className="text-xs font-mono text-primary">
                2024 PRICING
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  service: "Site Scouting Still",
                  rate: "$200-$300",
                  unit: "per visit",
                },
                {
                  service: "Progress Media Updates",
                  rate: "$550",
                  unit: "per month",
                },
                {
                  service: "2D Orthomosaic Mapping",
                  rate: "$225",
                  unit: "per acre",
                },
                {
                  service: "Stockpile Volumetrics",
                  rate: "$200",
                  unit: "per asset",
                },
                {
                  service: "Roof & Facade Audit",
                  rate: "$800-$1,100",
                  unit: "package",
                },
                {
                  service: "Thermal Building Scan",
                  rate: "$1,500-$2,200",
                  unit: "package",
                },
                {
                  service: "On-Site Block Rate",
                  rate: "$600",
                  unit: "per day",
                },
                {
                  service: "Travel & Admin",
                  rate: "$150",
                  unit: "flat fee",
                },
              ].map((item) => (
                <div
                  key={item.service}
                  className="p-3 sm:p-4 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                    {item.service}
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-base sm:text-xl font-mono font-bold text-foreground">
                      {item.rate}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-primary">{item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  BASTIDOR Drone Services
                </span>
                <span className="text-xs text-primary font-mono">v2.4.0</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>System Status: <span className="text-chart-2">Operational</span></span>
                <span>•</span>
                <span>Last Sync: Just now</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
