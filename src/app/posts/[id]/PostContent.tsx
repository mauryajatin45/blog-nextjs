'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns'
import { FiShare2, FiClock, FiCalendar, FiEdit, FiArrowLeft } from 'react-icons/fi'
import { Post } from '@/types'

interface PostContentProps {
  post: Post
  readingTime?: number
}

export default function PostContent({ post }: PostContentProps) {
  const mdComponents = {
    code({ inline, className = '', children, ...props }: any) {
      const match = /language-(\w+)/.exec(className)
      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    },
    h2: ({ node, ...props }: any) => (
      <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-purple-400" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="font-bold" {...props}>
        {children}
      </em>
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
        {...props}
      />
    ),
  }

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `${post.content.substring(0, 100)}...`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Error sharing:', error)
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Posts</span>
        </Link>

        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-blue-600 dark:prose-headings:text-blue-400 prose-a:text-cyan-600 dark:prose-a:text-cyan-400">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <FiCalendar className="w-4 h-4" />
                <time dateTime={post.createdAt}>
                  {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                </time>
              </div>
              
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <div className="flex items-center space-x-1">
                  <FiEdit className="w-4 h-4" />
                  <time dateTime={post.updatedAt}>
                    Updated {format(new Date(post.updatedAt), 'MMM dd, yyyy')}
                  </time>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <FiClock className="w-4 h-4" />
                <span>
                  {Math.ceil(post.content.split(/\s+/).length / 200)} min read
                </span>
              </div>
              
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                {post.category}
              </span>
            </div>
          </header>

          {post.imageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={
                  post.imageUrl.startsWith('http')
                    ? post.imageUrl
                    : `https://blogbackend-ecru.vercel.app/${post.imageUrl}`
                }
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}

          <div className="prose-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xl font-medium uppercase text-gray-700 dark:text-gray-300">
                  {post.author.username.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">
                  {post.author.username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Author
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FiShare2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}
