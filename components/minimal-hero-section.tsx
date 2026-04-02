'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import TiltedCard from './tilted-card'
import { fetchHeroImage } from '@/app/actions/portfolio'
import { useIsMobile } from '@/hooks/use-mobile'

export function MinimalHeroSection() {
  const isMobile = useIsMobile()
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>('/placeholder-user.jpg')
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const cardSize = isMobile ? 'min(84vw, 340px)' : 'min(44vw, 540px)'

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        setIsLoading(true)
        const imageUrl = await fetchHeroImage()
        setHeroImageUrl(imageUrl || '/placeholder-user.jpg')
        setImageLoadFailed(false)
      } catch (error) {
        console.error('Error loading hero image:', error)
        setHeroImageUrl('/placeholder-user.jpg')
        setImageLoadFailed(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadHeroImage()
  }, [])
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-24 items-center">
          {/* Left - Text Content */}
          <motion.div
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Small Text */}
            <p className="text-gray-400 text-sm sm:text-base md:text-sm uppercase tracking-[0.24em] sm:tracking-[0.34em] font-light">
              Hello My Name Is
            </p>

            {/* Large Name - Much Bigger */}
            <div className="space-y-2">
              <h1 className="font-bold leading-[0.85] tracking-tight">
                <span className="block text-primary text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem]">Yuvan</span>
                <span className="block text-white text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem]">Raj</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-gray-300 text-xl sm:text-2xl md:text-lg lg:text-xl font-light max-w-xl pt-2 sm:pt-4 mx-auto lg:mx-0">
              Developer | Blockchain Enthusiast
            </p>
          </motion.div>

          {/* Right - Profile Image */}
          <motion.div
            className="relative w-full mx-auto lg:mx-0 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TiltedCard
              containerWidth={cardSize}
              containerHeight={cardSize}
              imageWidth={cardSize}
              imageHeight={cardSize}
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
            >
              {/* Profile Image placeholder or actual image */}
              {isLoading ? (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-white/20 flex items-center justify-center relative rounded-2xl overflow-hidden glass-effect">
                  <div className="relative z-10 text-center">
                    <div className="text-6xl font-bold neon-text mb-2">YR</div>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              ) : heroImageUrl && !imageLoadFailed ? (
                <Image
                  src={heroImageUrl}
                  alt="Profile"
                  fill
                  className="w-full h-full object-cover object-top rounded-2xl"
                  priority
                  onError={() => setImageLoadFailed(true)}
                />
              ) : (
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
              )}
            </TiltedCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
