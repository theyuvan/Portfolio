'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import TiltedCard from './tilted-card'

export function MinimalHeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-8 lg:px-12 pt-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Text Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Small Text */}
            <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.4em] font-light">
              Hello My Name Is
            </p>

            {/* Large Name - Much Bigger */}
            <div className="space-y-2">
              <h1 className="font-bold leading-[0.85] tracking-tight">
                <span className="block text-primary text-[10vw] lg:text-[8rem] xl:text-[10rem]">Yuvan</span>
                <span className="block text-white text-[10vw] lg:text-[8rem] xl:text-[10rem]">Raj</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-base md:text-lg lg:text-xl font-light max-w-xl pt-4">
              Developer | Blockchain Enthusiast
            </p>
          </motion.div>

          {/* Right - Profile Image */}
          <motion.div
            className="relative w-full max-w-md mx-auto lg:mx-0 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TiltedCard
              containerWidth="540px"
              containerHeight="540px"
              imageWidth="540px"
              imageHeight="540px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
            >
              {/* Profile Image placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-white/20 flex items-center justify-center relative rounded-2xl overflow-hidden glass-effect">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white via-gray-300 to-gray-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ opacity: 0.1 }}
                />
                <div className="relative z-10 text-center">
                  <div className="text-6xl font-bold neon-text mb-2">YR</div>
                  <p className="text-muted-foreground">Profile Image</p>
                </div>

                {/* Floating glow elements */}
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
                  animate={{ y: [0, -30, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"
                  animate={{ y: [0, 30, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </TiltedCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
