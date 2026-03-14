'use client'

import { motion } from 'framer-motion'

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

        {/* Bio */}
        <div className="max-w-3xl mx-auto text-center mb-16">
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
          className="flex flex-wrap justify-center gap-4 mb-12"
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
          className="text-center mt-12"
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
