'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BounceCardsProps {
  className?: string
  images: string[]
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  enableHover?: boolean
}

export default function BounceCards({
  className = '',
  images,
  containerWidth = 500,
  containerHeight = 300,
  animationDelay = 1.5,
  animationStagger = 0.15,
  easeType = 'elastic.out(1, 0.5)',
  transformStyles = [
    'rotate(5deg) translate(-150px)',
    'rotate(0deg) translate(-70px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(70px)',
    'rotate(-5deg) translate(150px)',
  ],
  enableHover = true,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const getScaleTransform = (transformStr: string, scale: number) => {
    const baseTransform = transformStr && transformStr !== 'none' ? transformStr : ''
    return `${baseTransform} scale(${scale})`.trim()
  }

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.bounce-card')

      cards.forEach((card, index) => {
        const baseTransform = transformStyles[index] || 'none'
        gsap.fromTo(
          card,
          { transform: getScaleTransform(baseTransform, 0) },
          {
            transform: getScaleTransform(baseTransform, 1),
            ease: easeType,
            delay: animationDelay + index * animationStagger,
            duration: 0.9,
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [animationDelay, animationStagger, easeType, transformStyles])

  const getNoRotationTransform = (transformStr: string) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr)
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
    }
    if (transformStr === 'none') {
      return 'rotate(0deg)'
    }
    return `${transformStr} rotate(0deg)`
  }

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/
    const match = baseTransform.match(translateRegex)
    if (match) {
      const currentX = parseFloat(match[1])
      const newX = currentX + offsetX
      return baseTransform.replace(translateRegex, `translate(${newX}px)`)
    }
    return baseTransform === 'none'
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`
  }

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return

    const q = gsap.utils.selector(containerRef)

    images.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`)
      gsap.killTweensOf(target)

      const baseTransform = transformStyles[i] || 'none'

      if (i === hoveredIdx) {
        const noRotationTransform = getNoRotationTransform(baseTransform)
        gsap.to(target, {
          transform: noRotationTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        })
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160
        const pushedTransform = getPushedTransform(baseTransform, offsetX)
        const distance = Math.abs(hoveredIdx - i)
        const delay = distance * 0.05

        gsap.to(target, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto',
        })
      }
    })
  }

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return

    const q = gsap.utils.selector(containerRef)

    images.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`)
      gsap.killTweensOf(target)
      const baseTransform = transformStyles[i] || 'none'
      gsap.to(target, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      })
    })
  }

  return (
    <div
      className={`bounceCardsContainer ${className}`.trim()}
      ref={containerRef}
      style={{
        width: `min(100%, ${containerWidth}px)`,
        height: `${containerHeight}px`,
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`bounce-card bounce-card-${idx}`}
          style={{
            transform: getScaleTransform(transformStyles[idx] ?? 'none', 1),
            zIndex: idx + 1,
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bounce-card-image" src={src} alt={`about-card-${idx + 1}`} />
        </div>
      ))}
    </div>
  )
}
