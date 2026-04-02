'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ScrollStack, { ScrollStackItem } from './scroll-stack'
import { fetchProjects } from '@/app/actions/portfolio'
import { useIsMobile } from '@/hooks/use-mobile'

interface Project {
  id: string
  title: string
  description: string
  brief_description?: string | null
  image_gradient: string
  image_storage_path?: string
  technologies: string[]
  github_url: string
  live_url: string
}

export function ProjectsSection() {
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [failedProjectImages, setFailedProjectImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true)
        const data = await fetchProjects()
        if (data) {
          setProjects(data)
          setError(null)
        } else {
          setError('Failed to load projects from Supabase')
        }
      } catch (err) {
        console.error('Error loading projects:', err)
        setError('Failed to load projects from Supabase')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <section id="projects" className="py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-500">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">No projects found</div>
          </div>
        ) : (
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
            {projects.map((project, index) => (
              <ScrollStackItem key={project.id}>
                <div className="group w-full max-w-4xl mx-auto min-h-[26rem] md:h-[clamp(24rem,58vh,34rem)] flex flex-col md:flex-row gap-0 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer rounded-3xl overflow-hidden relative bg-black">
                  {/* Left – image panel (falls back to gradient until image_storage_path is added) */}
                  <div className="relative md:w-[44%] h-[42%] md:h-full overflow-hidden shrink-0">
                    {project.image_storage_path && !failedProjectImages[project.id] ? (
                      <Image
                        src={project.image_storage_path}
                        alt={`${project.title} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 44vw"
                        onError={() =>
                          setFailedProjectImages((prev) => ({
                            ...prev,
                            [project.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: project.image_gradient }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Right – text content */}
                  <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col overflow-hidden">
                    {/* Title and Description */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-primary font-semibold uppercase tracking-widest">
                          Project {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px flex-1 bg-primary/20" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-3">
                        {isMobile ? project.description : project.brief_description || project.description}
                      </p>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(isMobile ? project.technologies.slice(0, 4) : project.technologies).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {isMobile && project.technologies.length > 4 && (
                        <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* GitHub & Live Links */}
                    <div className="flex gap-3 mt-auto flex-wrap sm:flex-nowrap w-full">
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary hover:bg-primary/20 hover:border-primary/50 transition-colors"
                      >
                        <Github size={18} />
                        <span className="text-sm font-semibold">GitHub</span>
                      </a>
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary hover:bg-primary/20 hover:border-primary/50 transition-colors"
                      >
                        <ExternalLink size={18} />
                        <span className="text-sm font-semibold">Live</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}
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
