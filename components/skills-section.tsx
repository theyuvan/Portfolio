'use client'

import { motion } from 'framer-motion'
import { BallCanvas } from './ball-canvas'
import { technologies } from '@/lib/constants'

export function SkillsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="skills" className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ marginRight: '-200px' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="neon-text">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expertise in modern technologies and frameworks
          </p>
        </motion.div>

        {/* Skills Grid with 3D Balls */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 justify-items-center gap-x-6 gap-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {technologies.map((technology, index) => {
            const remainder = technologies.length % 6
            const firstItemInLastRow = index === technologies.length - remainder
            const centerLastRowOffset = remainder === 4 && firstItemInLastRow ? 'lg:col-start-2' : ''

            return (
              <motion.div
                key={technology.name}
                variants={itemVariants}
                className={`w-32 h-32 ${centerLastRowOffset}`}
              >
                <BallCanvas icon={technology.icon} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Background accent */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ marginLeft: '-200px', marginBottom: '-200px' }}
        />
      </div>
    </section>
  )
}
