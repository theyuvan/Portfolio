'use client'

import { useEffect } from 'react'
import { LoadingScreen } from '@/components/loading-screen'
import { SimpleNavigation } from '@/components/simple-navigation'
import { MinimalHeroSection } from '@/components/minimal-hero-section'
import { ConstellationBackground } from '@/components/constellation-background'
import { AboutSection } from '@/components/about-section'
import { SkillsSection } from '@/components/skills-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection } from '@/components/contact-section'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'
import Lenis from 'lenis'

export default function Home() {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: true,
      syncTouchLerp: 0.075,
      lerp: 0.1,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <main className="text-foreground min-h-screen overflow-x-hidden bg-black">
        <LoadingScreen />
        <SimpleNavigation />

        {/* Landing only: constellation background */}
        <section className="relative min-h-screen overflow-hidden mb-[4cm]">
          <ConstellationBackground>
            <MinimalHeroSection />
          </ConstellationBackground>
        </section>

        {/* Remaining sections */}
        <div className="relative bg-black">
          <div className="mb-[3cm]">
            <AboutSection />
          </div>

          <div className="mb-[4cm]">
            <SkillsSection />
          </div>

          <div className="mb-[4cm]">
            <ProjectsSection />
          </div>

          <ContactSection />

          <div className="w-full px-4 sm:px-6 pb-6 sm:pb-8 pt-2 border-t border-white/10">
            <p className="text-left text-sm sm:text-base text-gray-300">
              © 2026 Yuvan raj. All rights reserved.
            </p>
          </div>
        </div>
        <ScrollToTopButton />
      </main>
    </>
  )
}
