'use client'

import { useLayoutEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'

// ── ScrollStackItem ────────────────────────────────────────────────
interface ScrollStackItemProps {
  children: React.ReactNode
  itemClassName?: string
}

export function ScrollStackItem({ children, itemClassName = '' }: ScrollStackItemProps) {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
  )
}

// ── ScrollStack ────────────────────────────────────────────────────
interface ScrollStackProps {
  children: React.ReactNode
  className?: string
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string | number
  scaleEndPosition?: string | number
  baseScale?: number
  scaleDuration?: number
  rotationAmount?: number
  blurAmount?: number
  /** When true, hooks into the existing window scroll instead of a local Lenis instance */
  useWindowScroll?: boolean
  /** Align pin start to bottom of fixed navbar + gap */
  alignToFixedNavbar?: boolean
  navbarGapPx?: number
  onStackComplete?: () => void
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  alignToFixedNavbar = false,
  navbarGapPx = 38,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const cardBaseOffsetsRef = useRef<number[]>([])
  const endBaseOffsetRef = useRef(0)
  const lastTransformsRef = useRef<Map<number, { translateY: number; scale: number; rotation: number; blur: number }>>(new Map())
  const isUpdatingRef = useRef(false)

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight
      }
      return parseFloat(value as string)
    },
    []
  )

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0
      if (scrollTop > end) return 1
      return (scrollTop - start) / (end - start)
    },
    []
  )

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      }
    }
    const scroller = scrollerRef.current!
    return {
      scrollTop: scroller.scrollTop,
      containerHeight: scroller.clientHeight,
    }
  }, [useWindowScroll])

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        return element.getBoundingClientRect().top + window.scrollY
      }
      return element.offsetTop
    },
    [useWindowScroll]
  )

  const measureLayout = useCallback(() => {
    cardBaseOffsetsRef.current = cardsRef.current.map((card) => {
      const prevTransform = card.style.transform
      const prevFilter = card.style.filter
      card.style.transform = 'translate3d(0,0,0)'
      card.style.filter = ''
      const top = getElementOffset(card)
      card.style.transform = prevTransform
      card.style.filter = prevFilter
      return top
    })

    const endEl = useWindowScroll
      ? document.querySelector<HTMLElement>('.scroll-stack-end')
      : scrollerRef.current?.querySelector<HTMLElement>('.scroll-stack-end')

    endBaseOffsetRef.current = endEl ? getElementOffset(endEl) : 0
  }, [getElementOffset, useWindowScroll])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return
    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    let stackPositionPx = parsePercentage(stackPosition, containerHeight)
    if (useWindowScroll && alignToFixedNavbar) {
      const nav = document.querySelector('nav.fixed') as HTMLElement | null
      const navBottom = nav?.getBoundingClientRect().bottom ?? 0
      stackPositionPx = navBottom + navbarGapPx
    }
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)
    const endElementTop = endBaseOffsetRef.current

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = cardBaseOffsetsRef.current[i] ?? 0
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = triggerStart
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      // Clamp target scale so deeper cards never become larger than 1.
      const targetScale = Math.min(1, Math.max(0.7, baseScale + i * itemScale))
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jTop = cardBaseOffsetsRef.current[j] ?? 0
          const jTriggerStart = jTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) topCardIndex = j
        }
        if (i < topCardIndex) {
          blur = Math.max(0, (topCardIndex - i) * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const next = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const last = lastTransformsRef.current.get(i)
      const changed =
        !last ||
        Math.abs(last.translateY - next.translateY) > 0.1 ||
        Math.abs(last.scale - next.scale) > 0.001 ||
        Math.abs(last.rotation - next.rotation) > 0.1 ||
        Math.abs(last.blur - next.blur) > 0.1

      if (changed) {
        card.style.transform = `translate3d(0,${next.translateY}px,0) scale(${next.scale}) rotate(${next.rotation}deg)`
        card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : ''
        lastTransformsRef.current.set(i, next)
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll,
    alignToFixedNavbar, navbarGapPx,
    onStackComplete, calculateProgress, parsePercentage,
    getScrollData,
  ])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const selector = useWindowScroll
      ? document.querySelectorAll<HTMLElement>('.scroll-stack-card')
      : scroller.querySelectorAll<HTMLElement>('.scroll-stack-card')

    cardsRef.current = Array.from(selector)
    const transformsCache = lastTransformsRef.current

    cardsRef.current.forEach((card, i) => {
      if (i < cardsRef.current.length - 1) card.style.marginBottom = `${itemDistance}px`
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.perspective = '1000px'
    })

    measureLayout()

    if (useWindowScroll) {
      // ── Window mode: RAF-driven updates for smooth Lenis interpolation ──
      const onResize = () => {
        measureLayout()
        updateCardTransforms()
      }
      window.addEventListener('resize', onResize)

      const rafLoop = () => {
        updateCardTransforms()
        animationFrameRef.current = requestAnimationFrame(rafLoop)
      }
      animationFrameRef.current = requestAnimationFrame(rafLoop)

      return () => {
        window.removeEventListener('resize', onResize)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        stackCompletedRef.current = false
        cardsRef.current = []
        cardBaseOffsetsRef.current = []
        endBaseOffsetRef.current = 0
        transformsCache.clear()
        isUpdatingRef.current = false
      }
    } else {
      // ── Local Lenis in the container ──
      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector<HTMLElement>('.scroll-stack-inner') ?? undefined,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      })

      lenis.on('scroll', () => updateCardTransforms())

      const raf = (time: number) => {
        lenis.raf(time)
        updateCardTransforms()
        animationFrameRef.current = requestAnimationFrame(raf)
      }
      animationFrameRef.current = requestAnimationFrame(raf)
      lenisRef.current = lenis

      const onResize = () => {
        measureLayout()
        updateCardTransforms()
      }
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        lenis.destroy()
        lenisRef.current = null
        stackCompletedRef.current = false
        cardsRef.current = []
        cardBaseOffsetsRef.current = []
        endBaseOffsetRef.current = 0
        transformsCache.clear()
        isUpdatingRef.current = false
      }
    }
  }, [
    itemDistance, itemScale, itemStackDistance, stackPosition,
    scaleEndPosition, baseScale, scaleDuration, rotationAmount,
    blurAmount, useWindowScroll, onStackComplete, measureLayout, updateCardTransforms,
  ])

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}
