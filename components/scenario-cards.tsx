"use client"

import { useState, useEffect } from "react"

interface ProjectScenario {
  id: string
  name: string
  description: string
  total: number
  items: string[]
}

const scenarios: ProjectScenario[] = [
  {
    id: "a",
    name: "Standard Progress",
    description: "6 months tracking",
    total: 3550,
    items: ["1× Initial Scouting", "6× Monthly Updates"],
  },
  {
    id: "b",
    name: "Core Mapping",
    description: "10-acre, 3 months",
    total: 8300,
    items: ["3× Orthomosaic Maps", "3× Volumetrics", "1× Audit"],
  },
  {
    id: "c",
    name: "Safety Inspection",
    description: "2-day intensive",
    total: 3350,
    items: ["2× On-Site Days", "1× Thermal Scan", "2× Travel Days"],
  },
]

interface ScenarioCardsProps {
  onSelect: (scenario: ProjectScenario) => void
}

export function ScenarioCards({ onSelect }: ScenarioCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prev) => (prev + 1) % scenarios.length)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {scenarios.map((scenario, index) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario)}
          onMouseEnter={() => setIsHovered(scenario.id)}
          onMouseLeave={() => setIsHovered(null)}
          className={`relative p-4 rounded-xl text-left transition-all duration-300 border ${
            activeIndex === index || isHovered === scenario.id
              ? "border-primary bg-primary/10 glow-primary"
              : "border-border/50 bg-secondary/30 hover:border-primary/50"
          }`}
        >
          {/* Scenario indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono bg-primary/20 text-primary border border-primary/30">
              {scenario.id.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {scenario.name}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            {scenario.description}
          </p>

          <ul className="space-y-1 mb-4">
            {scenario.items.map((item, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex items-end justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Est. Total
            </span>
            <span className="text-xl font-mono font-bold text-primary">
              ${scenario.total.toLocaleString()}
            </span>
          </div>

          {/* Active indicator pulse */}
          {(activeIndex === index || isHovered === scenario.id) && (
            <div className="absolute top-3 right-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
