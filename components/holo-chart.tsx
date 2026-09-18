"use client"

import { useState, useEffect, useRef } from "react"

interface DataPoint {
  month: string
  cost: number
  coverage: number
}

const monthlyData: DataPoint[] = [
  { month: "Jan", cost: 2800, coverage: 45 },
  { month: "Feb", cost: 3200, coverage: 52 },
  { month: "Mar", cost: 4100, coverage: 68 },
  { month: "Apr", cost: 3800, coverage: 61 },
  { month: "May", cost: 5200, coverage: 78 },
  { month: "Jun", cost: 6100, coverage: 89 },
]

export function HoloChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)
    }
    resize()

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = { top: 30, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "rgba(0, 220, 255, 0.1)"
    ctx.lineWidth = 0.5

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Y-axis labels
      const value = Math.round(7000 - (7000 / 5) * i)
      ctx.fillStyle = "rgba(0, 220, 255, 0.5)"
      ctx.font = "10px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`$${value}`, padding.left - 8, y + 3)
    }

    // X-axis labels
    ctx.textAlign = "center"
    monthlyData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (monthlyData.length - 1)) * i
      ctx.fillText(d.month, x, height - padding.bottom + 20)
    })

    // Draw area fill
    const maxCost = 7000
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + chartHeight)

    monthlyData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (monthlyData.length - 1)) * i
      const y = padding.top + chartHeight - (d.cost / maxCost) * chartHeight
      if (i === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width - padding.right, padding.top + chartHeight)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom)
    gradient.addColorStop(0, "rgba(0, 220, 255, 0.3)")
    gradient.addColorStop(1, "rgba(0, 220, 255, 0)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 220, 255, 0.8)"
    ctx.lineWidth = 2

    monthlyData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (monthlyData.length - 1)) * i
      const y = padding.top + chartHeight - (d.cost / maxCost) * chartHeight
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw data points
    monthlyData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (monthlyData.length - 1)) * i
      const y = padding.top + chartHeight - (d.cost / maxCost) * chartHeight

      // Glow
      if (hoveredIndex === i) {
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 220, 255, 0.2)"
        ctx.fill()
      }

      // Point
      ctx.beginPath()
      ctx.arc(x, y, hoveredIndex === i ? 6 : 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 220, 255, 1)"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, hoveredIndex === i ? 4 : 2, 0, Math.PI * 2)
      ctx.fillStyle = "#0a0f1a"
      ctx.fill()
    })

    // Tooltip
    if (hoveredIndex !== null) {
      const d = monthlyData[hoveredIndex]
      const x = padding.left + (chartWidth / (monthlyData.length - 1)) * hoveredIndex
      const y = padding.top + chartHeight - (d.cost / maxCost) * chartHeight

      ctx.fillStyle = "rgba(10, 20, 40, 0.9)"
      ctx.strokeStyle = "rgba(0, 220, 255, 0.5)"
      ctx.lineWidth = 1

      const tooltipW = 80
      const tooltipH = 40
      const tooltipX = Math.min(Math.max(x - tooltipW / 2, 10), width - tooltipW - 10)
      const tooltipY = y - tooltipH - 15

      ctx.beginPath()
      ctx.roundRect(tooltipX, tooltipY, tooltipW, tooltipH, 4)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "rgba(0, 220, 255, 0.9)"
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`$${d.cost.toLocaleString()}`, tooltipX + tooltipW / 2, tooltipY + 18)

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.font = "10px monospace"
      ctx.fillText(`${d.coverage}% coverage`, tooltipX + tooltipW / 2, tooltipY + 32)
    }

    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [hoveredIndex])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const padding = { left: 50, right: 20 }
    const chartWidth = width - padding.left - padding.right

    const dataIndex = Math.round(
      ((x - padding.left) / chartWidth) * (monthlyData.length - 1)
    )

    if (dataIndex >= 0 && dataIndex < monthlyData.length) {
      setHoveredIndex(dataIndex)
    } else {
      setHoveredIndex(null)
    }
  }

  return (
    <div className="relative h-64 w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    </div>
  )
}
