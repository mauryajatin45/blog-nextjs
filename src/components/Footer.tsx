import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left section - Brand and copyright */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2">
              Jatin Maurya&apos;s Blog
            </h2>
            <p className="text-sm text-gray-400 mb-2">
              Unleash your thoughts through insightful articles and creative stories
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Jatin Maurya&apos;s Blog. All rights reserved.
            </p>
          </div>

          {/* Right section - Navigation and social links */}
          <div className="flex flex-col items-center space-y-4">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/create-post"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Write
              </Link>
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="https://www.mauryajatin.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Portfolio
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {/* Twitter */}
              <a
                href="https://x.com/mauryajatin45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Twitter"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="filter invert"
                />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/mauryajatin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="filter invert"
                />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/mauryajatin45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="filter invert"
                />
              </a>

              {/* Email */}
              <a
                href="mailto:mauryajatin45@gmail.com"
                aria-label="Send email"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  alt="Email"
                  width={20}
                  height={20}
                  className="filter invert"
                />
              </a>
            </div>

            {/* Buy Me a Coffee */}
            <a
              href="https://www.buymeacoffee.com/mauryajatin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support me on Buy Me a Coffee"
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Image
                src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                alt="Buy Me a Coffee"
                width={20}
                height={20}
                className="filter brightness-0 invert"
              />
              <span className="text-sm">Buy Me a Coffee</span>
            </a>
          </div>
        </div>

        {/* Bottom section - Additional copyright and tech stack */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Made in India 🇮🇳</span>
              <span>•</span>
              <span>Open Source</span>
              <span>•</span>
              <Link
                href="/privacy"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
