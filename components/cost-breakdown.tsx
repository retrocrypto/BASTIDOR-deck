"use client"

import { useMemo } from "react"
import type { EstimateData } from "./estimator-form"

interface CostBreakdownProps {
  estimate: EstimateData
}

interface LineItem {
  label: string
  calculation: string
  amount: number
}

export function CostBreakdown({ estimate }: CostBreakdownProps) {
  const breakdown = useMemo(() => {
    const items: LineItem[] = []
    let total = 0

    // Base costs by project type
    if (estimate.projectType === "progress") {
      items.push({
        label: "Initial Site Scouting",
        calculation: "$250",
        amount: 250,
      })
      const progressCost = 550 * estimate.months
      items.push({
        label: "Monthly Progress Updates",
        calculation: `$550 × ${estimate.months} months`,
        amount: progressCost,
      })
      total += 250 + progressCost
    } else if (estimate.projectType === "inspection") {
      const dayRate = 600 * 2
      items.push({
        label: "On-Site Block Rates",
        calculation: "$600/day × 2 days",
        amount: dayRate,
      })
      total += dayRate
    }

    // Mapping costs
    if (estimate.includeMapping) {
      const mappingCost = 225 * estimate.siteAcreage * estimate.months
      items.push({
        label: "2D Orthomosaic Mapping",
        calculation: `$225/acre × ${estimate.siteAcreage} acres × ${estimate.months} mo`,
        amount: mappingCost,
      })
      total += mappingCost
    }

    // Volumetrics
    if (estimate.includeVolumetrics) {
      const volCost = 200 * estimate.months
      items.push({
        label: "Stockpile Volumetrics",
        calculation: `$200/asset × ${estimate.months} months`,
        amount: volCost,
      })
      total += volCost
    }

    // Audit package
    if (estimate.includeAudit) {
      items.push({
        label: "Roof & Facade Audit",
        calculation: "Mid-range package",
        amount: 950,
      })
      total += 950
    }

    // Thermal scan
    if (estimate.includeThermal) {
      items.push({
        label: "Thermal Building Scan",
        calculation: "Mid-range package",
        amount: 1850,
      })
      total += 1850
    }

    // Travel fees
    if (estimate.travelDays > 0) {
      const travelCost = 150 * estimate.travelDays
      items.push({
        label: "Travel & Admin Fees",
        calculation: `$150 × ${estimate.travelDays} days`,
        amount: travelCost,
      })
      total += travelCost
    }

    return { items, total }
  }, [estimate])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {breakdown.items.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between p-3 rounded-lg bg-secondary/20 border border-border/30"
          >
            <div className="space-y-0.5">
              <span className="text-sm text-foreground">{item.label}</span>
              <p className="text-xs text-muted-foreground font-mono">
                {item.calculation}
              </p>
            </div>
            <span className="text-sm font-mono text-primary">
              ${item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {breakdown.items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Configure your project to see cost breakdown</p>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            Estimated Total
          </span>
          <div className="text-right">
            <span className="text-3xl font-mono font-bold text-primary glow-text">
              ${breakdown.total.toLocaleString()}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              *Estimates may vary based on site conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
