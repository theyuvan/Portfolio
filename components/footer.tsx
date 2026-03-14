'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Twitter, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Mail, link: 'mailto:your@email.com', label: 'Email' },
    { icon: Linkedin, link: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, link: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, link: 'https://twitter.com', label: 'Twitter' },
  ]

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <footer className="relative overflow-hidden border-t border-primary/10">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <motion.div
              className="flex flex-col justify-between"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-bold neon-text mb-2">YR</h3>
                <p className="text-muted-foreground text-sm">
                  Building innovative solutions in blockchain, web3, and AI.
                </p>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold">Quick Links</h4>
              <div className="flex flex-wrap gap-4">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition"
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold">Follow</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg glass-effect border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/50 transition"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-1">
              Made with <Heart size={16} className="text-primary animate-pulse" /> by Yuvan Raj
            </div>
            <p>© {currentYear} All rights reserved.</p>
            <div className="flex gap-6">
              <motion.a href="#" className="hover:text-primary transition" whileHover={{ x: 2 }}>
                Privacy Policy
              </motion.a>
              <motion.a href="#" className="hover:text-primary transition" whileHover={{ x: 2 }}>
                Terms of Service
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll to Top Button */}
          <motion.div
            className="flex justify-center pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 rounded-lg glass-effect border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/50 transition text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Top ↑
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Background */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ marginLeft: '-200px', marginBottom: '-200px' }}
      />
    </footer>
  )
}
