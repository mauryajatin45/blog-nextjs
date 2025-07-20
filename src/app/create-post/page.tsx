'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Markdown } from 'tiptap-markdown'
import TurndownService from 'turndown'
import { marked } from 'marked'
import Sidebar from '@/components/Sidebar'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    bulletListMarker: '-',
  })

  turndownService.addRule('image', {
    filter: 'img',
    replacement: (content, node: any) => {
      const alt = node.alt || ''
      const src = node.getAttribute('src') || ''
      return `![${alt}](${src})`
    }
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Markdown.configure({
        html: false,
        transformCopiedText: true,
      }),
    ],
    content: 'Start writing your post...',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFeaturedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEditorImageUpload = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleCreateNew = () => {
    setEditingPostId(null)
    setTitle('')
    setCategory('General')
    editor?.commands.setContent('Start writing your post...')
    setFeaturedImage(null)
    setImagePreview(null)
    setError('')
  }

  const loadPostForEditing = (post: any) => {
    setEditingPostId(post._id)
    setTitle(post.title)
    setCategory(post.category || 'General')
    
    const htmlContent = marked.parse(post.content)
    editor?.commands.setContent(htmlContent)
    
    if (post.imageUrl) {
      setImagePreview(post.imageUrl)
      setFeaturedImage(null)
    }
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      
      const htmlContent = editor?.getHTML() || ''
      const markdownContent = turndownService.turndown(htmlContent)

      formData.append('title', title)
      formData.append('content', markdownContent)
      formData.append('category', category)
      if (featuredImage) formData.append('image', featuredImage)

      const url = editingPostId 
        ? `https://blogbackend-ecru.vercel.app/api/posts/${editingPostId}`
        : 'https://blogbackend-ecru.vercel.app/api/posts'

      const method = editingPostId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok) {
        alert(`Post ${editingPostId ? 'updated' : 'created'} successfully`)
        if (!editingPostId) {
          router.push(`/posts/${data._id}`)
        }
      } else {
        setError(data.message || 'Failed to save post')
      }
    } catch (err) {
      setError('Server error')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <aside className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Sidebar onSelectPost={loadPostForEditing} onCreateNew={handleCreateNew} />
      </aside>

      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {editingPostId ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Home
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg">
            Saving...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Featured Image</label>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative w-full max-w-md h-64">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <EditorContent 
              editor={editor} 
              className="min-h-[400px] p-4 bg-white dark:bg-gray-800" 
            />
            <div className="flex gap-2 p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const imageUrl = await handleEditorImageUpload(file)
                    editor?.chain().focus().setImage({ src: imageUrl }).run()
                  }
                }}
                className="hidden"
                id="editor-image-upload"
              />
              <label
                htmlFor="editor-image-upload"
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded cursor-pointer transition-colors"
              >
                Insert Image
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : editingPostId ? 'Update Post' : 'Publish Post'}
          </button>
        </form>
      </main>
    </div>
  )
}
