import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function getPosts() {
  try {
    const res = await fetch('https://blogbackend-ecru.vercel.app/api/posts?limit=1000')
    if (!res.ok) {
      console.error('Failed to fetch posts for sitemap')
      return []
    }
    const data = await res.json()
    return data.posts || []
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

function generateSiteMap(posts: Array<{ _id: string, updatedAt?: string }>) {
  const staticPages = [
    '',
    'login',
    'create-post',
  ]

  const pages = staticPages.map((page) => {
    return `
      <url>
        <loc>${SITE_URL}/${page}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `
  }).join('')

  const postPages = posts.map((post) => {
    const lastMod = post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()
    return `
      <url>
        <loc>${SITE_URL}/posts/${post._id}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages}
    ${postPages}
  </urlset>`
}

export async function GET() {
  const posts = await getPosts()
  const sitemap = generateSiteMap(posts)

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=59',
    },
  })
}
