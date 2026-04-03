'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import BounceCards from './bounce-cards'
import { fetchAboutGalleryImages, fetchAboutInfo } from '@/app/actions/portfolio'
import { useIsMobile } from '@/hooks/use-mobile'

interface AboutInfo {
  bio_paragraph_1: string
  bio_paragraph_2: string
  experience_years: string
  projects_count: string
  images: string[]
}

interface AboutSectionProps {
  onReady?: () => void
}

const DESKTOP_TRANSFORM_STYLES = [
  'rotate(7deg) translate(-140px)',
  'rotate(0deg) translate(0px)',
  'rotate(-7deg) translate(140px)',
]

const MOBILE_TRANSFORM_STYLES = [
  'rotate(6deg) translate(-92px)',
  'rotate(0deg) translate(0px)',
  'rotate(-6deg) translate(92px)',
]

export function AboutSection({ onReady }: AboutSectionProps) {
  const isMobile = useIsMobile()
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null)
  const [aboutImages, setAboutImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAboutInfo = async () => {
      try {
        setIsLoading(true)
        const data = await fetchAboutInfo()
        const galleryImages = await fetchAboutGalleryImages()

        if (galleryImages.length > 0) {
          setAboutImages(galleryImages)
        }

        if (data) {
          setAboutInfo(data)
          if (galleryImages.length === 0) {
            // Fallback to placeholder images if no images provided
            setAboutImages([
              'https://lightbearers.org/img/fallback-profile.jpg',
              'https://lightbearers.org/img/fallback-profile.jpg',
              'https://lightbearers.org/img/fallback-profile.jpg',
            ])
          }
        } else {
          setError('Failed to load about information')
        }
      } catch (err) {
        console.error('Error loading about info:', err)
        setError('Failed to load about information')
      } finally {
        setIsLoading(false)
        onReady?.()
      }
    }

    loadAboutInfo()
  }, [])

  // Default values for fallback
  const defaultAboutInfo: AboutInfo = {
    bio_paragraph_1:
      "I'm a full-stack developer passionate about creating innovative solutions in blockchain, web3, and artificial intelligence. With expertise in React, Next.js, and smart contract development, I bridge the gap between creative design and robust functionality.",
    bio_paragraph_2:
      "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
    experience_years: '3+',
    projects_count: '20+',
    images: [],
  }

  const displayAboutInfo = aboutInfo || defaultAboutInfo
  const transformStyles = isMobile ? MOBILE_TRANSFORM_STYLES : DESKTOP_TRANSFORM_STYLES
  const displayImages =
    aboutImages.length > 0
      ? aboutImages
      : [
          'https://lightbearers.org/img/fallback-profile.jpg',
          'https://lightbearers.org/img/fallback-profile.jpg',
          'https://lightbearers.org/img/fallback-profile.jpg',
        ]

  return (
    <section id="about" className="py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Section Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-[#7E68FF]">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A passionate developer with a mission to build the future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Left: Bounce card stack */}
          <motion.div
            className="w-full flex justify-center"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {isLoading ? (
              <div className="w-full max-w-[640px] h-[380px] flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <BounceCards
                className="w-full max-w-[640px] px-2 sm:px-0"
                images={displayImages}
                containerWidth={isMobile ? 360 : 640}
                containerHeight={isMobile ? 260 : 380}
                animationDelay={1.5}
                animationStagger={0.15}
                easeType="elastic.out(1, 0.5)"
                transformStyles={transformStyles}
                enableHover
              />
            )}
          </motion.div>

          {/* Right: existing text content */}
          <div>
            {/* Bio */}
            <div className="text-left mb-10">
              <motion.p
                className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {displayAboutInfo.bio_paragraph_1}
              </motion.p>
              <motion.p
                className="text-gray-400 text-base sm:text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                viewport={{ once: true }}
              >
                {displayAboutInfo.bio_paragraph_2}
              </motion.p>
            </div>

            {/* Slogan */}
            <motion.div
              className="mb-10 py-6 border-l-4 border-primary pl-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-lg md:text-xl font-semibold text-primary italic">
                "Surpass your limits. Right here, right now!"
                        
              </p>
              <p className="text-sm text-gray-500 mt-2 text-right">— Yami Sukehiro</p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { value: displayAboutInfo.experience_years, label: 'Experience' },
                { value: displayAboutInfo.projects_count, label: 'Projects' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="px-6 py-3 border border-primary/40 rounded-lg hover:border-primary hover:bg-primary/10 transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-base font-bold neon-text">{stat.value}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </motion.div>
              ))}

              
            </motion.div>

            {/* CTA */}
            
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <motion.div
        className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ marginTop: '-200px', marginLeft: '-200px' }}
      />
    </section>
  )
}
