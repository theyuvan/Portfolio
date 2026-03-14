# Cinematic Developer Portfolio

An award-winning developer portfolio featuring cinematic scroll animations and 3D UI effects. Built with Next.js 16, React 19, Framer Motion, Three.js, and GSAP.

## Features

- **🎬 Cinematic Animations**: Smooth scroll animations powered by GSAP and Framer Motion
- **🎨 3D Visual Effects**: Interactive 3D particle background using Three.js and React Three Fiber
- **✨ Glassmorphism Design**: Modern glass card effects with neon green accent colors
- **📱 Fully Responsive**: Mobile-optimized design with smooth performance
- **⚡ Performance Optimized**: Lazy loading, dynamic imports, and efficient rendering
- **🎯 Magnetic Interactions**: Interactive buttons that follow cursor movement
- **🔄 Smooth Scrolling**: Lenis library for cinematic scroll experience

## Tech Stack

- **Frontend Framework**: Next.js 16 + React 19
- **Animation**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Styling**: Tailwind CSS 4.2
- **Smooth Scrolling**: Lenis
- **Type Safety**: TypeScript 5.7

## Project Structure

```
components/
  ├── 3d/
  │   └── AnimatedBackground.tsx    # 3D particle background
  ├── ui/
  │   ├── GlassCard.tsx             # Reusable glass card component
  │   └── MagneticButton.tsx        # Interactive magnetic button
  ├── providers/
  │   └── ScrollProvider.tsx        # Lenis scroll provider
  ├── sections/
  │   ├── Hero.tsx                  # Hero section with 3D background
  │   ├── About.tsx                 # About section with stats
  │   ├── Experience.tsx            # Professional experience
  │   ├── Projects.tsx              # Featured projects grid
  │   ├── Skills.tsx                # Technical skills with progress bars
  │   └── Contact.tsx               # Contact section with socials
  ├── Navigation.tsx                # Fixed navigation with mobile menu
  └── LoadingScreen.tsx             # Initial loading animation
hooks/
  ├── useGSAPScroll.ts             # GSAP scroll animation hook
  ├── useIsMobile.ts               # Mobile detection hook
app/
  ├── layout.tsx                    # Root layout with providers
  ├── page.tsx                      # Main portfolio page
  └── globals.css                   # Global styles and design tokens
```

## Color Scheme

- **Background**: `#0b0b0b` (Deep Black)
- **Foreground**: `#f5f5f5` (Off White)
- **Primary (Accent)**: `#7CFF00` (Neon Green)
- **Secondary**: `#2a2a2a` (Dark Gray)
- **Accent Colors**: Cyan (`#00d4ff`), Pink (`#ff006e`)

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Customization

### Content
- Edit section components in `components/sections/` to update content
- Modify company names, project titles, and skills in the respective sections
- Update contact links and social media URLs in `components/sections/Contact.tsx`

### Styling
- Edit design tokens in `app/globals.css` to change colors
- Modify Tailwind configuration in `tailwind.config.ts`
- Update animation timings in individual components

### Adding New Sections
1. Create a new component in `components/sections/`
2. Import and add it to `app/page.tsx`
3. Use the same animation patterns for consistency

## Performance Optimization

- **3D Background**: Dynamically imported and only rendered on desktop
- **Code Splitting**: Next.js automatic code splitting for sections
- **Image Optimization**: Automatic image optimization by Next.js
- **Bundle Optimization**: Three.js optimized in separate chunk

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

- Use `useGSAPScroll` hook for scroll-triggered animations
- Leverage `GlassCard` component for consistent card styling
- Use `MagneticButton` for interactive button effects
- Customize animations via Framer Motion variants

## Deployment

Deploy to Vercel with a single click:

```bash
vercel deploy
```

Or use GitHub integration for automatic deployments on push.

## License

MIT License - Feel free to use this portfolio template for your own projects.

---

Built with ❤️ using v0 + Vercel
