"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface EstimatorFormProps {
  onEstimateChange: (estimate: EstimateData) => void
}

export interface EstimateData {
  projectType: string
  siteAcreage: number
  months: number
  includeMapping: boolean
  includeVolumetrics: boolean
  includeAudit: boolean
  includeThermal: boolean
  travelDays: number
}

export function EstimatorForm({ onEstimateChange }: EstimatorFormProps) {
  const [formData, setFormData] = useState<EstimateData>({
    projectType: "progress",
    siteAcreage: 10,
    months: 6,
    includeMapping: false,
    includeVolumetrics: false,
    includeAudit: false,
    includeThermal: false,
    travelDays: 0,
  })

  const updateForm = (updates: Partial<EstimateData>) => {
    const newData = { ...formData, ...updates }
    setFormData(newData)
    onEstimateChange(newData)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm text-primary font-mono uppercase tracking-wider">
          Project Type
        </Label>
        <Select
          value={formData.projectType}
          onValueChange={(v) => updateForm({ projectType: v })}
        >
          <SelectTrigger className="glass-card border-border bg-secondary/50 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-border bg-card">
            <SelectItem value="progress">Standard Progress Tracking</SelectItem>
            <SelectItem value="mapping">Core Construction & Mapping</SelectItem>
            <SelectItem value="inspection">Safety Inspection</SelectItem>
            <SelectItem value="custom">Custom Package</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm text-primary font-mono uppercase tracking-wider">
            Site Acreage
          </Label>
          <span className="text-xl font-mono text-foreground glow-text">
            {formData.siteAcreage} acres
          </span>
        </div>
        <Slider
          value={[formData.siteAcreage]}
          onValueChange={([v]) => updateForm({ siteAcreage: v })}
          min={1}
          max={100}
          step={1}
          className="py-2"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm text-primary font-mono uppercase tracking-wider">
            Project Duration
          </Label>
          <span className="text-xl font-mono text-foreground glow-text">
            {formData.months} months
          </span>
        </div>
        <Slider
          value={[formData.months]}
          onValueChange={([v]) => updateForm({ months: v })}
          min={1}
          max={24}
          step={1}
          className="py-2"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <Label className="text-sm text-primary font-mono uppercase tracking-wider">
          Services
        </Label>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="space-y-0.5">
              <span className="text-sm text-foreground">2D Orthomosaic Mapping</span>
              <p className="text-xs text-muted-foreground">$225/acre per survey</p>
            </div>
            <Switch
              checked={formData.includeMapping}
              onCheckedChange={(v) => updateForm({ includeMapping: v })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="space-y-0.5">
              <span className="text-sm text-foreground">Stockpile Volumetrics</span>
              <p className="text-xs text-muted-foreground">$200/asset per survey</p>
            </div>
            <Switch
              checked={formData.includeVolumetrics}
              onCheckedChange={(v) => updateForm({ includeVolumetrics: v })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="space-y-0.5">
              <span className="text-sm text-foreground">Roof & Facade Audit</span>
              <p className="text-xs text-muted-foreground">$950 package</p>
            </div>
            <Switch
              checked={formData.includeAudit}
              onCheckedChange={(v) => updateForm({ includeAudit: v })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="space-y-0.5">
              <span className="text-sm text-foreground">Thermal Building Scan</span>
              <p className="text-xs text-muted-foreground">$1,850 package</p>
            </div>
            <Switch
              checked={formData.includeThermal}
              onCheckedChange={(v) => updateForm({ includeThermal: v })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center">
          <Label className="text-sm text-primary font-mono uppercase tracking-wider">
            Travel Days
          </Label>
          <span className="text-xl font-mono text-foreground glow-text">
            {formData.travelDays} days
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={formData.travelDays}
            onChange={(e) => updateForm({ travelDays: parseInt(e.target.value) || 0 })}
            min={0}
            max={30}
            className="w-24 glass-card border-border bg-secondary/50 text-foreground"
          />
          <span className="text-xs text-muted-foreground">× $150 flat fee/day</span>
        </div>
      </div>
    </div>
  )
}
