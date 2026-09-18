"use client"

import { useEffect, useState } from "react"

interface StatValue {
  label: string
  value: string
  unit: string
  trend?: "up" | "down" | "stable"
}

const stats: StatValue[] = [
  { label: "Active Missions", value: "12", unit: "sites", trend: "up" },
  { label: "Footage Captured", value: "4.2", unit: "TB", trend: "up" },
  { label: "Flight Hours", value: "847", unit: "hrs", trend: "stable" },
  { label: "Coverage Area", value: "2,450", unit: "acres", trend: "up" },
]

export function HoloStats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`relative p-4 rounded-lg glass-card border border-border/50 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />

          <div className="flex items-start justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
              {stat.label}
            </span>
            {stat.trend && (
              <span
                className={`text-xs ${
                  stat.trend === "up"
                    ? "text-chart-2"
                    : stat.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→"}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-sm text-primary">{stat.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
