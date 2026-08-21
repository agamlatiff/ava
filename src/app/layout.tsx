import type { Metadata } from 'next'
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { OceanCanvas } from '@/components/ocean/OceanCanvas'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading-loaded',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-loaded',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Ava — Somewhere worth going.",
  description: "A private hangout planning app for two. Plan together, explore places, and save memories in an underwater world.",
  icons: {
    icon: '/favicon.ico',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* CSS gradient fallback — visible while R3F canvas loads */}
        <div className="ocean-fallback" aria-hidden="true" />

        {/* R3F 3D ocean canvas — fixed background */}
        <OceanCanvas />

        {/* DOM UI layer */}
        <div className="ui-layer">
          {children}
        </div>
      </body>
    </html>
  )
}
