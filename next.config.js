import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const toPattern = (urlString) => {
  if (!urlString) return null
  try {
    const url = new URL(urlString)
    return { hostname: url.hostname, protocol: url.protocol.replace(':', '') }
  } catch {
    return null
  }
}

const remotePatterns = [
  toPattern(process.env.NEXT_PUBLIC_SERVER_URL),
  toPattern(
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith('http')
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null
  ),
  toPattern('http://localhost:3000'),
].filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
