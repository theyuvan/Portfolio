'use client'

import { motion } from 'framer-motion'

interface LoadingScreenProps {
  progress: number
  isExiting?: boolean
}

export function LoadingScreen({ progress, isExiting = false }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
    >
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10">
        <motion.p
          className="kicker-font text-6xl sm:text-7xl font-semibold text-white tabular-nums leading-none"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {progress}%
        </motion.p>
      </div>

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
          Cooking Something
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
