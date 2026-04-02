'use server'

import { supabase, Project, AboutInfo, ContactSubmission } from '@/lib/supabase'
import nodemailer from 'nodemailer'

// Validate Gmail credentials
function hasValidGmailCredentials(user: string | undefined, password: string | undefined): boolean {
  return !!(user && password && user.includes('@gmail.com'))
}

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false
  return /^https?:\/\//i.test(value)
}

function isNetworkLookupFailure(error: unknown): boolean {
  const details = (error as { details?: string })?.details || ''
  const message = (error as { message?: string })?.message || ''
  return details.includes('ENOTFOUND') || message.includes('fetch failed')
}

async function retry<T>(fn: () => Promise<T>, attempts = 3, waitMs = 350): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, waitMs))
      }
    }
  }
  throw lastError
}

// Fetch all projects from Supabase
export async function fetchProjects(): Promise<Project[] | null> {
  try {
    const { data, error } = await retry(async () => {
      return await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true })
    })

    if (error) {
      if (!isNetworkLookupFailure(error)) {
        console.error('Error fetching projects:', error)
      }
      return null
    }

    if (!data) return []

    const projectsWithImageUrls = await Promise.all(
      (data as Project[]).map(async (project) => {
        if (!project.image_storage_path) return project
        if (isHttpUrl(project.image_storage_path)) return project

        // project-images bucket is private, so resolve a signed URL for frontend rendering.
        let imageUrl = await getSignedImageUrl(project.image_storage_path, 'project-images')

        if (!isHttpUrl(imageUrl)) {
          imageUrl = await getPublicImageUrl(project.image_storage_path, 'project-images')
        }

        if (!isHttpUrl(imageUrl)) return project

        return {
          ...project,
          image_storage_path: imageUrl,
        }
      })
    )

    return projectsWithImageUrls
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching projects:', error)
    }
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
      if (!isNetworkLookupFailure(error)) {
        console.error('Error fetching about info:', error)
      }
      return null
    }

    return data as AboutInfo
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching about info:', error)
    }
    return null
  }
}

// Fetch About section gallery images from Supabase Storage
export async function fetchAboutGalleryImages(): Promise<string[]> {
  const fileNames = ['image1.png', 'image2.png', 'image3.png']

  try {
    const urls = await Promise.all(
      fileNames.map(async (fileName) => {
        const publicUrl = await getPublicImageUrl(fileName, 'portfolio-images')
        if (!isHttpUrl(publicUrl)) return ''

        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 2500)
          const response = await fetch(publicUrl, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          return response.ok ? publicUrl : ''
        } catch {
          return ''
        }
      })
    )

    return urls.filter(isHttpUrl)
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching about gallery images:', error)
    }
    return []
  }
}

// Get public Supabase Storage URL for an image
export async function getPublicImageUrl(
  storagePath: string,
  bucket: 'portfolio-images' | 'project-images' = 'portfolio-images'
): Promise<string> {
  if (!storagePath) return ''

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath)

  return data?.publicUrl || ''
}

// Get signed Supabase Storage URL (required for private buckets)
export async function getSignedImageUrl(
  storagePath: string,
  bucket: 'portfolio-images' | 'project-images' = 'project-images',
  expiresInSeconds = 60 * 60 * 24 * 7
): Promise<string> {
  if (!storagePath) return ''

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds)

  if (error) return ''

  return data?.signedUrl || ''
}

// Fetch hero profile image from Supabase Storage
export async function fetchHeroImage(): Promise<string | null> {
  try {
    const candidatePaths = ['yuvanraj.jpg', 'hero/yuvanraj.jpg', 'profile/yuvanraj.jpg']

    for (const path of candidatePaths) {
      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(path)

      if (isHttpUrl(data?.publicUrl)) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 2500)
          const response = await fetch(data.publicUrl, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          if (response.ok) {
            return data.publicUrl
          }
        } catch {
          // Ignore and continue to fallback.
        }
      }
    }

    return '/placeholder-user.jpg'
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return '/placeholder-user.jpg'
  }
}

// Submit contact form
export async function submitContactForm(
  name: string,
  email: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return { success: false, error: 'All fields are required.' }
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          created_at: new Date().toISOString(),
          read: false,
        },
      ])

    if (dbError) {
      console.error('Error saving contact submission:', dbError)
      return { success: false, error: 'Failed to save submission' }
    }

    // 2. Send email via Gmail using Nodemailer
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_PASSWORD
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'r.yuvanraj05@gmail.com'

    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
      console.log('📧 Gmail Config:', {
        user: gmailUser,
        hasPassword: !!gmailPassword,
        recipient: recipientEmail,
      })
    }

    if (!hasValidGmailCredentials(gmailUser, gmailPassword)) {
      console.error('❌ Gmail credentials missing or invalid')
      return {
        success: true, // Form saved successfully
        error: 'Message saved! But email is not configured. Add GMAIL_USER and GMAIL_PASSWORD to .env.local',
      }
    }

    try {
      // Create Nodemailer transporter for Gmail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      })

      // Send email
      const mailOptions = {
        from: gmailUser,
        to: recipientEmail,
        replyTo: trimmedEmail,
        subject: `New Contact Form Submission from ${trimmedName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>
        `,
      }

      const emailResponse = await transporter.sendMail(mailOptions)

      if (isDev) {
        console.log('✅ Email sent:', emailResponse.messageId)
      }
    } catch (emailError) {
      const errorMsg = emailError instanceof Error ? emailError.message : String(emailError)
      console.error('❌ Email sending failed:', errorMsg)

      // Return success for form save, but indicate email failed
      return {
        success: true, // Form is saved, this is what matters
        error: `Message saved! But email failed: ${errorMsg}. Check Gmail app password and 2FA.`,
      }
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
