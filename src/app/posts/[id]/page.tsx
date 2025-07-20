import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostContent from './PostContent'
import { Post } from '@/types'

interface PostDetailPageProps {
  params: Promise<{ id: string }> // Updated to Promise type for Next.js 15
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `https://blogbackend-ecru.vercel.app/api/posts/${id}`,
      { 
        next: { 
          revalidate: 3600, // Revalidate every hour
          tags: [`post-${id}`] // Add cache tags for better invalidation
        },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Blog-NextJS/1.0',
        }
      }
    )

    if (!res.ok) {
      console.error(`Failed to fetch post ${id}: ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()
    
    // Validate response structure
    if (!data || !data.post) {
      console.error('Invalid response structure from API')
      return null
    }

    return data.post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params // Await params first
  const post = await getPost(id)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const imageUrl = post.imageUrl
    ? post.imageUrl.startsWith('http')
      ? post.imageUrl
      : `https://blogbackend-ecru.vercel.app/${post.imageUrl}`
    : undefined

  const description = post.content.substring(0, 160).replace(/[#*\[\]]/g, '') + '...'

  return {
    title: `${post.title} | ${post.category}`,
    description,
    authors: [{ name: post.author.username }],
    category: post.category,
    keywords: [post.category, 'blog', 'article', post.author.username],
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      images: imageUrl ? [{ 
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : undefined,
      authors: [post.author.username],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      section: post.category,
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
      creator: `@${post.author.username}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/posts/${id}`,
    },
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params // Await params first
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  // Enhanced JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://yourdomain.com/posts/${id}`,
    headline: post.title,
    description: post.content.substring(0, 160).replace(/[#*\[\]]/g, '') + '...',
    image: post.imageUrl
      ? post.imageUrl.startsWith('http')
        ? post.imageUrl
        : `https://blogbackend-ecru.vercel.app/${post.imageUrl}`
      : undefined,
    author: {
      '@type': 'Person',
      name: post.author.username,
      url: `https://yourdomain.com/author/${post.author._id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog Platform',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/posts/${id}`,
    },
    articleSection: post.category,
    keywords: [post.category, 'blog', 'article'],
    wordCount: post.content.split(' ').length,
    inLanguage: 'en-US',
  }

  // Reading time calculation
  const readingTime = Math.ceil(post.content.split(' ').length / 200)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Preload critical resources */}
      {post.imageUrl && (
        <link
          rel="preload"
          as="image"
          href={post.imageUrl.startsWith('http') 
            ? post.imageUrl 
            : `https://blogbackend-ecru.vercel.app/${post.imageUrl}`
          }
        />
      )}
      
      <PostContent post={post} readingTime={readingTime} />
    </>
  )
}

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  try {
    // You can fetch popular or recent post IDs here
    const res = await fetch('https://blogbackend-ecru.vercel.app/api/posts?limit=20')
    
    if (!res.ok) {
      return []
    }
    
    const data = await res.json()
    
    return data.posts?.map((post: Post) => ({
      id: post._id,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
