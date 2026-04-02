'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { ContactEarthCanvas } from './contact-earth-canvas'
import { ContactStarsCanvas } from './contact-stars-canvas'
import { submitContactForm } from '@/app/actions/portfolio'
import soundEffects from '@/lib/sound-effects'

export function ContactSection() {
  const isMobile = useIsMobile()
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Mute sound effects when form is in focus
  useEffect(() => {
    const handleFocus = () => {
      soundEffects.mute()
    }
    const handleBlur = () => {
      soundEffects.unmute()
    }

    const form = formRef.current
    if (form) {
      form.addEventListener('focusin', handleFocus)
      form.addEventListener('focusout', handleBlur)
      return () => {
        form.removeEventListener('focusin', handleFocus)
        form.removeEventListener('focusout', handleBlur)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitContactForm(
        formData.name,
        formData.email,
        formData.message
      )

      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage("Thank you for your message. I'll get back to you soon.")
        setFormData({ name: '', email: '', message: '' })
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setSubmitMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden bg-black">
      <ContactStarsCanvas />

      <div className='absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(40,46,96,0.12)_0%,rgba(2,2,5,0.72)_55%,rgba(0,0,0,0.94)_100%)]' />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-[#7E68FF]/10 rounded-full blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        style={{ marginRight: '-180px', marginTop: '-180px' }}
      />

      <div className="relative z-10 px-0 sm:px-3 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 w-full lg:w-[48%] glass-effect border border-[#7E68FF]/40 rounded-2xl shadow-[0_0_35px_rgba(126,104,255,0.4)] p-5 sm:p-6"
          >
            <p className="kicker-font text-sm text-gray-300/80 mb-2">Get in touch</p>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              Contact<span className="text-[#7E68FF]">.</span>
            </h3>

            <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4"
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
                disabled={isSubmitting}
                placeholder="What is your good name?"
                className="bg-black/35 py-3.5 sm:py-4 px-4 sm:px-5 placeholder:text-gray-400 rounded-xl outline-none border border-[#7E68FF]/20 focus:border-[#7E68FF] text-white transition disabled:opacity-50"
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
                disabled={isSubmitting}
                placeholder="What is your email address?"
                className="bg-black/35 py-3.5 sm:py-4 px-4 sm:px-5 placeholder:text-gray-400 rounded-xl outline-none border border-[#7E68FF]/20 focus:border-[#7E68FF] text-white transition disabled:opacity-50"
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
                disabled={isSubmitting}
                placeholder="What do you want to say?"
                className="bg-black/35 py-3.5 sm:py-4 px-4 sm:px-5 placeholder:text-gray-400 rounded-xl outline-none border border-[#7E68FF]/20 focus:border-[#7E68FF] text-white resize-none transition disabled:opacity-50"
              />
            </label>

            {submitStatus === 'success' && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
                {submitMessage}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#7E68FF] py-3 px-8 rounded-xl w-full sm:w-fit text-white font-bold disabled:opacity-50"
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
            className="order-2 w-full lg:w-[50%] h-[320px] sm:h-[420px] md:h-[560px]"
          >
            <ContactEarthCanvas isMobile={isMobile} />
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  )
}
