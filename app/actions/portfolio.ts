'use server'

import { supabase, Project, AboutInfo, ContactSubmission } from '@/lib/supabase'
import nodemailer from 'nodemailer'

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

const CACHE_TTL_MS = 5 * 60 * 1000

const cacheState = {
  projects: null as CacheEntry<Project[] | null> | null,
  projectImageNames: null as CacheEntry<Set<string> | null> | null,
  aboutInfo: null as CacheEntry<AboutInfo | null> | null,
  aboutImages: null as CacheEntry<string[]> | null,
  heroImage: null as CacheEntry<string | null> | null,
  resumeFile: null as CacheEntry<string | null> | null,
}

const inFlight = {
  projects: null as Promise<Project[] | null> | null,
  projectImageNames: null as Promise<Set<string> | null> | null,
  aboutInfo: null as Promise<AboutInfo | null> | null,
  aboutImages: null as Promise<string[]> | null,
  heroImage: null as Promise<string | null> | null,
  resumeFile: null as Promise<string | null> | null,
}

function getCachedValue<T>(entry: CacheEntry<T> | null): T | null {
  if (!entry) return null
  if (Date.now() > entry.expiresAt) return null
  return entry.value
}

function setCachedValue<T>(key: keyof typeof cacheState, value: T) {
  ;(cacheState as Record<string, CacheEntry<unknown> | null>)[key] = {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  }
}

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

async function fetchProjectImageNameSet(): Promise<Set<string> | null> {
  const cached = getCachedValue(cacheState.projectImageNames)
  if (cached !== null) return cached

  if (inFlight.projectImageNames) return inFlight.projectImageNames

  inFlight.projectImageNames = (async () => {
    try {
      const { data, error } = await retry(async () => {
        return await supabase.storage
          .from('project-images')
          .list('', { limit: 200 })
      })

      if (error) {
        if (!isNetworkLookupFailure(error)) {
          console.error('Error listing project-images bucket:', error)
        }
        setCachedValue('projectImageNames', null)
        return null
      }

      const fileNameSet = new Set(
        (data || [])
          .map((item) => item.name)
          .filter(Boolean)
          .map((name) => name.toLowerCase())
      )

      setCachedValue('projectImageNames', fileNameSet)
      return fileNameSet
    } catch (error) {
      if (!isNetworkLookupFailure(error)) {
        console.error('Error listing project-images bucket:', error)
      }
      return null
    }
  })().finally(() => {
    inFlight.projectImageNames = null
  })

  return inFlight.projectImageNames
}

