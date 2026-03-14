'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

const experiences = [
  {
    title: 'Senior Blockchain Developer',
    company: 'TechStart Inc',
    location: 'Remote',
    startDate: 'Jan 2023',
    endDate: 'Present',
    description: 'Leading blockchain development initiatives and smart contract architecture',
    highlights: ['Smart Contracts', 'Web3 Integration', 'Team Leadership'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Digital Innovations',
    location: 'New York, USA',
    startDate: 'Jun 2021',
    endDate: 'Dec 2022',
    description: 'Built scalable web applications using React and Node.js',
    highlights: ['React', 'Node.js', 'AWS'],
  },
  {
    title: 'Junior Web Developer',
    company: 'StartupHub',
    location: 'San Francisco, USA',
    startDate: 'Jan 2021',
    endDate: 'May 2021',
    description: 'Developed responsive web interfaces and APIs',
    highlights: ['JavaScript', 'CSS', 'REST APIs'],
  },
]

export function ExperienceSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work <span className="neon-text">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Roles and projects I have worked on
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="space-y-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Timeline Line */}
          <motion.div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                index % 2 === 0 ? 'md:text-right' : ''
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-0 top-6 md:left-1/2 md:top-8 w-4 h-4 bg-primary rounded-full border-4 border-background md:-translate-x-2 z-10"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />

              {/* Content */}
              <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                <motion.div
                  className="glass-effect border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-primary font-semibold">{exp.company}</p>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{exp.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((tag, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 hover:border-primary/50 transition"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background Elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ marginLeft: '-200px', marginTop: '-200px' }}
      />
    </section>
  )
}
