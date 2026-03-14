'use client'

import { motion } from 'framer-motion'
import BounceCards from './bounce-cards'

const aboutImages = [
  'https://picsum.photos/560/560?grayscale&random=21',
  'https://picsum.photos/520/520?grayscale&random=22',
  'https://picsum.photos/500/500?grayscale&random=23',
]

const transformStyles = [
  'rotate(7deg) translate(-140px)',
  'rotate(0deg) translate(0px)',
  'rotate(-7deg) translate(140px)',
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
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
            About <span className="neon-text">Me</span>
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
            <BounceCards
              className="w-full max-w-[640px]"
              images={aboutImages}
              containerWidth={640}
              containerHeight={380}
              animationDelay={1.5}
              animationStagger={0.15}
              easeType="elastic.out(1, 0.5)"
              transformStyles={transformStyles}
              enableHover
            />
          </motion.div>

          {/* Right: existing text content */}
          <div>
            {/* Bio */}
            <div className="text-left mb-10">
              <motion.p
                className="text-gray-300 text-lg leading-relaxed mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                I&apos;m a full-stack developer passionate about creating innovative solutions in blockchain, web3, and artificial intelligence. With expertise in React, Next.js, and smart contract development, I bridge the gap between creative design and robust functionality.
              </motion.p>
              <motion.p
                className="text-gray-400 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                viewport={{ once: true }}
              >
                When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { value: '3+', label: 'Experience' },
                { value: '20+', label: 'Projects' },
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
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#contact"
                className="inline-block px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s Connect
              </motion.a>
            </motion.div>
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
