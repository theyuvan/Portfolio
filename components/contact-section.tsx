'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Twitter, Send } from 'lucide-react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)

      setTimeout(() => setSubmitStatus('idle'), 3000)
    }, 1000)
  }

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

  const socialLinks = [
    { icon: Mail, label: 'Email', link: 'mailto:your@email.com' },
    { icon: Linkedin, label: 'LinkedIn', link: 'https://linkedin.com' },
    { icon: Github, label: 'GitHub', link: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', link: 'https://twitter.com' },
  ]

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ marginLeft: '-200px', marginTop: '-200px' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -100, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ marginRight: '-200px', marginBottom: '-200px' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="neon-text">Connect</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-muted focus:border-primary outline-none transition glass-effect text-foreground"
                placeholder="John Doe"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Your Email
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-muted focus:border-primary outline-none transition glass-effect text-foreground"
                placeholder="john@example.com"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-muted focus:border-primary outline-none transition glass-effect text-foreground resize-none"
                placeholder="Tell me about your project..."
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: submitStatus !== 'idle' ? 1 : 0,
                y: submitStatus !== 'idle' ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg text-center font-medium ${
                submitStatus === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}
            >
              {submitStatus === 'success'
                ? '✓ Message sent successfully! I\'ll get back to you soon.'
                : 'Something went wrong. Please try again.'}
            </motion.div>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            {/* Quick Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>

              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="glass-effect border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a href="mailto:your@email.com" className="text-lg font-semibold text-primary hover:underline">
                  your@email.com
                </a>
              </div>

              <div className="glass-effect border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition">
                <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                <p className="text-lg font-semibold">Within 24 hours</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Me</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg glass-effect border border-primary/20 hover:border-primary/50 text-muted-foreground hover:text-primary transition group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                    <span className="text-sm">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
