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

// Collect all URLs that may serve images
// const imageHostURLs = [
//   process.env.NEXT_PUBLIC_SERVER_URL,
//   process.env.VERCEL_PROJECT_PRODUCTION_URL
//     ? `https://${process.env.NEXT_PUBLIC_SERVER_URL}`
//     : `https://process.env.VERCEL_PROJECT_PRODUCTION_URL`,
// ].filter(Boolean)
//
// // Deduplicate by hostname
// const remotePatterns = Array.from(
//   new Map(
//     imageHostURLs.map((item) => {
//       const url = new URL(item)
//       return [url.hostname, { hostname: url.hostname, protocol: url.protocol.replace(':', '') }]
//     })
//   ).values()
// )

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'matteo-dirollo.com',
  },
  {
    protocol: 'https',
    hostname: 'dev.matteo-dirollo.com',
  },
  {
    protocol: 'https',
    hostname: '*.public.blob.vercel-storage.com',
  },
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '3000',
  },
],
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
