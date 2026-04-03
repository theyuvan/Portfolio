import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '*.inc1.devtunnels.ms',
        'zxqqm13g-3000.inc1.devtunnels.ms',
      ],
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zmbpeaakvmppskubwdwt.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  // Keep Turbopack scoped to this project (avoids parent-folder lockfile root inference)
  turbopack: {
    root: projectRoot,
  },
  webpack: (config, { isServer }) => {
    config.optimization.usedExports = true
    config.optimization.sideEffects = false

    // Optimize Three.js bundle
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: 'three',
          priority: 20,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    }

    return config
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
