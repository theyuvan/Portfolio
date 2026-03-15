'use client'

import { useEffect, useRef } from 'react'

export function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let mouseX = 0
    let mouseY = 0

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    class Wave {
      y: number
      length: number
      amplitude: number
      frequency: number
      speed: number
      offset: number
      color: string
      mouseInfluence: number

      constructor(y: number, length: number, amplitude: number, frequency: number, speed: number, color: string, mouseInfluence: number) {
        this.y = y
        this.length = length
        this.amplitude = amplitude
        this.frequency = frequency
        this.speed = speed
        this.offset = 0
        this.color = color
        this.mouseInfluence = mouseInfluence
      }

      update() {
        this.offset += this.speed
      }

      draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let i = 0; i < canvas.width; i++) {
          // Calculate mouse distance influence
          const distanceX = Math.abs(i - mouseX)
          const distanceY = Math.abs(this.y - mouseY)
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          const mouseEffect = Math.max(0, 1 - distance / 300) * this.mouseInfluence

          const y = this.y +
            Math.sin((i / this.length + this.offset) * this.frequency) * this.amplitude +
            mouseEffect * 30

          ctx.lineTo(i, y)
        }

        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Add glow effect
        ctx.shadowBlur = 20
        ctx.shadowColor = this.color
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    }

    const waves = [
      new Wave(150, 0.01, 30, 2, 0.002, 'rgba(126, 104, 255, 0.1)', 20),
      new Wave(200, 0.012, 40, 1.5, 0.0025, 'rgba(126, 104, 255, 0.15)', 25),
      new Wave(250, 0.008, 35, 2.5, 0.003, 'rgba(126, 104, 255, 0.12)', 15),
      new Wave(350, 0.015, 45, 1.8, 0.0015, 'rgba(255, 255, 255, 0.08)', 30),
      new Wave(450, 0.01, 50, 2.2, 0.002, 'rgba(255, 255, 255, 0.06)', 18),
      new Wave(550, 0.013, 38, 2, 0.0028, 'rgba(126, 104, 255, 0.1)', 22),
    ]

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      waves.forEach(wave => {
        wave.update()
        wave.draw(ctx, canvas)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
