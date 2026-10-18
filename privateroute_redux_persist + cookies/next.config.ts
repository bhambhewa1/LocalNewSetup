import type { NextConfig } from 'next'
import type { RemotePattern } from 'next/dist/shared/lib/image-config'

const basePath = process.env.NEXT_PUBLIC_BASEPATH ?? ''
const IMAGE_PATHNAME = process.env.NEXT_PUBLIC_MEDIA_PATHNAME ?? ''

// Get the env variable and trim spaces if any
const backendMediaURL = process.env.NEXT_PUBLIC_BACKEND_MEDIA?.trim()

let protocol: 'http' | 'https' = 'https'
let hostname: string = ''
let remotePatterns: RemotePattern[] = []

if (backendMediaURL) {
  try {
    const parsed = new URL(backendMediaURL)
    const rawProtocol = parsed.protocol.replace(':', '')
    protocol = rawProtocol === 'https' ? 'https' : 'http'
    hostname = parsed.hostname

    remotePatterns = [
      {
        protocol,
        hostname,
        pathname: IMAGE_PATHNAME
      }
    ]
  } catch (err) {
    console.warn(`Invalid NEXT_PUBLIC_BACKEND_MEDIA: ${backendMediaURL}`)
  }
} else {
  console.warn('NEXT_PUBLIC_BACKEND_MEDIA is empty or undefined — allowing unrestricted external image sources.')
}

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,

  images: {
    remotePatterns
  },

  redirects: async () => []
}

export default nextConfig

// import type { NextConfig } from 'next'

// const basePath = ''

// // Use a consistently named env var
// const backendMediaURL = process.env.NEXT_PUBLIC_BACKEND_MEDIA ?? 'https://realestateapi.solutionstree.org'

// let protocol: 'http' | 'https' = 'https'
// let hostname = ''

// // Only parse if non-empty, with a fallback on error
// if (backendMediaURL) {
//   try {
//     const parsed = new URL(backendMediaURL)
//     const raw = parsed.protocol.replace(':', '')
//     protocol = raw === 'https' ? 'https' : 'http'
//     hostname = parsed.hostname
//   } catch (err) {
//     console.warn(`Invalid NEXT_PUBLIC_BACKEND_MEDIA: ${backendMediaURL}`)
//   }
// }

// console.log('protocol', protocol, 'hostname', hostname)

// const nextConfig: NextConfig = {
//   basePath,
//   assetPrefix: basePath,

//   images: {
//     remotePatterns: hostname
//       ? [
//           {
//             protocol,
//             hostname,
//             pathname: '/uploads/media/**'
//           }
//         ]
//       : []
//   },

//   redirects: async () => []
// }

// export default nextConfig
