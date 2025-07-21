import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Better font loading performance
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Blog',
    default: 'Blog - Unleash Your Thoughts',
  },
  description: 'Explore insightful articles, inspiring stories, and expert perspectives on technology, creativity, and personal growth. Stay informed and inspired with our curated blog content.',
  keywords: ['blog', 'articles', 'stories', 'insights', 'creativity', 'writing', 'technology', 'programming'],
  authors: [{ name: 'Jatin Maurya', url: 'https://www.mauryajatin.me' }],
  creator: 'Jatin Maurya',
  publisher: 'Blog Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Blog - Unleash Your Thoughts',
    title: 'Blog - Unleash Your Thoughts',
    description: 'Explore insightful articles, inspiring stories, and expert perspectives on technology, creativity, and personal growth.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog - Unleash Your Thoughts',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@mauryajatin45',
    title: 'Blog - Unleash Your Thoughts',
    description: 'Explore insightful articles, inspiring stories, and expert perspectives on technology, creativity, and personal growth.',
    images: ['/og-image.jpg'],
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
  verification: {
    // Add your verification IDs here
    // google: 'google-site-verification-id',
    // yandex: 'yandex-verification-id',
    // yahoo: 'yahoo-site-verification-id',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
        <link rel="icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col min-h-screen">
            <main className="flex-grow relative">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>

        {/* Analytics Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Schema.org structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Blog - Unleash Your Thoughts",
              "description": "Dive into a world of captivating stories, insights, and creative ideas.",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "author": {
                "@type": "Person",
                "name": "Jatin Maurya",
                "url": "https://www.mauryajatin.me"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Blog Platform"
              }
            }),
          }}
        />
      </body>
    </html>
  )
}
