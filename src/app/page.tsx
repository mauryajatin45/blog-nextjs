import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Basics from '@/components/Basics'
import PostsList from '@/components/PostsList'
import { PostsResponse } from '@/types'

export const metadata: Metadata = {
  title: "Home | Jatin Maurya's Blog",
  description: 'Discover amazing blog posts and articles. Dive into a world of captivating stories, insights, and creative ideas.',
  keywords: ['blog', 'articles', 'stories', 'insights', 'creativity', 'writing', 'technology', 'programming'],
  openGraph: {
    title: 'Blog - Unleash Your Thoughts',
    description: 'Discover amazing blog posts and articles',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog - Unleash Your Thoughts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Unleash Your Thoughts',
    description: 'Discover amazing blog posts and articles',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getPosts(page = 1, search = '', sort = 'newest'): Promise<PostsResponse> {
  try {
    let url = `https://blogbackend-ecru.vercel.app/api/posts?page=${page}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (sort) url += `&sort=${encodeURIComponent(sort)}`

    const res = await fetch(url, {
      next: { 
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['posts'] // Add cache tags for better invalidation
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Blog-NextJS/1.0',
      },
      // Add timeout and retry logic
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`)
      throw new Error(`HTTP ${res.status}: Failed to fetch posts`)
    }

    const data = await res.json()
    
    // Validate response structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.posts)) {
      throw new Error('Invalid response structure from API')
    }

    return {
      posts: data.posts || [],
      page: data.page || 1,
      pages: data.pages || 1,
      total: data.total || 0
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    
    // Return empty state with proper structure
    return { 
      posts: [], 
      page: 1, 
      pages: 1, 
      total: 0 
    }
  }
}

function PostsLoading() {
  return (
    <div className="flex items-center justify-center h-96 flex-col gap-6" role="status" aria-label="Loading blog posts">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <div className="text-center">
        <span className="text-xl font-medium animate-pulse text-gray-600 dark:text-gray-400">
          Loading Amazing Content...
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Fetching the latest blog posts for you
        </p>
      </div>
      
      {/* Loading skeleton cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorFallback({ error, retry }: { error: Error; retry?: () => void }) {
  return (
    <div className="flex items-center justify-center h-96 flex-col gap-6" role="alert">
      <div className="text-red-500 dark:text-red-400 text-6xl">⚠️</div>
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We couldn&apos;t load the blog posts. This might be a temporary issue with our servers.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Error: {error.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reload Page
          </button>
          {retry && (
            <button 
              onClick={retry}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-96 flex-col gap-6">
      <div className="text-gray-400 text-6xl">📝</div>
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Posts Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          It looks like there are no blog posts available right now. Check back later for amazing content!
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

export default async function Home() {
  let initialData: PostsResponse
  let hasError = false
  let errorMessage = ''

  try {
    initialData = await getPosts()
  } catch (error) {
    console.error('Failed to load initial posts:', error)
    hasError = true
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    initialData = { posts: [], page: 1, pages: 1, total: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section aria-label="Hero section">
          <Basics />
        </section>
        
        {/* Divider */}
        <hr className="border-gray-300 dark:border-gray-700 my-8" />
        
        {/* Blog Section */}
        <section className="pb-16" aria-label="Blog posts section">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Latest{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blogs
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our collection of insightful articles, tutorials, and stories crafted by passionate writers.
            </p>
            
            {/* Stats */}
            {!hasError && initialData.total > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                {initialData.total} {initialData.total === 1 ? 'post' : 'posts'} available
              </p>
            )}
          </header>
          
          <main className="relative">
            {hasError ? (
              <ErrorFallback 
                error={new Error(errorMessage)} 
                retry={() => window.location.reload()}
              />
            ) : initialData.posts.length === 0 ? (
              <EmptyState />
            ) : (
              <Suspense fallback={<PostsLoading />}>
                <PostsList initialData={initialData} />
              </Suspense>
            )}
          </main>
        </section>
      </div>
    </div>
  )
}
