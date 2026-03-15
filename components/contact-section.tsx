'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { ContactEarthCanvas } from './contact-earth-canvas'
import { ContactStarsCanvas } from './contact-stars-canvas'

export function ContactSection() {
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission for now.
    setTimeout(() => {
      alert("Thank you for your message. I'll get back to you soon.")
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden bg-black">
      <ContactStarsCanvas />

      <div className='absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(40,46,96,0.12)_0%,rgba(2,2,5,0.72)_55%,rgba(0,0,0,0.94)_100%)]' />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        style={{ marginRight: '-180px', marginTop: '-180px' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-stretch gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-[44%] glass-effect border border-primary/40 rounded-2xl shadow-[0_0_35px_rgba(126,104,255,0.4)] p-8"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-gray-300/80 mb-2">Get in touch</p>
            <h3 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Contact<span className="text-primary">.</span>
            </h3>

            <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-6"
          >
            <label className="flex flex-col">
              <span className="text-white font-semibold text-3d mb-3">
                Your Name
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="What is your good name?"
                className="bg-black/35 py-4 px-5 placeholder:text-gray-400 rounded-xl outline-none border border-primary/20 focus:border-primary text-white transition"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-semibold mb-3">Your email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="What is your email address?"
                className="bg-black/35 py-4 px-5 placeholder:text-gray-400 rounded-xl outline-none border border-primary/20 focus:border-primary text-white transition"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-semibold mb-3">Your Message</span>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="What do you want to say?"
                className="bg-black/35 py-4 px-5 placeholder:text-gray-400 rounded-xl outline-none border border-primary/20 focus:border-primary text-white resize-none transition"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary py-3 px-8 rounded-xl w-fit text-primary-foreground font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-[56%] h-[430px] md:h-[560px]"
          >
            <ContactEarthCanvas isMobile={isMobile} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
