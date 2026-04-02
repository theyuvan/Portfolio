'use client'

import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { SKILLS } from '@/lib/skills'
import { sleep } from '@/lib/sleep'
import useMediaQuery from '@/hooks/use-media-query'
import soundEffects from '@/lib/sound-effects'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div>Loading 3D Keyboard...</div>
  ),
})

type Vector3Like = { x: number; y: number; z: number }
type SplineObject = {
  name: string
  visible: boolean
  scale: Vector3Like
  position: Vector3Like
  rotation: Vector3Like
}
type SplineEvent = { target: { name: string } }
type SplineApp = {
  addEventListener: (eventName: string, callback: (event: SplineEvent) => void) => void
  findObjectByName: (name: string) => SplineObject | null
  getAllObjects: () => SplineObject[]
  getVariable: (name: string) => unknown
  setVariable: (name: string, value: string) => void
}

const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.35, y: 0.33, z: 0.35 },
      position: { x: 20, y: 0, z: 40 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.17, y: 0.17, z: 0.17 },
      position: { x: 10, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  skills: {
    desktop: {
      scale: { x: 0.33, y: 0.33, z: 0.33 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI / 12, z: 0 },
    },
    mobile: {
      scale: { x: 0.22, y: 0.22, z: 0.22 },
      position: { x: 0, y: -6, z: 0 },
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
  },
  projects: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
    mobile: {
      scale: { x: 0.18, y: 0.18, z: 0.18 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
  contact: {
    desktop: {
      scale: { x: 0.33, y: 0.33, z: 0.33 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.24, y: 0.24, z: 0.24 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: Math.PI, y: Math.PI / 3, z: Math.PI },
    },
  },
} as const

export function SkillsSection() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isPhone = useMediaQuery('(max-width: 640px)')
  const splineContainer = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const [splineApp, setSplineApp] = useState<SplineApp | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<(typeof SKILLS)[keyof typeof SKILLS] | null>(null)
  const [isHoveringSkillKey, setIsHoveringSkillKey] = useState(false)
  const [activeSection, setActiveSection] = useState<'skills' | 'hero' | 'projects' | 'contact'>('skills')
  const [keyboardRevealed, setKeyboardRevealed] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const keyboardStates = (section: keyof typeof STATES) => {
    return STATES[section][isMobile ? 'mobile' : 'desktop']
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkill?.name === e.target.name) return
    const hoveredSkill = SKILLS[e.target.name as keyof typeof SKILLS]
    setIsHoveringSkillKey(Boolean(hoveredSkill))

    if (e.target.name === 'body' || e.target.name === 'platform') {
      setIsHoveringSkillKey(false)
      setSelectedSkill(null)
      if (splineApp.getVariable('heading') && splineApp.getVariable('desc')) {
        splineApp.setVariable('heading', '')
        splineApp.setVariable('desc', '')
      }
    } else {
      if (!selectedSkill || selectedSkill.name !== e.target.name) {
        if (hoveredSkill) setSelectedSkill(hoveredSkill)
      }
    }
  }

  useEffect(() => {
    if (!selectedSkill || !splineApp) return
    if (isPhone) {
      splineApp.setVariable('heading', selectedSkill.label)
      splineApp.setVariable('desc', '')
    } else {
      splineApp.setVariable('heading', selectedSkill.label)
      splineApp.setVariable('desc', selectedSkill.shortDescription)
    }
  }, [selectedSkill, splineApp, isPhone])

  useEffect(() => {
    if (!splineApp) return
    const textDesktopLight = splineApp.findObjectByName('text-desktop')
    const textMobileLight = splineApp.findObjectByName('text-mobile')
    if (!textDesktopLight || !textMobileLight) return
    if (activeSection !== 'skills') {
      textDesktopLight.visible = false
      textMobileLight.visible = false
      return
    }
    if (!isMobile) {
      textDesktopLight.visible = true
      textMobileLight.visible = false
    } else {
      textDesktopLight.visible = false
      textMobileLight.visible = true
    }
  }, [splineApp, isMobile, activeSection])

  useEffect(() => {
    handleSplineInteractions()
    handleGsapAnimations()
  }, [splineApp])

  useEffect(() => {
    if (!splineApp || keyboardRevealed || !isInView) return

    revealKeyCaps()
  }, [splineApp, keyboardRevealed, activeSection, isInView])

  const revealKeyCaps = async () => {
    if (!splineApp) return
    const kbd = splineApp.findObjectByName('keyboard')
    if (!kbd) return
    kbd.visible = false
    await sleep(400)
    kbd.visible = true
    setKeyboardRevealed(true)

    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        x: keyboardStates(activeSection).scale.x,
        y: keyboardStates(activeSection).scale.y,
        z: keyboardStates(activeSection).scale.z,
        duration: 1.5,
        ease: 'elastic.out(1, 0.6)',
      }
    )

    const allObjects = splineApp.getAllObjects()
    const keycaps = allObjects.filter((obj) => obj.name === 'keycap')
    await sleep(900)

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === 'keycap-mobile')
      mobileKeyCaps.forEach((keycap) => {
        keycap.visible = true
      })
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === 'keycap-desktop')
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70)
        keycap.visible = true
      })
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false
      await sleep(idx * 70)
      keycap.visible = true
      gsap.fromTo(
        keycap.position,
        { y: 100 },
        { y: 25, duration: 0.5, delay: 0.1, ease: 'bounce.out' }
      )
    })
  }

  const handleSplineInteractions = () => {
    if (!splineApp) return
    splineApp.addEventListener('keyUp', () => {
      if (!splineApp) return
      splineApp.setVariable('heading', '')
      splineApp.setVariable('desc', '')
    })

    splineApp.addEventListener('keyDown', (e) => {
      if (!splineApp) return
      const skill = SKILLS[e.target.name as keyof typeof SKILLS]
      if (skill) setSelectedSkill(skill)
      if (isPhone) {
        splineApp.setVariable('heading', skill?.label || '')
        splineApp.setVariable('desc', '')
      } else {
        splineApp.setVariable('heading', skill?.label || '')
        splineApp.setVariable('desc', skill?.shortDescription || '')
      }
      soundEffects.playClick()
    })

    splineApp.addEventListener('mouseHover', handleMouseHover)
  }

  const handleGsapAnimations = () => {
    if (!splineApp) return
    const kbd = splineApp.findObjectByName('keyboard')
    if (!kbd || !splineContainer.current) return
    gsap.set(kbd.scale, { ...keyboardStates('hero').scale })
    gsap.set(kbd.position, { ...keyboardStates('hero').position })
    gsap.timeline({
      onStart: () => setActiveSection('skills'),
    })
  }

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        width: '100%',
        height: '100vh',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={splineContainer}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isHoveringSkillKey ? 'pointer' : 'default',
        }}
      >
        <h2
          style={{
            fontSize: '4rem',
            fontWeight: 700,
            marginTop: 34,
            textAlign: 'center',
            letterSpacing: 2,
            color: '#fff',
            textShadow: '0 2px 16px rgba(0,0,0,0.2)',
          }}
        >
          Skills
        </h2>
        <p style={{ textAlign: "center", color: "#aaa" }}>
          (hint: press a key)
        </p>

        <Spline
          onLoad={(app) => setSplineApp(app as unknown as SplineApp)}
          scene="/assets/skills_keyboardss.spline"
        />
      </div>
      <span id="projects" />
    </section>
  )
}
