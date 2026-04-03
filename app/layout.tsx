import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const sora = Sora({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-sora'
});

export const metadata: Metadata = {
  title: 'Yuvan Raj | Developer & Blockchain Enthusiast',
  description: 'Award-winning futuristic developer portfolio with interactive 3D elements, smooth animations, and cinematic experience. Blockchain, Web3, and AI expertise.',
  generator: 'Next.js',
  keywords: ['Blockchain', 'Web3', 'AI', 'Developer', 'Portfolio', 'React', 'Next.js'],
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#000000" />
        <link rel="preload" href="/assets/skills_keyboardss.spline" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/planet/scene.gltf" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/planet/scene.bin" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/planet/textures/Planet_baseColor.png" as="image" />
        <link rel="preload" href="/models/planet/textures/Clouds_baseColor.png" as="image" />
        <link rel="preload" href="/assets/sounds/click.mp3" as="audio" />
        <link rel="preload" href="/assets/sounds/magic.mp3" as="audio" />
      </head>
      <body className={`${sora.variable} font-sans antialiased dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
