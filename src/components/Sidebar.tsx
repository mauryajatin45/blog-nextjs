'use client'

import React, { useState, useEffect } from 'react'

interface SidebarProps {
  onSelectPost: (post: any) => void
  onCreateNew: () => void
}

export default function Sidebar({ onSelectPost, onCreateNew }: SidebarProps) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch('https://blogbackend-ecru.vercel.app/api/posts/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full">
      <div className="mb-4">
        <button
          onClick={onCreateNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          New Post
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Your Posts</h3>
        
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post: any) => (
              <button
                key={post._id}
                onClick={() => onSelectPost(post)}
                className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                <div className="truncate font-medium">{post.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No posts yet
          </div>
        )}
      </div>
    </div>
  )
}
