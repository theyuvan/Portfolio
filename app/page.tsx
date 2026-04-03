'use client'

import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LoadingScreen } from '@/components/loading-screen'
import { SimpleNavigation } from '@/components/simple-navigation'
import { MinimalHeroSection } from '@/components/minimal-hero-section'
import { ConstellationBackground } from '@/components/constellation-background'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'

const AboutSection = dynamic(() => import('@/components/about-section').then((mod) => mod.AboutSection), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[760px]" />,
})

const SkillsSection = dynamic(() => import('@/components/skills-section').then((mod) => mod.SkillsSection), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[860px]" />,
})

const ProjectsSection = dynamic(() => import('@/components/projects-section').then((mod) => mod.ProjectsSection), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[920px]" />,
})

const ContactSection = dynamic(() => import('@/components/contact-section').then((mod) => mod.ContactSection), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="min-h-[760px]" />,
})

function SectionSkeleton({ minHeight }: { minHeight: string }) {
  return (
    <section className={`px-4 sm:px-6 ${minHeight} flex items-center justify-center`}>
      <div className="w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="h-4 w-24 rounded-full bg-white/10 mb-5" />
        <div className="h-10 w-3/5 max-w-md rounded-2xl bg-white/10 mb-4" />
        <div className="h-4 w-full rounded-full bg-white/5 mb-3" />
        <div className="h-4 w-11/12 rounded-full bg-white/5 mb-8" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(1)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const [timePhaseComplete, setTimePhaseComplete] = useState(false)
  const [readySignals, setReadySignals] = useState(0)
  const didFinishLoadingRef = useRef(false)
  const totalReadySignals = 4

  const finishLoading = useCallback(() => {
    if (didFinishLoadingRef.current) return
    didFinishLoadingRef.current = true
    setLoadingProgress(100)
    setIsLoaderExiting(true)
    window.setTimeout(() => {
      setShowNavigation(true)
    }, 450)
  }, [])

  const registerReady = useMemo(() => {
    return () => {
      setReadySignals((value) => Math.min(totalReadySignals, value + 1))
    }
  }, [])

  useEffect(() => {
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

  useEffect(() => {
    let animationFrame = 0
    const startTime = performance.now()
    const fastDuration = 900

    const animateProgress = (now: number) => {
      const elapsed = now - startTime

      if (elapsed <= fastDuration) {
        const fastProgress = elapsed / fastDuration
        const value = 1 + Math.pow(fastProgress, 0.82) * 89
        setLoadingProgress(Math.min(90, Math.round(value)))
        animationFrame = requestAnimationFrame(animateProgress)
        return
      }

      setTimePhaseComplete(true)
      setLoadingProgress((current) => Math.max(current, 90))
    }

    animationFrame = requestAnimationFrame(animateProgress)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    if (!timePhaseComplete) return

    const readinessProgress = 90 + Math.round((readySignals / totalReadySignals) * 10)
    setLoadingProgress(Math.max(90, Math.min(100, readinessProgress)))

    if (readySignals >= totalReadySignals) {
      finishLoading()
    }
  }, [readySignals, timePhaseComplete, totalReadySignals, finishLoading])

  useEffect(() => {
    if (!timePhaseComplete || didFinishLoadingRef.current) return

    const timeoutId = window.setTimeout(() => {
      finishLoading()
    }, 12000)

    return () => window.clearTimeout(timeoutId)
  }, [timePhaseComplete, finishLoading])

  return (
    <>
      <main className="text-foreground min-h-screen overflow-x-hidden bg-black">
        {!showNavigation && <LoadingScreen progress={loadingProgress} isExiting={isLoaderExiting} />}
        {showNavigation && <SimpleNavigation />}

        <section className="relative min-h-screen overflow-hidden mb-[4cm]">
          <ConstellationBackground>
            <MinimalHeroSection />
          </ConstellationBackground>
        </section>

        <div className="relative bg-black">
          <div className="mb-[3cm]">
            <AboutSection onReady={registerReady} />
          </div>

          <div className="mb-[4cm]">
            <SkillsSection onReady={registerReady} />
          </div>

          <div className="mb-[4cm]">
            <ProjectsSection onReady={registerReady} />
          </div>

          <ContactSection onReady={registerReady} />

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