function buildSupabasePublicStorageUrl(
  storagePath: string,
  bucket: 'portfolio-images' | 'project-images'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl || !storagePath) return ''

  const normalizedBase = baseUrl.replace(/\/$/, '')
  const encodedPath = storagePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${normalizedBase}/storage/v1/object/public/${bucket}/${encodedPath}`
}

async function resolveProjectImageUrl(
  imageStoragePath: string | undefined,
  projectOrder: number,
  fallbackIndex: number,
  availableImageNames: Set<string> | null
): Promise<string> {
  const candidatePaths: string[] = []

  if (imageStoragePath) {
    if (/^https?:\/\//i.test(imageStoragePath)) {
      candidatePaths.push(imageStoragePath)
    } else {
      const normalizedProvidedPath = imageStoragePath.toLowerCase()
      const isOrderedProjectName = /^project\d+\.(png|jpe?g)$/i.test(normalizedProvidedPath)
      const existsInBucket = !!availableImageNames?.has(normalizedProvidedPath)

      // Ignore stale legacy names (e.g. zk-strkfi.png) and prioritize order-based naming.
      if (isOrderedProjectName || existsInBucket) {
        candidatePaths.push(imageStoragePath)
      }
    }
  }

  const normalizedOrder = Number.isFinite(projectOrder) && projectOrder > 0
    ? Math.floor(projectOrder)
    : fallbackIndex + 1

  const orderedBaseName = `project${normalizedOrder}`
  candidatePaths.push(
    `${orderedBaseName}.png`,
    `${orderedBaseName}.jpg`,
    `${orderedBaseName}.jpeg`
  )

  for (const path of candidatePaths) {
    // For auto-generated names, only accept files that actually exist in the bucket.
    if (
      availableImageNames &&
      !/^https?:\/\//i.test(path) &&
      !availableImageNames.has(path.toLowerCase())
    ) {
      continue
    }

    if (isHttpUrl(path)) return path

    const directPublicUrl = buildSupabasePublicStorageUrl(path, 'project-images')
    if (isHttpUrl(directPublicUrl)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`  ✓ Direct URL: ${directPublicUrl}`)
      }
      return directPublicUrl
    }

    let imageUrl = await getSignedImageUrl(path, 'project-images')
    if (!isHttpUrl(imageUrl)) {
      imageUrl = await getPublicImageUrl(path, 'project-images')
    }

    if (isHttpUrl(imageUrl)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`  ✓ Resolved URL: ${imageUrl}`)
      }
      return imageUrl
    }
  }

  return ''
}

// Fetch all projects from Supabase
export async function fetchProjects(): Promise<Project[] | null> {
  const cached = getCachedValue(cacheState.projects)
  if (cached !== null) return cached

  if (inFlight.projects) return inFlight.projects

  inFlight.projects = (async () => {
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

    const availableImageNames = await fetchProjectImageNameSet()

    const projectsWithImageUrls = await Promise.all(
      (data as Project[]).map(async (project, index) => {
        const imageUrl = await resolveProjectImageUrl(
          project.image_storage_path,
          project.order,
          index,
          availableImageNames
        )

        if (process.env.NODE_ENV === 'development') {
          console.log(`📸 [Project ${project.order}] ${project.title}:`, {
            original: project.image_storage_path,
            resolved: imageUrl,
            hasHttpUrl: imageUrl ? /^https?:\/\//i.test(imageUrl) : false,
          })
        }

        if (!isHttpUrl(imageUrl)) return project

        return {
          ...project,
          image_storage_path: imageUrl,
        }
      })
    )

    setCachedValue('projects', projectsWithImageUrls)
    return projectsWithImageUrls
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching projects:', error)
    }
    return null
  }
  })().finally(() => {
    inFlight.projects = null
  })

  return inFlight.projects
}

// Fetch about info from Supabase
export async function fetchAboutInfo(): Promise<AboutInfo | null> {
  const cached = getCachedValue(cacheState.aboutInfo)
  if (cached !== null) return cached

  if (inFlight.aboutInfo) return inFlight.aboutInfo

  inFlight.aboutInfo = (async () => {
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

    setCachedValue('aboutInfo', data as AboutInfo)
    return data as AboutInfo
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching about info:', error)
    }
    return null
  }
  })().finally(() => {
    inFlight.aboutInfo = null
  })

  return inFlight.aboutInfo
}

// Fetch About section gallery images from Supabase Storage
export async function fetchAboutGalleryImages(): Promise<string[]> {
  const cached = getCachedValue(cacheState.aboutImages)
  if (cached !== null) return cached

  if (inFlight.aboutImages) return inFlight.aboutImages

  inFlight.aboutImages = (async () => {
  const fileNames = ['image1.png', 'image2.png', 'image3.png']

  try {
    const urls = await Promise.all(
      fileNames.map(async (fileName) => {
        const publicUrl = await getPublicImageUrl(fileName, 'portfolio-images')
        return isHttpUrl(publicUrl) ? publicUrl : ''
      })
    )

    const result = urls.filter(isHttpUrl)
    setCachedValue('aboutImages', result)
    return result
  } catch (error) {
    if (!isNetworkLookupFailure(error)) {
      console.error('Error fetching about gallery images:', error)
    }
    return []
  }
  })().finally(() => {
    inFlight.aboutImages = null
  })

  return inFlight.aboutImages
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
  const cached = getCachedValue(cacheState.heroImage)
  if (cached !== null) return cached

  if (inFlight.heroImage) return inFlight.heroImage

  inFlight.heroImage = (async () => {
  try {
    const candidatePaths = ['yuvanraj.jpg', 'hero/yuvanraj.jpg', 'profile/yuvanraj.jpg']

    for (const path of candidatePaths) {
      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(path)

      if (isHttpUrl(data?.publicUrl)) {
        setCachedValue('heroImage', data.publicUrl)
        return data.publicUrl
      }
    }

    setCachedValue('heroImage', '/placeholder-user.jpg')
    return '/placeholder-user.jpg'
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return '/placeholder-user.jpg'
  }
  })().finally(() => {
    inFlight.heroImage = null
  })

  return inFlight.heroImage
}

// Fetch resume PDF URL from Supabase Storage with a local fallback.
export async function fetchResumeFileUrl(): Promise<string | null> {
  const cached = getCachedValue(cacheState.resumeFile)
  if (cached !== null) return cached

  if (inFlight.resumeFile) return inFlight.resumeFile

  inFlight.resumeFile = (async () => {
    try {
      const candidatePaths = [
        'Resume.pdf',
        'Yuvan_Raj_Resume.pdf',
        'resume/Yuvan_Raj_Resume.pdf',
        'documents/Yuvan_Raj_Resume.pdf',
      ]

      for (const path of candidatePaths) {
        const publicUrl = await getPublicImageUrl(path, 'portfolio-images')
        if (isHttpUrl(publicUrl)) {
          setCachedValue('resumeFile', publicUrl)
          return publicUrl
        }
      }

      // Fallback to the local public file so resume link never breaks.
      setCachedValue('resumeFile', '/Yuvan_Raj_Resume.pdf')
      return '/Yuvan_Raj_Resume.pdf'
    } catch (error) {
      if (!isNetworkLookupFailure(error)) {
        console.error('Error fetching resume file URL:', error)
      }
      return '/Yuvan_Raj_Resume.pdf'
    }
  })().finally(() => {
    inFlight.resumeFile = null
  })

  return inFlight.resumeFile
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
