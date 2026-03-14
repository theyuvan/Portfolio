'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import ScrollStack, { ScrollStackItem } from './scroll-stack'

interface Project {
  id: number
  title: string
  description: string
  image: string
  imageSrc?: string
  technologies: string[]
  links: {
    github: string
    live: string
  }
}

const projects: Project[] = [
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
        {/* Projects ScrollStack */}
        <ScrollStack
          useWindowScroll
          itemDistance={28}
          itemScale={0.015}
          itemStackDistance={18}
          stackPosition="0px"
          scaleEndPosition="8%"
          baseScale={0.93}
          rotationAmount={0}
          blurAmount={0}
          alignToFixedNavbar
          navbarGapPx={38}
          className="window-mode"
        >
          {projects.map((project) => (
            <ScrollStackItem key={project.id}>
              <div className="group w-full max-w-4xl mx-auto h-[clamp(24rem,58vh,34rem)] flex flex-col md:flex-row gap-0 glass-effect border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer rounded-3xl overflow-hidden">
                {/* Left – image panel (falls back to gradient until imageSrc is added) */}
                <div className="relative md:w-[44%] h-[42%] md:h-full overflow-hidden shrink-0">
                  {project.imageSrc ? (
                    <Image
                      src={project.imageSrc}
                      alt={`${project.title} preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 44vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: project.image }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* Link buttons over the image */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-primary text-background hover:scale-110 transition-transform"
                    >
                      <Github size={22} />
                    </a>
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-primary text-background hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={22} />
                    </a>
                  </div>
                </div>

                {/* Right – text content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-primary font-semibold uppercase tracking-widest">
                        Project {String(project.id).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 bg-primary/20" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
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
