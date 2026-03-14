'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-32 h-32">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle rotating ring */}
        <motion.div
          className="absolute inset-4 border-2 border-transparent border-b-primary border-l-primary rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center glowing circle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 bg-primary rounded-full blur-md opacity-50" />
          <div className="absolute w-8 h-8 bg-primary rounded-full" />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div
        className="absolute bottom-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-muted-foreground tracking-widest uppercase">
          Loading Experience
        </p>
        <motion.div
          className="flex justify-center gap-1 mt-2"
          initial="initial"
          animate="animate"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-primary rounded-full"
              variants={{
                initial: { opacity: 0.3 },
                animate: { opacity: 1 },
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ width: '200px', height: '200px', left: '50%', top: '50%', marginLeft: '-100px', marginTop: '-100px' }}
      />
    </motion.div>
  )
}
