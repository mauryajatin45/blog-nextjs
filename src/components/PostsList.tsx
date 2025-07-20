'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface Post {
  _id: string
  title: string
  content: string
  category: string
  imageUrl?: string
  author: {
    _id: string
    username: string
  }
  createdAt: string
  updatedAt?: string
}

interface PostsResponse {
  posts: Post[]
  page: number
  pages: number
  total: number
}

interface PostsListProps {
  initialData: PostsResponse
}

export default function PostsList({ initialData }: PostsListProps) {
  const [posts, setPosts] = useState(initialData.posts)
  const [page, setPage] = useState(initialData.page)
  const [pages, setPages] = useState(initialData.pages)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Simple preview components with proper TypeScript (no visual changes)
  const previewComponents: Components = {
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-4 mb-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-4 mb-2" {...props}>
        {children}
      </ol>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-bold text-white" {...props}>
        {children}
      </strong>
    ),
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = `https://blogbackend-ecru.vercel.app/api/posts?page=${page}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      if (sortBy) url += `&sort=${encodeURIComponent(sortBy)}`

      const res = await fetch(url)
      const data = await res.json()
      
      setPosts(data.posts)
      setPages(data.pages)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (page !== 1 || searchQuery || sortBy !== 'newest') {
      fetchPosts()
    }
  }, [page, searchQuery, sortBy])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(inputValue)
    setPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 flex-col gap-8 text-3xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
        <span className="ml-4 text-xl animate-pulse text-gray-400">
          Loading Blogs…
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search posts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const raw = post.content || ''
          const truncated = raw.length > 100 ? raw.slice(0, 100) + '...' : raw

          return (
            <article
              key={post._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.imageUrl ? (
                <div className="relative w-full h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={!post.imageUrl.startsWith('http')}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-3 h-24 overflow-hidden">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={previewComponents}
                  >
                    {truncated}
                  </ReactMarkdown>
                </div>
                <Link
                  href={`/posts/${post._id}`}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow-md w-full justify-center transition-colors"
                >
                  Read more
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-between my-8">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 disabled:hover:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => setPage(Math.min(pages, page + 1))}
          disabled={page === pages}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 disabled:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </>
  )
}
