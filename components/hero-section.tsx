'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import gsap from 'gsap'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const text = textRef.current
    const letters = text.querySelectorAll('span')

    gsap.from(letters, {
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="space-y-8">
            {/* Greeting */}
            <motion.div variants={itemVariants} className="space-y-2">
              <motion.p
                className="text-primary font-semibold text-lg tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Welcome to my portfolio
              </motion.p>
              <h1
                ref={textRef}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                <span className="inline-block">Hello,</span> <br />
                <span className="inline-block">I'm </span>
                <span className="inline-block neon-text">Yuvan Raj</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-2xl md:text-3xl text-muted-foreground font-light"
            >
              Developer | Blockchain Builder | AI Innovator
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              I craft beautiful, performant web applications with cutting-edge technologies. Specializing in blockchain development, smart contracts, and AI-powered solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.a
                href="#projects"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center gap-2 cursor-pointer group overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects <ArrowRight size={18} />
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary-foreground/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>

              <motion.a
                href="#contact"
                className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold glass-effect-hover transition cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>

              <motion.a
                href="/resume.pdf"
                className="px-8 py-3 border border-muted text-muted-foreground rounded-lg font-semibold hover:border-primary hover:text-primary transition cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} /> Resume
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="pt-8 grid grid-cols-3 gap-8 border-t border-primary/20"
            >
              {[
                { number: '10+', label: 'Projects' },
                { number: '3+', label: 'Years Exp' },
                { number: '100%', label: 'Passion' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold neon-text">{stat.number}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - 3D Element */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 lg:h-[500px] hidden lg:flex items-center justify-center"
          >
            {/* Gradient Blob */}
            <motion.div
              className="absolute w-80 h-80 rounded-full blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #cccccc)',
                opacity: 0.1,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />

            {/* Rotating Ring */}
            <motion.div
              className="absolute w-72 h-72 border-2 border-primary/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Element */}
            <motion.div
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-white to-gray-500 shadow-2xl"
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                boxShadow: '0 0 60px rgba(255, 255, 255, 0.3)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Scroll to explore</p>
          <motion.div
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-primary rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
