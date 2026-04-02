'use client'

import { useState } from 'react'
import {
  Download,
  FolderKanban,
  Github,
  Home,
  Linkedin,
  Mail,
  MailOpen,
  Menu,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const menuItems = [
  { label: 'HOME', href: '#home', icon: Home },
  { label: 'ABOUT', href: '#about', icon: User },
  { label: 'SKILLS', href: '#skills', icon: Sparkles },
  { label: 'PROJECTS', href: '#projects', icon: FolderKanban },
  { label: 'CONTACT', href: '#contact', icon: MailOpen },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/theyuvan', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuvan-raj', icon: Linkedin },
  { label: 'Email', href: 'mailto:r.yuvanraj05@gmail.com', icon: Mail },
  { label: 'Resume', href: '/Yuvan_Raj_Resume.pdf', icon: Download, download: true },
]

export function SimpleNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (href: string) => {
    setIsOpen(false)
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 lg:px-12 py-5 sm:py-8">
        <div className="relative max-w-[1800px] mx-auto rounded-full border border-white/10 bg-black/40 px-5 sm:px-8 py-3 sm:py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="kicker-font text-white-300/85 text-[11px] sm:text-xs hidden sm:inline whitespace-nowrap">Chennai,India</span>
            </div>

            <button
              type="button"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
            </button>
          </div>

          <a
            href=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">YR</span>
            </div>
            <span className="text-white text-base sm:text-xl font-semibold hidden sm:inline">𝚈𝚞𝚟𝚊𝚗 𝚛𝚊𝚓</span>
          </a>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ originX: 1, originY: 0 }}
              className="fixed top-[134px] sm:top-[166px] right-5 sm:right-8 lg:right-12 w-[min(92vw,28rem)] rounded-2xl border border-white/10 bg-neutral-950/98 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60 z-50"
            >
              <div className="p-8">
                <p className="text-xl font-semibold text-gray-200 mb-6">• Menu</p>

                <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleNavigate(item.href)}
                        className="group flex items-center gap-3 text-left py-3 px-3 rounded-xl hover:bg-white/5 transition"
                      >
                        <Icon size={18} className="text-gray-500 group-hover:text-white transition flex-shrink-0" />
                        <span className="text-base font-medium tracking-wide text-gray-400 group-hover:text-white transition">
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                    {socialLinks.map((link) => {
                      const Icon = link.icon
                      const isExternal = link.href.startsWith('http')
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noreferrer' : undefined}
                          download={link.download ? 'Yuvan_Raj_Resume.pdf' : undefined}
                          className="group flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-white/5 transition"
                        >
                          <Icon size={18} className="text-gray-500 group-hover:text-white transition flex-shrink-0" />
                          <span className="text-base font-medium tracking-wide text-gray-400 group-hover:text-white transition">
                            {link.label}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
