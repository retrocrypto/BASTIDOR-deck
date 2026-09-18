"use client"

import { useEffect, useRef } from "react"

export function DroneVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    let frame = 0
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = []

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.fillStyle = "rgba(8, 12, 25, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "rgba(0, 220, 255, 0.1)"
      ctx.lineWidth = 0.5
      const gridSize = 30
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Drone body (center)
      const centerX = width / 2
      const centerY = height / 2
      const droneSize = Math.min(width, height) * 0.15
      const bobOffset = Math.sin(frame * 0.03) * 5

      // Draw drone arms
      ctx.strokeStyle = "rgba(0, 220, 255, 0.8)"
      ctx.lineWidth = 3
      const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]

      armAngles.forEach((angle, i) => {
        const armLength = droneSize * 1.2
        const endX = centerX + Math.cos(angle) * armLength
        const endY = centerY + bobOffset + Math.sin(angle) * armLength

        // Arm
        ctx.beginPath()
        ctx.moveTo(centerX, centerY + bobOffset)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Rotor glow
        const rotorSpeed = frame * 0.15 + i * Math.PI / 2
        ctx.beginPath()
        ctx.arc(endX, endY, droneSize * 0.35, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 220, 255, ${0.3 + Math.sin(rotorSpeed) * 0.2})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Rotor blades (spinning)
        ctx.save()
        ctx.translate(endX, endY)
        ctx.rotate(frame * 0.3)
        ctx.strokeStyle = "rgba(0, 220, 255, 0.6)"
        ctx.lineWidth = 2
        for (let b = 0; b < 2; b++) {
          ctx.beginPath()
          ctx.moveTo(-droneSize * 0.3, 0)
          ctx.lineTo(droneSize * 0.3, 0)
          ctx.stroke()
          ctx.rotate(Math.PI / 2)
        }
        ctx.restore()
      })

      // Drone body center
      ctx.fillStyle = "rgba(0, 220, 255, 0.9)"
      ctx.beginPath()
      ctx.arc(centerX, centerY + bobOffset, droneSize * 0.25, 0, Math.PI * 2)
      ctx.fill()

      // Inner glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY + bobOffset, 0,
        centerX, centerY + bobOffset, droneSize * 0.25
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      gradient.addColorStop(0.5, "rgba(0, 220, 255, 0.5)")
      gradient.addColorStop(1, "rgba(0, 220, 255, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY + bobOffset, droneSize * 0.25, 0, Math.PI * 2)
      ctx.fill()

      // Camera lens
      ctx.fillStyle = "rgba(20, 30, 50, 1)"
      ctx.beginPath()
      ctx.arc(centerX, centerY + bobOffset + droneSize * 0.15, droneSize * 0.08, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(0, 220, 255, 0.8)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Scanning beam
      const beamWidth = droneSize * 2
      const beamHeight = height - (centerY + bobOffset + droneSize * 0.2)
      ctx.fillStyle = `rgba(0, 220, 255, ${0.05 + Math.sin(frame * 0.05) * 0.03})`
      ctx.beginPath()
      ctx.moveTo(centerX, centerY + bobOffset + droneSize * 0.2)
      ctx.lineTo(centerX - beamWidth / 2, height)
      ctx.lineTo(centerX + beamWidth / 2, height)
      ctx.closePath()
      ctx.fill()

      // Particles
      if (frame % 5 === 0) {
        particles.push({
          x: centerX + (Math.random() - 0.5) * beamWidth,
          y: centerY + bobOffset + droneSize * 0.3 + Math.random() * beamHeight * 0.8,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 0.5 + 0.2,
          life: 1,
        })
      }

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01

        if (p.life <= 0) {
          particles.splice(i, 1)
          return
        }

        ctx.fillStyle = `rgba(0, 220, 255, ${p.life * 0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // HUD elements
      ctx.strokeStyle = "rgba(0, 220, 255, 0.5)"
      ctx.lineWidth = 1

      // Corner brackets
      const bracketSize = 20
      const margin = 15
      ;[
        [margin, margin, 1, 1],
        [width - margin, margin, -1, 1],
        [margin, height - margin, 1, -1],
        [width - margin, height - margin, -1, -1],
      ].forEach(([x, y, dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(x as number, (y as number) + (dy as number) * bracketSize)
        ctx.lineTo(x as number, y as number)
        ctx.lineTo((x as number) + (dx as number) * bracketSize, y as number)
        ctx.stroke()
      })

      // Status text
      ctx.fillStyle = "rgba(0, 220, 255, 0.8)"
      ctx.font = "10px monospace"
      ctx.fillText("DRONE STATUS: ACTIVE", margin + 5, margin + 25)
      ctx.fillText(`ALT: ${(150 + Math.sin(frame * 0.02) * 10).toFixed(1)}m`, margin + 5, margin + 40)
      ctx.fillText(`LAT: 34.0522°N`, width - margin - 80, margin + 25)
      ctx.fillText(`LON: 118.2437°W`, width - margin - 80, margin + 40)

      frame++
      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  )
}
