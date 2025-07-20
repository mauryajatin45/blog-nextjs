/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'blogbackend-ecru.vercel.app',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blogbackend-ecru.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
