'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Subtle parallax effect
      const xOffset = (clientX / innerWidth - 0.5) * 20
      const yOffset = (clientY / innerHeight - 0.5) * 20

      const elements = containerRef.current.querySelectorAll('.parallax-element')
      elements.forEach((el) => {
        const element = el as HTMLElement
        const speed = element.dataset.speed ? parseFloat(element.dataset.speed) : 1
        element.style.transform = `translate(${xOffset * speed}px, ${yOffset * speed}px)`
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6 parallax-element"
            data-speed="0.5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Greeting */}
            <motion.p
              className="text-gray-400 text-sm md:text-base uppercase tracking-[0.3em] font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Hello My Name Is
            </motion.p>

            {/* Name */}
            <div className="space-y-2">
              <motion.h1
                className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="text-[#7CFF00] block">Yuvan</span>
                <span className="text-white block">Raj</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-gray-400 text-lg md:text-xl font-light max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Developer | Blockchain Builder | AI Innovator
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <a
                href="#projects"
                className="px-8 py-3 bg-[#7CFF00] text-black rounded-lg font-semibold hover:bg-[#6eeb00] transition-all duration-300 shadow-lg shadow-[#7CFF00]/20"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-3 border-2 border-white/20 text-white rounded-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image */}
          <motion.div
            className="relative parallax-element hidden lg:flex justify-center items-center"
            data-speed="0.8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glassmorphism Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                {/* Profile Image Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold text-[#7CFF00] mb-4">YR</div>
                    <p className="text-gray-400 text-sm">Profile Image</p>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#7CFF00]/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#7CFF00]/10 blur-2xl"
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 blur-2xl"
                animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.8 }, y: { duration: 2, repeat: Infinity } }}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Scroll</p>
          <ArrowDown size={20} className="text-gray-500" />
        </div>
      </motion.div>
    </section>
  )
}
