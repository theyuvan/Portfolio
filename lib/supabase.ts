import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github_url: string
  live_url: string
  image_gradient: string
  image_storage_path?: string
  order: number
  created_at: string
}

export interface AboutInfo {
  id: string
  bio_paragraph_1: string
  bio_paragraph_2: string
  experience_years: string
  projects_count: string
  images: string[]
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}
