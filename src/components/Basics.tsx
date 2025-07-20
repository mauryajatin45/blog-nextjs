import React from 'react'
import Link from 'next/link'

export default function Basics() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Link
        href="https://www.mauryajatin.me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer absolute top-4 right-4"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Portfolio
        </span>
      </Link>

      <div className="relative z-10 text-center px-2 py-10 sm:py-24 lg:py-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Unleash Your{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
            Thoughts
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mb-12 mx-auto max-w-2xl leading-relaxed">
          Dive into a world of captivating stories, insights, and creative ideas.
          Explore the collection of curated blog posts and fuel your curiosity.
        </p>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center space-y-4">
        <div className="arrow arrow1" />
        <div className="arrow arrow2" />
        <div className="arrow arrow3" />
        <div className="arrow arrow4" />
      </div>
    </div>
  )
}
