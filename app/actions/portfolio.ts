'use server'

import { supabase, Project, AboutInfo, ContactSubmission } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Fetch all projects from Supabase
export async function fetchProjects(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching projects:', error)
      return null
    }

    return data as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return null
  }
}

// Fetch about info from Supabase
export async function fetchAboutInfo(): Promise<AboutInfo | null> {
  try {
    const { data, error } = await supabase
      .from('about_info')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching about info:', error)
      return null
    }

    return data as AboutInfo
  } catch (error) {
    console.error('Error fetching about info:', error)
    return null
  }
}

// Get public Supabase Storage URL for an image
export async function getPublicImageUrl(storagePath: string): Promise<string> {
  if (!storagePath) return ''

  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(storagePath)

  return data?.publicUrl || ''
}

// Fetch hero profile image from Supabase Storage
export async function fetchHeroImage(): Promise<string | null> {
  try {
    // Fetch the profile image from Supabase Storage
    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl('yuvan.png')

    return data?.publicUrl || null
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return null
  }
}

// Submit contact form
export async function submitContactForm(
  name: string,
  email: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
          read: false,
        },
      ])

    if (dbError) {
      console.error('Error saving contact submission:', dbError)
      return { success: false, error: 'Failed to save submission' }
    }

    // 2. Send email via Resend
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'support@portfolio.com'

    try {
      await resend.emails.send({
        from: 'contact@portfolio.com',
        to: recipientEmail,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Continue even if email fails - the submission was saved
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
