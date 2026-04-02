/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {},
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
