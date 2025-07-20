/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'blogbackend-ecru.vercel.app',
      'res.cloudinary.com',
      'cdn-icons-png.flaticon.com'  // Add this line
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
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',  // Add this block
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
