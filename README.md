# Yuvan Raj - Developer Portfolio

> A **futuristic, high-performance portfolio** showcasing Blockchain expertise, Web3 development, and AI innovation with cutting-edge 3D interactions and smooth cinematic animations.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Overview

A production-ready portfolio built with **Next.js 16** featuring:
- **Interactive 3D canvases** (Spline, Three.js, React Three Fiber)
- **Cinematic scroll animations** with Framer Motion and GSAP
- **Supabase backend** for dynamic project management
- **Dynamic project cover images** from Supabase (no code changes needed)
- **Real-time form submissions** with email notifications
- **Optimized loading experience** with progress tracking

## ✨ Key Features

- **🎬 Cinematic Loading Screen**: Percentage-based progress with custom font styling
- **🌍 Interactive 3D Elements**: Spline keyboard, rotating Earth model, particle stars
- **🎨 Smooth Animations**: GSAP-powered scroll effects, Framer Motion transitions, Lenis scrolling
- **📱 Fully Responsive**: Mobile-first design optimized for all devices
- **⚡ Performance**: Lazy loading, code splitting, optimized bundle (<300KB initial)
- **🔐 Secure Backend**: Supabase authentication, server actions, form handling
- **🖼️ Dynamic Content**: Projects, images, and resume sourced from Supabase
- **🌐 SEO Optimized**: Meta tags, Open Graph, structured data

## 🛠️ Tech Stack

| Category        | Technologies                                          |
|-----------------|-------------------------------------------------------|
| **Frontend**    | Next.js 16, React 19, TypeScript 5.7                  |
| **Styling**     | Tailwind CSS 4.2, CSS-in-JS (Framer Motion)           |
| **Animation**   | Framer Motion, GSAP, Lenis                            |
| **3D Graphics** | Spline, Three.js, React Three Fiber, @react-three/drei|
| **Backend**     | Supabase (PostgreSQL, Storage, Edge Functions)        |
| **Email**       | Nodemailer (Gmail SMTP)                               |
| **Deployment**  | Vercel (recommended), Netlify, AWS Amplify            |

## 📁 Project Structure

```
.
├── app/
│   ├── actions/portfolio.ts          # Server actions for data fetching & form submission
│   ├── layout.tsx                    # Root layout with preload hints
│   ├── page.tsx                      # Main page with lazy-loaded sections
│   ├── globals.css                   # Global styles & utility classes
│   └── api/                          # API routes (if needed)
├── components/
│   ├── loading-screen.tsx            # Percentage-based loader overlay
│   ├── simple-navigation.tsx         # Navbar with resume link
│   ├── minimal-hero-section.tsx      # Hero with profile image
│   ├── constellation-background.tsx  # SVG particle background
│   ├── about-section.tsx             # About with gallery bounce animation
│   ├── skills-section.tsx            # Spline 3D keyboard interaction
│   ├── projects-section.tsx          # Dynamic projects from Supabase
│   ├── contact-section.tsx           # Contact form with 3D Earth & stars
│   ├── scroll-to-top-button.tsx      # Smooth scroll to top
│   └── ui/                           # Reusable UI components library
├── hooks/
│   ├── use-mobile.ts                 # Mobile detection hook
│   └── use-toast.ts                  # Toast notifications
├── lib/
│   ├── supabase.ts                   # Supabase client & types
│   ├── skills.ts                     # Skills data with aliases
│   ├── utils.ts                      # Utility functions
│   └── sound-effects.ts              # Audio context manager
├── public/
│   ├── assets/                       # Images, sounds, Spline files
│   ├── models/                       # 3D GLTF models
│   ├── tech/                         # Technology icons
│   └── logo.png                      # Application favicon
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Supabase account (free tier works)
- (Optional) Gmail account for contact form

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/theyuvan/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Email (optional - for contact form)
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-app-password
   CONTACT_FORM_RECIPIENT_EMAIL=recipient@example.com
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup (Supabase)

### Tables Required

1. **`projects`** - Your portfolio projects
   ```sql
   id, title, description, technologies, github_url, live_url, 
   image_gradient, image_storage_path, order, created_at
   ```

2. **`about_info`** - About section content
   ```sql
   id, bio_paragraph_1, bio_paragraph_2, experience_years, 
   projects_count, images, updated_at
   ```

3. **`contact_submissions`** - Contact form submissions
   ```sql
   id, name, email, message, created_at, read
   ```

### Storage Buckets

- **`project-images`** (public) - Project cover images named as `project1.png`, `project2.jpeg`, etc.
- **`portfolio-images`** (public) - Gallery and hero images
- **Resume PDF** in portfolio-images bucket

## 📸 Dynamic Project Images

**No code changes needed!** Just follow this naming convention:

1. Add a new project row to the `projects` table
2. Upload cover image to Supabase `project-images` bucket as:
   - `project1.png` / `.jpg` / `.jpeg`
   - `project2.png` / `.jpg` / `.jpeg`
   - etc.

The system automatically matches images by project order.

## 🔧 Configuration

### Update Content
- **About Section**: Edit Supabase `about_info` table
- **Projects**: Manage in Supabase `projects` table
- **Skills**: Edit `lib/skills.ts` (Spline object names must match)
- **Resume**: Upload PDF to Supabase `portfolio-images` bucket
- **Social Links**: Edit `components/simple-navigation.tsx`

### Customize Styling
- **Colors**: `app/globals.css` (Tailwind utilities + CSS variables)
- **Fonts**: `app/layout.tsx` (Google Fonts configuration)
- **Animations**: Individual component Framer Motion variants

## 📦 Build & Deploy

### Build for production
```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)
```bash
vercel
```

Follow prompts, add environment variables in Vercel dashboard, done!

### Deploy to Netlify
1. Push to GitHub
2. Connect repository on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Add environment variables
5. Deploy

## 🚦 Performance

- **Initial Load**: <2s (optimized images, preload hints)
- **Lighthouse Score**: 90+ (on Vercel)
- **Bundle Size**: ~280KB (gzipped)
- **Web Vitals**: Optimized for Core Web Vitals

### Optimizations
- Server-side caching (5-minute TTL)
- Dynamic imports for heavy sections
- Image optimization with Next.js
- Preload critical assets (3D models, fonts)
- CSS splitting per route

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| Mobile Safari | Latest | ✅ Full |
| Chrome Mobile | Latest | ✅ Full |

## 📝 Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional (for contact form)
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASSWORD=your_app_specific_password
CONTACT_FORM_RECIPIENT_EMAIL=recipient@example.com

# Server Actions
NODE_ENV=production
```

> **Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your account password.

## 🤝 Contributing

Improvements welcome! Feel free to:
- Report bugs via issues
- Suggest features
- Submit pull requests

## 📄 License

MIT License - You're free to use this portfolio for your own projects.

## 👤 Author

**Yuvan Raj** - Blockchain Developer & AI Innovator
- 🌐 [Portfolio](https://yuvanraj.dev)
- 💼 [LinkedIn](https://linkedin.com/in/yuvan-raj)
- 🐙 [GitHub](https://github.com/theyuvan)
- 📧 [Email](mailto:r.yuvanraj05@gmail.com)

---

**Built with ❤️ using Next.js 16 + Supabase**

