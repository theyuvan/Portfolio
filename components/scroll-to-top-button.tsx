'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onScroll = () => {
      const contactSection = document.getElementById('contact')
      if (!contactSection) {
        setIsVisible(false)
        return
      }

      const contactTop = contactSection.getBoundingClientRect().top
      const reachedContact = contactTop <= window.innerHeight * 0.9
      setIsVisible(reachedContact)
    }

    window.addEventListener('scroll', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-[90] w-15 h-15 rounded-2xl border border-white/35 bg-primary text-white cursor-pointer hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={scrollToTop}
        >
          <ChevronUp className="mx-auto" size={42} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
