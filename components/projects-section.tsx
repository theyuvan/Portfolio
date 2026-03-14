'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'DeFi Protocol V2',
    description: 'A decentralized finance protocol with automated market making and yield farming capabilities',
    image: 'linear-gradient(135deg, #ffffff, #cccccc)',
    technologies: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    description: 'An intelligent chatbot powered by GPT-4 with real-time processing and context awareness',
    image: 'linear-gradient(135deg, #e5e5e5, #999999)',
    technologies: ['NextJS', 'Python', 'OpenAI API', 'TailwindCSS'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
  {
    id: 3,
    title: 'NFT Marketplace',
    description: 'A web3-enabled marketplace for buying, selling, and auctioning NFTs with advanced filtering',
    image: 'linear-gradient(135deg, #cccccc, #888888)',
    technologies: ['NextJS', 'Solidity', 'IPFS', 'PostgreSQL'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
  {
    id: 4,
    title: 'Real-time Analytics Dashboard',
    description: 'A comprehensive analytics platform with real-time data visualization and ML predictions',
    image: 'linear-gradient(135deg, #aaaaaa, #666666)',
    technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
  {
    id: 5,
    title: 'Blockchain Explorer',
    description: 'Full-featured blockchain explorer for transaction tracking and smart contract analysis',
    image: 'linear-gradient(135deg, #999999, #666666)',
    technologies: ['React', 'Web3.js', 'GraphQL', 'Tailwind'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
  {
    id: 6,
    title: 'Web3 Wallet Interface',
    description: 'User-friendly wallet interface with multi-chain support and DeFi integration',
    image: 'linear-gradient(135deg, #888888, #555555)',
    technologies: ['React', 'Web3.js', 'Ethers.js', 'Redux'],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },
]

export function ProjectsSection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ marginRight: '-200px', marginTop: '-200px' }}
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
            Featured <span className="neon-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Showcase of innovative solutions and web3 applications
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group h-full"
            >
              <motion.div
                className="relative h-full flex flex-col rounded-xl overflow-hidden glass-effect border border-primary/20 hover:border-primary/50 transition cursor-pointer"
                whileHover={{ y: -10 }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <motion.div
                    className="w-full h-full"
                    style={{ background: project.image }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300"
                  />

                  {/* Links Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300"
                  >
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-primary text-background hover:scale-110 transition"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github size={20} />
                    </motion.a>
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-primary text-background hover:scale-110 transition"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 hover:border-primary/50 transition"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Bottom Border Glow */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Projects CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects <ExternalLink size={18} />
          </motion.a>
        </motion.div>
      </div>

      {/* Background accent */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ marginLeft: '-200px', marginBottom: '-200px' }}
      />
    </section>
  )
}
